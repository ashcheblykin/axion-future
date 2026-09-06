/* street — the ground at street grain, with the way the subject sits on named.
   The name comes from OpenStreetMap where the geometry does, or from the
   subject's own street where the source gives it one. */
(function () {
  Lenses.def({
    id: 'street',
    label: 'lens_street',
    needs: s => LensMap.hasRoads(LensMap.cityOf(s)),
    mount(host, s) {
      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap';
      const zoom = Math.min(16.6, Math.max(14.6, s.zoom + 1.8));
      let named = null;

      const m = LensMap.mount(host, s, {
        zoom,
        layer(g, cam, ctx) {
          if (!ctx.ways) return;
          if (!named) named = LensMap.nearestNamed(ctx.ways, s.ll);
          if (!named) return;
          /* the way the subject is on, drawn over the rest */
          g.beginPath();
          named.pts.forEach((p, i) => { const q = cam.lonlat(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
          g.strokeStyle = ctx.tok('--gold');
          g.globalAlpha = .85;
          g.lineWidth = LensMap.roadW(named.cls) + 2.4;
          g.lineCap = 'round'; g.lineJoin = 'round';
          g.stroke();
          g.globalAlpha = 1;
        },
        onFrame() {
          const label = (s.scope.street && CV.nm(s.scope.street))
            || (named && (CV.LANG === 'ar' ? (named.ar || named.en) : (named.en || named.ar)))
            || '';
          const want = LVF.esc(label);
          if (cap.dataset.name === want) return;
          cap.dataset.name = want;
          cap.innerHTML =
            '<span class="mono lbl">' + LVF.esc(LVT('lens_street')) + '</span>' +
            '<b>' + want + '</b>' +
            '<span class="mono micro">© OpenStreetMap · z' + zoom.toFixed(1) + '</span>';
        },
      });
      host.appendChild(cap);
      return { destroy() { m.destroy(); } };
    },
  });
})();
