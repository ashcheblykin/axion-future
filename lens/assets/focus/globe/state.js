/* =============================================================================
   state.js — one state object, one event bus, one time model.
   Every view reads from here; nothing keeps a private copy of the scope,
   the selected KPI or the point in time.
   ============================================================================= */
(function () {
  const OBS = 18;          /* observed months in CV.MONTHS: Mar-2025 … Aug-2026 */
  /* The horizon is thirteen months, not twelve, so the scale runs Mar-2025 …
     Sep-2027: thirty-one months, both ends on a quarter, and the strip's row
     of months is the frame's own eleven — Mar 2025 to Sep 2027, every third. */
  const FUT = 13;          /* projected months: Sep-2026 … Sep-2027             */
  const NOW = OBS - 1;     /* index of "now" on the timeline                    */

  const listeners = {};
  const FM = {
    OBS, FUT, NOW, SPAN: OBS + FUT,

    /* ---- state ------------------------------------------------------- */
    uid: 'KSA',
    kpi: 'comp',
    view: 'globe',            /* 'globe' | 'map' | 'canvas' | 'dataset' */
    /* Which territorial division is painted and clickable. This is the one
       control the interface offers over geography; `view` is derived from it
       and is no longer something the user switches by hand.                  */
    scale: 'country',        /* 'country' | 'region' | 'city' | 'district'     */
    hot: null,               /* hotspot id when drilled past district          */
    ti: NOW,                 /* timeline index, 0 … OBS+FUT-1                   */
    branch: 'base',          /* 'base' | 'act' — which forecast line is read    */
    paused: false,
    lang: 'en',
    booted: false,

    /* ---- bus --------------------------------------------------------- */
    on(ev, fn) { (listeners[ev] || (listeners[ev] = [])).push(fn); return fn; },
    emit(ev, p) { (listeners[ev] || []).forEach(fn => fn(p)); },

    /* ---- scope ------------------------------------------------------- */
    unit() { return CV.U[this.uid]; },
    level() { return this.hot ? 4 : CV.levelOf(this.uid); },
    hotspot() { return this.hot ? CV.hotById(this.hot) : null; },
    chain() {
      const out = []; let u = CV.U[this.uid];
      while (u) { out.unshift(u); u = u.p ? CV.U[u.p] : null; }
      return out;
    },
    kids() { return CV.kidsOf(this.uid); },

    setScope(uid, hot) {
      if (uid === this.uid && (hot || null) === this.hot) return;
      this.uid = uid; this.hot = hot || null;
      this.emit('scope', this);
    },
    up() {
      if (this.hot) { this.hot = null; this.emit('scope', this); return; }
      const u = CV.U[this.uid];
      if (u && u.p) { this.uid = u.p; this.emit('scope', this); }
    },
    setKpi(id) { if (id === this.kpi) return; this.kpi = id; this.emit('kpi', id); },
    setView(v) { if (v === this.view) return; this.view = v; this.emit('view', v); },
    setScale(s) { if (s === this.scale) return; this.scale = s; this.emit('scale', s); },
    /* the division a unit belongs to — used to answer "which chip is this?" */
    scaleOf(uid) { return ['country', 'region', 'city', 'district'][Math.min(3, CV.levelOf(uid || this.uid))]; },

    /* ---- time -------------------------------------------------------- */
    isFuture() { return this.ti > NOW; },
    setTime(i, branch) {
      i = Math.max(0, Math.min(this.SPAN - 1, Math.round(i)));
      const b = branch || this.branch;
      if (i === this.ti && b === this.branch) return;
      this.ti = i; this.branch = b;
      CV.PER = Math.min(i, NOW);            /* the CityView engine only knows observed months */
      this.emit('time', this);
    },
    monthLabel(i) {
      if (i < OBS) return CV.mLabel(i);
      const k = i - OBS, m = (8 + k) % 12, y = 2026 + Math.floor((8 + k) / 12);
      return (this.lang === 'ar' ? CV.MN_AR[m] : CV.MN_EN[m]) + ' ' + y;
    },

    /* ---- values ------------------------------------------------------ */
    /* observed value of a KPI at a unit, at the current observed period */
    obs(uid, kpi) { return CV.at(uid, kpi || this.kpi); },

    /* full 31-point line: 18 observed + 13 projected on the given branch  */
    line(uid, kpi, branch) {
      kpi = kpi || this.kpi;
      const key = uid + '|' + kpi + '|' + (branch || 'base');
      if (LC[key]) return LC[key];
      const per = CV.PER; CV.PER = NOW;                    /* project from "now", not from the scrub */
      const s = CV.series(uid, kpi).slice(0, OBS);
      const p = CV.project(uid, kpi);                      /* source-defined 6-month linear fit */
      CV.PER = per;
      const kd = CV.K[kpi];
      const lo = kd.u === 'd' ? 1.2 : kd.u === 'r' ? 1.5 : 15;
      const hi = kd.u === 'd' ? 30 : kd.u === 'r' ? 34 : 100;
      /* the action package moves the KPI by the same rule the source uses for
         insight impact — 45% of the gap to target — spread over the horizon.  */
      const g = Math.abs(CV.gap(kpi, s[NOW]));
      const lift = (branch === 'act') ? (g * .45 / FUT) * kd.dir : 0;
      const out = s.slice();
      for (let k = 1; k <= FUT; k++) {
        out.push(Math.max(lo, Math.min(hi, s[NOW] + p.slope * k + lift * k * (branch === 'act' ? 1 : 0))));
      }
      LC[key] = out; return out;
    },

    /* value shown right now, honouring the timeline position and branch  */
    val(uid, kpi) {
      const i = this.ti;
      if (i <= NOW) return CV.at(uid, kpi || this.kpi);
      return this.line(uid, kpi, this.branch)[i];
    },

    /* forecast months where the KPI degrades into a worse band than today */
    risks(uid, kpi) {
      kpi = kpi || this.kpi;
      const l = this.line(uid, kpi, 'base'), b0 = CV.band(kpi, l[NOW]), out = [];
      let seen = b0;
      for (let i = NOW + 1; i < this.SPAN; i++) {
        const b = CV.band(kpi, l[i]);
        if (b > seen) { out.push({ i, band: b, from: seen, v: l[i] }); seen = b; }
      }
      return out;
    },

    /* the nearest scope up the chain that actually carries a projected risk —
       a district can be improving while the city it sits in is degrading */
    riskScope(kpi) {
      const chain = this.chain().map(u => u.id).reverse();
      for (const id of chain) { const r = this.risks(id, kpi); if (r.length) return { uid: id, risks: r }; }
      return null;
    },

    clearCache() { for (const k in LC) delete LC[k]; },
  };
  const LC = {};
  window.FM = FM;
})();
