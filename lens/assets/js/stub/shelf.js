/* =============================================================================
   shelf.js — the entry stubs.

   These are scaffolding, and they say so on screen. The master dashboard is a
   separate track built on the product stack; what has to be shown here is only
   that the Lens is reachable from more than one surface through one call, and
   that where the call came from changes which reading opens first.
   ============================================================================= */
(function () {
  const esc = LVF.esc;

  const TABS = [
    { id: 'feed', label: 'stub_feed', pick: s => s.kind === 'event' },
    { id: 'insights', label: 'stub_insights', pick: s => s.kind === 'insight' },
    { id: 'agents', label: 'stub_agents', pick: s => s.kind === 'insight' },
  ];

  function agentCard(s) {
    return '<button class="card agent" data-k="' + esc(s.key) + '">' +
      '<span class="mono lbl">' + esc(CV.nm(s.category)) + '</span>' +
      '<b>' + esc(CV.nm(s.title)) + '</b>' +
      '<span class="mono micro dim">' + esc(s.trace) + '</span>' +
      '<span class="mono micro go">SPAR ' + esc(CV.T('in_open')) + '</span></button>';
  }

  function row(s) {
    return '<button class="card row" data-k="' + esc(s.key) + '" style="--sc:' + LVF.bandVar(s.sev) + '">' +
      '<span class="mark"></span>' +
      '<span class="t"><b>' + esc(CV.nm(s.title)) + '</b>' +
      '<span class="mono micro dim">' + esc(CV.nm(s.scope.amana) || '') +
      (s.category && CV.nm(s.category) ? ' · ' + esc(CV.nm(s.category)) : '') + '</span></span>' +
      '<span class="mono micro lens-n">' + s.lenses.length + ' ' + esc(LVT('readings')) + '</span></button>';
  }

  function render() {
    const host = document.getElementById('stub');
    const tab = TABS.find(t => t.id === LV.stub) || TABS[0];
    const list = Subjects.ribbon().filter(tab.pick);

    host.innerHTML =
      '<header class="stub-h">' +
      '<div class="brand"><span class="mark"></span><span class="wordmark">' +
      esc(LVT('brand_a')) + '<em>' + esc(LVT('brand_b')) + '</em></span></div>' +
      '<nav class="tabs">' + TABS.map(t =>
        '<button class="tab' + (t.id === LV.stub ? ' on' : '') + '" data-t="' + t.id + '">' +
        esc(LVT(t.label)) + '</button>').join('') + '</nav>' +
      '<div class="right"><span class="badge mono">' + esc(LVT('stub_badge')) + '</span>' +
      '<button class="lang" id="stubLang">' + (LV.lang === 'en' ? 'ع' : 'EN') + '</button></div>' +
      '</header>' +
      '<p class="stub-note mono micro">' + esc(LVT('stub_note')) + '</p>' +
      '<div class="shelf ' + esc(tab.id) + '">' +
      (tab.id === 'agents' ? list.map(agentCard).join('') : list.map(row).join('')) +
      '</div>';

    host.querySelectorAll('.tab').forEach(b => { b.onclick = () => LV.setStub(b.dataset.t); });
    host.querySelectorAll('.card').forEach(b => { b.onclick = () => LV.open(b.dataset.k, LV.stub); });
    document.getElementById('stubLang').onclick = () => LV.setLang(LV.lang === 'en' ? 'ar' : 'en');
  }

  window.Shelf = { render };
})();
