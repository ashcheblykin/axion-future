/* =============================================================================
   renderer.js — the ground around one point.

   Deliberately small. In the earlier prototype the map was the interface, so it
   carried a globe, continuous zoom and every city's road network. Here the map
   is one reading of one subject: it answers "where is this", and — with a layer
   on — "what does it look like around here". Nothing on it filters anything.

   Geometry: district boundaries and roads from OpenStreetMap,
   © OpenStreetMap contributors, ODbL. Fetched at build time and committed;
   nothing is fetched from the network at run time except the one road file for
   the city in view.
   ============================================================================= */
(function () {
  const DIST = window.OSM_DISTRICTS || {};
  const ROADF = window.OSM_ROAD_FILES || {};
  const distCache = {}, roadCache = {}, pending = {};

  /* The source prototype ships a road file for every one of the 52 cities; this
     one carries only the three the demo actually stands in, so asking for any
     other city is answered with "no geometry" rather than with a 404. */
  const SHIPPED = ['C:Riyadh/\u0627\u0644\u0631\u064a\u0627\u0636',
                   'C:Makkah/\u0627\u0644\u0637\u0627\u0626\u0641',
                   'C:Eastern Region/\u0627\u0644\u062e\u0628\u0631'];
  const hasRoads = id => SHIPPED.indexOf(id) >= 0 && !!ROADF[id];

  const decode = enc => {
    const out = []; let x = 0, y = 0;
    for (let i = 0; i < enc.length; i += 2) { x += enc[i]; y += enc[i + 1]; out.push([x / 1e5, y / 1e5]); }
    return out;
  };

  function districts(cityId) {
    if (cityId in distCache) return distCache[cityId];
    const rec = DIST[cityId];
    distCache[cityId] = rec ? rec.map(d => ({ id: d.u, ar: d.n, en: d.e, ring: decode(d.p) })) : null;
    return distCache[cityId];
  }

  /* one city's roads, fetched the first time that city is in view */
  function roads(cityId, repaint) {
    if (cityId in roadCache) return roadCache[cityId];
    if (!hasRoads(cityId) || pending[cityId]) return null;
    pending[cityId] = true;
    fetch('assets/js/data/osm-roads/' + ROADF[cityId] + '.json')
      .then(r => (r.ok ? r.json() : null))
      .then(ways => {
        roadCache[cityId] = ways
          ? ways.map(w => ({ cls: w.c, ar: w.n || '', en: w.e || '', pts: decode(w.p) })) : null;
        if (repaint) repaint();
      })
      .catch(() => { roadCache[cityId] = null; if (repaint) repaint(); });
    return null;
  }

  /* which city a subject sits in — roads are held per city */
  function cityOf(subject) {
    const u = subject.scope.unit;
    if (!u) return null;
    if (u.lvl === 2) return u.id;
    if (u.lvl === 3) return u.p;
    if (u.lvl === 1) return null;
    return null;
  }

  const W = { motorway: 5.2, trunk: 4.4, primary: 3.4, secondary: 2.4, tertiary: 1.7 };
  const roadW = cls => W[cls] || 1.1;

  /* the nearest named way to the subject — the street lens names it rather than
     inventing a street, and the source's own STREETS list is used where the
     subject carries one */
  function nearestNamed(ways, ll) {
    if (!ways) return null;
    let best = null, bd = Infinity;
    for (const w of ways) {
      if (!w.en && !w.ar) continue;
      if (roadW(w.cls) < 1.7) continue;
      for (const p of w.pts) {
        const dx = p[0] - ll[1], dy = p[1] - ll[0];
        const d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = w; }
      }
    }
    return best;
  }

  /* =========================================================================
     draw
     ========================================================================= */
  function paint(cv, subject, opts) {
    const css = getComputedStyle(document.documentElement);
    const tok = n => css.getPropertyValue(n).trim();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const z = opts.zoom;
    const cam = Proj.camera(subject.ll, z, w, h);
    const cityId = cityOf(subject);
    const ways = cityId ? roads(cityId, opts.repaint) : null;
    const dists = cityId ? districts(cityId) : null;

    g.fillStyle = tok('--bg-deep'); g.fillRect(0, 0, w, h);

    /* the faint coordinate grid from the vibe reference */
    g.strokeStyle = tok('--grid'); g.lineWidth = 1;
    const step = 64;
    g.beginPath();
    for (let x = step / 2; x < w; x += step) { g.moveTo(x + .5, 0); g.lineTo(x + .5, h); }
    for (let y = step / 2; y < h; y += step) { g.moveTo(0, y + .5); g.lineTo(w, y + .5); }
    g.stroke();

    /* district ground */
    if (dists) {
      g.lineWidth = 1;
      for (const d of dists) {
        g.beginPath();
        for (let i = 0; i < d.ring.length; i++) {
          const p = cam.lonlat(d.ring[i]);
          if (p[0] < -w * 3 || p[0] > w * 4) { /* keep going: rings wrap the frame */ }
          i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
        }
        g.closePath();
        /* the fill reads as ground at city scale and as a flat wash once the
           camera is inside one district, so it fades out as we go in */
        g.globalAlpha = Math.max(0, Math.min(1, (15.6 - z) / 2.4));
        g.fillStyle = tok('--map-district-fill');
        g.fill();
        g.globalAlpha = 1;
        g.strokeStyle = tok('--line-soft');
        g.stroke();
      }
    }

    /* roads, thin classes under thick ones */
    if (ways) {
      const order = ['tertiary', 'secondary', 'primary', 'trunk', 'motorway'];
      const rest = ways.filter(x => order.indexOf(x.cls) < 0);
      const draw = (list, alpha) => {
        for (const way of list) {
          const pts = way.pts;
          let vis = false;
          g.beginPath();
          for (let i = 0; i < pts.length; i++) {
            const p = cam.lonlat(pts[i]);
            if (p[0] > -120 && p[0] < w + 120 && p[1] > -120 && p[1] < h + 120) vis = true;
            i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
          }
          if (!vis) continue;
          g.globalAlpha = alpha;
          g.lineWidth = roadW(way.cls);
          g.strokeStyle = tok('--basemap-coast');
          g.lineCap = 'round'; g.lineJoin = 'round';
          g.stroke();
        }
        g.globalAlpha = 1;
      };
      draw(rest, .30);
      order.forEach((cls, i) => draw(ways.filter(x => x.cls === cls), .42 + i * .09));
    }

    /* an optional reading laid over the same ground */
    if (opts.layer) opts.layer(g, cam, { w, h, tok, ways });

    /* the subject itself */
    const p = cam.pt(subject.ll);
    const col = tok('--band-' + Math.max(0, Math.min(4, subject.sev)));
    const t = (performance.now() % 2400) / 2400;
    g.beginPath(); g.arc(p[0], p[1], 12 + t * 34, 0, Math.PI * 2);
    g.strokeStyle = col; g.globalAlpha = (1 - t) * .5; g.lineWidth = 1.5; g.stroke();
    g.globalAlpha = 1;
    g.beginPath(); g.arc(p[0], p[1], 6, 0, Math.PI * 2);
    g.fillStyle = col; g.fill();
    g.strokeStyle = tok('--bg-void'); g.lineWidth = 2; g.stroke();

    /* scale bar — the one thing that makes a zoom level legible */
    const target = 96;
    const metres = target * cam.mPerPx;
    const pow = Math.pow(10, Math.floor(Math.log10(metres)));
    const nice = [1, 2, 5, 10].map(x => x * pow).reduce((a, b) => Math.abs(b - metres) < Math.abs(a - metres) ? b : a);
    const barPx = nice / cam.mPerPx;
    g.strokeStyle = tok('--ink-faint'); g.lineWidth = 1;
    g.beginPath();
    g.moveTo(16, h - 20); g.lineTo(16, h - 15); g.lineTo(16 + barPx, h - 15); g.lineTo(16 + barPx, h - 20);
    g.stroke();
    g.fillStyle = tok('--ink-faint');
    g.font = '10px ' + tok('--font-mono');
    g.textAlign = 'left'; g.direction = 'ltr';
    g.fillText(nice >= 1000 ? (nice / 1000) + ' km' : nice + ' m', 16, h - 24);
    g.textAlign = 'right';
    g.fillText('© OpenStreetMap contributors', w - 12, h - 12);

    return { cam, ways, cityId };
  }

  /* =========================================================================
     a canvas that lives inside a lens stage and repaints itself
     ========================================================================= */
  function mount(host, subject, opts) {
    const cv = document.createElement('canvas');
    cv.className = 'lv-map';
    host.appendChild(cv);
    let raf = 0, dead = false, last = null;
    const tick = () => {
      if (dead || !cv.isConnected) return;
      last = paint(cv, subject, Object.assign({}, opts, { repaint: () => {} }));
      if (opts.onFrame) opts.onFrame(last);
      raf = requestAnimationFrame(tick);
    };
    tick();
    const ro = new ResizeObserver(() => { if (!dead) paint(cv, subject, opts); });
    ro.observe(cv);
    return {
      canvas: cv,
      get info() { return last; },
      destroy() { dead = true; cancelAnimationFrame(raf); ro.disconnect(); },
    };
  }

  /* the same fetch, awaited — the hotspot has to sit on a real street before any
     subject is built, and that cannot be done while the geometry is in flight */
  function load(cityId) {
    if (cityId in roadCache) return Promise.resolve(roadCache[cityId]);
    if (!hasRoads(cityId)) { roadCache[cityId] = null; return Promise.resolve(null); }
    return fetch('assets/js/data/osm-roads/' + ROADF[cityId] + '.json')
      .then(r => (r.ok ? r.json() : null))
      .then(ways => {
        roadCache[cityId] = ways
          ? ways.map(w => ({ cls: w.c, ar: w.n || '', en: w.e || '', pts: decode(w.p) })) : null;
        return roadCache[cityId];
      })
      .catch(() => { roadCache[cityId] = null; return null; });
  }

  window.LensMap = { mount, paint, roads, load, districts, cityOf, nearestNamed, roadW, decode, hasRoads, SHIPPED };
})();
