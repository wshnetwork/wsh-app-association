// ---------------------------------------------------------------
// phone.js
// Engine. Reads the STAGES array from stages.js - shouldn't need to
// edit this file to change content, only behavior/tuning.
// ---------------------------------------------------------------

// ===================== TWEAKABLE CONSTANTS ======================

// Where each named position sits, as a percentage of viewport width
// (0 = left edge, 50 = center, 100 = right edge).
const POSITION_X = { left: 30, center: 50, right: 82 };

// Default tilt strength when a stage doesn't set one. 0 = face forward.
// Per-stage `tilt` values use the same scale: 0.4 is a noticeable turn,
// 0.6+ is dramatic. Stages without a `tilt` key inherit this value.
const BASE_TILT = 0;

// A small constant downward pitch, independent of scroll, purely for
// a nicer resting angle (like a product photo). Set to 0 to disable.
const BASE_PITCH = 0;

// Base size of the phone. Stage `scale` values multiply on top of this.
const BASE_SCALE = 0.7;

// Status bar image overlaid on every screen frame. Set to null to disable.
const STATUS_BAR_IMAGE = '../assets/img/screenshots/statusbar.jpg';
const STATUS_BAR_PADDING_TOP = 18;   // px (canvas space) above the image
const STATUS_BAR_PADDING_SIDE = 24;  // px (canvas space) on each side

// How quickly the phone catches up to its scroll-driven target each
// frame (0-1). Lower = smoother/laggier, higher = snappier/twitchier.
const DAMPING = 0.9;

// =================================================================

const phoneContainer = document.getElementById('phone-container');
const stage = document.getElementById('stage');

const DEG_TO_RAD = Math.PI / 180;

// Cached viewport dimensions — updated on resize, not every frame.
let stageW = 0;
let stageH = 0;

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
stageW = stage.clientWidth;
stageH = stage.clientHeight;
renderer.setSize(stageW, stageH);
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
phoneGroup.scale.set(0.9, 0.9, 0.9);

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

// Create screen geometry with proper UV mapping
function createScreenGeometry() {
  const shape = roundedRectShape(screenWidth, screenHeight, screenRadius);
  const geometry = new THREE.ShapeGeometry(shape, 32);
  
  // Fix UV coordinates to properly map the texture to the shape
  const positionAttribute = geometry.attributes.position;
  const uvAttribute = geometry.attributes.uv;
  
  if (positionAttribute && uvAttribute) {
    const positions = positionAttribute.array;
    const uvs = uvAttribute.array;
    
    // Find bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    // Remap UVs to cover the full shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Normalize to 0-1 range
      const u = (x - minX) / rangeX;
      const v = (y - minY) / rangeY;
      
      const uvIndex = (i / 3) * 2;
      uvs[uvIndex] = u;
      uvs[uvIndex + 1] = v;
    }
  }
  
  return geometry;
}

const screenGeometry = createScreenGeometry();

const FRONT_Z = BODY_DEPTH / 2 + BEVEL_THICKNESS + 0.005;

function makeScreenMesh(zOffset) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false, // avoids z-fighting flicker between the two overlapping planes
    side: THREE.DoubleSide, // Render both sides for safety
  });
  const mesh = new THREE.Mesh(screenGeometry.clone(), material);
  mesh.position.z = FRONT_Z + zOffset;
  phoneGroup.add(mesh);
  return mesh;
}

const screenMeshA = makeScreenMesh(0);

// Single composite canvas — all transition types are drawn here each frame
const { canvas: compositeCanvas, ctx: compositeCtx } = makeBlankScreenCanvas();
const compositeTexture = new THREE.CanvasTexture(compositeCanvas);
screenMeshA.material.map = compositeTexture;
screenMeshA.material.opacity = 1;

// fallback so nothing looks broken if a stage has no images configured
function makeBlankScreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round(1024 / screenAspect);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

const FALLBACK_TEXTURE = new THREE.CanvasTexture(makeBlankScreenCanvas().canvas);

const statusBarImg = STATUS_BAR_IMAGE ? new Image() : null;
if (statusBarImg) statusBarImg.src = STATUS_BAR_IMAGE;

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
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Calculate scaling to maintain aspect ratio while filling width
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight;
    let offsetX = 0, offsetY = 0;
    
    if (imgAspect >= canvasAspect) {
      // Image is wider or equal - match width, clip height
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Image is taller - match height, clip width
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    texture.needsUpdate = true;
  };
  img.src = url;

  // Handle loading errors
  img.onerror = () => {
    console.warn('Failed to load image:', url);
    // Use fallback texture
    texture.image = FALLBACK_TEXTURE.image;
    texture.needsUpdate = true;
  };

  return texture;
}

