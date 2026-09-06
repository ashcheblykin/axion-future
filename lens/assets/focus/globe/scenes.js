/* =============================================================================
   scenes.js — where the captures are, on the ground.

   Until this file existed the street capture had no place. `scene3d.js` holds
   it in the Studio scene's own metric frame, where one unit is about a metre of
   Olaya Street and nothing says which metre; the only lat/lon for it anywhere
   was a constant in focus.js feeding one haversine, so that the caption could
   say how far the capture stood from the case it was standing in for. The map
   never knew the capture existed. Zooming to street level over Taif, or over
   any other ground in the Kingdom, opened Riyadh.

   The product's scene register answers this, and this is that answer carried
   across for the one capture this repository ships. Two numbers do the work:

     bounds   the geographic rectangle the top-down preview covers, north-up,
              [west, south, east, north]. Taken verbatim from the product's
              georeferenced-scene registry, which got it by loading the real
              splats into the map alignment tool, pointing the camera straight
              down with no bearing, hiding every basemap layer so the canvas
              came back transparent, and recording map.getBounds() beside the
              PNG it had just read off the drawing buffer. A north-up lat/lon
              rectangle is axis-aligned in Web Mercator, which is the
              projection geo.js already uses — so the image needs no warping
              here, only two corners projected.

     anchor   the capture's own centre, the point the reading is "at". This is
              the same pair focus.js has been carrying as CAPTURE_LL; it now
              lives here, next to the place name it has to agree with.

   What is NOT here is a splat-to-map transform. The product carries one — an
   anchor rotation, a scale and an altitude, enough to project the live camera
   inside the scene onto a minimap. That would be a second reading of the same
   capture, and this page does not have a minimap to put it on. What it needs
   is the reverse and much less: given a point on the map, is there a capture
   under it. So only the footprint is carried, and the register says so rather
   than shipping numbers nothing reads.

   Loaded before mapview.js, which draws the footprint, and read by focus.js,
   which decides whether the wheel has arrived somewhere a capture stands.
   ============================================================================= */
