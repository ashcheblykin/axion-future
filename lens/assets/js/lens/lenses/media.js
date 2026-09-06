/* media — what was actually captured.
   Real assets exist for one case only (the Taif clip and its frames, supplied by
   the ministry team). Every other tile is a labelled placeholder, never dressed
   up as footage. */
(function () {
  const A = () => (window.CV && CV.ASSET) || {};

  function tile(m, big) {
    const a = A();
    const cap = LVF.esc(CV.nm(m));
    const tag = m.kind === 'lens' ? CV.T('mn_lens') : CV.T('mn_srcn');
    if (m.a && a[m.a.k]) {
      if (m.a.t === 'vid') {
        const poster = m.a.p && a[m.a.p] ? ' poster="' + a[m.a.p] + '"' : '';
        const webm = a[m.a.k + '_webm'];
        return '<figure class="mtile' + (big ? ' big' : '') + '">' +
          '<video controls loop playsinline preload="metadata"' + poster + '>' +
          (webm ? '<source src="' + webm + '" type="video/webm">' : '') +
          '<source src="' + a[m.a.k] + '" type="video/mp4"></video>' +
          '<figcaption>' + cap + '<span class="mono micro">' + LVF.esc(tag) + '</span></figcaption></figure>';
      }
      return '<figure class="mtile' + (big ? ' big' : '') + '">' +
        '<img src="' + a[m.a.k] + '" alt="">' +
        '<figcaption>' + cap + '<span class="mono micro">' + LVF.esc(tag) + '</span></figcaption></figure>';
    }
    return '<figure class="mtile empty' + (big ? ' big' : '') + '">' +
      '<div class="ph mono">' + LVF.esc(tag) + '</div>' +
      '<figcaption>' + cap + '<span class="mono micro warn">' + LVF.esc(CV.T('mn_sim')) + '</span></figcaption></figure>';
  }

  Lenses.def({
    id: 'media',
    label: 'lens_media',
    needs: s => !!(s.media && s.media.length),
    mount(host, s) {
      const wrap = document.createElement('div');
      wrap.className = 'lv-media';
      const list = s.media.slice();
      /* a real capture leads; placeholders follow it */
      list.sort((a, b) => (b.a && A()[b.a.k] ? 1 : 0) - (a.a && A()[a.a.k] ? 1 : 0));
      wrap.innerHTML = list.map((m, i) => tile(m, i === 0)).join('');
      host.appendChild(wrap);

      /* no floating caption here: the identity strip already names the source
         and every tile carries its own, so a third label would only sit on top
         of the footage */

      return {
        destroy() {
          wrap.querySelectorAll('video').forEach(v => {
            try { v.pause(); v.removeAttribute('poster'); v.innerHTML = ''; v.load(); } catch (e) { /* nothing to release */ }
          });
        },
      };
    },
  });
})();
