/* =============================================================================
   rim.js — what the edge of a panel catches.

   Every panel on this screen is a dark sheet of glass standing over scenery:
   the planet, the region wash under it, a photograph of a street. The glass
   already borrows the scenery's blur, but its EDGE borrows nothing — the
   umbra's hairline is the same white at 25% the whole way round, whether that
   stretch of edge passes over empty space or over the green of a region
   reading 81%.

   This gives the edge back what it is standing next to. Each rim is sampled
   against the scenery just outside it, point by point, and painted with what
   is found there: the stretch crossing a green region goes green, the stretch
   crossing the void stays as it was.

   It is deliberately a PARTIAL thing. Ground that is dark and colourless —
   which most of a night basemap is — reflects nothing at all, so a rim is lit
   in places and plain everywhere else. A rim tinted evenly all the way round
   would read as a coloured border, and a border is a different statement: it
   says "this panel is green", where a reflection says "there is something
   green beside this panel". Only the second one is true.

   ── how it works ────────────────────────────────────────────────────────
   Once a pass the scenery is redrawn into one small image — 220 pixels wide,
   so a texel covers about six on screen — and read back in a single call.
   Every panel then samples THAT rather than the page: a dozen panels asking a
   1280×720 canvas for forty patches each is five hundred readbacks a frame,
   and this is one.

   The small image is also the blur, and has to be. A rim wants the colour of a
   neighbourhood, not of a pixel — a region's white label should not put a
   white flare on the edge beside it — and a downscale is exactly that
   averaging, done by the part of the machine that is good at it.

   Each rim is then one conic-gradient. A conic gradient reads its colour from
   the ANGLE of a pixel about the centre, and every point on the perimeter of a
   convex box has its own angle, corners included — so walking the perimeter
   and emitting one stop per step lands each sampled colour exactly where it
   was sampled, with the gradient carrying the falloff between them. No layer
   per side, and no seam at a corner.

   ── what is beside a panel is often another panel ───────────────────────
   Two readings in a column stand 8px apart, and the scenery shows in that 8px.
   So a point does not look once at a fixed distance — which would mostly land
   ON the next card and report a dark sheet — it walks outward and takes the
   first look that is not behind another sheet of glass. In a gutter that is
   the map, four pixels out; in the open it is the map a little further out;
   and where a panel really is shoulder to shoulder with another, every look is
   blocked and all that is left is what still reads through 80% black. Which is
   the honest answer: an edge lit by a neighbour that is itself unlit should
   stay unlit.

   ── what it is not ─────────────────────────────────────────────────────
   Not backdrop-filter. A ring with `backdrop-filter:saturate()` would be a
   truer reflection and would cost nothing to write, and it is wrong here for a
   reason the screen has already settled: focus.css turns EVERY backdrop filter
   off while the camera moves (measured there at 88ms a frame with them live
   and 35 without), and on the globe the camera is never quite still. The
   reflection would go missing exactly while the scenery moved under it, which
   is the moment it is worth having. This carries no blur, so it stays.

   Not a sheet laid over the screen either. A card scrolling out of a column
   fades on its own mask, and a rim that is part of the card fades with it for
   nothing; a rim drawn on a sheet above would have to be told.
   ============================================================================= */
