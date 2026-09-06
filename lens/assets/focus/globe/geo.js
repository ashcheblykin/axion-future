/* =============================================================================
   geo.js — projection, bounds and hit-testing for GEO_REGIONS / GEO_RIYADH.
   Web-Mercator into an abstract "world" space; the camera turns world into
   screen. Geometry is small (1,252 + 2,853 vertices) so it is drawn live.
   ============================================================================= */
(function () {
  const D2R = Math.PI / 180;
  const mercY = lat => Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, lat)) * D2R / 2));

  const GEO = {
    /* [lon,lat] -> [x,y] world units (y grows downward) */
    pt(lon, lat) { return [lon * D2R, -mercY(lat)]; },

    rings(geom) {
      return geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flat();
    },

    bboxOf(feats) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      feats.forEach(f => GEO.rings(f.geometry).forEach(r => r.forEach(c => {
        const p = GEO.pt(c[0], c[1]);
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      })));
      return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
    },

    bboxOfLL(list, pad) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      list.forEach(ll => { const p = GEO.pt(ll[1], ll[0]);
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
      const px = (x1 - x0) * (pad || .35) + 1e-3, py = (y1 - y0) * (pad || .35) + 1e-3;
      x0 -= px; x1 += px; y0 -= py; y1 += py;
      return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
    },

    /* even-odd point in polygon, in world space */
    inRings(rings, p) {
      let inside = false;
      for (const r of rings) {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const a = GEO.pt(r[i][0], r[i][1]), b = GEO.pt(r[j][0], r[j][1]);
          if ((a[1] > p[1]) !== (b[1] > p[1]) &&
              p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
        }
      }
      return inside;
    },

    /* draws through cam.proj so the same geometry works flat or on the sphere */
    trace(ctx, geom, cam) {
      ctx.beginPath();
      GEO.rings(geom).forEach(r => {
        for (let i = 0; i < r.length; i++) {
          const s = cam.proj(r[i][0], r[i][1]);
          if (i === 0) ctx.moveTo(s[0], s[1]); else ctx.lineTo(s[0], s[1]);
        }
        ctx.closePath();
      });
    },

    /* the same geometry as a Path2D, so a shape that is filled and stroked
       several times in one frame is projected once instead of once per pass */
    path(geom, cam) {
      const p = new Path2D();
      GEO.rings(geom).forEach(r => {
        for (let i = 0; i < r.length; i++) {
          const s = cam.proj(r[i][0], r[i][1]);
          if (i === 0) p.moveTo(s[0], s[1]); else p.lineTo(s[0], s[1]);
        }
        p.closePath();
      });
      return p;
    },

    /* screen-space hit test — the only one that works in both projections */
    inScreen(geom, cam, px, py) {
      let inside = false;
      for (const r of GEO.rings(geom)) {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const a = cam.proj(r[i][0], r[i][1]), b = cam.proj(r[j][0], r[j][1]);
          if ((a[1] > py) !== (b[1] > py) && px < (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
        }
      }
      return inside;
    },
  };

  /* ---- indices ------------------------------------------------------- */
  GEO.regionFeat = {};
  CV.GEO_REGIONS.features.forEach(f => { GEO.regionFeat[f.properties.name] = f; });
  GEO.districtFeat = {};
  CV.GEO_RIYADH.features.forEach(f => { GEO.districtFeat[f.properties.name] = f; });

  /* ---- city districts outside Riyadh ---------------------------------
     The source document ships district polygons for Riyadh and for nowhere
     else — but it gives every city's sub-districts a name, a population, a
     KPI reading and, crucially, a centre of their own. Those centres are real.
     What is missing is only where one district stops and the next begins.

     So the cells are built rather than invented: each district keeps its own
     centre, and the ground between two centres is split down the middle
     (a Voronoi diagram), clipped to the city's built-up area — the same
     population-derived radius the street layer uses. Every boundary is
     therefore a statement about which centre is nearest, which is true, and
     nothing else. The interface says so at this zoom (fm_cells_note).

     Deterministic: same input, same cells, no randomness anywhere. */
  const cellCache = {};
  const D2R_ = Math.PI / 180;

  /* The outline of a city's built-up area. A ring of rays from the centre, each
     one stopped by two things: the region's own boundary — so a coastal city
     stops at the coast instead of spilling into the sea — and a low-frequency
     wobble seeded by the city's id, because a settlement is not a compass rose.
     The radius it starts from is the population's, and the shape is stable:
     the same city always produces the same outline. */
  function urbanOutline(city, r, n, ringsOfRegion, floor) {
    const lat0 = city.c[0], kx = Math.max(.2, Math.cos(lat0 * D2R_));
    const inLand = (x, y) => !ringsOfRegion ||
      GEO.inRings(ringsOfRegion, GEO.pt(city.c[1] + x / kx, lat0 + y));
    const seed = CV.h32('urban:' + city.id);
    const wob = a => {                       /* three harmonics, deterministic */
      const p1 = ((seed % 97) / 97) * Math.PI * 2;
      const p2 = ((seed % 53) / 53) * Math.PI * 2;
      const p3 = ((seed % 31) / 31) * Math.PI * 2;
      return 1 + .17 * Math.sin(a * 2 + p1) + .11 * Math.sin(a * 3 + p2) + .07 * Math.sin(a * 5 + p3);
    };
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const ux = Math.cos(a), uy = Math.sin(a);
      let far = Math.max(floor, r * wob(a));
      /* walk back to the last point that is still inside the region — but never
         inside the districts themselves: a centre the dataset places on the
         coast is land whatever the coastline's resolution says */
      if (!inLand(ux * far, uy * far)) {
        let lo = 0, hi = far;
        for (let k = 0; k < 12; k++) {
          const mid = (lo + hi) / 2;
          if (inLand(ux * mid, uy * mid)) lo = mid; else hi = mid;
        }
        far = Math.max(floor, lo);
      }
      out.push([ux * far, uy * far]);
    }
    return out;
  }
  /* Sutherland–Hodgman against the half-plane that is nearer to a than to b */
  function clipToBisector(poly, a, b) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const nx = b[0] - a[0], ny = b[1] - a[1];              /* points away from a */
    const side = p => (p[0] - mx) * nx + (p[1] - my) * ny; /* < 0 is a's side   */
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const sp = side(p), sq = side(q);
      if (sp <= 0) out.push(p);
      if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
        const t = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    }
    return out;
  }

  GEO.cityCells = function (city) {
    if (!city || !city.c) return null;
    if (cellCache[city.id]) return cellCache[city.id];
    const kids = (CV.kidsOf(city.id) || []).filter(k => k.c);
    if (!kids.length) return (cellCache[city.id] = null);

    /* a local plane in degrees, longitude squeezed by the latitude */
    const lat0 = city.c[0], kx = Math.max(.2, Math.cos(lat0 * D2R_));
    const toPlane = ll => [(ll[1] - city.c[1]) * kx, ll[0] - lat0];
    const toLL = p => [lat0 + p[1], city.c[1] + p[0] / kx];

    const sites = kids.map(k => ({ u: k, p: toPlane(k.c) }));
    /* the built-up area: wide enough to hold every centre it is meant to */
    const reach = Math.max(...sites.map(s => Math.hypot(s.p[0], s.p[1])));
    const r = Math.max(reach * 1.45, GEO.urbanRadiusDeg(city));

    /* the region the city sits in — its boundary is real, and the built-up
       area cannot cross it */
    const region = CV.regionOf(city);
    const rf = region && GEO.regionFeat[region.geo];
    const rings = rf ? GEO.rings(rf.geometry) : null;
    const outline = urbanOutline(city, r, 64, rings, reach * 1.12);

    const out = {};
    sites.forEach(me => {
      let poly = outline.slice();
      sites.forEach(other => { if (other !== me && poly.length) poly = clipToBisector(poly, me.p, other.p); });
      if (poly.length < 3) return;
      const ring = poly.map(toLL).map(ll => [ll[1], ll[0]]);   /* [lon, lat] */
      ring.push(ring[0]);
      out[me.u.id] = { type: 'Feature', properties: { name: me.u.ar, generated: true },
                       geometry: { type: 'Polygon', coordinates: [ring] } };
    });
    return (cellCache[city.id] = out);
  };

  /* the built-up radius in degrees of latitude, from the population the source
     document gives the place — the street layer works from the same number */
  GEO.urbanRadiusDeg = function (u) {
    const pop = (u && u.pop) || 5e4;
    const km = Math.max(4.5, Math.min(26, 2.2 * Math.sqrt(pop / 1e5)));
    return km / 111.32;
  };

  /* ---- OpenStreetMap geometry, baked ---------------------------------
     Real district boundaries and real roads, fetched once by
     tools/build-osm.js and committed — the same arrangement the Natural Earth
     basemap already uses. Nothing is fetched at run time.

     Coordinates arrive delta-encoded as integers of 1e-5 degrees; they are
     walked back once, on first use, and kept. © OpenStreetMap contributors. */
  const OSM_D = window.OSM_DISTRICTS || null;
  const OSM_R = window.OSM_ROAD_FILES || null;
  GEO.hasOSM = !!OSM_D;
  const osmPath = enc => {
    const out = []; let x = 0, y = 0;
    for (let i = 0; i < enc.length; i += 2) { x += enc[i]; y += enc[i + 1]; out.push([x / 1e5, y / 1e5]); }
    return out;
  };
  const osmDistCache = {}, osmRoadCache = {};

  /* the real boundary for a district, if OpenStreetMap has one for it */
  GEO.osmDistrict = function (unit) {
    if (!OSM_D || !unit) return null;
    const cityId = unit.p;
    if (!(cityId in osmDistCache)) {
      const rec = OSM_D[cityId];
      const m = {};
      if (rec) rec.forEach(d => {
        const ring = osmPath(d.p);
        m[d.u] = { type: 'Feature', properties: { name: d.n, nameEn: d.e, osm: true },
                   geometry: { type: 'Polygon', coordinates: [ring.concat([ring[0]])] } };
      });
      osmDistCache[cityId] = m;
    }
    return osmDistCache[cityId][unit.id] || null;
  };

  /* The road network for a city, fetched the first time that city is entered.
     Only one city is ever on screen; the whole Kingdom's roads at once are a
     dozen megabytes nobody looks at. Returns null until it lands, and asks the
     map to repaint when it does. */
  const pending = {};
  GEO.osmRoads = function (cityId) {
    if (!OSM_R || !OSM_R[cityId]) return null;
    if (cityId in osmRoadCache) return osmRoadCache[cityId];
    if (pending[cityId]) return null;
    pending[cityId] = true;
    fetch('assets/js/data/osm-roads/' + OSM_R[cityId] + '.json')
      .then(r => (r.ok ? r.json() : null))
      .then(ways => {
        osmRoadCache[cityId] = ways
          ? ways.map(w => ({ cls: w.c, ar: w.n || '', en: w.e || '', pts: osmPath(w.p) })) : null;
        if (window.MapView && MapView.invalidate) MapView.invalidate();
        /* the reading says which source is on screen, so it has to hear about
           the network arriving too */
        if (window.FM && FM.emit) FM.emit('zoom', window.MapView ? MapView.zoom() : 0);
      })
      .catch(() => { osmRoadCache[cityId] = null; });
    return null;
  };
  GEO.hasOSMCity = cityId => !!(OSM_R && OSM_R[cityId]);

  /* Which districts the source document actually surveyed. Held by id, not by
     name: district names repeat across cities — Jeddah, Riyadh and Buraidah
     all have a المحمدية — and matching on the name alone handed a Jeddah
     district Riyadh's polygon, four hundred kilometres away. */
  const SURVEYED = new Set(CV.DISTRICTS.map(d => d.id));
  GEO.isSurveyed = unit => !!unit && SURVEYED.has(unit.id);

  /* The polygon for a district: Riyadh's is in the source document, everyone
     else's is the cell around its own centre. */
  GEO.distFeat = function (unit) {
    if (!unit) return null;
    /* a real boundary first, wherever there is one */
    const osm = GEO.osmDistrict(unit);
    if (osm) return osm;
    if (SURVEYED.has(unit.id)) return GEO.districtFeat[unit.ar] || null;
    const city = CV.U[unit.p];
    if (!city) return null;
    const cells = GEO.cityCells(city);
    return (cells && cells[unit.id]) || null;
  };
  /* true when this district's shape is a real boundary rather than a cell */
  GEO.isDrawnFromSurvey = unit => !!(GEO.osmDistrict(unit) || SURVEYED.has(unit.id));

  GEO.featFor = unit => {
    if (!unit) return null;
    if (unit.lvl === 1) return GEO.regionFeat[unit.geo] || null;
    if (unit.lvl === 3 && !unit.syn) return GEO.distFeat(unit);
    return null;
  };

  GEO.KSA = GEO.bboxOf(CV.GEO_REGIONS.features);
  GEO.RIYADH = GEO.bboxOf(CV.GEO_RIYADH.features);

  /* bounds a scope should fill when the camera flies to it */
  GEO.boundsFor = (unit, hot) => {
    if (hot) return GEO.bboxOfLL([hot.ll], 6);
    if (!unit || unit.id === 'KSA') return GEO.KSA;
    const f = GEO.featFor(unit);
    if (f) return GEO.bboxOf([f]);
    if (unit.lvl === 1) return GEO.bboxOf([GEO.regionFeat[unit.geo]].filter(Boolean));
    if (unit.id === 'C:Riyadh/الرياض') return GEO.RIYADH;
    /* a city is framed by the district map it is about to draw, so opening one
       lands on the city rather than on an arbitrary box around its centroid */
    if (unit.lvl === 2) {
      const cells = GEO.cityCells(unit);
      if (cells) { const v = Object.values(cells); if (v.length) return GEO.bboxOf(v); }
    }
    const kids = CV.kidsOf(unit.id).filter(k => k.c);
    if (kids.length) return GEO.bboxOfLL(kids.map(k => k.c).concat([unit.c]), .5);
    return GEO.bboxOfLL([unit.c], 1.2);
  };

  window.GEO = GEO;
})();
