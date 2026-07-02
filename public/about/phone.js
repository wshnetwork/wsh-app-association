// ---------------------------------------------------------------
// phone.js
// Engine. Reads the STAGES array from stages.js - shouldn't need to
// edit this file to change content, only behavior/tuning.
// ---------------------------------------------------------------

// ===================== TWEAKABLE CONSTANTS ======================

// Where each named position sits, as a percentage of viewport width
// (0 = left edge, 50 = center, 100 = right edge).
const POSITION_X = { left: 18, center: 50, right: 82 };

// How strongly the phone tilts to "look toward" the screen's center.
// 0 = never tilts. Higher = more dramatic turn. Try 0.2-0.6.
const TILT_STRENGTH = 0.4;

// A small constant downward pitch, independent of scroll, purely for
// a nicer resting angle (like a product photo). Set to 0 to disable.
const BASE_PITCH = -0.1;

// How quickly the phone catches up to its scroll-driven target each
// frame (0-1). Lower = smoother/laggier, higher = snappier/twitchier.
const DAMPING = 0.12;

// =================================================================

const phoneContainer = document.getElementById('phone-container');
const stage = document.getElementById('stage');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  35,
  stage.clientWidth / stage.clientHeight,
  0.1,
  100
);
camera.position.set(0, 0, 6.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(stage.clientWidth, stage.clientHeight);
stage.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
fillLight.position.set(-5, -2, 4);
scene.add(fillLight);

const phoneGroup = new THREE.Group();
scene.add(phoneGroup);

// ---------------------------------------------------------------
// PHONE BODY - unchanged from before: a real extruded rounded-rect
// so the corners are genuinely curved 3D surfaces.
// ---------------------------------------------------------------

const BODY_WIDTH = 2;
const BODY_HEIGHT = 4;
const BODY_DEPTH = 0.18;
const BODY_RADIUS = 0.32;

function roundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = radius;

  shape.moveTo(x, y + r);
  shape.lineTo(x, y + height - r);
  shape.quadraticCurveTo(x, y + height, x + r, y + height);
  shape.lineTo(x + width - r, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - r);
  shape.lineTo(x + width, y + r);
  shape.quadraticCurveTo(x + width, y, x + width - r, y);
  shape.lineTo(x + r, y);
  shape.quadraticCurveTo(x, y, x, y + r);

  return shape;
}

const bodyShape = roundedRectShape(BODY_WIDTH, BODY_HEIGHT, BODY_RADIUS);
const BEVEL_THICKNESS = 0.02;

const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
  depth: BODY_DEPTH,
  bevelEnabled: true,
  bevelThickness: BEVEL_THICKNESS,
  bevelSize: 0.02,
  bevelSegments: 6,
  curveSegments: 32,
});
bodyGeometry.translate(0, 0, -BODY_DEPTH / 2);

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x1c1c1c,
  roughness: 0.45,
  metalness: 0.4,
});

const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
phoneGroup.add(bodyMesh);

// ---------------------------------------------------------------
// SCREEN - two overlapping planes (A and B) so we can crossfade
// between the outgoing stage's image and the incoming one as you
// scroll, instead of a hard cut.
// ---------------------------------------------------------------

const SCREEN_INSET = 0.06;
const screenWidth = BODY_WIDTH - SCREEN_INSET * 2;
const screenHeight = BODY_HEIGHT - SCREEN_INSET * 2;
const screenRadius = BODY_RADIUS - SCREEN_INSET;
const screenAspect = screenWidth / screenHeight;

const screenShape = roundedRectShape(screenWidth, screenHeight, screenRadius);
const screenGeometry = new THREE.ShapeGeometry(screenShape, 32);

const FRONT_Z = BODY_DEPTH / 2 + BEVEL_THICKNESS + 0.005;

function makeScreenMesh(zOffset) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false, // avoids z-fighting flicker between the two overlapping planes
  });
  const mesh = new THREE.Mesh(screenGeometry, material);
  mesh.position.z = FRONT_Z + zOffset;
  phoneGroup.add(mesh);
  return mesh;
}

const screenMeshA = makeScreenMesh(0);
const screenMeshB = makeScreenMesh(0.001);
screenMeshB.material.opacity = 0;

// fallback so nothing looks broken if a stage has no images configured
function makeBlankScreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = Math.round(512 / screenAspect);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

const FALLBACK_TEXTURE = new THREE.CanvasTexture(makeBlankScreenCanvas().canvas);

const textureCache = new Map();

// Composites the image onto a canvas that matches the screen's exact
// aspect ratio: scaled so it always fills the full width, any part
// taller than the screen gets clipped by the canvas bounds, and any
// leftover vertical space (image is relatively wide/short) stays the
// canvas's black background - this is what actually guarantees
// "fill width, clip overflow, backfill underflow" rather than relying
// on WebGL texture repeat/offset tricks, which can't backfill black.
function getTexture(url) {
  if (!url) return FALLBACK_TEXTURE;
  if (textureCache.has(url)) return textureCache.get(url).texture;

  const { canvas, ctx } = makeBlankScreenCanvas();
  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(url, { texture, canvas, ctx });

  const img = new Image();
  // needed for images hosted on another domain - that domain must also
  // send CORS headers or the canvas becomes "tainted" and drawImage/texture
  // upload will fail. If a remote screenshot silently stays black, this is
  // almost certainly why - safest fix is hosting the image in your own
  // assets folder (same-origin never has this problem).
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const scale = canvas.width / img.width; // always fill the full width
    const drawWidth = canvas.width;
    const drawHeight = img.height * scale;
    const drawY = (canvas.height - drawHeight) / 2; // center vertically; canvas clipping handles overflow automatically

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, drawY, drawWidth, drawHeight);
    texture.needsUpdate = true;
  };
  img.src = url;

  return texture;
}

