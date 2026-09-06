/* =============================================================================
   scenecard.js — the card the footprint raises under the cursor.

   The map now draws the capture where it was taken. A drawn footprint answers
   "there is something here" and nothing else: not what it is, not how much of
   it there is, not that it opens. This is that answer, and it is the product's
   own card carried across — the same four rows in the same order, because a
   reader who has seen one should recognise the other.

   It is built once, on first ask, and moved by writing two numbers. Nothing
   here re-renders per frame: the map's pointer handler only calls `at()` when
   the capture under the cursor changes, and `move()` while it does not.

   Placed like .globe-tip — fixed, inside #pins, out of the pointer's way —
   except that this one is clamped to the window, because it is 260px wide and
   a tooltip that runs off the right edge of the screen is no tooltip.
   ============================================================================= */
(function () {
  'use strict';

  const GAP = 14;                    /* the product's cursor offset, kept */
  let el = null, shown = null;

  /* 28,595,039 -> "28.6M". The card is naming a measurement, so it rounds the
     way the product's Intl compact format does rather than printing all eight
     digits into a 70px cell. */
  function compact(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }
  const mb = (b) => (b / 1e6).toFixed(1) + ' MB';

  const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  /* '2026-07-09' -> '9 Jul 2026', read as a plain date rather than through
     Date, which would drag the viewer's timezone into a capture date. */
  function stamp(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
    if (!m) return String(iso || '');
    return +m[3] + ' ' + MN[+m[2] - 1] + ' ' + m[1];
  }

  const esc = (s) => String(s).replace(/[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Its own layer, not #pins. The card began life in there beside the case
     pins and the globe's tooltip, which is where a thing drawn over the map
     belongs — but #pins is deliberately demoted under two of the four
     readings (focus.css: [data-lens="media"] .pins, [data-lens="objects"]
     .pins {z-index:1}) so that a case marker does not stand on the clip, and
     #pins is a stacking context, so a child cannot climb out of it. The card
     inherited the demotion and was painted behind the reading: the footprint
     still brightened, the cursor still changed, the click still opened the
     reading, and nothing appeared. It is a sibling now, above the shell,
     and the sheet hides it on the one reading that covers the map outright. */
  function build() {
    if (el) return el;
    el = document.createElement('div');
    el.className = 'scene-card';
    el.hidden = true;
    (document.getElementById('app') || document.body).appendChild(el);
    return el;
  }

  /* The three cells name the capture, not the copy on this page: 28.6M splats
     and 291.1 MB are what was measured on Olaya Street. The foot says what is
     actually drawn here, because the difference is a decision this repository
     made (tools/build-scene.sh) and not something to leave a reader to find. */
  function fill(s) {
    const cell = (label, value) =>
      '<div class="sc-cell"><span class="sc-k">' + esc(label) + '</span>' +
      '<b class="sc-v">' + esc(value) + '</b></div>';
    el.innerHTML =
      '<div class="sc-head">' +
        '<span class="sc-eyebrow"><svg class="ic ic12"><use href="#i-cube"/></svg>3D scene</span>' +
        '<b class="sc-name">' + esc(s.name) + '</b>' +
        '<span class="sc-place">' + esc(s.place) + '</span>' +
      '</div>' +
      '<div class="sc-cells">' +
        cell('Splats', compact(s.splats)) +
        cell('Size', mb(s.bytes)) +
        cell('Captured', stamp(s.created)) +
      '</div>' +
      '<div class="sc-foot">' + esc(compact(s.drawn.splats)) +
        ' drawn here · click to open the street reading</div>';
  }

  /* The room the card is allowed to stand in. The product's card is clamped to
     nothing at all and runs off the right edge of its map; here it is kept
     inside the room the map is actually read through — the stage's clear area
     less whatever panel stands on it — which is the same box a case pin is
     kept inside when it leaves the screen. One definition, in globe.js, rather
     than a second list of panels to dodge. The viewport is the fallback for
     the moment before that module has run. */
  function room() {
    const G = window.FocusGlobe;
    if (G && G.ready && G.window) {
      const w = G.window();
      if (w && w.w > 120 && w.h > 120) return w;
    }
    return { L: 8, T: 8, R: innerWidth - 8, B: innerHeight - 8 };
  }

  /* Cursor-anchored, then pulled back inside that room on whichever edge it
     would have crossed — below the cursor if there is space, above it if not. */
  function place(x, y) {
    const b = el.getBoundingClientRect();
    const w = b.width || 260, h = b.height || 150;
    const r = room();
    let left = x + GAP, top = y + GAP;
    if (left + w > r.R) left = x - GAP - w;
    if (top + h > r.B) top = y - GAP - h;
    /* and if it does not fit on either side of the cursor, the room wins: a
       card half off the screen says less than one sitting beside the capture */
    el.style.left = Math.round(Math.max(r.L, Math.min(left, r.R - w))) + 'px';
    el.style.top = Math.round(Math.max(r.T, Math.min(top, r.B - h))) + 'px';
  }

  window.SceneCard = {
    /* raise the card for a scene, rebuilding its contents only when the scene
       under the cursor is a different one */
    at(x, y, s) {
      build();
      if (shown !== s.id) { fill(s); shown = s.id; }
      el.hidden = false;
      place(x, y);
    },
    move(x, y) { if (el && !el.hidden) place(x, y); },
    hide() { if (el) { el.hidden = true; } shown = null; },
    /* what the card is currently naming, or null — read by the harness */
    showing: () => (el && !el.hidden ? shown : null),
  };
})();
