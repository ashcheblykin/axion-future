/* =============================================================================
   panels.js — the two columns that explain the subject.
   They are filled from subject.explain[], so an event and an insight produce
   visibly different panels without either knowing about the other.
   Changing the lens never touches them: the subject has not changed.
   ============================================================================= */
(function () {
  const L = () => document.getElementById('panelL');
  const R = () => document.getElementById('panelR');
  let wires = [];

  function render(subject) {
    const cols = { left: [], right: [] };
    wires = [];
    subject.explain.forEach(e => {
      const fn = Widgets[e.widget];
      if (!fn) return;
      /* one widget that cannot render must not take the whole explanation with
         it — the reader still needs the other eleven */
      let out;
      try { out = fn(e.data, subject); }
      catch (err) {
        out = '<section class="w broken" data-w="' + LVF.esc(e.widget) + '">' +
          '<h3 class="mono lbl">' + LVF.esc(e.widget) + '</h3>' +
          '<p class="mono micro warn">' + LVF.esc(err.message) + '</p></section>';
      }
      const html = typeof out === 'string' ? out : out.html;
      cols[e.side === 'right' ? 'right' : 'left'].push(html);
      if (out && out.wire) wires.push(out.wire);
    });
    const l = L(), r = R();
    /* no column headings: every widget already names itself, and a standing
       "what this is / what it means" split argues with the widget titles */
    l.innerHTML = cols.left.join('');
    r.innerHTML = cols.right.join('');
    l.scrollTop = 0; r.scrollTop = 0;
    wires.forEach(fn => { fn(l, subject); fn(r, subject); });
    [l, r].forEach(host => host.querySelectorAll('[data-open]').forEach(b => {
      b.onclick = () => LV.open(b.dataset.open, LV.entry);
    }));
  }

  /* the node lens points at a panel; the panel has to be findable */
  function flash(id) {
    const el = document.querySelector('.w[data-w="' + id + '"]');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  window.Panels = { render, flash };
})();
