/* =============================================================================
   orb.js — Axi, the orb: voice everywhere. And the agent console drawer.

   The orb floats over every page (it lives in #orbLayer, which is fixed and
   pointer‑transparent; its children take the pointer back). It listens through
   the real microphone and recogniser where the browser has them and plays the
   same choreography from a scripted transcript where it does not — the states
   are the same either way: idle → listening → hearing → thinking → speaking →
   idle. One counter (`gen`) owns every timer, stream, recogniser and utterance
   a turn holds, so a turn that is overtaken cannot paint, speak or answer after
   the one that replaced it.

   The console drawer (#console) is the agent's own log: one row per
   `console:log` event {tool, args, ms}, newest at the bottom.

   Public: Orb.init() · Orb.open({listen, text, page}) · Orb.close() ·
   Orb.say(text) · Orb.listen(page) · Orb.stop() ·
   Orb.console.toggle(force) / open() / close() / log(entry) / clear()
   ============================================================================= */
window.Orb = (() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
  const ORB_W = 128, ORB_H = 175, BUBBLE_W = 320, EDGE = 8, BAR_COUNT = 24;
  /* where the frames put it: Home (368,528) · Library (512,448) · fullscreen (410,851) */
  const POS = { chat: { x: 368, y: 528 }, library: { x: 512, y: 448 }, full: { x: 410, y: 851 } };
  const QUESTION = { chat: 'What should we do about it?', library: 'How many frames have a capture issue?', other: 'Show me the global KPIs' };
  /* the bars' silhouette at rest, 24 heights in px; the level scales them */
  const SILHOUETTE = [6, 8, 11, 14, 16, 18, 17, 14, 12, 16, 18, 18, 15, 12, 10, 14, 18, 17, 15, 12, 10, 8, 6, 5];
  const RATE = 1.02, PITCH = 1, CPS = 19.5;
  const WATCHDOG = 1200;   /* no speech for this long → the scripted transcript */
  const HUSH = 1500;       /* silence after speech → the question is finished    */

  /* the eyes: the two paths of assets/figma/orb-favicon-dark.svg with its blue glow,
     each moved to where the Home frame actually has it (measured: centres at (53,69)
     and (88,70) of the ball; the shipped SVG stacks them at (40,37) and (68,58)) */
  const EYE = 'M46.648 11.3315C53.541 14.2704 55.2054 27.2882 50.3656 40.4075C45.5257 53.5269 36.0144 61.7798 29.1213 58.8409C22.2283 55.9019 20.5639 42.8841 25.4037 29.7648C30.2436 16.6454 39.755 8.39254 46.648 11.3315Z';
  const FACE_SVG = `<svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <defs>
      <filter id="orbEyeGlow" x="-40" y="-40" width="208" height="208" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/>
        <feGaussianBlur in="d" stdDeviation="8" result="b"/>
        <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.298039 0 0 0 0 0.705882 0 0 0 0 1 0 0 0 0.5 0" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <clipPath id="orbClip"><circle cx="64" cy="64" r="64"/></clipPath>
    </defs>
    <g clip-path="url(#orbClip)" filter="url(#orbEyeGlow)" fill="#fdfdfd">
      <path d="${EYE}" transform="translate(15.4 33.6)"/>
      <path d="${EYE}" transform="translate(50.6 34.4)"/>
    </g>
  </svg>`;

  let root, ball, face, micBtn, xBtn, spkBtn, wave, bars = [], bubble = null, bubbleP = null, bubbleLabel = null;
  let state = 'idle', isOpen = false, dragged = false, pos = { x: POS.chat.x, y: POS.chat.y };
  let mute = false, gen = 0, timers = [], raf = 0, micIn = null, rec = null, utter = null, speakGuard = 0;
  let heardText = '', bubbleTimer = 0;
  const A = () => window.App;

  /* ---- timers that belong to a turn ------------------------------------------ */
  const tm = (fn, ms, g) => { const id = setTimeout(() => { if (g === gen) fn(); }, ms); timers.push(id); return id; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const sleep = (ms, g) => new Promise(r => tm(r, ms, g));

  /* ---- position ------------------------------------------------------------- */
  function defaultPos() {
    const S = A().state;
    if (S.full) return POS.full;
    return S.page === 'library' ? POS.library : POS.chat;
  }
  function clampPos(p) {
    return { x: Math.round(A().clamp(p.x, EDGE, Math.max(EDGE, innerWidth - ORB_W - EDGE))), y: Math.round(A().clamp(p.y, EDGE, Math.max(EDGE, innerHeight - ORB_H - EDGE))) };
  }
  function place() {
    if (!dragged) pos = defaultPos();
    pos = clampPos(pos);
    root.style.left = pos.x + 'px'; root.style.top = pos.y + 'px';
    sideBubble();
  }
  function sideBubble() {
    if (!bubble) return;
    const right = pos.x + ORB_W + 12 + BUBBLE_W + EDGE > innerWidth;
    bubble.dataset.side = right ? 'left' : 'right';
    bubble.style.maxHeight = Math.max(120, innerHeight - pos.y - 16) + 'px';
  }

  /* ---- the DOM --------------------------------------------------------------- */
  function build() {
    const { h, icon } = A();
    face = h('div', { class: 'orb-face', 'aria-hidden': 'true', html: FACE_SVG });
    ball = h('button', { class: 'orb-ball', type: 'button', 'aria-label': 'Axi — press Space to talk, arrow keys to move', 'aria-pressed': 'false', title: 'Axi' }, face);
    micBtn = h('button', { class: 'btn-round btn36 orb-btn orb-mic', type: 'button', 'aria-label': 'Talk to Axi', 'aria-pressed': 'false', title: 'Talk to Axi', onclick: toggleListen }, icon('microphone', 20));
    xBtn = h('button', { class: 'btn-round btn36 orb-btn orb-x', type: 'button', 'aria-label': 'Close Axi', title: 'Close', onclick: () => close() }, icon('x', 20));
    spkBtn = h('button', { class: 'btn-round btn36 orb-btn orb-spk', type: 'button', 'aria-label': 'Mute Axi', 'aria-pressed': 'false', title: 'Mute', onclick: toggleMute }, icon('speaker-high', 20));
    bars = SILHOUETTE.map(px => h('i', { style: { height: px + 'px' } }));
    wave = h('div', { class: 'orb-wave', 'aria-hidden': 'true' }, ...bars);
    root = h('div', { class: 'orb', id: 'orb', role: 'group', 'aria-label': 'Axi', dataset: { state: 'idle' }, hidden: true }, ball, micBtn, xBtn, spkBtn, wave);
    $('#orbLayer').append(root);
    wireDrag();
    ball.addEventListener('click', e => { if (ball._swallow) { ball._swallow = false; return; } toggleListen(); });
    ball.addEventListener('keydown', e => {
      const step = e.shiftKey ? 32 : 8;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!d) return;
      e.preventDefault();
      dragged = true; pos = clampPos({ x: pos.x + d[0], y: pos.y + d[1] });
      A().store.set('orbPos', pos); place();
    });
    applyMute();
  }

  /* dragging: pointer events on the ball only, a 4px threshold so a click is a click */
  function wireDrag() {
    let start = null, moved = false;
    ball.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }; moved = false;
      try { ball.setPointerCapture(e.pointerId); } catch {}
    });
    ball.addEventListener('pointermove', e => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) { moved = true; root.classList.add('is-drag'); }
      pos = clampPos({ x: start.px + dx, y: start.py + dy });
      root.style.left = pos.x + 'px'; root.style.top = pos.y + 'px';
      sideBubble();
    });
    const up = e => {
      if (!start) return;
      if (moved) { dragged = true; A().store.set('orbPos', pos); ball._swallow = true; }
      root.classList.remove('is-drag');
      start = null; moved = false;
      try { ball.releasePointerCapture(e.pointerId); } catch {}
    };
    ball.addEventListener('pointerup', up);
    ball.addEventListener('pointercancel', up);
  }

  /* ---- state ------------------------------------------------------------------- */
  function setState(s) {
    state = s;
    root.dataset.state = s;
    const listening = s === 'listening' || s === 'hearing';
    micBtn.setAttribute('aria-pressed', String(listening));
    micBtn.setAttribute('aria-label', listening ? 'Stop listening' : 'Talk to Axi');
    ball.setAttribute('aria-pressed', String(listening));
    const composerMic = $('#btnMic'); if (composerMic) composerMic.setAttribute('aria-pressed', String(listening));
    const libAsk = $('#libAsk'); if (libAsk) libAsk.setAttribute('aria-pressed', String(listening));
  }

  /* ---- the bubble --------------------------------------------------------------- */
  function showBubble(label, text, { thinking = false, dismiss = false } = {}) {
    const { h, btn } = A();
    clearTimeout(bubbleTimer); bubbleTimer = 0;
    if (!bubble) {
      bubbleLabel = h('span', { class: 'orb-bubble-label' });
      bubbleP = h('p');
      bubble = h('div', { class: 'orb-bubble', role: 'status' }, h('div', { class: 'orb-bubble-head' }, bubbleLabel), bubbleP);
      root.append(bubble);
    }
    bubble.classList.remove('is-out');
    bubble.setAttribute('aria-live', label === 'Heard' && !thinking ? 'off' : 'polite');
    bubbleLabel.textContent = label;
    bubbleP.textContent = text || '';
    const head = bubble.firstChild;
    const oldX = head.querySelector('.btn28'); if (oldX) oldX.remove();
    if (dismiss) head.append(btn('x', 'Dismiss', { size: 28, onclick: () => hideBubble() }));
    const dots = bubble.querySelector('.thinking'); if (dots) dots.remove();
    if (thinking) bubble.append(h('span', { class: 'thinking', 'aria-label': 'Thinking' }, h('i'), h('i'), h('i')));
    sideBubble();
  }
  function hideBubble(delay = 0) {
    if (!bubble) return;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      if (!bubble) return;
      const b = bubble; bubble = bubbleP = bubbleLabel = null;
      b.classList.add('is-out');
      setTimeout(() => b.remove(), REDUCED.matches ? 0 : 200);
    }, delay);
  }

  /* ---- the waveform: real levels where a microphone is allowed, a rhythm where not --- */
  const hist = new Float32Array(BAR_COUNT);
  function paint() { for (let i = 0; i < bars.length; i++) bars[i].style.transform = `scaleY(${(0.18 + hist[i] * 1.35).toFixed(3)})`; }
  function push(level) { hist.copyWithin(0, 1); hist[hist.length - 1] = Math.max(0, Math.min(1, level)); paint(); }
  function runWave(g) {
    hist.fill(0);
    if (REDUCED.matches) { for (let i = 0; i < hist.length; i++) hist[i] = .35; paint(); return; }
    let last = 0, live = false;
    const tick = now => {
      if (g !== gen) return;
      raf = requestAnimationFrame(tick);
      if (now - last < 48) return;
      last = now;
      if (live) return;                       /* the microphone paints from here */
      const t = now / 1000;
      const syllable = Math.abs(Math.sin(t * 6.3)) * (0.55 + 0.45 * Math.sin(t * 1.9 + 1));
      push(0.12 + 0.62 * syllable + Math.random() * 0.08);
    };
    raf = requestAnimationFrame(tick);
    openMic(g).then(ok => { if (ok && g === gen) live = true; });
  }
  async function openMic(g) {
    const md = navigator.mediaDevices, Ctx = window.AudioContext || window.webkitAudioContext;
    if (!md || !md.getUserMedia || !Ctx) return false;
    let stream;
    try { stream = await md.getUserMedia({ audio: true }); } catch { return false; }
    if (g !== gen) { stream.getTracks().forEach(t => t.stop()); return false; }
    const ctx = new Ctx(), an = ctx.createAnalyser();
    an.fftSize = 512; an.smoothingTimeConstant = .55;
    ctx.createMediaStreamSource(stream).connect(an);
    micIn = { stream, ctx };
    const buf = new Uint8Array(an.fftSize);
    let last = 0;
    const tick = now => {
      if (g !== gen) return;
      requestAnimationFrame(tick);
      if (now - last < 48) return;
      last = now;
      an.getByteTimeDomainData(buf);
      let sum = 0; for (let i = 0; i < buf.length; i++) { const x = (buf[i] - 128) / 128; sum += x * x; }
      push((Math.sqrt(sum / buf.length) - 0.006) * 7);
    };
    requestAnimationFrame(tick);
    return true;
  }
  function closeMic() {
    cancelAnimationFrame(raf); raf = 0;
    if (!micIn) return;
    try { micIn.stream.getTracks().forEach(t => t.stop()); } catch {}
    try { micIn.ctx.close(); } catch {}
    micIn = null;
    bars.forEach(b => { b.style.transform = ''; });
  }

  /* ---- listening ------------------------------------------------------------------ */
  function pageOf(page) {
    const p = page || A().state.page;
    return p === 'library' ? 'library' : p === 'chat' ? 'chat' : 'other';
  }
  function listen(page) {
    show();
    stopTurn();
    const g = ++gen;
    const pg = pageOf(page);
    heardText = '';
    hideBubble();
    setState('listening');
    runWave(g);
    logLine({ tool: 'voice.listen', args: `page=${pg} · lang=en-US`, ms: 8 });

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      try {
        rec = new SR();
        rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true;
        let hush = 0, watchdog = tm(() => runScripted(g, pg), WATCHDOG, g);
        rec.onresult = e => {
          if (g !== gen) return;
          clearTimeout(watchdog);
          let t = '';
          for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
          heardText = t.trim().slice(-220);
          if (heardText) { setState('hearing'); showBubble('Heard', heardText); }
          clearTimeout(hush);
          if (heardText) hush = tm(() => heard(g, heardText, pg), HUSH, g);
        };
        rec.onerror = () => { if (g === gen && !heardText) runScripted(g, pg); };
        rec.onend = () => { if (g === gen && heardText && state === 'hearing') heard(g, heardText, pg); };
        rec.start();
        return;
      } catch { dropRecogniser(); }
    }
    runScripted(g, pg);
  }
  function dropRecogniser() {
    if (!rec) return;
    rec.onresult = rec.onerror = rec.onend = null;
    try { rec.abort(); } catch { try { rec.stop(); } catch {} }
    rec = null;
  }
  /* the same choreography from a question about the page, typed word by word */
  function runScripted(g, pg) {
    if (g !== gen) return;
    dropRecogniser();
    const q = QUESTION[pg] || QUESTION.other;
    const words = q.split(' ');
    if (REDUCED.matches) { heardText = q; setState('hearing'); showBubble('Heard', q); tm(() => heard(g, q, pg), 600, g); return; }
    let at = 420, said = '';
    words.forEach((w, i) => {
      at += 90 + w.length * 22;
      tm(() => {
        said = said ? said + ' ' + w : w;
        heardText = said;
        if (state !== 'hearing') setState('hearing');
        showBubble('Heard', said);
        if (i === words.length - 1) tm(() => heard(g, q, pg), 480, g);
      }, at, g);
    });
  }
  /* what was heard becomes the question */
  function heard(g, text, pg) {
    if (g !== gen) return;
    dropRecogniser(); closeMic();
    setState('thinking');
    showBubble('Heard', text, { thinking: true });
    logLine({ tool: 'voice.transcribe', args: `"${text}"`, ms: 64 });
    answer(g, text, pg);
  }
  function stopListening() {
    if (state !== 'listening' && state !== 'hearing') return;
    stopTurn();
    setState('idle');
    hideBubble();
  }
  function toggleListen() { if (state === 'listening' || state === 'hearing') stopListening(); else listen(); }

  /* ---- answering ------------------------------------------------------------------- */
  async function answer(g, text, pg) {
    let reply = null;
    try {
      reply = pg === 'library' ? await answerLibrary(g) : pg === 'chat' ? await answerChat(g, text) : await answerElsewhere(g);
    } catch (e) { console.error(e); reply = { text: DATA.fallback.text }; }
    if (g !== gen) return;
    if (!reply || !reply.text) { setState('idle'); hideBubble(); return; }
    await speak(g, reply.text, { sticky: !!reply.sticky });
  }
  async function answerChat(g, text) {
    const C = window.Chat;
    if (C && typeof C.ask === 'function') {
      try {
        const m = await C.ask(text, { voice: true });
        if (g !== gen) return null;
        if (m && typeof m.text === 'string' && m.text) return { text: m.text };
      } catch (e) { console.error(e); }
    }
    /* no chat module to ask: answer from the same script it would have used */
    const r = DATA.replies.find(x => x.match.test(text)) || DATA.fallback;
    (r.console || []).forEach((c, i) => tm(() => logLine(c), 140 + i * 260, g));
    await sleep(760, g);
    return { text: r.text };
  }
  /* the sheet, read whole: every page of DATA.library.rows at the default page size,
     so the numbers said are the numbers in the table (≈1 ms for 2,147 rows) */
  async function answerLibrary(g) {
    const lib = DATA.library, per = 20, pages = Math.ceil(lib.total / per);
    const rows = []; for (let p = 1; p <= pages; p++) rows.push(...lib.rows(p, per));
    const pred = r => !!r.capture_issue && r.capture_issue !== 'Unspecified';
    const hits = rows.filter(pred);
    const count = k => hits.filter(r => r.capture_issue === k).length;
    const blurred = count('Blurred'), occluded = count('Occluded'), night = count('Night');
    const fmt = n => n.toLocaleString('en-US');
    logLine({ tool: 'frames.scan', args: `${lib.name} · capture_issue != Unspecified · ${fmt(rows.length)} rows`, ms: 84 });
    await sleep(560, g);
    if (g !== gen) return null;
    let n = hits.length;
    const L = window.Library;
    if (L && typeof L.highlight === 'function') { try { const c = L.highlight(pred); if (typeof c === 'number') n = c; } catch { /* the local count stands */ } }
    logLine({ tool: 'table.highlight', args: `${fmt(n)} rows · capture_issue`, ms: 12 });
    if (L && typeof L.openRow === 'function' && hits[0]) {
      try { L.openRow(hits[0].id); logLine({ tool: 'frame.open', args: `#${hits[0].id} · ${hits[0].capture_issue}`, ms: 40 }); } catch { /* no panel to open */ }
    }
    const rest = occluded && night ? 'occluded or shot at night' : occluded ? 'occluded' : night ? 'shot at night' : 'unspecified';
    /* the breakdown is said only when the table counted the same sheet this did */
    const detail = n === hits.length && n ? `; ${fmt(blurred)} ${blurred === 1 ? 'is' : 'are'} blurred, ${n - blurred ? `the rest ${rest}` : 'none of the others'}` : '';
    const text = `${fmt(n)} of the ${fmt(lib.total)} frames carry a capture issue${detail}. I have highlighted them and opened the first.`;
    return { text, sticky: true };
  }
  async function answerElsewhere(g) {
    const r = DATA.replies.find(x => (x.widgets || []).includes('kpis')) || DATA.fallback;
    (r.console || []).forEach((c, i) => tm(() => logLine(c), 120 + i * 240, g));
    await sleep(640, g);
    if (g !== gen) return null;
    A().go('#/chat');
    A().emit('widget:open', { id: 'kpis', source: 'orb' });
    return { text: r.text };
  }

  /* ---- speaking ------------------------------------------------------------------------ */
  function speak(g, text, { sticky = false, label = 'Axi' } = {}) {
    return new Promise(resolve => {
      if (g !== gen) return resolve();
      setState('speaking');
      showBubble(label, text, { dismiss: sticky });
      const done = () => {
        if (g !== gen) return resolve();
        setState('idle');
        if (!sticky) hideBubble(2400);
        resolve();
      };
      speakText(g, text, done);
    });
  }
  /* the engine already on this machine, chosen the way lens/assets/focus/speak.js chooses */
  const TIER = [[/\.premium\./i, 60], [/\(\s*premium\s*\)/i, 60], [/\.enhanced\./i, 45], [/\(\s*enhanced\s*\)/i, 45], [/\b(neural|natural)\b/i, 40]];
  const NAMED = [
    { id: 'compact.en-US.Samantha', at: ['samantha', 'саманта'], w: 30 }, { id: 'compact.en-GB.Daniel', at: ['daniel', 'дэниэл'], w: 26 },
    { id: 'compact.en-IE.Moira', at: ['moira', 'мойра'], w: 22 }, { id: 'compact.en-ZA.Tessa', at: ['tessa', 'тесса'], w: 18 },
    { id: 'compact.en-AU.Karen', at: ['karen', 'карен'], w: 14 }, { id: 'compact.en-IN.Rishi', at: ['rishi', 'риши'], w: 10 },
  ];
  const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|fred|good news|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|фред|кэти|ральф|шепот)\b/i;
  const REFUSED = /com\.apple\.eloquence\.|com\.apple\.ttsbundle\.siri_/i;
  let voice = null, voiceChosen = false;
  function pickVoice() {
    if (voiceChosen) return voice;
    const synth = window.speechSynthesis;
    let all = []; try { all = synth.getVoices() || []; } catch { return null; }
    if (!all.length) return null;             /* not chosen yet: the list is still arriving */
    voiceChosen = true;
    let best = null, score = 0;
    for (const v of all) {
      if (!v || v.localService === false) continue;
      if (!String(v.lang || '').toLowerCase().startsWith('en')) continue;
      const uri = String(v.voiceURI || ''), name = String(v.name || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
      if (REFUSED.test(uri) || NOVELTY.test(name)) continue;
      let s = 1;
      for (const [re, w] of TIER) if (re.test(uri) || re.test(String(v.name))) s += w;
      for (const n of NAMED) if (uri.indexOf(n.id) >= 0 || n.at.indexOf(name) >= 0) { s += n.w; break; }
      if (s > score) { score = s; best = v; }
    }
    voice = score > 1 ? best : null;
    return voice;
  }
  const sentences = t => {
    const out = []; let buf = '';
    for (const piece of String(t).split(/(?<=[.!?…]["'”’)\]]*)\s+(?=\S)/)) {
      buf = buf ? buf + ' ' + piece : piece;
      if (buf.length > 40 || /[.!?…]["'”’)\]]*$/.test(piece)) { out.push(buf); buf = ''; }
    }
    if (buf) out.push(buf);
    /* a sentence longer than the engine will carry is cut at a comma */
    return out.flatMap(s => { const r = []; while (s.length > 180) { let k = s.lastIndexOf(', ', 170); if (k < 40) k = s.lastIndexOf(' ', 170); if (k < 40) k = 170; r.push(s.slice(0, k)); s = s.slice(k).replace(/^[,\s]+/, ''); } r.push(s); return r; });
  };
  function speakText(g, text, done) {
    const synth = window.speechSynthesis, Utt = window.SpeechSynthesisUtterance;
    const timed = ms => tm(done, ms ?? A().clamp(text.length / (CPS * RATE) * 1000, 1400, 32000), g);
    if (mute || !synth || !Utt) return timed();
    let voices = []; try { voices = synth.getVoices() || []; } catch {}
    if (!voices.length) return timed();       /* no engine to speak with: the same beat, silently */
    const chunks = sentences(text);
    let i = 0, blocked = false;
    const next = () => {
      if (g !== gen) return;
      if (i >= chunks.length) return done();
      const chunk = chunks[i++];
      const u = utter = new Utt(chunk);
      const v = pickVoice(); if (v) u.voice = v;
      u.lang = (v && v.lang) || 'en-US'; u.rate = RATE; u.pitch = PITCH; u.volume = 1;
      const est = Math.max(360, chunk.length / (CPS * RATE) * 1000);
      let alive = false;
      clearTimeout(speakGuard);
      speakGuard = setTimeout(() => {              /* an engine that stops without saying so */
        if (g !== gen) return;
        try { synth.cancel(); } catch {}
        if (!alive) blocked = true;
        blocked ? timed(Math.max(400, (chunks.length - i) * est)) : next();
      }, est * 2.5 + 2500);
      u.onstart = () => { alive = true; };
      u.onboundary = () => { alive = true; };
      u.onend = () => { if (g !== gen) return; clearTimeout(speakGuard); tm(next, 120, g); };
      u.onerror = e => {
        if (g !== gen) return;
        const why = e && e.error;
        if (why === 'interrupted' || why === 'canceled') return;
        clearTimeout(speakGuard);
        if (why === 'not-allowed') { blocked = true; timed(); return; }
        tm(next, 60, g);
      };
      try { synth.speak(u); synth.resume(); } catch { timed(); }
    };
    try { synth.cancel(); } catch {}
    tm(next, 20, g);                                /* never speak in the task that cancelled */
  }
  function stopSpeech() {
    clearTimeout(speakGuard); speakGuard = 0;
    if (utter) { utter.onstart = utter.onend = utter.onerror = utter.onboundary = null; utter = null; }
    const synth = window.speechSynthesis;
    if (synth) { try { synth.cancel(); synth.resume(); } catch {} }
  }
  function stopSpeaking() {
    if (state !== 'speaking') return;
    stopTurn();
    setState('idle');
    if (bubble && !bubble.querySelector('.btn28')) hideBubble(600);
  }

  /* every async thing a turn holds, dropped in one place */
  function stopTurn() {
    gen++;
    clearTimers();
    dropRecogniser();
    closeMic();
    stopSpeech();
  }

  /* ---- mute ------------------------------------------------------------------------- */
  function applyMute() {
    spkBtn.replaceChildren(A().icon(mute ? 'speaker-slash' : 'speaker-high', 20));
    spkBtn.setAttribute('aria-pressed', String(mute));
    spkBtn.setAttribute('aria-label', mute ? 'Unmute Axi' : 'Mute Axi');
    spkBtn.title = mute ? 'Unmute' : 'Mute';
  }
  function toggleMute() {
    mute = !mute;
    A().store.set('speak', !mute);
    A().set('speak', !mute);                  /* the Settings switch shows the same thing */
    applyMute();
    if (mute && state === 'speaking') stopSpeaking();
    A().toast(mute ? 'Axi is muted — replies stay on screen.' : 'Axi will read replies aloud.', { duration: 2400 });
  }

  /* ---- open / close -------------------------------------------------------------------- */
  function show() {
    if (isOpen) return;
    isOpen = true;
    root.hidden = false;
    root.classList.remove('is-out');
    place();
    if (!REDUCED.matches) { root.classList.add('is-in'); root.addEventListener('animationend', () => root.classList.remove('is-in'), { once: true }); }
    A().set('orb', true);
  }
  function open(opts = {}) {
    show();
    if (opts.listen) listen(opts.page);
    else if (typeof opts.text === 'string' && opts.text) say(opts.text);
  }
  function close() {
    if (!isOpen) return;
    stopTurn();
    setState('idle');
    isOpen = false;
    A().set('orb', false);
    if (document.activeElement && root.contains(document.activeElement)) {
      const back = [$('#btnMic'), $('#libAsk')].find(b => b && b.offsetParent);
      if (back) back.focus(); else document.activeElement.blur();
    }
    const finish = () => { root.hidden = true; root.classList.remove('is-out'); if (bubble) { bubble.remove(); bubble = bubbleP = bubbleLabel = null; } };
    if (REDUCED.matches) finish();
    else { root.classList.add('is-out'); setTimeout(finish, 170); }
  }
  function say(text) {
    show();
    stopTurn();
    const g = gen;
    return speak(g, String(text), { sticky: false });
  }
  function stop() { stopTurn(); if (isOpen) setState('idle'); }

  /* ═══ the agent console ═══════════════════════════════════════════════════ */
  const con = { el: null, body: null, dot: null, count: null, rows: [], open: false, busy: 0, closing: 0 };
  const stamp = t => { const d = new Date(t); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`; };
  const tone = ms => ms < 300 ? 'positive' : ms < 1000 ? 'warning' : 'negative';
  function buildConsole() {
    const { h, btn } = A();
    con.el = $('#console');
    con.dot = h('i', { class: 'con-dot', 'aria-hidden': 'true' });
    con.body = h('div', { class: 'con-body', role: 'log', 'aria-live': 'polite', 'aria-label': 'Tool calls', tabindex: '0' });
    con.count = h('span', { class: 'con-count' });
    con.el.replaceChildren(
      h('div', { class: 'con-head' }, h('div', { class: 'con-title' }, h('span', null, 'Agent console'), con.dot), btn('x', 'Close the console — Esc', { size: 36, onclick: () => conToggle(false) })),
      con.body,
      h('div', { class: 'con-foot' }, con.count,
        h('button', { class: 'btn btn-glass', type: 'button', onclick: conClear }, 'Clear'),
        h('button', { class: 'btn btn-glass', type: 'button', onclick: conCopy }, 'Copy log')));
    renderEmpty();
  }
  function renderEmpty() {
    if (con.rows.length) return;
    con.body.replaceChildren(A().h('div', { class: 'con-empty' }, 'Nothing yet. Ask something and every tool call lands here as it happens.'));
    con.count.textContent = '';
  }
  function norm(e) {
    if (Array.isArray(e)) e = { tool: e[0], args: e[1], ms: e[2], at: e[3] };
    if (!e || !e.tool) return null;
    return { tool: String(e.tool), args: e.args == null ? '' : String(e.args), ms: Math.max(0, Math.round(+e.ms || 0)), at: +e.at || Date.now() };
  }
  function logLine(entry) {
    const e = norm(entry); if (!e) return;
    const { h } = A();
    if (!con.rows.length) con.body.replaceChildren();
    con.rows.push(e);
    con.body.append(h('div', { class: 'con-row' },
      h('span', { class: 'con-time' }, stamp(e.at)), h('span', { class: 'con-tool' }, e.tool),
      h('span', { class: 'con-ms', dataset: { tone: tone(e.ms) } }, `${e.ms} ms`), h('span', { class: 'con-args', title: e.args }, e.args)));
    con.body.scrollTop = con.body.scrollHeight;
    con.count.textContent = `${con.rows.length} call${con.rows.length === 1 ? '' : 's'}`;
    con.dot.classList.add('is-busy');
    clearTimeout(con.busy); con.busy = setTimeout(() => con.dot.classList.remove('is-busy'), 1400);
  }
  /* the open chat's own calls, stamped when they happened */
  function seedConsole() {
    if (con.rows.length) return;
    const S = A().state;
    const c = S.page === 'chat' && S.chatId ? DATA.chats[S.chatId] : null;
    if (!c || !c.messages) return;
    for (const m of c.messages) {
      if (!m.console || !m.console.length) continue;
      const min = /(\d+)\s*min/.exec(m.ago || ''), hrs = /(\d+)\s*h\b/.exec(m.ago || '');
      const ago = min ? +min[1] * 60000 : hrs ? +hrs[1] * 3600000 : 6 * 60000;
      let at = Date.now() - ago - m.console.reduce((a, l) => a + (+l[2] || 0) + 220, 0);
      for (const l of m.console) { at += 220; logLine({ tool: l[0], args: l[1], ms: l[2], at }); at += +l[2] || 0; }
    }
    con.dot.classList.remove('is-busy'); clearTimeout(con.busy);
  }
  function conToggle(force) {
    const to = typeof force === 'boolean' ? force : !con.open;
    if (to === con.open) return;
    con.open = to;
    clearTimeout(con.closing);
    const b = $('#btnConsole'); if (b) b.setAttribute('aria-pressed', String(to));
    if (to) {
      con.el.hidden = false;
      con.el.offsetHeight;                          /* layout first, so the slide is a slide */
      con.el.classList.add('is-open');
      con.body.scrollTop = con.body.scrollHeight;
    } else {
      con.el.classList.remove('is-open');
      con.closing = setTimeout(() => { if (!con.open) con.el.hidden = true; }, REDUCED.matches ? 0 : 230);
    }
    A().set('console', to);
  }
  function conClear() { con.rows = []; renderEmpty(); }
  function conCopy() {
    if (!con.rows.length) { A().toast('The log is empty.', { duration: 1800 }); return; }
    const text = con.rows.map(r => `${stamp(r.at)}  ${r.tool.padEnd(22)} ${r.args}  ${r.ms} ms`).join('\n');
    const ok = () => A().toast(`Copied ${con.rows.length} call${con.rows.length === 1 ? '' : 's'} to the clipboard.`, { duration: 2400 });
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => fallbackCopy(text, ok));
    else fallbackCopy(text, ok);
  }
  function fallbackCopy(text, ok) {
    const ta = A().h('textarea', { style: { position: 'fixed', left: '-9999px', top: '0' }, 'aria-hidden': 'true' }, text);
    document.body.append(ta); ta.select();
    let done = false; try { done = document.execCommand('copy'); } catch {}
    ta.remove();
    done ? ok() : A().toast('Could not reach the clipboard.', { duration: 2400 });
  }

  /* ═══ wiring ═════════════════════════════════════════════════════════════ */
  function init() {
    const App = A();
    mute = App.store.get('speak', true) === false;
    const saved = App.store.get('orbPos', null);
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') { dragged = true; pos = saved; }
    build();
    buildConsole();

    App.on('orb:open', d => open(d || {}));
    App.on('orb:ask', d => { if (!d || !d.text) return; show(); stopTurn(); const g = gen; showBubble('Heard', d.text); heard(g, String(d.text), pageOf(d.page)); });
    App.on('console:toggle', d => conToggle(d && typeof d.open === 'boolean' ? d.open : undefined));
    App.on('console:log', d => logLine(d));
    App.on('esc', () => {
      if (isOpen && (state === 'listening' || state === 'hearing')) { stopListening(); return; }
      if (isOpen && state === 'speaking') { stopSpeaking(); return; }
      if (isOpen && state === 'thinking') { stopTurn(); setState('idle'); hideBubble(); return; }
      if (bubble) { hideBubble(); return; }
      const other = App.state.full || ['#libPanel', '#plusOptions', '#fullscreen'].some(sel => { const el = $(sel); return el && !el.hidden; });
      if (con.open && !other) conToggle(false);
    });
    App.on('route', () => { if (isOpen) place(); seedConsole(); });
    App.on('boot', seedConsole);
    App.on('state', d => {
      if (!d) return;
      if (d.key === 'full' && isOpen) place();
      /* the Settings switch "Read answers aloud" writes the same key */
      if (d.key === 'speak' && mute === !!d.value) { mute = !d.value; applyMute(); if (mute && state === 'speaking') stopSpeaking(); }
    });
    window.addEventListener('resize', () => { if (isOpen) place(); });
    /* the voice list arrives late in Chrome; a turn started before it picks again */
    const synth = window.speechSynthesis;
    if (synth) { try { synth.getVoices(); synth.addEventListener('voiceschanged', () => { voiceChosen = false; }); } catch {} }
  }

  return {
    init, open, close, say, listen, stop,
    get state() { return state; }, get isOpen() { return isOpen; },
    console: { toggle: conToggle, open: () => conToggle(true), close: () => conToggle(false), log: logLine, clear: conClear, get isOpen() { return con.open; } },
  };
})();
