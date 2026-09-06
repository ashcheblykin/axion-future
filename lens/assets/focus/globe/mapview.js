/* =============================================================================
   mapview.js — the observed world.
   A single 2D canvas: the world basemap (Natural Earth 1:110m, WORLD_110M),
   a hairline graticule, one flat translucent wash over the Kingdom, the
   13 region polygons from GEO_REGIONS, the 189 Riyadh district polygons from
   GEO_RIYADH, city / district / hotspot markers, and scattered telemetry
   fragments whose text is read straight out of SEED.
   The camera flies between scopes; it never teleports.
   ============================================================================= */
(function () {
  const cvs = document.getElementById('world');
  const ctx = cvs.getContext('2d', { alpha: false });
  let W = 0, H = 0, DPR = 1;

  /* ---- camera ------------------------------------------------------- */
  /* Two projections behind one interface. The flat one is Web Mercator with a
     pan/zoom camera; the globe one is an orthographic sphere centred on the
     Kingdom, used while the aperture is circular. Everything downstream draws
     through cam.proj and never knows which is active.                        */
  const D2R = Math.PI / 180, TAU = Math.PI * 2;
  /* Globe orientation. It starts on the Kingdom and is moved by dragging, so
     the planet is something you turn, not a fixed backdrop.                  */
  const GC = { lon0: 45.0, lat0: 24.0, home: { lon0: 45.0, lat0: 24.0 } };
  /* sin/cos of the current orientation, refreshed once per frame */
  const ROT = { sl: 0, cl: 1, sp: 0, cp: 1 };
  function syncRot() {
    ROT.sl = Math.sin(GC.lon0 * D2R); ROT.cl = Math.cos(GC.lon0 * D2R);
    ROT.sp = Math.sin(GC.lat0 * D2R); ROT.cp = Math.cos(GC.lat0 * D2R);
  }
  const cam = {
    cx: GEO.KSA.cx, cy: GEO.KSA.cy, s: 1,
    vx: 0, vy: 0,                                  /* viewport anchor = portal centre */
    globe: false, R: 300,
    toScreen(x, y) { return [(x - this.cx) * this.s + this.vx, (y - this.cy) * this.s + this.vy]; },
    toWorld(px, py) { return [(px - this.vx) / this.s + this.cx, (py - this.vy) / this.s + this.cy]; },
    /* unit sphere vector -> screen. Pure multiply-add: no trigonometry per
       point, which is what lets 10,587 basemap vertices redraw every frame. */
    projXYZ(X, Y, Z) {
      const y1 = -X * ROT.sl + Y * ROT.cl;
      const x1 = X * ROT.cl + Y * ROT.sl;
      const ze = -x1 * ROT.sp + Z * ROT.cp;
      const xe = x1 * ROT.cp + Z * ROT.sp;
      return [this.vx + this.R * y1, this.vy - this.R * ze, xe];
    },
    proj(lon, lat) {
      if (!this.globe) { const w = GEO.pt(lon, lat); return this.toScreen(w[0], w[1]); }
      const la = lat * D2R, lo = lon * D2R, cl = Math.cos(la);
      return this.projXYZ(cl * Math.cos(lo), cl * Math.sin(lo), Math.sin(la));
    },
    visible(lon, lat) { return !this.globe || this.proj(lon, lat)[2] > 0; },
    /* screen point -> lon/lat, in whichever projection is live */
    unproject(px, py) {
      if (!this.globe) {
        const w = this.toWorld(px, py);
        const lat = (2 * Math.atan(Math.exp(-w[1])) - Math.PI / 2) / D2R;
        return { lon: w[0] / D2R, lat, hit: true };
      }
      const X = (px - this.vx) / this.R, Y = (this.vy - py) / this.R;
      const rho = Math.hypot(X, Y);
      if (rho > 1) return { lon: GC.lon0, lat: GC.lat0, hit: false };
      const c = Math.asin(rho), sc = Math.sin(c), cc = Math.cos(c);
      const p0 = GC.lat0 * D2R;
      const lat = Math.asin(cc * Math.sin(p0) + (rho ? (Y * sc * Math.cos(p0)) / rho : 0)) / D2R;
      const lon = GC.lon0 + Math.atan2(X * sc, rho * cc * Math.cos(p0) - Y * sc * Math.sin(p0)) / D2R;
      return { lon, lat, hit: true };
    },
    /* screen point -> the limb, for geometry that runs off the near side */
    clampLimb(x, y) {
      const dx = x - this.vx, dy = y - this.vy, d = Math.hypot(dx, dy) || 1;
      return [this.vx + dx / d * this.R, this.vy + dy / d * this.R];
    },
    rotate(dLon, dLat) {
      GC.lon0 = ((GC.lon0 + dLon + 540) % 360) - 180;
      GC.lat0 = Math.max(-85, Math.min(85, GC.lat0 + dLat));
      syncRot();
    },
    setRotation(lon0, lat0) {
      GC.lon0 = ((lon0 + 540) % 360) - 180;
      GC.lat0 = Math.max(-85, Math.min(85, lat0));
      syncRot();
    },
    homeRotation() { cam.setRotation(GC.home.lon0, GC.home.lat0); },
    get lon0() { return GC.lon0; },
    get lat0() { return GC.lat0; },
  };
  syncRot();

  let fly = null, bounds = GEO.KSA, userCam = false, camZ = 0;
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ---- one continuous zoom --------------------------------------------
     There is a single scale for the whole map: P, the number of pixels one
     radian of the world occupies on screen. On the sphere it is the radius;
     on the plane it is the Mercator scale. Because they are the same number,
     the wheel runs from the planet down to a street without ever switching
     mode — the projection changes under the gesture when the visible span
     stops being curved enough to matter, and the scale does not jump.

     Z = log2(P / planetP) is the level the harness reads: 0 is the planet,
     ~1.55 is where the sphere flattens out, ~14 is roughly a metre a pixel. */
  /* Every threshold below is a zoom level, and a zoom level is measured from
     planetP — so when the sphere was made to inscribe the aperture rather than
     overflow it (a factor of 1.30), each one moved with it by log2(1.30) and
     keeps the ground scale it was calibrated for. */
  const Z_FLAT = 1.93, Z_MAX = 14.89, Z_MIN = -0.07, Z_STREET = 11.88;
  /* How far out of the aperture the planet may be pushed. The gesture that
     zooms in has to have an opposite: turning the wheel out on the sphere
     walks the camera back off it until the Kingdom is a mark on a small world,
     rather than refusing to move at all. Two levels is a quarter of the
     radius, which is as far as the limb stays worth drawing. */
  const Z_AWAY = -2;
  /* The sphere's screen radius IS this, and the aperture's radius is half its
     shorter side — so they are the same number and the limb sits exactly on
     the mask. It used to be 1.30 times larger, which put the planet's edge
     outside the circle that is supposed to contain it. */
  const planetP = () => { const p = Portal.rect(); return Math.max(40, Math.min(p.w, p.h) / 2); };
  /* the shallowest the map goes: the whole Kingdom inside the aperture */
  const mapMinZ = () => zoomOf(fitFor(GEO.KSA));
  /* An orthographic sphere measures the ground at its centre directly; Mercator
     stretches it by 1/cos(lat). So the same ground scale is a different zoom
     level on either side of the seam, and crossing without accounting for it
     steps the Kingdom about 9% wider at this latitude. This is that step,
     expressed in levels: add it going onto the plane, take it off coming back. */
  const mercLift = () => Math.log2(Math.max(.2, Math.cos((GC.lat0 || 0) * D2R)));
  /* where the projection changes, in the plane's own levels */
  const flatZ = () => Z_FLAT + mercLift();
  const zoomOf = P => Math.log2(Math.max(1e-6, P) / planetP());
  const pOf = z => planetP() * Math.pow(2, z);

  function fitFor(b) {
    const p = Portal.rect();
    const pw = Math.max(120, p.w * .86), ph = Math.max(120, p.h * .86);
    return Math.min(pw / Math.max(1e-6, b.w), ph / Math.max(1e-6, b.h));
  }
  /* The aperture changes shape while the camera moves, so the fit is recomputed
     every frame rather than frozen at the start of the flight. */
  function flyTo(b, dur) {
    bounds = b; userCam = false; wheelTo = null; invalidate();
    fly = { fx: cam.cx, fy: cam.cy, fz: camZ, t0: performance.now(), dur: dur === undefined ? 880 : dur };
  }
  /* A bounding box has a fit on the plane. On the sphere it has none: the
     planet IS the fit, at zoom 0, and every level above Z_FLAT belongs to the
     map. Handing the sphere zoomOf(fitFor(KSA)) — 2.22 against a Z_FLAT of
     1.93 — asked for a camera the renderer is not allowed to give: render()
     clamps camZ back to Z_FLAT on every frame, and tick()'s `!userCam` branch
     pushes it out towards 2.22 again on every frame, so the two never agree
     and the frame is dirty for ever. Measured after one press of "back to the
     planet": 120 repaints a second, 37% of a core, until the tab is closed.
     Both callers (Nav.home and Nav.setScale, aperture.js) set the view to the
     globe first, which already puts the camera where it belongs — this then
     took it back off. So the snap now asks which projection it is snapping
     into, and leaves a settle flight already in the air to finish. */
  function snapTo(b) {
    bounds = b; cam.cx = b.cx; cam.cy = b.cy; wheelTo = null;
    /* FM.view, not cam.globe: cam.globe is only written by render(), so at the
       moment a caller flips the view and snaps in the same breath it is still
       one frame behind and names the projection being left. */
    if (FM.view === 'globe') { userCam = true; if (!fly) camZ = 0; }
    else { userCam = false; fly = null; camZ = zoomOf(fitFor(b)); }
    invalidate();
  }

  /* zoom to a level, keeping the place under the given screen point fixed.

     A pending wheel target is dropped first, the way flyTo and snapTo drop
     one. This is a command — a deep link, a press, the map answering a click
     on a capture — and a command that arrives while the wheel is still easing
     has to win, not be overwritten a frame later. It used not to: tick() runs
     stepWheelZoom() before the flight, stepWheelZoom() goes through
     applyZoom(), and applyZoom() clears `fly`. So an animated zoomTo issued
     within about eighty milliseconds of a wheel notch was silently deleted,
     and the caller was left believing the camera had gone somewhere it had
     not. Clicking a capture's footprint just after scrolling did exactly that:
     the street reading opened, the camera stayed below street level and off
     the capture, and because both latches had already flipped on the way down
     there was no edge left to close the reading again — the wheel out went all
     the way to the planet with the street reading still on screen. */
  function zoomTo(z, dur, anchor) {
    wheelTo = null; wheelAnchor = null;
    invalidate();
    /* The planet has no interior (T17), so asking for a zoom past it is asking
       for the map — the wheel already reads it that way, and a deep link that
       names a street-scale zoom means the same thing. Without this the clamp
       in tick() would pin the camera back to the sphere and drop the request. */
    if (cam.globe && z >= Z_FLAT) FM.setView('map');
    const target = Math.max(Z_MIN, Math.min(Z_MAX, z));
    if (!dur) { applyZoom(target, anchor); return; }
    fly = { fz: camZ, tz: target, zoomOnly: true, t0: performance.now(), dur };
  }
  function applyZoom(z, anchor) {
    userCam = true; fly = null; invalidate();
    const dz = z - camZ;
    if (cam.globe) {
      /* on the sphere, zooming in leans the planet toward what you point at */
      const before = anchor ? cam.unproject(anchor[0], anchor[1]) : null;
      camZ = z; cam.s = pOf(camZ); cam.R = cam.s;
      if (before && before.hit) {
        const k = Math.min(.5, Math.abs(dz) * .55);
        let dLon = before.lon - GC.lon0;
        while (dLon > 180) dLon -= 360; while (dLon < -180) dLon += 360;
        cam.setRotation(GC.lon0 + dLon * k, GC.lat0 + (before.lat - GC.lat0) * k);
      }
      cam.cx = GC.lon0 * D2R; cam.cy = GEO.pt(0, GC.lat0)[1];
    } else {
      const before = anchor ? cam.toWorld(anchor[0], anchor[1]) : null;
      camZ = z; cam.s = pOf(camZ);
      if (before) {
        const after = cam.toWorld(anchor[0], anchor[1]);
        cam.cx += before[0] - after[0]; cam.cy += before[1] - after[1];
      }
    }
  }

  /* ---- world basemap --------------------------------------------------
     Natural Earth 1:110m country outlines (WORLD_110M, built by
     tools/build-world.js). Cartographic context only — it carries no figures
     and feeds no KPI; without it the planet reads as an island in the dark.
     Every feature in the file is drawn every frame: nothing here is filtered
     down to one country.                                                    */
  const World = { feats: [], pts: 0, drawn: 0, visible: 0, ready: false };
  function buildWorld() {
    const src = window.WORLD_110M;
    if (!src || !src.length) return;
    World.feats = src.map(f => {
      /* a bounding cap on the unit sphere: centroid direction plus the widest
         angle to any vertex. One dot product then rejects a whole country. */
      let sx = 0, sy = 0, sz = 0, n = 0;
      let lo0 = 180, lo1 = -180, la0 = 90, la1 = -90;
      const rings = f.r.map(flat => {
        const m = flat.length / 2, xyz = new Float32Array(m * 3), ll = flat;
        for (let i = 0; i < m; i++) {
          const dlon = flat[i * 2], dlat = flat[i * 2 + 1];
          if (dlon < lo0) lo0 = dlon; if (dlon > lo1) lo1 = dlon;
          if (dlat < la0) la0 = dlat; if (dlat > la1) la1 = dlat;
          const lon = dlon * D2R, lat = dlat * D2R, cl = Math.cos(lat);
          const X = cl * Math.cos(lon), Y = cl * Math.sin(lon), Z = Math.sin(lat);
          xyz[i * 3] = X; xyz[i * 3 + 1] = Y; xyz[i * 3 + 2] = Z;
          sx += X; sy += Y; sz += Z; n++;
        }
        World.pts += m;
        return { n: m, xyz, ll };
      });
      const len = Math.hypot(sx, sy, sz) || 1;
      const cx = sx / len, cy = sy / len, cz = sz / len;
      let cosMin = 1;
      rings.forEach(r => { for (let i = 0; i < r.n; i++) {
        const d = cx * r.xyz[i * 3] + cy * r.xyz[i * 3 + 1] + cz * r.xyz[i * 3 + 2];
        if (d < cosMin) cosMin = d;
      } });
      const capSin = Math.sqrt(Math.max(0, 1 - cosMin * cosMin)) + .02;
      return { n: f.n, rings, cx, cy, cz, capSin, lo0, lo1, la0, la1 };
    });
    World.ready = true;
    /* which country is under a screen point — the same bounding cap that culls
       a feature from a frame also rejects it from a hit test */
    World.at = function (px, py) {
      if (!World.ready) return null;
      const w = cam.unproject ? cam.unproject(px, py) : null;
      if (!w || (cam.globe && !w.hit)) return null;
      const lon = w.lon, lat = w.lat;
      for (const f of World.feats) {
        if (lon < f.lo0 - .5 || lon > f.lo1 + .5 || lat < f.la0 - .5 || lat > f.la1 + .5) continue;
        for (const r of f.rings) {
          let inside = false;
          const ll = r.ll, m = r.n;
          for (let i = 0, j = m - 1; i < m; j = i++) {
            const xi = ll[i * 2], yi = ll[i * 2 + 1], xj = ll[j * 2], yj = ll[j * 2 + 1];
            if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
          }
          if (inside) return f;
        }
      }
      return null;
    };
  }

  /* Drawn live in both projections — on the sphere it is clipped to the disc
     and rejected against the visible hemisphere, on the plane against the
     window. Whole features are rejected by a bounding cap before a single
     vertex is projected, which is what makes drawing it every frame cheap
     enough to not be worth baking. */
  function drawWorld(g) {
    if (!World.ready) return;
    World.drawn = 0; World.visible = 0;
    g.save();
    /* on the sphere the projection is the clip (see sphereGraticule) */
    g.lineJoin = 'round';
    g.globalAlpha = cam.globe ? 1 : (FM.level() >= 2 ? .20 : .40);
    g.fillStyle = PAL.land; g.strokeStyle = PAL.coast; g.lineWidth = 1;

    /* flat mode: the visible window in degrees, for a cheap bbox reject */
    let vlo0 = -180, vlo1 = 180, vla0 = -90, vla1 = 90;
    if (!cam.globe) {
      const tl = cam.toWorld(0, 0), br = cam.toWorld(W, H);
      const latOf = y => (2 * Math.atan(Math.exp(-y)) - Math.PI / 2) / D2R;
      vlo0 = tl[0] / D2R - 2; vlo1 = br[0] / D2R + 2;
      vla0 = latOf(br[1]) - 2; vla1 = latOf(tl[1]) + 2;
    }

    for (const f of World.feats) {
      if (cam.globe) {
        /* the whole cap is behind the horizon: nothing of it can be drawn */
        const depth = cam.projXYZ(f.cx, f.cy, f.cz)[2];
        World.drawn++;
        if (depth < -f.capSin) continue;
      } else {
        if (f.lo1 < vlo0 || f.lo0 > vlo1 || f.la1 < vla0 || f.la0 > vla1) { World.drawn++; continue; }
        World.drawn++;
      }
      let seen = false;
      g.beginPath();
      for (const ring of f.rings) {
        const n = ring.n;
        if (cam.globe) {
          const xyz = ring.xyz, vx = cam.vx, vy = cam.vy, R = cam.R;
          for (let i = 0; i < n; i++) {
            const p = cam.projXYZ(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2]);
            let x = p[0], y = p[1];
            if (p[2] <= 0) {                       /* fold the far side onto the limb */
              const dx = x - vx, dy = y - vy, d = Math.sqrt(dx * dx + dy * dy) || 1;
              x = vx + dx / d * R; y = vy + dy / d * R;
            } else seen = true;
            i ? g.lineTo(x, y) : g.moveTo(x, y);
          }
        } else {
          const ll = ring.ll;
          for (let i = 0; i < n; i++) {
            const p = cam.proj(ll[i * 2], ll[i * 2 + 1]);
            i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
          }
          seen = true;
        }
        g.closePath();
      }
      if (!seen) continue;
      World.visible++;
      g.fill();
      g.stroke();
    }
    g.restore();
  }

  /* ---- palette ------------------------------------------------------- */
  const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  let PAL = {};
  let FONT_DISP = 'sans-serif', FONT_MONO = 'monospace';
  /* One stroke spec for every region and district outline, read from the
     tokens so window.__focusMode.getRegionStrokeSpec() can never disagree with
     what is actually drawn. */
  const STROKE = { width: 1, alpha: .5 };
  /* The tokens are the source of every colour here, and the renderer reads
     them from the document rather than repeating them — duplicating them in
     JS would give the palette two owners. If the stylesheet is not in yet (a
     slow first response, which the single-threaded dev server can produce
     under load) every token reads empty, and the frame is skipped rather than
     painted with `undefined`: the palette is re-read until it is really there. */
  let palFromCss = false;
  function readPalette() {
    palFromCss = !!css('--bg-deep');
    FONT_DISP = css('--font-disp'); FONT_MONO = css('--font-mono');
    STROKE.width = parseFloat(css('--region-stroke-width')) || 1;
    STROKE.alpha = parseFloat(css('--region-stroke-alpha')) || .5;
    PAL = { bgVoid: css('--bg-void'), bgDeep: css('--bg-deep'), gold: css('--gold'),
      goldHi: css('--gold-hi'), ink: css('--ink'), inkDim: css('--ink-dim'),
      inkFaint: css('--ink-faint'), sig: css('--sig'),
      land: css('--basemap-land'), coast: css('--basemap-coast'),
      hiFill: css('--globe-highlight-fill'), hiStroke: css('--globe-highlight-stroke'),
      sceneEdge: css('--scene-edge'),
      band: [css('--band-0'), css('--band-1'), css('--band-2'), css('--band-3'), css('--band-4')] };
  }
  const hexA = (hex, a) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };

  /* ---- view culling ---------------------------------------------------
     The same reject the basemap uses, for the Kingdom's own geometry: at city
     scale twelve of the thirteen regions and most of the 189 districts are off
     screen, and projecting their vertices is pure waste.                    */
  let VB = null;
  function viewBox() {
    if (cam.globe) return null;
    const tl = cam.toWorld(0, 0), br = cam.toWorld(W, H);
    const latOf = y => (2 * Math.atan(Math.exp(-y)) - Math.PI / 2) / D2R;
    return { lo0: tl[0] / D2R - 1, lo1: br[0] / D2R + 1, la0: latOf(br[1]) - 1, la1: latOf(tl[1]) + 1 };
  }
  function featBox(f) {
    if (f.__bb) return f.__bb;
    let lo0 = 180, lo1 = -180, la0 = 90, la1 = -90;
    GEO.rings(f.geometry).forEach(r => r.forEach(c => {
      if (c[0] < lo0) lo0 = c[0]; if (c[0] > lo1) lo1 = c[0];
      if (c[1] < la0) la0 = c[1]; if (c[1] > la1) la1 = c[1];
    }));
    f.__bb = { lo0, lo1, la0, la1 };
    return f.__bb;
  }
  function inView(f) {
    if (!VB) return true;
    const b = featBox(f);
    return !(b.lo1 < VB.lo0 || b.lo0 > VB.lo1 || b.la1 < VB.la0 || b.la0 > VB.la1);
  }

  let atStreet = false, atCapture = null, syncingScope = false, scopeCheckAt = 0;

  /* The scope follows the camera. Zooming from the planet into a street is one
     gesture, so the breadcrumb, the KPI rail and the HUD have to come along —
     otherwise the reading stays on the Kingdom while the map is over a
     neighbourhood. Only the user's own camera moves drive this; a scope picked
     by clicking still flies the camera the other way round. */
  /* Which division the camera is reading. The chips are pressed by this, not
     the other way round: wheeling from the Kingdom into a street moves the
     division as surely as clicking a chip does, so the two can never disagree.
     The thresholds are the same ones syncScopeToView already uses to decide
     what the scope is, kept in one place so a change moves both together. */
  function scaleForCamera() {
    if (cam.globe) return 'country';
    if (camZ >= 6.6) return 'district';
    if (camZ >= 4.2) return 'city';
    return 'region';
  }

  function syncScopeToView(now) {
    if (!userCam || fly || FM.view === 'canvas' || now - scopeCheckAt < 260) return;
    scopeCheckAt = now;
    const wantScale = scaleForCamera();
    if (wantScale !== FM.scale) { syncingScope = true; FM.setScale(wantScale); syncingScope = false; }
    let want = 'KSA';
    if (!cam.globe && camZ >= 2.1) {
      const w = cam.toWorld(cam.vx, cam.vy);
      const region = CV.REGIONS.find(u => { const f = GEO.featFor(u); return f && GEO.inRings(GEO.rings(f.geometry), w); });
      if (region) {
        want = region.id;
        if (camZ >= 4.2) {
          const c = cam.unproject(cam.vx, cam.vy);
          const near = (list) => list.reduce((best, u) => {
            if (!u.c) return best;
            const d = Math.hypot((u.c[0] - c.lat), (u.c[1] - c.lon) * Math.cos(c.lat * D2R));
            return (!best || d < best.d) ? { u, d } : best;
          }, null);
          const city = near(CV.childrenOf(region.id));
          if (city && city.d < 2.2) {
            want = city.u.id;
            /* A district takes the scope from its city once it is the thing
               filling the view, not at a fixed zoom number: cities differ by
               two orders of magnitude in size, and an absolute threshold drops
               straight through a small one into one of its districts the
               moment you open it. */
            const dist = districtsOf(city.u).find(d => {
              const f = GEO.distFeat(d);
              if (!f || !GEO.inRings(GEO.rings(f.geometry), w)) return false;
              const bb = featBox(f);
              return (bb.lo1 - bb.lo0) * D2R * cam.s > W * .55;
            });
            if (dist) want = dist.id;
          }
        }
      }
    }
    if (want === FM.uid && !FM.hot) return;
    syncingScope = true;
    FM.setScope(want, null);
    syncingScope = false;
  }
  function announceProjection() {
    const want = cam.globe ? 'globe' : 'map';
    if (FM.view === want || FM.view === 'canvas') return;
    syncingView = true;
    FM.setView(want);
    syncingView = false;
  }

  /* What the region pass actually painted last frame. Reported verbatim by
     window.__focusMode.getRegionPaint(); if a gradient, a pattern or a bitmap
     ever creeps back into the region fill, this says so. */
  const PAINT = { fill: null, gradient: false, pattern: false, image: false };
  function paintReset() { PAINT.fill = null; PAINT.gradient = false; PAINT.pattern = false; PAINT.image = false; }
  function paintFill(style) {
    PAINT.fill = String(style);
    if (typeof style !== 'string') { PAINT.gradient = true; }
    return style;
  }

  /* one projected outline per feature per frame, shared by every pass that
     needs it — the fills, the outlines and the street clip */
  const pathCache = new Map();
  function pathFor(key, geom) {
    let p = pathCache.get(key);
    if (!p) { p = GEO.path(geom, cam); pathCache.set(key, p); }
    return p;
  }

  /* ---- hit map, rebuilt each frame ----------------------------------- */
  let hits = [];

  /* ---- render -------------------------------------------------------- */
  function render() {
    const p = Portal.rect();
    cam.vx = p.x + p.w / 2; cam.vy = p.y + p.h / 2;
    if (!palFromCss) { readPalette(); widths.clear(); if (!palFromCss) return; }
    hits = []; placed = []; drawn = []; labelQ = []; VB = null; osmDrawn = false;
    sceneDrawn = 0;
    paintReset(); pathCache.clear();
    claimChrome();

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const bg = ctx.createLinearGradient(0, 0, W * .3, H);
    bg.addColorStop(0, PAL.bgDeep); bg.addColorStop(1, PAL.bgVoid);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* One scale, planet to street. The sphere is not pinned at the whole
       planet any more: it zooms like anything else, out to Z_AWAY where the
       Kingdom is a mark on a small world, and in to Z_FLAT — the level at
       which the visible span has stopped being curved enough for the
       projection to matter. That is where the plane takes over, at the same
       scale and the same centre, so the gesture carries straight through
       instead of dissolving into a different picture. */
    cam.globe = FM.view === 'globe';
    camZ = cam.globe
      ? Math.max(Z_AWAY, Math.min(Z_FLAT, camZ))
      : Math.max(zFloor(), Math.min(Z_MAX, camZ));
    cam.s = pOf(camZ);
    cam.R = cam.s;
    if (cam.globe) {                       /* the orientation is the centre */
      cam.cx = GC.lon0 * D2R;
      cam.cy = GEO.pt(0, GC.lat0)[1];
    } else {                                /* … and the centre is the orientation */
      GC.lon0 = cam.cx / D2R;
      GC.lat0 = (2 * Math.atan(Math.exp(-cam.cy)) - Math.PI / 2) / D2R;
      syncRot();
    }
    const nowStreet = !cam.globe && camZ >= Z_STREET;
    if (nowStreet !== atStreet) { atStreet = nowStreet; FM.emit('zoom', camZ); }
    /* Street level is a zoom; standing on a capture is a place. The reading
       needs both, and panning along a street crosses the second without
       touching the first — so it gets its own latch beside atStreet, and both
       report through the same event, because to the shell they are one
       question: is the street the better picture here, now.

       Not while the hand is still on it. A drag holds the pointer through
       #world's own capture, so swapping the map for the street reading
       mid-pan leaves the reader dragging a map they can no longer see, and a
       pan that wanders back and forth over the edge of the rectangle runs a
       full setLens cycle each way. The question is asked of the camera the
       reader has arrived at, not of every camera they pass through: the latch
       holds its answer until the drag ends, and endDrag asks for the frame
       that re-reads it. The hover beside it already stands down the same way. */
    const overNow = nowStreet && window.SceneReg && !drag
      ? (() => { const c = cam.unproject(cam.vx, cam.vy);
                 const s = c.hit ? SceneReg.boxAt(c.lon, c.lat) : null;
                 return s ? s.id : null; })()
      : atCapture;
    if (!drag && overNow !== atCapture) { atCapture = overNow; FM.emit('zoom', camZ); }
    VB = viewBox();

    syncRot();
    if (cam.globe) {
      drawSphere();                /* stars, ocean, graticule, land, shading */
      fillKingdom();
      drawRegions();
    } else {
      drawWorld(ctx);
      fillKingdom();
      drawRegions();
      if (FM.scale === 'city') drawCityLabels();
      if (FM.scale === 'district') drawDistricts();
      if (camZ >= Z_STREET) drawStreets();
      drawScenes();              /* the measured ground, over the drawn one */
      drawScale();               /* markers live in the DOM layer now (poi.js) */
    }
    flushLabels();               /* every name the frame claimed, painted last */
    paintFade();                 /* … and the outgoing projection over that */
    refreshHover();              /* the ground under the cursor may have moved */
  }

  /* ---- the planet -----------------------------------------------------
     What is baked is what does not turn with the planet: the starfield, the
     body of the sphere, and — in a second buffer drawn over the land — the
     shading, the rim and the limb. All of those depend on the sphere's radius
     and centre and on nothing else.

     What is NOT baked is what the rotation changes: the graticule and the
     basemap. They used to be in the bake too, and the bake's key carried the
     rotation, so a drag re-baked a full-viewport canvas — starfield, 2,795
     projected graticule points, 10,587 basemap vertices, two radial gradients
     and a 26px shadow blur — on every frame of the gesture, and allocated a
     fresh 3200x1800 canvas to do it. That is what made turning the planet cost
     ~60ms a frame. Drawing those two things live costs about 0.6ms.          */
  let sky = null, glass = null, shellKey = '', shellR = 0, shellVx = 0, shellVy = 0;

  /* one buffer each, reused: allocating two canvases this size per frame was
     itself a large part of the cost */
  function buffer(store) {
    const w = Math.max(1, Math.round(W * DPR)), h = Math.max(1, Math.round(H * DPR));
    if (!store || store.width !== w || store.height !== h) {
      store = document.createElement('canvas');
      store.width = w; store.height = h;
    }
    const c = store.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, w, h);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { canvas: store, ctx: c };
  }

  function bakeShell() {
    /* A handover changes the radius every frame. An orthographic sphere scales
       uniformly, so the existing picture is reused and drawn at the new radius
       instead; it is re-baked once the camera settles.
       Unless the backing store itself changed size — the motion resolution
       switch does exactly that, and a buffer from the other ratio would be
       blitted at 1.6x. A stale size always re-bakes, handover or not. */
    const pw = Math.max(1, Math.round(W * DPR)), ph = Math.max(1, Math.round(H * DPR));
    const sized = sky && glass && sky.width === pw && sky.height === ph &&
                  glass.width === pw && glass.height === ph;
    /* The same reuse applies to any camera movement, not only a handover: a
       wheel zoom changes the radius on every frame, and re-baking two
       full-viewport buffers — a starfield, three radial gradients and a
       blurred limb — measured 31ms a frame against 2ms for scaling the
       picture already in hand. It is re-baked 180ms after the camera stops,
       which is the same moment the resolution goes back up. */
    if (sized && (moving || performance.now() < handoverUntil)) return;
    const key = [W, H, DPR, Math.round(cam.R), Math.round(cam.vx), Math.round(cam.vy), PAL.land].join('|');
    if (key === shellKey && sized) return;
    shellKey = key;
    shellR = cam.R; shellVx = cam.vx; shellVy = cam.vy;
    const R = cam.R, x = cam.vx, y = cam.vy;

    /* --- under the land: the starfield and the body of the sphere --------- */
    const b1 = buffer(sky); sky = b1.canvas; const c = b1.ctx;
    /* A star is 0.4–1.3 CSS px. At a retina ratio that is up to 2.6 device
       pixels and it reads; at 1x most of them are under one device pixel and
       land across a boundary, so the canvas spreads each across a 2×2 block at
       a fraction of an already low alpha — 420 smudges of ~2.5% white, which
       is a haze rather than a starfield. At 1x they are snapped to the device
       grid, floored at one whole pixel, thinned, and given the alpha back. */
    const r = CV.rng('starfield');
    const fine = DPR > 1, q = 1 / DPR;
    for (let i = 0, n = fine ? 420 : 260; i < n; i++) {
      const fx = r(), fy = r(), a = .18 + r() * .55, sz = Math.max(q, r() * .9 + .4);
      c.fillStyle = `rgba(210,224,245,${(a * (fine ? .55 : .8)).toFixed(3)})`;
      c.fillRect(Math.round(fx * W * DPR) * q, Math.round(fy * H * DPR) * q, sz, sz);
    }
    const g = c.createRadialGradient(x - R * .35, y - R * .4, R * .05, x, y, R);
    g.addColorStop(0, '#101827'); g.addColorStop(.55, '#0A0F1A'); g.addColorStop(1, '#05070C');
    c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.fillStyle = g; c.fill();

    /* --- over the land: shading, rim and limb ----------------------------- */
    const b2 = buffer(glass); glass = b2.canvas; const d = b2.ctx;
    shadeSphereInto(d);
    const rim = d.createRadialGradient(x, y, R * .80, x, y, R);
    rim.addColorStop(0, 'rgba(58,123,213,0)'); rim.addColorStop(.88, 'rgba(58,123,213,.20)');
    rim.addColorStop(1, 'rgba(229,169,76,.40)');
    d.beginPath(); d.arc(x, y, R, 0, Math.PI * 2); d.fillStyle = rim; d.fill();
    d.save();
    d.shadowColor = hexA(PAL.gold, .5); d.shadowBlur = 26;
    d.beginPath(); d.arc(x, y, R, 0, Math.PI * 2);
    d.strokeStyle = hexA(PAL.gold, .45); d.lineWidth = 1.2; d.stroke();
    d.restore();
  }

  /* the two buffers are drawn at whatever radius the camera is at now — the
     same uniform scale the handover already relied on */
  function blitShell(img) {
    if (!img) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const k = shellR ? cam.R / shellR : 1;
    if (Math.abs(k - 1) > 0.002) {
      const x = shellVx * DPR, y = shellVy * DPR;
      ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }

  /* the meridians and parallels of the sphere in view — live, because they
     are the rotation */
  function sphereGraticule() {
    ctx.save();
    /* No clip. In an orthographic projection every point of the near hemisphere
       lands inside the disc and every far point is dropped, so a segment
       between two drawn points cannot leave the circle — the clip was buying
       nothing and costing a compositing layer per frame. */
    ctx.strokeStyle = hexA(PAL.sig, .24); ctx.lineWidth = 1;
    const line = (pts) => {
      ctx.beginPath(); let on = false;
      for (const p of pts) {
        if (p[2] <= 0) { on = false; continue; }
        on ? ctx.lineTo(p[0], p[1]) : (ctx.moveTo(p[0], p[1]), on = true);
      }
      ctx.stroke();
    };
    for (let lon = -180; lon < 180; lon += 15) {
      const pts = []; for (let lat = -90; lat <= 90; lat += 3) pts.push(cam.proj(lon, lat));
      line(pts);
    }
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts = []; for (let lon = -180; lon <= 180; lon += 3) pts.push(cam.proj(lon, lat));
      line(pts);
    }
    ctx.restore();
  }

  function drawSphere() {
    bakeShell();
    blitShell(sky);
    sphereGraticule();
    drawWorld(ctx);
    blitShell(glass);
  }

  /* Directional shading, applied over the basemap rather than under it: the
     sphere has to read as a sphere, but the land must stay land. Kept light in
     the middle of the disc so the terminator never swallows a continent. */
  function shadeSphereInto(g) {
    const R = cam.R, x = cam.vx, y = cam.vy;
    g.save();
    g.beginPath(); g.arc(x, y, R, 0, TAU); g.clip();
    const sh = g.createRadialGradient(x - R * .40, y - R * .45, R * .05, x - R * .08, y - R * .08, R * 1.42);
    sh.addColorStop(0, 'rgba(150,190,245,.07)');
    sh.addColorStop(.42, 'rgba(4,6,11,.06)');
    sh.addColorStop(.78, 'rgba(3,5,9,.26)');
    sh.addColorStop(1, 'rgba(2,3,6,.62)');
    g.fillStyle = sh; g.fillRect(x - R, y - R, R * 2, R * 2);
    g.restore();
  }

  /* ---- the orbit -------------------------------------------------------
     The one thing on the planet that moves on its own, and it used to cost
     the whole planet to move it: a marker crossing a ring asked for a repaint
     every 45ms, and a repaint is two full-viewport buffers blitted over each
     other — measured at 34.9ms a frame at a retina ratio against 2.7ms at 1x,
     which is 46% of a core spent, permanently, on a decorative dot. It was
     spent even with the reading standing on the environment photograph, where
     the planet is not on screen at all.

     So the ring is drawn on a sheet of its own, over the map and under
     everything else, and only the piece of that sheet it occupies is cleared.
     The sphere underneath is repainted when the sphere changes and at no
     other time.                                                             */
  let orbCvs = null, orbCtx = null, orbW = 0, orbH = 0, orbClear = null, decor = true;
  const CALM = matchMedia('(prefers-reduced-motion: reduce)');

  function orbitSheet() {
    if (orbCvs) return orbCvs;
    orbCvs = document.createElement('canvas');
    orbCvs.setAttribute('aria-hidden', 'true');
    orbCvs.style.cssText = 'position:fixed;inset:0;z-index:0;display:block;pointer-events:none';
    /* straight after the map, so it stacks over it and under the backdrop —
       the environment reading still covers both */
    cvs.parentNode.insertBefore(orbCvs, cvs.nextSibling);
    orbCtx = orbCvs.getContext('2d');
    return orbCvs;
  }

  function wipeOrbit() {
    if (!orbCtx || !orbClear) return;
    orbCtx.setTransform(1, 0, 0, 1, 0, 0);
    orbCtx.clearRect(0, 0, orbCvs.width, orbCvs.height);
    orbClear = null;
  }

  function drawOrbit() {
    if (!decor || !cam.globe) { wipeOrbit(); return; }
    orbitSheet();
    if (orbW !== W || orbH !== H || orbCvs.width !== Math.round(W * DPR)) {
      orbW = W; orbH = H; orbClear = null;
      orbCvs.width = Math.max(1, Math.round(W * DPR));
      orbCvs.height = Math.max(1, Math.round(H * DPR));
      orbCvs.style.width = W + 'px'; orbCvs.style.height = H + 'px';
    }
    const R = cam.R, x = cam.vx, y = cam.vy;
    /* a still ring on a reader who asked for stillness — the ellipse is the
       picture, the travelling marker is the animation */
    const t = CALM.matches ? 0 : performance.now() / 1000;
    const g = orbCtx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (orbClear) g.clearRect(orbClear[0], orbClear[1], orbClear[2], orbClear[3]);
    /* the ring's semi-major axis bounds it at every rotation, so this square
       is the whole of what the last frame could have touched */
    const pad = R * 1.2 + 6;
    orbClear = [(x - pad) * DPR, (y - pad) * DPR, pad * 2 * DPR, pad * 2 * DPR];
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.save();
    g.translate(x, y); g.rotate(Math.sin(t * .09) * .22 - .38);
    g.strokeStyle = hexA(PAL.gold, .18); g.lineWidth = 1;
    g.beginPath(); g.ellipse(0, 0, R * 1.14, R * .30, 0, 0, Math.PI * 2); g.stroke();
    /* one marker riding the orbit: the "system is watching" tell */
    const a = t * .35 % (Math.PI * 2);
    const mx = Math.cos(a) * R * 1.14, my = Math.sin(a) * R * .30;
    g.fillStyle = hexA(PAL.goldHi, .9);
    g.beginPath(); g.arc(mx, my, 2, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  /* There used to be a lat/lon lattice under the plane here. It was scenery:
     it carried no reading, it moved with the camera in a way that read as
     texture rather than as measurement, and at every zoom it competed with the
     boundaries that do carry one. The scale bar states the distance; the
     boundaries state the divisions. Nothing else on the plane needs a grid. */

  /* The Kingdom silhouette, filled with --globe-highlight-fill.
     One flat translucent colour — no gradient, no pattern, no texture buffer.
     What used to be here was a procedural relief raster drawn over the region,
     and it read as blotchy khaki rather than as terrain. The outline carries
     the boundary; the fill only says "this is the scope". */
  function kingdomPath() {
    const p = new Path2D();
    CV.GEO_REGIONS.features.forEach(f => GEO.rings(f.geometry).forEach(r => {
      r.forEach((c, i) => { const q = cam.proj(c[0], c[1]); i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]); });
      p.closePath();
    }));
    return p;
  }
  /* the wash says "this is the scope"; below country scale that is obvious
     from the map itself, so it fades out rather than flooding the screen */
  function scopeFade() { return Math.max(0, Math.min(1, 1 - (camZ - 4.5) / 2.5)); }
  function fillKingdom() {
    const a = scopeFade(); if (a <= 0.02) return;
    if (cam.globe) {
      const q = cam.proj(GEO.KSA.x0 / (Math.PI / 180), 24);
      if (q.length > 2 && q[2] <= 0) return;            /* rotated out of sight */
    }
    const p = kingdomPath();
    ctx.globalAlpha = a;
    ctx.fillStyle = paintFill(PAL.hiFill);
    ctx.fill(p);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = PAL.hiStroke;
    ctx.globalAlpha = STROKE.alpha * a;
    ctx.lineWidth = STROKE.width;
    ctx.stroke(p);
    ctx.globalAlpha = 1;
  }

  function bandOf(uid) {
    const v = FM.val(uid, FM.kpi);
    return { v, b: CV.band(FM.kpi, v) };
  }

  function drawRegions() {
    const lvl = FM.level(), chain = FM.chain().map(u => u.id);
    ctx.lineJoin = 'round';
    /* one projection per region, reused by the wash, the cut, the hairline,
       the scrim and the glow */
    const shown = [];
    CV.REGIONS.forEach(u => {
      const f = GEO.featFor(u);
      if (f && inView(f)) shown.push({ u, f, p: GEO.path(f.geometry, cam) });
    });

    /* 1 — the data wash: one flat colour per region, low alpha. Hue is the
           standing against target; there is nothing else painted over it. */
    shown.forEach(({ u, p }) => {
      const dim = lvl >= 1 && chain.indexOf(u.id) < 0;
      const { b } = bandOf(u.id);
      ctx.fillStyle = paintFill(hexA(PAL.band[b], (dim ? .05 : .14) * Math.max(.25, scopeFade())));
      ctx.fill(p);
    });
    /* 2 — one hairline separator, at the width and alpha the tokens declare */
    ctx.globalAlpha = STROKE.alpha; ctx.lineWidth = STROKE.width;
    shown.forEach(({ u, f, p }) => {
      const { b } = bandOf(u.id);
      ctx.strokeStyle = PAL.band[b];
      ctx.stroke(p);
      hits.push({ kind: 'unit', id: u.id, geom: f.geometry });
    });
    ctx.globalAlpha = 1;
    /* 3 — everything outside the scope is pushed back into the ground       */
    if (lvl >= 1) {
      const keep = CV.regionOf(FM.unit());
      ctx.fillStyle = 'rgba(4,6,11,.58)';
      shown.forEach(({ u, p }) => { if (!keep || u.id !== keep.id) ctx.fill(p); });
    }
    /* 4 — the scope in view: the same hairline, just brighter. No glow. */
    if (lvl >= 1) {
      const r = CV.regionOf(FM.unit()), hit = r && shown.find(x => x.u.id === r.id);
      if (hit) {
        ctx.strokeStyle = PAL.hiStroke;
        ctx.globalAlpha = STROKE.alpha; ctx.lineWidth = STROKE.width;
        ctx.stroke(hit.p);
        ctx.globalAlpha = 1;
      }
    }
    /* On the sphere the Kingdom is small: naming all thirteen regions would
       bury it. Only the three lowest-compliance regions — SEED.national.worst —
       are called out, which is also the editorially useful set. */
    /* …but only while it IS small. Once the wheel has brought the Kingdom up to
       fill the aperture, the sphere names all thirteen exactly as the plane
       does — otherwise ten names would appear out of nowhere at the seam. */
    if (cam.globe && camZ < .6) {
      const worst = CV.SEED.national.worst.map(w => CV.REGIONS.find(r => r.ar === w.ar)).filter(Boolean);
      const LEG = [40, 86, 132], SIDE = [-1, 1, -1];
      worst.forEach((u, i) => {
        const { v, b } = bandOf(u.id);
        const s = cam.proj(u.c[1], u.c[0]);
        if (s.length > 2 && s[2] <= 0) return;
        const ex = s[0] + SIDE[i] * 46, ey = s[1] - LEG[i];
        ctx.save();
        ctx.strokeStyle = hexA(PAL.band[b], .75); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[0], ey + 12); ctx.lineTo(ex, ey + 12); ctx.stroke();
        ctx.beginPath(); ctx.arc(s[0], s[1], 2.4, 0, TAU); ctx.fillStyle = PAL.band[b]; ctx.fill();
        ctx.restore();
        label(ex, ey - 20, CV.nm(u), CV.fmtV(FM.kpi, v), PAL.band[b], 1, 12);
      });
    /* the region division, named — on whichever projection is carrying it */
    } else if (FM.scale === 'region' || (cam.globe && camZ >= .6)) {
      const inScope = CV.regionOf(FM.unit());
      shown.slice().sort((a, b) => b.u.pop - a.u.pop).forEach(({ u }) => {
        if (lvl >= 1 && inScope && u.id === inScope.id) return;   /* the HUD already names it */
        const dim = lvl >= 1 && chain.indexOf(u.id) < 0;
        const { v, b } = bandOf(u.id);
        const s = cam.proj(u.c[1], u.c[0]);
        if (s.length > 2 && s[2] <= 0) return;          /* round the back of the sphere */
        label(s[0], s[1], CV.nm(u), CV.fmtV(FM.kpi, v), PAL.band[b], dim ? .34 : 1, lvl === 0 ? 13 : 12);
      });
    }
  }

  /* The municipalities of the division in view, named and valued on the map
     itself. The dots are DOM markers (poi.js) and only name themselves under
     the cursor, which is right for 52 of them at once — but the review asked
     for the figures to be ON the map, the way the regions carry theirs. So the
     names are laid by the same collision pass every other label goes through:
     what fits is drawn, what would land on top of something else is dropped,
     and the selected one is drawn whatever else has to go. */
  function drawCityLabels() {
    const region = FM.chain().find(x => x.lvl === 1);
    const cities = region ? CV.childrenOf(region.id) : CV.CITIES;
    cities.slice()
      .sort((a, b) => (b.pop || 0) - (a.pop || 0))
      .forEach(c => {
        if (!c.c) return;
        const s = cam.proj(c.c[1], c.c[0]);
        if (s.length > 2 && s[2] <= 0) return;
        if (s[0] < 0 || s[0] > W || s[1] < 0 || s[1] > H) return;
        const { v, b } = bandOf(c.id);
        const sel = c.id === FM.uid;
        label(s[0], s[1] + 13, CV.nm(c), CV.fmtV(FM.kpi, v), PAL.band[b], sel ? 1 : .82, sel ? 12 : 11);
      });
  }

  /* The districts belonging to whichever city the scope is inside. Riyadh's
     come from the source document; every other city's are the cells around
     its own sub-district centres (GEO.cityCells). Either way a city has a city
     map — the alternative was thirteen regions of blank ground. */
  function cityInScope() {
    const u = FM.unit();
    if (u.lvl === 2) return u;
    if (u.lvl >= 3) return CV.U[u.p] || null;
    return null;
  }
  function districtsOf(city) {
    if (!city) return [];
    return (CV.kidsOf(city.id) || []).filter(d => d.c || GEO.isSurveyed(d));
  }
  function districtsInScope() { return districtsOf(cityInScope()); }
  /* true when what is on screen is cells rather than surveyed boundaries —
     the interface says so, at the zoom where it matters */
  /* Set by what was actually painted, not by what might be: a district with a
     real boundary — surveyed in the source document, or mapped in
     OpenStreetMap — is not a cell and must not be labelled as one. */
  let cellDrawn = false;
  function cellsAreGenerated() { return cellDrawn; }

  function drawDistricts() {
    const lvl = FM.level();
    if (FM.scale !== 'district') return;
    const dists = districtsInScope();
    if (!dists.length) return;
    const shown = [];
    cellDrawn = false;
    dists.forEach(d => {
      const f = GEO.distFeat(d);
      if (!f || !inView(f)) return;
      if (f.properties && f.properties.osm) osmDrawn = true;
      else if (!GEO.isDrawnFromSurvey(d)) cellDrawn = true;
      shown.push({ d, f, p: pathFor(d.id, f.geometry) });
    });

    shown.forEach(({ d, f, p }) => {
      const sel = d.id === FM.uid || (FM.hot && FM.hot.split('#')[0] === d.id);
      const { b } = bandOf(d.id);
      const col = PAL.band[b];
      const fade = Math.max(.30, Math.min(1, 1 - (camZ - 8) / 4));
      ctx.fillStyle = hexA(col, (sel ? .26 : lvl >= 3 ? .10 : .16) * fade);
      ctx.fill(p);
      ctx.globalAlpha = STROKE.alpha; ctx.lineWidth = STROKE.width;
      ctx.strokeStyle = sel ? PAL.hiStroke : col;
      ctx.stroke(p);
      ctx.globalAlpha = 1;
      hits.push({ kind: 'unit', id: d.id, geom: f.geometry });
    });
    const D2Rl = Math.PI / 180;
    shown.forEach(({ d, f }) => {
      const sel = d.id === FM.uid;
      if (cam.s < 3400 && !sel) return;
      if (!sel && (featBox(f).lo1 - featBox(f).lo0) * D2Rl * cam.s < 26) return;
      const { v, b } = bandOf(d.id);
      const s = cam.proj(d.c[1], d.c[0]);
      label(s[0], s[1], CV.nm(d), CV.fmtV(FM.kpi, v), PAL.band[b], sel ? 1 : .78, 11);
    });
  }

  /* ---- street layer ---------------------------------------------------
     Below roughly five metres to the pixel a district polygon on its own says
     nothing, so a street grid is drawn inside it. The dataset has no road
     geometry — this grid is generated deterministically from the district id,
     and the interface says so at this zoom (I18N fm_streets_note). What is NOT
     invented is the naming: the arterials carry the street names the source
     document ships in STREETS, and the one a hotspot sits on is labelled with
     that hotspot's own street, so "Excavation without a valid permit, King Fahd
     Rd" is drawn on a road called King Fahd Rd.                              */
  const streetCache = {};
  let streetSegs = 0, gridDrawn = false, osmDrawn = false;
  function streetsFor(distId, unit) {
    if (streetCache[distId]) return streetCache[distId];
    const d = unit || CV.U[distId], f = d && GEO.distFeat(d);
    if (!d) return (streetCache[distId] = []);
    const rr = urbanRadius(d) / D2R;
    const bb = f ? featBox(f)
                 : { lo0: d.c[1] - rr, lo1: d.c[1] + rr, la0: d.c[0] - rr, la1: d.c[0] + rr };
    const r = CV.rng('streets:' + distId);
    const c = [(bb.lo0 + bb.lo1) / 2, (bb.la0 + bb.la1) / 2];
    const kx = Math.max(.2, Math.cos(c[1] * D2R));
    const halfW = (bb.lo1 - bb.lo0) / 2 * kx, halfH = (bb.la1 - bb.la0) / 2;
    const rad = Math.hypot(halfW, halfH) * 1.2;
    const ang = r() * Math.PI;
    const step = 0.0016;                                   /* ~180 m */
    const out = [];
    for (let dir = 0; dir < 2; dir++) {
      const a = ang + dir * Math.PI / 2;
      const ux = Math.cos(a), uy = Math.sin(a);            /* along the road   */
      const px = -uy, py = ux;                             /* across the roads */
      let n = 0;
      for (let t = -rad; t <= rad; t += step, n++) {
        const cxl = px * t, cyl = py * t;
        const toLL = (x, y) => [c[0] + x / kx, c[1] + y];
        out.push({
          a: toLL(cxl - ux * rad, cyl - uy * rad),
          b: toLL(cxl + ux * rad, cyl + uy * rad),
          dir, major: n % 4 === 0, name: null, ang: a,
        });
      }
    }
    /* name the arterials from the source's street list … */
    let k = 0;
    out.forEach(sg => { if (sg.major) sg.name = CV.STREETS[(CV.h32(distId + k++) ) % CV.STREETS.length]; });
    /* … and put each hotspot's own street under the hotspot */
    (CV.U[distId] && CV.U[distId].lvl === 3 ? CV.hotspots(distId) : []).forEach(h => {
      let best = null, bd = 1e9;
      out.forEach(sg => {
        if (sg.dir !== 0) return;
        const dx = (h.ll[1] - sg.a[0]) * kx, dy = h.ll[0] - sg.a[1];
        const ux = Math.cos(sg.ang), uy = Math.sin(sg.ang);
        const dist = Math.abs(dx * -uy + dy * ux);
        if (dist < bd) { bd = dist; best = sg; }
      });
      if (best) { best.major = true; best.name = [h.st.ar, h.st.en]; }
    });
    streetCache[distId] = out;
    return out;
  }

  /* Which locality the view is standing over. Riyadh's districts have real
     polygons; every other city has a centre and a population, and its built-up
     area is taken as a radius around it. Out in open desert the answer is
     nothing, and nothing is drawn — a street grid over empty terrain would be
     an invention, not an illustration. */
  const kmToRad = km => km / 6371;
  function urbanRadius(u) {
    const pop = u.pop || 5e4;
    return kmToRad(Math.max(4.5, Math.min(26, 2.2 * Math.sqrt(pop / 1e5))));
  }
  function localityInView() {
    if (FM.level() >= 3) {
      const id = FM.hot ? FM.hot.split('#')[0] : FM.uid;
      return { id, unit: CV.U[id] };
    }
    const w = cam.toWorld(cam.vx, cam.vy);
    for (const d of districtsInScope()) {
      const f = GEO.distFeat(d);
      if (f && GEO.inRings(GEO.rings(f.geometry), w)) return { id: d.id, unit: d };
    }
    for (const d of CV.DISTRICTS) {
      const f = GEO.districtFeat[d.ar];
      if (f && GEO.inRings(GEO.rings(f.geometry), w)) return { id: d.id, unit: d };
    }
    const c = cam.unproject(cam.vx, cam.vy);
    let best = null, bd = 1e9;
    const consider = u => {
      if (!u || !u.c) return;
      const dlat = (u.c[0] - c.lat) * D2R;
      const dlon = (u.c[1] - c.lon) * D2R * Math.cos(c.lat * D2R);
      const d = Math.hypot(dlat, dlon);
      /* a little beyond the built-up edge still counts: the network should be
         there as you come in on it, not appear the instant you cross a line */
      if (d < urbanRadius(u) * 2.5 && d < bd) { bd = d; best = u; }
    };
    CV.CITIES.forEach(consider);
    Object.values(CV.U).forEach(u => { if (u.syn) consider(u); });
    return best ? { id: best.id, unit: best } : null;
  }

  /* Is this settlement's built-up area on screen, and big enough to carry a
     grid? The radius comes from the population the source document gives it. */
  function urbanOnScreen(u) {
    if (!u || !u.c) return false;
    const p = cam.proj(u.c[1], u.c[0]);
    if (p.length > 2 && p[2] <= 0) return false;
    const rpx = urbanRadius(u) * cam.s;
    if (rpx < 60) return false;
    return p[0] > -rpx && p[0] < W + rpx && p[1] > -rpx && p[1] < H + rpx;
  }

  /* ---- the real road network ------------------------------------------
     Where OpenStreetMap has the city, its roads are drawn — the actual
     geometry, with the actual names. The generated grid below is what happens
     only where it does not, and it is the only case that carries a
     disclaimer. */
  const ROAD = {
    motorway:  { w: [10, 5.4], a: .62 },
    trunk:     { w: [9, 4.8],  a: .56 },
    primary:   { w: [7.4, 3.8], a: .48 },
    secondary: { w: [5.4, 2.6], a: .36 },
    tertiary:  { w: [3.4, 1.5], a: .26 },
  };
  function drawOSMRoads(cityId) {
    const roads = GEO.osmRoads(cityId);
    if (!roads || !roads.length) return false;
    const M = 80;
    /* project once, cull once, then let each class stroke in a single path */
    const byCls = {};
    let drawn = 0;
    for (const r of roads) {
      const spec = ROAD[r.cls]; if (!spec) continue;
      const pts = r.pts, n = pts.length;
      let out = null, prev = null, on = false;
      for (let i = 0; i < n; i++) {
        const p = cam.proj(pts[i][0], pts[i][1]);
        if (p.length > 2 && p[2] <= 0) { on = false; prev = null; continue; }
        const vis = p[0] > -M && p[0] < W + M && p[1] > -M && p[1] < H + M;
        if (vis || (prev && on)) {
          (out || (out = byCls[r.cls] || (byCls[r.cls] = [])));
          if (!on) { out.push(['M', p[0], p[1]]); on = true; }
          else out.push(['L', p[0], p[1]]);
          drawn++;
        } else { on = false; }
        prev = p;
      }
      if (out && drawn) namedRoads.push(r);
    }
    if (!drawn) return false;
    streetSegs += drawn;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const order = ['tertiary', 'secondary', 'primary', 'trunk', 'motorway'];
    /* casing first for the whole network, then the surface: roads read as one
       system rather than as a stack of ribbons */
    for (const pass of [0, 1]) {
      for (const cls of order) {
        const seq = byCls[cls]; if (!seq) continue;
        const spec = ROAD[cls];
        ctx.beginPath();
        for (const [op, x, y] of seq) op === 'M' ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        ctx.lineWidth = spec.w[pass];
        ctx.strokeStyle = pass === 0 ? 'rgba(4,6,11,.72)' : `rgba(198,214,238,${spec.a})`;
        ctx.stroke();
      }
    }
    ctx.restore();
    return true;
  }

  /* the names that were actually on screen this frame, labelled after the
     network is down so a name is never buried under the next road */
  let namedRoads = [];
  function labelRoads() {
    if (!namedRoads.length) return;
    ctx.save();
    ctx.font = `600 10px ${FONT_MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const seen = new Set();
    const wide = { motorway: 1, trunk: 1, primary: 1, secondary: 1 };
    for (const r of namedRoads) {
      if (!wide[r.cls]) continue;
      const nm = CV.LANG === 'ar' ? (r.ar || r.en) : (r.en || r.ar);
      if (!nm || seen.has(nm)) continue;
      /* the segment of this road nearest the middle of the view */
      let bi = -1, bd = 1e9;
      for (let i = 0; i < r.pts.length - 1; i++) {
        const a = cam.proj(r.pts[i][0], r.pts[i][1]);
        const d = Math.hypot(a[0] - cam.vx, a[1] - cam.vy);
        if (d < bd) { bd = d; bi = i; }
      }
      if (bi < 0) continue;
      const A = cam.proj(r.pts[bi][0], r.pts[bi][1]);
      const B = cam.proj(r.pts[bi + 1][0], r.pts[bi + 1][1]);
      if (A[0] < 60 || A[0] > W - 60 || A[1] < 60 || A[1] > H - 60) continue;
      if (Math.hypot(B[0] - A[0], B[1] - A[1]) < 26) continue;
      const box = { x: A[0] - 60, y: A[1] - 9, w: 120, h: 18 };
      if (placed.some(q => box.x < q.x + q.w && box.x + box.w > q.x &&
                           box.y < q.y + q.h && box.y + box.h > q.y)) continue;
      placed.push(box);
      seen.add(nm);
      let ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
      if (ang > Math.PI / 2 || ang < -Math.PI / 2) ang += Math.PI;
      ctx.save(); ctx.translate(A[0], A[1]); ctx.rotate(ang);
      ctx.fillStyle = 'rgba(4,6,11,.85)'; ctx.fillText(nm, 1, -7);
      ctx.fillStyle = PAL.ink; ctx.globalAlpha = .88; ctx.fillText(nm, 0, -8);
      ctx.restore();
      if (seen.size >= 9) break;
    }
    ctx.restore();
  }

  function drawStreets() {
    streetSegs = 0; gridDrawn = false;
    namedRoads = [];
    /* a real network wherever there is one */
    const city = cityInScope() || (localityInView() || {}).unit;
    /* the generated grid still stands in while a city's roads are in flight —
       a blank frame would be worse than a placeholder that says it is one */
    if (city && GEO.hasOSMCity(city.id) && drawOSMRoads(city.id)) { osmDrawn = true; labelRoads(); return; }
    gridDrawn = true;
    /* every district on screen gets its own grid — a network that stopped at
       the boundary of the one under the crosshair would read as a bug */
    /* only districts big enough on screen to carry a grid */
    const D2Rl = Math.PI / 180;
    const inView = districtsInScope().filter(d => {
      const f = GEO.distFeat(d);
      if (!f || !inView2(f)) return false;
      const bb = featBox(f);
      return (bb.lo1 - bb.lo0) * D2Rl * cam.s > 110;
    });
    if (inView.length) { inView.forEach(d => drawStreetsFor(d.id, d, GEO.distFeat(d))); return; }
    /* Riyadh is the only city the source document carries district polygons
       for. Everywhere else the city's own built-up area is the unit, so a
       street zoom over any region of the Kingdom has a network under it
       instead of blank ground — Jeddah, Dammam, Abha and the rest included.
       The grid is illustrative and says so on screen; what is real is where
       the settlement is and how big its population makes it. */
    const towns = [];
    CV.CITIES.forEach(u => { if (urbanOnScreen(u)) towns.push(u); });
    Object.values(CV.U).forEach(u => { if (u.syn && urbanOnScreen(u)) towns.push(u); });
    if (towns.length) {
      towns.sort((a, b) => (b.pop || 0) - (a.pop || 0));
      towns.slice(0, 6).forEach(u => drawStreetsFor(u.id, u, GEO.distFeat(u)));
      return;
    }
    const loc = localityInView(); if (!loc) return;
    drawStreetsFor(loc.id, loc.unit, loc.unit && GEO.distFeat(loc.unit));
  }
  const inView2 = f => inView(f);

  function drawStreetsFor(id, unit, f) {
    const segs = streetsFor(id, unit); if (!segs.length) return;
    ctx.save();
    if (f) {
      ctx.clip(pathFor(id, f.geometry));
    } else {                                  /* no polygon: the built-up area */
      const c = cam.proj(unit.c[1], unit.c[0]);
      const e = cam.proj(unit.c[1] + urbanRadius(unit) / D2R / Math.cos(unit.c[0] * D2R), unit.c[0]);
      const rpx = Math.abs(e[0] - c[0]) || 60;
      const p = new Path2D(); p.arc(c[0], c[1], rpx, 0, TAU); ctx.clip(p);
    }
    ctx.lineCap = 'round';
    /* project once, cull to the viewport once, then reuse for all four passes */
    const M = 60, on = [];
    let onMajor = 0;
    segs.forEach(sg => {
      const A = cam.proj(sg.a[0], sg.a[1]), B = cam.proj(sg.b[0], sg.b[1]);
      if ((A[0] < -M && B[0] < -M) || (A[0] > W + M && B[0] > W + M) ||
          (A[1] < -M && B[1] < -M) || (A[1] > H + M && B[1] > H + M)) return;
      on.push([A[0], A[1], B[0], B[1], sg.major]);
      if (sg.major) onMajor++;
    });
    streetSegs += on.length;
    const draw = (major, width, style) => {
      ctx.beginPath();
      for (const l of on) { if (!!l[4] !== major) continue; ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); }
      ctx.lineWidth = width; ctx.strokeStyle = style; ctx.stroke();
    };
    draw(false, 2.6, 'rgba(4,6,11,.55)');
    draw(false, 1.1, 'rgba(186,203,228,.13)');
    draw(true, 7, 'rgba(4,6,11,.75)');
    draw(true, 4, 'rgba(198,214,238,.20)');
    ctx.restore();

    /* names along the arterials, one per road, near the middle of the view */
    ctx.save();
    ctx.font = `600 10px ${FONT_MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const seen = new Set();
    segs.forEach(sg => {
      if (!sg.major || !sg.name) return;
      const nm = Array.isArray(sg.name) ? (CV.LANG === 'ar' ? sg.name[0] : sg.name[1])
                                        : (CV.LANG === 'ar' ? sg.name[0] : sg.name[1]);
      if (seen.has(nm)) return;
      const A = cam.proj(sg.a[0], sg.a[1]), B = cam.proj(sg.b[0], sg.b[1]);
      const t = closestT(A, B, cam.vx, cam.vy);
      if (t < .02 || t > .98) return;
      const x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t;
      if (x < 40 || x > W - 40 || y < 40 || y > H - 40) return;
      if (f && !GEO.inRings(GEO.rings(f.geometry), cam.toWorld(x, y))) return;
      seen.add(nm);
      let a = Math.atan2(B[1] - A[1], B[0] - A[0]);
      if (a > Math.PI / 2 || a < -Math.PI / 2) a += Math.PI;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.fillStyle = 'rgba(4,6,11,.8)'; ctx.fillText(nm, 1, -7);
      ctx.fillStyle = PAL.ink2 || PAL.ink; ctx.globalAlpha = .85; ctx.fillText(nm, 0, -8);
      ctx.restore();
    });
    ctx.restore();
  }
  function closestT(A, B, x, y) {
    const dx = B[0] - A[0], dy = B[1] - A[1], L = dx * dx + dy * dy;
    if (!L) return 0;
    return Math.max(0, Math.min(1, ((x - A[0]) * dx + (y - A[1]) * dy) / L));
  }

  function drawMarkers() {
    const lvl = FM.level(), u = FM.unit();
    /* cities of the region in scope */
    if (lvl === 1 || lvl === 2) {
      const region = CV.regionOf(u) || u;
      CV.childrenOf(region.id).forEach(c => {
        if (!c.c) return;
        const s = cam.proj(c.c[1], c.c[0]);
        const { v, b } = bandOf(c.id);
        marker(s, PAL.band[b], c.id === FM.uid, 'city');
        label(s[0], s[1] + 12, CV.nm(c), CV.fmtV(FM.kpi, v), PAL.band[b], c.id === FM.uid ? 1 : .88, 12);
        hits.push({ kind: 'unit', id: c.id, px: s, r: 16 });
      });
    }
    /* synthetic sub-districts of a non-Riyadh city */
    if (lvl === 2 && u.ch.length === 0) {
      CV.subDistricts(u.id).forEach(d => {
        const s = cam.proj(d.c[1], d.c[0]);
        const { v, b } = bandOf(d.id);
        marker(s, PAL.band[b], false, 'dist');
        label(s[0], s[1] + 11, CV.nm(d), CV.fmtV(FM.kpi, v), PAL.band[b], .85, 11);
        hits.push({ kind: 'unit', id: d.id, px: s, r: 14 });
      });
    }
    /* hotspots inside a district */
    if (lvl >= 3) {
      const distId = FM.hot ? FM.hot.split('#')[0] : FM.uid;
      CV.hotspots(distId).forEach(h => {
        const s = cam.proj(h.ll[1], h.ll[0]);
        const col = PAL.band[Math.min(4, h.sev + 1)];
        const sel = FM.hot === h.id;
        hotMark(s, col, sel, h);
        hits.push({ kind: 'hot', id: h.id, px: s, r: 18 });
      });
    }
  }

  /* The six documented city cases from MON carry real coordinates, media and a
     handling timeline. They are pinned at every zoom level, because a case is
     the one thing an executive should never have to drill to find.          */
  function drawCases() {
    if (cam.globe) return;
    const t = performance.now() / 1000;
    CV.MON.forEach(m => {
      if (!m.ll) return;
      const p = cam.proj(m.ll[1], m.ll[0]);
      if (p[0] < -30 || p[0] > W + 30 || p[1] < -30 || p[1] > H + 30) return;
      const col = PAL.band[Math.min(4, m.sev)];
      const hasVid = (m.media || []).some(x => x.a && x.a.t === 'vid');
      ctx.save(); ctx.translate(p[0], p[1]);
      const pulse = .45 + .55 * (.5 + .5 * Math.sin(t * 1.6 + m.sev));
      ctx.strokeStyle = hexA(col, .28 * pulse); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 13 + m.sev * 1.5, 0, Math.PI * 2); ctx.stroke();
      ctx.rotate(Math.PI / 4);
      ctx.shadowColor = hexA(col, .9); ctx.shadowBlur = 14;
      ctx.strokeStyle = col; ctx.lineWidth = 1.6;
      ctx.strokeRect(-6.5, -6.5, 13, 13);
      ctx.shadowBlur = 0; ctx.fillStyle = hexA(col, .55); ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
      if (hasVid) {
        ctx.save(); ctx.fillStyle = PAL.goldHi;
        ctx.beginPath(); ctx.moveTo(p[0] + 9, p[1] - 10); ctx.lineTo(p[0] + 15, p[1] - 7);
        ctx.lineTo(p[0] + 9, p[1] - 4); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      hits.push({ kind: 'case', id: m.id, px: p, r: 16 });
      /* the category reads in a glance; the headline lives in the drawer */
      if (FM.level() >= 1) label(p[0], p[1] + 16, CV.nm({ ar: m.catAr, en: m.catEn }),
        CV.nm({ ar: m.amAr, en: m.amEn }), col, .95, 11);
    });
  }

  function marker(s, col, sel, kind) {
    ctx.save();
    ctx.translate(s[0], s[1]);
    const r = kind === 'city' ? 6.5 : 4.5;
    ctx.shadowColor = hexA(col, .9); ctx.shadowBlur = sel ? 18 : 8;
    ctx.strokeStyle = col; ctx.lineWidth = sel ? 1.8 : 1.2;
    ctx.beginPath(); ctx.rect(-r, -r, r * 2, r * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = hexA(col, sel ? .9 : .35);
    ctx.beginPath(); ctx.rect(-r + 2, -r + 2, r * 2 - 4, r * 2 - 4); ctx.fill();
    if (sel) { ctx.strokeStyle = hexA(col, .35); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }

  function hotMark(s, col, sel, h) {
    ctx.save(); ctx.translate(s[0], s[1]);
    const t = performance.now() / 1000;
    const pulse = sel ? 1 : .55 + .45 * (.5 + .5 * Math.sin(t * 2 + h.sev));
    ctx.strokeStyle = hexA(col, .30 * pulse); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, 10 + h.sev * 3, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowColor = hexA(col, .9); ctx.shadowBlur = sel ? 20 : 10;
    ctx.strokeStyle = col; ctx.lineWidth = sel ? 2 : 1.4;
    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
    ctx.restore();
    if (sel || cam.s > 20000) {
      label(s[0], s[1] + 18, CV.nm(h.t), CV.nm(h.st), col, sel ? 1 : .7, 10);
    }
  }

  /* Labels claim a box; anything that would collide with an already-placed
     label is dropped rather than overprinted. Bigger scopes claim first.     */
  let placed = [], drawn = [];
  /* The HUD, the bottom row and the open panels claim their boxes before any
     map label is placed, so nothing on the canvas is ever drawn underneath
     the reading. This is what keeps the text legible now that the map runs to
     within 32px of the viewport edges. */
  const KEEPOUT = ['#hud', '#top', '#bottomGroup', '#rail:not([hidden])', '#feed:not([hidden])'];
  function claimChrome() {
    KEEPOUT.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el || el.hidden) return;
      const r = el.getBoundingClientRect();
      if (r.width > 2 && r.height > 2) placed.push({ x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 });
    });
  }
  /* Assigning ctx.font is the single most expensive operation in the frame:
     the display and mono tokens are long fallback stacks, and Chromium
     re-resolves the whole stack on every assignment (measured at ~0.3ms each,
     which is 24ms of a 36ms frame once a city's districts are on screen).
     Two things follow. Text widths are measured once and remembered — the
     names do not change between frames — and the labels are queued rather
     than drawn, then flushed in font order at the end of the frame, so the
     font is assigned a handful of times instead of once per label. */
  const widths = new Map();
  function widthOf(font, text) {
    const k = font + '\u0000' + text;
    let w = widths.get(k);
    if (w === undefined) { ctx.font = font; w = ctx.measureText(text).width; widths.set(k, w); }
    return w;
  }
  let labelQ = [];
  function label(x, y, main, sub, col, alpha, size) {
    if (x < -140 || x > W + 140 || y < -20 || y > H + 20) return;
    const w = Math.max(widthOf(`600 ${size}px ${FONT_DISP}`, main), sub ? size * 2.6 : 0);
    const h = sub ? size * 2.2 + 4 : size * 1.3;
    const box = { x: x - w / 2 - 3, y: y - 2, w: w + 6, h: h + 4 };
    for (const q of placed) {
      if (box.x < q.x + q.w && box.x + box.w > q.x && box.y < q.y + q.h && box.y + box.h > q.y) return;
    }
    placed.push(box); drawn.push(box);
    labelQ.push({ x, y, main, sub, col, alpha, size });
  }

  /* Every label the frame claimed, painted last and grouped by font. Labels
     never overlap — the box test above guarantees it — so painting them all
     after the map rather than inside each pass changes nothing on screen. */
  function flushLabels() {
    if (!labelQ.length) return;
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const sizes = [...new Set(labelQ.map(l => l.size))].sort((a, b) => b - a);
    for (const size of sizes) {
      let set = false;
      for (const l of labelQ) {
        if (l.size !== size) continue;
        if (!set) { ctx.font = `600 ${size}px ${FONT_DISP}`; set = true; }
        ctx.globalAlpha = l.alpha;
        /* a one-pixel dark backing instead of a blurred shadow: the same
           legibility over a busy map at a fraction of the fill cost */
        ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillText(l.main, l.x + 1, l.y + 1);
        ctx.fillStyle = PAL.ink; ctx.fillText(l.main, l.x, l.y);
      }
    }
    for (const size of sizes) {
      let set = false;
      for (const l of labelQ) {
        if (l.size !== size || !l.sub) continue;
        if (!set) { ctx.font = `600 ${size - 1}px ${FONT_MONO}`; set = true; }
        ctx.globalAlpha = l.alpha;
        ctx.fillStyle = 'rgba(0,0,0,.72)'; ctx.fillText(l.sub, l.x + 1, l.y + l.size + 4);
        ctx.fillStyle = l.col; ctx.fillText(l.sub, l.x, l.y + l.size + 3);
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    labelQ = [];
  }

  /* ---- the captures, on the ground they were taken from ------------------
     The street grid above is generated: it says "there are streets here" over
     ground the dataset has no roads for. This layer is the opposite of that —
     the one piece of the map that is a measurement rather than a drawing. It
     is the street capture's own top-down read, pinned to the rectangle the
     scene register says it covers, so that the capture is a place on the map
     before it is a reading on the stage.

     No warping is needed. The register's bounds are north-up in lon/lat, and
     geo.js is Web Mercator, where a north-up lon/lat rectangle stays an
     axis-aligned screen rectangle — so two projected corners are the whole
     transform. That is also why the register carries bounds and not a mesh.

     It is drawn under the labels and the markers and over the street grid: the
     grid is the invention, the capture is the evidence, and where they overlap
     the evidence is on top.                                                 */
  let sceneDrawn = 0;
  function drawScenes() {
    if (cam.globe || !window.SceneReg) return;
    for (const s of SceneReg.all()) {
      const [w0, s0, e0, n0] = s.bounds;
      if (VB && (e0 < VB.lo0 || w0 > VB.lo1 || n0 < VB.la0 || s0 > VB.la1)) continue;
      const tl = cam.proj(w0, n0), br = cam.proj(e0, s0);
      const w = br[0] - tl[0], h = br[1] - tl[1];
      /* Below a few pixels across there is nothing to see and a 1060px image
         scaled to two would be paid for and wasted. The capture's rectangle is
         293 m across, so six pixels is about fifty metres to the pixel —
         measured at a 1600×900 stage, camZ 8.75, a little above the district
         rung and about three levels short of the street. It fades in over the
         two levels above that rather than appearing. */
      if (!(w > 6 && h > 6)) continue;
      const a = SceneReg.asset(s);
      if (!a.ready) continue;
      const alpha = Math.min(1, (Math.min(w, h) - 6) / 26);
      ctx.save();
      ctx.globalAlpha = alpha;
      /* the capture is lit for daylight and the map is not, so it is drawn
         through `screen` where it would otherwise sit on the plane like a
         sticker; the hovered one is given its own full weight instead */
      ctx.globalCompositeOperation = hotScene === s.id ? 'source-over' : 'screen';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(a.img, tl[0], tl[1], w, h);
      ctx.restore();
      sceneDrawn++;
      /* a hairline round the measured ground, so the edge of the capture is
         legible against the drawn grid even where the splats fade out */
      ctx.save();
      ctx.globalAlpha = alpha * (hotScene === s.id ? .9 : .42);
      ctx.strokeStyle = PAL.sceneEdge;
      ctx.lineWidth = hotScene === s.id ? 1.4 : 1;
      ctx.strokeRect(tl[0] + .5, tl[1] + .5, w - 1, h - 1);
      ctx.restore();
    }
  }

  function drawScale() {
    /* pick a round distance that lands under ~190px at whatever the scale is,
       from a thousand kilometres down to ten metres */
    const mPerPx = 6371000 / cam.s;
    const target = 190 * mPerPx;
    const pow = Math.pow(10, Math.floor(Math.log10(target)));
    const m = [1, 2, 5, 10].map(k => k * pow).filter(v => v <= target).pop() || pow;
    const px = m / mPerPx;
    const p = Portal.rect();
    const x = p.x + 16, y = p.y + p.h - 18;
    ctx.save();
    ctx.strokeStyle = hexA(PAL.gold, .5); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y); ctx.lineTo(x + px, y); ctx.lineTo(x + px, y - 4); ctx.stroke();
    ctx.font = `500 10px ${FONT_MONO}`; ctx.fillStyle = hexA(PAL.gold, .65);
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.direction = 'ltr';
    ctx.fillText(m >= 1000 ? `${Math.round(m / 1000)} km` : `${Math.round(m)} m`, x + 4, y - 5);
    ctx.restore();
  }

  /* ---- interaction ---------------------------------------------------- */
  /* Pointer Events throughout — one code path for mouse, pen and touch.
     On the map the drag pans the camera; on the globe it turns the planet. */
  let drag = null;
  const INPUT = [cvs, document.getElementById('focusVisual')].filter(Boolean);
  const onInput = (type, fn, opts) => INPUT.forEach(el => el.addEventListener(type, fn, opts));

  /* ---- one finger turns it, two fingers zoom it --------------------------
     The wheel is the whole of the second half of this screen's central
     mechanic — out to the void, in through the amanas and the cities to the
     street — and a phone has no wheel. Safari's gesture events are a trackpad
     pinch, not a hand: a touch pinch arrives as two pointers and nothing else.

     So the pointers are kept by id. One is a rotation, exactly as before. Two
     is a pinch, and it reaches the camera through aimZoom() with the same
     log-of-the-ratio the Safari path already uses — never by writing camZ —
     so it crosses the projection seam the way every other gesture does, with
     mercLift() added and taken away, and body[data-cam="move"] still announced
     by the camera itself. Keyed by id because the handler kept one `drag`
     rebuilt on every pointerdown: the second finger of a pinch overwrote the
     rotation origin, and the map spun while the zoom stood still. */
  const pts = new Map();
  let pinch = null;
  const span = () => {
    const [a, b] = [...pts.values()];
    return { d: Math.hypot(a[0] - b[0], a[1] - b[1]),
             m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
  };
  const startDrag = (x, y) => {
    drag = { x, y, cx: cam.cx, cy: cam.cy,
             lon0: GC.lon0, lat0: GC.lat0, globe: cam.globe, moved: drag ? drag.moved : 0 };
  };

  onInput('pointerdown', e => {
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
    if (pts.size === 2) {
      const s = span();
      pinch = { d0: s.d, z0: wheelTo === null ? camZ : wheelTo };
      drag = null;                       /* a pinch is not a very wide rotation */
      return;
    }
    if (pts.size === 1) startDrag(e.clientX, e.clientY);
  });

  onInput('pointermove', e => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pts.size === 2) {
      const s = span();
      if (s.d > 8 && pinch.d0 > 8) {
        wheelTo = null;
        /* the same rate the trackpad path uses, so a pinch of the same size
           travels the same distance whichever device reports it */
        aimZoom(pinch.z0 + Math.log2(s.d / pinch.d0) * 1.6, s.m);
        fly = null; userCam = true;
      }
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
    wheelTo = null;
    if (drag.globe) {
      const k = 180 / Math.max(120, cam.R);         /* one screen radius ≈ 180° */
      cam.setRotation(drag.lon0 - dx * k, drag.lat0 + dy * k);
    } else {
      cam.cx = drag.cx - dx / cam.s; cam.cy = drag.cy - dy / cam.s;
    }
    fly = null; userCam = true; invalidate();
  });
  /* Hovering the globe names what is under the cursor. The regions answer for
     themselves through their own markers; this covers every other country the
     basemap draws, which until now gave no response at all. */
  let hoverName = '';
  onInput('pointermove', e => {
    if (!cam.globe || drag || FM.view !== 'globe') { if (hoverName) { hoverName = ''; POI.hideTip(); } return; }
    if (document.elementFromPoint(e.clientX, e.clientY) !== e.currentTarget &&
        !(e.target && e.target.id === 'world')) { if (hoverName) { hoverName = ''; POI.hideTip(); } return; }
    const f = World.at(e.clientX, e.clientY);
    const n = f ? f.n : '';
    if (n === hoverName) return;
    hoverName = n;
    if (n) POI.tipAt(e.clientX, e.clientY - 6, n); else POI.hideTip();
  });
  onInput('pointerleave', () => { if (hoverName) { hoverName = ''; POI.hideTip(); } });

  /* ---- the capture under the cursor --------------------------------------
     The footprint is the one thing on the map that opens something, so it is
     the one thing that answers the pointer with more than a name. Hovering it
     raises the register's card; clicking it opens the street reading.

     The test is the register's, not this file's: the rectangle rules out the
     Kingdom, and inside it the preview's own alpha decides, so the transparent
     air either side of a street running 38° off the axes does not answer for
     the street. Only while the footprint is actually being drawn — below that
     it is a few pixels and a cursor cannot mean it.                        */
  let hotScene = null, lastPt = null;
  function sceneUnder(px, py) {
    if (cam.globe || !window.SceneReg || !sceneDrawn) return null;
    const c = cam.unproject(px, py);
    if (!c.hit) return null;
    return SceneReg.at(c.lon, c.lat);
  }
  function setHot(id) {
    if (hotScene === id) return;
    hotScene = id;
    if (cvs) cvs.style.cursor = id ? 'pointer' : '';
    invalidate();
  }
  /* What the cursor is over, whether or not the cursor is what moved. A wheel
     is a gesture with no pointer motion in it: hover the footprint, turn the
     wheel out, and the ground under a stationary cursor stops being the
     capture — but nothing had told the card so, and it sat there naming a
     capture that was no longer under it. The map moving is the same event as
     the pointer moving, as far as this question goes, so render() asks it
     again at the end of every frame it painted. */
  function refreshHover() {
    if (!lastPt) return;
    const s = sceneUnder(lastPt[0], lastPt[1]);
    if (!s) { if (hotScene) { setHot(null); SceneCard.hide(); } return; }
    if (hotScene !== s.id) { setHot(s.id); SceneCard.at(lastPt[0], lastPt[1], s); }
  }
  onInput('pointermove', e => {
    lastPt = [e.clientX, e.clientY];
    if (drag) { if (hotScene) { setHot(null); SceneCard.hide(); } return; }
    const s = sceneUnder(e.clientX, e.clientY);
    if (!s) { if (hotScene) { setHot(null); SceneCard.hide(); } return; }
    setHot(s.id);
    SceneCard.at(e.clientX, e.clientY, s);
  });
  onInput('pointerleave', () => {
    lastPt = null;
    if (hotScene) { setHot(null); SceneCard.hide(); }
  });

  const endDrag = e => {
    pts.delete(e.pointerId);
    /* Lifting one finger of a pinch is not a tap, and what is left is not a
       drag that started where the remaining finger is now: the rotation is
       re-based off it so the map does not jump by the width of the pinch. */
    if (pinch) {
      if (pts.size === 1) { const [p] = [...pts.values()]; startDrag(p[0], p[1]); drag.moved = 99; }
      if (pts.size < 2) pinch = null;
      return;
    }
    const wasDrag = drag && drag.moved > 4; drag = null;
    /* the capture latch stood down for the length of the gesture; this is the
       frame that reads where the pan actually ended up */
    if (wasDrag) { invalidate(); return; }
    /* the capture is picked before anything under it: it is the only mark on
       the map that is a photograph of the ground rather than a claim about it */
    const s = sceneUnder(e.clientX, e.clientY);
    if (s) { setHot(null); SceneCard.hide(); FM.emit('scene:open', s); return; }
    pick(e.clientX, e.clientY);
  };
  onInput('pointerup', endDrag);
  onInput('pointercancel', e => { pts.delete(e.pointerId); drag = null; if (pts.size < 2) pinch = null; });
  /* True while the wheel is carrying the camera across the projection change.
     The view listener does a great deal on a deliberate jump — plants the
     camera, flies it in, dissolves the frame before — and none of that belongs
     to a gesture that is already continuous on both sides of the seam. */
  let smoothCross = false;
  /* A wheel event moves a *target*, and the camera eases toward it over the
     following frames, always keeping the point under the cursor fixed. Notches
     that arrive together add up instead of fighting each other, and a
     trackpad's stream of small deltas reads as one continuous movement.

     Three gestures reach this handler, and they are not the same gesture.

     A **two-finger pinch** on a trackpad arrives as a wheel event with ctrlKey
     set — that is how every browser reports it — and it carries roughly a
     fifth of the delta a scroll does for the same movement of the hand. Given
     the scroll rate it barely moves at all, which is exactly what it did here.
     It gets the largest rate of the three.

     A **mouse notch** is a decision, and there are only a handful of them in a
     scroll: a notch is worth 1.7 zoom levels, more than the one level Google
     and Apple give it, which puts the planet seven notches from a street.

     A **two-finger scroll** is a stream of dozens of small deltas for the same
     flick of the hand, so per event it gets a little less — but only a little,
     because the difference between the two devices is granularity, not
     distance, and the totals come out close either way. Which is the point:
     the two are told apart by the size of the delta alone, and since the rates
     are within a seventh of each other, a hard scroll misread as a notch (or a
     spun wheel misread as a scroll) costs nothing worth a cleverer test.
     Everything is normalised first, because Firefox reports lines rather than
     pixels and without that the wheel there was forty times too slow. */
  const PINCH_RATE = 1 / 22;           /* levels per unit of a pinch           */
  const WHEEL_RATE = 1 / 70;           /* … of a mouse notch                   */
  const TRACK_RATE = 1 / 80;           /* … of a two-finger scroll             */
  const NOTCH = 40;                    /* px; above this it is a mouse notch   */
  const ZOOM_TAU = 16;                 /* ms; how quickly the camera closes in */
  const wheelPx = (e) =>
    e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
  let wheelTo = null, wheelAnchor = null, wheelAt = 0;

  /* Move the zoom target, carrying the camera across the projection change if
     the move passes it. Shared by the wheel, the pinch and Safari's own
     gesture events, so all three cross the seam the same way. */
  function aimZoom(z, anchor) {
    let target = z;
    if (cam.globe && z >= Z_FLAT) {
      smoothCross = true; FM.setView('map'); smoothCross = false; cam.globe = false;
      target = z + mercLift(); camZ += mercLift();
    } else if (!cam.globe && z < flatZ()) {
      smoothCross = true; FM.setView('globe'); smoothCross = false; cam.globe = true;
      target = z - mercLift(); camZ -= mercLift();
    }
    wheelTo = Math.max(Z_AWAY, Math.min(Z_MAX, target));
    wheelAnchor = anchor;
    if (wheelAt === 0 || performance.now() - wheelAt > 200) wheelAt = performance.now();
    invalidate();
  }

  function stepWheelZoom(now) {
    if (wheelTo === null) return;
    const dt = Math.max(1, Math.min(64, now - wheelAt));
    wheelAt = now;
    const k = 1 - Math.exp(-dt / ZOOM_TAU);
    const next = camZ + (wheelTo - camZ) * k;
    /* the tail of an exponential is sub-pixel and costs a dozen frames: land
       the last hundredth rather than easing through it */
    if (Math.abs(wheelTo - camZ) < .01) {
      applyZoom(wheelTo, wheelAnchor);
      wheelTo = null; wheelAnchor = null;
      return;
    }
    applyZoom(next, wheelAnchor);
    dirty = true;
  }

  onInput('wheel', e => {
    e.preventDefault();
    const px = wheelPx(e);
    const rate = e.ctrlKey ? PINCH_RATE
               : Math.abs(px) >= NOTCH ? WHEEL_RATE : TRACK_RATE;
    /* accumulate onto wherever the camera is *heading*, not onto where it has
       got to — otherwise a fast scroll throws away every notch but the last */
    const from = wheelTo === null ? camZ : wheelTo;
    aimZoom(from - px * rate, [e.clientX, e.clientY]);
  }, { passive: false });

  /* Safari reports a trackpad pinch as its own gesture events rather than as a
     ctrl-wheel, and `scale` is a ratio, not a delta — so the zoom moves by its
     log. Chrome and Firefox never fire these, so nothing is handled twice. */
  let gScale = 0;
  onInput('gesturestart', e => { e.preventDefault(); gScale = e.scale || 1; wheelTo = null; });
  onInput('gesturechange', e => {
    e.preventDefault();
    const sc = Math.max(.05, e.scale || 1);
    if (!gScale) { gScale = sc; return; }
    const dz = Math.log2(sc / gScale) * 1.6;
    gScale = sc;
    const from = wheelTo === null ? camZ : wheelTo;
    aimZoom(from + dz, [e.clientX || cam.vx, e.clientY || cam.vy]);
  });
  onInput('gestureend', e => { e.preventDefault(); gScale = 0; });

  function pick(px, py) {
    const w = cam.toWorld(px, py);
    /* markers first: they sit on top */
    let best = null, bd = 1e9;
    for (const h of hits) {
      if (!h.px) continue;
      const d = Math.hypot(h.px[0] - px, h.px[1] - py);
      if (d < h.r && d < bd) { bd = d; best = h; }
    }
    if (!best) {
      for (let i = hits.length - 1; i >= 0; i--) {
        const h = hits[i];
        if (!h.geom) continue;
        const inside = cam.globe ? GEO.inScreen(h.geom, cam, px, py) : GEO.inRings(GEO.rings(h.geom), w);
        if (inside) { best = h; break; }
      }
    }
    if (!best) return;
    if (best.kind === 'case') { Drawers.openCase(best.id); return; }
    if (best.kind === 'hot') { FM.setScope(best.id.split('#')[0], best.id); Drawers.openHotspot(best.id); return; }
    /* One gesture, every division: the first click selects a unit and flies to
       it, the second one — on the unit already selected — opens its Events →
       Insights → Actions canvas. The Kingdom answers this the way a district
       does, which is the symmetry the review asked for: on the country division
       the body of the Kingdom is the Kingdom, so a click on it opens the
       Kingdom's own canvas rather than dropping into whichever region the
       cursor happened to land on. The regions have their own markers. */
    Nav.pickUnit(FM.scale === 'country' ? 'KSA' : best.id);
  }

  /* ---- when to paint at all -------------------------------------------
     The map used to repaint on every animation frame whether or not anything
     had changed. On a still screen — which is most of a demo — that is a full
     canvas of work sixty times a second for an identical picture, and it is
     what makes a laptop hot. Nothing paints now unless something actually
     moved: a camera gesture, a flight, a change of scope, KPI, time, language
     or view, a resize, or the one thing on the planet that genuinely animates.
     Everything that can change the picture calls invalidate(). */
  let dirty = true, orbitAt = 0, lastSource = '';
  /* camera-motion state — see tick() */
  let camSig = '', movedAt = 0, moving = false;
  const invalidate = () => { dirty = true; };

  /* The sphere and the plane are different projections, so moving between them
     is the one place the picture cannot simply tween — the frame before and
     the frame after have nothing in common. Rather than cut, the outgoing
     frame is held as an image and dissolved over the incoming one while the
     camera eases in behind it. Nothing half-projected is ever shown. */
  let fade = null, handoverUntil = 0, handoverTimer = 0;
  /* Long enough to be followed by eye, and long enough that the frames the
     machine can actually draw during it add up to a movement rather than a
     handful of steps — measured at 21 frames over 640ms under load, which is
     the difference between a transition and a stutter. */
  const HANDOVER = 540;
  function crossFade(dur) {
    const d = dur || HANDOVER;
    handoverUntil = performance.now() + d;
    document.body.classList.add('handover');
    clearTimeout(handoverTimer);
    handoverTimer = setTimeout(() => { document.body.classList.remove('handover'); invalidate(); }, d + 40);
    if (!cvs.width || !cvs.height) return;
    /* half resolution: it is dissolving, and a quarter of the pixels to push
       is a quarter of the cost on every frame of the move */
    /* A quarter of the width and a quarter of the height: it is dissolving, and
       a sixteenth of the pixels to push is a sixteenth of the cost on every
       frame of the move. */
    const o = document.createElement('canvas');
    o.width = Math.max(1, cvs.width >> 2); o.height = Math.max(1, cvs.height >> 2);
    o.getContext('2d').drawImage(cvs, 0, 0, o.width, o.height);
    fade = { img: o, t0: performance.now(), dur: d };
    invalidate();
  }
  /* The map is normally pinned at the Kingdom fit — there is no zooming out
     past it (T17). While a handover is dissolving, the floor is relaxed by a
     little so the camera has somewhere to ease in from: the view arrives
     rather than appearing, and the floor is back before the reader can act. */
  /* The plane's floor is the crossing itself: below Z_FLAT the sphere is the
     truer picture and the wheel hands back to it. A flight still relaxes the
     floor a little so it has somewhere to ease in from. */
  const zFloor = () => (performance.now() < handoverUntil ? flatZ() - .45 : flatZ());
  function paintFade() {
    if (!fade) return;
    const t = Math.min(1, (performance.now() - fade.t0) / fade.dur);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = Math.max(0, 1 - (1 - Math.pow(1 - t, 3)));
    ctx.drawImage(fade.img, 0, 0, cvs.width, cvs.height);
    ctx.restore();
    if (t >= 1) fade = null; else dirty = true;
  }

  /* ---- lifecycle ------------------------------------------------------ */
  /* The backing store is the single largest cost of a moving map: at a retina
     ratio the renderer fills 3200x1800 device pixels a frame, and turning the
     planet measured 28.7ms a frame against 7.6ms at 1x. So the camera renders
     at a lower ratio WHILE IT MOVES and at the full one 180ms after it stops —
     the same bargain every map library makes, and the movement is what hides
     the softness. Nothing else changes: the layout, the projection and the
     label placement are all in CSS pixels. */
  /* On a 1x display the bargain does not exist: DPR_MOVE collapses onto
     DPR_STILL, there is no resolution to give up, and the two resize() calls
     that bracket every gesture were changing nothing. Assigning canvas.width
     reallocates and zero-fills the backing store even when the value is the
     one it already holds — 8.3 MB at 1920×1080, twice per wheel zoom and twice
     per drag, for a ratio that cannot move. So the work is guarded on an
     actual change. The implicit clear is not relied on: render() lays the
     background gradient over the full viewport before anything else. */
  const DPR_STILL = () => Math.min(2, devicePixelRatio || 1);
  const DPR_MOVE = () => Math.min(1.25, DPR_STILL());
  function resize() {
    const d = moving ? DPR_MOVE() : DPR_STILL();
    if (d === DPR && innerWidth === W && innerHeight === H) { invalidate(); return; }
    DPR = d; W = innerWidth; H = innerHeight;
    cvs.width = W * DPR; cvs.height = H * DPR;
    cvs.style.width = W + 'px'; cvs.style.height = H + 'px';
    invalidate();
  }

  /* A window dragged onto a monitor of another density, or a browser zoom,
     changes devicePixelRatio without necessarily changing innerWidth — and the
     resize event is the only thing this module listened to. The canvas was
     then left at the old ratio: soft on the way to retina, and needlessly
     heavy on the way back. A resolution query is the event for it, and it has
     to be re-armed after each change because the query names the old ratio. */
  let dprMQ = null;
  function watchDPR() {
    if (!window.matchMedia) return;
    if (dprMQ && dprMQ.removeEventListener) dprMQ.removeEventListener('change', onDPRChange);
    dprMQ = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    if (dprMQ.addEventListener) dprMQ.addEventListener('change', onDPRChange, { once: true });
  }
  function onDPRChange() {
    shellKey = '';                 /* the baked sky and glass are the old size */
    resize();
    watchDPR();
  }

  const MapView = {
    cam, flyTo, snapTo, zoomTo, world: World,
    zoom: () => camZ,
    regionPaint: () => ({ ...PAINT }),
    /* every label box the renderer actually painted last frame — the harness
       uses it to prove nothing is drawn underneath the HUD */
    labelBoxes: () => drawn.map(b => ({ ...b })),
    /* Same as zoomTo: a pending wheel target is dropped, or the next frame's
       applyZoom re-anchors the camera on the cursor and undoes the centring. */
    centreOn(lat, lon) {
      userCam = true; fly = null; wheelTo = null; wheelAnchor = null; invalidate();
      cam.cx = lon * D2R; cam.cy = GEO.pt(0, lat)[1];
      cam.setRotation(lon, lat);
    },
    setZoom: (z, dur) => zoomTo(z, dur),
    zoomBounds: () => ({ min: mapMinZ(), max: Z_MAX, flat: Z_FLAT, street: Z_STREET }),
    isStreetLevel: () => camZ >= Z_STREET,
    /* ---- the captures on the map ---------------------------------------
       Asked by the shell rather than by the map: whether the camera has come
       down over ground a capture was taken from is what decides whether the
       wheel opens the street reading, and that decision belongs to the
       reading, not to the renderer. The camera's question is the rectangle's
       (`boxAt`), not the preview's alpha — arriving a few metres off the kerb
       is still arriving at the capture; the cursor's question is the alpha's,
       because a click is a claim about one pixel. */
    sceneUnderCamera: () => {
      if (cam.globe || !window.SceneReg) return null;
      const c = cam.unproject(cam.vx, cam.vy);
      return c.hit ? SceneReg.boxAt(c.lon, c.lat) : null;
    },
    sceneUnder: (px, py) => sceneUnder(px, py),
    /* how many capture footprints the last frame actually painted */
    scenesDrawn: () => sceneDrawn,
    hotScene: () => hotScene,

    /* true when the street layer on screen is the generated grid rather than a
       surveyed network — the disclosure follows this, not the zoom */
    streetsGenerated: () => gridDrawn,
    usesOSM: () => osmDrawn,
    /* true when the district shapes on screen are cells built from the
       dataset's own centres rather than surveyed boundaries */
    cellsGenerated: () => !cam.globe && FM.level() >= 2 && cellsAreGenerated(),
    streetCount: () => streetSegs,
    setRotation: (lo, la) => cam.setRotation(lo, la),
    getRotation: () => ({ lon0: GC.lon0, lat0: GC.lat0 }),
    renderNow: () => render(),
    dpr: () => DPR,
    init() {
      readPalette(); resize(); watchDPR(); buildWorld();
      snapTo(GEO.KSA);
      camZ = 0; userCam = true;                 /* the prototype opens on the planet */
      /* A scope change normally flies the camera to the new bounds. During a
         projection handover it must not: the handover already owns the camera
         for a fixed duration, and a second flight on top of it ran 880ms
         against the handover's 640ms — which is why leaving the planet and
         returning to it took visibly different lengths of time. */
      FM.on('scope', () => {
        if (syncingScope || performance.now() < handoverUntil) return;
        flyTo(GEO.boundsFor(FM.unit(), FM.hotspot()));
      });
      FM.on('lang', () => { widths.clear(); invalidate(); });
      FM.on('view', v => {
        invalidate();
        if (smoothCross) return;      /* the wheel is already carrying it across */
        const wasGlobe = cam.globe;
        if (v === 'globe') {
          cam.homeRotation(); userCam = true; fly = null;
          if (!wasGlobe && FM.booted) {
            /* The same move, run backwards. It used to be a cut: the camera was
               planted at the planet the instant the view changed, so only the
               dissolve moved and the eye read it as a jump. The sphere now
               arrives slightly large and settles into the aperture over the
               same duration and the same curve as the way out — and the
               dissolve covers the moment it is widest. */
            crossFade();
            camZ = 0.22;
            zoomTo(0, HANDOVER);
          } else {
            camZ = 0;
          }
          return;
        }
        if (v === 'map' && camZ < mapMinZ()) {
          /* start a touch wider than the fit and let the flight close the gap:
             the view arrives instead of appearing */
          if (wasGlobe && FM.booted) crossFade();
          camZ = mapMinZ() - (wasGlobe && FM.booted ? .34 : 0);
          userCam = true;
        }
      });
      ['kpi', 'time', 'hot', 'mode', 'zoom', 'scale'].forEach(ev => FM.on(ev, invalidate));
      addEventListener('resize', () => { resize(); });
    },
    tick(now) {
      /* Whether the camera is moving right now. Everything expensive that sits
         OVER the map — the backdrop blur around the aperture, and the blur
         behind every panel — is re-rasterised by the compositor on every frame
         in which the pixels underneath it change, which is every frame of a
         drag. Measured on this machine: turning the planet costs 88ms a frame
         with those blurs live and 35ms without them, and nobody can read a
         blurred periphery mid-gesture anyway. So they step aside while the
         camera moves and come back 180ms after it stops — the same trade
         `body.handover` already makes for the length of a projection change,
         widened to every camera movement.

         Derived from the camera itself rather than from the gestures, so there
         is one place that decides it and no way for a new way of moving the
         map to forget to announce itself. */
      const sig = (cam.cx * 1e4 | 0) + ',' + (cam.cy * 1e4 | 0) + ',' + (camZ * 1e3 | 0) + ',' +
                  (GC.lon0 * 1e3 | 0) + ',' + (GC.lat0 * 1e3 | 0) + ',' + (cam.R | 0);
      if (sig !== camSig) {
        camSig = sig; movedAt = now;
        if (!moving) { moving = true; document.body.dataset.cam = 'move'; resize(); }
      } else if (moving && now - movedAt > 180) {
        moving = false; document.body.dataset.cam = '';
        resize();                         /* full resolution, and one clean
                                             frame under the blur */
      }

      stepWheelZoom(now);
      if (fly) {
        dirty = true;
        const t = Math.min(1, (now - fly.t0) / fly.dur), e = easeIO(t);
        if (fly.zoomOnly) {
          camZ = fly.fz + (fly.tz - fly.fz) * e;
        } else {
          cam.cx = fly.fx + (bounds.cx - fly.fx) * e;
          cam.cy = fly.fy + (bounds.cy - fly.fy) * e;
          camZ = fly.fz + (zoomOf(fitFor(bounds)) - fly.fz) * e;
        }
        if (t >= 1) { if (fly.zoomOnly) userCam = true; fly = null; }
      } else if (!userCam) {
        /* the aperture is still morphing, or the window was resized: stay fitted */
        const tz = zoomOf(fitFor(bounds));
        if (Math.abs(tz - camZ) > .004) { camZ += (tz - camZ) * .35; cam.cx = bounds.cx; cam.cy = bounds.cy; dirty = true; }
      }
      syncScopeToView(now);
      if (performance.now() < handoverUntil) dirty = true;
      /* The marker travels on its own sheet, at its own cadence, and asks the
         planet for nothing. It is redrawn with the planet as well, so that a
         drag carries the ring rather than dragging it behind. */
      if (now - orbitAt > 45) { orbitAt = now; drawOrbit(); }
      else if (dirty) drawOrbit();
      if (!dirty) return false;
      dirty = false;
      render();
      /* the reading names its source, so it hears about a change of source —
         after the frame that made it, never before */
      const src = (osmDrawn ? 'o' : '') + (gridDrawn ? 'g' : '') + (cellDrawn ? 'c' : '');
      if (src !== lastSource) { lastSource = src; FM.emit('zoom', camZ); }
      return true;
    },
    invalidate,
    /* The planet is not always on screen. A reading that covers it — the
       environment photograph — has no use for a marker crossing a ring behind
       it, so the screen says so and the sheet goes quiet. */
    decor(on) { decor = !!on; if (!decor) wipeOrbit(); },
    isDirty: () => dirty,
    /* re-centre after a language flip or an aperture change — but never
       against a zoom the user (or a preset) asked for */
    refit() { if (!userCam) flyTo(GEO.boundsFor(FM.unit(), FM.hotspot()), 500); },
  };
  window.MapView = MapView;
})();
