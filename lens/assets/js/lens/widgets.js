/* =============================================================================
   widgets.js — the panels that explain one subject.

   Each entry renders one record of subject.explain[]. Every label comes from the
   source document's own bilingual dictionary (CV.T), and every figure from the
   source data, so nothing here has to be translated or invented twice.
   ============================================================================= */
(function () {
  const esc = LVF.esc, rich = LVF.rich, bandVar = LVF.bandVar;
  const nm = o => CV.nm(o || {});
  const T = k => CV.T(k);

  const sec = (title, inner, id) =>
    '<section class="w" data-w="' + esc(id) + '"><h3 class="mono lbl">' + esc(title) + '</h3>' + inner + '</section>';
  const rows = list => '<div class="kv">' + list.map(([k, v]) =>
    '<div class="kv-r"><span class="k">' + esc(k) + '</span><span class="v">' + v + '</span></div>').join('') + '</div>';
  const bullets = list => '<ul class="bul">' + list.map(t => '<li>' + rich(t) + '</li>').join('') + '</ul>';

  /* in_mo arrives as an array in one language and a comma-joined string in the
     other, depending on how the source authored it — normalise once */
  const para = ps => ((CV.LANG === 'ar' ? ps.ar : ps.en) || [])
    .filter(Boolean).map(x => '<p>' + rich(x) + '</p>').join('');

  const months = () => { const v = T('in_mo'); return Array.isArray(v) ? v : String(v).split(','); };

  /* a KPI reading in the domain model, which is where MON points its slice */
  function kpiRead(uid, dom, kid) {
    const d = CV.DOM[dom];
    const k = d && d.kpis.find(x => x.id === kid);
    if (!k) return null;
    const v = CV.dVal(uid, dom, kid), t = CV.dT(uid, k);
    return { k, v, t, b: CV.dBand(k, v, t), txt: CV.dFmt(k, v), tgt: CV.dFmt(k, t) };
  }

  function meter(v, t, band, dir) {
    const hi = Math.max(v, t) * 1.08 || 1;
    const pv = Math.max(2, Math.min(100, v / hi * 100));
    const pt = Math.max(0, Math.min(100, t / hi * 100));
    return '<div class="meter"><i style="width:' + pv.toFixed(1) + '%;background:' + bandVar(band) + '"></i>' +
      '<u style="inset-inline-start:' + pt.toFixed(1) + '%"></u></div>';
  }

  const W = {
    /* ---------------- events ---------------- */
    /* both languages are carried, and the choice is made when the panel is
       drawn — baking it in at build time is how English text ends up on an
       Arabic screen */
    detail: d => sec(T('mn_det'), para(d.paras), 'detail'),

    timeline: d => sec(T('mn_tl'),
      '<ol class="tl">' + d.rows.map(r =>
        '<li class="' + esc(r.st || 'done') + '"><span class="mono t">' +
        esc(CV.LANG === 'ar' ? r.tAr : r.tEn) + '</span><span class="x">' + rich(nm(r)) + '</span></li>'
      ).join('') + '</ol>', 'timeline'),

    inspection: d => sec(T('mn_insp'), rows([
      [T('mn_lastin'), '<b>' + CV.NF(d.d) + '</b> ' + esc(T('mn_days')) + ' ' + esc(T('mn_ago'))],
      [T('mn_res'), esc(nm({ ar: d.resAr, en: d.resEn }))],
      [T('mn_by'), esc(nm({ ar: d.byAr, en: d.byEn }))],
    ]) + (d.stale ? '<p class="warn mono micro">' + esc(T('mn_stale')) + '</p>' : ''), 'inspection'),

    slice: (d) => {
      const s = d.sub;
      const band = s.v / s.tgt >= 1 ? 0 : s.v / s.tgt >= .95 ? 1 : s.v / s.tgt >= .88 ? 2 : s.v / s.tgt >= .78 ? 3 : 4;
      return sec(T('mn_slice'),
        '<p class="slice-n">' + esc(nm(s)) + '</p>' +
        '<div class="big"><b style="color:' + bandVar(band) + '">' + CV.NF(s.v, 1) + esc(s.u) + '</b>' +
        '<span class="mono micro">' + esc(T('tgt')) + ' ' + CV.NF(s.tgt, 0) + esc(s.u) + '</span></div>' +
        meter(s.v, s.tgt, band) +
        (s.nAr || s.nEn ? '<p class="mono micro dim">' + esc(nm({ ar: s.nAr, en: s.nEn })) + '</p>' : '') +
        (d.note && (d.note.ar || d.note.en) ? '<p class="note">' + esc(nm(d.note)) + '</p>' : ''), 'slice');
    },

    kpi: d => sec(T('mn_kpis'), d.list.map(x => {
      const r = kpiRead(d.uid, x.dom, x.k);
      if (!r) return '';
      return '<div class="kpi-r"><span class="n">' + esc(nm(r.k)) + '</span>' +
        '<span class="v" style="color:' + bandVar(r.b) + '">' + esc(r.txt) + '</span>' +
        '<span class="mono micro dim">' + esc(T('tgt')) + ' ' + esc(r.tgt) + '</span></div>';
    }).join(''), 'kpi'),

    actions: d => sec(T('mn_acts'), d.list.map(a =>
      '<div class="act"><p>' + esc(nm(a)) + '</p><span class="mono micro dim">' +
      esc(nm({ ar: a.whenAr, en: a.whenEn })) + ' · ' + esc(nm({ ar: a.byAr, en: a.byEn })) +
      '</span></div>').join(''), 'actions'),

    prevention: d => ({
      html: sec(T('mn_prev'),
        '<p class="mono micro dim">' + esc(T('mn_prev_n')) + '</p>' +
        d.list.map((p, i) =>
          '<div class="pv' + (p.on ? ' on' : '') + '">' +
          '<p>' + esc(nm(p)) + '</p>' +
          '<div class="pv-m mono micro">' +
          '<span class="sc ' + esc(p.sc) + '">' + esc(T('mn_sc_' + p.sc)) + '</span>' +
          '<span>' + esc(nm({ ar: p.dueAr, en: p.dueEn })) + '</span>' +
          '<span>' + esc(nm({ ar: p.byAr, en: p.byEn })) + '</span></div>' +
          '<p class="pv-e mono micro dim">' + esc(nm({ ar: p.effAr, en: p.effEn })) + '</p>' +
          '<button class="btn sm" data-pv="' + i + '"' + (p.on ? ' disabled' : '') + '>' +
          esc(T(p.on ? 'mn_cmtd' : 'mn_cmt')) + '</button></div>').join(''), 'prevention'),
      wire(el, subject) {
        el.querySelectorAll('[data-pv]').forEach(b => {
          b.onclick = () => {
            const p = d.list[+b.dataset.pv];
            if (p.on) return;
            p.on = true;
            /* the decision lands in the same journal that was just read */
            const src = subject.src;
            if (src && src.tl) {
              src.tl.push({
                tAr: 'الآن', tEn: 'Now',
                ar: CV.I18N.ar.mn_cmt_tl + ' — ' + p.ar,
                en: CV.I18N.en.mn_cmt_tl + ' — ' + p.en,
                st: 'now',
              });
            }
            Panels.render(subject);
            Panels.flash('timeline');
          };
        });
      },
    }),

    escalation: d => ({
      html: sec(T('mn_esc'),
        '<button class="esc crisis" data-esc="crisis"' + (d.esc.crisis ? ' disabled' : '') + '>' +
        '<b>' + esc(T('mn_crisis')) + '</b><span class="mono micro">' + esc(T('mn_esc_d1')) + '</span></button>' +
        '<button class="esc social" data-esc="social"' + (d.esc.social ? ' disabled' : '') + '>' +
        '<b>' + esc(T('mn_social')) + '</b><span class="mono micro">' + esc(T('mn_esc_d2')) + '</span></button>', 'escalation'),
      wire(el, subject) {
        el.querySelectorAll('[data-esc]').forEach(b => {
          b.onclick = () => {
            const k = b.dataset.esc;
            if (d.esc[k]) return;
            d.esc[k] = true;
            const src = subject.src;
            if (src && src.tl) {
              src.tl.push({
                tAr: 'الآن', tEn: 'Now',
                ar: CV.I18N.ar.mn_esc_tl + ' — ' + CV.I18N.ar[k === 'crisis' ? 'mn_crisis' : 'mn_social'],
                en: CV.I18N.en.mn_esc_tl + ' — ' + CV.I18N.en[k === 'crisis' ? 'mn_crisis' : 'mn_social'],
                st: 'now',
              });
            }
            Panels.render(subject);
            Panels.flash('timeline');
          };
        });
      },
    }),

    evidence: d => sec(T('evidence'), bullets(d.rows.map(r => nm(r))), 'evidence'),

    social: d => sec(CV.I18N[CV.LANG].mn_media || 'Social signal', rows([
      [LVT('mentions'), '<b>' + CV.NF(d.mentions) + '</b> · +' + CV.NF(d.d24) + '% 24h'],
      [LVT('reach'), '<b>' + CV.NF(d.reach) + '</b>'],
      [LVT('sentiment'), '<b style="color:' + bandVar(4) + '">' + d.sent + '</b>'],
    ]) + (d.scopes ? '<p class="mono micro dim">' + esc(d.scopes.join(' · ')) + '</p>' : ''), 'social'),

    sla: d => sec(LVT('w_sla'), rows([
      [LVT('past_sla'), '<b>' + CV.NF(d.det) + ' ' + esc(T('ev_h')) + '</b> / ' + CV.NF(d.sla) + ' ' + esc(T('ev_h')) +
        (d.det > d.sla ? ' <span style="color:' + bandVar(4) + '">+' + CV.NF(d.det - d.sla) + '</span>' : '')],
      [LVT('risk'), '<b style="color:' + bandVar(d.risk >= 80 ? 4 : d.risk >= 60 ? 3 : 2) + '">' + d.risk + '</b> / 100'],
      [T('owner'), esc(nm(d.own))],
    ]), 'sla'),

    reco: d => sec(T('reco_ttl'), d.list.map(r => {
      const meta = [];
      if (r.imp) meta.push(T('in_imp') + ' ' + T(r.imp));
      if (r.eff) meta.push(T('in_eff') + ' ' + T(r.eff));
      const own = nm({ ar: r.ownAr, en: r.ownEn });
      if (own) meta.push(own);
      return '<div class="act"><p>' + esc(nm(r)) + '</p>' +
        (meta.length ? '<span class="mono micro dim">' + esc(meta.join(' · ')) + '</span>' : '') +
        '</div>';
    }).join(''), 'reco'),

    site: d => sec(T('scope'), rows(
      (d.street ? [[LVT('lens_street'), '<b>' + esc(nm(d.street)) + '</b>, ' + esc(nm(d.d))]]
                : [[T('scope'), '<b>' + esc(nm(d.d)) + '</b>']])
      .concat([
        [T('complaints'), '<b>' + CV.NF(d.h.open) + '</b> open · ' + CV.NF(d.h.rep) + ' repeat'],
        [T('mn_lastin'), '<b>' + CV.NF(d.h.last) + '</b> ' + esc(T('mn_days')) + ' ' + esc(T('mn_ago'))],
      ])), 'site'),

    linked: d => sec(T('ai_corr'),
      '<div class="act"><p><b>' + esc(d.id) + '</b> — ' + esc(nm(d)) + '</p>' +
      '<span class="mono micro dim">' + esc(T('owner')) + ' ' + esc(nm(d.own)) + '</span></div>' +
      '<button class="btn sm" data-open="event:' + esc(d.id) + '">' + esc(T('in_open')) + '</button>', 'linked'),

    /* ---------------- insights ---------------- */
    root: d => sec(T('in_rc'), para(d.paras), 'root'),

    trend: d => {
      const v = d.vals || [], n = v.length;
      if (!n) return sec(T('in_trend'), '', 'trend');
      const lo = Math.min.apply(null, v.concat([d.lo])) * .92;
      const hi = Math.max.apply(null, v.concat([d.hi])) * 1.06;
      const sp = (hi - lo) || 1, W_ = 240, H = 76;
      const X = i => 4 + i / Math.max(1, n - 1) * (W_ - 8);
      const Y = x => H - 8 - (x - lo) / sp * (H - 20);
      const path = v.map((x, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x).toFixed(1)).join(' ');
      const bandTop = Y(d.hi), bandBot = Y(d.lo);
      return sec(T('in_trend'),
        '<svg class="spark" viewBox="0 0 ' + W_ + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
        '<rect x="0" y="' + bandTop.toFixed(1) + '" width="' + W_ + '" height="' + Math.max(1, bandBot - bandTop).toFixed(1) + '" class="band"/>' +
        '<path d="' + path + '" class="line"/>' +
        '<circle cx="' + X(n - 1).toFixed(1) + '" cy="' + Y(v[n - 1]).toFixed(1) + '" r="3.4" class="dot"/></svg>' +
        rows([
          [T('in_band'), CV.NF(d.lo, 1) + '–' + CV.NF(d.hi, 1) + esc(CV.LANG === 'ar' ? d.u : d.uEn)],
          [T('in_now'), '<b style="color:' + bandVar(4) + '">' + CV.NF(v[n - 1], 1) + esc(CV.LANG === 'ar' ? d.u : d.uEn) + '</b>'],
        ]), 'trend');
    },

    complaints: d => {
      const cats = d.cats || [], names = CV.LANG === 'ar' ? (d.catAr || []) : (d.catEn || []);
      const max = cats.reduce((a, b) => Math.max(a, b), 1);
      return sec(T('in_cx'),
        '<div class="big"><b>' + CV.NF(d.m[d.m.length - 1]) + '</b>' +
        '<span class="mono micro">' + esc(T('in_cxk')) + ' · ' + esc(months()[2] || '') + '</span></div>' +
        '<div class="bars">' + cats.map((c, i) =>
          '<div class="bar-r"><span class="n">' + esc(names[i] || '') + '</span>' +
          '<i style="width:' + (c / max * 100).toFixed(1) + '%"></i>' +
          '<span class="mono micro">' + CV.NF(c) + '</span></div>').join('') + '</div>' +
        '<p class="mono micro dim">' + esc(T('in_cxnote')) + '</p>', 'complaints');
    },

    contractor: d => sec(T('in_ctr'),
      '<p class="slice-n">' + esc(nm(d.ctr)) + '</p>' +
      '<p class="mono micro dim">' + esc(T('in_contract')) + ' ' + esc(d.ctr.id || '—') +
      ' · ' + esc(nm({ ar: d.ctr.scAr, en: d.ctr.scEn })) + '</p>' +
      d.sla.map(m => {
        const good = m.dir === 1 ? m.v >= m.t : m.v <= m.t;
        return '<div class="kpi-r"><span class="n">' + esc(nm(m)) + '</span>' +
          '<span class="v" style="color:' + bandVar(good ? 0 : 4) + '">' + CV.NF(m.v, m.v % 1 ? 1 : 0) + esc(m.u) + '</span>' +
          '<span class="mono micro dim">' + esc(T('in_sla_t')) + ' ' + CV.NF(m.t) + esc(m.u) + '</span></div>';
      }).join(''), 'contractor'),

    violations: d => sec(T('in_viol'), '<ol class="tl">' + d.rows.map(v =>
      '<li class="done"><span class="mono t">' + esc(nm({ ar: v.dAr, en: v.dEn })) + '</span>' +
      '<span class="x"><b>' + esc(T(v.kind)) + '</b>' + (v.amt ? ' · ' + CV.NF(v.amt) + ' SAR' : '') +
      ' · <span class="mono micro">' + esc(T(v.st)) + '</span><br>' +
      esc(nm({ ar: v.rAr, en: v.rEn })) + '</span></li>').join('') + '</ol>', 'violations'),

    whatif: d => sec(T('in_wi'), d.rows.map(r => {
      const better = r.dir === -1 ? r.a < r.b : r.a > r.b;
      return '<div class="wi"><span class="n">' + esc(nm(r)) + '</span>' +
        '<span class="mono b">' + CV.NF(r.b, r.b % 1 ? 1 : 0) + esc(CV.LANG === 'ar' ? r.u : r.uEn) + '</span>' +
        '<span class="ar">→</span>' +
        '<span class="mono a" style="color:' + bandVar(better ? 0 : 3) + '">' +
        CV.NF(r.a, r.a % 1 ? 1 : 0) + esc(CV.LANG === 'ar' ? r.u : r.uEn) + '</span></div>';
    }).join('') + '<p class="mono micro dim">' + esc(nm(d.note)) + '</p>', 'whatif'),
  };

  window.Widgets = W;
})();
