/* =============================================================================
   app.js — the shell. State, the router, the DOM helpers every module shares,
   menus / popovers / toasts / the command palette, the two sidebars, and the
   embedding of the Lens page. Modules (chat, widgets, library, pages, orb,
   timeline) hang off `App` and are booted from here once they are all defined.
   ============================================================================= */
window.App = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement;
  const SVG = 'http://www.w3.org/2000/svg';
  const SPRITE = 'assets/icons/sprite.svg#i-';

  /* ---- a small hyperscript --------------------------------------------------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      /* custom properties only take through setProperty; a null/undefined value is "not set", never the string */
      else if (k === 'style' && typeof v === 'object') for (const [p, val] of Object.entries(v)) { if (val == null) continue; if (p.startsWith('--')) el.style.setProperty(p, val); else el.style[p] = val; }
      else if (k === 'dataset') for (const [d, val] of Object.entries(v)) { if (val != null) el.dataset[d] = val; }
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  /* two glyphs the frame draws that Phosphor has no weight for: a solid ~4px disc (a chat item's
     signal) and three of them (the More item) — r24 circles in the 256 box, measured at 12× */
  const SOLID = { 'dot-solid': [128], 'dots-three-solid': [48, 128, 208] };
  function icon(name, size = 20, cls = '') {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', `ic ic${size} ${cls}`.trim());
    svg.setAttribute('aria-hidden', 'true');
    if (SOLID[name]) {
      svg.setAttribute('viewBox', '0 0 256 256');
      for (const cx of SOLID[name]) { const c = document.createElementNS(SVG, 'circle'); c.setAttribute('cx', cx); c.setAttribute('cy', 128); c.setAttribute('r', 24); svg.appendChild(c); }
      return svg;
    }
    const use = document.createElementNS(SVG, 'use');
    use.setAttribute('href', SPRITE + name);
    svg.appendChild(use);
    return svg;
  }
  const btn = (name, label, opts = {}) => h('button', Object.assign({ class: `btn-ghost ${opts.size === 28 ? 'btn28' : opts.size === 48 ? 'btn48' : 'btn36'} ${opts.class || ''}`.trim(), type: 'button', 'aria-label': label, title: opts.title || label, onclick: opts.onclick }, opts.attrs || {}), icon(name, opts.size === 28 ? 16 : opts.size === 48 ? 24 : 20));

  /* ---- events ----------------------------------------------------------------- */
  const bus = new EventTarget();
  const on = (ev, fn) => { const f = e => fn(e.detail, e); bus.addEventListener(ev, f); return () => bus.removeEventListener(ev, f); };
  const emit = (ev, detail) => bus.dispatchEvent(new CustomEvent(ev, { detail }));

  /* ---- state ------------------------------------------------------------------ */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('axion:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('axion:' + k, JSON.stringify(v)); } catch {} },
  };
  const urlConcept = new URLSearchParams(location.search).get('concept');   /* a link that names the layout wins over what was stored */
  const state = {
    page: 'chat', chatId: null, projectId: 'ksa', route: '',
    concept: urlConcept === 'agent' || urlConcept === 'gen' ? urlConcept : store.get('concept', 'gen'),
    widgets: true, rail: true, sidebar: true, full: null, orb: false, console: false,
    model: store.get('model', 'gpt56'),
  };
  function set(key, value) {
    state[key] = value;
    if (['concept', 'page', 'full', 'orb', 'console'].includes(key)) html.dataset[key] = value == null ? 'off' : (typeof value === 'boolean' ? (value ? 'on' : 'off') : value);
    if (['widgets', 'rail', 'sidebar'].includes(key)) html.dataset[key] = value ? 'on' : 'off';
    if (key === 'concept') store.set('concept', value);
    if (key === 'model') store.set('model', value);
    emit('state', { key, value });
  }

  /* ---- the router ---------------------------------------------------------------- */
  const pages = {};
  const registerPage = (name, api) => { pages[name] = api; };
  let current = null;
  const decode = s => { try { return decodeURIComponent(s); } catch { return s; } };   /* a stray % in a shared link must not brick the boot */
  function parse(hash) {
    const m = /^#\/([a-z-]+)(?:\/([^?]+))?/.exec(hash || '');
    return m ? { name: m[1], param: m[2] ? decode(m[2]) : null } : { name: 'chat', param: null };
  }
  function route() {
    const r = parse(location.hash);
    let name = r.name;
    if (name === 'new') name = 'chat';
    if (!pages[name]) name = 'chat';
    if (current && current !== name && pages[current].hide) pages[current].hide();
    set('page', name);
    state.route = location.hash;
    if (name === 'chat') state.chatId = r.name === 'new' ? null : (r.param || state.chatId || firstChat());
    $$('.page').forEach(p => { p.hidden = p.dataset.page !== name; });
    if (pages[name].show) pages[name].show(r.name === 'new' ? null : r.param, r);
    current = name;
    syncNav();
    emit('route', { name, param: r.param, isNew: r.name === 'new' });
  }
  const go = hash => { if (location.hash === hash) route(); else location.hash = hash; };
  const firstChat = () => 'ksa-accident-distribution-for-august';

  /* pages are sections with data-page; the simple ones share one section */
  $$('.page').forEach(p => { p.dataset.page = p.id === 'pageChat' ? 'chat' : p.id === 'pageLibrary' ? 'library' : p.id === 'pageFocus' ? 'focus' : 'simple'; });
  const simpleNames = ['scheduled', 'signals', 'dashboards', 'users', 'settings'];
  /* defaults, so the shell stands on its own; the modules re-register these with real bodies */
  registerPage('chat', {});
  registerPage('library', {});

  /* the Focus page: the Lens, whole — mounted when shown and let go when left, so a planet nobody
     is looking at keeps no WebGL context alive (§5: never more than two frames; `agent=off` keeps
     the Lens from probing for an agent proxy this page does not run) */
  registerPage('focus', {
    show() { const f = $('#focusFrame'); const src = lens.url({ subject: 'taif', lens: 'location', agent: 'off' }); if (f.getAttribute('src') !== src) f.src = src; },
    hide() { const f = $('#focusFrame'); if (f.getAttribute('src')) f.src = 'about:blank'; },
  });

  /* the rail's first stop is the agent's workspace, and everything the project sidebar reaches lives
     in it — the Library frame keeps Axi lit with the table open; only Focus, Boards and People are their own */
  const AXI_PAGES = ['chat', 'library', 'scheduled', 'signals', 'settings'];
  function mark(b, on) { b.classList.toggle('is-on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
  function syncNav() {
    const name = state.page;
    $$('.rail-btn[data-nav]').forEach(b => mark(b, b.dataset.nav === 'chat' ? AXI_PAGES.includes(name) : b.dataset.nav === name && !AXI_PAGES.includes(name)));
    $$('.sb-item[data-nav]').forEach(b => mark(b, b.dataset.nav === name || (b.dataset.nav === 'new' && name === 'chat' && !state.chatId)));
    $$('.sb-chat').forEach(b => mark(b, name === 'chat' && b.dataset.chat === state.chatId));
  }

  /* ---- the project sidebar ----------------------------------------------------------- */
  const navGen = [
    { label: 'New', icon: 'plus', go: '#/new', nav: 'new' },
    { label: 'Library', icon: 'books-plain', go: '#/library', nav: 'library' },
    { label: 'Scheduled', icon: 'clock-countdown', go: '#/scheduled', nav: 'scheduled' },
    { label: 'More', icon: 'dots-three-solid', menu: true, nav: 'more' },
  ];
  const navAgent = [
    { label: 'New', icon: 'plus', go: '#/new', nav: 'new' },
    { label: 'Home', icon: 'house-simple', go: '#/chat', nav: 'chat' },
    { label: 'Library', icon: 'books-plain', go: '#/library', nav: 'library' },
    { label: 'Dashboards', icon: 'cards', go: '#/dashboards', nav: 'dashboards' },
    { label: 'Users', icon: 'user', go: '#/users', nav: 'users' },
  ];
  const dotColor = d => ({ info: 'var(--info)', positive: 'var(--positive)', warning: 'var(--warning)', negative: 'var(--negative)', ghost: 'var(--dot-ghost)' })[d] || d;
  const openSections = store.get('sections', {});

  function renderSidebar() {
    const nav = $('#sbNav'); nav.replaceChildren();
    for (const it of (state.concept === 'agent' ? navAgent : navGen)) {
      nav.append(h('button', { class: 'sb-item', type: 'button', dataset: { nav: it.nav }, onclick: e => { if (it.menu) return moreMenu(e.currentTarget); go(it.go); if (NARROW_S.matches) set('sidebar', false); } },
        icon(it.icon, 24), h('span', null, it.label)));
    }
    const scroll = $('#sbScroll'); scroll.replaceChildren();
    for (const p of DATA.projects) {
      const open = openSections[p.id] !== false;
      /* the head is two controls side by side — the title folds the section, the plus starts a chat —
         never one button inside another */
      const sec = h('div', { class: 'sb-section', dataset: { open: String(open), project: p.id } },
        h('div', { class: 'sb-section-head' },
          h('button', { class: 'sb-section-title', type: 'button', 'aria-expanded': String(open), onclick: () => toggleSection(sec, p.id) }, p.name),
          h('button', { class: 'sb-section-add', type: 'button', 'aria-label': `New chat in ${p.name}`, onclick: () => { state.projectId = p.id; go('#/new'); } }, icon('plus', 16))),
        ...p.chats.map(id => {
          const c = DATA.chats[id];
          /* a signal is a solid disc in its colour; a ghost one is Phosphor's ring (§2, and the frame at 12×) */
          return h('button', { class: 'sb-chat', type: 'button', dataset: { chat: id }, style: { '--dot': dotColor(c.dot) }, title: c.title, onclick: () => { go('#/chat/' + id); if (NARROW_S.matches) set('sidebar', false); } },
            icon(c.dot === 'ghost' ? 'dot-outline' : 'dot-solid', 20), h('span', null, c.title));
        }));
      scroll.append(sec);
    }
    syncNav();
  }
  function toggleSection(sec, id) {
    const open = sec.dataset.open !== 'true';
    sec.dataset.open = String(open); $('.sb-section-title', sec).setAttribute('aria-expanded', String(open));
    openSections[id] = open; store.set('sections', openSections);
  }

  function moreMenu(anchor) {
    menu(anchor, [
      { label: 'Signals', icon: 'broadcast', onSelect: () => go('#/signals') },
      { label: 'Dashboards', icon: 'cards', onSelect: () => go('#/dashboards') },
      { label: 'People', icon: 'user', onSelect: () => go('#/users') },
      { sep: true },
      { label: 'Agent‑centric layout', icon: 'sparkle', switch: true, checked: state.concept === 'agent', onSelect: () => setConcept(state.concept === 'agent' ? 'gen' : 'agent'), small: 'concept' },
      { label: 'Keyboard shortcuts', icon: 'keyboard', kbd: '?', onSelect: () => shortcuts() },
      { label: 'Settings', icon: 'gear', onSelect: () => go('#/settings') },
    ], { side: 'bottom', align: 'left' });
  }
  function setConcept(c) { set('concept', c); renderSidebar(); toast(c === 'agent' ? 'Agent‑centric layout — the whole of Axion inside the chat. Just a concept.' : 'Back to Axion Gen'); }

  /* ---- menus, popovers, toasts ------------------------------------------------------------ */
  const layer = () => $('#layer');
  let openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.remove(); openMenu = null; document.removeEventListener('pointerdown', outside, true); } }
  function outside(e) { if (openMenu && !openMenu.contains(e.target) && !(openMenu._anchor && openMenu._anchor.contains(e.target))) closeMenu(); }
  function place(el, anchor, opts = {}) {
    const r = anchor.getBoundingClientRect();
    document.body.offsetHeight; /* layout, so the size is known */
    const w = el.offsetWidth, hgt = el.offsetHeight, gap = opts.gap ?? 6;
    let left = opts.align === 'right' ? r.right - w : r.left;
    let top = opts.side === 'top' ? r.top - gap - hgt : r.bottom + gap;
    if (opts.side === 'top' && top < 8) top = r.bottom + gap;
    if (opts.side !== 'top' && top + hgt > innerHeight - 8) top = Math.max(8, r.top - gap - hgt);
    left = Math.min(Math.max(8, left), innerWidth - w - 8);
    el.style.left = left + 'px'; el.style.top = top + 'px';
    el.dataset.origin = (opts.side === 'top' ? 'bottom' : 'top') + '-' + (opts.align === 'right' ? 'right' : 'left');
  }
  /* items: {label, icon, kbd, small, checked, switch, danger, sep, title, onSelect, keep} */
  function menu(anchor, items, opts = {}) {
    if (openMenu && openMenu._anchor === anchor) { closeMenu(); return null; }
    closeMenu();
    const el = h('div', { class: 'menu', role: 'menu', style: { minWidth: (opts.width || 220) + 'px' } });
    for (const it of items) {
      if (it.sep) { el.append(h('div', { class: 'menu-sep' })); continue; }
      if (it.title) { el.append(h('div', { class: 'menu-title' }, it.title)); continue; }
      const row = h('button', { class: `menu-item ${it.danger ? 'is-danger' : ''} ${it.active ? 'is-active' : ''}`.trim(), type: 'button', role: it.switch || it.checked != null ? 'menuitemcheckbox' : 'menuitem',
        'aria-checked': it.switch || it.checked != null ? String(!!it.checked) : null, dataset: it.switch ? { switch: '1' } : null,
        onclick: () => { if (!it.keep) closeMenu(); it.onSelect && it.onSelect(); } },
        it.checked != null && !it.switch ? icon('check', 16, 'check') : null,
        it.icon ? icon(it.icon, 16) : null,
        h('span', null, it.label),
        it.small ? h('small', null, it.small) : null,
        it.kbd ? h('kbd', null, it.kbd) : null,
        it.switch ? h('i', { class: 'switch' }) : null);
      el.append(row);
    }
    el._anchor = anchor; anchor.setAttribute && anchor.setAttribute('aria-expanded', 'true');
    layer().append(el); place(el, anchor, opts);
    openMenu = el;
    el.addEventListener('remove', () => anchor.setAttribute && anchor.setAttribute('aria-expanded', 'false'));
    const obs = new MutationObserver(() => { if (!el.isConnected) { anchor.setAttribute && anchor.setAttribute('aria-expanded', 'false'); obs.disconnect(); } });
    obs.observe(layer(), { childList: true });
    setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
    return { close: closeMenu, el };
  }
  /* a popover with a title row, a body and (optionally) a foot */
  function popover(anchor, { title, body, foot, width = 320, align = 'right', side = 'bottom', onClose }) {
    closeMenu();
    const el = h('div', { class: 'pop', role: 'dialog', 'aria-label': title, style: { width: width + 'px' } },
      h('div', { class: 'pop-head' }, h('span', null, title), btn('x', 'Close', { size: 28, onclick: () => closeMenu() })),
      h('div', { class: 'pop-body' }, body),
      foot ? h('div', { class: 'pop-foot' }, foot) : null);
    el._anchor = anchor; layer().append(el); place(el, anchor, { align, side });
    openMenu = el;
    if (onClose) { const obs = new MutationObserver(() => { if (!el.isConnected) { onClose(); obs.disconnect(); } }); obs.observe(layer(), { childList: true }); }
    setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
    return { close: closeMenu, el };
  }
  function toast(text, opts = {}) {
    let box = $('.toasts', layer()); if (!box) { box = h('div', { class: 'toasts' }); layer().append(box); }
    const t = h('div', { class: 'toast', role: 'status' }, h('span', null, text),
      opts.action ? h('button', { class: 'btn btn-white', type: 'button', onclick: () => { opts.onAction && opts.onAction(); t.remove(); } }, opts.action) : null,
      btn('x', 'Dismiss', { size: 28, onclick: () => t.remove() }));
    box.append(t);
    setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, opts.duration || 5200);
    return t;
  }

  /* ---- the command palette ----------------------------------------------------------------- */
  function paletteItems() {
    const items = [];
    for (const p of DATA.projects) for (const id of p.chats) { const c = DATA.chats[id]; items.push({ label: c.title, small: p.name, icon: 'chat-circle', go: '#/chat/' + id, kind: 'chat' }); }
    items.push({ label: 'New chat', icon: 'plus', go: '#/new', kbd: '⌘N' }, { label: 'Library', icon: 'books-plain', go: '#/library' }, { label: 'Scheduled', icon: 'clock-countdown', go: '#/scheduled' },
      { label: 'Signals', icon: 'broadcast', go: '#/signals' }, { label: 'Dashboards', icon: 'cards', go: '#/dashboards' }, { label: 'People', icon: 'user', go: '#/users' }, { label: 'Focus mode', icon: 'house-simple', go: '#/focus' },
      { label: 'Talk to Axi', icon: 'microphone', run: () => emit('orb:open', { listen: true }), kbd: '⌘⇧A' },
      { label: 'Agent console', icon: 'terminal', run: () => emit('console:toggle'), kbd: '⌘J' },
      { label: state.concept === 'agent' ? 'Back to Axion Gen layout' : 'Agent‑centric layout (concept)', icon: 'sparkle', run: () => setConcept(state.concept === 'agent' ? 'gen' : 'agent') },
      { label: state.widgets ? 'Hide widgets' : 'Show widgets', icon: 'cards', run: () => set('widgets', !state.widgets) });
    for (const s of DATA.signals.slice(0, 4)) items.push({ label: s.title, small: s.place, icon: 'broadcast', run: () => emit('signal:open', s.id), kind: 'signal' });
    for (const d of DATA.library.datasets) items.push({ label: d, small: 'Library', icon: 'table', go: '#/library/' + d });
    return items;
  }
  let paletteOpen = null;                      /* the one palette, while it is up — ⌘K again only refocuses it */
  function palette() {
    if (paletteOpen) { paletteOpen.field.focus(); return paletteOpen; }
    closeMenu();
    const scrim = h('div', { class: 'palette-scrim', onclick: () => close() });
    const field = h('input', { class: 'palette-field', type: 'text', placeholder: 'Search chats, projects, pages, signals…', 'aria-label': 'Search' });
    const list = h('div', { class: 'palette-list', role: 'listbox' });
    const el = h('div', { class: 'palette', role: 'dialog', 'aria-label': 'Search' }, h('div', { class: 'palette-head' }, icon('magnifying-glass', 20), field, h('kbd', { class: 'menu-item kbd' }, 'esc')), list);
    const all = paletteItems(); let sel = 0, shown = [];
    function render() {
      const q = field.value.trim().toLowerCase();
      shown = (q ? all.filter(i => (i.label + ' ' + (i.small || '')).toLowerCase().includes(q)) : all).slice(0, 14);
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.replaceChildren(...(shown.length ? shown.map((it, i) => h('button', { class: `menu-item ${i === sel ? 'is-active' : ''}`, type: 'button', role: 'option', 'aria-selected': String(i === sel), onmouseenter: () => { sel = i; render(); }, onclick: () => pick(it) },
        icon(it.icon || 'arrow-right', 16), h('span', null, it.label), it.small ? h('small', null, it.small) : null, it.kbd ? h('kbd', null, it.kbd) : null)) : [h('div', { class: 'palette-empty' }, 'Nothing matches.')]));
    }
    function pick(it) { close(); it.go ? go(it.go) : it.run && it.run(); }
    function close() { scrim.remove(); el.remove(); document.removeEventListener('keydown', key, true); paletteOpen = null; }
    function key(e) {
      /* the palette's keys stop here: an Esc that closed it must not go on to fold a fullscreen
         widget, hush the orb or shut the Library panel underneath */
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (shown.length) sel = (sel + 1) % shown.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) sel = (sel - 1 + shown.length) % shown.length; render(); }
      else if (e.key === 'Enter') { e.preventDefault(); shown[sel] && pick(shown[sel]); }
    }
    field.addEventListener('input', () => { sel = 0; render(); });
    document.addEventListener('keydown', key, true);
    layer().append(scrim, el); render(); field.focus();
    paletteOpen = { close, field, el };
    return paletteOpen;
  }
  function shortcuts() {
    const rows = [['⌘ K', 'Search everything'], ['⌘ J', 'Agent console'], ['⌘ ⇧ A', 'Talk to Axi'], ['⌘ N', 'New chat'], ['/', 'Focus the composer'], ['Esc', 'Close whatever is open'], ['⌘ \\', 'Hide the sidebar'], ['⌘ .', 'Hide the widgets']];
    const body = h('div', null, ...rows.map(([k, l]) => h('div', { class: 'pop-row' }, h('span', null, l), h('small', null, h('kbd', { class: 'kbd' }, k)))));
    popover($('#sbNav') || document.body, { title: 'Keyboard shortcuts', body, width: 300, align: 'left' });
  }

  /* ---- the Lens, embedded --------------------------------------------------------------------
     lens/focus.html is the real product screen. A widget shows one reading of it by loading
     the page in a same‑origin iframe and, once it is up, hiding everything but the stage. */
  const EMBED_CSS = `
    .rail,.assistant,.col,.dock,.headers,.askbar,.scale-bar,#railPeek,.scene-note,.globe-tip,.scene-card,.pane-strip{display:none!important}
    .shell{inset:0!important}.stage-free{left:0!important;right:0!important;top:0!important;bottom:0!important}
    .work{pointer-events:auto!important}.stage{pointer-events:none}
    #world{cursor:grab}
    html,body{overflow:hidden;background:transparent!important}
  `;
  const lens = {
    /* `agent=off`: this page runs no agent proxy, and a Lens left to look for one makes two failed
       requests per frame (§5: no network calls at runtime) */
    url(params) { return 'lens/focus.html?' + new URLSearchParams(Object.assign({ subject: 'taif', speak: 'off', agent: 'off' }, params || {})).toString(); },
    /* returns a cleanup; calls onReady(doc) or onFail(reason) exactly once */
    embed(iframe, params, { onReady, onFail, timeout = 12000 } = {}) {
      let done = false;
      const fail = why => { if (done) return; done = true; onFail && onFail(why); };
      const ready = doc => { if (done) return; done = true; onReady && onReady(doc); };
      const timer = setTimeout(() => fail('timeout'), timeout);
      iframe.addEventListener('load', () => {
        try {
          const d = iframe.contentDocument;
          if (!d || !d.getElementById('stageFree')) return fail('not the lens');
          const s = d.createElement('style'); s.textContent = EMBED_CSS; d.head.appendChild(s);
          d.documentElement.dataset.embed = params && params.lens || 'location';
          clearTimeout(timer); ready(d);
        } catch (e) { clearTimeout(timer); fail(e); }
      }, { once: true });
      iframe.addEventListener('error', () => { clearTimeout(timer); fail('error'); }, { once: true });
      iframe.src = lens.url(params);
      return () => { clearTimeout(timer); done = true; };
    },
    /* the lens page can be told which reading to show without a reload */
    setLens(iframe, lensId) {
      try { const w = iframe.contentWindow; if (w && w.FOCUS && w.FOCUS.setLens) { w.FOCUS.setLens(lensId); return true; } } catch {}
      try { const d = iframe.contentDocument; const b = d && d.querySelector(`#lensTabs [data-lens="${lensId}"],#lensTabs button[data-id="${lensId}"]`); if (b) { b.click(); return true; } } catch {}
      return false;
    },
  };

  /* ---- helpers ------------------------------------------------------------------------------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ago = t => { const s = Math.max(1, Math.round((Date.now() - t) / 1000)); return s < 60 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min ago` : s < 86400 ? `${Math.round(s / 3600)} h ago` : `${Math.round(s / 86400)} d ago`; };
  const project = id => DATA.projects.find(p => p.id === (id || state.projectId));
  const chat = id => DATA.chats[id || state.chatId];
  /* one polite live region for the page: modules hand it finished sentences (a reply that has landed,
     a widget that opened) rather than streaming a paragraph word by word through aria-live */
  let announceTimer = 0;
  function announce(text) {
    const el = $('#announce'); if (!el) return;
    clearTimeout(announceTimer); el.textContent = '';
    announceTimer = setTimeout(() => { el.textContent = String(text); }, 50);
  }

  /* ---- keyboard -------------------------------------------------------------------------------- */
  function keys(e) {
    const inField = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); palette(); return; }
    if (mod && e.key.toLowerCase() === 'j') { e.preventDefault(); emit('console:toggle'); return; }
    if (mod && e.key.toLowerCase() === 'n') { e.preventDefault(); go('#/new'); return; }
    if (mod && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); emit('orb:open', { listen: true }); return; }
    if (mod && e.key === '\\') { e.preventDefault(); set('sidebar', !state.sidebar); return; }
    if (mod && e.key === '.') { e.preventDefault(); set('widgets', !state.widgets); $('#btnWidgets').setAttribute('aria-pressed', String(state.widgets)); return; }
    if (e.key === 'Escape') { if (paletteOpen) { paletteOpen.close(); return; } if (openMenu) { closeMenu(); return; }
      /* a drawer the window is too narrow to keep open folds on Esc before anything behind it hears the key */
      if (NARROW_W.matches && state.widgets) { set('widgets', false); return; } if (NARROW_S.matches && state.sidebar) { set('sidebar', false); return; }
      emit('esc'); return; }
    if (!inField && !mod && e.key === '/') {
      e.preventDefault();
      const focusField = () => { const f = $('#askField'); if (f) f.focus(); };
      if (state.page === 'chat') focusField();
      else { const off = on('route', () => { off(); setTimeout(focusField, 0); }); go('#/chat'); }   /* the field is hidden until the route lands */
      return;
    }
    if (!inField && !mod && e.key === '?') { e.preventDefault(); shortcuts(); }
  }

  /* ---- boot ------------------------------------------------------------------------------------- */
  /* a window narrower than a column can afford folds that column away — and unfolds it on growing back */
  const NARROW_W = matchMedia('(max-width:1319px)'), NARROW_S = matchMedia('(max-width:999px)');
  function boot() {
    html.dataset.concept = state.concept;
    set('widgets', !NARROW_W.matches); set('sidebar', !NARROW_S.matches);
    NARROW_W.addEventListener('change', () => set('widgets', !NARROW_W.matches));
    NARROW_S.addEventListener('change', () => set('sidebar', !NARROW_S.matches));
    renderSidebar();
    $('#sbSearch').addEventListener('click', palette);
    $('#sbCollapse').addEventListener('click', () => set('sidebar', false));
    $('#sidebarPeek').addEventListener('click', () => set('sidebar', true));
    $('#railCollapse').addEventListener('click', () => set('rail', false));
    $('#railPeek').addEventListener('click', () => set('rail', true));
    $('#railAvatar').addEventListener('click', e => menu(e.currentTarget, [
      { title: `${DATA.user.name} · ${DATA.user.email}` },
      { label: 'Profile', icon: 'user', onSelect: () => go('#/users') },
      { label: 'Settings', icon: 'gear', onSelect: () => go('#/settings') },
      { label: 'Agent‑centric layout', icon: 'sparkle', switch: true, checked: state.concept === 'agent', onSelect: () => setConcept(state.concept === 'agent' ? 'gen' : 'agent') },
      { sep: true }, { label: 'Sign out', icon: 'arrow-square-out', onSelect: () => toast('This is a demo — nobody is signed in.') },
    ], { side: 'top', align: 'left' }));
    $('#sbProfile').addEventListener('click', e => menu(e.currentTarget, [
      { title: DATA.user.org }, { label: 'Profile', icon: 'user', onSelect: () => go('#/users') }, { label: 'Settings', icon: 'gear', onSelect: () => go('#/settings') },
      { label: 'Back to Axion Gen layout', icon: 'sparkle', onSelect: () => setConcept('gen') },
    ], { side: 'top', align: 'left' }));
    $$('[data-go]').forEach(b => { if (!b.classList.contains('sb-item')) b.addEventListener('click', () => go(b.dataset.go)); });
    document.addEventListener('keydown', keys);
    window.addEventListener('hashchange', route);
    for (const name of simpleNames) if (!pages[name]) registerPage(name, { show: () => { $('#pageSimple').replaceChildren(h('div', { class: 'simple-empty' }, name)); } });
    for (const m of [window.Timeline, window.Widgets, window.Chat, window.Library, window.Pages, window.Orb]) { try { m && m.init && m.init(); } catch (e) { console.error(e); } }
    route();
    emit('boot');
  }
  document.addEventListener('DOMContentLoaded', boot);

  return { $, $$, h, icon, btn, on, emit, state, set, store, go, route, registerPage, renderSidebar, setConcept, menu, popover, closeMenu, toast, palette, shortcuts, announce, lens, sleep, escapeHtml, clamp, ago, project, chat, dotColor, DATA: window.DATA };
})();
