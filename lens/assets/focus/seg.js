/* =============================================================================
   seg.js — the chip that slides.

   Which reading, where in time, which forecast: three groups on this screen ask
   for one choice out of several, and each of them marks the choice with a chip
   in its track. This file moves that chip. Nothing else — the choice itself
   belongs to whoever owned it before. focus.js keeps putting .is-on on a
   reading, timeline.js keeps putting it on a month and a branch, and this
   watches for that class and follows it. So a reading chosen by a click, by a
   key, or by the camera arriving at the street all move the chip the same way,
   and nothing has to be told twice.

   Three things the chip does that a background under a button cannot:

   · its two edges are given different times, so the trailing one lags and the
     chip stretches on the way over — the longer the throw, the more it pulls;
   · the fill drops out while it travels and comes back with the rim lit as it
     lands, so the move reads as one object being carried across rather than a
     colour being repainted somewhere else;
   · and it can be picked up. Press it and it swells; drag it and it follows the
     finger, rubber-banding at the ends; let go and the tab it is over is the
     one that gets clicked — by the group's own handler, so nothing downstream
     ever learns there was a gesture.

   The chip is drawn by seg.css as the group's own ::before and ::after, placed
   by the custom properties written here. Nothing is added to the DOM: every
   loop over a group's children elsewhere still sees buttons and only buttons.

   Under prefers-reduced-motion there is no travel and no gesture: the chip is
   simply where the choice is.
   ============================================================================= */
