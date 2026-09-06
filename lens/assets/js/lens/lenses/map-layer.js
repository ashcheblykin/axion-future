/* map.layer — the same point, read a second way.
   Which reading depends on the problem: a road case wants to know how recently
   this ground was surveyed; a cleanliness or visual-pollution case wants to know
   where the complaints sit. The first is illustrative and says so; the second is
   the source's own cxCount. */
(function () {
  const REAL = { vis: 1, waste: 1, svc: 1 };

  function complaintLayer(s) {
    const city = LensMap.cityOf(s);
    const kids = city ? CV.kidsOf(city) : [];
    const pts = kids.map(u => ({ ll: u.c, n: CV.cxCount(u.id), name: CV.nm(u) })).filter(p => p.ll);
    const max = pts.reduce((a, b) => Math.max(a, b.n), 1);
    return (g, cam, ctx) => {
      pts.forEach(p => {
        const q = cam.pt(p.ll);
        if (q[0] < -80 || q[0] > ctx.w + 80 || q[1] < -80 || q[1] > ctx.h + 80) return;
        const r = 8 + Math.sqrt(p.n / max) * 34;
        const grd = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], r);
        grd.addColorStop(0, 'rgba(' + ctx.tok('--layer-cx') + ',.34)');
        grd.addColorStop(1, 'rgba(' + ctx.tok('--layer-cx') + ',0)');
        g.fillStyle = grd;
        g.beginPath(); g.arc(q[0], q[1], r, 0, Math.PI * 2); g.fill();
      });
    };
  }

  /* Survey passes: the dataset has no traffic or capture-frequency layer, so this
     is drawn from the road geometry itself and is labelled on screen as
     illustrative. It is a demonstration of the mechanic, not a measurement. */
  function surveyLayer() {
    return (g, cam, ctx) => {
      if (!ctx.ways) return;
      const named = ctx.ways.filter(w => LensMap.roadW(w.cls) >= 1.7);
      named.forEach((w, wi) => {
        const seed = CV.h32(w.en || w.ar || String(wi));
        for (let i = 0; i < w.pts.length; i += 3) {
          const q = cam.lonlat(w.pts[i]);
          if (q[0] < 0 || q[0] > ctx.w || q[1] < 0 || q[1] > ctx.h) continue;
          const f = ((seed + i * 7919) % 100) / 100;
          g.globalAlpha = .18 + f * .55;
          g.fillStyle = ctx.tok(f > .66 ? '--gold-hi' : f > .33 ? '--gold' : '--gold-deep');
          g.beginPath(); g.arc(q[0], q[1], 1.6 + f * 2.2, 0, Math.PI * 2); g.fill();
        }
      });
      g.globalAlpha = 1;
    };
  }

  Lenses.def({
    id: 'map.layer',
    label: 'lens_map_layer',
    needs: s => Array.isArray(s.ll) && !!LensMap.cityOf(s),
    mount(host, s) {
      const real = !!REAL[s.domain];
      const m = LensMap.mount(host, s, {
        zoom: Math.max(10.5, s.zoom - 1.2),
        layer: real ? complaintLayer(s) : surveyLayer(),
      });
      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap';
      cap.innerHTML =
        '<span class="mono lbl">' + LVF.esc(LVT('lens_map_layer')) + '</span>' +
        '<b>' + LVF.esc(real ? CV.T('in_cx') : (LV.lang === 'ar' ? 'مرات المسح وحداثة التصوير' : 'Survey passes and capture freshness')) + '</b>' +
        (real
          ? '<span class="mono micro">SEED · cxCount</span>'
          : '<span class="mono micro warn">' + LVF.esc(LVT('illustrative')) + '</span>');
      host.appendChild(cap);
      return { destroy() { m.destroy(); } };
    },
  });
})();
