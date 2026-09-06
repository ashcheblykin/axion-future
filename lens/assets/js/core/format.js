/* =============================================================================
   format.js — escaping, numbers, band colours.
   Band colours come from the source dataset (BANDC_D), never from a hex written
   here; tokens.css mirrors the same five values so CSS and canvas agree.
   ============================================================================= */
(function () {
  const esc = s => String(s == null ? '' : s)
    .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* the source document writes <b> into some of its strings on purpose */
  const rich = s => String(s == null ? '' : s).replace(/<(?!\/?b>)/g, '&lt;');

  const bandVar = b => 'var(--band-' + Math.max(0, Math.min(4, b | 0)) + ')';

  /* severity in the source is 0..4 for cases, and a word for the register */
  const sevBand = s => typeof s === 'number'
    ? Math.max(0, Math.min(4, s))
    : ({ crit: 4, high: 3, med: 2, low: 1 }[s] !== undefined ? { crit: 4, high: 3, med: 2, low: 1 }[s] : 2);

  window.LVF = { esc, rich, bandVar, sevBand };
})();
