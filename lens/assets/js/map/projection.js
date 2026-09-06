/* =============================================================================
   projection.js — Web Mercator, and nothing else.
   The Lens never shows the whole planet, so there is no globe here: a subject
   has a point and a zoom, and the map is the ground around that point.
   ============================================================================= */
(function () {
  const R = 256;                                   /* tile size at zoom 0 */
  const clampLat = d => Math.max(-85.05112878, Math.min(85.05112878, d));

  /* world pixel coordinates at a given zoom */
  function project(lon, lat, z) {
    const s = R * Math.pow(2, z);
    const x = (lon + 180) / 360 * s;
    const sin = Math.sin(clampLat(lat) * Math.PI / 180);
    const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s;
    return [x, y];
  }
  function unproject(x, y, z) {
    const s = R * Math.pow(2, z);
    const lon = x / s * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / s;
    const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    return [lon, lat];
  }

  /* metres per screen pixel at this latitude and zoom — the scale bar reads it */
  const mPerPx = (lat, z) => 156543.03392 * Math.cos(clampLat(lat) * Math.PI / 180) / Math.pow(2, z);

  /* a camera fixed on one point: world→screen for the frame in view */
  function camera(centreLL, z, w, h) {
    const [cx, cy] = project(centreLL[1], centreLL[0], z);
    const ox = cx - w / 2, oy = cy - h / 2;
    return {
      z, w, h, lat: centreLL[0],
      /* [lat, lon] in, [x, y] on the canvas out */
      pt(ll) { const p = project(ll[1], ll[0], z); return [p[0] - ox, p[1] - oy]; },
      /* [lon, lat] in — the order OSM geometry arrives in */
      lonlat(c) { const p = project(c[0], c[1], z); return [p[0] - ox, p[1] - oy]; },
      back(x, y) { const c = unproject(x + ox, y + oy, z); return [c[1], c[0]]; },
      mPerPx: mPerPx(centreLL[0], z),
    };
  }

  window.Proj = { project, unproject, mPerPx, camera };
})();
