/* =============================================================================
   widgets.js — the column on the right of the chat where everything the agent
   opens lands, and the fullscreen frame one of them can be expanded into.
   Descriptors live in DATA.widgets (scene · kpis · signals · chart · actions);
   the two live ones embed lens/focus.html through App.lens.embed and keep a
   photograph underneath until the frame has actually painted.
   Contract: docs/SPEC.md §7 — Widgets.init/open/close/expand/collapse/setFor/has/list.
   ============================================================================= */
window.Widgets = (() => {
  'use strict';
  const { h, icon, btn, on, emit, state, set, go, toast } = App;
  const D = window.DATA;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
  const SINGLETONS = ['scene', 'kpis', 'signals', 'actions'];
  /* open-in-new (§6): a scene is a capture — Library; the signals have a page
     of their own; everything else the agent composes — the KPIs, a chart, an
     action package — is a dashboard */
  const OPEN_IN = { scene: ['#/library', 'Library'], signals: ['#/signals', 'Signals'] };
  const openIn = kind => OPEN_IN[kind] || ['#/dashboards', 'Dashboards'];
  const SEVERITY = { Critical: 'badge--negative', High: 'badge--warning', Watch: 'badge--info' };
  const LENSES = [['location', 'Location'], ['media', 'Media'], ['scene', 'Scene']];
  const ZOOM_DELTA = 120;          /* one press of the tool = this much wheel: 1.7 of the
                                      Lens's zoom levels, so the planet is still a planet
                                      after one press (240 would cross onto the flat map) */
  const EMBED_TIMEOUT = 20000;
  const PAINT_WAIT = 60000;
  /* Global KPIs opens on the frame's planet: globe.png is the Lens turned to
     44.5°E 34°N (fitted against the frame) — the Kingdom in the lower half of
     the window, the Caspian and Europe above it — where the Lens left to
     itself centres the case. Set once the live frame has a picture and before
     it is shown; a card picked afterwards turns the planet the Lens's way. */
  const OPENING_VIEW = { lon0: 44.5, lat0: 34 };
  const SIGNAL_GRACE = 600;        /* ms a signal:open waits for the thread Chat opens for it */
  const OPEN_GRACE = 1500;         /* ms an open() made off the chat page waits for the chat route
                                      (the orb and the Dashboards page go('#/chat') and open in the
                                      same breath; the hash lands a tick later) */

  let col = null, fs = null;
  const live = new Map();          /* id → entry */
  const memory = {};               /* chatId → the ids it showed last */
  let currentChat = null;
  let seq = 0;
  let selectedSignal = (D.signals[0] || {}).id || null;
  let pendingSignal = null;      /* a signal:open waiting for the thread Chat opens for it */
  let pendingTimer = 0;
  let pendingOpens = [];         /* opens asked for off the chat page, for the thread that lands */

  /* ---- descriptors ------------------------------------------------------------ */
  function describe(x) {
    if (typeof x === 'string') {
      const base = D.widgets[x];
      if (!base) return null;
      const d = Object.assign({}, base);
      if (d.kind === 'chart' && !d.bars) Object.assign(d, defaultChart(), { title: d.title });
      return d;
    }
    if (x && typeof x === 'object') {
      const kind = x.kind || x.type || 'chart';
      if (!D.widgets[kind]) return null;
      const base = D.widgets[kind];
      const d = Object.assign({}, base, x, { kind });
      if (!x.id) d.id = SINGLETONS.includes(kind) ? kind : `${kind}-${++seq}`;
      if (kind === 'chart' && !d.bars) Object.assign(d, defaultChart(), { title: d.title, id: d.id });
      if (kind === 'actions' && !d.items) Object.assign(d, { items: D.actionPackage.items, intro: D.actionPackage.intro });
      return d;
    }
    return null;
  }
  /* the chart a bare "chart" asks for: the amana comparison the agent draws */
  function defaultChart() {
    for (const r of D.replies) for (const b of r.blocks || []) if (b.type === 'chart') return { sub: b.title, bars: b.bars, unit: b.unit, max: b.max, color: b.color, target: b.target };
    return { bars: [], unit: '', max: 100 };
  }

  /* ---- the column ----------------------------------------------------------------- */
  const widgetsIn = () => Array.from(col.querySelectorAll(':scope > .wg, :scope > .wg-ph')).map(n => n.classList.contains('wg-ph') ? live.get(n.dataset.for) : live.get(n.dataset.id)).filter(Boolean);
  const list = () => widgetsIn().map(e => e.id);
  const has = id => live.has(id);

  function syncEmpty() {
    let empty = col.querySelector(':scope > .wg-empty');
    const none = live.size === 0;
    if (none && !empty) {
      empty = h('div', { class: 'wg-empty', role: 'note' }, icon('sparkle', 20), h('span', null, 'Widgets the agent opens land here'));
      col.append(empty);
    } else if (!none && empty) empty.remove();
  }
  function remember() { if (currentChat) memory[currentChat] = list(); }

  function scrollTo(el) {
    const top = el.offsetTop + el.offsetHeight - col.clientHeight + 8;
    col.scrollTo({ top: Math.max(0, top), behavior: REDUCED.matches ? 'auto' : 'smooth' });
  }
  function light(el) {
    el.classList.add('is-lit');
    setTimeout(() => el.classList.remove('is-lit'), 900);
  }
  /* a column hidden with the Cards button comes back when the agent puts
     something in it — or points at something already there */
  function reveal() {
    if (state.widgets || state.page !== 'chat') return;
    set('widgets', true);
    const b = document.getElementById('btnWidgets'); if (b) b.setAttribute('aria-pressed', 'true');
  }

  /* ---- open / close ------------------------------------------------------------------ */
  function open(idOrDesc, opts = {}) {
    if (!col) return null;
    const desc = describe(idOrDesc);
    if (!desc) return null;
    /* the column belongs to the thread: opened from Library or the orb, a widget
       waits for the chat route (the next setFor would tear a hidden mount down,
       and remember it under the thread that was left) */
    if (state.page !== 'chat') { pendingOpens.push({ what: idOrDesc, opts, at: Date.now() }); return null; }
    const existing = live.get(desc.id);
    if (existing) {
      if (typeof idOrDesc === 'object') refresh(existing, desc);
      reveal();
      if (opts.focus !== false && state.page === 'chat') { scrollTo(existing.el); light(existing.el); }
      return existing.el;
    }
    const entry = build(desc);
    const siblings = Array.from(col.querySelectorAll(':scope > .wg, :scope > .wg-ph'));
    const at = opts.index != null ? Math.min(Math.max(0, opts.index), siblings.length) : siblings.length;
    if (at < siblings.length) siblings[at].before(entry.el); else col.append(entry.el);
    live.set(desc.id, entry);
    syncEmpty(); remember(); reveal();
    if (opts.focus !== false && state.page === 'chat') requestAnimationFrame(() => { scrollTo(entry.el); if (opts.focus) light(entry.el); });
    emit('widget:open', { id: desc.id, source: opts.source || 'agent', from: 'widgets' });
    return entry.el;
  }

  function close(id, opts = {}) {
    const e = live.get(id);
    if (!e) return false;
    if (state.full === id) collapse(true);
    const index = widgetsIn().indexOf(e);
    live.delete(id);
    const done = () => { destroy(e); syncEmpty(); };
    if (REDUCED.matches || opts.quiet) done();
    else { e.el.classList.add('is-closing'); setTimeout(done, 180); }
    remember();
    emit('widget:close', { id, from: 'widgets' });
    if (!opts.quiet) toast(`Closed ${e.desc.title}`, { action: 'Undo', onAction: () => open(e.desc, { index, source: 'undo', focus: true }) });
    return true;
  }

  function destroy(e) {
    if (e.cleanup) { try { e.cleanup(); } catch {} }
    clearTimeout(e.timer);
    if (e.ph) e.ph.remove();
    if (e.iframe) { try { e.iframe.src = 'about:blank'; } catch {} }
    e.el.remove();
    e.iframe = null; e.doc = null;
  }

  /* re-render the column for a chat: keep what stays (and its live frames),
     drop what goes, add what is new, in the order given */
  function setFor(chatId, ids) {
    if (!col) return;
    currentChat = chatId || null;
    const want = (ids || []).map(id => (typeof id === 'string' ? id : describe(id) && describe(id).id)).filter(Boolean);
    if (state.full && !want.includes(state.full)) collapse(true);
    for (const id of Array.from(live.keys())) if (!want.includes(id)) { const e = live.get(id); live.delete(id); destroy(e); }
    /* nodes already in place are left alone — a re-inserted iframe reloads —
       and one that has to move is moved with its state where the browser can */
    let anchor = null;
    for (const raw of ids || []) {
      const desc = describe(raw);
      if (!desc) continue;
      let e = live.get(desc.id);
      if (!e) { e = build(desc); live.set(desc.id, e); }
      const node = e.ph && e.ph.isConnected ? e.ph : e.el;
      const ref = anchor ? anchor.nextElementSibling : col.firstElementChild;
      if (node !== ref) {
        if (node.isConnected && typeof col.moveBefore === 'function') col.moveBefore(node, ref);
        else col.insertBefore(node, ref);
      }
      anchor = node;
    }
    col.scrollTop = 0;
    syncEmpty();
    if (currentChat) memory[currentChat] = list();
  }

  /* ---- building a widget ------------------------------------------------------------ */
  function build(desc) {
    const e = { id: desc.id, desc, kind: desc.kind, el: null, body: null, iframe: null, img: null, doc: null, ready: false, painted: false, failed: false, cleanup: null, ph: null, timer: 0, zoom: 1, moved: false };
    const el = h('section', { class: `wg wg--${desc.kind}`, dataset: { id: desc.id, kind: desc.kind }, role: 'region', 'aria-label': desc.title, tabindex: '-1' });
    if (desc.h && (desc.kind === 'scene' || desc.kind === 'kpis')) el.style.setProperty('--wg-h', desc.h + 'px');
    e.el = el;
    const render = { scene: renderScene, kpis: renderKpis, signals: renderSignals, chart: renderChart, actions: renderActions }[desc.kind] || renderChart;
    render(e);
    el.append(chrome(e));
    return e;
  }
  function refresh(e, desc) {
    if (!['signals', 'chart', 'actions'].includes(e.kind)) return;
    e.desc = Object.assign({}, e.desc, desc);
    e.body.remove();
    ({ signals: renderSignals, chart: renderChart, actions: renderActions })[e.kind](e);
    e.el.prepend(e.body);
    e.el.querySelector('.wg-title').textContent = e.desc.title;
  }

  function chrome(e) {
    const [route, place] = openIn(e.kind);
    e.btnExpand = btn('arrows-out-simple', 'Expand', { onclick: () => (state.full === e.id ? collapse() : expand(e.id)) });
    const tools = h('div', { class: 'wg-tools' },
      btn('arrow-square-up-right', `Open in ${place}`, { onclick: () => go(route) }),
      e.btnExpand,
      btn('x', `Close ${e.desc.title}`, { onclick: () => close(e.id) }));
    return h('div', { class: 'wg-chrome' }, h('h3', { class: 'wg-title' }, e.desc.title), tools);
  }
  function markExpand(e, full) {
    const b = e.btnExpand;
    b.replaceChildren(icon(full ? 'arrows-in-simple' : 'arrows-out-simple', 20));
    b.setAttribute('aria-label', full ? 'Collapse' : 'Expand');
    b.title = full ? 'Collapse — Esc' : 'Expand';
  }

  /* ---- the live frame --------------------------------------------------------------- */
  function mountLens(e, params, view) {
    if (e.cleanup) { try { e.cleanup(); } catch {} }
    clearTimeout(e.timer);
    e.ready = false; e.painted = false; e.failed = false; e.doc = null;
    e.view = view || null; e.pick = null;
    e.el.classList.remove('is-live', 'is-painted', 'is-fallback');
    if (!e.iframe || !e.iframe.isConnected) {
      e.iframe = h('iframe', { class: 'wg-lens', title: `${e.desc.title} — live`, loading: 'eager', allow: 'autoplay' });
      e.img.before(e.iframe);
    }
    e.cleanup = App.lens.embed(e.iframe, Object.assign({ agent: 'off' }, params), {
      timeout: EMBED_TIMEOUT,
      onReady(doc) { e.ready = true; e.doc = doc; e.el.classList.add('is-live'); watchPaint(e, Date.now()); },
      onFail(why) { fail(e, why); },
    });
  }
  function fail(e, why) {
    e.failed = true; e.ready = false; e.painted = false;
    clearTimeout(e.timer);
    e.el.classList.remove('is-live', 'is-painted');
    e.el.classList.add('is-fallback');
    if (e.iframe) { e.iframe.remove(); e.iframe = null; }
    e.doc = null;
    if (why && why !== 'timeout') console.info(`[widgets] ${e.id}: live frame unavailable (${why && why.message || why}); showing the still`);
  }
  /* the frame has loaded; the photograph stays until there is a picture in it */
  function watchPaint(e, since) {
    clearTimeout(e.timer);
    let ok = false;
    try {
      const w = e.doc && e.doc.defaultView;
      if (!w || !e.iframe || !e.iframe.isConnected) return;
      if (e.kind === 'scene') {
        const S = w.FocusScene3D, s = S && S.status && S.status();
        if (s && s.ok === false) { fail(e, s.phase); return; }
        ok = !!(s && s.phase === 'ready');
      } else {
        ok = !!(w.FocusGlobe && w.FocusGlobe.ready && w.MapView);
        if (ok) settle(e, w);
      }
    } catch (err) { fail(e, err); return; }
    if (ok) { e.timer = setTimeout(() => { e.painted = true; e.el.classList.add('is-painted'); }, e.kind === 'scene' ? 120 : 500); return; }
    if (Date.now() - since > PAINT_WAIT) return;             /* keep the still, keep the frame */
    e.timer = setTimeout(() => watchPaint(e, since), 300);
  }

  /* the planet's first picture, set while the still is still over it: the
     card picked while the frame was loading, or else the opening view */
  function settle(e, w) {
    const pick = e.pick; e.pick = null;
    if (pick && pointAt(e, pick, true)) { e.view = null; return; }
    if (e.view) { w.MapView.setRotation(e.view.lon0, e.view.lat0); w.MapView.invalidate(); e.view = null; }
  }
  /* re-point a live frame at a subject through the Lens's own shelf (no
     reload); `instant` puts the planet there first so the Lens's turn has
     nowhere left to go */
  function pointAt(e, subj, instant) {
    const w = e.doc.defaultView;
    const list = w.FocusModel ? w.FocusModel.subjects() : [];
    const i = list.findIndex(x => x.id === subj);
    const card = i >= 0 && e.doc.getElementById('sig-' + i);
    if (!card) return false;
    const ll = instant && list[i].ll;
    if (ll && w.MapView) { w.MapView.setRotation(ll[1], ll[0]); w.MapView.invalidate(); }
    card.click();
    return true;
  }

  /* ═══ Riyadh scene ══════════════════════════════════════════════════════ */
  function renderScene(e) {
    e.img = h('img', { class: 'wg-fallback', src: e.desc.fallback, alt: '', draggable: 'false', decoding: 'async' });
    e.body = h('div', { class: 'wg-body wg-scene' }, e.img);
    e.el.append(e.body);
    mountLens(e, e.desc.lens);
  }

  /* ═══ Global KPIs ═══════════════════════════════════════════════════════ */
  function renderKpis(e) {
    e.img = h('img', { class: 'wg-fallback', src: e.desc.fallback, alt: '', draggable: 'false', decoding: 'async' });
    e.globe = h('div', { class: 'kpi-globe' }, e.img, h('div', { class: 'kpi-glow', 'aria-hidden': 'true' }));
    const zoom = h('div', { class: 'kpi-zoom', role: 'group', 'aria-label': 'Zoom' },
      btn('plus', 'Zoom in', { onclick: () => zoomGlobe(e, 1) }),
      btn('minus', 'Zoom out', { onclick: () => zoomGlobe(e, -1) }));
    const subj = e.desc.lens && e.desc.lens.subject;
    e.sel = (D.signals.find(s => s.lens && s.lens.subject === subj) || {}).id || selectedSignal;
    e.strip = h('div', { class: 'mm-strip', role: 'listbox', 'aria-label': 'Signals', 'aria-orientation': 'horizontal' });
    e.seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Reading' },
      ...LENSES.map(([id, label]) => h('button', { class: `seg-btn${id === 'location' ? ' is-on' : ''}`, type: 'button', dataset: { lens: id }, 'aria-pressed': String(id === 'location'), onclick: () => setReading(e, id) }, label)));
    const foot = h('div', { class: 'mm-foot' }, h('span', null, 'Signals'), e.seg);
    const mm = h('div', { class: 'mm' }, e.strip, foot);
    e.body = h('div', { class: 'wg-body wg-kpis' },
      h('img', { class: 'kpi-bg', src: 'assets/figma/kpi-bg.jpg', alt: '', draggable: 'false', decoding: 'async' }),
      e.globe, zoom, mm);
    e.el.append(e.body);
    renderStrip(e);
    mountLens(e, e.desc.lens, OPENING_VIEW);
  }
  function thumb(s, cls) {
    if (!s.thumb) return null;
    const src = s.thumb === 'globe' ? 'assets/figma/globe.png' : s.thumb;
    return h('span', { class: cls }, h('img', { class: s.thumb === 'globe' ? 'fit-globe' : '', src, alt: '', decoding: 'async', draggable: 'false' }));
  }
  function renderStrip(e) {
    e.strip.replaceChildren(...D.signals.map(s => h('button', {
      class: `mm-sig${s.thumb ? '' : ' mm-sig--bare'}${s.id === e.sel ? ' is-on' : ''}`, type: 'button', role: 'option',
      dataset: { id: s.id }, 'aria-selected': String(s.id === e.sel), title: s.title,
      onclick: () => pickSignal(e, s.id),
    }, thumb(s, 'sig-thumb ms-thumb'), h('span', { class: 'ms-text' }, h('span', { class: 'sig-title ms-title' }, s.title), h('span', { class: 'sig-meta ms-meta' }, h('b', null, s.place), h('i', { class: 'dot', style: `--dot:${s.dot}` }))))));
  }
  function markStrip(e) {
    for (const b of e.strip.children) { const on = b.dataset.id === e.sel; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', String(on)); }
    const on = e.strip.querySelector('.is-on');
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: REDUCED.matches ? 'auto' : 'smooth' });
  }
  /* a card on the strip re-points the planet: through the Lens's own shelf
     when it is up (no reload), by re-embedding on the subject otherwise */
  function pickSignal(e, id) {
    const s = D.signals.find(x => x.id === id);
    if (!s) return;
    e.sel = id; selectedSignal = id; markStrip(e); markRows();
    const subj = (s.lens && s.lens.subject) || id;
    if (e.ready && e.doc) { try { if (pointAt(e, subj, false)) return; } catch {} }
    else if (e.iframe && !e.failed) { e.pick = subj; return; }     /* still loading: pointed as it lands */
    if (!e.failed) mountLens(e, { subject: subj, lens: currentReading(e) });
  }
  /* one chosen signal for the column: the Signals widget's lit row and every
     KPI strip's chosen card agree, and the planet under the strip turns to it */
  function selectSignal(id) {
    selectedSignal = id; markRows();
    for (const e of live.values()) if (e.kind === 'kpis' && e.sel !== id) pickSignal(e, id);
  }
  const currentReading = e => (e.seg.querySelector('.is-on') || {}).dataset?.lens || 'location';
  function setReading(e, id) {
    for (const b of e.seg.children) { const on = b.dataset.lens === id; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); }
    if (e.ready && e.iframe) { if (!App.lens.setLens(e.iframe, id)) toast('That reading is not available for this signal'); }
    else if (!e.failed && e.iframe) mountLens(e, { subject: subjectOf(e), lens: id });
  }
  const subjectOf = e => { const s = D.signals.find(x => x.id === e.sel); return (s && s.lens && s.lens.subject) || 'taif'; };
  /* the zoom tool turns the same wheel a mouse would, at the window's centre */
  function zoomGlobe(e, dir) {
    if (e.ready && e.doc && e.iframe) {
      try {
        const w = e.doc.defaultView, cv = e.doc.getElementById('world');
        if (cv) {
          const g = e.globe.getBoundingClientRect(), f = e.iframe.getBoundingClientRect();
          /* the frame is shown scaled (twice its window, at half); the wheel
             lands in its own pixels */
          const k = f.width ? w.innerWidth / f.width : 1;
          cv.dispatchEvent(new w.WheelEvent('wheel', { deltaY: -dir * ZOOM_DELTA, deltaMode: 0, clientX: (g.left + g.width / 2 - f.left) * k, clientY: (g.top + g.height / 2 - f.top) * k, bubbles: true, cancelable: true }));
          return;
        }
      } catch {}
    }
    e.zoom = App.clamp(e.zoom * (dir > 0 ? 1.25 : .8), 1, 4);
    e.img.style.transform = e.zoom === 1 ? '' : `scale(${e.zoom.toFixed(3)})`;
  }

  /* ═══ Signals ═══════════════════════════════════════════════════════════ */
  function renderSignals(e) {
    const ids = e.desc.ids && e.desc.ids.length ? e.desc.ids : D.signals.map(s => s.id);
    const rows = ids.map(id => D.signals.find(s => s.id === id)).filter(Boolean);
    if (e.desc.selected) selectedSignal = e.desc.selected;
    e.rows = h('div', { class: 'wsg', role: 'listbox', 'aria-label': 'Signals' }, ...rows.map(s => h('button', {
      class: `wsg-row${s.id === selectedSignal ? ' is-on' : ''}`, type: 'button', role: 'option', dataset: { id: s.id }, 'aria-selected': String(s.id === selectedSignal),
      onclick: () => emit('signal:open', s.id),
    },
      s.thumb ? thumb(s, 'sig-thumb wsg-thumb') : h('span', { class: 'sig-thumb wsg-thumb' }, icon('broadcast', 20)),
      h('span', { class: 'wsg-text' }, h('span', { class: 'sig-title wsg-title' }, s.title), h('span', { class: 'sig-meta wsg-meta' }, h('b', null, s.place), h('i', { class: 'dot', style: `--dot:${s.dot}` }))),
      h('span', { class: 'wsg-side' }, h('span', { class: `badge ${SEVERITY[s.severity] || ''}`.trim() }, s.severity), h('span', { class: 'wsg-when' }, s.when)))));
    e.body = h('div', { class: 'wg-body wg-flow' }, e.rows);
    e.el.append(e.body);
  }
  function markRows() {
    for (const e of live.values()) if (e.kind === 'signals') for (const r of e.rows.children) { const on = r.dataset.id === selectedSignal; r.classList.toggle('is-on', on); r.setAttribute('aria-selected', String(on)); }
  }

  /* ═══ the bar chart ═════════════════════════════════════════════════════
     {title, bars:[[label,value]], unit, max, color, target} → an element. The
     widget draws it 430 wide under its own title; Chat asks for the same
     drawing 736 wide inside a message (Widgets.renderChart), with a head row. */
  function chartEl(d, { head = false, width = 430 } = {}) {
    const bars = d.bars || [], n = bars.length;
    const W = width, TOP = 22, PLOT = 156, BASE = TOP + PLOT, H = BASE + 30, GAP = Math.round(W / 36);
    const max = d.max || Math.max(1, ...bars.map(b => b[1])) * 1.1;
    const bw = n ? (W - GAP * (n - 1)) / n : W;
    const y = v => BASE - PLOT * App.clamp(v / max, 0, 1);
    const fmt = v => (d.unit === '%' ? `${v}%` : String(v));
    const S = (tag, attrs, text) => { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); if (text != null) el.textContent = text; return el; };
    const svg = S('svg', { class: 'ch', viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': `${d.sub || d.title}: ${bars.map(b => `${b[0]} ${fmt(b[1])}`).join(', ')}` });
    bars.forEach(([label, v], i) => {
      const x = i * (bw + GAP), top = Math.min(y(v), BASE - 2), r = Math.min(4, bw / 2);
      const bar = S('path', { class: 'ch-bar', d: `M${x},${BASE} V${top + r} a${r},${r} 0 0 1 ${r},-${r} H${x + bw - r} a${r},${r} 0 0 1 ${r},${r} V${BASE} Z`, fill: d.color || 'var(--info)' });
      bar.append(S('title', {}, `${label} · ${fmt(v)}`));
      svg.append(bar,
        S('text', { class: 'ch-val', x: x + bw / 2, y: top - 6, 'text-anchor': 'middle' }, fmt(v)),
        S('text', { class: 'ch-lab', x: x + bw / 2, y: BASE + 18, 'text-anchor': 'middle' }, label));
    });
    svg.append(S('line', { class: 'ch-base', x1: 0, x2: W, y1: BASE + .5, y2: BASE + .5 }));
    if (d.target != null) {
      const ty = y(d.target);
      svg.append(S('line', { class: 'ch-target', x1: 0, x2: W, y1: ty, y2: ty }),
        S('text', { class: 'ch-target-lab', x: W, y: ty - 4, 'text-anchor': 'end' }, `Target ${fmt(d.target)}`));
    }
    const unit = d.unit && d.unit !== '%' ? d.unit : (d.unit === '%' ? 'per cent' : '');
    return h('div', { class: `ch-box${head ? ' ch-box--head' : ''}` },
      head ? h('div', { class: 'ch-head' }, h('span', null, d.title), unit ? h('small', null, unit) : null) : null,
      svg,
      head ? null : h('div', { class: 'ch-legend' }, h('i', { style: `--sw:${d.color || 'var(--info)'}` }), h('span', null, unit ? `${d.sub || d.title} · ${unit}` : (d.sub || d.title))));
  }
  function renderChart(e) {
    const d = e.desc;
    e.body = h('div', { class: 'wg-body wg-flow' }, d.sub ? h('div', { class: 'wg-sub' }, d.sub) : null, chartEl(d));
    e.el.append(e.body);
  }
  /* for a message in the thread: the block as it is, with its head row */
  const renderChartBlock = b => chartEl(Object.assign({}, b, { title: b.title || 'Chart' }), { head: true, width: b.width || 736 });

  /* ═══ the action package ═══════════════════════════════════════════════ */
  function renderActions(e) {
    const pkg = e.desc.items ? e.desc : D.actionPackage;
    const cards = pkg.items.map((it, i) => {
      const commit = h('button', { class: 'btn btn-white', type: 'button', 'aria-label': `Commit: ${it.text}` }, 'Commit');
      commit.addEventListener('click', () => {
        if (commit.dataset.done) return;
        commit.dataset.done = '1'; commit.textContent = 'Committed'; commit.setAttribute('aria-disabled', 'true');
        toast(`Committed · ${it.owner}`, { action: 'Undo', onAction: () => { delete commit.dataset.done; commit.textContent = 'Commit'; commit.removeAttribute('aria-disabled'); } });
        emit('console:log', { tool: 'measure.commit', args: `#${i + 1} · owner=${it.owner}`, ms: 64 });
      });
      return h('div', { class: 'ac-card' },
        h('div', { class: 'ac-text' }, it.text),
        h('div', { class: 'ac-row' }, h('span', { class: 'chip' }, it.scope), h('span', { class: 'ac-mono' }, `${it.when} · ${it.owner}`)),
        h('div', { class: 'ac-effect' }, it.effect),
        h('div', { class: 'ac-foot' }, h('small', null, `Measure ${i + 1} of ${pkg.items.length}`), commit));
    });
    e.body = h('div', { class: 'wg-body wg-flow' }, h('div', { class: 'ac' }, pkg.intro ? h('div', { class: 'ac-intro' }, pkg.intro) : null, ...cards));
    e.el.append(e.body);
  }

  /* ═══ fullscreen ════════════════════════════════════════════════════════
     The widget itself travels: a state-preserving move (moveBefore) where the
     browser has it, a pinned box over the same frame where it does not — a
     reparented iframe reloads, and the street capture is 36 MB and a WebGL
     context. A placeholder of its height keeps the feed still. ══════════ */
  function expand(id) {
    const e = live.get(id);
    if (!e || !fs) return;
    if (state.full === id) return;
    if (state.full) collapse(true);
    const first = e.el.getBoundingClientRect();
    e.ph = h('div', { class: 'wg-ph', dataset: { for: id }, 'aria-hidden': 'true', style: { height: Math.round(first.height) + 'px' } });
    e.el.before(e.ph);
    fs.hidden = false;
    e.savedH = e.el.style.getPropertyValue('--wg-h');
    e.el.style.removeProperty('--wg-h');
    if (typeof fs.moveBefore === 'function') { fs.moveBefore(e.el, null); e.moved = true; }
    else { pin(e); e.moved = false; }
    e.el.classList.add('is-full');
    markExpand(e, true);
    set('full', id);
    flip(e.el, first, e.el.getBoundingClientRect());
    e.btnExpand.focus({ preventScroll: true });
    emit('console:log', { tool: 'widget.expand', args: `${id} · 1470×1048`, ms: 12 });
  }
  function pin(e) {
    const r = fs.getBoundingClientRect();
    e.el.classList.add('is-pinned');
    col.classList.add('is-pinning');
    Object.assign(e.el.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }
  function collapse(silent) {
    const id = state.full;
    const e = id && live.get(id);
    if (!e) { if (state.full != null) set('full', null); if (fs) fs.hidden = true; return; }
    const finish = () => {
      if (e.moved) { if (e.ph && e.ph.isConnected) col.moveBefore(e.el, e.ph); else col.append(e.el); }
      else { e.el.classList.remove('is-pinned'); col.classList.remove('is-pinning'); for (const k of ['left', 'top', 'width', 'height']) e.el.style.removeProperty(k); if (e.ph && e.ph.isConnected) e.ph.before(e.el); }
      if (e.ph) e.ph.remove(); e.ph = null;
      if (e.savedH) e.el.style.setProperty('--wg-h', e.savedH);
      e.el.classList.remove('is-full');
      e.el.style.transform = ''; e.el.style.transition = ''; e.el.style.transformOrigin = '';
      markExpand(e, false);
      if (!fs.querySelector('.wg')) fs.hidden = true;
      e.btnExpand.focus({ preventScroll: true });
    };
    set('full', null);
    if (silent || REDUCED.matches || !e.ph) { finish(); return; }
    /* shrink into the slot the placeholder is holding, then take it */
    const from = e.el.getBoundingClientRect(), to = e.ph.getBoundingClientRect();
    e.el.style.transformOrigin = '0 0';
    e.el.style.transition = 'transform .24s var(--ease),opacity .24s var(--ease)';
    e.el.style.transform = `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width},${to.height / from.height})`;
    let done = false;
    const end = () => { if (done) return; done = true; e.el.removeEventListener('transitionend', end); finish(); };
    e.el.addEventListener('transitionend', end);
    setTimeout(end, 300);
  }
  /* FLIP: the widget is already in its new box; it starts drawn where it was */
  function flip(el, first, last) {
    if (REDUCED.matches) return;
    el.style.transition = 'none';
    el.style.transformOrigin = '0 0';
    el.style.transform = `translate(${first.left - last.left}px,${first.top - last.top}px) scale(${first.width / last.width},${first.height / last.height})`;
    el.getBoundingClientRect();
    el.style.transition = 'transform .24s var(--ease)';
    el.style.transform = '';
    let done = false;
    const end = () => { if (done) return; done = true; el.removeEventListener('transitionend', end); el.style.transition = ''; el.style.transformOrigin = ''; };
    el.addEventListener('transitionend', end);
    setTimeout(end, 320);
  }

  /* the Signals widget for a signal:open, built once wherever the event lands */
  function showSignal(id, focus) {
    pendingSignal = null; clearTimeout(pendingTimer);
    open('signals', { source: 'signal', focus });
    selectSignal(id);
  }

  /* ---- boot ---------------------------------------------------------------------------- */
  function init() {
    col = document.getElementById('widgets');
    fs = document.getElementById('fullscreen');
    if (!col || !fs) return;
    syncEmpty();
    on('route', r => {
      if (r.name !== 'chat') { if (state.full) collapse(true); return; }
      const chatId = r.isNew ? null : state.chatId;
      const chat = chatId && D.chats[chatId];
      const ids = chatId ? (memory[chatId] || (chat && chat.widgets) || []) : [];
      if (chatId !== currentChat || live.size !== ids.length || ids.some((id, i) => list()[i] !== id)) setFor(chatId, ids);
      /* a signal opened a moment ago travels with the thread Chat switches to */
      if (pendingSignal && Date.now() - pendingSignal.at < SIGNAL_GRACE && chatId) showSignal(pendingSignal.id, false);
      pendingSignal = null;
    });
    on('widget:open', d => {
      if (!d || d.from === 'widgets') return;
      const what = typeof d === 'string' ? d : (d.descriptor || d.widget || d.id || d);
      open(what, { source: d.source || 'agent', focus: d.focus !== false });
    });
    on('widget:close', d => { if (d && d.from !== 'widgets' && d.id && live.has(d.id)) close(d.id, { quiet: !!d.quiet }); });
    on('signal:open', id => {
      const sid = typeof id === 'string' ? id : id && id.id;
      if (!sid || !D.signals.some(s => s.id === sid)) return;
      selectSignal(sid);
      /* Chat answers the same event by opening the signal's own thread, and the
         Signals widget is built there, once, when that route lands (above).
         Building it here first put one in the thread being left — remembered
         under it, and torn down by setFor a moment later. A signal no thread
         comes for is shown in the column that is up. */
      pendingSignal = { id: sid, at: Date.now() };
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => {
        if (pendingSignal && pendingSignal.id === sid && state.page === 'chat') showSignal(sid, true);
        else pendingSignal = null;
      }, SIGNAL_GRACE);
    });
    on('esc', () => { if (state.full) collapse(); });
    window.addEventListener('resize', () => { const e = state.full && live.get(state.full); if (e && !e.moved) pin(e); });
    /* a widget carried into fullscreen keeps its keyboard: Esc there too */
    fs.addEventListener('keydown', ev => { if (ev.key === 'Escape') { ev.stopPropagation(); collapse(); } });
  }

  /* the seed for a KPI widget's strip is the first signal, the Taif ride */
  const sel = () => selectedSignal;

  return { init, open, close, expand, collapse, setFor, has, list, renderChart: renderChartBlock, get selected() { return sel(); }, _live: live };
})();
