/* =============================================================================
   state.js — one state object, one bus, one URL.
   The Lens is a view over a subject, so the subject is the state. Territory is
   not: it is an attribute of whatever is in view, never a filter the user drives.
   ============================================================================= */
(function () {
  const listeners = {};

  const LV = {
    /* ---- state ------------------------------------------------------- */
    route: 'stub',            /* 'stub' | 'lens'                           */
    stub: 'feed',             /* 'feed' | 'insights' | 'agents'            */
    subject: null,            /* 'event:taif' | 'insight:khobar_vp' | null */
    lensId: null,             /* which representation is on the stage      */
    lang: 'en',
    entry: 'feed',            /* where the Lens was called from            */

    /* ---- bus --------------------------------------------------------- */
    on(ev, fn) { (listeners[ev] || (listeners[ev] = [])).push(fn); return fn; },
    emit(ev, p) { (listeners[ev] || []).forEach(fn => fn(p)); },

    /* ---- the one entry point ----------------------------------------- */
    /* Lens.open() in the plan: a subject, and where the call came from.
       Everything else — which widgets explain it, which lenses it carries,
       which one opens first — is derived from the subject itself.          */
    open(ref, entry) {
      const key = typeof ref === 'string' ? ref : ref.kind + ':' + ref.id;
      const s = Subjects.get(key);
      if (!s) return false;
      this.subject = key;
      this.entry = entry || 'feed';
      this.lensId = Subjects.firstLens(s, this.entry);
      this.route = 'lens';
      this.sync();
      this.emit('route', this);
      return true;
    },
    close() {
      this.route = 'stub';
      this.sync();
      this.emit('route', this);
    },
    setStub(id) {
      if (id === this.stub && this.route === 'stub') return;
      this.stub = id; this.route = 'stub';
      this.sync(); this.emit('route', this);
    },
    setLens(id) {
      if (id === this.lensId) return;
      this.lensId = id;
      this.sync(); this.emit('lens', id);
    },
    stepLens(d) {
      const s = this.current(); if (!s) return;
      const n = s.lenses.length; if (!n) return;
      const i = Math.max(0, s.lenses.indexOf(this.lensId));
      this.setLens(s.lenses[(i + d + n * 2) % n]);
    },
    stepSubject(d) {
      const list = Subjects.ribbon();
      const i = list.findIndex(x => x.key === this.subject);
      const n = list.length; if (!n) return;
      const next = list[((i < 0 ? 0 : i) + d + n * 2) % n];
      this.open(next.key, this.entry);
    },
    setLang(l) {
      if (l === this.lang) return;
      this.lang = l;
      CV.LANG = l;
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      this.sync(); this.emit('lang', l);
    },

    current() { return this.subject ? Subjects.get(this.subject) : null; },

    /* ---- the URL is the state, so a demo can be rehearsed ------------- */
    sync() {
      const q = new URLSearchParams();
      if (this.lang !== 'en') q.set('lang', this.lang);
      if (this.route === 'lens') {
        q.set('subject', this.subject);
        if (this.lensId) q.set('lens', this.lensId);
        if (this.entry !== 'feed') q.set('from', this.entry);
      } else if (this.stub !== 'feed') q.set('stub', this.stub);
      const s = q.toString();
      history.replaceState(null, '', s ? '?' + s : location.pathname);
    },
    readLang() {
      const lang = new URLSearchParams(location.search).get('lang');
      if (lang !== 'ar' && lang !== 'en') return;
      this.lang = lang; CV.LANG = lang;
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    },
    read() {
      const q = new URLSearchParams(location.search);
      const stub = q.get('stub');
      if (stub) this.stub = stub;
      const subj = q.get('subject');
      if (subj && Subjects.get(subj)) {
        this.subject = subj;
        this.entry = q.get('from') || 'feed';
        this.route = 'lens';
        const l = q.get('lens');
        const s = Subjects.get(subj);
        this.lensId = (l && s.lenses.indexOf(l) >= 0) ? l : Subjects.firstLens(s, this.entry);
      }
    },
  };

  window.LV = LV;
})();
