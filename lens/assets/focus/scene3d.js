/* =============================================================================
   scene3d.js — the street reading, as it was actually captured.

   The other three readings are drawn out of the source document. This one is a
   measurement: a 3D Gaussian-splat capture shot along Olaya Street in Riyadh,
   held in the product's scene register, thinned here to what a page can carry
   and committed with everything else in this repository. Nothing is fetched at
   run time — the renderer is Spark over three.js, both vendored under
   assets/vendor/, and the capture is a file in assets/focus/scene/.

   The canvas takes the pointer only while its own reading is open, so the
   contract the rest of the backdrop keeps — the gesture reaches the planet
   through the scenery — is untouched everywhere else. Inside the reading the
   camera is yours: drag to look, scroll to move along the street. Back away
   far enough and the capture runs out; at that edge the camera is handed back
   to the planet, which is the other half of the gesture focus.css:161 opens.

   A machine that cannot draw splats — no WebGL2, or a software rasteriser
   pretending to be one — gets nothing from any of this, so it is asked first
   and keeps the photograph instead.
   ============================================================================= */
import * as THREE from 'three';
import { SparkRenderer, SplatMesh, SparkControls } from '@sparkjsdev/spark';

const CAPTURE = 'assets/focus/scene/olaya-street.sog';

/* What the file is, said once, so the caption and the credit cannot drift
   apart from each other or from the thing on screen. */
const CREDIT = {
  place: 'Olaya Street, Al Olaya, Riyadh',
  when: 'July 2026',
  source: 'Datum Studio scene b65f9a09 · Street Part 2',
};

/* ── where the camera is allowed to stand ────────────────────────────────
   A Gaussian capture is sharp near the path it was shot from and nowhere else:
   step off that path and the same splats read as shards, because that is all
   they ever were from an angle nobody photographed. The bounding box is no
   help here — its centre is eighty metres up in the sky.

   The scene register answers this itself. Alongside the splats the capture
   carries a containment volume, calibrated in Studio, which is the corridor a
   viewer is allowed to move inside. Taken verbatim from the scene's own
   collisions.colliders entry of role `containment` (Studio scene b65f9a09,
   dsdk-collider-2): a 331 m stretch of Olaya Street, eight metres of headroom,
   turned 38° off the axes because the street is. */
const CORRIDOR = {
  centre: [-246.8, 2.61, 248.29],
  size: [330.53, 8.21, 117.17],
};

/* Where the reading opens. The corridor's own middle is no use — the register
   keeps three obstacle volumes beside the containment one, and between them
   they cover most of its centre line, because the buildings flanking a street
   are what a street is made of. So the opening pose was found by asking the
   capture itself: its splats bucketed into six-metre cells, each cell's ground
   read off its tenth percentile, and the cells kept that are both clear above
   the pavement and densely captured — sparsely captured open ground is open
   because nobody photographed it, and looks it. This is one of those cells,
   two metres over the kerb, aimed ninety metres up the street. Behind it: a
   building corner, the sky, a row of shrubs and a parked car. */
const STATION = {
  eye: [-217.8, 2.0, 225.3],
  look: [-123.9, 6.0, 150.6],
};

/* How far out of that corridor the camera may go before the reading admits it
   has run out and hands back. */
const HANDBACK_AT = 1.6;

let canvas = null;
let renderer = null;
let scene = null;
let camera = null;
let rig = null;
let controls = null;
let mesh = null;
let spark = null;

let running = false;
let started = false;
let frame = 0;

/* the middle of the capture and how far it reaches, taken off the corridor
   below — the two numbers the handback is measured against */
let centre = new THREE.Vector3();
let radius = 100;

/* what the caption is entitled to say at any moment */
const status = { phase: 'idle', loaded: 0, total: 0, ok: null };
let onChange = null;
const announce = () => { if (onChange) onChange(status); };

/* ── whether this machine can draw it at all ──────────────────────────────
   Two questions, not one, and the second is the one that bites. WebGL2 may be
   missing outright. Or it may be present and be a CPU rasteriser — SwiftShader,
   llvmpipe — which answers every call correctly and takes the best part of a
   minute over a frame. Three and a half million Gaussians is not something to
   hand to one, and headless browsers are the common case rather than the rare
   one: this repository's own screenshot tool is a headless browser, and so is
   the harness. Either answer keeps the photograph.

   Asked once, on a throwaway canvas, before anything heavy is built. */
function gpuVerdict() {
  let gl = null;
  try { gl = document.createElement('canvas').getContext('webgl2'); }
  catch (e) { return { ok: false, why: 'no-webgl2' }; }
  if (!gl) return { ok: false, why: 'no-webgl2' };
  let name = '';
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
  } catch (e) { /* a browser that hides the name is taken at its word */ }
  if (/swiftshader|software|llvmpipe|basic render/i.test(name)) {
    return { ok: false, why: 'software-gl' };
  }
  return { ok: true, why: name };
}

