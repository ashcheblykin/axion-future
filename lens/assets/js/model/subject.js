/* =============================================================================
   subject.js — the contract.

   The Lens takes a subject, not a screen. A subject is one event or one insight,
   normalised into a single shape so that the same view can be called from a
   dashboard, from the agents tab, from a map pin or from a feed row.

       LV.open('event:taif', 'feed')
       LV.open('insight:khobar_vp', 'agents')

   Four adapters feed it, all reading the CityView 2.0 dataset verbatim:
     MON      six documented city cases   — the richest, media included
     INC      the critical-event register — evidence, SLA, social metrics
     hotspot  operational sites in a district — a street and a recommended act
     INSX     insights, authored and engine-derived

   `explain[]` is what the side panels render; `lenses[]` is what the stage can
   show. Both are derived from the subject, never passed in by the caller — that
   is what makes the view portable into the product.
   ============================================================================= */
(function () {
  const nm  = o => (o ? CV.nm(o) : '');
  const pair = (ar, en) => ({ ar, en });

  /* ---- which series of lenses a subject carries ------------------------
     The series is a property of the problem domain, not of the screen:
     a road-infrastructure problem is read through the street and through a
     second reading of the same map; a facility-safety problem is read through
     the captured media and the object itself. */
  const LENS_SERIES = {
    'facility-safety': ['map.pin', 'media', 'scene', 'narrative'],
    'road-infra':      ['map.pin', 'street', 'map.layer', 'narrative'],
    'agent-insight':   ['narrative.node', 'map.pin', 'map.layer', 'street'],
    'structural':      ['map.pin', 'media', 'street', 'narrative'],
    'cleanliness':     ['map.pin', 'map.layer', 'street', 'narrative'],
    'social-trend':    ['narrative', 'map.layer', 'map.pin'],
    'planned':         ['map.pin', 'street', 'narrative'],
    'default':         ['map.pin', 'narrative'],
  };

  /* MON carries six authored cases; naming their profile explicitly is honest —
     inferring it from a category string would be guesswork dressed as a rule. */
  const MON_PROFILE = {
    taif: 'facility-safety', qassim: 'facility-safety', jeddah: 'structural',
    clean: 'cleanliness', asiacup: 'planned', season: 'planned',
  };
  const INC_PROFILE = {
    service: 'road-infra', safety: 'facility-safety', structural: 'structural',
    env: 'cleanliness', social: 'social-trend',
  };
  const HOT_PROFILE = {
    dig: 'road-infra', walk: 'road-infra', sign: 'road-infra', flood: 'road-infra',
    waste: 'cleanliness', dump: 'cleanliness', vend: 'cleanliness',
    bld: 'structural', food: 'facility-safety',
  };

  const slug = s => String(s).toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site';

  const REG = {};        /* key -> subject          */
  const ORDER = [];      /* the ribbon, in order    */

  const add = s => { REG[s.key] = s; ORDER.push(s.key); return s; };

  /* =========================================================================
     1. MON — a documented city case
     ========================================================================= */
  function fromMON(m) {
    const unit = CV.U[m.uid];
    const kSlice = CV.K[m.sub.k];
    const explain = [
      { widget: 'detail', side: 'left', data: { paras: { ar: m.detAr, en: m.detEn }, raw: m } },
      { widget: 'timeline', side: 'left', data: { rows: m.tl } },
    ];
    if (m.insp) explain.push({ widget: 'inspection', side: 'left', data: m.insp });
    explain.push({ widget: 'slice', side: 'right', data: { sub: m.sub, note: pair(m.kpiNote && m.kpiNote.ar, m.kpiNote && m.kpiNote.en) } });
    if (m.kpis && m.kpis.length) explain.push({ widget: 'kpi', side: 'right', data: { list: m.kpis, uid: m.uid } });
    if (m.acts && m.acts.length) explain.push({ widget: 'actions', side: 'right', data: { list: m.acts } });
    if (m.prev && m.prev.length) explain.push({ widget: 'prevention', side: 'right', data: { list: m.prev, subject: 'event:' + m.id } });
    explain.push({ widget: 'escalation', side: 'right', data: { esc: m.esc, subject: 'event:' + m.id } });

    return {
      key: 'event:' + m.id, kind: 'event', id: m.id, src: m,
      profile: MON_PROFILE[m.id] || 'default',
      domain: m.sub && m.sub.dom, sev: m.sev,
      title: pair(m.ar, m.en),
      category: pair(m.catAr, m.catEn),
      owner: pair(m.amAr, m.amEn),
      kicker: CV.T(m.kind === 'plan' ? 'mn_plan' : 'mn_adhoc'),
      scope: { uid: m.uid, unit, amana: pair(m.amAr, m.amEn) },
      ll: m.ll, zoom: m.zoom || 13,
      source: m.src ? { kind: m.src.u ? 'x' : 'auto', url: m.src.u, label: pair(m.src.pAr, m.src.pEn) } : null,
      object: m.biz ? { name: pair(m.biz.ar, m.biz.en), licence: m.biz.lic } : null,
      media: m.media || [],
      trace: 'MON.' + m.id + (kSlice ? ' · sub.' + m.sub.k + ' ' + m.sub.v + '/' + m.sub.tgt : ''),
      explain,
    };
  }

  /* =========================================================================
     2. INC — the critical-event register
     ========================================================================= */
  function fromINC(i) {
    const unit = CV.U[i.city];
    const explain = [
      { widget: 'evidence', side: 'left', data: { rows: i.ev } },
      { widget: 'timeline', side: 'left', data: { rows: i.acts.map(a => ({
          tAr: '−' + CV.NF(a.h) + ' ' + CV.I18N.ar.ev_h, tEn: '−' + CV.NF(a.h) + ' ' + CV.I18N.en.ev_h,
          ar: a.ar, en: a.en, st: 'done' })) } },
    ];
    if (i.m) explain.push({ widget: 'social', side: 'left', data: i.m });
    explain.push({ widget: 'sla', side: 'right', data: { det: i.det, sla: i.sla, risk: i.risk, st: i.st, own: i.own } });
    explain.push({ widget: 'kpi', side: 'right', data: { list: [{ dom: 'reg', k: i.kpi }], uid: i.city } });
    explain.push({ widget: 'reco', side: 'right', data: { list: i.reco } });

    return {
      key: 'event:' + i.id, kind: 'event', id: i.id, src: i,
      profile: INC_PROFILE[i.t] || 'default',
      domain: 'reg', sev: LVF.sevBand(i.sev),
      title: pair(i.ar, i.en),
      category: pair(CV.I18N.ar['ev_t_' + i.t] || i.t, CV.I18N.en['ev_t_' + i.t] || i.t),
      owner: i.own,
      kicker: i.id,
      scope: { uid: i.city, unit, amana: unit ? pair(unit.ar, unit.en) : pair('', '') },
      ll: i.ll, zoom: 13.4,
      source: { kind: i.src, url: null, label: pair(CV.I18N.ar['ev_s_' + i.src] || i.src, CV.I18N.en['ev_s_' + i.src] || i.src) },
      object: null,
      media: [],
      trace: 'INC.' + i.id + ' · K.' + i.kpi,
      explain,
    };
  }

  /* =========================================================================
     3. hotspot — an operational site inside a district
        This is the road case Kartavtsev asked for: an excavation on King Fahd Rd.
     ========================================================================= */
  /* The source names a hotspot's street from a list and places its point at the
     district centre plus an offset — the two are generated independently, so the
     coordinate is not on the street the label claims. The label is the record;
     the coordinate is filler. So the site is moved onto the nearest point of the
     way that actually carries that name, and only then drawn. Where the city has
     no such way, the label is dropped rather than the point moved. */
  function snapToStreet(h) {
    const d = CV.U[h.dist];
    const city = d && d.p;
    const ways = city ? LensMap.roads(city, null) : null;
    if (!ways || !h.st) return { ll: h.ll, street: h.st, snapped: false };
    const name = h.st.en;
    let best = null, bd = Infinity;
    for (const w of ways) {
      if (!w.en || w.en.toLowerCase().indexOf(name.toLowerCase().replace(/ (rd|st)$/i, '')) < 0) continue;
      for (const p of w.pts) {
        const dx = p[0] - d.c[1], dy = p[1] - d.c[0];
        const dist = dx * dx + dy * dy;
        if (dist < bd) { bd = dist; best = p; }
      }
    }
    if (!best) return { ll: h.ll, street: null, snapped: false };
    return { ll: [best[1], best[0]], street: h.st, snapped: true };
  }

  function fromHotspot(h) {
    const d = CV.U[h.dist];
    const site = snapToStreet(h);
    const kid = CV.K[h.t.kpi] ? h.t.kpi : 'comp';
    const linked = linkedFor(h);

    const explain = [
      { widget: 'evidence', side: 'left', data: { rows: h.t.ev.map(e => ({ ar: e[0], en: e[1] })) } },
      { widget: 'site', side: 'left', data: { h, d, kid, street: site.street } },
    ];
    if (linked) explain.push({ widget: 'linked', side: 'left', data: linked });
    explain.push({ widget: 'kpi', side: 'right', data: { list: [{ dom: h.t.dom, k: kid }], uid: d ? d.id : 'KSA' } });
    explain.push({ widget: 'reco', side: 'right', data: { list: [
      { ar: h.t.act[0], en: h.t.act[1], ownAr: 'الأمانة', ownEn: 'Amana' }] } });
    /* no escalation here: a site record carries no handling journal for the
       decision to land in, and a button that files nowhere is a lie */

    return {
      /* the raw id is `D:<arabic district>#<n>` — a deep link has to survive
         being typed, pasted and read aloud, so the key is a slug of the same
         handle the identity strip prints */
      key: 'site:' + slug(d ? d.en : h.dist) + '-' + h.id.split('#')[1],
      kind: 'event', id: h.id, src: h,
      profile: HOT_PROFILE[h.t.k] || 'default',
      domain: h.t.dom, sev: Math.min(4, h.sev + 1),
      title: pair(h.t.ar, h.t.en),
      category: pair(CV.I18N.ar.fm_hot_one || 'موقع تشغيلي', 'Operational site'),
      owner: pair('الأمانة', 'Amana'),
      kicker: 'HOT/' + (d ? d.en : h.dist) + '#' + h.id.split('#')[1],
      scope: { uid: h.dist, unit: d, amana: d ? pair(d.ar, d.en) : pair('', ''), street: site.street },
      ll: site.ll, zoom: 15.6,
      source: { kind: 'inspection', url: null, label: pair('رصد ميداني', 'Field record') },
      object: null,
      media: [],
      trace: 'hotspots("' + h.dist + '")#' + h.id.split('#')[1] + ' · K.' + kid +
             (site.snapped ? ' · snapped to OSM ' + h.st.en : ''),
      explain,
    };
  }

  /* =========================================================================
     4. INSX — an insight. Authored ones carry a full analysis; engine ones are
        completed by the source's own insDerive().
     ========================================================================= */
  function fromINSX(x) {
    const full = x.gen ? (CV.HS.uid = 'KSA', CV.insDetail(x)) : x;
    const unit = CV.U[full.uid] || CV.U[full.lid] || CV.U.KSA;
    const explain = [
      { widget: 'root', side: 'left', data: { paras: { ar: full.rcAr, en: full.rcEn }, raw: full } },
      { widget: 'trend', side: 'left', data: full.trend },
    ];
    if (full.cx) explain.push({ widget: 'complaints', side: 'left', data: full.cx });
    if (full.ctr) explain.push({ widget: 'contractor', side: 'right', data: { ctr: full.ctr, sla: full.sla || [] } });
    if (full.viol && full.viol.length) explain.push({ widget: 'violations', side: 'right', data: { rows: full.viol } });
    if (full.rec && full.rec.length) explain.push({ widget: 'reco', side: 'right', data: { list: full.rec } });
    if (full.wi && full.wi.length) explain.push({ widget: 'whatif', side: 'right', data: { rows: full.wi, note: pair(full.wiAr, full.wiEn) } });

    const dom = CV.DOM[full.dom];
    return {
      key: 'insight:' + full.id, kind: 'insight', id: full.id, src: full,
      profile: 'agent-insight',
      domain: full.dom, sev: full.sev,
      title: pair(full.ar, full.en),
      category: dom ? pair(dom.ar, dom.en) : pair('', ''),
      owner: full.ctr ? pair(full.ctr.ar, full.ctr.en) : pair('', ''),
      kicker: CV.T('in_ttl'),
      scope: { uid: full.uid, unit, amana: pair(full.locAr, full.locEn) },
      ll: full.ll, zoom: full.zoom || 13,
      source: { kind: 'agent', url: null, label: pair('وكيل التحليل', 'Analysis agent') },
      object: null,
      media: [],
      trace: (x.gen ? 'genInsights · ' : 'INSX.') + full.id + ' · K.' + full.kpi,
      explain,
    };
  }

  /* =========================================================================
     registry
     ========================================================================= */
  /* the road geometry the snap reads has to be in hand before anything is built */
  function preload() { return Promise.all(LensMap.SHIPPED.map(id => LensMap.load(id))); }

  function build() {
    ORDER.length = 0;
    Object.keys(REG).forEach(k => delete REG[k]);

    /* documented cases first — they are the richest, and the demo opens on one */
    CV.MON.forEach(m => add(fromMON(m)));

    /* the road case: an excavation on King Fahd Rd, in the district the source
       puts one in. Resolved by search rather than hard-coded coordinates. */
    const dig = findDig();
    if (dig) add(fromHotspot(dig));

    /* the register, worst first, capped so the ribbon stays readable — plus
       whichever entry the site points at, so its link is never a dead end */
    const linked = dig ? linkedFor(dig) : null;
    const reg = CV.INC.slice().sort((a, b) => b.risk - a.risk).slice(0, 6);
    if (linked && !reg.some(i => i.id === linked.id)) reg.push(linked);
    reg.forEach(i => add(fromINC(i)));

    /* insights: the authored one, then a few from the engine */
    CV.HS.uid = 'KSA';
    Object.keys(CV.INSX).forEach(id => add(fromINSX(CV.INSX[id])));
    CV.genInsights('KSA', null).slice(0, 3).forEach((g, n) => {
      add(fromINSX(Object.assign({}, g, { id: 'g_' + g.dom + '_' + g.kpi + '_' + n, gen: true })));
    });

    /* every subject knows its own series, filtered to what it has data for */
    ORDER.forEach(k => {
      const s = REG[k];
      s.lenses = (LENS_SERIES[s.profile] || LENS_SERIES.default)
        .filter(id => Lenses.has(id) && Lenses.get(id).needs(s));
      if (!s.lenses.length) s.lenses = ['map.pin'];
    });
    return ORDER.length;
  }

  /* the register entry that sits in the same city as a site, if there is one —
     the road case reads much better with the water-leak incident attached */
  function linkedFor(h) {
    const d = CV.U[h.dist];
    const city = d && d.p;
    const kid = CV.K[h.t.kpi] ? h.t.kpi : 'comp';
    return CV.INC.find(x => x.city === city && (x.t === 'service' || x.kpi === kid)) || null;
  }

  function findDig() {
    /* the source generates hotspots deterministically per district, so this
       resolves to the same site on every load */
    for (const d of CV.SEED.districts) {
      const hit = CV.hotspots(d.id).find(h => h.t.k === 'dig' && /King Fahd/.test(h.st.en) && h.sev >= 4);
      if (hit) return hit;
    }
    return null;
  }

  window.Subjects = {
    build, preload,
    get: k => REG[k] || null,
    ribbon: () => ORDER.map(k => REG[k]),
    keys: () => ORDER.slice(),
    /* which lens opens first depends on where the call came from: arriving from
       the agents tab, the question is "how did you get here", not "where is it" */
    firstLens(s, entry) {
      if (entry === 'agents' && s.lenses.indexOf('narrative.node') >= 0) return 'narrative.node';
      return s.lenses[0];
    },
    LENS_SERIES,
    fromMON, fromINC, fromHotspot, fromINSX,
  };
})();
