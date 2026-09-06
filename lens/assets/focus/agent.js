/* =============================================================================
   agent.js — the agent's side of the thread.

   Two ways of answering, and the screen says which one is in use:

   · Live. `npm run agent` starts tools/agent-proxy.mjs — on a key from the
     environment, or on the `claude` command this machine is logged into; this
     module finds it, hands it the case as context, and streams Claude's reply
     into the thread token by token. The credential stays in that process — the
     page never holds one and never could, and the health probe says which of
     the two is answering.

   · Offline. With no proxy — on GitHub Pages, or before anyone starts one —
     the agent answers out of the source document instead: the case's own
     kpiNote, prevention list, actions taken and timeline. Those are quotes,
     not generation, so an offline answer is still true.
   ============================================================================= */
(function () {
  'use strict';

  /* Same origin first, then the dev proxy — but the dev proxy is only ever on
     the machine that started it, so a page served from anywhere else is asking
     a question whose answer is already known. On GitHub Pages that second
     probe is a guaranteed failed connection to a host the browser will refuse
     as mixed content anyway, once per load, for nothing. */
  const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const PROXY = LOCAL ? ['', 'http://localhost:5313'] : [''];
  let base = null, live = false, probed = null, probedAt = 0, standing = null;
  /* ?agent=off pins the page to the document's own words — the state GitHub
     Pages is always in, and the one the harness asserts */
  const OFF = new URLSearchParams(location.search).get('agent') === 'off';

  async function probe() {
    if (OFF) { live = false; standing = null; return (probed = Promise.resolve(false)); }
    /* only a success is remembered: a proxy started after the page loaded
       should be found on the next question, not after a reload */
    if (probed && live) return probed;
    if (probed && Date.now() - probedAt < 8000) return probed;
    probed = (async () => {
      for (const b of PROXY) {
        try {
          const r = await fetch(b + '/agent/health', { method: 'GET' });
          if (!r.ok) continue;
          /* which model, and on which of the two credentials — the screen says
             so rather than leaving 'live' to mean something unstated */
          try { standing = await r.json(); } catch (e) { standing = { ok: true }; }
          base = b; live = true;
          return true;
        } catch (e) { /* not there — try the next */ }
      }
      live = false; standing = null;
      return false;
    })();
    probedAt = Date.now();
    return probed;
  }

  /* what the agent is told about the case it is being asked about. Everything
     here is quoted from the source document, so the model is grounded in the
     record rather than recalling a city it was never shown. */
  function contextFor(s) {
    if (!s) return '';
    const L = [];
    L.push('CASE: ' + s.title);
    L.push('Owner: ' + s.owner + ' · ' + s.category);
    L.push('');
    L.push('What is known:');
    s.summary.forEach(p => L.push('  ' + p));
    if (s.timeline && s.timeline.length) {
      L.push('');
      L.push('Handling so far:');
      s.timeline.forEach(r => L.push('  ' + r.t + ' — ' + r.x + (r.st === 'now' ? ' (in progress)' : r.st === 'wait' ? ' (not yet done)' : '')));
    }
    if (s.record) { L.push(''); L.push('Inspection record:'); s.record.forEach(r => L.push('  ' + r[0] + ': ' + r[1])); }
    if (s.concern) { L.push(''); L.push('The slice that allowed it: ' + s.concern.caption + ' — ' + s.concern.value + ' against a target of ' + s.concern.target + '.'); }
    if (s.kpis && s.kpis.length) {
      L.push(''); L.push('KPIs for this scope:');
      s.kpis.forEach(k => L.push('  ' + k.k + ': ' + k.value + ' (target ' + k.target + ')'));
    }
    if (s.note) { L.push(''); L.push("The register's own reading: " + s.note.trim()); }
    if (s.prevention && s.prevention.length) {
      L.push(''); L.push('Preventive measures on the table:');
      s.prevention.forEach(p => L.push('  ' + p.what + ' — ' + p.when));
    }
    if (s.actions && s.actions.length) {
      L.push(''); L.push('Actions already taken:');
      s.actions.forEach(a => L.push('  ' + a.what + ' — ' + a.when + ', ' + a.by));
    }
    return L.join('\n');
  }

  const SYSTEM =
    'You are Axsi, the agent inside a city command interface used by municipal leadership in Saudi Arabia. ' +
    'You are looking at one case with the person you are talking to.\n\n' +
    'Answer from the case record below and nothing else. If the record does not settle a question, say so ' +
    'plainly and name what would. Never invent a figure, a date, a licence number or an action.\n\n' +
    'Write the way a good analyst speaks aloud: two or three sentences, no headings, no bullet lists, no ' +
    'preamble. Lead with the answer. Where a number matters, say the number and what it is measured against.';

  /* ---- the live path: POST /agent, read Server-Sent Events off the body --- */
  async function stream(messages, subject, on) {
    const res = await fetch(base + '/agent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system: SYSTEM + '\n\nTHE CASE RECORD\n' + contextFor(subject),
        messages,
      }),
    });
    if (!res.ok || !res.body) {
      let why = 'offline';
      try { why = (await res.json()).error || why; } catch (e) {}
      throw new Error(why);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '', event = 'message';

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n\n')) >= 0) {
        const frame = buf.slice(0, i); buf = buf.slice(i + 2);
        event = 'message';
        let data = '';
        for (const line of frame.split('\n')) {
          if (line.startsWith('event: ')) event = line.slice(7).trim();
          else if (line.startsWith('data: ')) data += line.slice(6);
        }
        if (!data) continue;
        let payload; try { payload = JSON.parse(data); } catch (e) { continue; }
        if (event === 'delta' && payload.text) on.delta(payload.text);
        else if (event === 'error') throw new Error(payload.message || payload.error || 'agent error');
        else if (event === 'done') return payload.text;
      }
    }
    /* a body that ends without a final frame is a failed turn, not an empty one */
    throw new Error('the stream ended without a final frame');
  }

  /* ---- the offline path: answer out of the record ------------------------ */
  /* Every branch is scored against the question and the best one answers, so a
     word that appears in two of them cannot decide the reply by position. */
  const BRANCHES = [
    { on: ['prevent', 'stop it', 'again', 'recur', 'measure', 'avoid'],
      say: s => s.prevention.length
        ? 'The register puts ' + s.prevention.length + ' measures on the table. The first is: ' +
          s.prevention[0].what + ' — ' + s.prevention[0].when + '.'
        : 'The register carries no preventive measures for this case yet.' },

    { on: ['licence', 'license no', 'permit', 'establishment', 'who owns', 'which building'],
      say: s => s.meta.head + s.meta.links.map(l => l.text).join(' · ') },

    { on: ['next', 'when', 'timeline', 'due', 'schedule', 'still to'],
      say: s => s.timeline.length
        ? s.timeline.map(r => r.t + ' — ' + r.x +
            (r.st === 'now' ? ' (in progress)' : r.st === 'wait' ? ' (not yet done)' : '')).join('. ') + '.'
        : 'No handling timeline is recorded.' },

    { on: ['done', 'action', 'taken', 'so far', 'already'],
      say: s => s.actions.length
        ? 'So far: ' + s.actions.map(a => a.what.toLowerCase() + ' (' + a.when + ', ' + a.by + ')').join('; ') + '.'
        : 'No action is recorded yet.' },

    { on: ['kpi', 'coverage', 'compliance', 'satisfaction', 'target', 'indicator'],
      say: s => s.kpis.length
        ? s.kpis.map(k => k.k + ' is ' + k.value + ' against a target of ' + k.target).join('; ') + '.'
        : 'No KPI is attached to this case.' },

    { on: ['why', 'cause', 'allowed', 'gap', 'slice', 'how did'],
      say: s => (s.note || '').trim() ||
        (s.concern ? s.concern.caption + ': ' + (s.concern.value || '—') + ' against ' + s.concern.target + '.'
                   : 'The record does not say.') },

    { on: ['inspect', 'inspection', 'last checked', 'record'],
      say: s => s.record
        ? s.record.map(r => r[0].toLowerCase() + ': ' + r[1]).join('; ') + '.'
        : 'This case carries no inspection record.' },
  ];

  function fromRecord(question, s) {
    if (!s) return 'There is no case in focus.';
    const q = ' ' + (question || '').toLowerCase() + ' ';
    let best = null, bestScore = 0;
    for (const b of BRANCHES) {
      let score = 0;
      for (const w of b.on) if (q.includes(w)) score += w.length;   /* longer match, stronger signal */
      if (score > bestScore) { bestScore = score; best = b; }
    }
    if (best) return best.say(s);
    return s.summary[0] + (s.note ? ' ' + s.note.trim() : '');
  }

  window.Agent = {
    probe,
    isLive: () => live,
    /* {model, engine} while a proxy is answering, null while the record is */
    standing: () => (live ? standing : null),
    contextFor,

    /* one turn. `on.delta(text)` is called as the reply arrives; the promise
       resolves with the whole of it, or with the record-based answer. */
    async ask(question, history, subject, on) {
      await probe();
      const messages = (history || []).concat([{ role: 'user', content: question }]);
      if (live) {
        try { return await stream(messages, subject, on); }
        catch (e) {
          live = false; probed = null; standing = null;
          /* whatever half-sentence arrived is not part of the answer that
             follows — let the caller clear it before the record speaks */
          if (on.reset) on.reset();
        }
      }
      /* offline: the same answer, typed out at reading speed so the thread
         behaves the same way whether or not a key is present */
      const text = fromRecord(question, subject);
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(r => setTimeout(r, 18 + Math.random() * 26));
        on.delta((i ? ' ' : '') + words[i]);
      }
      return text;
    },
  };
})();