/* ── the handback ─────────────────────────────────────────────────────────
   The wheel that brought the camera down to the street has to be able to take
   it back out. Inside the scene the wheel belongs to the scene, so the signal
   is not the gesture but its result: once the camera has backed out past the
   edge of what was measured, there is nothing left to look at and the planet
   is the better picture again. */
let handback = null;
let handedBack = false;

/* Whether the camera is standing outside the capture — which is to say, in
   front of nothing. `handedBack` latches after the first crossing so the
   callback fires once per visit rather than every frame; this is the question
   itself, asked fresh, and it is what the reading is opened against. */
function strayed() {
  if (!rig || status.phase !== 'ready') return false;
  return rig.position.distanceTo(centre) > radius * HANDBACK_AT;
}

function checkHandback() {
  if (!handback || handedBack) return;
  if (!strayed()) return;
  handedBack = true;
  handback();
}

/* ── the loop ─────────────────────────────────────────────────────────────
   Paused whenever the reading is not the one on screen: a splat sort behind a
   map nobody is looking at costs the same as one in front of it. */
function tick() {
  if (!running) return;
  frame = requestAnimationFrame(tick);
  controls.update(rig, camera);
  checkHandback();
  renderer.render(scene, camera);
}

/* A canvas with no box is not a canvas to size to.

   The reading is asked for before it is shown: setLens pays for the capture
   through FocusAssets.scene() — which starts the renderer — and only then
   calls apply(), which writes data-lens and lets the stylesheet give
   .lens--scene a box. So the first resize() of every arrival except the
   ?lens=scene deep link ran against a canvas that CSS still had at
   display:none, measured nothing, and — because `clientWidth || 1` treats
   nothing as one pixel — sized the drawing buffer to 1×1. resume() then
   returned early on the second, correctly-timed call, because the loop was
   already running, and nothing else ever asked again: the only listener was
   the window's own resize. The renderer went on drawing all 6.85M triangles
   into that one pixel for the life of the page, and what was on screen was
   the canvas's CSS sky with a transparent pixel stretched over it. That is
   the flat lavender field: not a capture that failed to load, a capture drawn
   into a pixel.

   So a zero box is left alone rather than rounded up to one, and the element
   is watched instead of the window — which answers the same question later,
   when the reading is finally given its box, and covers the stage changing
   shape as well. The window listener stays for the one thing an observer does
   not see: a move to a display of another density. */
