/* map.pin — where this is. The base reading; every subject has one. */
(function () {
  Lenses.def({
    id: 'map.pin',
    label: 'lens_map_pin',
    needs: s => Array.isArray(s.ll) && s.ll.length === 2,
    mount(host, s) {
      const m = LensMap.mount(host, s, { zoom: s.zoom });
      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap';
      const u = s.scope.unit;
      cap.innerHTML =
        '<span class="mono lbl">' + LVF.esc(LVT('lens_map_pin')) + '</span>' +
        '<b>' + LVF.esc(u ? CV.nm(u) : CV.nm(s.scope.amana)) + '</b>' +
        '<span class="mono micro">' + s.ll[0].toFixed(4) + ', ' + s.ll[1].toFixed(4) + '</span>';
      host.appendChild(cap);
      return { destroy() { m.destroy(); } };
    },
  });
})();
