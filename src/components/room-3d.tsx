"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A real room, in 3D.
 *
 * One window wall, one sun that moves with the time of day, and the treatments
 * we actually sell layered onto the glass. Drag to look around.
 *
 * Raw three.js on purpose: no scene-graph wrapper to deadlock on measurement,
 * and every material is generated here so the page ships no assets.
 */

export type Layer = "none" | "sheer" | "blackout" | "roller" | "film";
export type TimeOfDay = "morning" | "noon" | "evening";
export type Floor = "tile" | "carpet";

export interface RoomState {
  layer: Layer;
  time: TimeOfDay;
  floor: Floor;
}

interface RoomApi {
  update: (s: RoomState) => void;
  dispose: () => void;
}

const W = 6.4; // room width
const H = 3.2; // room height
const D = 5.4; // room depth
const GLASS_W = 3.6;
const GLASS_H = 2.35;
const SILL = 0.35;

const SUN: Record<TimeOfDay, { pos: [number, number, number]; color: number; intensity: number; sky: [string, string] }> = {
  morning: { pos: [-6, 5.5, -9], color: 0xfff2d9, intensity: 2.1, sky: ["#cfe0e8", "#eef2f0"] },
  noon: { pos: [1.5, 11, -8], color: 0xffffff, intensity: 2.6, sky: ["#b9d2e2", "#e8eef1"] },
  evening: { pos: [7.5, 2.4, -8], color: 0xffc98a, intensity: 3.1, sky: ["#f0c89a", "#f7ded0"] },
};

function skyTexture(from: string, to: string) {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, from);
  g.addColorStop(0.62, to);
  g.addColorStop(1, "#dfe3e0");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A curtain panel: a plane pushed into folds, so it reads as cloth not card. */
function curtainGeometry(width: number, height: number, folds: number, depth: number) {
  const g = new THREE.PlaneGeometry(width, height, Math.max(24, folds * 6), 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = (x + width / 2) / width;
    pos.setZ(i, Math.sin(t * Math.PI * folds) * depth);
  }
  g.computeVertexNormals();
  return g;
}