function resize() {
  if (!renderer || !canvas) return;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ── framing the capture ────────────────────────────────────────────────── */
const UP = new THREE.Vector3(0, 1, 0);
const _aim = new THREE.Matrix4();

/* Object3D.lookAt turns a plain object so that its +z faces the target, and a
   camera so that its −z does — the two conventions are opposite, and the rig
   is a Group carrying a camera. Aimed with lookAt it faced exactly backwards
   and drew the far side of the street from behind, which on a capture with no
   far side is a black screen. So the rig is aimed with the camera's rule. */
function aim(eye, target) {
  rig.position.copy(eye);
  _aim.lookAt(eye, target, UP);
  rig.quaternion.setFromRotationMatrix(_aim);
}

/* Put the camera back on its station, looking up the street. The corridor is
   kept for the handback alone: how far the camera has gone is measured from
   the middle of the capture, not from where the reading happens to open. */
const _eye = new THREE.Vector3();
const _look = new THREE.Vector3();

function frameCapture() {
  centre.fromArray(CORRIDOR.centre);
  radius = CORRIDOR.size[0] * 0.5;
  aim(_eye.fromArray(STATION.eye), _look.fromArray(STATION.look));
  handedBack = false;
}

/* ── building it, once ────────────────────────────────────────────────────
   Everything below is paid for the first time the reading is opened, and
   never again. */
function build() {
  canvas = document.getElementById('scene3d');
  if (!canvas) return false;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  /* Cleared to nothing, so what shows through the capture's gaps is the sky
     painted on the canvas element itself — see #scene3d in focus.css. The
     colour stays in the stylesheet, where this repository keeps colour, and
     the canvas's own background is opaque, so the planet underneath is still
     covered by the reading that replaces it. */
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(62, 1, 0.1, 4000);
  /* the camera rides a rig, which is what the controls actually move */
  rig = new THREE.Group();
  rig.add(camera);
  scene.add(rig);

  spark = new SparkRenderer({ renderer });
  scene.add(spark);

  controls = new SparkControls({ canvas });
  /* A street is walked, not orbited: the wheel moves you along it. Spark's own
     speeds are set for handling an object you are turning over, and one unit
     here is about a metre of Olaya Street — at the default 0.0015 a notch of
     the wheel is fifteen centimetres, so crossing the block took two hundred
     of them. These are that, opened up: a notch is a stride, and the keys
     walk rather than shuffle. */
  controls.fpsMovement.moveSpeed = 18;
  controls.pointerControls.scrollSpeed = 0.02;
  controls.pointerControls.slideSpeed = 0.015;

  /* the element, not the window: the reading is given its box after the
     renderer is built, and this is what notices */
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  addEventListener('resize', resize, { passive: true });
  return true;
}

/* ── the public face ─────────────────────────────────────────────────────── */

/* Start it. Idempotent: the second call is the caption asking again, not a
   second scene. */
function load() {
  if (started) return;
  started = true;

  const gpu = gpuVerdict();
  if (!gpu.ok) {
    status.ok = false; status.phase = gpu.why;
    announce();
    return;
  }
  if (!build()) { status.ok = false; status.phase = 'no-canvas'; announce(); return; }

  status.ok = true; status.phase = 'loading'; announce();

  mesh = new SplatMesh({
    url: CAPTURE,
    onProgress: (e) => {
      status.loaded = e.loaded || 0;
      status.total = e.total || 0;
      announce();
    },
    onLoad: () => {
      /* The splat file and the register that describes it are half a turn
         apart, and it matters which half. Studio places this capture's 115
         detected objects — the light poles, the signs, the bins — around
         x ≈ −247, y ≈ −5, z ≈ +256. Sampling the file's own splats puts their
         mass at x ≈ −263, y ≈ +4, z ≈ −245: the same x, and y and z both
         negated. Two axes reversed and one kept is a rotation; this one is a
         half turn about x. Applying it is what puts the street back under the
         coordinates that name what is standing in it — including the corridor
         the camera is seated in. */
      mesh.quaternion.set(1, 0, 0, 0);
      mesh.updateMatrixWorld(true);
      frameCapture();
      status.phase = 'ready';
      announce();
    },
  });
  scene.add(mesh);

  resize();
  resume();
}

/* Whether the loop runs. Called on every change of reading, so it is cheap and
   safe to call with the answer it already has. */
function show(on) {
  if (on) { load(); resume(); } else { pause(); }
}

function resume() {
  if (running || !renderer) return;
  running = true;
  /* The controls time themselves from the last frame they saw, and the last
     frame they saw may have been before a spell on another reading. Left
     alone, the first frame back would be handed a delta the size of that
     spell and would move the camera by it. */
  controls.lastTime = performance.now();
  resize();
  frame = requestAnimationFrame(tick);
}

function pause() {
  running = false;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/* Put the camera back where the reading opens, for the case that is entered
   from the map rather than walked into.

   This is also the only way out of a reading that has been left. `pause()`
   keeps everything, deliberately — tabbing away and back should not cost you
   your place in the street. But backing out through the edge of the capture is
   not leaving your place, it is leaving the capture: the handback fires, the
   reading closes, and the camera stays parked in front of nothing with
   `handedBack` latched, so re-opening the reading showed bare sky and could
   never hand back a second time. `frameCapture()` clears both — the pose and
   the latch — which is why the caller is `openScene()` in focus.js and why it
   asks `strayed()` first rather than re-framing every time. */
function recentre() {
  if (status.phase === 'ready') frameCapture();
}

window.FocusScene3D = {
  load, show, pause, resume, recentre, strayed,
  credit: CREDIT,
  status: () => status,
  /* The renderer's own objects, for the console. A capture arrives in whatever
     frame it was reconstructed in and there is no way to reason about a camera
     inside it from the outside — the product exposes its engine on the window
     for the same reason. */
  objects: () => ({ renderer, scene, camera, rig, mesh, spark, controls }),
  /* What the camera is doing and what it was aimed at, in numbers. A capture
     arrives in whatever frame it was reconstructed in, so this is the only
     way to tell "nothing loaded" apart from "loaded, and behind you". */
  debug: () => ({
    splats: mesh ? mesh.numSplats : null,
    centre: centre.toArray(),
    radius,
    eye: rig ? rig.position.toArray() : null,
    quat: mesh ? mesh.quaternion.toArray() : null,
    box: (() => {
      if (!mesh) return null;
      const b = mesh.getBoundingBox(true);
      return { min: b.min.toArray(), max: b.max.toArray() };
    })(),
  }),
  /* the caption re-reads itself whenever the load moves on */
  onChange: (fn) => { onChange = fn; announce(); },
  /* the other half of the wheel: what to do when the camera backs out of the
     measurement altogether */
  onHandback: (fn) => { handback = fn; },
};

/* focus.js is a classic script and has finished running by the time a module
   starts, so it cannot have called in here. It leaves this hook instead, and
   whether the reading is already open is its answer to give, not ours. */
if (typeof window.FocusScene3DReady === 'function') window.FocusScene3DReady();
