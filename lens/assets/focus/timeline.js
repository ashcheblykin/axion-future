/* =============================================================================
   timeline.js — the second zoom.

   The lens zooms two ways. Into detail: the planet turns, the map comes in, the
   clip opens. And into time: this strip. Left of NOW is the record — eighteen
   months the document actually holds, Mar 2025 to Aug 2026 — and moving the
   handle there moves CV.PER, so every figure on the screen is re-read at that
   month rather than re-labelled. Right of NOW is a projection, thirteen months
   of it, drawn on two branches: what the record does if nothing is done, and
   what it does with the action package.

   The picture is the one the frame draws, and only four things are on it: the
   target, dotted, all the way across; the record, the single solid line; the
   two branches, both dotted, because a projection is never allowed to draw
   itself as solid as a record; and the upright where the handle is standing.
   The record's ground is not painted here at all — it is the plate's own
   .tl-past, which reaches the plate's edge rather than the scale's — and the
   months are type in .tl-months rather than pixels on this canvas.

   Nothing here is invented. The observed half is CV.series; the projected half
   is CV.project's six-month fit continued by FM.line; the risk pins are the
   months FM.risks says the band gets worse.

   Figma: XDOceRokvyikE1cuk6HO9S · node 5328:97870
   ============================================================================= */
