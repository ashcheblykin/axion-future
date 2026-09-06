/* =============================================================================
   globe.js — the live planet under the stage.

   The renderer is the one from the City View prototype, lifted whole:
   assets/focus/globe/{state,geo,mapview}.js draw an orthographic sphere on a
   2D canvas from world-110m.js and cv-core.js. Everything that prototype wraps
   around it — the HUD, the drawers, the timeline, the POI buttons — is left
   behind. Two things are added here: the aperture is the stage's clear area
   rather than the viewport, so the planet sits where the frame draws it; and
   the six documented cases are pinned on it, which the source renderer only
   does on the flat map.
   ============================================================================= */
(function () {
  'use strict';

  const cvs = document.getElementById('world');
  if (!cvs || !window.MapView || !window.FM) { window.FocusGlobe = { ready: false }; return; }

  const free = document.getElementById('stageFree');
  const pins = document.getElementById('pins');

  /* the pins' state, declared before the draw loop can reach placePins() */
  let subjects = [], onPick = null, current = null;

  /* #pins is a layer, not a list. Three things live in it — the case pins, the
     chip that names what the cursor is over on the globe (aperture.js) and the
     card a capture's footprint raises (globe/scenecard.js) — and only the
     first belongs to this module. The loops below used to walk `pins.children`
     and hide everything they could not find a subject for, which is every
     frame, so the other two were being switched off underneath whoever had
     just shown them: the globe's tooltip survived only while the map happened
     to be idle. They walk their own elements now. */
  const pinEls = () => (pins ? pins.querySelectorAll(':scope > .pin') : []);

  /* ---- boot -------------------------------------------------------------- */
  CV.LANG = 'en';
  FM.lang = 'en';
  MapView.init();
  FM.booted = true;

  let painted = false;
  (function loop(now) {
    if (MapView.tick(now)) { painted = true; placePins(); }
    requestAnimationFrame(loop);
  })(performance.now());

  /* the renderer only repaints when something asked it to; a size change of the
     clear area is one of those things, and it is not a window resize */
  if (window.ResizeObserver && free) new ResizeObserver(() => MapView.invalidate()).observe(free);

  /* A pin has to be clickable, so it takes the pointer — and that made it eat
     the wheel as well, which is how the zoom came to do nothing wherever a
     case happened to be sitting. Pointer-events is all-or-nothing per element,
     so the wheel is handed back to the canvas by hand. */
  if (pins) pins.addEventListener('wheel', (e) => {
    const cv = document.getElementById('world');
    if (!cv) return;
    e.preventDefault();
    cv.dispatchEvent(new WheelEvent('wheel', {
      deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ, deltaMode: e.deltaMode,
      clientX: e.clientX, clientY: e.clientY,
      /* A trackpad pinch reaches the page as a ctrl-wheel, and the renderer
         picks its rate off exactly that flag — 1/22 for a pinch against 1/80
         for a scroll. Rebuilding the event without it made a pinch anywhere
         over a case pin zoom 3.6x too slowly. */
      ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, altKey: e.altKey,
      bubbles: false, cancelable: true,
    }));
  }, { passive: false });

  /* ---- the pins ---------------------------------------------------------- */
  /* Three of the six cases sit within a few kilometres of each other, so at
     planet scale their pins land on the same pixel and only the last one drawn
     could ever be clicked. Colliding pins are fanned onto a small ring. */
  const NEAR = 18;
  const ring = (n) => 8 + n * 2.6;      /* enough room that each keeps its own hit area */

  /* The window the map is read through. It starts as the room the two readings
     leave — the same box the planet's aperture is seated in — and then gives
     way to whatever panel stands on it: the reading columns overhang it by a
     few pixels, the tools sit in its top corner, the dock covers its foot.
     A case outside this box is not on screen, whether it left the viewport or
     went under a panel, and its pin goes on the border instead. */
  const PAD = 20;                      /* the border holds this much clear of a panel */
  const LIMB = 5;                      /* and a marker rides this far off the planet's edge */
  const OVER = ['#colLeft', '#colRight', '#titleBar', '.gen-header.tools', '#scaleBar', '#dock'];
  function mapWindow() {
    const el = document.getElementById('stageFree');
    const b = el ? el.getBoundingClientRect()
      : { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    let L = b.left + PAD, R = b.right - PAD, T = b.top + PAD, B = b.bottom - PAD;
    for (const sel of OVER) {
      const panel = document.querySelector(sel);
      if (!panel || panel.hidden) continue;
      const r = panel.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.right <= b.left || r.left >= b.right || r.bottom <= b.top || r.top >= b.bottom) continue;
      /* a panel takes the side it comes in from, which is the side it reaches
         the least far past: the dock is wider than it is deep, so it takes the
         foot of the room rather than the whole of it */
      const deep = [r.right - b.left, b.right - r.left, r.bottom - b.top, b.bottom - r.top];
      const side = deep.indexOf(Math.min.apply(null, deep));
      if (side === 0) L = Math.max(L, r.right + PAD);
      else if (side === 1) R = Math.min(R, r.left - PAD);
      else if (side === 2) T = Math.max(T, r.bottom + PAD);
      else B = Math.min(B, r.top - PAD);
    }
    /* if the panels have eaten it whole there is nothing left to clamp into,
       and the room itself is the honest answer */
    if (R - L < 80 || B - T < 80) {
      L = b.left + PAD; R = b.right - PAD; T = b.top + PAD; B = b.bottom - PAD;
    }
    return { L, R, T, B, w: R - L, h: B - T, cx: (L + R) / 2, cy: (T + B) / 2 };
  }

  /* how far a ray from a point inside the window runs before it meets the border */
  function reach(x, y, dx, dy, wn) {
    let t = Infinity;
    if (dx > 1e-6) t = Math.min(t, (wn.R - x) / dx);
    else if (dx < -1e-6) t = Math.min(t, (wn.L - x) / dx);
    if (dy > 1e-6) t = Math.min(t, (wn.B - y) / dy);
    else if (dy < -1e-6) t = Math.min(t, (wn.T - y) / dy);
    return t === Infinity ? 0 : Math.max(0, t);
  }

  /* The border is one loop, and a point on it is the distance walked clockwise
     from the top-left corner. That is what lets two markers be slid apart along
     it without either of them leaving it. */
  function walk(wn, x, y) {
    const at = (v, m) => Math.min(Math.max(v, 0), m);
    if (y <= wn.T + 1) return at(x - wn.L, wn.w);
    if (x >= wn.R - 1) return wn.w + at(y - wn.T, wn.h);
    if (y >= wn.B - 1) return wn.w + wn.h + at(wn.R - x, wn.w);
    return 2 * wn.w + wn.h + at(wn.B - y, wn.h);
  }
  function unwalk(wn, t) {
    const P = 2 * (wn.w + wn.h);
    t = ((t % P) + P) % P;
    if (t <= wn.w) return [wn.L + t, wn.T];
    if (t <= wn.w + wn.h) return [wn.R, wn.T + t - wn.w];
    if (t <= 2 * wn.w + wn.h) return [wn.R - (t - wn.w - wn.h), wn.B];
    return [wn.L, wn.B - (t - 2 * wn.w - wn.h)];
  }

  function placePins() {
    if (!pins || !subjects.length) return;
    const wn = mapWindow(), cam = MapView.cam;
    const near = [], limb = [], border = [];
    for (const el of pinEls()) {
      const s = subjects[+el.dataset.i];
      if (!s || !s.ll) { el.hidden = true; continue; }
      const p = cam.proj(s.ll[1], s.ll[0]);
      if (!p) { el.hidden = true; continue; }
      el.hidden = false;
      /* round the back of the planet, or outside the window: either way the
         case is not where it is drawn, and the pin has to say which way it
         lies rather than sit on top of a reading or leave the screen */
      const back = !!cam.globe && p.length > 2 && p[2] <= 0;
      if (!back && p[0] > wn.L && p[0] < wn.R && p[1] > wn.T && p[1] < wn.B) {
        near.push({ el, x: p[0], y: p[1], ang: null });
        continue;
      }
      /* the bearing is read from the planet's centre for a case on its far
         side — that is the way you would turn it — and from the middle of the
         window for one that is simply off the map */
      const round = back && cam.vx > wn.L && cam.vx < wn.R && cam.vy > wn.T && cam.vy < wn.B;
      const ox = round ? cam.vx : wn.cx, oy = round ? cam.vy : wn.cy;
      let dx = p[0] - ox, dy = p[1] - oy;
      const d = Math.hypot(dx, dy);
      if (d < 1e-3) { dx = 0; dy = -1; } else { dx /= d; dy /= d; }
      const rim = reach(ox, oy, dx, dy, wn);
      /* a case behind the planet rides its limb, so the marker stays on the
         thing it belongs to; only when the planet itself runs past the window
         does the marker fall back to the window's own border */
      const t = round ? Math.min(rim, cam.R + LIMB) : rim;
      const m = { el, x: ox + dx * t, y: oy + dy * t, ang: Math.atan2(dy, dx) * 180 / Math.PI };
      (t < rim - .5 ? limb : border).push(m);
    }
    fan(near);
    alongLimb(limb, cam.vx, cam.vy, cam.R + LIMB);
    alongBorder(border, wn);
    for (const m of near) seat(m);
    for (const m of limb) seat(m);
    for (const m of border) seat(m);
  }

  function seat(m) {
    m.el.style.transform = 'translate(' + (m.x - 7) + 'px,' + (m.y - 7) + 'px)';
    m.el.classList.toggle('is-fanned', !!m.fanned);
    m.el.classList.toggle('is-edge', m.ang !== null);
    if (m.ang !== null) m.el.style.setProperty('--ang', m.ang.toFixed(1) + 'deg');
  }

  /* group by proximity, then fan each group of more than one */
  function fan(list) {
    const done = new Set();
    for (let i = 0; i < list.length; i++) {
      if (done.has(i)) continue;
      const group = [i];
      for (let j = i + 1; j < list.length; j++) {
        if (done.has(j)) continue;
        if (Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y) < NEAR) { group.push(j); done.add(j); }
      }
      done.add(i);
      if (group.length === 1) continue;
      const cx = group.reduce((a, k) => a + list[k].x, 0) / group.length;
      const cy = group.reduce((a, k) => a + list[k].y, 0) / group.length;
      const r = ring(group.length);
      group.forEach((k, n) => {
        const a = (n / group.length) * Math.PI * 2 - Math.PI / 2;
        list[k].x = cx + Math.cos(a) * r; list[k].y = cy + Math.sin(a) * r;
        list[k].fanned = true;
      });
    }
  }

  /* Two cases that lie the same way meet the edge at the same point and the
     nearer one hides the other, which is how six of them came to be one stack.
     The markers are slid apart along the edge instead — it is a loop, so this
     is a walk along it — and the arrow keeps pointing at where the case really
     is, so a marker that has given way still names its bearing. */
  const SEP = 26;                      /* what two markers need to read as two */
  function apart(list, P, min) {
    const last = list.length - 1;
    if (last < 1 || list.length * min >= P) return;
    for (let pass = 0; pass < 24; pass++) {
      /* the order is taken again every pass: a push can carry one marker past
         its neighbour, and a stale order reads that as a whole loop of room */
      list.forEach(m => { m.t = ((m.t % P) + P) % P; });
      list.sort((a, b) => a.t - b.t);
      let moved = false;
      for (let i = 0; i <= last; i++) {
        const a = list[i], b = list[i === last ? 0 : i + 1];
        const gap = b.t - a.t + (i === last ? P : 0);
        if (gap >= min) continue;
        const push = (min - gap) / 2;
        a.t -= push; b.t += push;
        moved = true;
      }
      if (!moved) break;
    }
  }
  /* the window's border, walked clockwise from its top-left corner */
  function alongBorder(list, wn) {
    list.forEach(m => { m.t = walk(wn, m.x, m.y); });
    apart(list, 2 * (wn.w + wn.h), SEP);
    list.forEach(m => { const q = unwalk(wn, m.t); m.x = q[0]; m.y = q[1]; });
  }
  /* and the planet's edge, walked as an angle: the cases round the back ride
     the limb in an arc rather than piling onto one point of it */
  function alongLimb(list, cx, cy, r) {
    const TAU = Math.PI * 2;
    list.forEach(m => { m.t = (Math.atan2(m.y - cy, m.x - cx) + TAU) % TAU; });
    apart(list, TAU, Math.min(SEP / Math.max(60, r), Math.PI / 5));
    list.forEach(m => { m.x = cx + Math.cos(m.t) * r; m.y = cy + Math.sin(m.t) * r; });
  }

  /* Rebuilds the pins without emptying the layer they live in: setting
     pins.innerHTML would take the globe's tooltip and the capture card with
     it, and both are owned by other modules that would never know they had
     been removed. Only this module's own elements are replaced. */
  function renderPins() {
    if (!pins) return;
    for (const el of pinEls()) el.remove();
    const frag = document.createDocumentFragment();
    subjects.forEach((s, i) => {
      const el = document.createElement('button');
      el.className = 'pin';
      el.type = 'button';
      el.dataset.i = String(i);
      el.hidden = true;
      el.style.setProperty('--pin', s.band);
      el.setAttribute('aria-label', s.title);
      el.innerHTML = '<i></i>';
      el.addEventListener('click', () => onPick && onPick(i));
      frag.appendChild(el);
    });
    /* first in the layer, so anything raised over them — a tooltip, a card —
       is a later sibling and paints on top without needing a stacking rule */
    pins.insertBefore(frag, pins.firstChild);
    mark();
    placePins();
  }

  function mark() {
    if (!pins) return;
    for (const el of pinEls()) el.classList.toggle('is-on', +el.dataset.i === current);
  }

  /* ---- turning the planet to a subject ----------------------------------- */
  let anim = null;
  function turnTo(ll, ms) {
    if (!ll) return;
    const from = MapView.getRotation();
    const to = { lon0: ll[1], lat0: ll[0] };
    let dLon = ((to.lon0 - from.lon0 + 540) % 360) - 180;
    const dur = ms == null ? 900 : ms;
    if (anim) cancelAnimationFrame(anim);
    if (dur <= 0) {                       /* no journey: put it there and repaint */
      MapView.setRotation(to.lon0, to.lat0);
      MapView.invalidate();
      return;
    }
    /* The turn writes the rotation every frame, and so does a drag, and so does
       the lean the wheel puts on the sphere — all three into the same two
       numbers. The turn was scheduled on rAF, so it ran last and won: taking
       hold of the planet within 900ms of picking a case pulled against a hand
       that kept springing it back. So the turn checks that the rotation it is
       moving is still the one it left, and gives way the moment it is not.
       Cheaper than listening for a gesture, and it covers the wheel too, which
       fires no pointerdown. */
    const t0 = performance.now();
    let mine = MapView.getRotation();
    (function step(now) {
      const at = MapView.getRotation();
      if (Math.abs(at.lon0 - mine.lon0) > 1e-6 || Math.abs(at.lat0 - mine.lat0) > 1e-6) {
        anim = null; return;                    /* someone else has the camera */
      }
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   /* easeInOutCubic */
      MapView.setRotation(from.lon0 + dLon * e, from.lat0 + (to.lat0 - from.lat0) * e);
      mine = MapView.getRotation();
      MapView.invalidate();
      if (t < 1) anim = requestAnimationFrame(step); else anim = null;
    })(t0);
  }

  /* ---- the ladder the planet is read on ---------------------------------
     Kingdom → amana → city → district. The renderer already walks it: a wheel
     up off the sphere asks for the region scale, a click on the map picks the
     unit under the pointer. This draws where that has got to, and lets it be
     walked back. --------------------------------------------------------- */
  const bar = document.getElementById('scaleBar');

  function drawWhere() {
    if (!bar) return;
    const chain = (FM.chain && FM.chain()) || [];
    const onGlobe = FM.view === 'globe';
    bar.hidden = onGlobe && chain.length <= 1;
    if (bar.hidden) { bar.innerHTML = ''; return; }
    const steps = chain.map((u, i) => {
      const last = i === chain.length - 1;
      return '<button class="scale-step" type="button" data-uid="' + String(u.id).replace(/"/g, '&quot;') + '"' +
        (last ? ' aria-current="true"' : '') + '>' + CV.nm(u) + '</button>';
    });
    bar.innerHTML =
      '<button class="scale-step scale-home" type="button" data-home="1" aria-label="Back to the planet">' +
      '<svg class="ic ic16"><use href="#i-globe"/></svg></button>' + steps.join('<i>›</i>');
  }

  if (bar) {
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.home) Nav.home();
      else if (b.dataset.uid) Nav.pickUnit(b.dataset.uid);
    });
    document.addEventListener('fm:where', drawWhere);
    FM.on('scope', drawWhere); FM.on('view', drawWhere); FM.on('scale', drawWhere);
    drawWhere();
  }

  window.FocusGlobe = {
    ready: true,
    setSubjects(list, pick) { subjects = list; onPick = pick; renderPins(); },
    focus(i, ms) {
      current = i; mark();
      /* pointing at a case only turns the planet; it does not leave it */
      if (FM.view === 'globe') turnTo(subjects[i] && subjects[i].ll, ms);
      MapView.invalidate();
    },
    home() { Nav.home(); },
    onGlobe: () => FM.view === 'globe',
    invalidate: () => MapView.invalidate(),
    /* whether the planet is on screen at all under the reading in hand */
    seen: (on) => MapView.decor(on),
    painted: () => painted,
    /* The room the map is actually read through — the stage's clear area less
       whatever panel stands on it. A case that leaves it rides the border
       (placePins) and anything the map raises over itself is kept inside it
       (globe/scenecard.js), so the two obey one definition of "on screen"
       rather than each keeping a list of the panels it has to dodge. */
    window: () => mapWindow(),
  };
})();
