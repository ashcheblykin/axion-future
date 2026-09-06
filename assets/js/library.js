/* =============================================================================
   library.js — the Library page (docs/SPEC.md §3 and §7).
   The axion_sense.frames sheet with its sortable header, paging, filters,
   column and view settings, the frame detail panel, the map view, and the
   hooks the orb uses: Library.highlight(...) and Library.openRow(id).
   Renders into #libBody / #libRows / #libPanel and binds the #libHeader controls.
   ============================================================================= */
window.Library = (() => {
  const { h, icon, btn, $, $$ } = App;
  const LIB = DATA.library;
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const PER = [20, 50, 100];
  const PHOTO = 'assets/figma/lib-frame-photo.jpg';
  const GLOBE = 'assets/figma/globe.png';

  /* ---- state ------------------------------------------------------------------ */
  const state = {
    dataset: LIB.name, datasets: LIB.datasets.slice(),
    page: 1, per: 20, sort: null, filter: null, hits: null, view: 'table',
    selected: new Set(), anchor: null, openId: null,
    hidden: new Set(App.store.get('lib:hidden', [])),
    density: App.store.get('lib:density', 'default'),
    dividers: App.store.get('lib:dividers', true),
    wrap: App.store.get('lib:wrap', false),
  };
  let visible = false, built = false, all = null, view = [], pending = [];
  let titleEl, bodyEl, footEl, panelEl, sheetEl, tbodyEl, countEl, chipsEl, prevBtn, nextBtn, perBtn, perNum;
  let mapWrap = null, mapCleanup = null, panelTimer = 0;

  /* ---- the data ----------------------------------------------------------------- */
  /* The generator's dates are strings; parse them once so filters and sorting work on
     time, and print them back in the same shape. Hours the generator lets run below
     zero on late pages roll back into the previous day here. */
  function parseTs(s) {
    const m = /^(\d+) (\w+) (\d+), (-?\d+):(\d+)$/.exec(String(s));
    if (!m) return null;
    const d = new Date(+m[3], MON.indexOf(m[2]), +m[1]);
    d.setHours(+m[4], +m[5], 0, 0);
    return d;
  }
  const pad2 = n => String(n).padStart(2, '0');
  const fmtTs = d => d ? `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}` : '';
  const fmtInt = n => Number(n).toLocaleString('en-US');
  const group = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  function normalize(r) {
    const rec = parseTs(r.recorded_at), cre = parseTs(r.created_at), agg = parseTs(r.detection_aggregated_at);
    return Object.assign({}, r, {
      recorded_at: rec ? fmtTs(rec) : r.recorded_at,
      created_at: cre ? fmtTs(cre) : r.created_at,
      _recorded: rec ? rec.getTime() : 0, _created: cre ? cre.getTime() : 0, _aggregated: agg ? agg.getTime() : 0,
    });
  }
  /* the whole sheet, as the generator makes it page by page at 20 a page — page 1 at
     20 rows is exactly DATA.library.rows(1, 20); any other page size slices the same set */
  function allRows() {
    if (all) return all;
    all = [];
    for (let p = 1; p <= Math.ceil(LIB.total / 20); p++) all.push(...LIB.rows(p, 20).map(normalize));
    return all;
  }
  const issueValues = () => [...new Set(allRows().map(r => r.capture_issue))];
  const columns = () => LIB.columns.filter(c => !state.hidden.has(c.key));

  function sortKey(col, r) {
    if (col.key === 'recorded_at') return r._recorded;
    if (col.key === 'created_at') return r._created;
    if (col.key === 'detection_aggregated_at') return r._aggregated;
    const v = r[col.key];
    if (col.type === 'num' || col.type === 'id') { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? 0 : n; }
    if (col.type === 'bool') return v ? 1 : 0;
    if (Array.isArray(v)) return v.join(' ');
    return v == null ? '' : v;
  }
  function compute() {
    let rows = allRows();
    const f = state.filter;
    if (f) rows = rows.filter(r =>
      (!f.issues || f.issues.includes(r.capture_issue)) &&
      (f.uploaded == null || r.is_uploaded === f.uploaded) &&
      (f.duplicate == null || r.is_duplicate === f.duplicate) &&
      (!f.fromTs || r._recorded >= f.fromTs) && (!f.toTs || r._recorded <= f.toTs));
    if (state.sort) {
      const col = LIB.columns.find(c => c.key === state.sort.key);
      if (col) {
        const dir = state.sort.dir === 'desc' ? -1 : 1;
        rows = rows.slice().sort((a, b) => {
          const x = sortKey(col, a), y = sortKey(col, b);
          const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en', { numeric: true });
          return c * dir;
        });
      }
    }
    view = rows;
    state.page = Math.min(state.page, pageCount());
    return view;
  }
  const pageCount = () => Math.max(1, Math.ceil(view.length / state.per));
  const pageRows = () => view.slice((state.page - 1) * state.per, state.page * state.per);
  const rowById = id => allRows().find(r => r.id === id);

  /* ---- cells ------------------------------------------------------------------------ */
  const isEmpty = v => v == null || v === '' || (Array.isArray(v) && !v.length);
  function badge(text, cls) { return h('span', { class: `badge ${cls || ''}`.trim() }, text); }
  const issueClass = v => v === 'Unspecified' ? 'badge--warning' : 'badge--negative';
  function cell(col, row) {
    const v = row[col.key];
    const td = h('div', { class: `lib-td lib-td--${col.type}`, role: 'gridcell', style: { width: col.w + 'px' } });
    if (isEmpty(v)) { td.append(h('span', { class: 'lib-empty' }, '—')); return td; }
    switch (col.type) {
      case 'bool': td.append(badge(v ? 'TRUE' : 'FALSE', v ? 'badge--positive' : '')); break;
      case 'badge-info': td.append(badge(String(v), 'badge--info')); break;
      case 'badge-warning': td.append(badge(String(v), issueClass(v))); break;
      case 'tags': td.append(...v.slice(0, 3).map(t => h('span', { class: 'badge badge--info badge--tag', title: t }, t))); break;
      default: td.append(h('span', { title: col.type === 'mono' ? String(v) : null }, String(v)));
    }
    return td;
  }
  const divider = () => h('i', { class: 'lib-div', 'aria-hidden': 'true' });

  /* ---- the sheet ----------------------------------------------------------------------- */
  function buildTable() {
    const cols = columns();
    sheetEl = h('div', { class: 'lib-sheet', role: 'grid', 'aria-label': state.dataset, 'aria-colcount': String(cols.length),
      dataset: { density: state.density, dividers: state.dividers ? 'on' : 'off', wrap: state.wrap ? 'on' : 'off' } });
    const head = h('div', { class: 'lib-thead', role: 'row' });
    cols.forEach((col, i) => {
      const sorted = state.sort && state.sort.key === col.key ? state.sort.dir : null;
      const th = h('button', { class: 'lib-th', type: 'button', role: 'columnheader', style: { width: col.w + 'px' },
        'aria-sort': sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : 'none',
        title: `Sort by ${col.label}`, onclick: () => toggleSort(col.key) },
        icon(col.icon, 16), h('span', null, col.label), sorted ? icon(sorted === 'asc' ? 'sort-ascending' : 'sort-descending', 16, 'lib-sort') : null);
      head.append(th);
      if (i < cols.length - 1) head.append(divider());
    });
    tbodyEl = h('div', { class: 'lib-tbody' });
    sheetEl.append(head, tbodyEl);
    const scroll = h('div', { class: 'lib-scroll' }, sheetEl);
    bodyEl.replaceChildren(scroll);
    renderRows();
  }
  function renderRows() {
    const cols = columns();
    const rows = pageRows();
    const pred = state.hits ? state.hits.pred : null;
    tbodyEl.replaceChildren(...rows.map((row, i) => {
      const tr = h('div', { class: 'lib-tr', role: 'row', tabindex: '0', dataset: { id: String(row.id) }, 'aria-rowindex': String((state.page - 1) * state.per + i + 1),
        'aria-selected': String(state.selected.has(row.id)), 'aria-label': `Frame #${row.id}`,
        onclick: e => onRowClick(e, row, tr), onkeydown: e => onRowKey(e, row, tr) });
      if (state.selected.has(row.id)) tr.classList.add('is-selected');
      if (pred && pred(row)) tr.classList.add('is-hit');
      cols.forEach((col, j) => { tr.append(cell(col, row)); if (j < cols.length - 1) tr.append(divider()); });
      return tr;
    }));
    if (!rows.length) tbodyEl.append(h('div', { class: 'lib-none', role: 'row' }, icon('funnel-simple', 16), h('span', null, state.filter ? 'No frames match these filters.' : 'No frames.')));
    sheetEl.setAttribute('aria-rowcount', String(view.length));
    updateFooter();
  }
  function render() { if (!built) return; if (state.view === 'table') { if (sheetEl && sheetEl.isConnected) renderRows(); else buildTable(); } else updateFooter(); }

  /* ---- sorting, selection, rows ----------------------------------------------------------- */
  function toggleSort(key) {
    state.sort = state.sort && state.sort.key === key ? { key, dir: state.sort.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' };
    state.page = 1; compute(); buildTable();
    const scroll = $('.lib-scroll', bodyEl); if (scroll) scroll.scrollTop = 0;
    App.emit('console:log', { tool: 'library.sort', args: { dataset: state.dataset, key, dir: state.sort.dir }, ms: 12 });
  }
  function onRowClick(e, row, tr) {
    if (e.metaKey || e.ctrlKey) { state.selected.has(row.id) ? state.selected.delete(row.id) : state.selected.add(row.id); state.anchor = row.id; syncSelection(); return; }
    if (e.shiftKey && state.anchor != null) {
      const ids = pageRows().map(r => r.id), a = ids.indexOf(state.anchor), b = ids.indexOf(row.id);
      if (a >= 0 && b >= 0) { for (let i = Math.min(a, b); i <= Math.max(a, b); i++) state.selected.add(ids[i]); syncSelection(); return; }
    }
    state.selected = new Set([row.id]); state.anchor = row.id; syncSelection();
    openPanel(row);
  }
  function onRowKey(e, row, tr) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(e, row, tr); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = e.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling;
      if (n && n.classList.contains('lib-tr')) { n.focus(); n.scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const n = e.key === 'Home' ? tbodyEl.firstElementChild : tbodyEl.lastElementChild;
      if (n && n.classList.contains('lib-tr')) { n.focus(); n.scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'PageDown' && state.page < pageCount()) { e.preventDefault(); setPage(state.page + 1); tbodyEl.firstElementChild?.focus(); }
    else if (e.key === 'PageUp' && state.page > 1) { e.preventDefault(); setPage(state.page - 1); tbodyEl.firstElementChild?.focus(); }
  }
  function syncSelection() {
    if (tbodyEl) $$('.lib-tr', tbodyEl).forEach(tr => { const on = state.selected.has(+tr.dataset.id); tr.classList.toggle('is-selected', on); tr.setAttribute('aria-selected', String(on)); });
    updateFooter();
  }
  function clearSelection() { state.selected.clear(); state.anchor = null; syncSelection(); }

  /* ---- paging ---------------------------------------------------------------------------- */
  function setPage(p) {
    state.page = App.clamp(p, 1, pageCount());
    renderRows();
    const scroll = $('.lib-scroll', bodyEl); if (scroll) scroll.scrollTop = 0;
  }
  function setPer(n) {
    if (n === state.per) return;
    const first = (state.page - 1) * state.per;      /* keep the first visible row on screen */
    state.per = n; state.page = Math.floor(first / n) + 1;
    compute(); renderRows();
  }

  /* ---- the footer ---------------------------------------------------------------------------- */
  function buildFooter() {
    perNum = h('span', null, String(state.per));
    perBtn = h('button', { class: 'lib-per', type: 'button', 'aria-label': 'Rows per page', 'aria-haspopup': 'menu', 'aria-expanded': 'false',
      onclick: e => App.menu(e.currentTarget, PER.map(n => ({ label: String(n), checked: n === state.per, onSelect: () => setPer(n) })), { side: 'top', align: 'left', width: 96 }) },
      perNum, h('i', null, icon('caret-down', 20)));
    countEl = h('span', { class: 'lib-foot-count', 'aria-live': 'polite' });
    chipsEl = h('span', { class: 'lib-foot-chips', style: { display: 'contents' } });
    prevBtn = btn('caret-left', 'Previous page', { onclick: () => { if (state.page > 1) setPage(state.page - 1); } });
    nextBtn = btn('caret-right', 'Next page', { onclick: () => { if (state.page < pageCount()) setPage(state.page + 1); } });
    footEl.replaceChildren(
      h('span', { class: 'lib-foot-label' }, 'Rows per page'), perBtn,
      h('div', { class: 'lib-foot-mid' }, countEl, chipsEl),
      h('div', { class: 'lib-foot-nav' }, prevBtn, nextBtn));
  }
  function chip(text, cls, onClear, label) {
    return h('span', { class: `lib-chip ${cls || ''}`.trim() }, text, ' · ', h('button', { class: 'lib-chip-x', type: 'button', 'aria-label': label || 'Clear', onclick: onClear }, 'clear'));
  }
  function updateFooter() {
    if (!footEl || !countEl) return;
    const total = view.length, pages = pageCount();
    const from = total ? (state.page - 1) * state.per + 1 : 0, to = Math.min(total, state.page * state.per);
    countEl.textContent = state.view === 'map'
      ? `${fmtInt(total)} frames on the map · ${state.dataset}`
      : `${fmtInt(from)}–${fmtInt(to)} of ${fmtInt(total)} · page ${fmtInt(state.page)} of ${fmtInt(pages)}`;
    perNum.textContent = String(state.per);
    prevBtn.setAttribute('aria-disabled', String(state.page <= 1)); nextBtn.setAttribute('aria-disabled', String(state.page >= pages));
    const chips = [];
    if (state.filter) chips.push(chip(`${fmtInt(total)} of ${fmtInt(LIB.total)} frames`, '', () => setFilter(null), 'Clear filters'));
    if (state.hits) chips.push(chip(`${fmtInt(state.hits.count)} frame${state.hits.count === 1 ? '' : 's'} match`, 'lib-chip--hit', () => clearHighlight(), 'Clear highlight'));
    if (state.selected.size > 1) chips.push(chip(`${fmtInt(state.selected.size)} selected`, '', () => clearSelection(), 'Clear selection'));
    chipsEl.replaceChildren(...chips);
  }

  /* ---- filters ----------------------------------------------------------------------------- */
  function setFilter(f) {
    if (f) {
      const active = (f.issues && f.issues.length !== issueValues().length) || f.uploaded != null || f.duplicate != null || f.from || f.to;
      if (!active) f = null;
    }
    if (f) {
      f.fromTs = f.from ? new Date(f.from + 'T00:00:00').getTime() : 0;
      f.toTs = f.to ? new Date(f.to + 'T23:59:59').getTime() : 0;
      if (f.issues && f.issues.length === issueValues().length) f.issues = null;
    }
    state.filter = f; state.page = 1; compute(); render(); syncFilterButton();
    App.emit('console:log', { tool: 'library.filter', args: f ? { issues: f.issues || 'any', is_uploaded: f.uploaded ?? 'any', is_duplicate: f.duplicate ?? 'any', from: f.from || null, to: f.to || null } : { cleared: true }, ms: 18 });
  }
  function syncFilterButton() { const b = $('#libFilter'); b.classList.toggle('has-dot', !!state.filter); b.setAttribute('aria-pressed', String(!!state.filter)); }
  function checkRow(label, on, onChange, small) {
    const row = h('button', { class: 'pop-row lib-pop-check', type: 'button', role: 'checkbox', 'aria-checked': String(on),
      onclick: () => { const v = row.getAttribute('aria-checked') !== 'true'; row.setAttribute('aria-checked', String(v)); onChange(v); } },
      h('i', { class: 'check' }, icon('check', 16)), h('span', null, label), small ? h('small', null, small) : null);
    return row;
  }
  function segRow(label, value, onChange) {
    const opts = [['any', 'Any'], [true, 'TRUE'], [false, 'FALSE']];
    const seg = h('div', { class: 'seg lib-pop-seg', role: 'group', 'aria-label': label });
    const btns = opts.map(([v, l]) => h('button', { class: `seg-btn ${v === value ? 'is-on' : ''}`.trim(), type: 'button', 'aria-pressed': String(v === value),
      onclick: () => { btns.forEach(b => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }); const b = btns[opts.findIndex(o => o[0] === v)]; b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true'); onChange(v === 'any' ? null : v); } },
      h('span', null, l)));
    seg.append(...btns);
    return h('div', { class: 'pop-row' }, h('span', { class: 'lib-pop-label' }, label), seg);
  }
  function openFilters(anchor) {
    const values = issueValues();
    const f = state.filter || {};
    const draft = { issues: f.issues ? f.issues.slice() : values.slice(), uploaded: f.uploaded ?? null, duplicate: f.duplicate ?? null, from: f.from || '', to: f.to || '' };
    const fromIn = h('input', { class: 'lib-date', type: 'date', value: draft.from, 'aria-label': 'Recorded from', oninput: e => { draft.from = e.target.value; } });
    const toIn = h('input', { class: 'lib-date', type: 'date', value: draft.to, 'aria-label': 'Recorded until', oninput: e => { draft.to = e.target.value; } });
    const body = h('div', null,
      h('div', { class: 'lib-pop-title' }, 'Capture issue'),
      ...values.map(v => checkRow(v, draft.issues.includes(v), on => { draft.issues = on ? [...draft.issues, v] : draft.issues.filter(x => x !== v); }, fmtInt(allRows().filter(r => r.capture_issue === v).length))),
      h('div', { class: 'lib-pop-title' }, 'Flags'),
      segRow('is_uploaded', draft.uploaded ?? 'any', v => { draft.uploaded = v; }),
      segRow('is_duplicate', draft.duplicate ?? 'any', v => { draft.duplicate = v; }),
      h('div', { class: 'lib-pop-title' }, 'Recorded between'),
      h('div', { class: 'pop-row lib-pop-dates' }, fromIn, h('span', { class: 'lib-pop-dash' }, '–'), toIn),
      h('div', { class: 'lib-pop-note' }, 'The sheet holds 30 Jul – 2 Aug 2026.'));
    const foot = [
      h('button', { class: 'btn btn-grey', type: 'button', onclick: () => { App.closeMenu(); setFilter(null); } }, 'Reset'),
      h('button', { class: 'btn btn-white', type: 'button', onclick: () => { App.closeMenu(); setFilter(draft); } }, 'Apply'),
    ];
    App.popover(anchor, { title: 'Filters', body, foot, width: 320, align: 'right' });
    fromIn.blur();
  }

  /* ---- columns ------------------------------------------------------------------------------- */
  function persistColumns() { App.store.set('lib:hidden', [...state.hidden]); }
  function openColumns(anchor) {
    const rows = LIB.columns.map(c => checkRow(c.label, !state.hidden.has(c.key), on => {
      if (on) state.hidden.delete(c.key); else if (columns().length > 1) state.hidden.add(c.key); else { App.toast('Keep at least one column.'); return; }
      persistColumns(); buildTable();
    }, c.type === 'badge-warning' || c.type === 'badge-info' ? 'badge' : c.type));
    const body = h('div', null, h('div', { class: 'lib-pop-title' }, `${LIB.columns.length} columns · ${columns().length} shown`), ...rows);
    const foot = [
      h('button', { class: 'btn btn-grey', type: 'button', onclick: () => { state.hidden.clear(); persistColumns(); buildTable(); rows.forEach(r => r.setAttribute('aria-checked', 'true')); body.firstChild.textContent = `${LIB.columns.length} columns · ${columns().length} shown`; } }, 'Show all'),
      h('button', { class: 'btn btn-white', type: 'button', onclick: () => App.closeMenu() }, 'Done'),
    ];
    App.popover(anchor, { title: 'Columns', body, foot, width: 300, align: 'right' });
  }

  /* ---- view settings ------------------------------------------------------------------------- */
  function applySettings() {
    App.store.set('lib:density', state.density); App.store.set('lib:dividers', state.dividers); App.store.set('lib:wrap', state.wrap);
    if (sheetEl) { sheetEl.dataset.density = state.density; sheetEl.dataset.dividers = state.dividers ? 'on' : 'off'; sheetEl.dataset.wrap = state.wrap ? 'on' : 'off'; }
  }
  function switchRow(label, on, onChange) {
    const row = h('button', { class: 'pop-row lib-pop-switch', type: 'button', role: 'switch', 'aria-checked': String(on),
      onclick: () => { const v = row.getAttribute('aria-checked') !== 'true'; row.setAttribute('aria-checked', String(v)); onChange(v); } },
      h('span', { class: 'lib-pop-label' }, label), h('i', { class: 'switch lib-switch', 'aria-hidden': 'true' }));
    return row;
  }
  function openSettings(anchor) {
    const dens = [['compact', 'Compact · 56'], ['default', 'Default · 72']];
    const seg = h('div', { class: 'seg lib-pop-seg', role: 'group', 'aria-label': 'Row density' });
    const btns = dens.map(([v, l]) => h('button', { class: `seg-btn ${state.density === v ? 'is-on' : ''}`.trim(), type: 'button', 'aria-pressed': String(state.density === v),
      onclick: () => { state.density = v; btns.forEach((b, i) => { b.classList.toggle('is-on', dens[i][0] === v); b.setAttribute('aria-pressed', String(dens[i][0] === v)); }); applySettings(); } }, h('span', null, l)));
    seg.append(...btns);
    const body = h('div', null,
      h('div', { class: 'lib-pop-title' }, 'Row density'),
      h('div', { class: 'pop-row' }, h('span', { class: 'lib-pop-label' }, 'Rows'), seg),
      h('div', { class: 'lib-pop-title' }, 'Sheet'),
      switchRow('Show dividers', state.dividers, v => { state.dividers = v; applySettings(); }),
      switchRow('Wrap tags', state.wrap, v => { state.wrap = v; applySettings(); }));
    App.popover(anchor, { title: 'View settings', body, width: 300, align: 'right' });
  }

  /* ---- the more menu: export, duplicate, delete ------------------------------------------------- */
  function exportCsv() {
    const cols = columns(), rows = pageRows();
    const esc = v => { const s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const csv = [cols.map(c => c.label).join(','), ...rows.map(r => cols.map(c => esc(r[c.key])).join(','))].join('\n');
    try {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = h('a', { href: url, download: `${state.dataset}.csv` }); document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {}
    App.toast(`Exported ${fmtInt(rows.length)} rows · ${state.dataset}.csv`);
    App.emit('console:log', { tool: 'library.export', args: { dataset: state.dataset, rows: rows.length, columns: cols.length, format: 'csv' }, ms: 64 });
  }
  /* the clipboard may refuse (no permission, no focus); fall back to a selection copy, and never throw */
  function copyText(text, done) {
    const fallback = () => {
      const ta = h('textarea', { style: { position: 'fixed', left: '-9999px', top: '0' }, 'aria-hidden': 'true' }, text);
      document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch {}
      ta.remove();
      App.toast(ok ? done : 'Could not reach the clipboard.');
    };
    let p = null;
    try { p = navigator.clipboard && navigator.clipboard.writeText(text); } catch { p = null; }
    if (p && typeof p.then === 'function') p.then(() => App.toast(done), fallback); else fallback();
  }
  function duplicateView() {
    let name = `${state.dataset}_copy`, n = 2;
    while (state.datasets.includes(name)) name = `${state.dataset}_copy${n++}`;
    state.datasets.splice(state.datasets.indexOf(state.dataset) + 1, 0, name);
    App.go('#/library/' + encodeURIComponent(name));
    App.toast(`View duplicated as ${name}`);
  }
  function deleteView() {
    if (state.datasets.length < 2) { App.toast('This is the only view.'); return; }
    const name = state.dataset, at = state.datasets.indexOf(name);
    state.datasets.splice(at, 1);
    App.go('#/library/' + encodeURIComponent(state.datasets[Math.min(at, state.datasets.length - 1)]));
    App.toast(`View ${name} deleted`, { action: 'Undo', onAction: () => { state.datasets.splice(at, 0, name); App.go('#/library/' + encodeURIComponent(name)); } });
  }
  function moreMenu(anchor) {
    App.menu(anchor, [
      { title: state.dataset },
      { label: 'Export CSV', icon: 'export', small: 'this page', onSelect: exportCsv },
      { label: 'Duplicate view', icon: 'copy', onSelect: duplicateView },
      { label: 'Copy link', icon: 'link-simple', onSelect: () => copyText(location.href.split('#')[0] + '#/library/' + encodeURIComponent(state.dataset), 'Link copied') },
      { sep: true },
      { label: 'Delete view', icon: 'trash', danger: true, onSelect: deleteView },
    ], { side: 'bottom', align: 'right', width: 220 });
  }

  /* ---- the title: an inline input ---------------------------------------------------------------- */
  let measureCtx = null;
  function fitTitle() {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    const cs = getComputedStyle(titleEl);
    measureCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    titleEl.style.width = App.clamp(Math.ceil(measureCtx.measureText(titleEl.value || titleEl.placeholder || '').width) + 18, 96, 520) + 'px';
  }
  function setTitle(name) { titleEl.value = name; titleEl.dataset.was = name; fitTitle(); }
  function commitTitle() {
    const name = titleEl.value.trim(), was = titleEl.dataset.was;
    if (!name) { setTitle(was); return; }
    if (name === was) { fitTitle(); return; }
    const at = state.datasets.indexOf(was);
    if (state.datasets.includes(name)) { App.toast(`A view called ${name} already exists.`); setTitle(was); return; }
    if (at >= 0) state.datasets[at] = name; else state.datasets.push(name);
    state.dataset = name; titleEl.dataset.was = name; fitTitle();
    if (sheetEl) sheetEl.setAttribute('aria-label', name);
    updateFooter();
    history.replaceState(null, '', '#/library/' + encodeURIComponent(name));
    App.state.route = location.hash;
    App.toast('Renamed');
  }
  function stepDataset(dir) {
    const at = state.datasets.indexOf(state.dataset);
    const next = state.datasets[(at + dir + state.datasets.length) % state.datasets.length];
    App.go('#/library/' + encodeURIComponent(next));
  }

  /* ---- the detail panel --------------------------------------------------------------------------- */
  const labelKey = label => label === 'Outside The Territory' ? 'outside_territory' : label.toLowerCase().replace(/\s+/g, '_');
  function fmtValue(v, kind) {
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v === 'number') return fmtInt(v);
    if (/^\d{7,}$/.test(String(v))) return group(v);
    return String(v);
  }
  function detailRows(row) {
    return LIB.detail.data.map(([label, value, kind]) => {
      const key = labelKey(label);
      if (row && Object.prototype.hasOwnProperty.call(row, key) && !isEmpty(row[key])) {
        const v = row[key];
        if (typeof v === 'boolean') kind = 'bool';
        if (key === 'capture_issue') kind = 'badge-warning';
        return [label, fmtValue(v, kind), kind];
      }
      return [label, value, kind];
    });
  }
  function valueNode(value, kind) {
    if (kind === 'bool') return badge(value, value === 'TRUE' ? 'badge--positive' : '');
    if (kind === 'badge-info') return badge(value, 'badge--info');
    if (kind === 'badge-warning') return badge(value, issueClass(value));
    return document.createTextNode(value);
  }
  function renderPanel(row) {
    const title = row ? `Frame #${row.id}` : LIB.detail.title;
    const tags = row && row.tags && row.tags.length ? row.tags : LIB.detail.tags;
    const data = detailRows(row);
    const list = h('div', { class: 'lib-data' });
    data.forEach((d, i) => {
      if (i) list.append(h('hr', { class: 'lib-hr' }));
      list.append(h('div', { class: 'lib-drow' }, h('span', { class: 'lib-dl' }, d[0]), h('span', { class: `lib-dv ${d[2] === 'mono' ? 'is-mono' : ''}`.trim() }, valueNode(d[1], d[2]))));
    });
    panelEl.replaceChildren(
      h('div', { class: 'lib-panel-head' },
        h('h2', { class: 'lib-panel-title', id: 'libPanelTitle' }, title),
        h('button', { class: 'lib-panel-x', type: 'button', 'aria-label': 'Close', onclick: () => closePanel() }, icon('x', 16))),
      h('div', { class: 'lib-panel-body' },
        h('img', { class: 'lib-panel-photo', src: LIB.detail.photo || PHOTO, alt: `Street capture, ${title}` }),
        h('div', { class: 'lib-panel-h' }, 'Tags'),
        h('div', { class: 'lib-panel-tags' }, ...tags.map(t => h('span', { class: 'badge badge--info badge--tag', title: t }, h('span', null, t)))),
        h('div', { class: 'lib-panel-h' }, 'Data'),
        list));
    panelEl.setAttribute('aria-labelledby', 'libPanelTitle');
  }
  function openPanel(row) {
    clearTimeout(panelTimer);
    state.openId = row ? row.id : null;
    renderPanel(row);
    if (panelEl.hidden) { panelEl.hidden = false; panelEl.getBoundingClientRect(); }
    requestAnimationFrame(() => panelEl.classList.add('is-open'));
    App.emit('console:log', { tool: 'library.open_frame', args: { id: row ? row.id : null }, ms: 9 });
  }
  function closePanel() {
    if (panelEl.hidden) return;
    state.openId = null;
    panelEl.classList.remove('is-open');
    clearTimeout(panelTimer);
    panelTimer = setTimeout(() => { panelEl.hidden = true; }, 210);
  }

  /* ---- the map view ------------------------------------------------------------------------------- */
  function mountMap() {
    if (mapWrap && mapWrap.isConnected) return;
    mapWrap = h('div', { class: 'lib-map', role: 'img', 'aria-label': `${fmtInt(view.length)} frames around Riyadh on the globe` },
      h('img', { src: GLOBE, alt: '' }),
      h('div', { class: 'lib-legend' }, h('i', { class: 'dot' }), h('b', null, fmtInt(view.length)), h('span', null, ' frames · Riyadh')));
    bodyEl.replaceChildren(mapWrap);
    const frame = h('iframe', { title: 'Frames on the globe', loading: 'eager' });
    mapWrap.append(frame);
    mapCleanup = App.lens.embed(frame, { subject: 'taif', lens: 'location' }, {
      onReady: () => { mapWrap.classList.add('is-live'); App.lens.setLens(frame, 'location'); },
      onFail: () => { frame.remove(); mapWrap.classList.add('is-fallback'); },
      timeout: 12000,
    });
  }
  function unmountMap() {
    if (mapCleanup) { mapCleanup(); mapCleanup = null; }
    if (mapWrap) { const f = $('iframe', mapWrap); if (f) f.src = 'about:blank'; mapWrap.remove(); mapWrap = null; }
  }
  function setView(v) {
    if (v !== 'table' && v !== 'map') return;
    $$('#libView [data-view]').forEach(b => { const on = b.dataset.view === v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    if (v === state.view && built) return;
    state.view = v;
    if (!built) return;
    if (v === 'map') { sheetEl = null; tbodyEl = null; mountMap(); updateFooter(); }
    else { unmountMap(); buildTable(); }
    App.emit('console:log', { tool: 'library.view', args: { view: v }, ms: 6 });
  }

  /* ---- the public hooks ------------------------------------------------------------------------------ */
  function toPred(p) {
    if (typeof p === 'function') return p;
    if (p && typeof p === 'object') {
      const tests = Object.entries(p);
      return r => tests.every(([k, v]) => {
        const x = r[k];
        if (typeof v === 'function') return !!v(x, r);
        if (Array.isArray(v)) return v.some(y => same(x, y));
        return same(x, v);
      });
    }
    return () => false;
  }
  const same = (x, y) => x === y || (Array.isArray(x) ? x.includes(y) : String(x).toLowerCase() === String(y).toLowerCase());

  function highlight(p) {
    const pred = toPred(p);
    if (!view.length) compute();
    const count = view.reduce((n, r) => n + (pred(r) ? 1 : 0), 0);
    state.hits = count ? { pred, count } : null;
    if (!visible || !built) { pending.push(() => applyHighlight(true)); return count; }
    applyHighlight(true);
    return count;
  }
  function applyHighlight(jump) {
    if (state.view !== 'table' || !tbodyEl) { updateFooter(); return; }
    if (state.hits && jump && !pageRows().some(state.hits.pred)) {
      const at = view.findIndex(state.hits.pred);
      if (at >= 0) state.page = Math.floor(at / state.per) + 1;
    }
    renderRows();
    const first = $('.lib-tr.is-hit', tbodyEl);
    if (first) first.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function clearHighlight() { state.hits = null; if (built && tbodyEl) renderRows(); else updateFooter(); }

  function openRow(id) {
    id = Number(id);
    if (!visible || !built) { pending.push(() => openRow(id)); return; }
    if (state.view !== 'table') setView('table');
    const row = rowById(id);
    if (!row) { App.toast(`Frame #${id} is not in this sheet.`); return; }
    let at = view.indexOf(row);
    if (at < 0) { setFilter(null); at = view.indexOf(row); }
    const page = Math.floor(at / state.per) + 1;
    if (page !== state.page) setPage(page);
    state.selected = new Set([id]); state.anchor = id; syncSelection();
    const tr = $(`.lib-tr[data-id="${id}"]`, tbodyEl);
    if (tr) tr.scrollIntoView({ block: 'nearest' });
    openPanel(row);
  }

  /* ---- the page ------------------------------------------------------------------------------------------ */
  function build() {
    if (built) return;
    built = true;
    compute();
    buildFooter();
    if (state.view === 'map') mountMap(); else buildTable();
    syncFilterButton();
  }
  function showPage(dataset) {
    visible = true;
    const name = dataset ? String(dataset) : state.dataset;
    if (name !== state.dataset) {
      if (!state.datasets.includes(name)) state.datasets.push(name);
      state.dataset = name; state.page = 1; state.sort = null; state.filter = null; state.hits = null; state.selected.clear(); state.anchor = null;
      if (built) { closePanel(); compute(); syncFilterButton(); }
    }
    setTitle(name);
    if (!built) build();
    else if (state.view === 'map') mountMap();
    else if (!sheetEl || !sheetEl.isConnected) buildTable();
    else renderRows();
    updateFooter();
    $('#libBack').setAttribute('aria-label', `Previous view — ${state.datasets[(state.datasets.indexOf(name) - 1 + state.datasets.length) % state.datasets.length]}`);
    $('#libFwd').setAttribute('aria-label', `Next view — ${state.datasets[(state.datasets.indexOf(name) + 1) % state.datasets.length]}`);
    const q = pending.splice(0); q.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  }
  function hidePage() {
    visible = false;
    App.closeMenu();
    unmountMap();
  }

  function init() {
    titleEl = $('#libTitle'); bodyEl = $('#libBody'); footEl = $('#libRows'); panelEl = $('#libPanel');
    panelEl.setAttribute('role', 'dialog');
    /* the header */
    $('#libBack').addEventListener('click', () => stepDataset(-1));
    $('#libFwd').addEventListener('click', () => stepDataset(1));
    titleEl.addEventListener('input', fitTitle);
    titleEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setTitle(titleEl.dataset.was || state.dataset); titleEl.blur(); }
    });
    titleEl.addEventListener('blur', commitTitle);
    $$('#libView [data-view]').forEach(b => { b.setAttribute('aria-pressed', String(b.classList.contains('is-on'))); b.addEventListener('click', () => setView(b.dataset.view)); });
    $('#libSettings').addEventListener('click', e => openSettings(e.currentTarget));
    $('#libFilter').addEventListener('click', e => openFilters(e.currentTarget));
    $('#libColumns').addEventListener('click', e => openColumns(e.currentTarget));
    $('#libAsk').addEventListener('click', () => App.emit('orb:open', { listen: true, page: 'library' }));
    $('#libMore').addEventListener('click', e => moreMenu(e.currentTarget));
    $('#libMore').setAttribute('aria-haspopup', 'menu');
    setTitle(state.dataset);
    App.on('esc', () => { if (visible && !panelEl.hidden) closePanel(); });
    App.registerPage('library', { show: showPage, hide: hidePage });
  }

  return {
    init,
    show(dataset) { if (App.state.page !== 'library') App.go('#/library' + (dataset ? '/' + encodeURIComponent(dataset) : '')); else showPage(dataset); },
    highlight, clearHighlight, openRow,
    closeRow: closePanel, setView, setPage, setPer, setFilter,
    get state() { return state; }, get rows() { return view; },
  };
})();
