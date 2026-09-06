/* =============================================================================
   ribbon.js — the gallery.
   Subjects in one strip; the selected one is what the whole screen is about.
   Moving along it turns the lens stack over, exactly as changing photo changes
   which filters are on offer. Events and insights carry different marks, because
   they are answered by different readings.
   ============================================================================= */
(function () {
  function render() {
    const host = document.getElementById('ribbon');
    const list = Subjects.ribbon();
    host.innerHTML =
      '<div class="rb-h"><span class="mono lbl">' + LVF.esc(LVT('ribbon')) + '</span>' +
      '<span class="mono micro dim">' + LVF.esc(LVT('ribbon_hint')) + '</span></div>' +
      '<div class="rb-track">' + list.map(s =>
        '<button class="rb' + (s.key === LV.subject ? ' on' : '') + ' ' + s.kind + '" data-k="' + LVF.esc(s.key) + '"' +
        ' style="--sc:' + LVF.bandVar(s.sev) + '">' +
        '<span class="mark"></span>' +
        '<span class="rb-t">' + LVF.esc(CV.nm(s.title)) + '</span>' +
        '<span class="rb-m mono micro">' +
        '<span>' + LVF.esc(CV.nm(s.scope.amana) || (s.scope.unit ? CV.nm(s.scope.unit) : '')) + '</span>' +
        '<span class="rb-n">' + s.lenses.length + ' ' + LVF.esc(LVT('readings')) + '</span>' +
        '</span></button>').join('') + '</div>';

    host.querySelectorAll('.rb').forEach(b => { b.onclick = () => LV.open(b.dataset.k, LV.entry); });
    const on = host.querySelector('.rb.on');
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  window.Ribbon = { render };
})();