(function () {
  'use strict';

  /* The register's own record of the capture committed under
     assets/focus/scene/. Every figure is the source capture's, not the
     thinned copy's: `splats` and `bytes` describe what was measured on Olaya
     Street in July 2026, which is what a card naming the capture is naming.
     What this page actually draws is 12% of it — 3.43M splats, 36 MB — and
     `drawn` is that, said separately rather than folded into the other two.
     tools/build-scene.sh is where the two are reconciled. */
  const SCENES = [{
    id: 'olaya-street',
    /* Datum Studio scene id, so a record here can be matched to the product's */
    sceneId: 'b65f9a09-b2ed-4945-ae74-9570dca5d0b9',
    name: 'Street Part 2 — Al Olaya',
    place: 'Al Olaya, Riyadh',
    /* the top-down read of the capture, committed like the capture itself */
    image: 'assets/focus/scene/olaya-street-top.png',
    /* [west, south, east, north] */
    bounds: [46.67796176301201, 24.70294786680595, 46.68086352374215, 24.705753166647675],
    /* [lat, lon] — the capture's centre, and the point the caption measures from */
    anchor: [24.7051610065184, 46.6784374899668],
    splats: 28595039,
    bytes: 291120862,
    created: '2026-07-09',
    /* what this page draws of it, after tools/build-scene.sh */
    drawn: { splats: 3430000, bytes: 38213568 },
  }];

  /* ---- the footprint's own alpha -----------------------------------------
     The preview is a capture over nothing: a diagonal ribbon of street inside
     a mostly transparent 1060×1128 frame, because Olaya Street runs 38° off
     the axes and a north-up rectangle around it is more air than capture. So
     the rectangle is not the footprint. Asking whether the cursor is over the
     capture means asking the image, at the pixel the cursor is on, whether
     anything was drawn there — which is what the product does, at the same
     threshold, for the same reason: two captures whose rectangles overlap must
     not steal each other's pointer.

     The image is decoded once into an offscreen canvas the first time the map
     wants to draw it. Until then `hit()` answers with the rectangle, which is
     the honest answer while the alpha is unknown — it is never wrong about
     where the capture is not, only generous about where it is. */
  const ALPHA_AT = 32;                       /* 0–255; below this is air */

  const loaded = {};                          /* id -> {img, alpha|null} */

  function assetFor(s) {
    let a = loaded[s.id];
    if (a) return a;
    a = loaded[s.id] = { img: new Image(), alpha: null, ready: false };
    a.img.decoding = 'async';
    a.img.addEventListener('load', () => {
      a.ready = true;
      readAlpha(a);
      if (window.MapView && MapView.invalidate) MapView.invalidate();
    }, { once: true });
    a.img.src = s.image;
    return a;
  }

  /* One 1060×1128 readback, once, kept as the alpha channel alone — a quarter
     of the pixels' weight, and the only channel the hit test reads. */
  function readAlpha(a) {
    try {
      const w = a.img.naturalWidth, h = a.img.naturalHeight;
      if (!w || !h) return;
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const g = c.getContext('2d', { willReadFrequently: false });
      g.drawImage(a.img, 0, 0);
      const px = g.getImageData(0, 0, w, h).data;
      const al = new Uint8Array(w * h);
      for (let i = 0, n = w * h; i < n; i++) al[i] = px[i * 4 + 3];
      a.alpha = { w, h, a: al };
    } catch (e) {
      /* A tainted canvas would throw here. The file is served from the same
         origin as the page, so this is not expected; if it ever happens the
         rectangle stays the hit test rather than the footprint disappearing. */
      a.alpha = null;
    }
  }

  const inBox = (s, lon, lat) =>
    lon >= s.bounds[0] && lon <= s.bounds[2] && lat >= s.bounds[1] && lat <= s.bounds[3];

  /* lon/lat -> the image's own pixel, north-up on the bounds rectangle */
  function alphaAt(s, lon, lat) {
    const a = loaded[s.id];
    if (!a || !a.alpha) return null;
    const [w0, s0, e0, n0] = s.bounds;
    const u = (lon - w0) / (e0 - w0), v = (n0 - lat) / (n0 - s0);
    if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
    const px = Math.min(a.alpha.w - 1, Math.max(0, Math.floor(u * a.alpha.w)));
    const py = Math.min(a.alpha.h - 1, Math.max(0, Math.floor(v * a.alpha.h)));
    return a.alpha.a[py * a.alpha.w + px];
  }

  window.SceneReg = {
    all: () => SCENES,
    byId: (id) => SCENES.find(s => s.id === id) || null,

    /* the image element for a scene, decoding on first ask */
    asset: assetFor,

    /* Is a capture standing on this ground? The rectangle first — it is cheap
       and it is what rules out the whole Kingdom — then the image's own alpha
       where it has been read, so that the transparent air either side of the
       street does not answer for the street. */
    at(lon, lat) {
      for (const s of SCENES) {
        if (!inBox(s, lon, lat)) continue;
        const al = alphaAt(s, lon, lat);
        if (al === null || al >= ALPHA_AT) return s;
      }
      return null;
    },

    /* the same question asked of the rectangle alone, for the camera rather
       than the cursor: a viewport centre a few metres off the kerb is still
       "over the capture" as far as arriving there is concerned */
    boxAt(lon, lat) {
      for (const s of SCENES) if (inBox(s, lon, lat)) return s;
      return null;
    },

    /* how far a point is from a capture's centre, in km — the caption's
       measure, moved here so the distance and the place name cannot drift */
    kmFrom(s, ll) {
      const R = 6371, rad = Math.PI / 180;
      const a = ll, b = s.anchor;
      const dLat = (b[0] - a[0]) * rad, dLon = (b[1] - a[1]) * rad;
      const s1 = Math.sin(dLat / 2), s2 = Math.sin(dLon / 2);
      const h = s1 * s1 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * s2 * s2;
      return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
    },

    /* the nearest capture to a point, whatever the distance — every case gets
       an answer to "where is the capture, then?" */
    nearest(ll) {
      let best = null, bd = Infinity;
      for (const s of SCENES) {
        const d = this.kmFrom(s, ll);
        if (d < bd) { bd = d; best = s; }
      }
      return best ? { scene: best, km: bd } : null;
    },

    ALPHA_AT,
  };
})();
