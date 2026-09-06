/* =============================================================================
   app.js — boot, routing, keys.
   ============================================================================= */
(function () {
  function paint() {
    const lens = LV.route === 'lens';
    document.body.classList.toggle('is-lens', lens);
    document.getElementById('stub').hidden = lens;
    document.getElementById('lens').hidden = !lens;
    if (lens) {
      const s = LV.current();
      if (!s) { LV.close(); return; }
      Shell.render(s);
      Panels.render(s);
      Stage.render(s);
      Ribbon.render();
    } else {
      Shelf.render();
    }
  }

  function boot() {
    CV.LANG = 'en';
    /* the road geometry is committed and local, so this resolves in a few
       milliseconds — but a site has to be placed on its real street before any
       subject exists, so the build waits for it rather than correcting later */
    Subjects.preload().then(start);
  }

  function start() {
    /* the language has to be settled before the first build: some of what a
       subject carries is chosen per language, and rebuilding after the fact
       leaves the first paint in the wrong one */
    LV.readLang();
    Subjects.build();
    LV.read();

    LV.on('route', () => { Stage.reset(); paint(); });
    LV.on('lens', () => { const s = LV.current(); if (s) { Stage.render(s); } });
    LV.on('lang', () => { Stage.reset(); Subjects.build(); paint(); });

    addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (LV.route !== 'lens') return;
      if (e.key === 'ArrowRight') { LV.stepLens(document.documentElement.dir === 'rtl' ? -1 : 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { LV.stepLens(document.documentElement.dir === 'rtl' ? 1 : -1); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { LV.stepSubject(1); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { LV.stepSubject(-1); e.preventDefault(); }
      else if (e.key === 'Escape') { LV.close(); }
    });

    /* swipe on the stage, for the gallery gesture the concept is named after */
    const stage = document.getElementById('stageBody');
    let x0 = null;
    stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
    stage.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) < 64) return;
      const rtl = document.documentElement.dir === 'rtl';
      LV.stepLens(dx < 0 ? (rtl ? -1 : 1) : (rtl ? 1 : -1));
    });

    paint();
    document.body.classList.add('ready');
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
  else boot();

  /* what the harness reads. It reports; it never holds state. */
  window.__lens = {
    route: () => LV.route,
    subject: () => LV.subject,
    lens: () => LV.lensId,
    lenses: () => (LV.current() ? LV.current().lenses.slice() : []),
    widgets: () => (LV.current() ? LV.current().explain.map(e => e.widget) : []),
    profile: () => (LV.current() ? LV.current().profile : null),
    subjects: () => Subjects.keys(),
    lang: () => LV.lang,
    entry: () => LV.entry,
    trace: () => (LV.current() ? LV.current().trace : null),
  };
})();
