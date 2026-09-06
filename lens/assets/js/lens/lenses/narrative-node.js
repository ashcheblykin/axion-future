/* narrative.node — how the agent got here, as a graph.

   Laid out on SPAR, the product's own frame: Sensing → Preventing → Acting →
   Reacting. Every node is a claim the insight already carries, and clicking one
   scrolls to and flashes the panel that holds the working behind it — so the
   graph is a table of contents for the explanation, not a second copy of it.
   ============================================================================= */
(function () {
  const STAGE = [
    { k: 'S', ar: 'الاستشعار', en: 'Sensing' },
    { k: 'P', ar: 'الوقاية',   en: 'Preventing' },
    { k: 'A', ar: 'المعالجة',  en: 'Acting' },
    { k: 'R', ar: 'الاستجابة', en: 'Reacting' },
  ];

  function nodes(s) {
    const x = s.src, out = [];
    const kobj = CV.K[x.kpi] || (CV.DOM[x.dom] && CV.DOM[x.dom].kpis.find(k => k.id === x.kpi));
    const tr = x.trend || {};
    const last = tr.vals ? tr.vals[tr.vals.length - 1] : null;

    if (last != null) {
      out.push({ st: 0, w: 'trend',
        t: CV.LANG === 'ar' ? 'المؤشر خرج عن نطاقه المعتاد' : 'The indicator left its usual range',
        m: CV.NF(last, 1) + (CV.LANG === 'ar' ? tr.u : tr.uEn) + ' · ' +
           LVT('usual') + ' ' + CV.NF(tr.lo, 1) + '–' + CV.NF(tr.hi, 1) });
    }
    if (x.cx) {
      out.push({ st: 0, w: 'complaints',
        t: CV.LANG === 'ar' ? 'الشكاوى ترتفع على النقاط نفسها' : 'Complaints rise on the same points',
        m: CV.T('in_cx') });
    }
    if (x.ctr) {
      out.push({ st: 1, w: 'contractor',
        t: CV.LANG === 'ar' ? 'النطاق مغطى بعقد قائم' : 'The scope is covered by a standing contract',
        m: CV.nm(x.ctr) + (x.ctr.id ? ' · ' + x.ctr.id : '') });
    }
    if (x.rcEn && x.rcEn.length) {
      out.push({ st: 2, w: 'root',
        t: CV.LANG === 'ar' ? 'التسلسل السببي' : 'The causal chain',
        m: (CV.LANG === 'ar' ? x.rcAr : x.rcEn)[0].replace(/<[^>]+>/g, '').slice(0, 96) + '…' });
    }
    if (x.viol && x.viol.length) {
      out.push({ st: 2, w: 'violations',
        t: CV.LANG === 'ar' ? 'الإنفاذ السابق لم يغيّر السلوك' : 'Earlier enforcement did not change the behaviour',
        m: x.viol.length + ' · ' + CV.T('in_viol') });
    }
    if (x.rec && x.rec.length) {
      out.push({ st: 3, w: 'reco',
        t: CV.LANG === 'ar' ? 'حزمة التوصيات' : 'The recommended package',
        m: x.rec.length + ' · ' + CV.T('reco_ttl') });
    }
    if (x.wi && x.wi.length) {
      out.push({ st: 3, w: 'whatif',
        t: CV.LANG === 'ar' ? 'الأثر المتوقع' : 'The expected effect',
        m: LVT('w_whatif') });
    }
    return out.length ? out : [{ st: 0, w: 'root', t: CV.nm(s.title), m: s.trace }];
  }

  Lenses.def({
    id: 'narrative.node',
    label: 'lens_node',
    needs: s => s.kind === 'insight',
    mount(host, s) {
      const list = nodes(s);
      const el = document.createElement('div');
      el.className = 'lv-node';
      el.innerHTML =
        '<svg class="wires" aria-hidden="true"></svg>' +
        '<div class="cols">' + STAGE.map((st, i) =>
          '<div class="col" data-st="' + i + '">' +
          '<span class="mono lbl spar-stage"><i>' + st.k + '</i>' + LVF.esc(CV.LANG === 'ar' ? st.ar : st.en) + '</span>' +
          list.filter(n => n.st === i).map(n =>
            '<button class="node" data-w="' + LVF.esc(n.w) + '">' +
            '<b>' + LVF.esc(n.t) + '</b>' +
            '<span class="mono micro">' + LVF.esc(n.m) + '</span></button>').join('') +
          '</div>').join('') + '</div>';
      host.appendChild(el);

      const cap = document.createElement('div');
      cap.className = 'lv-stage-cap';
      cap.innerHTML =
        '<span class="mono lbl">' + LVF.esc(LVT('lens_node')) + '</span>' +
        '<b>SPAR · ' + LVF.esc(CV.nm(s.category)) + '</b>' +
        '<span class="mono micro">' + LVF.esc(s.trace) + '</span>';
      host.appendChild(cap);

      el.querySelectorAll('.node').forEach(b => {
        b.onclick = () => { if (window.Panels) Panels.flash(b.dataset.w); };
      });

      /* the wires are drawn after layout, from the boxes that actually landed */
      const svg = el.querySelector('.wires');
      function wire() {
        const box = el.getBoundingClientRect();
        svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
        const cols = [...el.querySelectorAll('.col')].map(c => [...c.querySelectorAll('.node')]);
        const rtl = document.documentElement.dir === 'rtl';
        let d = '';
        for (let i = 0; i < cols.length - 1; i++) {
          cols[i].forEach(a => cols[i + 1].forEach(b => {
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            const ax = (rtl ? ra.left : ra.right) - box.left, ay = ra.top + ra.height / 2 - box.top;
            const bx = (rtl ? rb.right : rb.left) - box.left, by = rb.top + rb.height / 2 - box.top;
            const mx = (ax + bx) / 2;
            d += 'M' + ax + ' ' + ay + 'C' + mx + ' ' + ay + ' ' + mx + ' ' + by + ' ' + bx + ' ' + by;
          }));
        }
        svg.innerHTML = '<path d="' + d + '"/>';
      }
      requestAnimationFrame(wire);
      const ro = new ResizeObserver(wire); ro.observe(el);
      return { destroy() { ro.disconnect(); } };
    },
  });
})();
