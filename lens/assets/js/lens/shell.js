/* =============================================================================
   shell.js — the identity strip, and the frame that holds the rest.
   Everything above the stage answers one question: what am I looking at, and
   how do I know. The data path is printed so any figure can be traced live.
   ============================================================================= */
(function () {
  const esc = LVF.esc;

  function render(s) {
    const head = document.getElementById('lensHead');
    const bits = [];
    if (s.scope.amana && (s.scope.amana.ar || s.scope.amana.en)) bits.push(esc(CV.nm(s.scope.amana)));
    if (s.category && (s.category.ar || s.category.en)) bits.push(esc(CV.nm(s.category)));
    if (s.object) bits.push(esc(CV.nm(s.object.name)) + (s.object.licence ? ' · ' + esc(CV.T('mn_lic')) + ' ' + esc(s.object.licence) : ''));
    if (s.source) {
      bits.push(s.source.url
        ? '<a href="' + esc(s.source.url) + '" target="_blank" rel="noopener">' + esc(CV.nm(s.source.label)) + ' ↗</a>'
        : esc(CV.nm(s.source.label)));
    }

    head.innerHTML =
      '<div class="id">' +
      '<div class="id-top">' +
      '<span class="sev" style="--sc:' + LVF.bandVar(s.sev) + '">' + esc(CV.T(CV.bandKey[Math.min(4, s.sev)])) + '</span>' +
      '<span class="mono lbl kick">' + esc(s.kicker) + '</span>' +
      '<span class="mono micro trace">' + esc(LVT('trace')) + ' ' + esc(s.trace) + '</span>' +
      '</div>' +
      '<h1>' + esc(CV.nm(s.title)) + '</h1>' +
      '<p class="sub">' + bits.join('<span class="dot">·</span>') + '</p>' +
      '</div>' +
      '<button class="close" id="lensX" aria-label="' + esc(LVT('lens_close')) + '">✕</button>';

    document.getElementById('lensX').onclick = () => LV.close();
  }

  window.Shell = { render };
})();