function getStageImageUrl(stageConfig) {
  if (!stageConfig || !stageConfig.images || stageConfig.images.length === 0) {
    return null;
  }
  return stageConfig.images[stageConfig.activeImage || 0] || stageConfig.images[0];
}

function getImageCanvas(url) {
  if (!url) return null;
  const entry = textureCache.get(url);
  return entry ? entry.canvas : null;
}

function drawStatusBar(w) {
  if (statusBarImg && statusBarImg.complete && statusBarImg.naturalWidth > 0) {
    const imgW = w - STATUS_BAR_PADDING_SIDE * 2;
    const imgH = Math.round(imgW * (statusBarImg.naturalHeight / statusBarImg.naturalWidth));
    const totalH = STATUS_BAR_PADDING_TOP + imgH;
    compositeCtx.fillStyle = '#000000';
    compositeCtx.fillRect(0, 0, w, totalH);
    compositeCtx.drawImage(statusBarImg, STATUS_BAR_PADDING_SIDE, STATUS_BAR_PADDING_TOP, imgW, imgH);
  }
}

let _lastUrlA = null, _lastUrlB = null, _lastMixT = -1, _lastTransition = null;

function compositeImages(urlA, urlB, mixT, transition) {
  // Skip redraw if inputs haven't changed
  if (urlA === _lastUrlA && urlB === _lastUrlB && mixT === _lastMixT && transition === _lastTransition) return;
  _lastUrlA = urlA; _lastUrlB = urlB; _lastMixT = mixT; _lastTransition = transition;

  const w = compositeCanvas.width;
  const h = compositeCanvas.height;
  compositeCtx.clearRect(0, 0, w, h);
  compositeCtx.fillStyle = '#000000';
  compositeCtx.fillRect(0, 0, w, h);

  const canvasA = getImageCanvas(urlA);
  const canvasB = getImageCanvas(urlB);

  if (urlA === urlB || mixT <= 0) {
    if (canvasA) compositeCtx.drawImage(canvasA, 0, 0);
    drawStatusBar(w);
    compositeTexture.needsUpdate = true;
    return;
  }
  if (mixT >= 1) {
    if (canvasB) compositeCtx.drawImage(canvasB, 0, 0);
    drawStatusBar(w);
    compositeTexture.needsUpdate = true;
    return;
  }

  if (transition === 'scrollUp') {
    if (canvasA) compositeCtx.drawImage(canvasA, 0, -mixT * h);
    if (canvasB) compositeCtx.drawImage(canvasB, 0, (1 - mixT) * h);
  } else if (transition === 'slideLeft') {
    if (canvasA) compositeCtx.drawImage(canvasA, -mixT * w, 0);
    if (canvasB) compositeCtx.drawImage(canvasB, (1 - mixT) * w, 0);
  } else if (transition === 'popUp') {
    // B slides up from the bottom, covering A which stays still
    if (canvasA) compositeCtx.drawImage(canvasA, 0, 0);
    if (canvasB) compositeCtx.drawImage(canvasB, 0, (1 - mixT) * h);
  } else if (transition === 'popDown') {
    // B sits still underneath, A slides down revealing B
    if (canvasB) compositeCtx.drawImage(canvasB, 0, 0);
    if (canvasA) compositeCtx.drawImage(canvasA, 0, mixT * h);
  } else {
    // 'fade' (default)
    if (canvasA) compositeCtx.drawImage(canvasA, 0, 0);
    if (canvasB) {
      compositeCtx.globalAlpha = mixT;
      compositeCtx.drawImage(canvasB, 0, 0);
      compositeCtx.globalAlpha = 1;
    }
  }

  drawStatusBar(w);

  compositeTexture.needsUpdate = true;
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

function docOffsetTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function resolveStages() {
  const sorted = STAGES
    .map((stageConfig) => {
      const el = document.getElementById(stageConfig.section);
      if (!el) return null;
      return { config: stageConfig, el };
    })
    .filter(Boolean)
    .sort((a, b) => docOffsetTop(a.el) - docOffsetTop(b.el));

  resolvedStages = sorted.map((entry) => ({
    config: entry.config,
    anchor: docOffsetTop(entry.el) + entry.el.offsetHeight / 2,
  }));
}

// Run after load so getBoundingClientRect returns real values, and again
// after a short delay to catch dynamically rendered content (e.g. categories grid).
window.addEventListener('load', () => {
  resolveStages();
  setTimeout(resolveStages, 400);
});
window.addEventListener('resize', resolveStages);

// Trigger the slide-in animation once the page has painted.
// Sticky handles show/hide from here on — no scroll listener needed.
requestAnimationFrame(() => phoneContainer.classList.add('phone-visible'));

// ---------------------------------------------------------------
// SCROLL -> TARGET POSE
// ---------------------------------------------------------------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function stageTilt(stageConfig) {
  return stageConfig.tilt ?? BASE_TILT;
}