(function () {
  'use strict';

  const CV = window.CV, FM = window.FM;
  const $ = (s, r = document) => r.querySelector(s);
  if (!CV || !FM || !FM.line) { window.FocusTime = { mount() {}, draw() {} }; return; }

  /* The scale runs edge to edge, as the frame draws it: the months are pinned
     at 0 and at the full width, and every reading between them sits on the
     same line as its own label. */
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();

  /* the three names a reading can go by. A projected number that does not say
     it is projected is a lie, so the readout always carries one of these. */
  const BRANCH = {
    obs:  { label: 'Observed' },
    base: { label: 'Forecast — no action' },
    act:  { label: 'Forecast — with action package' },
  };

  let track, canvas, ctx, layerRisk, layerPts, layerMarks, handle, past, months;
  let W = 0, H = 0, PADL = 8, uid = null, kpi = null, onChange = null;
  /* what the buttons on the strip were last built for — see overlays() */
  let ovKey = '';
  /* The backing-store ratio, kept where the drawing can see it. Everything on
     this strip is placed from a float — the month step is 703/30 = 23.43px, so
     essentially no index lands on a whole pixel — and on a screen that has no
     half pixel to land on, a 2px upright centred on x.37 paints three columns
     at 63/100/37 rather than two solid ones. Above 1x a half pixel is a real
     device pixel and the float is the truer position, so the snap is only for
     the screens that need it. */
  let dpr = 1;
  const crisp = () => dpr < 1.5;
  const px = (v) => (crisp() ? Math.round(v) : v);
  /* whether the handle is under a finger. A month arrived at by dragging is one
     of many on the way; a month arrived at by a key, a pin or a branch button
     is a destination. Whoever is listening is told which, because the two are
     worth showing differently. */
  let dragging = false;

  const K = () => CV.K[kpi];
  const live = () => uid && kpi && CV.K[kpi];

  /* ── geometry ─────────────────────────────────────────────────────────── */
  const xOf = (i) => i / (FM.SPAN - 1) * W;
  const iOf = (px) => Math.round(px / Math.max(1, W) * (FM.SPAN - 1));

  const INSET = 2;                          /* the stroke's own room, top and foot */
  let lo = 0, hi = 1;
  const yOf = (v) => H - INSET - (v - lo) / (hi - lo || 1) * (H - INSET * 2);

  function measure() {
    const r = track.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    /* how far the scale is inset from the plate the ground is drawn on, so the
       ground can be given the plate's edge and the scale's NOW at once */
    if (past) PADL = Math.round(r.left - past.parentNode.getBoundingClientRect().left);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── the months, written once ─────────────────────────────────────────── */
  /* Eleven of them, every third month — Mar 2025 to Sep 2027, both ends of the
     model's span on a quarter. They are spread edge to edge rather than each
     one pinned to its own reading: at this size a label is wider than the gap
     between quarters, and the frame spreads them, so the row is even and the
     ends are flush with the scale instead of the last two colliding. */
  /* The row thins itself rather than letting two labels sit on each other:
     every third month while they fit, every sixth, then every twelfth. What
     "fit" means is measured, not guessed — the row is written and then asked
     whether it overflowed, so the answer holds whatever the type is doing.
     At the frame's own width the first try is the frame's own eleven. */
  let mw = -1;
  function writeMonths() {
    if (!months) return;
    const w = Math.round(months.getBoundingClientRect().width);
    if (w === mw) return;                       /* nothing moved; nothing to redo */
    mw = w;
    /* The row is justify-content:space-between, so whatever is emitted is
       spread evenly across the track and the LAST label is painted at its far
       end — which is index SPAN-1 and nothing else. A step that does not land
       there therefore prints the wrong month in the one place the reader can
       check against the scale: 12 over 31 months emits 0, 12, 24, and painted
       Mar 2027 where Sep 2027 stands, six months and 54.8px out — at exactly
       the width, a phone's, where there is least else to go on. So only the
       steps that divide the scale's own length may be tried at all. Over 31
       months those are 3, 5, 6, 10, 15 and 30, and the first of them is still
       the frame's own eleven labels. */
    const last = FM.SPAN - 1;
    const steps = [];
    for (let s = 3; s <= last; s++) if (last % s === 0) steps.push(s);
    for (const step of steps) {
      let h = '';
      for (let i = 0; i < FM.SPAN; i += step) h += '<span>' + esc(FM.monthLabel(i)) + '</span>';
      months.innerHTML = h;
      if (months.scrollWidth <= months.clientWidth) break;
    }
  }

  /* the plate's title spells the month out, as the frame does — the axis, the
     chip and the cards keep the short form they share with the document */
  const LONG = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
    Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
  };
  function monthTitle(i) {
    const p = FM.monthLabel(i).split(' ');
    return (LONG[p[0]] || p[0]) + (p[1] ? ' ' + p[1] : '');
  }

  /* ── the picture ──────────────────────────────────────────────────────── */
  function draw() {
    if (!ctx || !W || !H) return;
    ctx.clearRect(0, 0, W, H);
    if (!live()) {
      /* a subject whose KPI the engine does not hold gets an empty scale and
         a readout that says which month it is, not a stale figure */
      layerRisk.innerHTML = layerPts.innerHTML = layerMarks.innerHTML = ovKey = '';
      if (past) past.style.width = Math.max(0, PADL + xOf(FM.NOW)) + 'px';
      $('#tlValue').textContent = 'No projectable KPI on this case';
      $('#tlDate').textContent = monthTitle(FM.ti);
      $('#tlBranch').textContent = '';
      $('#tlSep').hidden = true;
      handle.style.left = px(Math.min(Math.max(xOf(FM.ti), 1), W - 1)) + 'px';
      return;
    }

    const base = FM.line(uid, kpi, 'base'), act = FM.line(uid, kpi, 'act'), tgt = K().tgt;
    /* the scale is taken from both branches and the target together, so the
       target is always on screen and the wedge is never cropped */
    const all = base.concat(act, [tgt]);
    lo = Math.min.apply(null, all); hi = Math.max.apply(null, all);
    const pad = (hi - lo) * .13 + .25; lo -= pad; hi += pad;

    /* the ground the record stands on belongs to the plate, not to the canvas:
       it reaches the plate's own left edge and stops dead on NOW */
    if (past) past.style.width = Math.max(0, PADL + xOf(FM.NOW)) + 'px';

    /* 1 · the target, and the name of it. Dotted the whole way across, so it
       reads as the same line over the record and over the projection. */
    const ty = px(yOf(tgt));
    ctx.save();
    ctx.setLineDash([2, 4]); ctx.lineWidth = 2; ctx.lineCap = 'butt';
    ctx.strokeStyle = css('--fc-act');
    ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(W, ty); ctx.stroke();
    ctx.restore();
    ctx.font = '400 10px ' + css('--font-disp');
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = css('--fc-act');
    /* the label rides above its line, and never off the strip */
    ctx.fillText('Target ' + CV.fmtV(kpi, tgt), 0, Math.max(10, Math.min(H - 2, ty - 6)));

    const path = (arr, from, to) => {
      ctx.beginPath();
      for (let i = from; i < to; i++) (i === from ? ctx.moveTo : ctx.lineTo).call(ctx, xOf(i), yOf(arr[i]));
    };

    /* 2 · the record — the only solid line on the strip */
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = css('--fg-primary'); ctx.lineWidth = crisp() ? 1 : 1.2;
    path(base, 0, FM.OBS); ctx.stroke();
    ctx.restore();

    /* 3 · the two branches. Both dotted, both drawn: the strip shows what the
       package is worth by showing both outcomes at once, and the tab beside
       it only says which of the two the rest of the screen is reading.

       Their dots are offset half a period against each other, because on a
       fifty-seven pixel scale two branches a point apart land on the same
       line — and one dotted line painted over another is one line, not two.
       Interleaved, they read as both. The branch being read goes on last. */
    const branch = (arr, colour, phase) => {
      ctx.save();
      ctx.setLineDash([2, 4]); ctx.lineDashOffset = phase; ctx.lineWidth = 2; ctx.lineCap = 'butt';
      ctx.strokeStyle = colour;
      path(arr, FM.NOW, FM.SPAN); ctx.stroke();
      ctx.restore();
    };
    const drawBase = () => branch(base, css('--fc-base'), 0);
    const drawAct  = () => branch(act,  css('--fc-act'),  3);
    if (FM.branch === 'act') { drawBase(); drawAct(); } else { drawAct(); drawBase(); }

    /* 4 · where the handle is standing, and what it reads there. On the two
       end months it is held a pixel inside the scale, so the upright is still
       a whole upright rather than half of one hanging off the edge. */
    const cur = FM.ti <= FM.NOW ? base[FM.ti] : (FM.branch === 'act' ? act : base)[FM.ti];
    handle.style.left = px(Math.min(Math.max(xOf(FM.ti), 1), W - 1)) + 'px';
    overlays(base);
    readout(cur);
  }

  /* ── the things you can click on the line ─────────────────────────────── */
  function overlays(base) {
    /* Where these stand depends on the case, the KPI and the size of the box —
       and on nothing that a scrub changes. They were rebuilt anyway: three
       innerHTML assignments tearing down and re-parsing about eighteen
       <button> elements on every frame of a drag, including the risk pin the
       pointer was on, which is why a click on one could land on an element
       that no longer existed. Built when their inputs change, and left alone
       the rest of the time. */
    const key = uid + '|' + kpi + '|' + W + '|' + H + '|' + lo.toFixed(3) + '|' + hi.toFixed(3);
    if (key === ovKey) return;
    ovKey = key;
    /* the months the band gets worse if nothing is done. A clean scope has
       none, and shows none — that is the honest outcome, not a gap. */
    const risks = FM.risks(uid, kpi);
    layerRisk.innerHTML = risks.map(r =>
      `<button class="tl-risk" type="button" data-i="${r.i}" style="left:${px(xOf(r.i))}px;--pin:var(--band-${r.band})"
         aria-label="${esc(FM.monthLabel(r.i))} — falls to ${esc(bandName(r.band))} if no action is taken"
         title="${esc(FM.monthLabel(r.i))} · ${esc(CV.fmtV(kpi, r.v))} — ${esc(bandName(r.band))} if no action is taken"><i></i></button>`).join('');

    let pts = '';
    for (let i = FM.NOW + 1; i < FM.SPAN; i++) {
      pts += `<button class="tl-pt" type="button" data-i="${i}" style="left:${px(xOf(i))}px;top:${px(yOf(base[i]))}px"
        aria-label="${esc(FM.monthLabel(i))}" title="${esc(why(i))}"></button>`;
    }
    layerPts.innerHTML = pts;

    /* the marks the record itself puts on the past */
    layerMarks.innerHTML = pastMarks().map(m =>
      `<button class="tl-mark${m.hi ? ' is-hi' : ''}" type="button" data-i="${m.i}"
         style="left:${px(xOf(m.i))}px;top:${px(yOf(base[m.i]))}px" aria-label="${esc(m.text)}"
         title="${esc(FM.monthLabel(m.i))} — ${esc(m.text)}"></button>`).join('');
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const bandName = (b) => ['on target', 'near target', 'fair', 'weak', 'critical'][b] || '';

  /* why a projected month reads the way it does — the counterfactual last */
  function why(i) {
    const base = FM.line(uid, kpi, 'base'), act = FM.line(uid, kpi, 'act');
    return FM.monthLabel(i) + ' — ' + CV.nm(K()) + ' ' + CV.fmtV(kpi, base[i]) +
           ', ' + bandName(CV.band(kpi, base[i])) +
           '\n' + CV.fmtV(kpi, act[i]) + ' with the action package';
  }

  /* Three sources, all from the document, and none of them backfilled: the
     recorded decline it hard-codes for this scope, the last inspection the
     case register holds, and the largest single month-on-month step. Scopes
     the document has nothing to say about carry no marks. */
  function pastMarks() {
    const s = CV.series(uid, kpi), out = [];
    if (CV.SHOCK && CV.SHOCK[uid + '|' + kpi]) {
      out.push({ i: FM.NOW - 2, hi: true, text: 'Recorded decline — ' + CV.SHOCK[uid + '|' + kpi] + ' points over three months' });
    }
    for (const m of CV.MON) {
      if (m.uid !== uid || !m.insp || m.insp.d == null) continue;
      const i = FM.NOW - Math.round(m.insp.d / 30.44);
      if (i < 0 || i > FM.NOW) continue;
      out.push({ i, hi: !!m.insp.stale, text: 'Last inspection — ' + m.insp.resEn + (m.insp.stale ? ', overdue' : '') });
      break;
    }
    let bi = -1, bv = 0, mean = 0;
    for (let i = 1; i < FM.OBS; i++) mean += Math.abs(s[i] - s[i - 1]);
    mean /= FM.OBS - 1;
    for (let i = 1; i < FM.OBS; i++) {
      const d = Math.abs(s[i] - s[i - 1]);
      if (d > bv) { bv = d; bi = i; }
    }
    if (bi > 0 && bv > mean * 1.9 && !out.some(m => Math.abs(m.i - bi) < 3)) {
      out.push({ i: bi, hi: false, text: (s[bi] > s[bi - 1] ? 'Largest rise' : 'Largest fall') + ' in the record — ' + CV.fmtV(kpi, s[bi] - s[bi - 1]) });
    }
    return out.sort((a, b) => a.i - b.i).slice(0, 4);
  }

  /* ── the readout ──────────────────────────────────────────────────────── */
  function readout(v) {
    const b = FM.ti < FM.NOW ? 'obs' : FM.ti === FM.NOW ? 'obs' : FM.branch;
    /* the month is the plate's own title now, and the reading sits opposite it:
       what is being read, then the name of the line it was read off */
    $('#tlDate').textContent = monthTitle(FM.ti);
    $('#tlValue').textContent = live() ? CV.nm(K()) + ' ' + CV.fmtV(kpi, v) : '';
    const el = $('#tlBranch');
    el.textContent = BRANCH[b].label;
    $('#tlSep').hidden = !el.textContent;
    /* where in time the handle is standing is the handle's own business — the
       only thing left to offer is the way back, and only when we have left */
    const back = $('#tlNow');
    if (back) back.hidden = FM.ti === FM.NOW;
    /* a branch only means something ahead of NOW, so neither reads as chosen
       while the handle is standing on the record — and neither is offered */
    for (const btn of $('#tlBranches').children) {
      const on = FM.ti > FM.NOW && btn.dataset.branch === FM.branch;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.disabled = FM.ti < FM.NOW;
    }
    track.setAttribute('aria-valuenow', String(FM.ti));
    track.setAttribute('aria-valuetext', FM.monthLabel(FM.ti) + ' · ' + BRANCH[b].label);
  }

  /* ── wiring ───────────────────────────────────────────────────────────── */
  function jump(i, branch) {
    const before = FM.ti + '|' + FM.branch;
    FM.setTime(i, branch);
    if (FM.ti + '|' + FM.branch === before) { draw(); return; }   /* setTime is a no-op on a repeat */
    draw();
    if (onChange) onChange(dragging);
  }

  function mount(opts) {
    track = $('#tlTrack'); canvas = $('#tlCanvas');
    if (!track || !canvas) return;
    ctx = canvas.getContext('2d');
    layerRisk = $('#tlRisks'); layerPts = $('#tlPoints'); layerMarks = $('#tlMarks'); handle = $('#tlHandle');
    past = $('#tlPast'); months = $('#tlMonths');
    onChange = opts && opts.onChange;
    /* the scale's own length is the model's, not a number written into the page */
    track.setAttribute('aria-valuemax', String(FM.SPAN - 1));
    writeMonths();

    /* Where the pointer is on the scale, in months. */
    const at = (e) => iOf(e.clientX - track.getBoundingClientRect().left);
    /* How far a press may land from the handle and still be a grab rather than
       a destination. A fingertip is about 44px across and the scale is 10.9px
       a month at 390 wide, so a thumb covers four months and there is no
       reading of "where you pressed" precise enough to be the answer: pressing
       at x=20 threw the handle from Aug 2026 to May 2025 in one contact.
       Inside the reach the drag is RELATIVE — the handle keeps the offset it
       was picked up by — and outside it a press is still a destination and
       still jumps, because that is how the strip is read with a mouse. */
    const REACH = 22;
    const SLOP  = 6;      /* px before a press on a pin becomes a scrub */
    let grip = null;      /* the press in hand, and its offset in months */

    /* Nothing is committed before the capture is taken. setPointerCapture can
       throw — a synthetic pointer, one already released — and this was the one
       unguarded call on the page, with `dragging` set before it: a throw left
       the strip scrubbing on every later move with nothing held. */
    const hold = (e) => {
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
      dragging = true;
    };

    track.addEventListener('pointerdown', (e) => {
      const i = at(e);
      const px = W / Math.max(1, FM.SPAN - 1);
      grip = {
        id: e.pointerId, x0: e.clientX,
        held: Math.abs(i - FM.ti) * px <= REACH ? FM.ti - i : 0,
        /* the thirteen forecast pins and the record's marks are buttons of
           their own, and their click is what lands the handle on an exact
           month. A press on one waits to see what it becomes. */
        pin: !!e.target.closest('.tl-risk,.tl-pt,.tl-mark'),
      };
      if (grip.pin) return;
      hold(e);
      if (!grip.held) jump(i);
    });

    track.addEventListener('pointermove', (e) => {
      const g = grip;
      if (!g || e.pointerId !== g.id) return;
      /* A press on a pin that MOVES is a scrub. Refusing outright is what made
         the whole future half of the scale undraggable: at 10.9px a month the
         pins tile the row solid and cover half the track's area, so on a phone
         there was nowhere left to take hold of it. One that lifts without
         moving is still the pin's own click, and still jumps to that month. */
      if (!dragging) {
        if (Math.abs(e.clientX - g.x0) < SLOP) return;
        hold(e);
      }
      jump(at(e) + g.held);
    });
    const release = () => { dragging = false; grip = null; };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);

    /* scoped to the strip — the first prototype put this on window and stole
       the arrow keys from every other control on the page */
    track.addEventListener('keydown', (e) => {
      const step = { ArrowLeft: -1, ArrowRight: 1, PageDown: -3, PageUp: 3 }[e.key];
      if (step != null) { e.preventDefault(); jump(FM.ti + step); return; }
      if (e.key === 'Home') { e.preventDefault(); jump(0); }
      if (e.key === 'End')  { e.preventDefault(); jump(FM.SPAN - 1); }
    });

    track.addEventListener('click', (e) => {
      const r = e.target.closest('.tl-risk');
      if (r) { e.stopPropagation(); jump(+r.dataset.i, 'base'); return; }
      const p = e.target.closest('.tl-pt,.tl-mark');
      if (p) { e.stopPropagation(); jump(+p.dataset.i); }
    });

    for (const el of [$('#tlNow'), $('#timeChip')]) {
      if (el) el.addEventListener('click', () => jump(FM.NOW, 'base'));
    }

    $('#tlBranches').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      /* a branch means nothing in the past, so choosing one moves you forward */
      jump(Math.max(FM.ti, FM.NOW + 1), b.dataset.branch);
    });

    const relayout = () => { measure(); writeMonths(); draw(); };
    new ResizeObserver(relayout).observe(track);
    /* the observer alone misses a viewport change that leaves the track's own
       box untouched until a frame later, and a stale canvas draws the scale at
       the old width — the window's own event catches those */
    addEventListener('resize', relayout);
    measure();
  }

  function setSubject(u, k) {
    uid = u; kpi = k;
    if (!live()) { if (ctx) ctx.clearRect(0, 0, W, H); return; }
    measure(); draw();
  }

  window.FocusTime = {
    mount, draw, setSubject,
    /* what the strip is currently reading, for the cards that must agree with it */
    branchLabel() { return BRANCH[FM.ti <= FM.NOW ? 'obs' : FM.branch].label; },
    isFuture() { return FM.ti > FM.NOW; },
    reset() { jump(FM.NOW, 'base'); },
  };
})();