(function () {
  'use strict';

  /* The groups on this screen that hold one choice out of several. They are
     marked in the markup as well (.seg-slide); naming them here too means a
     rewrite of the dock cannot quietly drop the behaviour. The tools group in
     the header is deliberately not one of these — its three buttons are three
     switches, not one choice. */
  const GROUPS = '#lensTabs,#tlBranches,.seg-slide';

  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const still = matchMedia('(prefers-reduced-motion:reduce)');

  /* the motion scale, read off the page the first time it is wanted. The
     fallbacks are what seg.css states, in case the sheet ever goes missing. */
  let T = null;
  const num = (k, fb) => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(k));
    return v > 0 ? v : fb;
  };
  const motion = () => T || (T = {
    lead:  num('--pill-lead', 220),
    trail: num('--pill-trail', 320),
    hold:  num('--pill-hold', 110),
    pop:   num('--pill-pop', 240),
  });

  const PAD   = 2;     /* the track's own padding — the chip stays inside it */
  const GRAB  = 6;     /* px of travel before a press becomes a drag         */
  /* A finger has to travel further than a mouse before this file may call the
     gesture its own. Chrome commits a scroll at 8 CSS px and iOS at about
     10pt, so a 6px threshold on a touch screen always claimed the gesture
     first and then lost it — and losing it arrives as a pointercancel, which
     is the browser saying the gesture was never yours. 6 stays for a mouse,
     where 12 would feel dead. The band that decides whether the press landed
     on the chip at all keeps GRAB either way: 12 of slack on a 24px-tall
     track swallows the first six pixels of the tab next door. */
  const TOUCH = 12;
  const grab  = (e) => (e.pointerType === 'touch' ? TOUCH : GRAB);
  const SWELL = 2.5;   /* px a pressed chip grows on every side              */
  const CARRY = 1;     /* and while it is being carried                      */
  const OVER  = 3;     /* how far it may be pulled past either end           */

  const kept = [];

  /* ── one group ──────────────────────────────────────────────────────────── */

  const btns   = (g) => $$('.seg-btn', g.box).filter(b => !b.hidden && !b.disabled);
  const chosen = (g) => {
    const b = g.box.querySelector('.seg-btn.is-on');
    return b && !b.hidden && !b.disabled ? b : null;
  };
  const state = (g, s) => { g.box.dataset.chip = s; };
  const set   = (g, k, v) => g.box.style.setProperty(k, v);

  const stop  = (g) => { g.timers.forEach(clearTimeout); g.timers = []; };
  const clock = (g, fn, ms) => g.timers.push(setTimeout(fn, ms));

  /* where a button sits in its track, measured from the track's own edges */
  function edges(g, el) {
    const b = g.box.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { l: r.left - b.left, r: b.right - r.right, w: r.width };
  }
  function put(g, l, r) {
    g.l = l; g.r = r;
    set(g, '--chip-l', l + 'px');
    set(g, '--chip-r', r + 'px');
  }
  function times(g, dl, dr) {
    set(g, '--chip-dl', dl + 'ms');
    set(g, '--chip-dr', dr + 'ms');
  }
  /* the width of the chip as it stands, which is the width of a label plus its
     padding — a five-word tab and a two-letter one are not the same object */
  const wide = (g) => Math.max(1, g.box.getBoundingClientRect().width - g.l - g.r);

  /* the chip swells by the same number of pixels on every side, whatever is
     under it. One scale factor for every chip would poke the wide one halfway
     across its neighbour and barely move the narrow one. */
  function swell(g, px) {
    const h = Math.max(1, g.box.clientHeight - 2 * PAD);
    set(g, '--chip-sx', (1 + 2 * px / wide(g)).toFixed(4));
    set(g, '--chip-sy', (1 + 2 * px / h).toFixed(4));
  }
  const flat = (g) => { set(g, '--chip-sx', '1'); set(g, '--chip-sy', '1'); };

  /* it lands: the rim lights, holds, and goes out */
  function land(g, gen) {
    state(g, 'lit');
    clock(g, () => { if (g.gen === gen) state(g, 'rest'); }, motion().hold);
  }

  /* put it over the choice with no travel at all — first sight, a resize, a
     typeface landing and every label changing width under it */
  function snap(g, el) {
    const e = edges(g, el);
    times(g, 0, 0);
    put(g, e.l, e.r);
  }

  /* ── the move ───────────────────────────────────────────────────────────── */

  function travel(g) {
    if (g.drag) return;
    const el = chosen(g);
    if (!el) { stop(g); g.gen++; g.at = null; state(g, 'off'); return; }
    if (!g.box.clientWidth) return;            /* the group is not on screen */

    const M = motion();
    /* first sight — a page opening, a group rebuilt — is not an arrival: the
       chip is simply already there. Coming back from nothing is an arrival. */
    const first = !g.at || !g.box.contains(g.at);
    const back = g.box.dataset.chip === 'off';
    stop(g);
    const gen = ++g.gen;
    g.at = el;

    if (still.matches || first || back) {
      snap(g, el);
      if (still.matches || first) state(g, 'rest'); else land(g, gen);
      return;
    }

    const to = edges(g, el);
    const ahead = to.l >= g.l;                 /* which edge leads, which lags */
    const dl = ahead ? M.trail : M.lead;
    const dr = ahead ? M.lead  : M.trail;
    state(g, 'move');
    times(g, dl, dr);
    put(g, to.l, to.r);
    clock(g, () => { if (g.gen === gen) land(g, gen); }, Math.max(dl, dr));
  }

  /* back over the choice without the stretch: nothing changed hands, a finger
     only let go of it */
  function settle(g) {
    const el = chosen(g);
    if (!el) { g.gen++; g.at = null; state(g, 'off'); return; }
    const M = motion();
    const gen = ++g.gen;
    g.at = el;
    const e = edges(g, el);
    times(g, M.lead, M.lead);
    put(g, e.l, e.r);
    land(g, gen);
  }

  /* the class is the only thing this file listens to */
  function sync(g) {
    if (g.drag) return;
    const el = chosen(g);
    if (el && el === g.at && g.box.dataset.chip !== 'off') return;
    travel(g);
  }

  function reseat(g) {
    if (g.drag || !g.box.clientWidth) return;
    const el = chosen(g);
    if (!el) { g.at = null; state(g, 'off'); return; }
    g.at = el;
    snap(g, el);
    if (g.box.dataset.chip === 'off') state(g, 'rest');
  }

  /* ── the gestures ───────────────────────────────────────────────────────── */

  /* where each tab that can be chosen has its centre, measured once per
     gesture rather than once per frame */
  const stops = (g) => {
    const b = g.box.getBoundingClientRect();
    return btns(g).map(el => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left - b.left + r.width / 2 };
    });
  };
  const nearest = (x, list) =>
    list.reduce((a, s) => (a && Math.abs(a.x - x) <= Math.abs(s.x - x) ? a : s), null);

  function rubber(v, min, max) {
    if (v < min) return min - Math.min(OVER, Math.pow(min - v, .82));
    if (v > max) return max + Math.min(OVER, Math.pow(v - max, .82));
    return v;
  }
  const near = (g, el) => { for (const b of $$('.seg-btn', g.box)) b.classList.toggle('is-near', b === el); };

  function down(g, e) {
    if (still.matches || e.button) return;
    if (!chosen(g) || btns(g).length < 2) return;
    const b = g.box.getBoundingClientRect();
    const x = e.clientX - b.left;
    const w = wide(g);
    if (x < g.l - GRAB || x > g.l + w + GRAB) return;    /* not on the chip */

    stop(g); g.gen++;
    g.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, grab: grab(e),
               l0: g.l, w, box: b.width, stops: stops(g), moving: false, held: false };
    times(g, 0, 0);                          /* the edges follow the finger */
    set(g, '--chip-dt', 'var(--pill-press)');
    set(g, '--chip-et', 'var(--ease)');
    /* one pop per press, not one per click of an impatient finger */
    if (Date.now() >= g.lock) { g.drag.held = true; state(g, 'lift'); swell(g, SWELL); }
  }

  function move(g, e) {
    const d = g.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.moving) {
      /* The axis is decided once, on the first move that leaves the threshold,
         and touch-action:pan-y on the track is only half of it: the
         declaration tells the browser which axis it may take, and this tells
         the chip when not to compete for the other one. A press that leaves
         downwards is the page being scrolled — the chip stands down there and
         then, rather than holding the gesture until the compositor takes it
         away. */
      if (Math.abs(dy) >= d.grab && Math.abs(dy) > Math.abs(dx)) { cancel(g); return; }
      if (Math.abs(dx) < d.grab) return;
      d.moving = true;
      /* captured only now it is a real drag: a plain press must leave its
         click on the button it was aimed at */
      try { g.box.setPointerCapture(e.pointerId); } catch (_) {}
      if (!d.held) { state(g, 'lift'); d.held = true; }
      swell(g, CARRY);
    }
    const l = rubber(d.l0 + dx, PAD, d.box - d.w - PAD);
    put(g, l, d.box - l - d.w);
    const s = nearest(l + d.w / 2, d.stops);
    near(g, s && s.el);
  }

  function up(g, e) {
    const d = g.drag;
    if (!d) return;
    g.drag = null;
    try { g.box.releasePointerCapture(e.pointerId); } catch (_) {}
    g.lock = Date.now() + motion().pop;
    near(g, null);
    set(g, '--chip-dt', 'var(--pill-pop)');
    set(g, '--chip-et', 'var(--ease-pop)');   /* and it springs back down */
    flat(g);

    if (!d.moving) { settle(g); return; }

    /* A swipe is a choice, and the choice is not this file's to make: it
       clicks the tab, exactly as a finger would have, and then follows the
       class like always. The click the pointer is about to fire by itself is
       the same choice a second time, so it is swallowed. */
    g.hush = Date.now() + 400;
    const s = nearest(g.l + d.w / 2, d.stops);
    if (s && !s.el.classList.contains('is-on')) { g.pass = s.el; s.el.click(); }
    /* whoever owns the group may have declined to move — a month already
       standing on NOW, a branch that means nothing in the past. Then the chip
       is still where the finger left it, and it goes home. */
    clock(g, () => {
      if (g.drag) return;
      const el = chosen(g);
      if (el && el === g.at && Math.abs(g.l - edges(g, el).l) > .5) settle(g);
    }, 0);
  }

  /* A cancel is not a quiet release. The browser fires it exactly when it has
     decided the gesture was never the page's — the compositor took it for a
     scroll, the OS took it for an edge swipe, a second finger arrived — and
     routed into up() it ran up()'s last act, which is to click the tab the
     chip is nearest. Measured: carrying the chip 60px and then cancelling
     changed the reading from Location to Media, with nothing pressed. So the
     chip goes home and nothing is chosen. */
  function cancel(g) {
    if (!g.drag) return;
    g.drag = null;
    near(g, null);
    set(g, '--chip-dt', 'var(--pill-pop)');
    set(g, '--chip-et', 'var(--ease-pop)');
    flat(g);
    settle(g);
  }

  function hush(g, e) {
    if (g.pass && (e.target === g.pass || g.pass.contains(e.target))) { g.pass = null; return; }
    if (Date.now() < g.hush) { g.hush = 0; e.stopPropagation(); e.preventDefault(); }
  }

  /* ── mounting ───────────────────────────────────────────────────────────── */

  function mount(box) {
    if (!box || box.__chip) return box && box.__chip;
    const g = { box, at: null, l: 0, r: 0, gen: 0, timers: [], drag: null, pass: null, hush: 0, lock: 0 };
    box.__chip = g;
    kept.push(g);
    box.classList.add('seg-slide', 'has-chip');

    new MutationObserver(() => sync(g)).observe(box, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'],
    });
    if (window.ResizeObserver) new ResizeObserver(() => reseat(g)).observe(box);

    box.addEventListener('pointerdown', (e) => down(g, e));
    box.addEventListener('pointermove', (e) => move(g, e));
    box.addEventListener('pointerup', (e) => up(g, e));
    box.addEventListener('pointercancel', () => cancel(g));
    /* on the way down, before the group's own handler: a click a swipe already
       answered must not be answered twice */
    box.addEventListener('click', (e) => hush(g, e), true);

    travel(g);
    return g;
  }

  const all = (root) => $$(GROUPS, root).forEach(mount);

  all();
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', () => all());
  /* the labels set the chip's width, so it is measured again when the real
     typeface lands and every one of them changes */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => kept.forEach(reseat));
  addEventListener('resize', () => kept.forEach(reseat));

  window.FocusSeg = { mount, all, reseat: () => kept.forEach(reseat) };
})();