function stageScale(stageConfig) {
  return stageConfig.scale ?? 1;
}

// returns { percent, tilt, scale, imageUrlA, imageUrlB, mixT, imageTransition }
function computeTarget() {
  if (resolvedStages.length === 0) {
    return { percent: POSITION_X.center, tilt: BASE_TILT, scale: 1, imageUrlA: null, imageUrlB: null, mixT: 0, imageTransition: 'fade' };
  }

  const scrollCenter = window.scrollY + window.innerHeight / 2;

  if (scrollCenter <= resolvedStages[0].anchor) {
    const s = resolvedStages[0].config;
    const url = getStageImageUrl(s);
    return { percent: POSITION_X[s.position] ?? POSITION_X.center, tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: 'fade' };
  }

  const last = resolvedStages[resolvedStages.length - 1];
  if (scrollCenter >= last.anchor) {
    const s = last.config;
    const url = getStageImageUrl(s);
    return { percent: POSITION_X[s.position] ?? POSITION_X.center, tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: 'fade' };
  }

  for (let i = 0; i < resolvedStages.length - 1; i++) {
    const a = resolvedStages[i];
    const b = resolvedStages[i + 1];
    if (scrollCenter >= a.anchor && scrollCenter <= b.anchor) {
      const t = (scrollCenter - a.anchor) / (b.anchor - a.anchor);
      const percentA = POSITION_X[a.config.position] ?? POSITION_X.center;
      const percentB = POSITION_X[b.config.position] ?? POSITION_X.center;
      return {
        percent: lerp(percentA, percentB, t),
        tilt: lerp(stageTilt(a.config), stageTilt(b.config), t),
        scale: lerp(stageScale(a.config), stageScale(b.config), t),
        imageUrlA: getStageImageUrl(a.config),
        imageUrlB: getStageImageUrl(b.config),
        mixT: t,
        imageTransition: b.config.imageTransition || 'fade',
      };
    }
  }

  const s = resolvedStages[0].config;
  const url = getStageImageUrl(s);
  return { percent: POSITION_X[s.position] ?? POSITION_X.center, tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: 'fade' };
}

// ---------------------------------------------------------------
// RENDER LOOP - damped toward the scroll-derived target each frame
// ---------------------------------------------------------------

// Initialise current pose to the first stage so the phone slides in
// already sitting at the correct position, not drifting from center.
const _first = resolvedStages.length > 0 ? resolvedStages[0].config : null;
let currentPercent = _first ? (POSITION_X[_first.position] ?? POSITION_X.center) : POSITION_X.center;
let currentTilt    = _first ? stageTilt(_first)  : BASE_TILT;
let currentScale   = _first ? stageScale(_first) : 1;

const EPSILON = 0.0001;

function tick() {
  const target = computeTarget();

  const prevPercent = currentPercent;
  const prevTilt    = currentTilt;
  const prevScale   = currentScale;

  currentPercent += (target.percent - currentPercent) * DAMPING;
  currentTilt    += (target.tilt    - currentTilt)    * DAMPING;
  currentScale   += (target.scale   - currentScale)   * DAMPING;

  const poseChanged = (
    Math.abs(currentPercent - prevPercent) > EPSILON ||
    Math.abs(currentTilt    - prevTilt)    > EPSILON ||
    Math.abs(currentScale   - prevScale)   > EPSILON
  );

  const offsetX = -(currentPercent / 100 - 0.5) * stageW;

  if (poseChanged) {
    camera.setViewOffset(stageW, stageH, offsetX, 0, stageW, stageH);
    phoneGroup.rotation.y = currentTilt * DEG_TO_RAD;
    phoneGroup.rotation.x = BASE_PITCH;
    phoneGroup.scale.setScalar(BASE_SCALE * currentScale);
  }

  // Ensure both images are queued for loading, then composite them
  getTexture(target.imageUrlA);
  getTexture(target.imageUrlB);

  // Check if composite needs redraw BEFORE calling compositeImages (which updates _last* values)
  const compositeChanged = (
    target.imageUrlA !== _lastUrlA ||
    target.imageUrlB !== _lastUrlB ||
    target.mixT      !== _lastMixT ||
    target.imageTransition !== _lastTransition
  );
  compositeImages(target.imageUrlA, target.imageUrlB, target.mixT, target.imageTransition);

  if (poseChanged || compositeChanged) {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(tick);
}
tick();

window.addEventListener('resize', () => {
  stageW = stage.clientWidth;
  stageH = stage.clientHeight;
  camera.aspect = stageW / stageH;
  camera.updateProjectionMatrix();
  renderer.setSize(stageW, stageH);
  camera.clearViewOffset();
});