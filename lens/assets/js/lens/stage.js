/* =============================================================================
   stage.js — the one large element: the lens currently in view.
   Switching a lens swaps what is on the stage and nothing else. The switcher is
   a strip of named stops rather than anonymous dots, because which readings a
   subject carries is itself part of the answer.
   ============================================================================= */
(function () {
  let mounted = null, curKey = null, curLens = null;

  function render(subject) {
    const host = document.getElementById('stageBody');
    const strip = document.getElementById('stageStrip');
    const lensId = LV.lensId || subject.lenses[0];

    if (curKey === subject.key && curLens === lensId) return;
    curKey = subject.key; curLens = lensId;

    if (mounted && mounted.destroy) mounted.destroy();
    host.innerHTML = '';
    host.classList.remove('in');
    void host.offsetWidth;
    host.classList.add('in');

    const lens = Lenses.get(lensId);
    mounted = lens ? lens.mount(host, subject) : null;

    const i = subject.lenses.indexOf(lensId);
    strip.innerHTML =
      '<button class="nav prev" aria-label="previous lens">‹</button>' +
      '<div class="stops">' + subject.lenses.map((id, n) =>
        '<button class="stop' + (n === i ? ' on' : '') + '" data-lens="' + LVF.esc(id) + '">' +
        '<i></i><span class="mono">' + LVF.esc(Lenses.label(id)) + '</span></button>').join('') + '</div>' +
      '<span class="mono micro count">' + (i + 1) + ' ' + LVF.esc(LVT('lens_of')) + ' ' + subject.lenses.length + '</span>' +
      '<button class="nav next" aria-label="next lens">›</button>';

    strip.querySelector('.prev').onclick = () => LV.stepLens(-1);
    strip.querySelector('.next').onclick = () => LV.stepLens(1);
    strip.querySelectorAll('.stop').forEach(b => { b.onclick = () => LV.setLens(b.dataset.lens); });
  }

  function reset() { curKey = null; curLens = null; }

  window.Stage = { render, reset };
})();
