/* narrative — how this reached the screen.
   A plain chain: the signal, where it was confirmed, and what has happened to it
   since. Built from the subject's own source and handling timeline. */
(function () {
  Lenses.def({
    id: 'narrative',
    label: 'lens_narrative',
    needs: s => !!s.source || !!s.explain.find(e => e.widget === 'timeline'),
    mount(host, s) {
      const tl = (s.explain.find(e => e.widget === 'timeline') || { data: { rows: [] } }).data.rows || [];
      const steps = [];
      if (s.source) {
        steps.push({
          k: CV.T('mn_src'),
          t: CV.nm(s.source.label),
          m: s.object ? CV.nm(s.object.name) + (s.object.licence ? ' · ' + CV.T('mn_lic') + ' ' + s.object.licence : '') : '',
          st: 'done', url: s.source.url,
        });
      }
      tl.forEach(r => steps.push({
        k: CV.LANG === 'ar' ? r.tAr : r.tEn,
        t: CV.nm(r), m: '', st: r.st || 'done',
      }));

      const el = document.createElement('div');
      el.className = 'lv-narr';
      el.innerHTML = '<ol class="chain">' + steps.map(x =>
        '<li class="step ' + LVF.esc(x.st) + '">' +
        '<span class="mono lbl">' + LVF.esc(x.k) + '</span>' +
        '<p>' + LVF.rich(x.t) + '</p>' +
        (x.m ? '<span class="mono micro">' + LVF.esc(x.m) + '</span>' : '') +
        (x.url ? '<a class="mono micro" target="_blank" rel="noopener" href="' + LVF.esc(x.url) + '">↗</a>' : '') +
        '</li>').join('') + '</ol>';
      host.appendChild(el);

      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap corner';
      cap.innerHTML =
        '<span class="mono lbl">' + LVF.esc(LVT('lens_narrative')) + '</span>' +
        '<b>' + LVF.esc(CV.nm(s.source ? s.source.label : s.title)) + '</b>' +
        '<span class="mono micro">' + LVF.esc(s.trace) + '</span>';
      host.appendChild(cap);
      return { destroy() {} };
    },
  });
})();