function getStageImageUrl(stageConfig) {
  if (!stageConfig || !stageConfig.images || stageConfig.images.length === 0) {
    return null;
  }
  return stageConfig.images[stageConfig.activeImage || 0] || stageConfig.images[0];
}

// ---------------------------------------------------------------
// NOTCH
// ---------------------------------------------------------------

const notchGeometry = new THREE.PlaneGeometry(0.7, 0.16);
const notchMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const notchMesh = new THREE.Mesh(notchGeometry, notchMaterial);
notchMesh.position.set(0, BODY_HEIGHT / 2 - 0.18, FRONT_Z + 0.01);
phoneGroup.add(notchMesh);

// ---------------------------------------------------------------
// MAP STAGES TO REAL SECTIONS ON THE PAGE
// ---------------------------------------------------------------

let resolvedStages = [];

function resolveStages() {
  resolvedStages = STAGES
    .map((stageConfig) => {
      const el = document.getElementById(stageConfig.section);
      if (!el) return null; // silently skips a stage if its section id isn't on the page
      return { config: stageConfig, el };
    })
    .filter(Boolean)
    // sort by actual vertical position on the page, so STAGES order
    // doesn't have to be perfectly hand-maintained
    .sort((a, b) => a.el.offsetTop - b.el.offsetTop)
    .map((entry) => ({
      config: entry.config,
      // anchor = vertical center of the section, in document coordinates
      anchor: entry.el.offsetTop + entry.el.offsetHeight / 2,
    }));
}

resolveStages();
window.addEventListener('resize', resolveStages);

// ---------------------------------------------------------------
// SCROLL -> TARGET POSE
// ---------------------------------------------------------------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// returns { percent, imageUrlA, imageUrlB, mixT }
function computeTarget() {
  if (resolvedStages.length === 0) {
    return { percent: POSITION_X.center, imageUrlA: null, imageUrlB: null, mixT: 0 };
  }

  const scrollCenter = window.scrollY + window.innerHeight / 2;

  // before the first configured stage: hold its pose
  if (scrollCenter <= resolvedStages[0].anchor) {
    const s = resolvedStages[0].config;
    const url = getStageImageUrl(s);
    return { percent: POSITION_X[s.position] ?? POSITION_X.center, imageUrlA: url, imageUrlB: url, mixT: 0 };
  }

  // after the last configured stage: hold its pose
  const last = resolvedStages[resolvedStages.length - 1];
  if (scrollCenter >= last.anchor) {
    const s = last.config;
    const url = getStageImageUrl(s);
    return { percent: POSITION_X[s.position] ?? POSITION_X.center, imageUrlA: url, imageUrlB: url, mixT: 0 };
  }

  // find which pair of stages we're between
  for (let i = 0; i < resolvedStages.length - 1; i++) {
    const a = resolvedStages[i];
    const b = resolvedStages[i + 1];
    if (scrollCenter >= a.anchor && scrollCenter <= b.anchor) {
      const t = (scrollCenter - a.anchor) / (b.anchor - a.anchor);
      const percentA = POSITION_X[a.config.position] ?? POSITION_X.center;
      const percentB = POSITION_X[b.config.position] ?? POSITION_X.center;
      return {
        percent: lerp(percentA, percentB, t),
        imageUrlA: getStageImageUrl(a.config),
        imageUrlB: getStageImageUrl(b.config),
        mixT: t,
      };
    }
  }

  // fallback, shouldn't normally hit this
  const s = resolvedStages[0].config;
  const url = getStageImageUrl(s);
  return { percent: POSITION_X[s.position] ?? POSITION_X.center, imageUrlA: url, imageUrlB: url, mixT: 0 };
}

// ---------------------------------------------------------------
// RENDER LOOP - damped toward the scroll-derived target each frame
// ---------------------------------------------------------------

let currentPercent = POSITION_X.center;
let lastImageA = null;
let lastImageB = null;

function tick() {
  const target = computeTarget();

  currentPercent += (target.percent - currentPercent) * DAMPING;

  // position the phone horizontally
  phoneContainer.style.setProperty('--phone-x', currentPercent + '%');

  // tilt toward center, derived from the CURRENT resolved position so
  // it stays correct mid-transition, not just at named stops
  const normalized = (currentPercent - 50) / 50; // -1 (left) .. 0 (center) .. 1 (right)
  // NOTE: if the phone turns AWAY from center instead of toward it,
  // just delete the leading "-" on the next line.
  phoneGroup.rotation.y = -normalized * TILT_STRENGTH;
  phoneGroup.rotation.x = BASE_PITCH;

  // swap/crossfade screen images only when the target pair actually changes,
  // to avoid needless texture reassignment every frame
  if (target.imageUrlA !== lastImageA) {
    screenMeshA.material.map = getTexture(target.imageUrlA);
    screenMeshA.material.needsUpdate = true;
    lastImageA = target.imageUrlA;
  }
  if (target.imageUrlB !== lastImageB) {
    screenMeshB.material.map = getTexture(target.imageUrlB);
    screenMeshB.material.needsUpdate = true;
    lastImageB = target.imageUrlB;
  }
  screenMeshA.material.opacity = 1 - target.mixT;
  screenMeshB.material.opacity = target.mixT;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

window.addEventListener('resize', () => {
  camera.aspect = stage.clientWidth / stage.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(stage.clientWidth, stage.clientHeight);
});