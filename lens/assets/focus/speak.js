/* =============================================================================
   speak.js — the reply, read out.

   A question asked out loud is answered out loud. The words are the model's;
   the sound is not. Anthropic ships no voice — the Messages API, Batches,
   Files, Models and Managed Agents are the whole of that surface — so what
   reads a reply here is the speech engine already installed on this machine,
   chosen out of what speechSynthesis.getVoices() actually offers. This file
   owns the choosing, the cutting and the queue. It owns nothing on screen:
   every data- attribute belongs to focus.js, and this only says when.

   The reply is cut at each sentence as that sentence closes, and each piece is
   spoken on its own. Three reasons, in order: one long utterance is the shape
   Chrome is known to drop half way through with no event to say so; a sentence
   is where an engine's prosody wants to breathe; and a cut is the only place
   a reply can be stopped without stopping mid-word. So speaking starts on the
   first sentence rather than on the last — the answer arrives a token at a
   time and is read at the beat it is written.

   Nothing is downloaded and nothing leaves the machine. A voice whose
   localService is false synthesises on somebody's server, which means the
   reply is sent there; those are not offered at all, and a machine with
   nothing else says so rather than being handed a control that does nothing.
   Should a voice ever be reachable through the proxy that already holds every
   credential, run() is the one place an utterance is made and level() the one
   place the row reads a level — which is the whole of the preparation.

   Three rules keep it honest:
   · the row of bars steps on the words the engine reports speaking, and where
     it reports none, on those words' own weight — and the line under the row
     says which of the two it is.
   · every cancel is the same cancel. One counter owns the queue, the utterance
     in flight and the level, exactly as waveGen owns the bars in focus.js.
   · a turn that starts always finishes. on.done is called once and only once,
     whether the reply was read to the end, cut short, refused, or never
     spoken at all.
   ============================================================================= */
