/* =============================================================================
   chat.js — the thread, the composer, the chat header's menus, the scripted
   agent. Renders into #thread, binds #composer and the header buttons, and
   exposes window.Chat (docs/SPEC.md §7):
     Chat.init()                       registers page 'chat'
     Chat.open(chatId | null)          navigates (null = a new chat)
     Chat.ask(text, {voice}) → Promise<replyMessage>
     Chat.renderBlock(block) → Element
     Chat.suggest(texts[])
   Everything the agent says comes from DATA (data.js); nothing is fetched.
   ============================================================================= */
window.Chat = (() => {
  const { h, icon, btn, on, emit, state, set, go, toast, menu, popover, sleep, ago } = App;
  const $ = (s, r = document) => r.querySelector(s);
  const D = window.DATA;
  const thread = () => $('#thread');

  /* the Home frame was placed by hand in two spots: the first agent line is set
     437 wide (so it wraps after "monitoring:"), and the forecast paragraph sits
     24 under its bubble where every other reply sits 32. Kept, so the frame
     and the page agree pixel for pixel; nothing else reads this. */
  const FRAME = { 'ksa-accident-distribution-for-august': { 1: { width: 437 }, 3: { gap: 24 } } };
  /* …and two rows of the incident card carry a manual line break in the frame
     (both first lines would fit the 272 column; the designer broke them by hand) */
  const BREAKS = {
    'Trending content detected by social listening': 'Trending content detected by\nsocial listening',
    'Location and establishment verified via BaladyLens': 'Location and establishment verified\nvia BaladyLens',
  };

  let openId = null;         /* the chat whose messages stand in #thread (null = welcome) */
  let stale = false;         /* the DOM stopped matching the data (a stream was cut short) */
  let run = 0;               /* the streaming run token — bump it to cancel */
  let current = null;        /* the promise of the reply being streamed */
  let fast = false;          /* finish the running stream without delays */
  let stick = true;          /* the thread is pinned to its bottom while streaming */
  let uid = 0;
  const replayed = new Set();
  const mounted = [];        /* Timeline handles, destroyed on re-render */
  const W = () => window.Widgets;

  /* ---- small helpers ------------------------------------------------------------ */
  const log = line => { if (line) emit('console:log', { tool: line[0], args: line[1], ms: line[2] }); };
  const clone = v => v == null ? v : JSON.parse(JSON.stringify(v));
  const truncate = (s, n = 44) => { s = String(s).replace(/\s+/g, ' ').trim(); if (s.length <= n) return s; const cut = s.slice(0, n).replace(/\s+\S*$/, ''); return (cut.length > 12 ? cut : s.slice(0, n)).replace(/[,;:.!?…-]+$/, '') + '…'; };
  const project = id => D.projects.find(p => p.id === (id || state.projectId)) || D.projects[0];
  const css = (el, vars) => { for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v); return el; };
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scrollBottom(smooth) {
    const t = thread(); if (!t) return;
    t.scrollTo({ top: t.scrollHeight, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  }
  function svg(tag, attrs, text) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
    if (text != null) el.textContent = text;
    return el;
  }

  /* =============================================================================
     blocks — what a reply draws under its words
     ============================================================================= */
  function renderBlock(block) {
    const type = block && block.type;
    if (type === 'chart') return chart(block);
    const el = h('div', { class: `blk blk-${type || 'text'}`, dataset: { type: type || 'text' } });
    if (type === 'incident') el.append(...incident(block));
    else if (type === 'timeline') timeline(el, block);
    else if (type === 'kpis') el.append(...(block.items || []).map(kpi));
    else if (type === 'signals') el.append(...signalRows(block.ids || []));
    else if (type === 'actions') el.append(...actionPackage(block));
    else el.append(h('p', { class: 'msg-text' }, block && block.text || ''));
    return el;
  }

  /* the incident: the timeline card, the ride photo, the meta line */
  function incident(b) {
    const card = h('div', { class: 'inc-card', role: 'group', 'aria-label': b.card.title },
      h('div', { class: 'card-label' }, b.card.title),
      h('div', { class: 'card-rows' }, ...b.card.rows.map(r => h('div', { class: `inc-row ${r.now ? 'is-now' : ''}`.trim() },
        h('span', { class: 'inc-t' }, r.t),
        r.flag
          ? h('div', { class: 'inc-stack' }, h('span', { class: 'inc-x' }, BREAKS[r.text] || r.text), h('span', { class: 'inc-flag' }, r.flag, h('i', { class: 'dot' })))
          : h('span', { class: 'inc-x' }, BREAKS[r.text] || r.text)))),
      h('img', { class: 'inc-glow', src: 'assets/figma/ellipse-2450-glow.svg', alt: '', 'aria-hidden': 'true' }));
    const photo = h('a', { class: 'inc-photo', href: 'https://x.com', target: '_blank', rel: 'noopener', 'aria-label': 'The clip from X — the ride, parts detached',
      onclick: e => { e.preventDefault(); toast('Opening the post on X'); } },
      h('img', { src: b.photo, alt: 'Detached metal parts hanging from the ride, the crowd below' }));
    /* a code like H-48221 stays whole on a line, as the frame sets it */
    const words = s => String(s).split(/(\s+)/).map(w => /\S-\S/.test(w) ? h('span', { class: 'nb' }, w) : w);
    const meta = h('p', { class: 'inc-meta' }, ...b.meta.map(m => m.href
      ? h('a', { href: m.href, target: m.external ? '_blank' : null, rel: m.external ? 'noopener' : null, onclick: m.external ? e => { e.preventDefault(); toast(`Opening ${m.text.replace(/\s*↗$/, '')}`); } : null }, ...words(m.text))
      : words(m.text)));
    return [card, photo, meta];
  }

  /* the forecast timeline: Timeline.mount, or a stand-in with the same chrome */
  function timeline(el, block) {
    el.classList.add('blk-timeline');
    const T = window.Timeline;
    if (T && typeof T.mount === 'function') {
      try { const handle = T.mount(el, block.data || D.timeline, { branch: block.branch }); if (handle) mounted.push(handle); return; }
      catch (e) { console.error('Timeline.mount failed', e); el.replaceChildren(); }
    }
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Forecast branch' });
    for (const [i, label] of ['No action', 'With action package'].entries()) {
      seg.append(h('button', { class: `seg-btn ${i === 0 ? 'is-on' : ''}`.trim(), type: 'button', 'aria-pressed': String(i === 0),
        onclick: e => { seg.querySelectorAll('.seg-btn').forEach(x => { x.classList.toggle('is-on', x === e.currentTarget); x.setAttribute('aria-pressed', String(x === e.currentTarget)); }); } }, label));
    }
    el.append(h('div', { class: 'tlp', role: 'img', 'aria-label': `${D.timeline.metric} · ${D.timeline.title}` },
      h('div', { class: 'tlp-head' }, h('span', null, D.timeline.title), seg),
      h('div', { class: 'tlp-plot' }, h('div', { class: 'tlp-line' }), h('div', { class: 'tlp-months' }, ...D.timeline.months.map(m => h('span', null, m))))));
  }

  /* one stat tile */
  function kpi(it) {
    const el = h('div', { class: 'st', role: 'group', 'aria-label': `${it.label} ${it.value}${it.unit || ''}` },
      h('div', { class: 'st-label' }, it.label),
      h('div', { class: 'st-value' }, it.value, it.unit ? h('small', null, it.unit) : null),
      it.delta ? h('div', { class: 'st-delta' }, it.delta) : null,
      h('div', { class: 'st-bar', role: 'progressbar', 'aria-valuenow': String(it.pct || 0), 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('i')));
    return css(el, { '--kpi': it.color || 'var(--info)', '--pct': `${App.clamp(it.pct || 0, 0, 100)}%` });
  }

  /* a bar chart — Widgets.renderChart when it exists, otherwise our own SVG */
  function chart(b) {
    const Wd = W();
    if (Wd && typeof Wd.renderChart === 'function') {
      try { const el = Wd.renderChart(b); if (el instanceof Element) { el.classList.add('blk'); el.dataset.type = 'chart'; return el; } } catch (e) { console.error('Widgets.renderChart failed', e); }
    }
    const width = 736, height = 150, top = 24, base = 118, labelY = 141;
    const bars = b.bars || [], n = Math.max(1, bars.length), slot = width / n, bw = Math.min(72, slot * .55);
    const max = b.max || Math.max(1, ...bars.map(x => x[1])) * 1.1;
    const y = v => base - (v / max) * (base - top);
    const pct = b.unit === '%' ? '%' : '';
    const s = svg('svg', { viewBox: `0 0 ${width} ${height}`, width, height, class: 'bc-svg', role: 'img', 'aria-label': `${b.title}: ${bars.map(x => `${x[0]} ${x[1]}${pct}`).join(', ')}` });
    s.append(svg('line', { x1: 0, x2: width, y1: base + .5, y2: base + .5, class: 'bc-base' }));
    if (b.target) {
      const ty = y(b.target);
      s.append(svg('line', { x1: 0, x2: width, y1: ty, y2: ty, class: 'bc-target' }), svg('text', { x: width, y: ty - 4, 'text-anchor': 'end', class: 'bc-target-label' }, `Target ${b.target}${pct}`));
    }
    bars.forEach(([label, v], i) => {
      const cx = slot * i + slot / 2, by = y(v);
      const r = svg('rect', { x: cx - bw / 2, y: by, width: bw, height: Math.max(0, base - by), rx: 3, fill: b.color || 'var(--info)', class: 'bc-bar' });
      r.style.setProperty('--i', i);
      s.append(r, svg('text', { x: cx, y: by - 6, 'text-anchor': 'middle', class: 'bc-val' }, `${v}${pct}`), svg('text', { x: cx, y: labelY, 'text-anchor': 'middle', class: 'bc-label' }, label));
    });
    return h('div', { class: 'blk blk-chart', dataset: { type: 'chart' } },
      h('div', { class: 'bc-head' }, h('span', { class: 'bc-title' }, b.title || ''), b.unit ? h('span', { class: 'bc-unit' }, b.unit) : null), s);
  }

  /* compact rows for signals by id; clicking one opens it */
  function signalRows(ids) {
    return ids.map(id => D.signals.find(s => s.id === id)).filter(Boolean).map(s => {
      const sev = /critical|high/i.test(s.severity) ? 'negative' : /watch|medium/i.test(s.severity) ? 'warning' : 'info';
      const thumb = h('div', { class: 'sig-thumb sl-thumb', 'aria-hidden': 'true' },
        s.thumb === 'globe' ? h('img', { class: 'fit-globe', src: 'assets/figma/globe.png', alt: '' })
        : s.thumb ? h('img', { src: s.thumb, alt: '' })
        : css(h('i', { class: 'dot' }), { '--dot': s.dot }));
      return h('button', { class: 'sl-row', type: 'button', 'aria-label': `Open the signal: ${s.title}`, onclick: () => emit('signal:open', s.id) },
        thumb,
        h('div', { class: 'sl-text' }, h('span', { class: 'sig-title sl-title' }, s.title),
          h('span', { class: 'sig-meta sl-meta' }, css(h('i', { class: 'dot' }), { '--dot': s.dot }), h('b', null, s.place), '·', s.when)),
        h('span', { class: `badge badge--${sev}` }, s.severity),
        icon('caret-right', 16));
    });
  }

  /* the action package: three measures, each with Commit / Reject */
  function actionPackage(b) {
    const head = h('div', { class: 'pk-head' }, h('div', { class: 'pk-title' }, b.title), b.intro ? h('div', { class: 'pk-intro' }, b.intro) : null);
    const cards = (b.items || []).map((it, i) => {
      const card = h('div', { class: 'pk-card', role: 'group', 'aria-label': `Measure ${i + 1}` });
      const effect = h('span', { class: 'pk-effect' }, it.effect || '');
      const decide = (what, el) => {
        if (card.dataset.done) return;
        card.dataset.done = what; it.done = what;
        const other = what === 'commit' ? reject : commit;
        el.setAttribute('data-done', ''); el.replaceChildren(icon(what === 'commit' ? 'check' : 'x', 12), what === 'commit' ? 'Committed' : 'Rejected');
        other.remove();
        if (what === 'commit') { effect.textContent = `Committed · ${it.owner} · ${it.when}`; log(['measures.commit', `${truncate(it.text, 48)} · owner=${it.owner}`, 140]); toast(`Committed: ${truncate(it.text, 56)}`, { action: 'Undo', onAction: () => { delete card.dataset.done; delete it.done; el.removeAttribute('data-done'); el.replaceChildren('Commit'); foot.append(reject); } }); }
        else { log(['measures.reject', truncate(it.text, 48), 60]); toast(`Rejected: ${truncate(it.text, 56)}`, { action: 'Undo', onAction: () => { delete card.dataset.done; delete it.done; el.removeAttribute('data-done'); el.replaceChildren('Reject'); foot.insertBefore(commit, el); } }); }
      };
      const commit = h('button', { class: 'btn btn-white', type: 'button', 'aria-label': `Commit: ${it.text}`, onclick: e => decide('commit', e.currentTarget) }, 'Commit');
      const reject = h('button', { class: 'btn btn-glass', type: 'button', 'aria-label': `Reject: ${it.text}`, onclick: e => decide('reject', e.currentTarget) }, 'Reject');
      const foot = h('div', { class: 'pk-foot' }, effect, commit, reject);
      card.append(
        h('div', { class: 'pk-text' }, it.text),
        h('div', { class: 'pk-chips' },
          it.scope ? h('span', { class: 'chip' }, icon('globe-simple', 12), it.scope) : null,
          it.when ? h('span', { class: 'chip' }, icon('clock', 12), it.when) : null,
          it.owner ? h('span', { class: 'chip' }, icon('user', 12), h('b', null, it.owner)) : null),
        foot);
      if (it.done) { card.dataset.done = it.done; const el = it.done === 'commit' ? commit : reject; el.setAttribute('data-done', ''); el.replaceChildren(icon(it.done === 'commit' ? 'check' : 'x', 12), it.done === 'commit' ? 'Committed' : 'Rejected'); (it.done === 'commit' ? reject : commit).remove(); }
      return card;
    });
    return [head, ...cards];
  }

  /* =============================================================================
     messages
     ============================================================================= */
  function renderMessage(m, fx, opts = {}) {
    m._uid = m._uid || ++uid;
    if (m.role === 'user') {
      return h('div', { class: 'msg msg-user', dataset: { uid: m._uid, gap: fx && fx.gap }, role: 'article', 'aria-label': 'You' },
        h('div', { class: 'bubble' }, m.voice ? icon('microphone', 16) : null, m.text));
    }
    const el = h('div', { class: 'msg msg-agent', dataset: { uid: m._uid, gap: fx && fx.gap }, role: 'article', 'aria-label': 'Axi' });
    const text = h('p', { class: 'msg-text', style: fx && fx.width ? { maxWidth: fx.width + 'px' } : null }, opts.pending ? '' : m.text);
    const blocks = h('div', { class: 'msg-blocks' });
    if (!opts.pending) for (const b of m.blocks || []) blocks.append(renderBlock(b));
    el.append(text, blocks);
    if (!opts.pending) { el.append(actionsRow(m, el)); if (opts.last && m.follow && m.follow.length) el.append(followRow(m.follow)); }
    return el;
  }

  function actionsRow(m, el) {
    const up = btn('thumbs-up', 'Good answer', { size: 28, attrs: { 'aria-pressed': String(m.vote === 'up') }, onclick: () => vote(m, 'up', up, down) });
    const down = btn('thumbs-down', 'Poor answer', { size: 28, attrs: { 'aria-pressed': String(m.vote === 'down') }, onclick: () => vote(m, 'down', down, up) });
    const when = h('span', { class: 'acts-ago', dataset: m.ts ? { ts: String(m.ts) } : null }, m.ago || (m.ts ? ago(m.ts) : 'just now'));
    return h('div', { class: 'msg-acts', role: 'group', 'aria-label': 'Message actions' },
      h('div', { class: 'acts-group' }, up, down,
        btn('copy', 'Copy the answer', { size: 28, onclick: () => copyText(m.text) }),
        btn('arrows-counter-clockwise', 'Regenerate', { size: 28, onclick: () => regenerate(m, el) })),
      when);
  }
  function followRow(texts, cls = '') {
    return h('div', { class: `msg-follow ${cls}`.trim(), role: 'group', 'aria-label': 'Suggested follow-ups' },
      ...texts.map(t => h('button', { class: 'chip chip-follow', type: 'button', onclick: () => ask(t) }, icon('arrow-up', 12), t)));
  }
  function vote(m, which, me, other) {
    const on = m.vote !== which;
    m.vote = on ? which : null;
    me.setAttribute('aria-pressed', String(on)); other.setAttribute('aria-pressed', 'false');
    if (on) { log(['feedback.record', `vote=${which}`, 12]); toast(which === 'up' ? 'Noted — this one lands.' : 'Noted. Regenerate for a second take.', { duration: 2600 }); }
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast('Copied to the clipboard', { duration: 2600 }); }
    catch {
      const ta = h('textarea', { style: { position: 'fixed', opacity: '0' } }, text); document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch {}
      ta.remove(); toast(ok ? 'Copied to the clipboard' : 'The clipboard is not available here', { duration: 2600 });
    }
  }

  /* =============================================================================
     streaming
     ============================================================================= */
  function pickReply(text) {
    const r = D.replies.find(x => x.match.test(text)) || D.fallback;
    return { text: r.text, blocks: clone(r.blocks || []), widgets: (r.widgets || []).slice(), follow: (r.follow || []).slice(), console: clone(r.console || []) };
  }
  const wordDelay = n => reduced() ? 4 : Math.min(18, Math.max(3, 5200 / Math.max(1, n)));

  /* types m.text word by word into el, then reveals the blocks and the actions row */
  async function streamMessage(m, el, chat, opts = {}) {
    const token = ++run;
    const t = thread();
    const text = el.querySelector('.msg-text');
    const blocks = el.querySelector('.msg-blocks');
    el.querySelector('.msg-acts')?.remove(); el.querySelector('.msg-follow')?.remove();
    const lines = m.console || [];
    const think = h('div', { class: 'msg-think', 'aria-label': 'Thinking' }, h('span', { class: 'thinking' }, h('i'), h('i'), h('i')), h('span', null, lines[0] ? lines[0][0] : 'thinking'));
    el.insertBefore(think, text);
    text.hidden = true; text.textContent = '';
    log(lines[0]);
    if (stick) scrollBottom(true);
    await sleep(fast ? 0 : 600 + Math.random() * 300);
    if (token !== run) { stale = true; return false; }
    think.remove(); text.hidden = false; text.classList.add('is-streaming');
    const words = m.text.split(' ');
    const delay = wordDelay(words.length);
    const node = document.createTextNode(''); text.append(node);
    let nextLine = 1;
    for (let i = 0; i < words.length; i++) {
      if (token !== run) { stale = true; return false; }
      node.data += (i ? ' ' : '') + words[i];
      if (nextLine < lines.length && i >= (nextLine / lines.length) * words.length) log(lines[nextLine++]);
      if (stick && (i % 4 === 0)) scrollBottom();
      if (!fast) await sleep(delay);
    }
    while (nextLine < lines.length) log(lines[nextLine++]);
    text.classList.remove('is-streaming');
    if (opts.keepBlocks !== true) { blocks.replaceChildren(); for (const b of m.blocks || []) blocks.append(renderBlock(b)); }
    if (stick) scrollBottom(true);
    for (const id of m.widgets || []) { try { W()?.open?.(id, { source: 'agent', focus: true }); } catch (e) { console.error(e); } }
    m.ts = Date.now(); delete m.ago;
    el.append(actionsRow(m, el));
    if (m.follow && m.follow.length) el.append(followRow(m.follow));
    el.classList.add('is-fresh'); setTimeout(() => el.classList.remove('is-fresh'), 4000);
    if (stick) scrollBottom(true);
    emit('chat:reply', { chatId: chat.id, message: m });
    return true;
  }

  /* the public ask: the user's words go up, the reply streams under them */
  async function ask(text, opts = {}) {
    text = String(text == null ? '' : text).trim();
    if (!text) return null;
    if (current) { fast = true; try { await current; } catch {} fast = false; }
    const chat = ensureChat(text);
    if (openId !== chat.id || stale) render(chat.id);
    const t = thread();
    t.querySelector('.welcome')?.remove(); t.querySelector('.msg-follow--suggest')?.remove();
    const um = { role: 'user', text, ts: Date.now(), voice: !!opts.voice };
    chat.messages.push(um);
    t.append(renderMessage(um));
    stick = true; scrollBottom(true);
    const reply = pickReply(text);
    const am = Object.assign({ role: 'agent', ts: null }, reply);
    chat.messages.push(am);
    const el = renderMessage(am, null, { pending: true });
    t.append(el);
    current = streamMessage(am, el, chat).finally(() => { current = null; });
    await current;
    return am;
  }

  /* a second take on the same answer, streamed in place */
  async function regenerate(m, el) {
    if (current) return;
    const chat = D.chats[openId]; if (!chat) return;
    m.base = m.base || m.text;
    m.text = m.text.startsWith('Looking at it again: ') ? m.base : 'Looking at it again: ' + m.base;
    delete m.vote;
    log(['answer.regenerate', `model=${(D.models.find(x => x.id === state.model) || D.models[0]).name}`, 40]);
    current = streamMessage(m, el, chat, { keepBlocks: true }).finally(() => { current = null; });
    await current;
  }

  /* =============================================================================
     the thread
     ============================================================================= */
  function render(id) {
    const t = thread(); if (!t) return;
    for (const m of mounted.splice(0)) { try { m.destroy && m.destroy(); } catch {} }
    t.replaceChildren();
    openId = id; stale = false;
    const c = D.chats[id];
    if (!c) { openId = null; t.append(welcome()); return; }
    if (!c.messages.length) { t.append(welcome(c)); return; }
    const fx = FRAME[id] || {};
    c.messages.forEach((m, i) => t.append(renderMessage(m, fx[i], { last: i === c.messages.length - 1 })));
    stick = true;
    t.scrollTop = t.scrollHeight;
    requestAnimationFrame(() => { t.scrollTop = t.scrollHeight; });
  }

  /* the empty thread: a new chat's invitation, or a seeded chat that has no messages yet */
  function welcome(chat) {
    const w = D.welcome;
    const title = chat ? chat.title : w.title;
    const hint = chat ? 'Nothing here yet. Ask about it, or start from one of these.' : w.hint;
    return h('div', { class: 'welcome', role: 'region', 'aria-label': chat ? chat.title : 'New chat' },
      h('div', { class: 'welcome-text' }, h('h1', { class: 'welcome-title' }, title), h('p', { class: 'welcome-hint' }, hint)),
      h('div', { class: 'welcome-grid' }, ...w.suggestions.map(s => h('button', { class: 'sugg', type: 'button', onclick: () => ask(s.text) }, icon(s.icon || 'sparkle', 20), h('span', null, s.text)))));
  }

  function suggest(texts) {
    const t = thread(); if (!t) return;
    t.querySelector('.msg-follow--suggest')?.remove();
    if (!texts || !texts.length) return;
    t.append(followRow(texts, 'msg-follow--suggest'));
    if (stick) scrollBottom(true);
  }

  /* the chat a question lands in: the open one, or a new one in the current project */
  function ensureChat(firstText) {
    const c = D.chats[state.chatId];
    if (c) return c;
    return createChat(truncate(firstText), { messages: [], widgets: [] });
  }
  function createChat(title, extra = {}) {
    let n = 0, id; do { id = 'new-' + (++n); } while (D.chats[id]);
    const p = project();
    const c = Object.assign({ id, project: p.id, title, dot: 'ghost', messages: [], widgets: [], created: Date.now() }, extra);
    D.chats[id] = c; p.chats.unshift(id);
    state.chatId = id;
    if (!/^#\/chat\//.test(location.hash) || location.hash !== '#/chat/' + id) { history.replaceState(null, '', '#/chat/' + id); state.route = location.hash; }
    App.renderSidebar();
    openId = id; stale = false; thread()?.replaceChildren();
    return c;
  }

  /* =============================================================================
     the page
     ============================================================================= */
  function show(param, r) {
    const isNew = !r || r.name === 'new';
    let id = isNew ? null : (param || state.chatId);
    if (id && !D.chats[id]) { toast('That chat is not here any more'); id = null; state.chatId = null; }
    if (id) {
      const c = D.chats[id];
      if (c.project && c.project !== state.projectId) state.projectId = c.project;
      syncProject();
      if (openId !== id || stale) render(id); else { stick = true; scrollBottom(); }
      try { W()?.setFor?.(id, (c.widgets || []).slice()); } catch (e) { console.error(e); }
      if (c.focusWidget) { const w = c.focusWidget; delete c.focusWidget; try { W()?.open?.(w, { source: 'agent', focus: true }); } catch (e) { console.error(e); } }
      if (!replayed.has(id)) { replayed.add(id); for (const m of c.messages) if (m.role === 'agent') for (const l of m.console || []) log(l); }
    } else {
      syncProject();
      render(null);
      try { W()?.setFor?.(null, []); } catch (e) { console.error(e); }
      setTimeout(() => $('#askField')?.focus(), 60);
    }
    closePlus();
  }
  function hide() { run++; if (current) stale = true; closePlus(); }
  function syncProject() { const p = project(); const n = $('#projectName'); if (n) n.textContent = p.name; }

  /* =============================================================================
     the header
     ============================================================================= */
  function projectMenu(anchor) {
    menu(anchor, [
      { title: 'Projects' },
      ...D.projects.map(p => ({ label: p.name, icon: 'folder-simple', checked: p.id === state.projectId, small: `${p.chats.length} chats`, onSelect: () => switchProject(p) })),
      { sep: true },
      { label: 'New project…', icon: 'plus', onSelect: () => newProject(anchor) },
    ], { side: 'bottom', align: 'left', width: 260 });
  }
  function switchProject(p) {
    if (p.id === state.projectId && state.page === 'chat' && state.chatId && D.chats[state.chatId]?.project === p.id) return;
    state.projectId = p.id; syncProject();
    go(p.chats[0] ? '#/chat/' + p.chats[0] : '#/new');
  }
  function newProject(anchor) {
    const field = h('input', { class: 'pop-input', type: 'text', placeholder: 'Project name', 'aria-label': 'Project name', maxlength: '48' });
    const create = () => {
      const name = field.value.trim();
      if (!name) { field.focus(); field.placeholder = 'A name, please'; return; }
      let base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'project', id = base, n = 1;
      while (D.projects.some(p => p.id === id)) id = base + '-' + (++n);
      D.projects.push({ id, name, icon: 'alpha', chats: [] });
      App.closeMenu(); App.renderSidebar();
      state.projectId = id; syncProject();
      go('#/new');
      toast(`Project "${name}" created — ask the first question`);
    };
    field.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); create(); } });
    popover(anchor, { title: 'New project', width: 300, align: 'left',
      body: h('div', { class: 'pop-field' }, field, h('span', { class: 'pop-hint' }, 'Chats, files and scheduled runs live inside a project.')),
      foot: h('button', { class: 'btn btn-white', type: 'button', onclick: create }, 'Create') });
    setTimeout(() => field.focus(), 30);
  }

  const kindIcon = k => ({ pdf: 'book-open', video: 'video-camera', sheet: 'table', scene: 'cube', image: 'image-square', csv: 'table' })[k] || 'floppy-disk';
  const guessKind = name => /\.pdf$/i.test(name) ? 'pdf' : /\.(mp4|mov|webm)$/i.test(name) ? 'video' : /\.(xlsx?|csv|numbers)$/i.test(name) ? 'sheet' : /\.(sog|splat|ply|glb)$/i.test(name) ? 'scene' : /\.(png|jpe?g|webp|gif|svg)$/i.test(name) ? 'image' : 'file';
  const fmtSize = n => n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(n < 10485760 ? 1 : 0)} MB`;
  function filesPopover(anchor) {
    const p = project();
    const list = () => D.files.map(f => h('button', { class: 'pop-row file-row', type: 'button', onclick: () => { App.closeMenu(); log(['files.open', f.name, 30]); toast(`Opening ${f.name}`); } },
      icon(kindIcon(f.kind), 16), h('span', { class: 'file-name' }, f.name), h('small', null, `${f.size} · ${f.when}`)));
    const body = h('div', null, ...list());
    const count = h('span', { class: 'pop-count' }, `${D.files.length} files`);
    const input = h('input', { type: 'file', multiple: true, hidden: true, 'aria-hidden': 'true', tabindex: '-1', onchange: e => {
      const files = Array.from(e.target.files || []); if (!files.length) return;
      for (const f of files.reverse()) D.files.unshift({ name: f.name, kind: guessKind(f.name), size: fmtSize(f.size), when: 'Just now' });
      body.replaceChildren(...list()); count.textContent = `${D.files.length} files`;
      log(['files.upload', files.map(f => f.name).join(', '), 380]);
      toast(files.length === 1 ? `Uploaded ${files[0].name}` : `Uploaded ${files.length} files`);
    } });
    popover(anchor, { title: `${p.name} · files`, width: 360, align: 'right', body,
      foot: [count, input, h('button', { class: 'btn btn-white', type: 'button', onclick: () => input.click() }, icon('upload-simple', 14), 'Upload')] });
  }

  function chatMenu(anchor) {
    const c = D.chats[state.chatId];
    if (!c) { menu(anchor, [{ title: 'A new chat' }, { label: 'Ask something first', icon: 'chat-circle', onSelect: () => $('#askField')?.focus() }], { side: 'bottom', align: 'right' }); return; }
    const p = project(c.project);
    menu(anchor, [
      { label: 'Rename', icon: 'pencil-simple', onSelect: () => rename(anchor, c) },
      { label: 'Share', icon: 'share-network', onSelect: async () => { await copyText(location.href.replace(/#.*$/, '') + '#/chat/' + c.id); } },
      { label: 'Export as PDF', icon: 'export', onSelect: () => { log(['export.pdf', c.title, 900]); toast(`Exporting "${truncate(c.title, 32)}" as PDF…`, { duration: 1400 }); setTimeout(() => toast(`${truncate(c.title, 32)}.pdf is ready`, { action: 'Print', onAction: () => window.print() }), 1500); } },
      { label: c.pinned ? 'Unpin' : 'Pin', icon: 'map-pin', onSelect: () => pin(c, p) },
      { sep: true },
      { label: 'Archive', icon: 'trash', danger: true, onSelect: () => archive(c, p) },
    ], { side: 'bottom', align: 'right', width: 220 });
  }
  function rename(anchor, c) {
    const field = h('input', { class: 'pop-input', type: 'text', value: c.title, 'aria-label': 'Chat title', maxlength: '80' });
    const save = () => { const v = field.value.trim(); if (!v) { field.focus(); return; } c.title = v; App.closeMenu(); App.renderSidebar(); toast('Renamed', { duration: 2000 }); };
    field.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); save(); } });
    popover(anchor, { title: 'Rename the chat', width: 320, align: 'right', body: h('div', { class: 'pop-field' }, field),
      foot: h('button', { class: 'btn btn-white', type: 'button', onclick: save }, 'Save') });
    setTimeout(() => { field.focus(); field.select(); }, 30);
  }
  function pin(c, p) {
    const i = p.chats.indexOf(c.id);
    if (!c.pinned) { c.pinned = true; c._pinFrom = i; if (i > 0) { p.chats.splice(i, 1); p.chats.unshift(c.id); } toast('Pinned to the top of the project', { duration: 2600 }); }
    else { c.pinned = false; const back = Math.min(c._pinFrom ?? i, p.chats.length - 1); if (i >= 0) { p.chats.splice(i, 1); p.chats.splice(back, 0, c.id); } toast('Unpinned', { duration: 2000 }); }
    App.renderSidebar();
  }
  function archive(c, p) {
    const i = p.chats.indexOf(c.id); if (i < 0) return;
    p.chats.splice(i, 1);
    App.renderSidebar();
    const next = p.chats[Math.min(i, p.chats.length - 1)];
    if (state.chatId === c.id) go(next ? '#/chat/' + next : '#/new');
    log(['chat.archive', c.title, 20]);
    toast(`Archived "${truncate(c.title, 36)}"`, { action: 'Undo', onAction: () => { if (!p.chats.includes(c.id)) p.chats.splice(Math.min(i, p.chats.length), 0, c.id); App.renderSidebar(); go('#/chat/' + c.id); } });
  }

  /* =============================================================================
     the composer
     ============================================================================= */
  const field = () => $('#askField');
  function autogrow() {
    const f = field(); if (!f) return;
    f.style.height = '24px';
    f.style.height = Math.min(120, Math.max(24, f.scrollHeight)) + 'px';
  }
  function insertToken(tok) {
    const f = field(); if (!f) return;
    const start = f.selectionStart ?? f.value.length, end = f.selectionEnd ?? start;
    const before = f.value.slice(0, start), after = f.value.slice(end);
    const pad = before && !/\s$/.test(before) ? ' ' : '';
    f.value = before + pad + tok + after;
    const pos = (before + pad + tok).length;
    f.setSelectionRange(pos, pos); autogrow(); f.focus();
  }
  function send() {
    const f = field(); if (!f) return;
    const v = f.value.trim();
    if (!v) return;
    f.value = ''; autogrow();
    if (v[0] === '/') { const c = COMMANDS.find(x => v.toLowerCase().split(/\s+/)[0] === x.cmd); if (c) { c.run(v.slice(c.cmd.length).trim()); return; } }
    ask(v);
  }

  const COMMANDS = [
    { cmd: '/scene', note: 'Open the street capture', run: () => ask('Show me Olaya Street in 3D') },
    { cmd: '/kpis', note: 'Open the global KPIs', run: () => ask('Open the global KPIs on the map') },
    { cmd: '/forecast', note: 'Run the forecast', run: () => ask('What will happen if nothing is done?') },
    { cmd: '/actions', note: 'Draft the action package', run: () => ask('What should we do about it?') },
    { cmd: '/compare', note: 'Compare the amanas', run: () => ask('Compare Taif with Jeddah') },
    { cmd: '/signals', note: 'Sort the reports', run: () => ask('Are these signals related events or separate reports?') },
    { cmd: '/new', note: 'Start a new chat', run: () => go('#/new') },
  ];
  function slashMenu(anchor) {
    menu(anchor, [{ title: 'Commands' }, ...COMMANDS.map(c => ({ label: c.cmd, small: c.note, icon: 'terminal', onSelect: () => { closePlus(); c.run(''); } }))], { side: 'top', align: 'left', width: 260 });
  }

  /* Plus options: the frame's hidden 334×44 bar — five chips over the input */
  function plusRow() {
    const row = $('#plusOptions'); if (!row) return null;
    if (row.childElementCount) return row;
    const opt = (ic, label, aria, onclick, kbd) => h('button', { class: 'plus-opt', type: 'button', role: 'menuitem', 'aria-label': aria || label, onclick }, icon(ic, 20), h('span', null, label), kbd ? h('kbd', null, kbd) : null);
    row.append(
      opt('upload-simple', 'Attach file', 'Attach a project file', e => attachMenu(e.currentTarget)),
      opt('cube', 'Add scene', 'Add the street scene to the message', () => { insertToken('[scene: Olaya Street] '); closePlus(); try { W()?.open?.('scene', { source: 'user', focus: true }); } catch {} }),
      opt('broadcast', 'Add signal', 'Add a signal to the message', e => signalMenu(e.currentTarget)),
      opt('cards', 'Add dashboard', 'Add a dashboard to the message', e => dashboardMenu(e.currentTarget)),
      opt('terminal', '/ command', 'Slash commands', e => slashMenu(e.currentTarget)));
    return row;
  }
  function attachMenu(anchor) {
    const input = h('input', { type: 'file', multiple: true, hidden: true, 'aria-hidden': 'true', tabindex: '-1', onchange: e => {
      const files = Array.from(e.target.files || []); if (!files.length) return;
      for (const f of files.reverse()) D.files.unshift({ name: f.name, kind: guessKind(f.name), size: fmtSize(f.size), when: 'Just now' });
      insertToken(files.map(f => `[file: ${f.name}]`).join(' ') + ' '); closePlus();
      log(['files.upload', files.map(f => f.name).join(', '), 380]);
      toast(files.length === 1 ? `Attached ${files[0].name}` : `Attached ${files.length} files`);
    } });
    document.body.append(input);
    menu(anchor, [
      { title: 'Project files' },
      ...D.files.map(f => ({ label: f.name, icon: kindIcon(f.kind), small: f.size, onSelect: () => { insertToken(`[file: ${f.name}] `); closePlus(); } })),
      { sep: true },
      { label: 'Upload from this computer…', icon: 'upload-simple', onSelect: () => input.click() },
    ], { side: 'top', align: 'left', width: 300 });
  }
  function signalMenu(anchor) {
    const seen = new Set();
    const items = D.signals.filter(s => { if (seen.has(s.title)) return false; seen.add(s.title); return true; });
    menu(anchor, [{ title: 'Signals' }, ...items.map(s => ({ label: truncate(s.title, 40), icon: 'broadcast', small: s.place.split(' · ')[0], onSelect: () => { insertToken(`[signal: ${s.title}] `); closePlus(); } }))], { side: 'top', align: 'left', width: 340 });
  }
  function dashboardMenu(anchor) {
    menu(anchor, [{ title: 'Dashboards' }, ...D.dashboards.map(d => ({ label: d.name, icon: d.icon || 'cards', small: d.note, onSelect: () => { insertToken(`[dashboard: ${d.name}] `); closePlus(); try { W()?.open?.('kpis', { source: 'user', focus: true }); } catch {} } }))], { side: 'top', align: 'left', width: 360 });
  }
  function openPlus() {
    const row = plusRow(); if (!row) return;
    row.hidden = false; $('#btnPlus')?.setAttribute('aria-expanded', 'true');
    setTimeout(() => document.addEventListener('pointerdown', plusOutside, true), 0);
  }
  function closePlus() {
    const row = $('#plusOptions'); if (!row || row.hidden) return;
    row.hidden = true; $('#btnPlus')?.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', plusOutside, true);
  }
  function plusOutside(e) {
    const row = $('#plusOptions');
    if (row.contains(e.target) || $('#btnPlus').contains(e.target) || e.target.closest('.menu,.pop')) return;
    closePlus();
  }

  function modelMenu(anchor) {
    menu(anchor, [
      { title: 'Model' },
      ...D.models.map(m => ({ label: m.name, small: m.note, checked: m.id === state.model, onSelect: () => { set('model', m.id); syncModel(); log(['model.select', m.name, 8]); toast(`${m.name} answers from now on`, { duration: 2400 }); } })),
    ], { side: 'top', align: 'right', width: 260 });
  }
  function syncModel() {
    const m = D.models.find(x => x.id === state.model) || D.models[0];
    const n = $('#modelName'); if (n) n.textContent = m.name;
    $('#btnModel')?.setAttribute('aria-label', `Model: ${m.name}`);
  }

  /* =============================================================================
     a signal opens as a chat of its own
     ============================================================================= */
  function openSignal(id) {
    const s = D.signals.find(x => x.id === id); if (!s) return;
    const p = project();
    let c = p.chats.map(x => D.chats[x]).find(x => x && x.signal === s.id);
    if (!c) {
      const sev = String(s.severity || '').toLowerCase();
      const text = `${s.kind} · ${s.place} · first seen ${s.when.toLowerCase()} · severity ${sev}. ${s.title}. The read is grounded in the register and the social feed; the Kingdom map is open beside this thread. Ask for the scene, the licence history or an action package.`;
      c = createChat(s.title, { signal: s.id, dot: s.dot, widgets: ['kpis'],
        messages: [{ role: 'agent', ts: Date.now(), text, blocks: [{ type: 'signals', ids: [s.id] }], follow: ['What happened here?', 'Show the street capture', 'What should we do about it?'],
          console: [['signals.read', `id=${s.id} · ${s.place}`, 80], ['register.match', `${s.kind} · ${s.place}`, 120]] }] });
      state.chatId = null; openId = null;
    } else { p.chats.splice(p.chats.indexOf(c.id), 1); p.chats.unshift(c.id); App.renderSidebar(); }
    c.focusWidget = 'kpis';
    go('#/chat/' + c.id);
  }

  /* =============================================================================
     init
     ============================================================================= */
  function init() {
    App.registerPage('chat', { show, hide });
    $('#projectSwitch')?.addEventListener('click', e => projectMenu(e.currentTarget));
    $('#projectIcon')?.addEventListener('click', e => projectMenu($('#projectSwitch') || e.currentTarget));
    $('#btnConsole')?.addEventListener('click', () => emit('console:toggle'));
    $('#btnWidgets')?.addEventListener('click', e => { set('widgets', !state.widgets); e.currentTarget.setAttribute('aria-pressed', String(state.widgets)); });
    $('#btnFiles')?.addEventListener('click', e => filesPopover(e.currentTarget));
    $('#btnChatMenu')?.addEventListener('click', e => chatMenu(e.currentTarget));
    $('#btnPlus')?.addEventListener('click', () => { const row = $('#plusOptions'); row && row.hidden ? openPlus() : closePlus(); });
    $('#btnModel')?.addEventListener('click', e => modelMenu(e.currentTarget));
    $('#btnMic')?.addEventListener('click', () => emit('orb:open', { listen: true }));
    const f = field();
    if (f) {
      f.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); }
      });
      f.addEventListener('input', autogrow);
      autogrow();
    }
    const t = thread();
    t?.addEventListener('scroll', () => { stick = t.scrollHeight - t.scrollTop - t.clientHeight < 48; }, { passive: true });
    on('state', ({ key, value }) => {
      if (key === 'model') syncModel();
      if (key === 'widgets') $('#btnWidgets')?.setAttribute('aria-pressed', String(!!value));
      if (key === 'console') $('#btnConsole')?.setAttribute('aria-pressed', String(!!value));
      if (key === 'orb') $('#btnMic')?.setAttribute('aria-pressed', String(!!value));
    });
    on('esc', closePlus);
    on('signal:open', id => openSignal(typeof id === 'object' && id ? id.id : id));
    syncModel();
    setInterval(() => { document.querySelectorAll('.acts-ago[data-ts]').forEach(el => { el.textContent = ago(+el.dataset.ts); }); }, 30000);
  }

  return { init, open: id => go(id ? '#/chat/' + id : '#/new'), ask, renderBlock, suggest, get openId() { return openId; } };
})();
