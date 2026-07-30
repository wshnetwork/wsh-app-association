import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STAGES } from "../../data/stages";
import { usePhoneOverride } from "./PhoneOverrideContext";

// #%:1 — This whole component is a React-effect wrapper around the original
// public/about/phone.js engine. The render loop below intentionally mutates
// plain JS variables captured in the effect closure (pose, textures, THREE
// objects) rather than React state: it runs on every requestAnimationFrame,
// and routing that through setState would mean 60 renders/sec of a
// component tree for a canvas React never actually owns the pixels of.
// This is the standard pattern for canvas/WebGL integrations in React.

// ===================== TWEAKABLE CONSTANTS ======================
const POSITION_X = { left: 30, center: 50, right: 70 };
const BASE_TILT = 0;
const BASE_PITCH = 0;
const BASE_SCALE = 0.7;
const STATUS_BAR_IMAGE = "/assets/img/screenshots/statusbar.jpg";
const STATUS_BAR_PADDING_TOP = 18;
const STATUS_BAR_PADDING_SIDE = 24;
const DAMPING = 0.9;
const SCREEN_FILL_COLOR = "#0a0a0a";
// =================================================================

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

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function PhoneStage() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const { overrideRef, poseSettledRef } = usePhoneOverride();

  useEffect(() => {
    const phoneContainer = containerRef.current;
    const stage = stageRef.current;
    if (!phoneContainer || !stage) return;

    const DEG_TO_RAD = Math.PI / 180;

    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, stageW / stageH, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // --- Phone body ---
    const BODY_WIDTH = 2;
    const BODY_HEIGHT = 4;
    const BODY_DEPTH = 0.18;
    const BODY_RADIUS = 0.32;

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

    // --- Screen ---
    const SCREEN_INSET = 0.06;
    const screenWidth = BODY_WIDTH - SCREEN_INSET * 2;
    const screenHeight = BODY_HEIGHT - SCREEN_INSET * 2;
    const screenRadius = BODY_RADIUS - SCREEN_INSET;
    const screenAspect = screenWidth / screenHeight;

    function createScreenGeometry() {
      const shape = roundedRectShape(screenWidth, screenHeight, screenRadius);
      const geometry = new THREE.ShapeGeometry(shape, 32);

      const positionAttribute = geometry.attributes.position;
      const uvAttribute = geometry.attributes.uv;

      if (positionAttribute && uvAttribute) {
        const positions = positionAttribute.array;
        const uvs = uvAttribute.array;

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

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
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
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(screenGeometry.clone(), material);
      mesh.position.z = FRONT_Z + zOffset;
      phoneGroup.add(mesh);
      return mesh;
    }

    const screenMeshA = makeScreenMesh(0);

    function makeBlankScreenCanvas() {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = Math.round(1024 / screenAspect);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return { canvas, ctx };
    }

    const { canvas: compositeCanvas, ctx: compositeCtx } = makeBlankScreenCanvas();
    const compositeTexture = new THREE.CanvasTexture(compositeCanvas);
    screenMeshA.material.map = compositeTexture;
    screenMeshA.material.opacity = 1;

    const FALLBACK_TEXTURE = new THREE.CanvasTexture(makeBlankScreenCanvas().canvas);

    const statusBarImg = STATUS_BAR_IMAGE ? new Image() : null;
    if (statusBarImg) statusBarImg.src = STATUS_BAR_IMAGE;

    const textureCache = new Map();

    function getTexture(url) {
      if (!url) return FALLBACK_TEXTURE;
      if (textureCache.has(url)) return textureCache.get(url).texture;

      const { canvas, ctx } = makeBlankScreenCanvas();
      const texture = new THREE.CanvasTexture(canvas);
      textureCache.set(url, { texture, canvas, ctx });

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth, drawHeight;
        let offsetX = 0, offsetY = 0;

        if (imgAspect >= canvasAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.fillStyle = SCREEN_FILL_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        texture.needsUpdate = true;
        lastUrlA = null;
      };
      img.src = url;

      img.onerror = () => {
        console.warn("Failed to load image:", url);
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

    function drawStatusBarOnCtx(ctx, w) {
      if (statusBarImg && statusBarImg.complete && statusBarImg.naturalWidth > 0) {
        const imgW = w - STATUS_BAR_PADDING_SIDE * 2;
        const imgH = Math.round(imgW * (statusBarImg.naturalHeight / statusBarImg.naturalWidth));
        const totalH = STATUS_BAR_PADDING_TOP + imgH;
        ctx.fillStyle = SCREEN_FILL_COLOR;
        ctx.fillRect(0, 0, w, totalH);
        ctx.drawImage(statusBarImg, STATUS_BAR_PADDING_SIDE, STATUS_BAR_PADDING_TOP, imgW, imgH);
      }
    }

    function drawStatusBar(w) {
      drawStatusBarOnCtx(compositeCtx, w);
    }

    let lastUrlA = null, lastUrlB = null, lastMixT = -1, lastTransition = null;

    function compositeImages(urlA, urlB, mixT, transition) {
      if (urlA === lastUrlA && urlB === lastUrlB && mixT === lastMixT && transition === lastTransition) return;
      lastUrlA = urlA; lastUrlB = urlB; lastMixT = mixT; lastTransition = transition;

      const w = compositeCanvas.width;
      const h = compositeCanvas.height;
      compositeCtx.clearRect(0, 0, w, h);
      compositeCtx.fillStyle = SCREEN_FILL_COLOR;
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

      if (transition === "scrollUp") {
        if (canvasA) compositeCtx.drawImage(canvasA, 0, -mixT * h);
        if (canvasB) compositeCtx.drawImage(canvasB, 0, (1 - mixT) * h);
      } else if (transition === "slideLeft") {
        if (canvasA) compositeCtx.drawImage(canvasA, -mixT * w, 0);
        if (canvasB) compositeCtx.drawImage(canvasB, (1 - mixT) * w, 0);
      } else if (transition === "popUp") {
        if (canvasA) compositeCtx.drawImage(canvasA, 0, 0);
        if (canvasB) compositeCtx.drawImage(canvasB, 0, (1 - mixT) * h);
      } else if (transition === "popDown") {
        if (canvasB) compositeCtx.drawImage(canvasB, 0, 0);
        if (canvasA) compositeCtx.drawImage(canvasA, 0, mixT * h);
      } else {
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

    // --- Notch ---
    const notchGeometry = new THREE.PlaneGeometry(0.7, 0.16);
    const notchMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const notchMesh = new THREE.Mesh(notchGeometry, notchMaterial);
    notchMesh.position.set(0, BODY_HEIGHT / 2 - 0.18, FRONT_Z + 0.01);
    phoneGroup.add(notchMesh);

    // --- Map stages to real sections on the page ---
    // #%:2 — Stages reference sections by DOM id (document.getElementById),
    // same as the original phone.js, rather than a ref map threaded down
    // through every section component. The sections in About.jsx keep their
    // original id="" attributes specifically so this lookup keeps working;
    // if a section's id is ever renamed, update data/stages.js `section` to
    // match. See NOTES.md #%:2.
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

    function resolvePosition(position) {
      if (typeof position === "number") return position;
      return POSITION_X[position] ?? POSITION_X.center;
    }

    function resolvePositionY(positionY) {
      return typeof positionY === "number" ? positionY : 50;
    }

    function stageTilt(stageConfig) {
      return stageConfig.tilt ?? BASE_TILT;
    }

    function stageScale(stageConfig) {
      return stageConfig.scale ?? 1;
    }

    function computeTarget() {
      const overrideUrl = overrideRef.current;
      if (overrideUrl) {
        const base = computeScrollTarget();
        return { ...base, imageUrlA: overrideUrl, imageUrlB: overrideUrl, mixT: 0 };
      }
      return computeScrollTarget();
    }

    function computeScrollTarget() {
      if (resolvedStages.length === 0) {
        return { percent: POSITION_X.center, percentY: 50, tilt: BASE_TILT, scale: 1, imageUrlA: null, imageUrlB: null, mixT: 0, imageTransition: "fade" };
      }

      const scrollCenter = window.scrollY + window.innerHeight / 2;

      if (scrollCenter <= resolvedStages[0].anchor) {
        const s = resolvedStages[0].config;
        const url = getStageImageUrl(s);
        return { percent: resolvePosition(s.position), percentY: resolvePositionY(s.positionY), tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: "fade" };
      }

      const last = resolvedStages[resolvedStages.length - 1];
      if (scrollCenter >= last.anchor) {
        const s = last.config;
        const url = getStageImageUrl(s);
        return { percent: resolvePosition(s.position), percentY: resolvePositionY(s.positionY), tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: "fade" };
      }

      for (let i = 0; i < resolvedStages.length - 1; i++) {
        const a = resolvedStages[i];
        const b = resolvedStages[i + 1];
        if (scrollCenter >= a.anchor && scrollCenter <= b.anchor) {
          const t = (scrollCenter - a.anchor) / (b.anchor - a.anchor);
          const percentA = resolvePosition(a.config.position);
          const percentB = resolvePosition(b.config.position);
          return {
            percent: lerp(percentA, percentB, t),
            percentY: lerp(resolvePositionY(a.config.positionY), resolvePositionY(b.config.positionY), t),
            tilt: lerp(stageTilt(a.config), stageTilt(b.config), t),
            scale: lerp(stageScale(a.config), stageScale(b.config), t),
            imageUrlA: getStageImageUrl(a.config),
            imageUrlB: getStageImageUrl(b.config),
            mixT: t,
            imageTransition: b.config.imageTransition || "fade",
          };
        }
      }

      const s = resolvedStages[0].config;
      const url = getStageImageUrl(s);
      return { percent: resolvePosition(s.position), percentY: resolvePositionY(s.positionY), tilt: stageTilt(s), scale: stageScale(s), imageUrlA: url, imageUrlB: url, mixT: 0, imageTransition: "fade" };
    }

    let currentPercent = POSITION_X.center;
    let currentPercentY = 50;
    let currentTilt = BASE_TILT;
    let currentScale = 1;

    const EPSILON = 0.0001;
    let rafId;

    function tick() {
      const target = computeTarget();

      const prevPercent = currentPercent;
      const prevPercentY = currentPercentY;
      const prevTilt = currentTilt;
      const prevScale = currentScale;

      currentPercent += (target.percent - currentPercent) * DAMPING;
      currentPercentY += (target.percentY - currentPercentY) * DAMPING;
      currentTilt += (target.tilt - currentTilt) * DAMPING;
      currentScale += (target.scale - currentScale) * DAMPING;

      const poseChanged = (
        Math.abs(currentPercent - prevPercent) > EPSILON ||
        Math.abs(currentPercentY - prevPercentY) > EPSILON ||
        Math.abs(currentTilt - prevTilt) > EPSILON ||
        Math.abs(currentScale - prevScale) > EPSILON
      );
      poseSettledRef.current = !poseChanged;

      const offsetX = -(currentPercent / 100 - 0.5) * stageW;
      const offsetY = (currentPercentY / 100 - 0.5) * stageH;

      if (poseChanged) {
        camera.setViewOffset(stageW, stageH, offsetX, offsetY, stageW, stageH);
        phoneGroup.rotation.y = currentTilt * DEG_TO_RAD;
        phoneGroup.rotation.x = BASE_PITCH;
        phoneGroup.scale.setScalar(BASE_SCALE * currentScale);
      }

      getTexture(target.imageUrlA);
      getTexture(target.imageUrlB);

      const compositeChanged = (
        target.imageUrlA !== lastUrlA ||
        target.imageUrlB !== lastUrlB ||
        target.mixT !== lastMixT ||
        target.imageTransition !== lastTransition
      );
      compositeImages(target.imageUrlA, target.imageUrlB, target.mixT, target.imageTransition);

      if (poseChanged || compositeChanged) {
        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(tick);
    }

    function handleResize() {
      stageW = stage.clientWidth;
      stageH = stage.clientHeight;
      camera.aspect = stageW / stageH;
      camera.updateProjectionMatrix();
      renderer.setSize(stageW, stageH);
      camera.clearViewOffset();
    }

    // Original phone.js clears the override on any scroll (so the phone
    // resumes following the page once the user moves past a hovered card).
    function handleScroll() {
      if (overrideRef.current) overrideRef.current = null;
    }

    let resolveTimeout;
    function onLoad() {
      resolveStages();
      resolveTimeout = setTimeout(resolveStages, 400);

      const s = resolvedStages.length > 0 ? resolvedStages[0].config : null;
      if (s) {
        currentPercent = resolvePosition(s.position);
        currentPercentY = resolvePositionY(s.positionY);
        currentTilt = stageTilt(s);
        currentScale = stageScale(s);
      }
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    window.addEventListener("resize", resolveStages);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    requestAnimationFrame(() => {
      phoneContainer.classList.add("phone-visible");
      document.body.classList.add("phone-active");
    });

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resolveTimeout);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", resolveStages);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("phone-active");
      stage.removeChild(renderer.domElement);
      renderer.dispose();
      bodyGeometry.dispose();
      screenGeometry.dispose();
      notchGeometry.dispose();
      textureCache.forEach(({ texture }) => texture.dispose());
      compositeTexture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="phone-container" ref={containerRef}>
      <div id="stage" ref={stageRef}></div>
    </div>
  );
}
