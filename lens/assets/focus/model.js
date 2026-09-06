/* =============================================================================
   model.js — the subject, read off the source document.

   Nothing on the Focus screen is authored here. Every paragraph, time, licence
   number, inspection result, target and figure resolves to a symbol in
   assets/js/data/cv-core.js, which is extracted verbatim from
   CityView_2_0_KPI_Command_Center_Executive.html. The Figma frame was drawn
   from these same records, which is why its copy and this file's output agree
   word for word.

   The three things the dataset does not carry, and that are therefore stated
   on screen as what they are:
     · the shelf thumbnails for the five cases that ship no imagery;
     · the street reading, which is one illustrative frame, not a survey;
     · the agent's side of the thread, which is a conversation, not a record.
   ============================================================================= */
(function () {
  'use strict';

  const CV = window.CV;
  if (!CV) { window.FocusModel = { subjects: () => [] }; return; }

  CV.LANG = 'en';

  /* the design system's five bands, in the order cv-core reports them */
  const BAND = ['#00d39b', '#00c373', '#e5ab3c', '#ef8a4e', '#ff5050'];

  /* the severity dot on a shelf card: cv-core's sev 1..4 reads the same way
     round as a band — 4 is critical, 2 is a watch item */
  const sevColour = s => BAND[Math.min(4, Math.max(0, s))];

  /* cv-core's own banding rule, applied to a domain KPI that has no CV.band */
  function bandOf(v, tgt, dir) {
    if (v == null) return 2;
    const ratio = dir === 1 ? v / tgt : tgt / Math.max(v, 0.1);
    return ratio >= 1 ? 0 : ratio >= 0.95 ? 1 : ratio >= 0.88 ? 2 : ratio >= 0.78 ? 3 : 4;
  }

  /* the document's own suffixes, so a number is never printed unitless */
  const SUFFIX = { '%': '%', d: ' days', r: ' / 10k', vkm: ' / km²', sar: ' SAR' };

  const fmt = (v, unit, dec) => {
    if (v == null) return '—';
    const d = dec == null ? (unit === '%' || unit === 'vkm' ? 1 : 0) : dec;
    return v.toFixed(d) + (SUFFIX[unit] || '');
  };

  /* A percentage reads against 0..100, so the target mark sits where the target
     is. Anything else is scaled to whichever of the two is larger.
     Where lower is better the bar draws the overshoot, not the value, so that
     "past the mark" means the same thing on every row of the card. */
  function track(v, tgt, unit, dir) {
    const down = dir === -1;
    if (unit === '%' && !down) {
      return { fill: Math.max(0, Math.min(100, v || 0)), mark: Math.max(0, Math.min(100, tgt)), down: false };
    }
    const max = Math.max(v || 0, tgt) * 1.15 || 1;
    return { fill: ((v || 0) / max) * 100, mark: (tgt / max) * 100, down };
  }

  /* Where the timeline handle is standing, and on which branch. Past of NOW
     every figure is simply re-read at that month, because CV.PER moved. Future
     of NOW the engine has nothing, so only the nine KPIs it can project carry
     a number — and that number says on the card that it is a projection. */
  const FM = () => window.FM;
  const ahead  = () => { const f = FM(); return f && f.ti > f.NOW; };
  const behind = () => { const f = FM(); return f && f.ti < f.NOW; };
  const branchName = () => (FM().branch === 'act' ? 'with the action package' : 'if no action is taken');

  /* one KPI of a case: {dom,k} against the official nine or a domain registry */
  function metric(uid, ref) {
    const off = CV.K[ref.k];
    if (off && ref.dom === 'reg' && ['ttl', 'cov', 'comp', 'enf', 'vpenf', 'uin', 'uio', 'cx', 'sat'].indexOf(ref.k) >= 0) {
      const fut = ahead();
      const v = fut ? FM().val(uid, ref.k) : CV.at(uid, ref.k);
      const b = CV.band(ref.k, v);
      return { k: off.en, value: fmt(v, off.u, off.dec), target: fmt(off.tgt, off.u, 0),
               colour: BAND[b],
               proj: fut ? FM().monthLabel(FM().ti) + ' ' + branchName() : null,
               at: behind() ? FM().monthLabel(FM().ti) : null,
               ...track(v, off.tgt, off.u, off.dir) };
    }
    const dom = CV.DOM[ref.dom];
    const def = dom && (dom.kpis || []).find(x => x.id === ref.k);
    if (!def) return null;
    let v = null;
    try { v = CV.dVal(uid, ref.dom, ref.k); } catch (e) { v = null; }
    const b = bandOf(v, def.tgt, def.dir);
    /* the engine projects only its own nine. A domain KPI stays where the
       record leaves it, and the card says which month that is. */
    return { k: def.en, value: fmt(v, def.u, def.dec), target: fmt(def.tgt, def.u, 0),
             colour: BAND[b],
             held: ahead() ? 'held at ' + FM().monthLabel(FM().NOW) : null,
             at: behind() ? FM().monthLabel(FM().ti) : null,
             ...track(v, def.tgt, def.u, def.dir) };
  }

  /* the document's own words for a measure's reach */
  const SCOPE = { ksa: 'Kingdom-wide', reg: 'Region-wide', region: 'Region-wide',
                  city: 'City-wide', site: 'This establishment' };

  /* the meta line under the summary, assembled exactly as the frame prints it */
  function meta(m) {
    const head = [m.amEn, m.catEn, m.biz && m.biz.en].filter(Boolean).join(' · ');
    const links = [];
    if (m.biz && m.biz.lic) links.push({ text: 'Licence no. ' + m.biz.lic, href: null });
    if (m.src && m.src.u) links.push({ text: (m.src.pEn || 'Source') + ' ↗', href: m.src.u });
    else if (m.src && m.src.pEn) links.push({ text: m.src.pEn, href: null });
    return { head: head + (links.length ? ' · ' : ''), links, sep: ' · ' };
  }

  /* the inspection record card — only cases that carry one */
  function record(m) {
    if (!m.insp) return null;
    const rows = [];
    if (m.insp.d != null) rows.push(['Last inspection', m.insp.d + ' days ago' + (m.insp.stale ? ' · overdue' : ''), true]);
    if (m.insp.byEn) rows.push(['Carried out by', m.insp.byEn]);
    if (m.insp.resEn) rows.push(['Result', m.insp.resEn]);
    return rows;
  }

  /* which readings a subject can carry. Location is always true — every case
     has a coordinate. Media is true only where the document ships footage. */
  function lensesOf(m) {
    const out = ['location'];
    const hasClip = (m.media || []).some(x => x.a && (x.a.t === 'vid' || x.a.t === 'img'));
    if (hasClip) out.push('media');
    if ((m.media || []).some(x => x.kind === 'lens')) out.push('scene');
    if (objectsOf(m).length) out.push('objects');
    return out;
  }

  /* The footage the document ships for this case. cv-media.js is 900KB of
     base64 and is deferred, so the keys are held and resolved at render time
     rather than read here — see FocusModel.asset(). */
  function clipOf(m) {
    const frames = (m.media || []).filter(x => x.a).map(x => ({
      kind: x.a.t === 'vid' ? 'video' : 'image', key: x.a.k,
      posterKey: x.a.p || null, caption: x.en,
    }));
    if (!frames.length) return null;
    return Object.assign({}, frames[0], { frames });
  }

  /* the BaladyLens reading. The document names the scene; the imagery under it
     is one illustrative frame and says so on screen. */
  function sceneOf(m) {
    const all = (m.media || []).filter(x => x.kind === 'lens');
    if (!all.length) return null;
    return { readings: all.map(l => ({ caption: l.en, scene: l.scene })), caption: all[0].en, scene: all[0].scene };
  }

  /* the shelf thumbnail. taif's is a real frame from the document; the two
     national programmes show the planet they are read on; the rest are the
     frames exported from the design, and jeddah carries none, as the frame
     itself draws it. */
  function thumbOf(m) {
    if (m.id === 'taif') return { key: 'taif_still' };
    if (m.kind === 'plan') return { src: 'assets/focus/img/planet-thumb.png' };
    if (m.id === 'clean') return { src: 'assets/focus/img/sig-street.png' };
    if (m.id === 'qassim') return { src: 'assets/focus/img/sig-radar.png' };
    return null;
  }

  /* ── the objects under the case ────────────────────────────────────────
     cv-core generates a register of operational hotspots per district: what
     was detected, on which street, how many recorded cases, how many still
     open, and how many days ago it was last seen. Those are the objects the
     lens looks at. Every field below is read; none is invented — and the
     things the register does not hold (a captured frame, an object id, a
     wall-clock timestamp) are absent here rather than filled in.

     The register is keyed by district and the cases name a city, so the
     districts under the case's city are asked in turn until one answers. */
  function districtsOf(uid) {
    const kids = (CV.kidsOf ? CV.kidsOf(uid) : []) || [];
    if (kids.length) return kids.map(k => (typeof k === 'string' ? k : k.id));
    return (CV.subDistricts ? CV.subDistricts(uid) : []).map(d => d.id || d);
  }

  function objectsOf(m) {
    if (!CV.hotspots) return [];
    const out = [];
    for (const d of districtsOf(m.uid)) {
      for (const h of CV.hotspots(d) || []) {
        const dist = CV.U[h.dist] || {};
        out.push({
          id: h.id,
          what: h.t.en,
          icon: h.t.ic,
          sev: h.sev,
          colour: sevColour(h.sev),
          band: h.sev,
          street: h.st ? h.st.en : null,
          district: dist.en || null,
          ll: h.ll,
          radius: h.m,
          cases: h.n,
          open: h.open,
          repeat: h.rep,
          /* the only recency the register carries: whole days, 0..9 */
          lastDays: h.last,
          evidence: (h.t.ev || []).map(e => e[1]),
          action: h.t.act ? h.t.act[1] : null,
          domain: h.t.dom,
          kpi: h.t.kpi,
        });
      }
      if (out.length >= 8) break;
    }
    return out.sort((a, b) => b.sev - a.sev || b.cases - a.cases).slice(0, 8);
  }

  /* ── what happens next ─────────────────────────────────────────────────
     The second half of the argument. The first half is the record: what
     happened, where, who is connected. This is the other one — what the same
     record does over the next twelve months if nothing is done, and what it
     does with the package of measures above.

     Both lines come from the document's own machinery: CV.project fits the
     last six observed months, FM.line continues that slope, and the action
     branch adds the source's own rule for what a package is worth — 45% of
     the distance to target, spread across the horizon. That is a whole-package
     figure, not the sum of the measures listed beside it, and the card says so
     rather than implying that ticking Commit moved the line. */
  const BANDNAME = ['On target', 'Near target', 'Moderate', 'Off track', 'Critical'];

  function outlook(m) {
    const FMx = window.FM;
    if (!FMx || !FMx.line || !CV.K) return null;
    const k = (m.sub && CV.K[m.sub.k]) ? m.sub.k
            : ((m.kpis || []).map(r => r.k).find(x => CV.K[x]) || null);
    if (!k) return null;
    const uid = m.uid, K = CV.K[k], end = FMx.SPAN - 1;
    const base = FMx.line(uid, k, 'base'), act = FMx.line(uid, k, 'act');
    const nowV = base[FMx.NOW];
    const risks = FMx.risks(uid, k);

    const row = (label, v, sub) => ({
      label, value: CV.fmtV(k, v), colour: BAND[CV.band(k, v)],
      band: BANDNAME[CV.band(k, v)], sub: sub || null,
    });
    const gapOf = (v) => {
      const g = CV.gap(k, v);
      return (g >= 0 ? '+' : '') + g.toFixed(K.dec) + (SUFFIX[K.u] || '');
    };

    return {
      kpi: k,
      name: CV.nm(K),
      horizon: FMx.monthLabel(end),
      /* a scope whose forecast never changes band carries no risk, and says
         that instead of borrowing the word */
      headline: risks.length
        ? 'Projected risk if no action is taken'
        : 'No band change is projected on this KPI',
      standing: risks.length
        ? risks.map(r => FMx.monthLabel(r.i) + ' — falls to ' + BANDNAME[r.band].toLowerCase()).join(' · ')
        : 'The trend on ' + CV.nm(K) + ' is not what this event turns on. The slice above is.',
      rows: [
        row('Today', nowV),
        row('No action · ' + FMx.monthLabel(end), base[end]),
        row('With the action package · ' + FMx.monthLabel(end), act[end]),
      ],
      gap: { now: gapOf(nowV), base: gapOf(base[end]), act: gapOf(act[end]) },
      delta: (Math.abs(act[end] - base[end])).toFixed(K.dec) + (SUFFIX[K.u] || ''),
      note: 'Continues the slope of the last six observed months. The action branch applies the ' +
            'source\u2019s own rule for a package — 45% of the distance to target, spread over ' +
            FMx.FUT + ' months — and is not attached to any single measure above.',
      /* the only place the document quantifies a named measure against the gap
         it closes: which driver, whose it is, and what share it carries */
      drivers: (CV.driversFor ? CV.driversFor(uid, k) : []).slice(0, 3).map(d => ({
        what: d.en,
        evidence: String(d.evTxt || '').replace(/<[^>]*>/g, ''),
        share: Math.round((d.share || 0) * 100),
        closes: Math.round((d.up || 0) * 100),
        owner: d.own ? d.own.en : null,
        act: d.act ? d.act.en : null,
      })),
    };
  }

  function build(m) {
    const kpis = (m.kpis || []).map(r => metric(m.uid, r)).filter(Boolean);
    /* a planned event carries the slice but not yet a reading of it; the card
       says that rather than printing a 40px em dash */
    const sub = m.sub
      ? (m.sub.v == null
          ? { name: m.sub.en, caption: m.sub.nEn, pending: 'Not yet measured · target ' + fmt(m.sub.tgt, m.sub.u, 0) }
          : { name: m.sub.en, caption: m.sub.nEn, value: fmt(m.sub.v, m.sub.u, m.sub.u === '%' ? 0 : 1),
              target: fmt(m.sub.tgt, m.sub.u, 0),
              colour: BAND[bandOf(m.sub.v, m.sub.tgt, 1)],
              ...track(m.sub.v, m.sub.tgt, m.sub.u, 1) })
      : null;

    return {
      id: m.id,
      kind: m.kind,
      title: m.en,
      owner: m.amEn,
      category: m.catEn,
      band: sevColour(m.sev),
      thumb: thumbOf(m),
      lenses: lensesOf(m),

      ll: m.ll, zoom: m.zoom, uid: m.uid,

      /* the KPI this case turns on. The timeline strip and the forecast read
         the record at this (uid, kpi) pair — it is the same slice the concern
         card names, so the two never disagree. */
      kpi: m.sub ? m.sub.k : null,
      kpiDom: m.sub ? m.sub.dom : null,

      summary: m.detEn.slice(),
      meta: meta(m),

      timeline: (m.tl || []).map(r => ({ t: r.tEn, x: r.en, st: r.st })),
      record: record(m),

      concern: sub,
      note: m.kpiNote ? m.kpiNote.en : null,
      kpis,
      /* what to do. Owned, dated and scoped, with the effect sentence the
         author wrote — and nothing where they wrote none. `sc` is kept raw so
         the kingdom-wide measures, the only ones that stop the same event in
         another city, can be marked as such. */
      prevention: (m.prev || []).map((p, n) => ({
        n, what: p.en, due: p.dueEn || null, by: p.byEn || null,
        when: [p.dueEn, p.byEn].filter(Boolean).join(' · '),
        effect: p.effEn || null,
        sc: p.sc || null,
        scope: SCOPE[p.sc] || null,
      })),
      actions: (m.acts || []).map(a => ({ what: a.en, when: a.whenEn, by: a.byEn })),

      clip: clipOf(m),
      scene: sceneOf(m),
      objects: objectsOf(m),
      outlook: outlook(m),
    };
  }

  let cache = null;
  window.FocusModel = {
    subjects() { return cache || (cache = CV.MON.map(build)); },
    /* Re-read every subject at wherever the timeline handle now stands — but
       only the part of it that the handle can change. This used to run the
       whole of build() for all six records on every tick of a drag, and one
       field in the whole record reads the clock: metric() is the only thing
       reachable from here that goes near FM.ti, and only `kpis` is made of it.
       `concern` comes off m.sub verbatim, `outlook` measures from SPAN and NOW,
       and objectsOf reads the memoised hotspots — all of them the same at every
       month. The object itself is still refilled rather than replaced, so
       everything already holding a reference to one — the shelf, the globe, the
       open thread — keeps it. A new time-dependent field would have to be
       re-read here too. */
    refresh() {
      if (!cache) return this.subjects();
      CV.MON.forEach((m, i) => {
        cache[i].kpis = (m.kpis || []).map(r => metric(m.uid, r)).filter(Boolean);
      });
      return cache;
    },
    byId(id) { return this.subjects().find(s => s.id === id) || null; },
    /* The document's own media, once cv-media.js has arrived. That file
       declares `const ASSET = {...}` at the top level of a classic script, so
       the binding is a global lexical one and never appears on `window`. */
    assets() { try { return ASSET; } catch (e) { return null; } },
    asset(key) { const A = this.assets(); return key && A ? A[key] || null : null; },
    hasMedia() { return !!this.assets(); },
    BAND,
  };
})();