(function () {
  'use strict';

  /* Every sheet of glass with scenery beside it. focus.css names the same four
     on the .rim rule, where the list is what gives that rule the weight to
     keep the layer out of a summary's flow — the two are read together.

     A subcard is not here: what is beside one is the reading it sits in, which
     is another panel, and a panel reflected in a panel says nothing. */
  const GLASS = '.panel:not(.subcard),.obj,.summary,.media';

  /* What the scenery IS, in the order it is painted. The planet is always
     there; the street capture and the clip stand over it when their reading is
     the one being shown — and on a machine without WebGL2 the capture is its
     photograph, which is a different element and has to be named too. */
  const GROUND = ['#world', '#scene3d', '#sceneStill', '#media img', '#media video'];

  /* The numbers, read off the page — focus.css holds the only copy of each,
     the way it does for the recount's timings. */
  let T = null;
  const num = (k, fb) => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(k));
    return Number.isFinite(v) ? v : fb;
  };
  const tune = () => T || (T = {
    reach: num('--rim-reach', 14),   /* how far past its own edge a rim looks  */
    step:  num('--rim-step', 40),    /* how often it looks, walking that edge  */
    floor: num('--rim-floor', .08),  /* this far above the rest starts to show */
    ceil:  num('--rim-ceil', .28),   /* this far above it reflects in full     */
    lit:   num('--rim-lit', .3),     /* the strongest a rim is ever drawn      */
    ground:num('--rim-ground', .5),  /* a screen this bright shows nothing     */
    thru:  num('--rim-thru', .22),   /* what still reads through a panel       */
    mip:   num('--rim-mip', 220),    /* how wide the small copy of it all is   */
  });

  /* ── the small copy of the scenery ──────────────────────────────────────
     One canvas kept at the viewport's aspect, redrawn from whatever scenery is
     on screen and read back once a pass. `willReadFrequently` is the honest
     hint: this canvas exists in order to be read. The smoothing is asked for
     explicitly — the cheap downscale samples rather than averages, and a rim
     fed by point samples crawls as the map moves under it. */
  const mip = document.createElement('canvas');
  const mctx = mip.getContext('2d', { willReadFrequently: true });
  if (mctx) { mctx.imageSmoothingEnabled = true; mctx.imageSmoothingQuality = 'high'; }
  let px = null, mw = 0, mh = 0, vw = 0, vh = 0, off = false;

  function scenery() {
    vw = innerWidth; vh = innerHeight;
    if (!vw || !vh) return false;
    const wide = Math.max(2, Math.round(tune().mip));
    const tall = Math.max(2, Math.round(wide * vh / vw));
    if (mip.width !== wide || mip.height !== tall) {
      mip.width = mw = wide; mip.height = mh = tall;
      mctx.imageSmoothingEnabled = true; mctx.imageSmoothingQuality = 'high';
    }
    mctx.clearRect(0, 0, mw, mh);
    let drew = false;
    for (const sel of GROUND) {
      const el = document.querySelector(sel);
      if (!el || !el.isConnected) continue;
      /* offsetParent is null for a display:none element and everything inside
         one, which is what a lens that is not the current reading is. The
         planet is exempt: it is fixed to the viewport and has no parent to
         offset from. */
      if (el.id !== 'world' && el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      /* Two of the readings dim the planet under them — the clip's lens takes
         it to saturate(.7) brightness(.62), the objects grid to .6 and .5 —
         and those are CSS filters on the element, not paint in the canvas. A
         copy made from the canvas alone would reflect a map twice as bright as
         the one on screen. The canvas context takes the same filter syntax the
         stylesheet is written in, so it is handed over verbatim rather than
         restated here, and the copy dims with the page. */
      const f = getComputedStyle(el).filter;
      mctx.filter = f && f !== 'none' ? f : 'none';
      try {
        mctx.drawImage(el, r.left * mw / vw, r.top * mh / vh, r.width * mw / vw, r.height * mh / vh);
        drew = true;
      } catch (e) { /* a frame that is not there yet is not an error */ }
      mctx.filter = 'none';
    }
    if (!drew) return false;
    try { px = mctx.getImageData(0, 0, mw, mh).data; }
    catch (e) { off = true; return false; }   /* ground from another origin: stop */
    /* How dark the screen is, as one number: a light on black is the whole of
       this, and the same light on a daylight street is just the street. So
       every rim is scaled by how dark the scenery is as a whole — the night
       map with its washes is dark, however coloured, and a photograph is not,
       however shadowed the doorway a card happens to stand over. Measured on
       the card's own edge instead, a terracotta wall beside that doorway lit
       the tallest card to the ceiling on a screen that is bright everywhere.
       Every fourth pixel of the small copy is plenty to say which it is. */
    let lum = 0, n = 0;
    for (let i = 0; i < px.length; i += 16) { lum += .2126 * px[i] + .7152 * px[i + 1] + .0722 * px[i + 2]; n++; }
    dark = Math.max(0, 1 - (lum / n / 255) / tune().ground);
    return true;
  }
  let dark = 1;

  /* the colour of a neighbourhood, asked for in the page's own coordinates */
  function look(x, y) {
    const cx = Math.round(x * mw / vw), cy = Math.round(y * mh / vh);
    let r = 0, g = 0, b = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const ax = cx + dx, ay = cy + dy;
      if (ax < 0 || ay < 0 || ax >= mw || ay >= mh) continue;
      const i = (ay * mw + ax) * 4;
      r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
    }
    return n ? [r / n, g / n, b / n] : null;
  }

  /* ── ground into light ──────────────────────────────────────────────────
     A rim is a highlight, not a swatch: it carries the HUE of what is beside
     it at the brightness of a lit edge, not that thing's own colour. So the
     sample is scaled until its strongest channel is full — which keeps the hue
     and throws the ground's darkness away — and how much of it is drawn is
     decided separately, from how much there was to reflect.

     How much there was is a matter of CONTRAST, not of brightness. What is
     measured for each point is how far it stands above the rest of the same
     edge: a green region beside a card on the night map stands a long way
     above the slate the rest of that card is standing in, and lights its
     stretch; a daylight street is bright the whole way round every panel, so
     no stretch stands above any other and the rim stays plain. The first
     version measured brightness outright and put an even pale ring round
     every card on the street reading — which is a border, and the one thing
     this was not meant to be. A bright colour on black is the whole effect;
     a bright colour on a bright ground is just the ground.

     Colour counts for most of that measure and light for less, because a
     white label on the map is bright and a region wash is coloured, and it is
     the second of these an edge should catch: at these weights the label is a
     glint and the wash is the reflection. */
  const score = ([r, g, b]) => {
    const hi = Math.max(r, g, b), lo = Math.min(r, g, b);
    return (.2126 * r + .7152 * g + .0722 * b) / 255 * .3 + (hi - lo) / 255 * 1.2;
  };
  function light(rgb, above, dim, t) {
    let a = (above - t.floor) / (t.ceil - t.floor);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    a *= t.lit * dim;
    const [r, g, b] = rgb, hi = Math.max(r, g, b);
    if (a < .006 || hi < 6) return null;              /* nothing worth drawing */
    const k = 255 / hi;
    return `rgba(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)},${a.toFixed(3)})`;
  }

  /* How far out each look is taken, as fractions of the reach — near enough to
     find the scenery in an 8px gutter, far enough to clear a shadow and reach
     open ground. The first one that is not behind glass is the answer. */
  const REACH = [.3, .7, 1, 1.6];
  const blocked = (x, y, over) => {
    for (let i = 0; i < over.length; i++) {
      const o = over[i];
      if (x >= o.left && x <= o.right && y >= o.top && y <= o.bottom) return true;
    }
    return false;
  };

  /* ── walking a perimeter ────────────────────────────────────────────────
     Clockwise from the top middle, so the angles a conic gradient wants come
     out already in order and the walk closes where it started. The corner
     radius is not walked: at 16px it moves a sample by five pixels, which is
     less than one step and a good deal less than one texel of the small copy.

     What is sampled is the point pushed straight OUT of the edge it stands on,
     never out of the centre — on a plate three times as wide as it is tall a
     ray from the centre leaves the top edge sideways and never clears it. */
  function rimOf(q, over, t) {
    const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
    const c = [[cx, q.top], [q.right, q.top], [q.right, q.bottom],
               [q.left, q.bottom], [q.left, q.top], [cx, q.top]];
    const pts = [];
    let walked = 0, next = 0;
    for (let s = 0; s < c.length - 1; s++) {
      const [x0, y0] = c[s], [x1, y1] = c[s + 1];
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
      if (len < .5) continue;
      const ux = dx / len, uy = dy / len;
      const nx = uy, ny = -ux;                    /* outward, walking clockwise */
      while (next < walked + len) {
        const d = next - walked;
        const ex = x0 + ux * d, ey = y0 + uy * d;             /* on the edge    */
        let rgb = null, dim = t.thru;
        for (let p = 0; p < REACH.length; p++) {
          const r = t.reach * REACH[p];
          const sx = ex + nx * r, sy = ey + ny * r;
          const c = look(sx, sy);
          if (!c) continue;                            /* past the screen edge */
          if (!rgb) rgb = c;                    /* keep the nearest as the last
                                                   resort, seen through glass */
          if (!blocked(sx, sy, over)) { rgb = c; dim = 1; break; }
        }
        /* the first stop is the top middle and is 0 by construction; saying so
           keeps a hair of floating point from starting the ring at 359.9 */
        const A = pts.length ? (Math.atan2(ex - cx, cy - ey) * 180 / Math.PI + 360) % 360 : 0;
        pts.push({ A, rgb, dim, s: rgb ? score(rgb) : 0 });
        next += t.step;
      }
      walked += len;
    }
    if (pts.length < 4) return '';
    /* The rest of the edge, which is what each point is measured against. Not
       the middle of the sorted scores: a card standing with two whole sides
       against a region has half its points lit, and the middle is then a lit
       one — the card measured itself against the very thing it was meant to
       catch and drew it at half strength. The darker third is the ground; a
       stretch is lit by how far it stands above that. On a daylight street the
       darker third is bright too, and the rim stays as quiet as before. */
    const sorted = pts.map(p => p.s).sort((a, b) => a - b);
    const rest = sorted[Math.floor(sorted.length * .35)];
    /* and `dark`, from the copy of the scenery, is how much of any of it the
       screen as a whole lets show — see scenery() */
    let any = false;
    const stops = pts.map(p => {
      const col = p.rgb && light(p.rgb, p.s - rest, p.dim * dark, t);
      if (col) any = true;
      return (col || 'rgba(255,255,255,0)') + ' ' + p.A.toFixed(1) + 'deg';
    });
    if (!any) return '';
    /* the ring has to close: the first stop again, one turn later */
    stops.push(stops[0].replace(/[\d.]+deg$/, '360deg'));
    return 'conic-gradient(from 0deg at 50% 50%,' + stops.join(',') + ')';
  }

  /* ── the layer ──────────────────────────────────────────────────────────
     A rim needs a surface of its own, and on these panels there is not one to
     borrow: ::before is the material every one of them is made of, and ::after
     is already three things — the journal's flash on a card, the brand ring on
     the reading a question was asked of, and the vignette on a clip. So the
     rim is an element. It is absolutely positioned and empty, so it is out of
     the flow, out of the accessibility tree, and invisible to everything that
     measures a panel or counts what is in one.

     It is put back rather than remembered. focus.js rewrites both columns
     whenever the subject or the month changes and takes every rim in them
     along, so each pass seats what it cannot find. */
  function layer(el) {
    let n = el.__rim;
    if (n && n.parentNode === el) return n;
    n = el.querySelector(':scope > .rim');
    if (!n) {
      n = document.createElement('i');
      n.className = 'rim';
      n.setAttribute('aria-hidden', 'true');
      el.appendChild(n);
    }
    el.__rim = n;
    return n;
  }

  /* ── the pass ───────────────────────────────────────────────────────────
     The scenery is copied again only when something under the panels can have
     changed — the camera moved, the window did, or a reading that draws its
     own pixels is on screen. Otherwise last pass's copy is still the truth and
     this is a dozen rectangles and a string compare. */
  let was = '', copied = -1e9, laid = '';
  const still = matchMedia('(prefers-reduced-motion:reduce)');

  function pass(now) {
    if (off) return;
    /* A rim re-tinting all the way through a zoom is a light moving in the
       corner of the eye, and that is the thing being asked not to happen. So
       under reduced motion it holds whatever it was showing until the camera
       stops — the same 180ms the blurs already wait for — and takes up the new
       reading in one step. */
    if (still.matches && document.body.dataset.cam === 'move') return;
    const t = tune();
    /* How often the copy is made is the whole cost of this file, because the
       copy is a readback: the compositor has to finish everything it has in
       flight and hand the pixels over. Measured at 1440×900 in the pane, 2.5 to
       5ms a copy — and it scales with the canvas, so on a 2x screen it is four
       times that. The first version copied on every pass while the street
       capture was up and on every wheel notch of a zoom: twenty readbacks a
       second on top of a renderer that was already using its frame, which is
       what made the screen stutter.

       So a copy is never taken more than a few times a second, whatever is
       happening. The street capture and a clip draw their own pixels and are
       never still, so they are copied at 2Hz; the camera in motion at 3Hz —
       nobody follows a one-pixel edge faster than that while the map is
       turning under it; and a still map only when something says it changed,
       with a slow safety tick for what the signature cannot see. The canvas is
       in the markup whichever lens is showing, so the capture is asked whether
       it is laid out, not whether it exists. */
    const scene = document.getElementById('scene3d');
    const live = (scene && scene.offsetParent !== null) || !!document.querySelector('#media video');
    const moving = document.body.dataset.cam === 'move';
    const sig = (moving ? 'm' : '') + '|' + innerWidth + '×' + innerHeight + '|' +
                (window.MapView && MapView.zoom ? MapView.zoom().toFixed(2) : '');
    const age = now - copied;
    const due = live ? age > 500 : moving ? age > 300 : (sig !== was ? age > 120 : age > 1000);
    let anew = false;
    if (due) {
      was = sig; copied = now;
      if (!scenery()) return;
      anew = true;
    }
    if (!px) return;

    const glass = [];
    let shape = '';
    document.querySelectorAll(GLASS).forEach(el => {
      const q = el.getBoundingClientRect();
      const seen = q.width >= 40 && q.height >= 24 &&
                   q.bottom > 0 && q.top < vh && q.right > 0 && q.left < vw;
      glass.push({ el, q, seen, left: q.left, right: q.right, top: q.top, bottom: q.bottom });
      shape += (q.left | 0) + ',' + (q.top | 0) + ',' + (q.width | 0) + ',' + (q.height | 0) + ';';
    });
    /* Nothing under the panels moved and neither did the panels: the rims are
       already showing the answer. Worth the string it costs to know — a column
       being scrolled or a card being written is the only thing that moves one
       of these, and neither happens on most frames. */
    if (!anew && shape === laid && !glass.some(g => g.seen && !g.el.__rim)) return;
    laid = shape;

    for (const g of glass) {
      if (!g.seen) { if (g.el.__rim) set(g.el.__rim, ''); continue; }
      set(layer(g.el), rimOf(g.q, glass.filter(o => o !== g && o.seen), t));
    }
  }
  const set = (n, g) => { if (n.__g !== g) { n.__g = g; n.style.backgroundImage = g; } };

  /* The pass itself — a dozen rectangles and a string compare when there is
     no copy to make — runs on every sixth frame, ten times a second on a 60Hz
     panel. Slower than the eye follows an edge, and the copy has its own,
     slower clock above. */
  let frame = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (++frame % 6) return;
    pass(now);
  }

  /* seated once the screen is written, like every other module that takes over
     something focus.js has put on it */
  const start = () => requestAnimationFrame(loop);
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
})();
