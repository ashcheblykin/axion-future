/* =============================================================================
   pages.js — the simple pages: Scheduled · Signals · Dashboards · People ·
   Settings. Each is registered with the router (App.registerPage) and renders
   into #pageSimple: the same 52px .gen-header the Library wears, then a body
   that scrolls. Every string and number comes from DATA (data.js); the module
   keeps only what the user changes on a page (a run paused, a schedule added,
   an invite sent, a filter typed) for as long as the tab lives.

   Public API (window.Pages):
     Pages.init()                       — registers the five pages; called by App at boot
     Pages.show(name)                   — renders a page into #pageSimple (the router calls it)
     Pages.hide()                       — drops the page's live subscriptions
     Pages.runs()                       — the scheduled runs as the page currently holds them
     Pages.runNow(name | run)           — starts a run (status → running for 3 s, then ok)
     Pages.addSchedule({name, cadence, model, project})
     Pages.filterSignals(sev, query)    — the Signals page filters ('all' | 'Critical' | 'Watch', text)
   ============================================================================= */
window.Pages = (() => {
  const { h, icon, btn } = App;
  const SVG = 'http://www.w3.org/2000/svg';
  const root = () => document.getElementById('pageSimple');

  /* ---- what the pages remember while the tab lives ---------------------------- */
  let seq = 0;
  const runs = DATA.scheduled.map(r => Object.assign({ id: 'run' + (++seq), paused: false }, r));
  const people = DATA.people.map(p => Object.assign({}, p));
  let sigFilter = 'all', sigQuery = '';
  let current = null;            /* which page is on screen */
  let offs = [];                 /* App.on cleanups that live with the page */
  const runTimers = new Map();   /* run id → the timeout that ends a "Run now" */

  /* ---- small helpers ------------------------------------------------------------- */
  function svg(tag, attrs, ...kids) {
    const el = document.createElementNS(SVG, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) el.setAttribute(k, v);
    for (const kid of kids) if (kid) el.append(kid);
    return el;
  }
  const first = name => String(name).split(' ')[0];
  /* a coloured dot: custom properties need setProperty, which App.h's style{} skips */
  const dot = (color, cls = 'dot') => { const el = h('i', { class: cls, 'aria-hidden': 'true' }); el.style.setProperty('--dot', color); return el; };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many || one + 's'}`;
  const modelName = id => (DATA.models.find(m => m.id === id) || DATA.models[0]).name;
  const listen = (ev, fn) => offs.push(App.on(ev, fn));

  /* the page frame: a header like the Library's and a body that scrolls */
  function frame(title, iconName, actions, body) {
    const head = h('header', { class: 'gen-header pg-header' },
      h('div', { class: 'pg-title' }, h('span', { class: 'pg-ic', 'aria-hidden': 'true' }, icon(iconName, 20)), h('h1', null, title)),
      h('div', { class: 'pg-actions' }, ...actions));
    const main = h('div', { class: 'pg-body', tabindex: '-1' }, ...body);
    root().replaceChildren(head, main);
    root().setAttribute('aria-label', title);
    return main;
  }
  const sum = (...parts) => h('div', { class: 'pg-sum' }, ...parts.filter(Boolean).flatMap((p, i) => i ? [h('i', { 'aria-hidden': 'true' }), p] : [p]));

  /* a labelled field inside a popover form */
  function field(label, control, caret) {
    return h('label', { class: 'pg-fld' }, h('span', null, label), h('span', { class: 'pg-fld-wrap' }, control, caret ? icon('caret-down', 16) : null));
  }
  function select(options, value, label) {
    const opts = options.slice();
    if (value != null && !opts.includes(value)) opts.unshift(value);
    const el = h('select', { class: 'pg-field', 'aria-label': label }, ...opts.map(o => h('option', { value: o, selected: o === value }, o)));
    return el;
  }
  const footButtons = (okLabel, onOk) => [
    h('button', { class: 'btn btn-glass', type: 'button', onclick: () => App.closeMenu() }, 'Cancel'),
    h('button', { class: 'btn btn-white', type: 'button', onclick: onOk }, okLabel),
  ];

  /* ═══ Scheduled ═══════════════════════════════════════════════════════════ */
  const STATUS = {
    ok: { color: 'var(--positive)', label: 'Healthy' },
    attention: { color: 'var(--warning)', label: 'Needs attention' },
    running: { color: 'var(--info)', label: 'Running' },
    idle: { color: 'var(--dot-ghost)', label: 'Idle' },
    paused: { color: 'var(--dot-ghost)', label: 'Paused' },
  };
  const CADENCE = {
    'Daily': { text: 'Daily · 08:00', next: 'Tomorrow 08:00' },
    'Weekly': { text: 'Weekly · Mon 08:00', next: 'Mon 08:00' },
    'Hourly': { text: 'Hourly', next: 'in 60 min' },
    'On trigger': { text: 'On trigger', next: '—' },
  };
  const cadenceKind = text => /^daily/i.test(text) ? 'Daily' : /^weekly/i.test(text) ? 'Weekly' : /^(hourly|every)/i.test(text) ? 'Hourly' : /^on trigger/i.test(text) ? 'On trigger' : null;
  const runState = r => r.paused ? 'paused' : r.status;

  function runSummary() {
    const running = runs.filter(r => runState(r) === 'running').length;
    const attention = runs.filter(r => runState(r) === 'attention').length;
    const paused = runs.filter(r => r.paused).length;
    const parts = [h('span', null, h('b', null, plural(runs.length, 'run')))];
    if (running) parts.push(h('span', null, `${running} running`));
    if (attention) parts.push(h('span', null, `${attention} need${attention === 1 ? 's' : ''} attention`));
    if (paused) parts.push(h('span', null, `${paused} paused`));
    return sum(...parts);
  }
  function runCell(label, value) {
    return h('div', { class: 'run-cell' }, h('small', null, label), h('code', null, value));
  }
  function runCard(r) {
    const st = runState(r), s = STATUS[st];
    return h('article', { class: 'run', role: 'listitem', dataset: { status: st, id: r.id }, 'aria-label': `${r.name} — ${s.label}` },
      h('span', { class: 'run-status', title: s.label, role: 'img', 'aria-label': s.label }, dot(s.color, 'run-dot')),
      h('div', { class: 'run-main' },
        h('div', { class: 'run-name' }, r.name),
        h('div', { class: 'run-cad' }, r.paused ? `${r.cadence} · paused` : r.cadence)),
      runCell('Last run', r.last),
      runCell('Next run', r.paused ? '—' : r.next),
      h('div', { class: 'run-chips' },
        h('span', { class: 'chip', title: 'Project' }, r.project),
        h('span', { class: 'chip', title: 'Model' }, r.model)),
      btn('dots-three', `Actions for ${r.name}`, { size: 28, class: 'run-menu', attrs: { 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, onclick: e => runMenu(e.currentTarget, r) }));
  }
  /* re-draw one card in place, and the line above the list */
  function patchRun(r) {
    const page = root();
    const old = page.querySelector(`.run[data-id="${r.id}"]`);
    if (old) old.replaceWith(runCard(r));
    const line = page.querySelector('.pg-list')?.previousElementSibling;
    if (line && line.classList.contains('pg-sum')) line.replaceWith(runSummary());
  }
  function renderRuns() {
    const list = root().querySelector('.pg-list');
    if (!list) return;
    list.replaceChildren(...runs.map(runCard));
    list.previousElementSibling.replaceWith(runSummary());
  }
  function runMenu(anchor, r) {
    App.menu(anchor, [
      { label: 'Run now', icon: 'play', onSelect: () => runNow(r) },
      r.paused ? { label: 'Resume', icon: 'play', onSelect: () => pauseRun(r, false) }
               : { label: 'Pause', icon: 'pause', onSelect: () => pauseRun(r, true) },
      { label: 'Edit', icon: 'pencil-simple', onSelect: () => schedulePopover(anchor, r) },
      { sep: true },
      { label: 'Delete', icon: 'trash', danger: true, onSelect: () => deleteRun(r) },
    ], { side: 'bottom', align: 'right', width: 180 });
  }
  function runNow(run) {
    const r = typeof run === 'string' ? runs.find(x => x.name === run || x.id === run) : run;
    if (!r) return false;
    if (runState(r) === 'running') { App.toast(`${r.name} is already running`); return true; }
    r.paused = false; r.status = 'running'; r.last = 'just now';
    patchRun(r);
    App.toast(`Running ${r.name} · ${r.model}`, { duration: 2600 });
    App.emit('console:log', { tool: 'schedule.run', args: `${r.name} · ${r.model}`, ms: 0 });
    clearTimeout(runTimers.get(r.id));
    runTimers.set(r.id, setTimeout(() => {
      runTimers.delete(r.id);
      if (!runs.includes(r)) return;
      r.status = 'ok'; r.last = 'just now';
      patchRun(r);
      App.emit('console:log', { tool: 'schedule.done', args: `${r.name} · ok`, ms: 2960 });
      App.toast(`${r.name} finished · 3 s`);
    }, 3000));
    return true;
  }
  function pauseRun(r, on) {
    r.paused = on;
    if (on) { clearTimeout(runTimers.get(r.id)); runTimers.delete(r.id); if (r.status === 'running') r.status = 'ok'; }
    patchRun(r);
    App.toast(on ? `${r.name} paused — the next run is off the calendar` : `${r.name} resumed · next ${r.next}`);
  }
  function deleteRun(r) {
    const at = runs.indexOf(r);
    if (at < 0) return;
    runs.splice(at, 1);
    clearTimeout(runTimers.get(r.id)); runTimers.delete(r.id);
    const el = root().querySelector(`.run[data-id="${r.id}"]`);
    if (el) { el.classList.add('is-out'); setTimeout(() => { el.remove(); renderRuns(); }, 200); }
    App.toast(`Deleted ${r.name}`, { action: 'Undo', onAction: () => { runs.splice(Math.min(at, runs.length), 0, r); renderRuns(); root().querySelector(`.run[data-id="${r.id}"]`)?.classList.add('is-in'); } });
  }
  function addSchedule({ name, cadence = 'Daily', model, project } = {}) {
    const kind = CADENCE[cadence] ? cadence : (cadenceKind(cadence) || 'Daily');
    const r = { id: 'run' + (++seq), name: String(name || 'Untitled schedule').trim(), paused: false, status: 'idle', last: '—',
      cadence: CADENCE[cadence] ? CADENCE[cadence].text : cadence, next: CADENCE[kind].next,
      project: project || App.project()?.name || DATA.projects[0].name, model: model || modelName(App.state.model) };
    runs.unshift(r);
    renderRuns();
    root().querySelector(`.run[data-id="${r.id}"]`)?.classList.add('is-in');
    return r;
  }
  /* the form behind "+ New schedule" and a card's Edit */
  function schedulePopover(anchor, r) {
    const name = h('input', { class: 'pg-field', type: 'text', maxlength: '80', spellcheck: 'false', 'aria-label': 'Schedule name',
      placeholder: 'e.g. Weekly readiness digest', value: r ? r.name : '' });
    const kind0 = r ? cadenceKind(r.cadence) : 'Daily';
    const cadence = select(Object.keys(CADENCE), kind0 || r.cadence, 'Cadence');
    const project = select(DATA.projects.map(p => p.name), r ? r.project : (App.project()?.name || DATA.projects[0].name), 'Project');
    const model = select(DATA.models.map(m => m.name), r ? r.model : modelName(App.state.model), 'Model');
    const err = h('div', { class: 'pg-err', role: 'alert' });
    const body = h('div', { class: 'pg-form' }, field('Name', name), field('Cadence', cadence, true), field('Project', project, true), field('Model', model, true), err);
    const submit = () => {
      const v = name.value.trim();
      if (!v) { name.setAttribute('aria-invalid', 'true'); err.textContent = 'Give the schedule a name.'; name.focus(); return; }
      if (r) {
        const kind = cadence.value;
        const keep = kind === (kind0 || r.cadence);
        Object.assign(r, { name: v, project: project.value, model: model.value,
          cadence: keep ? r.cadence : CADENCE[kind].text, next: keep ? r.next : CADENCE[kind].next });
        patchRun(r);
        App.toast(`Saved ${v}`);
      } else {
        const nr = addSchedule({ name: v, cadence: cadence.value, model: model.value, project: project.value });
        App.toast(`Scheduled ${nr.name} · ${nr.cadence}`);
      }
      App.closeMenu();
    };
    name.addEventListener('input', () => { name.removeAttribute('aria-invalid'); err.textContent = ''; });
    name.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    App.popover(anchor, { title: r ? 'Edit schedule' : 'New schedule', body, width: 340, align: 'right', foot: footButtons(r ? 'Save' : 'Create', submit) });
    setTimeout(() => name.focus(), 40);
  }
  function showScheduled() {
    const add = h('button', { class: 'btn-light', type: 'button', 'aria-haspopup': 'dialog', onclick: e => schedulePopover(e.currentTarget) }, icon('plus', 20), h('span', null, 'New schedule'));
    frame('Scheduled', 'clock-countdown', [add], [runSummary(), h('div', { class: 'pg-list', role: 'list' }, ...runs.map(runCard))]);
  }

  /* ═══ Signals ═════════════════════════════════════════════════════════════ */
  const SEVERITY = { Critical: 'negative', High: 'warning', Watch: 'info' };
  const sigVisible = s => (sigFilter === 'all' || s.severity === sigFilter) &&
    (!sigQuery || `${s.title} ${s.place} ${s.kind} ${s.severity} ${s.when}`.toLowerCase().includes(sigQuery));

  function sigThumb(s) {
    if (s.thumb === 'globe') return h('span', { class: 'sig-thumb sg-thumb' }, h('img', { class: 'fit-globe', src: 'assets/figma/globe.png', alt: '', decoding: 'async' }));
    if (s.thumb) return h('span', { class: 'sig-thumb sg-thumb' }, h('img', { src: s.thumb, alt: '', decoding: 'async' }));
    return h('span', { class: 'sig-thumb sg-thumb--none' }, icon('broadcast', 20));
  }
  function openSignal(s) {
    App.emit('signal:open', s.id);
    /* Chat takes it from here and opens the thread; if nothing moved the hash, at least land on the chat */
    if (/^#\/signals/.test(location.hash)) App.go('#/chat');
  }
  function sigCard(s) {
    const open = () => openSignal(s);
    return h('article', { class: 'sg', role: 'button', tabindex: '0', dataset: { id: s.id }, 'aria-label': `${s.title} — ${s.place} · ${s.severity}`,
      onclick: open, onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } } },
      h('div', { class: 'sg-top' }, sigThumb(s),
        h('div', { class: 'sg-text' }, h('div', { class: 'sig-title sg-title' }, s.title),
          h('div', { class: 'sig-meta sg-meta' }, h('b', null, s.place), dot(s.dot), h('span', { class: 'sg-when' }, s.when)))),
      h('div', { class: 'sg-foot' },
        h('span', { class: `badge badge--${SEVERITY[s.severity] || 'info'}` }, s.severity),
        h('span', { title: s.kind }, s.kind),
        h('button', { class: 'btn btn-glass', type: 'button', 'aria-label': `Open ${s.title} in Focus`,
          onclick: e => { e.stopPropagation(); App.go('#/focus'); } }, 'Open in Focus')));
  }
  function renderSignals() {
    const grid = root().querySelector('.pg-grid');
    if (!grid) return;
    const shown = DATA.signals.filter(sigVisible);
    grid.replaceChildren(...(shown.length ? shown.map(sigCard) : [h('div', { class: 'pg-none' }, sigQuery ? `Nothing on the shelf matches “${sigQuery}”.` : 'Nothing on the shelf at this severity.')]));
    const crit = DATA.signals.filter(s => s.severity === 'Critical').length;
    const watch = DATA.signals.filter(s => s.severity === 'Watch').length;
    grid.previousElementSibling.replaceWith(sum(h('span', null, h('b', null, plural(shown.length, 'signal')), shown.length !== DATA.signals.length ? ` of ${DATA.signals.length}` : ''),
      h('span', null, `${crit} critical`), h('span', null, `${watch} on watch`)));
    root().querySelectorAll('.seg-btn').forEach(b => { const on = b.dataset.sev === sigFilter; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
  }
  function filterSignals(sev, query) {
    if (sev != null) sigFilter = ['all', 'Critical', 'Watch'].includes(sev) ? sev : 'all';
    if (query != null) sigQuery = String(query).trim().toLowerCase();
    renderSignals();
    const f = root().querySelector('.pg-search input'); if (f && query != null && f.value !== query) f.value = query;
  }
  function showSignals() {
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Severity' },
      ...[['all', 'All'], ['Critical', 'Critical'], ['Watch', 'Watch']].map(([v, label]) =>
        h('button', { class: `seg-btn ${sigFilter === v ? 'is-on' : ''}`.trim(), type: 'button', dataset: { sev: v }, 'aria-pressed': String(sigFilter === v), onclick: () => filterSignals(v) }, h('span', null, label))));
    const input = h('input', { type: 'search', placeholder: 'Search signals', 'aria-label': 'Search signals', value: sigQuery, autocomplete: 'off', spellcheck: 'false',
      oninput: e => filterSignals(null, e.target.value), onkeydown: e => { if (e.key === 'Escape' && e.target.value) { e.stopPropagation(); filterSignals(null, ''); } } });
    const clear = btn('x', 'Clear the search', { size: 28, onclick: () => { filterSignals(null, ''); input.focus(); } });
    const search = h('label', { class: 'pg-search' }, icon('magnifying-glass', 16), input, clear);
    const syncClear = () => { clear.hidden = !input.value; }; input.addEventListener('input', syncClear); syncClear();
    frame('Signals', 'broadcast', [seg, search], [sum(), h('div', { class: 'pg-grid' })]);
    renderSignals();
  }

  /* ═══ Dashboards ══════════════════════════════════════════════════════════ */
  const SPARK = ['var(--positive)', 'var(--warning)', 'var(--info)', 'var(--brand)', 'var(--fc-act)', 'var(--negative)'];
  /* a deterministic little series per tile, so every tile draws its own line */
  function sparkline(i) {
    const W = 300, H = 40, n = 24;
    let s = ((i + 1) * 2654435761) >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const trend = [0.9, 0.35, -0.25, 0.55, 1.1, -0.7][i % 6];
    const pts = []; let v = 16 + rnd() * 8;
    for (let k = 0; k < n; k++) { v = Math.min(36, Math.max(4, v + (rnd() - .5) * 7 + trend * .4)); pts.push([k / (n - 1) * W, H - v]); }
    const d = pts.map(([x, y], k) => (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
    const color = SPARK[i % SPARK.length];
    return svg('svg', { class: 'db-spark', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' },
      svg('path', { d: `${d} L${W} ${H} L0 ${H} Z`, fill: color, opacity: '.12' }),
      svg('path', { d, fill: 'none', stroke: color, 'stroke-width': '1.5', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }),
      svg('path', { d: `M${pts[n - 1][0].toFixed(1)} ${pts[n - 1][1].toFixed(1)} h0`, stroke: color, 'stroke-width': '5', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }));
  }
  /* wait for the router to land, then do the thing that needs the page */
  function afterRoute(fn) {
    let done = false;
    const off = App.on('route', () => { if (done) return; done = true; off(); setTimeout(fn, 0); });
    setTimeout(() => { if (!done) { done = true; off(); fn(); } }, 400);
  }
  function openDashboard(d) {
    App.toast(`Opening ${d.name} in the chat`);
    afterRoute(() => {
      App.emit('widget:open', { id: 'kpis', source: 'dashboards' });
      const W = window.Widgets;
      if (W && typeof W.open === 'function' && !(typeof W.has === 'function' && W.has('kpis'))) W.open('kpis', { focus: true, source: 'dashboards' });
    });
    App.go('#/chat');
  }
  function dbTile(d, i) {
    return h('button', { class: 'db', type: 'button', 'aria-label': `Open ${d.name} in the chat`, onclick: () => openDashboard(d) },
      h('div', { class: 'db-head' },
        h('span', { class: 'db-ic' }, icon(d.icon, 24)),
        h('div', { class: 'db-text' }, h('div', { class: 'db-name' }, d.name), h('div', { class: 'db-note' }, d.note)),
        h('span', { class: 'db-open', 'aria-hidden': 'true' }, icon('arrow-square-up-right', 16))),
      sparkline(i));
  }
  function showDashboards() {
    const add = h('button', { class: 'btn-light', type: 'button', onclick: () => App.toast('Ask Axi for a dashboard in the chat — it composes one from the widgets it opens.', { duration: 6000 }) }, icon('plus', 20), h('span', null, 'New dashboard'));
    frame('Dashboards', 'cards', [add], [
      sum(h('span', null, h('b', null, plural(DATA.dashboards.length, 'dashboard'))), h('span', null, 'each opens as widgets in the chat')),
      h('div', { class: 'pg-tiles' }, ...DATA.dashboards.map(dbTile))]);
  }

  /* ═══ People ══════════════════════════════════════════════════════════════ */
  function personRow(p) {
    const me = p.name === DATA.user.name;
    const state = p.pending ? 'Invited' : p.on ? 'Online' : 'Away';
    return h('div', { class: 'pp', role: 'listitem', dataset: { on: String(!!p.on) } },
      h('span', { class: 'pp-av' }, h('span', { class: 'avatar', 'aria-hidden': 'true' }, p.initials), h('i', { class: 'pp-on', title: state })),
      h('div', { class: 'pp-text' },
        h('div', { class: 'pp-name' }, p.name, me ? h('span', { class: 'chip' }, 'You') : null),
        h('div', { class: 'pp-role' }, p.role)),
      h('span', { class: 'pp-state' }, state),
      me ? h('button', { class: 'btn btn-glass', type: 'button', onclick: () => App.go('#/settings') }, 'Settings')
        : p.pending ? h('button', { class: 'btn btn-glass', type: 'button', 'aria-label': `Resend the invite to ${p.name}`, onclick: () => App.toast(`Invite sent again to ${p.email}`) }, 'Resend')
        : h('button', { class: 'btn btn-glass', type: 'button', 'aria-label': `Message ${p.name}`, onclick: () => App.toast(`Message to ${first(p.name)} — the inbox is not part of this demo.`) }, 'Message'));
  }
  function peopleSummary() {
    const on = people.filter(p => p.on).length, pending = people.filter(p => p.pending).length;
    return sum(h('span', null, h('b', null, plural(people.length, 'person', 'people'))), h('span', null, `${on} online`), pending ? h('span', null, `${pending} invited`) : null);
  }
  function invitePopover(anchor) {
    const email = h('input', { class: 'pg-field', type: 'email', placeholder: 'name@amana.gov.sa', 'aria-label': 'Email address', autocomplete: 'off', spellcheck: 'false' });
    const role = select(['Viewer', 'Analyst', 'Editor', 'Admin'], 'Analyst', 'Role');
    const err = h('div', { class: 'pg-err', role: 'alert' });
    const body = h('div', { class: 'pg-form' }, field('Email', email), field('Role', role, true), err);
    const submit = () => {
      const v = email.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { email.setAttribute('aria-invalid', 'true'); err.textContent = 'That does not look like an email address.'; email.focus(); return; }
      if (people.some(p => p.email === v)) { email.setAttribute('aria-invalid', 'true'); err.textContent = `${v} is already invited.`; email.focus(); return; }
      const local = v.split('@')[0];
      const parts = local.split(/[._-]+/).filter(Boolean);
      const name = parts.map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || local;
      const initials = (parts.length > 1 ? parts[0][0] + parts[1][0] : local.slice(0, 2)).toUpperCase();
      people.push({ name, email: v, role: `${role.value} · invited`, initials, on: false, pending: true });
      const list = root().querySelector('.pp-list');
      if (list) { const row = personRow(people[people.length - 1]); row.classList.add('is-in'); list.append(row); list.previousElementSibling.replaceWith(peopleSummary()); }
      App.toast(`Invite sent to ${v} · ${role.value}`);
      App.closeMenu();
    };
    email.addEventListener('input', () => { email.removeAttribute('aria-invalid'); err.textContent = ''; });
    email.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    App.popover(anchor, { title: 'Invite to Axion', body, width: 320, align: 'right', foot: footButtons('Send invite', submit) });
    setTimeout(() => email.focus(), 40);
  }
  function showPeople() {
    const invite = h('button', { class: 'btn-light', type: 'button', 'aria-haspopup': 'dialog', onclick: e => invitePopover(e.currentTarget) }, icon('plus', 20), h('span', null, 'Invite'));
    frame('People', 'user', [invite], [peopleSummary(), h('div', { class: 'pp-list', role: 'list' }, ...people.map(personRow))]);
  }

  /* ═══ Settings ════════════════════════════════════════════════════════════ */
  const speakOn = () => !!App.store.get('speak', false);
  function switchRow(label, hint, on, onChange) {
    const row = h('button', { class: 'set-row', type: 'button', role: 'switch', 'aria-checked': String(!!on),
      onclick: () => { const v = row.getAttribute('aria-checked') !== 'true'; row.setAttribute('aria-checked', String(v)); onChange(v); } },
      h('span', { class: 'set-label' }, h('span', null, label), hint ? h('small', null, hint) : null),
      h('i', { class: 'switch set-switch', 'aria-hidden': 'true' }));
    return row;
  }
  function radioRow(label, hint, on, onPick) {
    return h('button', { class: 'set-row', type: 'button', role: 'radio', 'aria-checked': String(!!on), onclick: onPick },
      icon('check', 16, 'set-check'),
      h('span', { class: 'set-label' }, h('span', null, label), hint ? h('small', null, hint) : null));
  }
  const valueRow = (label, value, mono) => h('div', { class: 'set-row' }, h('span', { class: 'set-label' }, h('span', null, label)), h('span', { class: `set-value ${mono ? 'is-mono' : ''}`.trim() }, value));
  const linkRow = (label, hint, iconName, onclick, danger) => h('button', { class: `set-row ${danger ? 'is-danger' : ''}`.trim(), type: 'button', onclick },
    h('span', { class: 'set-label' }, h('span', null, label), hint ? h('small', null, hint) : null), icon(iconName, 16));
  const section = (title, note, ...rows) => h('section', { class: 'st-sec', 'aria-label': title }, h('h2', null, title), note ? h('p', null, note) : null, h('div', { class: 'set-group' }, ...rows));

  function showSettings() {
    const concept = switchRow('Agent‑centric layout (concept)', 'The whole of Axion inside the chat: no rail, the word‑mark and the pages in the sidebar.',
      App.state.concept === 'agent', v => App.setConcept(v ? 'agent' : 'gen'));
    const rail = switchRow('Hide the rail', 'Fold the Gen Sidebar away; a peek button at the top‑left brings it back.',
      !App.state.rail, v => App.set('rail', !v));
    const widgets = switchRow('Widgets column', 'Where the agent opens scenes, signals and KPIs beside the thread.',
      App.state.widgets, v => App.set('widgets', v));
    const models = h('div', { class: 'set-group', role: 'radiogroup', 'aria-label': 'Default model' },
      ...DATA.models.map(m => radioRow(m.name, m.note, App.state.model === m.id, () => { App.set('model', m.id); App.toast(`${m.name} answers from now on`); })));
    const speak = switchRow('Read answers aloud', 'Axi speaks each reply as it streams; the orb\'s speaker mutes it.',
      speakOn(), v => { App.store.set('speak', v); App.set('speak', v); App.toast(v ? 'Axi will read its answers aloud' : 'Axi stays quiet'); });
    const reset = linkRow('Reset to defaults', 'Gen layout · rail shown · GPT‑5.6 Luna · quiet.', 'arrows-counter-clockwise', () => {
      if (App.state.concept !== 'gen') App.setConcept('gen');
      App.set('rail', true); App.set('widgets', true); App.set('model', DATA.models[0].id);
      App.store.set('speak', false); App.set('speak', false);
      sync(); App.toast('Settings are back to their defaults');
    }, true);
    const shortcuts = btn('keyboard', 'Keyboard shortcuts', { size: 36, onclick: () => App.shortcuts() });

    frame('Settings', 'gear', [shortcuts], [h('div', { class: 'st-col' },
      section('Appearance', null, concept, rail, widgets),
      h('section', { class: 'st-sec', 'aria-label': 'Agent' }, h('h2', null, 'Agent'), h('p', null, 'Default model for new chats; a chat can switch from its composer.'), models, h('div', { class: 'set-group' }, speak)),
      section('Account', null, valueRow('Name', DATA.user.name), valueRow('Email', DATA.user.email, true), valueRow('Organisation', DATA.user.org)),
      section('About', null, valueRow('Version', '0.1.0', true), valueRow('Figma section', 'Axion Talks · Axion Gen · Future vision'), valueRow('Design size', '1920 × 1080', true),
        linkRow('Keyboard shortcuts', '⌘K search · ⌘J console · / composer · Esc closes', 'keyboard', () => App.shortcuts()), reset))]);

    /* the switches follow the state, whoever changes it */
    function sync() {
      concept.setAttribute('aria-checked', String(App.state.concept === 'agent'));
      rail.setAttribute('aria-checked', String(!App.state.rail));
      widgets.setAttribute('aria-checked', String(!!App.state.widgets));
      speak.setAttribute('aria-checked', String(speakOn()));
      models.querySelectorAll('[role="radio"]').forEach((b, i) => b.setAttribute('aria-checked', String(DATA.models[i].id === App.state.model)));
    }
    listen('state', ({ key }) => { if (['concept', 'rail', 'widgets', 'model', 'speak'].includes(key)) sync(); });
  }

  /* ═══ the router's side ═══════════════════════════════════════════════════ */
  const PAGES = { scheduled: showScheduled, signals: showSignals, dashboards: showDashboards, users: showPeople, settings: showSettings };
  function show(name) {
    if (!PAGES[name]) return false;
    hide();
    current = name;
    PAGES[name]();
    /* the router shows sections by data-page, and ours says "simple" for all five
       routes — so it hides this one right before calling us; it hides it again on
       the way to any other page, which is what we want */
    root().hidden = false;
    return true;
  }
  function hide() {
    for (const off of offs) off();
    offs = []; current = null;
  }
  function init() {
    for (const name of Object.keys(PAGES)) App.registerPage(name, { show: () => show(name), hide });
  }

  return { init, show, hide, runs: () => runs, runNow, addSchedule, filterSignals, get current() { return current; } };
})();
