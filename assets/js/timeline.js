/* =============================================================================
   timeline.js — the timeline widget the agent drops into a reply.

   Left of the record's end is what the document holds, Mar 2025 to Aug 2026;
   right of it is a projection on two branches — what the score does if nothing
   is done, and what it does with the action package. The picture is the frame's
   (docs/SPEC.md §4, Figma 5405:87767): the target, dotted, all the way across;
   the record, the one solid line, with the marks the document put on it; the
   two forecasts, both dotted because a projection is never allowed to draw
   itself as solid as a record; the upright where the handle stands; and the
   month the score dips under the target, pinned as an event on the strip.

   The frame draws the plot 736 wide. Given less room the plot is laid out
   again at the width it has — every x scaled, the strokes, dots and type kept
   at their size — so the handle, the pins and the months stay in step.

   Timeline.mount(el, data = DATA.timeline, { onScrub, branch })
     → { el, setBranch(id), destroy() }
   onScrub(monthIndex, reading) fires whenever the reading changes: monthIndex
   is an index into data.months, or -1 while the handle stands on NOW;
   reading = { month, x, value, text, kind, branch, future, dragging }.
   ============================================================================= */
window.Timeline = (() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const W = 736, H = 57;                       /* the plot, in the frame's pixels */
  const HANDLE_H = 56;                         /* the upright stops on the rule   */
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---- a hyperscript for SVG (App.h makes HTML elements only) ---------------- */
  function s(tag, attrs, ...kids) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const fmt = v => v.toFixed(1) + '%';
  const pathOf = pts => pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ');

  /* the value a line reads at x — linear between its points, held at its ends */
  function interp(pts, x) {
    if (x <= pts[0].x) return pts[0].v;
    const last = pts[pts.length - 1];
    if (x >= last.x) return last.v;
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i].x) { const a = pts[i - 1], b = pts[i]; return a.v + (b.v - a.v) * ((x - a.x) / (b.x - a.x)); }
    }
    return last.v;
  }

  /* ---- the widget ------------------------------------------------------------ */
  function mount(el, data, opts = {}) {
    const { h } = window.App;
    data = data || (window.DATA && window.DATA.timeline);
    const onScrub = typeof opts.onScrub === 'function' ? opts.onScrub : null;
    const F = data.forecasts, branchIds = Object.keys(F);
    const N = data.months.length;
    const stops = data.months.map((_, i) => i * W / (N - 1));     /* where the eleven months stand */
    const recEnd = data.record[data.record.length - 1].x;         /* the record's last month        */

    /* the scale's own calendar: the first label names its first month */
    const [m0Name, y0] = data.months[0].split(' ');
    const m0 = MONTHS.indexOf(m0Name), spanMonths = (N - 1) * 3;
    const monthAt = x => {
      const m = m0 + Math.round(Math.max(0, Math.min(W, x)) / (W / spanMonths));
      return MONTHS[m % 12] + ' ' + (+y0 + Math.floor(m / 12));
    };
    const nearestMonth = x => Math.max(0, Math.min(N - 1, Math.round(x / (W / (N - 1)))));
    /* an event's label names it and, after a middle dot, its month; the scale supplies the month when the label does not */
    const parseLabel = (label, x) => { const [name, month = monthAt(x)] = label.split(' · '); return { name, month }; };

    let branch = F[opts.branch] ? opts.branch : branchIds[0];
    let pos = 'now';                  /* 'now' or an index into data.months */
    let dragging = false, grip = null, suppressClick = false, shown = null;
    /* the plot's width over the frame's 736: every x on the strip is drawn at sx(x) */
    let k = 1;
    const sx = x => Math.round(x * k * 100) / 100;

    const xOf = () => pos === 'now' ? data.now.x : stops[pos];
    const monthLabel = () => pos === 'now' ? data.title : data.months[pos];
    const kindOf = id => F[id].label.toLowerCase();

    /* what the strip reads at x, on the branch being read */
    function readAt(x, atNow) {
      const past = atNow || x <= recEnd;
      const value = past ? interp(data.record, x) : interp(F[branch].pts, x);
      const kind = past ? 'observed' : kindOf(branch);
      return { x, value, kind, future: !past, branch: past ? null : branch, text: fmt(value) + ' · ' + kind };
    }
    const reading = () => Object.assign(readAt(xOf(), pos === 'now'), { month: monthLabel(), dragging });

    /* ── the head: which month, what it reads there, on which branch ─────── */
    const monthEl = h('span', { class: 'tl-month' });
    const readV = h('b', { class: 'tl-read-v' }), readK = h('span', { class: 'tl-read-k' });
    /* the frame stands on NOW with the month alone; the reading joins it once the handle has left, or while it is dragged */
    const readEl = h('span', { class: 'tl-read', 'aria-live': 'polite', hidden: true }, readV, readK);
    const backBtn = h('button', { class: 'btn btn-glass tl-now', type: 'button', hidden: true, 'aria-label': 'Back to now', onclick: () => jump('now') }, 'Back to now');
    const segBtns = branchIds.map(id => h('button', { class: 'seg-btn', type: 'button', dataset: { branch: id }, 'aria-pressed': 'false',
      onclick: () => setBranch(id) }, F[id].label));
    const seg = h('div', { class: 'seg tl-seg', role: 'group', 'aria-label': 'Which forecast' }, segBtns);
    const head = h('div', { class: 'tl-head' }, monthEl, readEl, backBtn, seg);

    /* ── the plot ────────────────────────────────────────────────────────── */
    const ty = data.targetY != null ? data.targetY : 44;           /* the frame's target row */
    /* no viewBox: the strip is drawn in the pixels it is given (see layout), so nothing in it is a scaled picture */
    const svg = s('svg', { class: 'tl-svg', height: H, role: 'slider', tabindex: '0',
      'aria-label': `${data.metric} — month on the record and the forecast`, 'aria-valuemin': '0', 'aria-valuemax': String(N - 1), 'aria-orientation': 'horizontal' });

    /* 1 · the target and its name */
    const tgt = s('line', { class: 'tl-tgt', x1: 0, y1: ty, x2: W, y2: ty });
    svg.append(s('text', { class: 'tl-tgt-label', x: 0, y: 38 }, `Target ${data.target}%`), tgt);

    /* 2 · the two branches: the one being read on top */
    const fcEls = {};
    for (const id of [...branchIds].reverse()) {
      fcEls[id] = s('path', { class: 'tl-fc', dataset: { branch: id }, style: { stroke: F[id].color } });
    }
    /* the branch being read is drawn over the other; the record over both */
    const order = () => { for (const id of branchIds) if (id !== branch) svg.append(fcEls[id]); svg.append(fcEls[branch], rec, pins, handle); };

    /* 3 · the record — the only solid line on the strip */
    const rec = s('polyline', { class: 'tl-rec' });

    /* 4 · the things you can put a pointer on. Each remembers, in the frame's pixels, where it stands (_pos)
          and where its tooltip points (_at); layout() places it at the plot's own scale. */
    const pins = s('g', { class: 'tl-pins' });
    const riskAt = parseLabel(data.risk.label, data.risk.x);
    const riskText = `${riskAt.month} · ${riskAt.name} — ${data.risk.note}`;
    const risk = s('g', { class: 'tl-pin tl-risk', role: 'button', tabindex: '0',
      dataset: { month: String(nearestMonth(data.risk.x)) }, 'aria-label': riskText },
      s('title', null, riskText),
      s('rect', { class: 'tl-hit', x: -5.5, y: -4, width: 11, height: HANDLE_H + 4 }),
      s('line', { class: 'tl-risk-stem', x1: 0, y1: 0, x2: 0, y2: HANDLE_H }),
      s('path', { class: 'tl-risk-cap', d: 'M0,-3 L3,0 L0,3 L-3,0 Z' }));
    /* the pin says what the document pinned there — its own month and note — not a number read off a line */
    risk._tip = () => riskText;
    risk._pos = { x: data.risk.x, y: 0 };
    risk._at = { x: data.risk.x, y: -3 };
    pins.append(risk);

    for (const p of data.record) {
      const month = monthAt(p.x);
      const g = s('g', { class: 'tl-pin tl-pt', role: 'button', tabindex: '0',
        dataset: { month: String(nearestMonth(p.x)) }, 'aria-label': `${month} · ${fmt(p.v)} · observed` },
        s('circle', { class: 'tl-hit', r: 8 }), s('circle', { class: 'tl-pt-dot', r: 2.5 }));
      g._tip = () => `${month} · ${fmt(p.v)} · observed`;
      g._pos = g._at = { x: p.x, y: p.y };
      pins.append(g);
    }
    for (const m of data.marks) {
      const { name, month } = parseLabel(m.label, m.x);
      const g = s('g', { class: 'tl-pin tl-mark', role: 'button', tabindex: '0',
        dataset: { month: String(nearestMonth(m.x)) }, 'aria-label': `${month} · ${fmt(m.v)} · ${name}` },
        s('circle', { class: 'tl-hit', r: 9 }), s('rect', { class: 'tl-mark-d', x: -2.45, y: -2.45, width: 4.9, height: 4.9 }));
      g._tip = () => `${month} · ${fmt(m.v)} · ${name}`;
      g._pos = g._at = { x: m.x, y: m.y };
      pins.append(g);
    }

    /* 5 · where the handle is standing */
    const handle = s('rect', { class: 'tl-handle', x: 0, y: 0, width: 2, height: HANDLE_H });
    order();

    const past = h('div', { class: 'tl-past', 'aria-hidden': 'true' });
    const track = h('div', { class: 'tl-track' }, past, svg);

    const monthBtns = data.months.map((m, i) => {
      const b = h('button', { class: 'tl-mo', type: 'button', dataset: { i: String(i) }, onclick: () => jump(i) }, m);
      b._tip = () => `${m} · ${readAt(stops[i], false).text}`;
      return b;
    });
    const months = h('div', { class: 'tl-months', role: 'group', 'aria-label': 'Months — jump to one' }, monthBtns);
    const plot = h('div', { class: 'tl-plot' }, track, months);

    const tip = h('div', { class: 'tl-tip', role: 'tooltip', 'aria-hidden': 'true' });
    const root = h('div', { class: 'tl-widget', dataset: { branch } }, head, plot, tip);
    el.append(root);

    /* ── the strip, at the width it is given ─────────────────────────────── */
    /* every x is the frame's times k; heights, strokes, dots and type stay the frame's */
    function layout() {
      const w = track.clientWidth;
      if (!w) return false;
      k = w / W;
      tgt.setAttribute('x2', sx(W));
      for (const id of branchIds) fcEls[id].setAttribute('d', pathOf(F[id].pts.map(p => ({ x: sx(p.x), y: p.y }))));
      rec.setAttribute('points', data.record.map(p => sx(p.x) + ',' + p.y).join(' '));
      for (const p of pins.children) p.setAttribute('transform', `translate(${sx(p._pos.x)},${p._pos.y})`);
      past.style.width = (8 + sx(data.past.w)) + 'px';             /* the ground reaches the plate's own edge */
      return true;
    }
    /* the observer speaks only when the track's size has changed — the first time once the widget is in the document */
    const relayout = () => { if (layout()) render(); };
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(relayout) : null;
    if (ro) ro.observe(track); else window.addEventListener('resize', relayout);
    layout();

    /* ── the tooltip ─────────────────────────────────────────────────────── */
    function showTip(anchor) {
      if (dragging || !anchor._tip) return;
      shown = anchor;
      tip.textContent = anchor._tip();
      const rr = root.getBoundingClientRect();
      let left, top;
      if (anchor._at) {
        const tr = svg.getBoundingClientRect();
        left = tr.left - rr.left + sx(anchor._at.x); top = tr.top - rr.top + anchor._at.y - 7;
      } else {
        const ar = anchor.getBoundingClientRect();
        left = ar.left - rr.left + ar.width / 2; top = ar.top - rr.top - 4;
      }
      tip.classList.add('is-on'); tip.setAttribute('aria-hidden', 'false');
      const half = tip.offsetWidth / 2;
      left = Math.max(4 + half, Math.min(rr.width - 4 - half, left));
      tip.style.left = left + 'px'; tip.style.top = Math.max(0, top) + 'px';
    }
    function hideTip(anchor) {
      if (anchor && shown !== anchor) return;
      shown = null; tip.classList.remove('is-on'); tip.setAttribute('aria-hidden', 'true');
    }
    for (const a of [...pins.children, ...monthBtns]) {
      a.addEventListener('pointerenter', () => showTip(a));
      a.addEventListener('pointerleave', () => hideTip(a));
      a.addEventListener('focus', () => showTip(a));
      a.addEventListener('blur', () => hideTip(a));
    }

    /* ── the picture, brought up to date ─────────────────────────────────── */
    function render() {
      const r = reading();
      handle.style.transform = `translateX(${Math.min(sx(Math.max(0, xOf())), sx(W) - 2)}px)`;
      monthEl.textContent = r.month;
      readV.textContent = fmt(r.value); readK.textContent = ' · ' + r.kind;
      readEl.hidden = pos === 'now' && !dragging;
      backBtn.hidden = pos === 'now';
      root.dataset.branch = branch;
      root.classList.toggle('is-future', r.future);
      for (const id of branchIds) fcEls[id].classList.toggle('is-on', id === branch);
      for (const b of segBtns) { const on = b.dataset.branch === branch; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); }
      for (const b of monthBtns) { if (+b.dataset.i === pos) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }
      svg.setAttribute('aria-valuenow', String(pos === 'now' ? nearestMonth(data.now.x) : pos));
      svg.setAttribute('aria-valuetext', `${r.month} · ${r.text}`);
      if (shown) showTip(shown);
      return r;
    }
    const fire = r => { if (onScrub) onScrub(pos === 'now' ? -1 : pos, r || reading()); };

    /* move the handle and/or the branch; whoever listens hears about it only when the reading itself changed */
    function jump(to, b) {
      const before = pos + '|' + branch, was = reading();
      if (to === 'now' || (Number.isInteger(to) && to >= 0 && to < N)) pos = to;
      if (b && F[b]) branch = b;
      if (pos + '|' + branch === before) return;
      order();
      const r = render();
      if (r.month !== was.month || r.text !== was.text) fire(r);
    }
    function setBranch(id) { if (F[id]) jump(pos, id); }

    /* ── the handle, under a pointer ─────────────────────────────────────── */
    /* pointer x, in the frame's pixels — the strip's own width is W·k */
    const xAt = e => { const r = svg.getBoundingClientRect(); return (e.clientX - r.left) * (W / (r.width || W)); };
    /* the eleven months and NOW are the places the handle can stand */
    function nearest(x) {
      let best = 'now', d = Math.abs(x - data.now.x);
      stops.forEach((sx, i) => { const di = Math.abs(x - sx); if (di < d) { d = di; best = i; } });
      return best;
    }
    const hold = e => {
      try { svg.setPointerCapture(e.pointerId); } catch (_) {}
      dragging = true; root.classList.add('is-dragging'); hideTip(); render();
    };
    svg.addEventListener('pointerdown', e => {
      if (e.button) return;
      grip = { id: e.pointerId, x0: e.clientX, pin: !!e.target.closest('.tl-pin') };
      if (grip.pin) return;                     /* a press on a pin waits to see what it becomes */
      e.preventDefault(); svg.focus({ preventScroll: true });
      hold(e); jump(nearest(xAt(e)));
    });
    svg.addEventListener('pointermove', e => {
      if (!grip || e.pointerId !== grip.id) return;
      if (!dragging) { if (Math.abs(e.clientX - grip.x0) < 6) return; hold(e); }
      jump(nearest(xAt(e)));
    });
    const release = e => {
      if (!grip || (e && e.pointerId !== grip.id)) return;
      grip = null;
      if (dragging) { dragging = false; root.classList.remove('is-dragging'); suppressClick = true; render(); fire(); }
    };
    svg.addEventListener('pointerup', release);
    svg.addEventListener('pointercancel', release);
    svg.addEventListener('lostpointercapture', release);

    /* a pin's own click lands the handle on its month; the risk pin also reads the branch it belongs to */
    const activate = pin => { const i = +pin.dataset.month; if (pin.classList.contains('tl-risk')) jump(i, branchIds[0]); else jump(i); };
    svg.addEventListener('click', e => {
      if (suppressClick) { suppressClick = false; return; }
      const pin = e.target.closest('.tl-pin'); if (pin) { e.stopPropagation(); activate(pin); }
    });

    /* keys, scoped to the strip: arrows walk the months, Home/End go to the ends */
    svg.addEventListener('keydown', e => {
      const pin = e.target.closest('.tl-pin');
      if (pin && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activate(pin); return; }
      const x = xOf();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); let i = -1; stops.forEach((sx, k) => { if (sx < x - .5) i = k; }); if (i >= 0) jump(i); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); const i = stops.findIndex(sx => sx > x + .5); if (i >= 0) jump(i); }
      else if (e.key === 'Home') { e.preventDefault(); jump(0); }
      else if (e.key === 'End') { e.preventDefault(); jump(N - 1); }
      else if (e.key === 'Backspace' && pos !== 'now') { e.preventDefault(); jump('now'); }
    });

    render();

    return {
      el: root,
      setBranch,
      destroy() {
        if (ro) ro.disconnect(); else window.removeEventListener('resize', relayout);
        grip = null; dragging = false; shown = null; root.remove();
      },
    };
  }

  return { mount };
})();
