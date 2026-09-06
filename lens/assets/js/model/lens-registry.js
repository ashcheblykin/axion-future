/* =============================================================================
   lens-registry.js — what a lens is.

   A lens is a way of showing the data of one and the same subject. Two lenses
   can both be maps: one says "the problem is here", the next says "here is how
   often this ground was surveyed". Which series a subject carries is decided in
   subject.js by its domain; whether a lens can draw at all is decided here, by
   needs().
   ============================================================================= */
(function () {
  const REG = {};
  window.Lenses = {
    def(spec) { REG[spec.id] = spec; return spec; },
    get: id => REG[id],
    has: id => !!REG[id],
    ids: () => Object.keys(REG),
    label(id) { const l = REG[id]; return l ? LVT(l.label) : id; },
  };
})();
