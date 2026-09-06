/* =============================================================================
   scene — the object seen from three quarters.

   The dataset carries no 3D and no ground imagery, so this is built from the
   same OpenStreetMap road geometry: the carriageways are laid on a ground plane,
   masses are raised either side of the wider ones, and the camera holds a fixed
   tilt with a slow yaw. It is labelled on screen as an illustrative
   reconstruction, because that is what it is — the mechanic of a scene lens,
   shown honestly, not a survey.

   When the product has its own 3DGS scene, this lens is the slot it drops into:
   same id, same place in the series, real geometry instead of this.
   ============================================================================= */
(function () {
  const TILT = 0.46;            /* how far the ground plane is laid down    */
  const YAW_MS = 72000;         /* one slow turn, so the depth reads        */
  const SPAN = 0.014;           /* degrees of ground either side of the pin */

  Lenses.def({
    id: 'scene',
    label: 'lens_scene',
    needs: s => LensMap.hasRoads(LensMap.cityOf(s)),
    mount(host, s) {
      const cv = document.createElement('canvas');
      cv.className = 'lv-map';
      host.appendChild(cv);

      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap';
      cap.innerHTML =
        '<span class="mono lbl">' + LVF.esc(LVT('lens_scene')) + '</span>' +
        '<b>' + LVF.esc(CV.nm(s.title)) + '</b>' +
        '<span class="mono micro warn">' +
        LVF.esc(LV.lang === 'ar' ? 'إعادة بناء توضيحية من هندسة الطرق' : 'Illustrative reconstruction from road geometry') +
        '</span>';
      host.appendChild(cap);

      const city = LensMap.cityOf(s);
      let raf = 0, dead = false, masses = null, ways = null;

      /* the masses are derived once: the same street produces the same blocks
         on every load, because everything is keyed off the way's own name */
      function build(list) {
        const out = [];
        list.forEach((w, wi) => {
          if (LensMap.roadW(w.cls) < 2.4) return;
          const seed = CV.h32((w.en || w.ar || 'w') + wi);
          for (let i = 1; i < w.pts.length - 1; i += 2) {
            const a = w.pts[i - 1], b = w.pts[i + 1];
            const dx = b[0] - a[0], dy = b[1] - a[1];
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len, ny = dx / len;               /* road normal */
            for (const side of [-1, 1]) {
              const f = ((seed + i * 7919 + (side > 0 ? 331 : 0)) % 1000) / 1000;
              if (f < .34) continue;                            /* leave gaps */
              const off = (0.00016 + f * 0.00042) * side;
              out.push({
                lon: w.pts[i][0] + nx * off,
                lat: w.pts[i][1] + ny * off,
                h: 10 + f * 52,
                w: 5 + f * 7,
              });
            }
          }
        });
        return out;
      }

      function frame() {
        if (dead || !cv.isConnected) return;
        const css = getComputedStyle(document.documentElement);
        const tok = n => css.getPropertyValue(n).trim();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = cv.clientWidth, h = cv.clientHeight;
        if (w && h) {
          cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
          const g = cv.getContext('2d');
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.fillStyle = tok('--bg-void'); g.fillRect(0, 0, w, h);

          if (!ways) {
            const r = LensMap.roads(city, () => {});
            if (r) {
              ways = r.filter(x => Math.abs(x.pts[0][0] - s.ll[1]) < SPAN * 1.6
                                && Math.abs(x.pts[0][1] - s.ll[0]) < SPAN * 1.2);
              masses = build(ways);
            }
          }

          const yaw = (performance.now() % YAW_MS) / YAW_MS * Math.PI * 2;
          const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw);
          const scale = Math.min(w, h / TILT) / (SPAN * 2.4);
          const ox = w / 2, oy = h * 0.60;

          /* ground point → screen. Longitude is squeezed by latitude so the
             ground keeps its proportions this far north. */
          const kx = Math.cos(s.ll[0] * Math.PI / 180);
          function G(lon, lat) {
            const dx = (lon - s.ll[1]) * kx, dy = (lat - s.ll[0]);
            const rx = dx * cy_ - dy * sy_, ry = dx * sy_ + dy * cy_;
            return [ox + rx * scale, oy - ry * scale * TILT];
          }

          /* ground plane */
          g.strokeStyle = tok('--grid'); g.lineWidth = 1;
          const N = 14;
          for (let i = -N; i <= N; i++) {
            const t = (i / N) * SPAN;
            let p = G(s.ll[1] - SPAN, s.ll[0] + t), q = G(s.ll[1] + SPAN, s.ll[0] + t);
            g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
            p = G(s.ll[1] + t, s.ll[0] - SPAN); q = G(s.ll[1] + t, s.ll[0] + SPAN);
            g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
          }

          /* carriageways */
          if (ways) {
            g.lineCap = 'round'; g.lineJoin = 'round';
            ways.forEach(way => {
              g.beginPath();
              way.pts.forEach((p, i) => { const q = G(p[0], p[1]); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
              g.strokeStyle = tok('--basemap-coast');
              g.globalAlpha = .34 + Math.min(.4, LensMap.roadW(way.cls) * .09);
              g.lineWidth = LensMap.roadW(way.cls) * 1.8;
              g.stroke();
            });
            g.globalAlpha = 1;
          }

          /* masses, painted back to front */
          if (masses) {
            const drawn = masses.map(m => ({ m, p: G(m.lon, m.lat) }))
              .filter(x => x.p[0] > -60 && x.p[0] < w + 60 && x.p[1] > -60 && x.p[1] < h + 60)
              .sort((a, b) => a.p[1] - b.p[1]);
            drawn.forEach(({ m, p }) => {
              const bw = m.w, bh = m.h;
              g.fillStyle = tok('--scene-mass');
              g.fillRect(p[0] - bw / 2, p[1] - bh, bw, bh);
              g.fillStyle = tok('--scene-top');
              g.beginPath();
              g.moveTo(p[0] - bw / 2, p[1] - bh);
              g.lineTo(p[0] - bw / 2 + bw * .34, p[1] - bh - bw * .34 * TILT);
              g.lineTo(p[0] + bw / 2 + bw * .34, p[1] - bh - bw * .34 * TILT);
              g.lineTo(p[0] + bw / 2, p[1] - bh);
              g.closePath(); g.fill();
            });
          }

          /* the subject: a ground ring and a mast, so it reads as standing on
             the plane rather than floating over it */
          const q = G(s.ll[1], s.ll[0]);
          const col = tok('--band-' + Math.max(0, Math.min(4, s.sev)));
          const t = (performance.now() % 2400) / 2400;
          g.save();
          g.translate(q[0], q[1]); g.scale(1, TILT);
          g.beginPath(); g.arc(0, 0, 10 + t * 46, 0, Math.PI * 2);
          g.strokeStyle = col; g.globalAlpha = (1 - t) * .7; g.lineWidth = 2 / TILT; g.stroke();
          g.globalAlpha = 1;
          g.beginPath(); g.arc(0, 0, 7, 0, Math.PI * 2);
          g.strokeStyle = col; g.lineWidth = 1.5 / TILT; g.stroke();
          g.restore();

          g.strokeStyle = col; g.lineWidth = 1.5;
          g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[0], q[1] - 84); g.stroke();
          g.beginPath(); g.arc(q[0], q[1] - 84, 4.5, 0, Math.PI * 2);
          g.fillStyle = col; g.fill();

          g.fillStyle = tok('--ink-faint');
          g.font = '10px ' + tok('--font-mono');
          g.textAlign = 'right'; g.direction = 'ltr';
          g.fillText('© OpenStreetMap contributors', w - 12, h - 12);
        }
        raf = requestAnimationFrame(frame);
      }
      frame();
      return { destroy() { dead = true; cancelAnimationFrame(raf); } };
    },
  });
})();
