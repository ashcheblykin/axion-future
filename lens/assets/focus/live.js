/* =============================================================================
   live.js — the figures, recounted.

   Choosing another signal turns the right-hand column over: another slice,
   other KPIs, another forecast. Written straight into the DOM that arrives as
   a cut — the old readings are gone, the new ones are simply there, and
   nothing on screen ever says a figure was read again.

   This walks them across instead. Before the panels are rewritten it holds
   what every figure and every bar is showing; after they are, it puts each one
   back where it was and lets it travel to the new reading. The numbers count
   on a frame timer, the bars move on the stylesheet's own transition, and both
   are given the same duration and the same curve — focus.css states each of
   them once and this reads them off the page, so the two cannot drift apart.

   What is held is a slot, not a name: the third figure in the column rolls to
   whatever the third figure now is. That is the point. Nothing is pretending
   the same KPI moved — what is being shown is the column being read again.

   Two rules keep it honest:
   · the figure that lands is the one the panel wrote. Nothing here invents a
     number, or holds one back; it only shows the distance between two of them
     being crossed.
   · under prefers-reduced-motion nothing travels at all. Every figure and
     every bar is at its new reading from the first frame, which is exactly
     what the panel wrote — the recount is a flourish, never the message.
   ============================================================================= */
(function () {
  'use strict';

  const still = matchMedia('(prefers-reduced-motion:reduce)');

  /* Every figure on this screen that is read off the record: the big KPI
     number and the target beside it, the forecast rows and the gap under them,
     the share a driver carries and what the package is worth, and an object's
     four counts and its KPI reading. A slot the panel leaves without a number
     in it — an em dash, a band's name, "not yet measured" — is simply not a
     figure, and is left exactly where the panel put it.

     "Last detected 3 days ago" is deliberately not here. It is a sentence, not
     a quantity: counting it prints "1 days ago" on the way, and starts a card
     whose reading was "today" at "0 days ago". A figure crossing to its new
     reading is plainly in motion; a sentence doing it is just wrong for as
     long as it takes. */
  const FIGURES = '.metric-v,.metric-t,.ol-v,.ol-b,.cap b,.obj-counts dd,.obj-kpi b';
  const SLOTS = FIGURES + ',.bar';
  /* what a recount cascades down: one delay per reading, not per number, so a
     figure and the bar under it always move together */
  const CARDS = '.card,.obj';

  /* the motion, read off the page — focus.css holds the only copy */
  let T = null;
  const num = (k, fb) => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(k));
    return v > 0 ? v : fb;
  };
  const motion = () => T || (T = { run: num('--live-run', 560), step: num('--live-step', 28) });
  const LAST = 8;                      /* how far down a column the cascade runs */

  /* ── reading a figure ───────────────────────────────────────────────────
     A figure is a number inside a sentence: "1,205 / 10k", "+3.4%", "12 days
     max", "42% of the gap". What travels is the number. The words on either
     side of it belong to the panel that has just been written, and are in
     place from the first frame — only the quantity is in motion. */
  const NUM = /[-+]?\d[\d,]*(?:\.\d+)?/;
  function figure(txt) {
    const m = NUM.exec(txt);
    if (!m) return null;
    const raw = m[0], dot = raw.indexOf('.');
    return {
      pre: txt.slice(0, m.index),
      post: txt.slice(m.index + raw.length),
      v: +raw.replace(/,/g, ''),
      /* the decimals, the thousands and the leading + are the document's own
         way of printing this number, so a count on the way to it prints the
         same way rather than in some house format of its own */
      dec: dot < 0 ? 0 : raw.length - dot - 1,
      grp: raw.indexOf(',') >= 0,
      plus: raw[0] === '+',
    };
  }
  const write = (f, v) =>
    f.pre + (f.plus && v >= 0 ? '+' : '') +
    (f.grp ? v.toLocaleString('en-US', { minimumFractionDigits: f.dec, maximumFractionDigits: f.dec })
           : v.toFixed(f.dec)) + f.post;

  /* ── the count ──────────────────────────────────────────────────────────
     One timer for every figure in flight. A figure whose element has left the
     page — the panel was written again while it was still counting — is
     dropped rather than counted at a node nobody can see. */
  const rolling = new Set();
  let beat = 0;
  const ease = (t) => 1 - Math.pow(1 - t, 3);      /* the curve --live-ease names */

  function frame(now) {
    beat = 0;
    for (const j of rolling) {
      if (!j.el.isConnected) { rolling.delete(j); continue; }
      const t = (now - j.t0) / j.run;
      if (t <= 0) continue;                        /* still waiting its turn */
      j.el.textContent = write(j.f, t >= 1 ? j.f.v : j.from + (j.f.v - j.from) * ease(t));
      if (t >= 1) rolling.delete(j);
    }
    if (rolling.size) beat = requestAnimationFrame(frame);
  }

  function count(el, from, f, wait) {
    el.textContent = write(f, from);               /* it starts where it stood */
    rolling.add({ el, from, f, t0: performance.now() + wait, run: motion().run });
    if (!beat) beat = requestAnimationFrame(frame);
  }

  /* A page nobody is looking at is given no frames at all, and a figure frozen
     half way to its reading is the one thing this must never leave behind. So
     when the tab goes away, every count in flight lands at once — the panel's
     own number, on screen, waiting to be come back to. */
  function land() {
    for (const j of rolling) if (j.el.isConnected) j.el.textContent = write(j.f, j.f.v);
    rolling.clear();
    if (beat) cancelAnimationFrame(beat);
    beat = 0;
  }
  addEventListener('visibilitychange', () => { if (document.hidden) land(); });

  /* ── a bar ──────────────────────────────────────────────────────────────
     Three parts, and each means something: the fill is the reading, the
     hatched piece past it is the overshoot a lower-is-better KPI is carrying,
     and the tick is the target. All three are placed in percent by focus.js,
     so all three can simply be put back and let go. */
  function hold(bar) {
    const w = bar.offsetWidth;
    const i = bar.querySelector('i'), s = bar.querySelector('s'), u = bar.querySelector('u');
    /* where it is now, not where it was told to end: a signal chosen while the
       last recount is still running is picked up from the picture on screen */
    const wide = (el) => (w > 0 ? el.offsetWidth / w * 100 : parseFloat(el.style.width) || 0);
    const from = (el) => (w > 0 ? el.offsetLeft / w * 100 : parseFloat(el.style.left) || 0);
    return { fill: i ? wide(i) : 0, mark: u ? from(u) : null,
             over: s ? { l: from(s), w: wide(s) } : null };
  }

  function move(bar, was, wait) {
    const i = bar.querySelector('i'), s = bar.querySelector('s'), u = bar.querySelector('u');
    const parts = [i, s, u].filter(Boolean);
    if (!parts.length) return;
    const to = { i: i && i.style.width, sl: s && s.style.left, sw: s && s.style.width, u: u && u.style.left };

    for (const el of parts) el.style.transition = 'none';
    /* A bar the column was not carrying a moment ago sweeps in from nothing,
       and its target tick is already where it belongs: a mark travelling in
       from the left edge of a card that has only just appeared says nothing
       about a target, only about an animation. */
    if (i) i.style.width = (was ? was.fill : 0) + '%';
    if (s) {
      s.style.left = (was ? (was.over ? was.over.l : was.mark) : parseFloat(to.sl) || 0) + '%';
      s.style.width = (was && was.over ? was.over.w : 0) + '%';
    }
    if (u && was && was.mark != null) u.style.left = was.mark + '%';
    void bar.offsetWidth;                          /* and that is where it is */

    for (const el of parts) { el.style.transition = ''; el.style.transitionDelay = wait + 'ms'; }
    if (i) i.style.width = to.i;
    if (s) { s.style.left = to.sl; s.style.width = to.sw; }
    if (u) u.style.left = to.u;
  }

  /* ── the one call ───────────────────────────────────────────────────────
     Hold what these roots are showing, let the caller write them again, and
     walk everything across. The caller keeps the writing: this never renders
     anything, and a page whose script order left it out still gets the panels,
     complete, at their new readings. */
  function scan(root) {
    const fig = [], bar = [], wait = new Map();
    const cards = [...root.querySelectorAll(CARDS)];
    for (const el of root.querySelectorAll(SLOTS)) {
      if (el.classList.contains('bar')) bar.push(el); else fig.push(el);
      const card = el.closest(CARDS);
      wait.set(el, Math.min(Math.max(cards.indexOf(card), 0), LAST));
    }
    return { fig, bar, wait };
  }

  function over(roots, rewrite) {
    const under = (roots || []).filter(Boolean);
    /* and a panel written while the tab is away is simply written: there is
       nobody to show the crossing to, and no frames to show it in */
    if (still.matches || document.hidden || !under.length) { rewrite(); return; }

    const held = under.map(root => {
      const at = scan(root);
      return { root, fig: at.fig.map(el => figure(el.textContent)), bar: at.bar.map(hold) };
    });

    rewrite();

    const step = motion().step;
    for (const h of held) {
      const at = scan(h.root);
      at.fig.forEach((el, n) => {
        const to = figure(el.textContent);
        if (!to) return;                           /* a slot with no number in it */
        const was = h.fig[n];
        /* a figure the column was not carrying counts up from nothing */
        const from = was ? was.v : 0;
        if (from === to.v) return;                 /* and one that has not moved stands still */
        count(el, from, to, at.wait.get(el) * step);
      });
      at.bar.forEach((bar, n) => move(bar, h.bar[n] || null, at.wait.get(bar) * step));
    }
  }

  window.FocusLive = { over };
})();
