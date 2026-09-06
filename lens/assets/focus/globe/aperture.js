/* =============================================================================
   aperture.js — what the City View renderer draws its planet into.

   The renderer asks one question of the page: give me a box, and I will put a
   sphere of radius min(w,h)/2 at its centre. In the source prototype that box
   is the focus aperture in the middle of the screen. Here it is the stage's
   clear area, sized and seated by the same three numbers the Figma frame uses —
   957 across, its left edge 109px clear of the reading column, its centre 47.9%
   down — so 1920×1080 comes out exactly as drawn and every other size keeps the
   relationship rather than the pixels.

   Must load BEFORE mapview.js. Nav and Drawers are reached only from the
   renderer's own pick handlers, which this screen does not use.
   ============================================================================= */
(function () {
  'use strict';

  const R = { w: 957 / 832, h: 957 / 1064, clear: 109 / 832, cy: 509.5 / 1064, bleed: 258 };

  window.Portal = {
    rect() {
      const el = document.getElementById('stageFree');
      if (!el) {                                   /* before the shell exists */
        const s = Math.min(innerWidth, innerHeight) - 64;
        return { x: (innerWidth - s) / 2, y: (innerHeight - s) / 2, w: s, h: s, r: s / 2 };
      }
      const b = el.getBoundingClientRect();
      const fw = b.width, fh = b.height;
      let d = Math.min(R.w * fw, R.h * fh);
      const left = Math.max(R.clear * fw, (fw - d) / 2);
      /* the frame lets the planet run under the second reading, not past it */
      d = Math.min(d, fw - left + R.bleed);
      return { x: b.left + left, y: b.top + R.cy * fh - d / 2, w: d, h: d, r: d / 2 };
    },
  };

  /* The renderer navigates through these three. In the source prototype they
     are a whole HUD; here they are the ladder the planet is read on —
     Kingdom → amana → city → district — and nothing else. */
  const announce = () => document.dispatchEvent(new CustomEvent('fm:where'));

  window.Nav = {
    /* The renderer asks for two things and two only: 'country' when the wheel
       has been turned out past the floor of the flat map — go back to the
       planet — and anything else when it has been turned in off the sphere:
       step down onto the map, where the Kingdom is drawn as its thirteen
       amanas. Everything below that is reached by picking one. */
    setScale(scale) {
      if (scale === 'country' && FM.view === 'map') {
        FM.setScope('KSA');
        FM.setScale('country');
        FM.setView('globe');
        MapView.snapTo(GEO.KSA);
        MapView.invalidate();
      } else {
        FM.setScope('KSA');
        FM.setScale('country');
        FM.setView('map');
        MapView.flyTo(GEO.KSA, 460);
      }
      announce();
    },

    /* the planet, whatever the camera is doing */
    home() {
      FM.setScope('KSA');
      FM.setScale('country');
      FM.setView('globe');
      MapView.snapTo(GEO.KSA);
      MapView.invalidate();
      announce();
    },

    /* clicking a region on the map opens it; clicking the Kingdom opens the
       thirteen amanas */
    pickUnit(id) {
      const u = CV.U[id] || CV.U.KSA;
      if (u.id === 'KSA' && FM.view === 'map' && FM.scale === 'country') { this.home(); return; }
      FM.setScope(u.id);
      FM.setScale(u.id === 'KSA' ? 'country' : FM.scaleOf(u.id));
      FM.setView('map');
      MapView.flyTo(GEO.boundsFor(u), 440);
      announce();
    },

    toMapHere() { this.pickUnit(FM.uid); },
  };

  window.Drawers = { openCase() {}, openHotspot() {} };

  /* The renderer names whatever the cursor is over on the sphere. In the source
     prototype that tooltip belongs to the marker layer; here the marker layer
     is this screen's own, so the chip is supplied instead of the whole module.
     Without it every pointermove over the planet threw. */
  let tip = null;
  const chip = () => {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'globe-tip';
    tip.hidden = true;
    (document.getElementById('pins') || document.body).appendChild(tip);
    return tip;
  };
  window.POI = {
    tipAt(x, y, text) {
      const el = chip();
      el.textContent = text;
      el.hidden = false;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    },
    hideTip() { if (tip) tip.hidden = true; },
  };
})();