(function () {
  'use strict';

  const synth = window.speechSynthesis;
  const Utt = window.SpeechSynthesisUtterance;
  /* no engine here at all: the same shape, doing nothing, so no call site has
     to ask whether this file loaded */
  if (!synth || !Utt) {
    window.Speak = {
      usable: () => false, ready: () => Promise.resolve(false), info: () => null,
      prime() {}, start: () => 0, push() {}, end() {}, stop() {},
      speaking: () => false, level: () => 0,
    };
    return;
  }

  const RATE  = 0.95;  /* considered, not sluggish — and the one of the three every engine honours */
  const PITCH = 1;     /* left alone: ignored on Edge, clamped in Safari, coerced in Chrome        */
  const VOL   = 1;     /* how loud belongs to the machine, not to the page                         */
  const CPS   = 19;    /* characters a second at rate 1, measured: 1344 of them in 69.7s           */
  const CAP   = 160;   /* ≈8.9s at RATE, well short of the cut Chrome has never fixed              */
  const GAP   = 120;   /* the breath between two sentences                                         */
  const WAIT  = 1200;  /* how long a voice list is given to arrive before it is taken as it stands */
  const DECAY = 260;   /* how long a spoken word keeps the row up                                  */
  const PROBE = 400;   /* and how long an engine is given to report its first word                 */

  /* ── which voice ────────────────────────────────────────────────────────
     There is no reliable identifier for a voice anywhere. Safari hands back
     the real Apple one and Chrome sets voiceURI to the name; and the name is
     localised to the browser's own interface language, so a Chrome running in
     Russian on this machine calls Samantha Саманта and offers nothing else to
     match on. Every voice is therefore tried three ways — identifier, English
     name, the localised name as measured — and where nothing scores at all
     the choice is handed back to the engine rather than guessed at. */

  const TIER = [
    [/\.premium\./i,        60],   /* Apple's own identifier, which is what Safari returns */
    [/\(\s*premium\s*\)/i,  60],   /* and the same voice as Chrome names it                */
    [/\.enhanced\./i,       45],
    [/\(\s*enhanced\s*\)/i, 45],
    [/\b(neural|natural)\b/i, 40], /* Microsoft's word for the same tier                   */
  ];

  /* ranked for one job: reading two or three sentences of analysis aloud */
  const NAMED = [
    { id: 'compact.en-US.Samantha', at: ['samantha', 'саманта'], w: 30 },  /* the neutral default   */
    { id: 'compact.en-GB.Daniel',   at: ['daniel', 'дэниэл'],    w: 26 },  /* the driest register   */
    { id: 'compact.en-IE.Moira',    at: ['moira', 'мойра'],      w: 22 },  /* the warmest           */
    { id: 'compact.en-ZA.Tessa',    at: ['tessa', 'тесса'],      w: 18 },
    { id: 'compact.en-AU.Karen',    at: ['karen', 'карен'],      w: 14 },  /* bright, for an analyst */
    { id: 'compact.en-IN.Rishi',    at: ['rishi', 'риши'],       w: 10 },
  ];

  /* the sound effects and the 1980s formant synths, which are voices in the
     list and are not voices anybody would be read an answer by */
  const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|fred|good news|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|фред|кэти|ральф|шепот)\b/i;
  const REFUSED = /com\.apple\.eloquence\.|com\.apple\.ttsbundle\.siri_/i;

  let voice = null, chosen = false, settled = false, listed = null, wedged = false;

  const bare = (s) => String(s || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();

  function pick() {
    chosen = true;
    voice = null;
    let all = [];
    try { all = synth.getVoices() || []; } catch (e) { return; }
    const want = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    let best = null, score = 0;
    for (const v of all) {
      /* a voice that is not on this device synthesises the reply on somebody
         else's, which is a thing this page does not do */
      if (!v || v.localService === false) continue;
      if (!String(v.lang || '').toLowerCase().startsWith(want)) continue;
      const uri = String(v.voiceURI || ''), name = bare(v.name);
      if (REFUSED.test(uri) || NOVELTY.test(name)) continue;
      let s = 1;
      for (const [re, w] of TIER) if (re.test(uri) || re.test(String(v.name))) s += w;
      for (const n of NAMED) {
        if (uri.indexOf(n.id) >= 0 || n.at.indexOf(name) >= 0) { s += n.w; break; }
      }
      if (s > score) { score = s; best = v; }
    }
    /* nothing scored: the first English voice on the list could as easily be
       Шепот as Саманта, and the platform's own default is the better guess */
    if (score > 1) voice = best;
  }

  /* Both ways of being told, and a clock. Chrome fills the list over an IPC
     and the first read is always empty; Safari has it before anyone asks, so
     voiceschanged may never fire at all and a wait on it alone never ends. */
  /* the choice is made on the first turn that needs one, and again after the
     list has changed under it — never on the way past, because a list that
     changes twice would otherwise leave the choice made and unmade */
  function chooseVoice() {
    if (!chosen) pick();
    return voice;
  }

  function ready() {
    if (listed) return listed;
    listed = new Promise((done) => {
      const settle = () => { settled = true; chooseVoice(); done(usable()); };
      if (synth.getVoices().length) { settle(); return; }
      let fired = false;
      const once = () => { if (fired) return; fired = true; settle(); };
      try { synth.addEventListener('voiceschanged', once); } catch (e) {}
      synth.onvoiceschanged = once;
      setTimeout(once, WAIT);
    });
    /* a voice downloaded later, or the speech service restarted: the next turn
       picks again. A turn already reading keeps the voice it started in. */
    try {
      synth.addEventListener('voiceschanged', () => { if (!cur) chosen = false; });
    } catch (e) {}
    return listed;
  }

  const usable = () => !wedged && settled && !!synth.getVoices().length;
  const info = () => {
    const v = chooseVoice();
    return v ? { name: v.name, lang: v.lang, local: true } : null;
  };

  /* One gesture is all iOS Safari ever asks for, and it asks silently: with no
     gesture it drops the utterance on an early return and fires nothing. This
     is that gesture, spent at the moment a finger is actually down. */
  let primed = false;
  function prime() {
    if (primed || cur) return;
    primed = true;
    try {
      const u = new Utt(' ');
      u.volume = 0;
      synth.speak(u);
      /* and nothing else. Cancelling this utterance in the same task is what
         spends the gesture on Chrome's macOS engine as well: the controller is
         left holding one that never started, and from then on every speak() is
         accepted and none of them is ever spoken — no start, no boundary, no
         end, no error, and the damage outlives the page. Measured here: eight
         silent loads in twelve with the cancel, none in nine without it. The
         blank runs to its own end in under half a second and the reply queues
         behind it. */
      synth.resume();
    } catch (e) { /* nothing to prime, or nothing that would take it */ }
  }

  /* ── the turn ───────────────────────────────────────────────────────────
     One counter owns everything a turn holds. start() bumps it, so a reply
     that has been overtaken cannot push another word, cannot paint the row
     and cannot put the state down after the reply that replaced it. */

  let gen = 0, on = null, buf = '', queue = [], closed = false;
  let cur = null, watch = null, waiting = false, said = false, mute = 0;

  function start(cb) {
    stop();
    if (!usable()) return 0;
    gen++;
    on = cb || {};
    chooseVoice();
    buf = ''; queue = []; closed = false; said = false; mute = 0;
    env = 0; onsets = null; at = 0; began = 0;
    return gen;
  }

  /* the whole turn, put down in one place, whatever put it down */
  function finish(why) {
    const g = gen, cb = on;
    gen++;
    clearTimeout(watch); watch = null;
    if (cur) { cur.onstart = cur.onend = cur.onerror = cur.onboundary = null; cur = null; }
    buf = ''; queue = []; closed = false; waiting = false; on = null; env = 0; onsets = null;
    try { synth.cancel(); synth.resume(); } catch (e) {}   /* paused survives a cancel */
    if (cb && cb.done) cb.done(g, why);
  }

  function stop() { if (on) finish('stopped'); }

  /* ── the cut ────────────────────────────────────────────────────────────
     A full stop at the very end of the buffer is not the end of a sentence,
     it is a token nobody has finished writing yet — which is what the
     lookahead is for. The tail leaves through end(), and nowhere else. */

  const SPLIT = /([.!?…]["'”’)\]]*)\s+(?=\S)/;
  const ABBR = /(?:^|\s)(?:mr|mrs|ms|dr|prof|st|no|vs|fig|approx|e\.g|i\.e|[A-Z])\.$/;

  function flush(text) {
    const t = String(text || '').trim();
    if (!t) return;
    queue.push(t);
    pump();
  }

  function cut() {
    for (;;) {
      const m = SPLIT.exec(buf);
      if (!m) break;
      const head = buf.slice(0, m.index + m[1].length);
      /* "approx. 40 metres" is one sentence, and so is "M. Al-Harbi" */
      if (ABBR.test(head)) {
        const rest = buf.slice(head.length).replace(/^\s+/, '');
        if (!rest) break;
        const m2 = SPLIT.exec(rest);
        if (!m2) break;
        flush(head + ' ' + rest.slice(0, m2.index + m2[1].length));
        buf = rest.slice(m2.index + m2[0].length);
        continue;
      }
      flush(head);
      buf = buf.slice(m.index + m[0].length);
    }
    /* a sentence longer than the engine will carry is cut at a comma, or at a
       space — never inside a word */
    while (buf.length > CAP) {
      let k = -1;
      for (const c of [', ', '; ', ': ', ' — ', ' – ']) k = Math.max(k, buf.lastIndexOf(c, CAP));
      if (k < 40) k = buf.lastIndexOf(' ', CAP);
      if (k < 40) k = CAP;
      flush(buf.slice(0, k));
      buf = buf.slice(k).replace(/^\s+/, '');
    }
  }

  function push(g, t) {
    if (g !== gen || !on) return;
    buf += t;
    cut();
  }

  function end(g) {
    if (g !== gen || !on) return;
    closed = true;
    if (buf.trim()) flush(buf);
    buf = '';
    pump();
  }

  /* ── the queue ──────────────────────────────────────────────────────────
     One utterance at a time, and never one spoken in the same task as the
     cancel before it: the second of those is the one browsers have been
     reported to swallow, and a hop is the whole of the fix. */

  function pump() {
    if (waiting || cur || !on) return;
    waiting = true;
    setTimeout(run, said ? GAP : 0);
  }

  const estimate = (t) => Math.max(360, (t.length / (CPS * RATE)) * 1000);
  const guard = (t) => Math.max(2500, estimate(t) * 2.5);

  function run() {
    waiting = false;
    if (!on) return;
    if (!queue.length) { if (closed) finish('end'); return; }

    const g = gen, text = queue.shift();
    /* a used utterance does not play again, and one nobody holds can be
       collected part way through and stop reporting anything */
    const u = cur = new Utt(text);
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || document.documentElement.lang || 'en-US';
    u.rate = RATE; u.pitch = PITCH; u.volume = VOL;

    if (on.line) on.line(g, text);

    /* what the engine itself has said about this utterance — the one thing on
       this path that is not the page's own timer talking */
    let heard = false, opened = false, live = false;
    const open = () => {
      if (opened || g !== gen) return;
      opened = true;
      began = performance.now(); last = began;
      if (!said) { said = true; if (on.speak) on.speak(g); }
      /* an engine that has not reported a word by now is not going to: the row
         moves on the words' own weight from here, and the line says so */
      setTimeout(() => {
        if (g !== gen || heard || onsets) return;
        project(text);
        if (on.words) on.words(g, false);
      }, PROBE);
    };

    u.onstart = () => { live = true; mute = 0; open(); arm(text, () => live); };
    u.onboundary = (e) => {
      if (g !== gen) return;
      live = true; mute = 0;
      open();
      if (!heard) { heard = true; onsets = null; if (on.words) on.words(g, true); }
      word(e && e.charLength);
      arm(text, () => live);
    };
    u.onend = () => { if (g !== gen) return; clearTimeout(watch); cur = null; pump(); };
    u.onerror = (e) => {
      if (g !== gen) return;
      clearTimeout(watch);
      const why = e && e.error;
      /* our own cancel already put the turn down */
      if (why === 'interrupted' || why === 'canceled') return;
      cur = null;
      if (why === 'not-allowed') { finish('blocked'); return; }
      pump();                                  /* one chunk lost, not the reply */
    };

    /* and a resume with it, always: a queue Chrome has left paused — a tab that
       was in the background, a cancel that landed on the wrong side of one —
       takes the utterance and never speaks it, with no event either way. On a
       queue that is not paused this does nothing at all. */
    try { synth.speak(u); synth.resume(); } catch (e) { cur = null; finish('wedged'); return; }
    /* some engines never fire start at all; the row may not wait on it — but
       the row moving is this page's own doing, and is never evidence */
    setTimeout(open, 900);
    arm(text, () => live);
  }

  /* Speech that stops without saying so is the failure this cannot see coming:
     no end, no error, and on one long-standing Chrome bug no further speech at
     all. Every utterance is therefore timed, and the clock is reset by every
     word that arrives. Two silent ones in a row and the engine is gone.

     Silent means the engine said nothing about this utterance — not that the
     row stood still. The row is started by a timer where an engine reports no
     words, so reading liveness off the row's own state (said, began, onsets)
     asked the page whether the page was talking, and it always answered yes:
     an engine that took every utterance and spoke none of them was counted as
     two good readings and the reply was reported finished. `alive` is that
     utterance's own onstart or onboundary, and nothing else. */
  function arm(text, alive) {
    clearTimeout(watch);
    watch = setTimeout(() => {
      if (!on) return;
      const dumb = !alive || !alive();
      try { synth.cancel(); synth.resume(); } catch (e) {}
      cur = null;
      if (dumb && ++mute >= 2) { wedged = true; finish('wedged'); return; }
      pump();
    }, guard(text));
  }

  /* ── the level ──────────────────────────────────────────────────────────
     speechSynthesis hands back no audio and no meter, so there is nothing to
     read a loudness off. What the row is given instead is the word the engine
     says it is speaking — its arrival, and its length — decaying between one
     word and the next. Where the engine reports no words, the same envelope
     runs on onsets projected from the chunk's own text, and the line under the
     row says the row is timed. A wave that stood still while somebody was
     talking would be the one lie this screen tells; a wave that ran on a timer
     while claiming to be a reading would be the other. */

  let env = 0, last = 0, began = 0, onsets = null, weight = null, at = 0;

  function word(n) {
    const len = Math.min(Math.max(n || 4, 2), 14);
    env = Math.min(1, 0.42 + len / 18);
    last = performance.now();
  }

  function project(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const span = estimate(text);
    const total = words.reduce((a, w) => a + w.length + 1, 0) || 1;
    onsets = []; weight = [];
    let run = 0;
    for (const w of words) {
      onsets.push((run / total) * span);
      weight.push(w.length);
      run += w.length + 1;
    }
    at = 0;
  }

  function level() {
    if (!cur || !began) return 0;
    const now = performance.now();
    if (onsets) {
      while (at < onsets.length && now - began >= onsets[at]) { word(weight[at]); at++; }
    }
    /* elapsedTime is milliseconds in one engine and seconds in the spec, so it
       is never read: the clock here is this page's own */
    env = Math.max(0, env - (now - last) / DECAY);
    last = now;
    return env;
  }

  window.Speak = {
    usable, ready, info, prime,

    /* one turn, read out as it is written. `start` returns the turn's number,
       or 0 where nothing can speak; every call after it carries that number,
       and a stale one does nothing at all. `on.speak(g)` fires as the first
       word is actually spoken, `on.line(g,text)` on each sentence as it
       begins, `on.words(g,live)` once, saying whether the row is reading the
       engine's words or timing them, and `on.done(g,why)` exactly once —
       'end', 'stopped', 'blocked' or 'wedged'. */
    start, push, end, stop,

    speaking: () => !!on,        /* this file's own state: synth.speaking is not it */
    level,
  };
})();