function buildRoom(host: HTMLDivElement, initial: RoomState, interactive: boolean): RoomApi | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      // keeps the frame readable, so the view can be captured or saved
      preserveDrawingBuffer: true,
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "pan-y";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f4f2ee");

  const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 120);
  const camTarget = new THREE.Vector3(0, 1.28, -D / 2);
  camera.position.set(0, 1.6, 3.5);
  camera.lookAt(camTarget);

  // ---------- lights ----------
  const ambient = new THREE.HemisphereLight(0xf6f8fa, 0xd8d0c2, 0.8);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(0, 0.8, 0);

  const bounce = new THREE.PointLight(0xfff0dc, 0.35, 12, 2);
  bounce.position.set(0, 1.6, -1.2);
  scene.add(bounce);

  // a soft fill from behind the camera so the near walls are not in the dark
  const fill = new THREE.DirectionalLight(0xf4f1ea, 0.45);
  fill.position.set(1.5, 3, 7);
  scene.add(fill);

  // ---------- materials ----------
  const wallMat = new THREE.MeshStandardMaterial({ color: "#f3f0ea", roughness: 0.95, metalness: 0 });
  const ceilMat = new THREE.MeshStandardMaterial({ color: "#f6f4f0", roughness: 1 });
  const tileMat = new THREE.MeshStandardMaterial({ color: "#e3ded5", roughness: 0.4, metalness: 0.02 });
  const carpetMat = new THREE.MeshStandardMaterial({ color: "#c9bfa9", roughness: 1 });
  const frameMat = new THREE.MeshStandardMaterial({ color: "#2b2e31", roughness: 0.55, metalness: 0.25 });

  // ---------- shell ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), tileMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), carpetMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.012, -1.1);
  rug.receiveShadow = true;
  rug.visible = initial.floor === "carpet";
  scene.add(rug);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, H, 0);
  scene.add(ceiling);

  // window wall, built as four pieces around the opening
  const wallZ = -D / 2;
  const sideW = (W - GLASS_W) / 2;
  const addWall = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    m.position.set(x, y, wallZ);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  addWall(sideW, H, -(GLASS_W / 2 + sideW / 2), H / 2);
  addWall(sideW, H, GLASS_W / 2 + sideW / 2, H / 2);
  addWall(GLASS_W, SILL, 0, SILL / 2);
  addWall(GLASS_W, H - SILL - GLASS_H, 0, SILL + GLASS_H + (H - SILL - GLASS_H) / 2);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), wallMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(W / 2, H / 2, 0);
  scene.add(rightWall);

  // ---------- glazing ----------
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.14,
    roughness: 0.05,
    metalness: 0,
    transmission: 0,
    side: THREE.DoubleSide,
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(GLASS_W, GLASS_H), glassMat);
  glass.position.set(0, SILL + GLASS_H / 2, wallZ + 0.01);
  scene.add(glass);

  // mullions
  const mull = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), frameMat);
    m.position.set(x, y, wallZ + 0.02);
    m.castShadow = true;
    scene.add(m);
  };
  mull(GLASS_W + 0.12, 0.09, 0, SILL);
  mull(GLASS_W + 0.12, 0.09, 0, SILL + GLASS_H);
  mull(0.09, GLASS_H, -GLASS_W / 2, SILL + GLASS_H / 2);
  mull(0.09, GLASS_H, GLASS_W / 2, SILL + GLASS_H / 2);
  mull(0.06, GLASS_H, -GLASS_W / 6, SILL + GLASS_H / 2);
  mull(0.06, GLASS_H, GLASS_W / 6, SILL + GLASS_H / 2);

  // outside: sky plus a suggestion of towers
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture(...SUN[initial.time].sky), toneMapped: false });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(44, 26), skyMat);
  sky.position.set(0, 5, wallZ - 17);
  scene.add(sky);

  const skylineMat = new THREE.MeshBasicMaterial({ color: "#c2ced4", toneMapped: false });
  [
    [-5.5, 3.2, 1.6],
    [-3.2, 5.2, 1.2],
    [-1.1, 2.4, 1.5],
    [1.4, 6.4, 1.3],
    [3.6, 3.6, 1.8],
    [5.8, 5.0, 1.4],
  ].forEach(([x, h, w]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.4), skylineMat);
    b.position.set(x * 1.6, h / 2 - 0.5, wallZ - 12.5);
    scene.add(b);
  });

  // ---------- smart film ----------
  const filmMat = new THREE.MeshPhysicalMaterial({
    color: "#eef1f1",
    transparent: true,
    opacity: 0,
    roughness: 0.95,
    side: THREE.DoubleSide,
  });
  const film = new THREE.Mesh(new THREE.PlaneGeometry(GLASS_W - 0.06, GLASS_H - 0.06), filmMat);
  film.position.set(0, SILL + GLASS_H / 2, wallZ + 0.04);
  scene.add(film);

  // ---------- roller blind ----------
  const rollerMat = new THREE.MeshStandardMaterial({
    color: "#4a4a46",
    roughness: 0.85,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const rollerH = GLASS_H + 0.12;
  const roller = new THREE.Mesh(new THREE.PlaneGeometry(GLASS_W + 0.1, rollerH), rollerMat);
  roller.position.set(0, SILL + GLASS_H + 0.06, wallZ + 0.07);
  roller.geometry.translate(0, -rollerH / 2, 0); // hang from the top
  roller.scale.y = 0.001;
  roller.castShadow = true;
  scene.add(roller);

  const rollerTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, GLASS_W + 0.16, 12),
    frameMat,
  );
  rollerTube.rotation.z = Math.PI / 2;
  rollerTube.position.set(0, SILL + GLASS_H + 0.12, wallZ + 0.08);
  scene.add(rollerTube);

  // ---------- curtains ----------
  const panelW = GLASS_W / 2 + 0.2;
  const curtainMats = {
    sheer: new THREE.MeshStandardMaterial({
      color: "#f7f3ea",
      roughness: 1,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    }),
    blackout: new THREE.MeshStandardMaterial({
      color: "#d6cab2",
      roughness: 1,
      side: THREE.DoubleSide,
    }),
  };
  const curtainGeo = curtainGeometry(panelW, H - 0.12, 7, 0.09);
  const left = new THREE.Mesh(curtainGeo, curtainMats.sheer);
  left.position.set(-panelW / 2, (H - 0.12) / 2 + 0.06, wallZ + 0.22);
  left.castShadow = true;
  scene.add(left);
  const right = new THREE.Mesh(curtainGeo.clone(), curtainMats.sheer);
  right.position.set(panelW / 2, (H - 0.12) / 2 + 0.06, wallZ + 0.22);
  right.castShadow = true;
  scene.add(right);

  const track = new THREE.Mesh(new THREE.BoxGeometry(W - 0.6, 0.06, 0.1), frameMat);
  track.position.set(0, H - 0.06, wallZ + 0.22);
  scene.add(track);

  // ---------- furniture, kept as quiet silhouettes ----------
  const soft = new THREE.MeshStandardMaterial({ color: "#cdc6b8", roughness: 1 });
  const wood = new THREE.MeshStandardMaterial({ color: "#8a7a63", roughness: 0.7 });

  const sofa = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.38, 0.85), soft);
  seat.position.y = 0.3;
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.52, 0.22), soft);
  back.position.set(0, 0.62, -0.32);
  [seat, back].forEach((m) => {
    m.castShadow = true;
    m.receiveShadow = true;
    sofa.add(m);
  });
  sofa.position.set(0, 0, -0.35);
  sofa.rotation.y = Math.PI;
  scene.add(sofa);

  const table = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 0.55), wood);
  table.position.set(0, 0.36, -1.5);
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);

  // a low console against the side wall, just enough to give the room scale
  const console_ = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.62, 1.5), wood);
  console_.position.set(-W / 2 + 0.25, 0.31, -2.0);
  console_.castShadow = true;
  console_.receiveShadow = true;
  scene.add(console_);

  // ---------- state ----------
  const state: RoomState = { ...initial };
  const targets = { curtainOpen: 1, roller: 0, film: 0, sunScale: 1 };
  const current = { ...targets };

  const applyState = (s: RoomState) => {
    Object.assign(state, s);

    // sun
    const cfg = SUN[s.time];
    sun.position.set(...cfg.pos);
    sun.color.set(cfg.color);
    skyMat.map?.dispose();
    skyMat.map = skyTexture(...cfg.sky);
    skyMat.needsUpdate = true;

    // layer
    switch (s.layer) {
      case "none":
        targets.curtainOpen = 1;
        targets.roller = 0;
        targets.film = 0;
        targets.sunScale = 1;
        break;
      case "sheer":
        left.material = curtainMats.sheer;
        right.material = curtainMats.sheer;
        targets.curtainOpen = 0;
        targets.roller = 0;
        targets.film = 0;
        targets.sunScale = 0.55;
        break;
      case "blackout":
        left.material = curtainMats.blackout;
        right.material = curtainMats.blackout;
        targets.curtainOpen = 0;
        targets.roller = 0;
        targets.film = 0;
        targets.sunScale = 0.12;
        break;
      case "roller":
        targets.curtainOpen = 1;
        targets.roller = 1;
        targets.film = 0;
        targets.sunScale = 0.4;
        break;
      case "film":
        targets.curtainOpen = 1;
        targets.roller = 0;
        targets.film = 1;
        targets.sunScale = 0.8;
        break;
    }

    rug.visible = s.floor === "carpet";
  };

  applyState(initial);
  Object.assign(current, targets);

  // ---------- interaction ----------
  let azimuth = 0;
  let elevation = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    azimuth = THREE.MathUtils.clamp(azimuth + (e.clientX - lastX) * 0.0022, -0.5, 0.5);
    elevation = THREE.MathUtils.clamp(elevation - (e.clientY - lastY) * 0.0016, -0.16, 0.22);
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  if (interactive) {
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", onUp);
    renderer.domElement.style.cursor = "grab";
  }

  // framing adapts to the viewport: a phone in portrait needs a wider, further
  // camera or the window fills the frame and the room disappears
  let baseZ = 3.5;

  const resize = () => {
    const w = host.clientWidth || 800;
    const h = host.clientHeight || 500;
    renderer.setSize(w, h, false);
    const aspect = w / Math.max(h, 1);
    camera.aspect = aspect;
    if (aspect >= 1.45) {
      camera.fov = 47;
      baseZ = 3.5;
    } else if (aspect >= 1.05) {
      camera.fov = 52;
      baseZ = 4.0;
    } else {
      camera.fov = 60;
      baseZ = 4.6;
    }
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
  io.observe(host);

  let raf = 0;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  /**
   * Draw one frame. `snap` jumps straight to the target state, which is what we
   * want for the first paint and any change made while the tab is in the
   * background — otherwise a page restored from another tab shows an empty room.
   */
  const frame = (snap = false) => {
    const ease = snap ? 1 : 0;
    current.curtainOpen = snap ? targets.curtainOpen : lerp(current.curtainOpen, targets.curtainOpen, 0.09);
    current.roller = snap ? targets.roller : lerp(current.roller, targets.roller, 0.09);
    current.film = snap ? targets.film : lerp(current.film, targets.film, 0.11);
    current.sunScale = snap ? targets.sunScale : lerp(current.sunScale, targets.sunScale, 0.08);
    void ease;

    // closed, the panels meet in the middle; open, they bunch clear of the glass
    const o = current.curtainOpen;
    const bunch = 1 - o * 0.5;
    const innerEdge = o * (GLASS_W / 2 + 0.06);
    const half = (panelW * bunch) / 2;
    left.position.x = -innerEdge - half;
    right.position.x = innerEdge + half;
    left.scale.x = bunch;
    right.scale.x = bunch;
    const opaque = state.layer === "blackout";
    left.visible = right.visible = !(state.layer === "roller" || state.layer === "film") || current.curtainOpen > 0.02;
    curtainMats.sheer.opacity = 0.55;
    curtainMats.blackout.opacity = 1;
    void opaque;

    roller.scale.y = Math.max(0.001, current.roller);
    filmMat.opacity = current.film * 0.92;
    filmMat.roughness = 0.95;

    sun.intensity = SUN[state.time].intensity * current.sunScale;
    ambient.intensity = 0.52 + 0.38 * current.sunScale;
    fill.intensity = 0.28 + 0.22 * current.sunScale;
    bounce.intensity = 0.18 + 0.3 * current.sunScale;

    const radius = baseZ + 0.1;
    camera.position.x = Math.sin(azimuth) * radius;
    camera.position.z = baseZ - (1 - Math.cos(azimuth)) * radius;
    camera.position.y = 1.6 + elevation * 1.7;
    camera.lookAt(camTarget);

    renderer.render(scene, camera);
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    // rAF is already throttled in background tabs, so visibility on screen is
    // the only guard we need here.
    if (!visible) return;
    frame();
  };

  frame(true); // first paint, before any animation frame arrives
  tick();

  return {
    update: (s: RoomState) => {
      applyState(s);
      if (document.hidden) frame(true);
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function Room3D({
  state,
  interactive = true,
  className = "",
}: {
  state: RoomState;
  interactive?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<RoomApi | null>(null);

  useEffect(() => {
    if (!host.current) return;
    api.current = buildRoom(host.current, state, interactive);
    return () => {
      api.current?.dispose();
      api.current = null;
    };
    // built once: later changes go through update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  useEffect(() => {
    api.current?.update(state);
  }, [state]);

  return (
    <div
      ref={host}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: "linear-gradient(180deg,#f6f4f0,#eceae5)" }}
    />
  );
}
