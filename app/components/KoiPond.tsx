'use client';

/*
  KoiPond — interactive pixel-art koi pond rendered to a single <canvas>.

  Visual target: lush, dark, dense pixel-art pond (near-black water, heavy
  lily mats at edges, stems, thick reeds, visible koi). All interaction
  mechanics (click/swipe/rain/flee) are unchanged from prior iterations.

  Draw order (back → front):
    water + caustics → sparkles → light patches → stems → rain ripples →
    fish → food pellets → pads + flowers → reeds → user/swipe ripples
*/

import { useEffect, useRef, useState } from 'react';

/* ── Config ────────────────────────────────────────────────────────── */
/* Base authored resolution — callers override via `resolution` prop. */
const BASE_CANVAS_W   = 480;
const BASE_CANVAS_H   = 320;
const DEFAULT_RESOLUTION = { width: BASE_CANVAS_W, height: BASE_CANVAS_H };
const PIXEL_SIZE      = 5;
const CAUSTIC_STEP    = 8;
const RIPPLE_SQUASH   = 0.75; /* match lily-pad Y perspective */
const NUM_SPARKLES    = 48;
const NUM_FLOWERS     = 12;

/* ── Palette ───────────────────────────────────────────────────────── */
type Vec3   = [number, number, number];
type Bounds = { w: number; h: number; scale: number };

const sc = (b: Bounds, n: number) => n * b.scale;
type Pos    = { x: number; y: number };

/* Near-black water — teal only in caustic highlights */
const WATER_DEEP:  Vec3 = [8, 14, 24];
const WATER_MID:   Vec3 = [12, 28, 36];
const WATER_LIGHT: Vec3 = [18, 42, 50];
const CAUSTIC_ALPHA = 0.55;

const PAD_GREENS: Vec3[] = [
  [16, 52, 24], [22, 68, 30], [30, 86, 38], [38, 104, 46],
  [48, 124, 56], [58, 142, 64], [70, 158, 72], [40, 108, 48], [26, 78, 34],
];

const STEM_COLOR: Vec3 = [80, 35, 25];

const REED_FLOWER_COLORS: Vec3[] = [
  [80, 120, 200], [160, 100, 180], [220, 180, 40], [200, 100, 30],
];

type FishPalette = { body: Vec3; accent: Vec3; spot?: Vec3 };

const FISH_COLORS: FishPalette[] = [
  { body: [245, 240, 235], accent: [200, 45, 35] },           /* Kohaku */
  { body: [240, 230, 210], accent: [180, 35, 30] },           /* Kohaku variant */
  { body: [245, 240, 235], accent: [200, 45, 35], spot: [28, 28, 32] }, /* Sanke */
  { body: [30, 30, 35], accent: [200, 50, 40], spot: [235, 232, 228] }, /* Showa */
  { body: [220, 175, 45], accent: [220, 175, 45] },           /* Ogon */
  { body: [220, 225, 230], accent: [220, 225, 230] },         /* Platinum Ogon */
  { body: [80, 95, 115], accent: [200, 90, 40] },               /* Asagi */
  { body: [25, 25, 30], accent: [210, 170, 40] },               /* Ki Utsuri */
];

interface KoiPatch {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  color: Vec3;
  alpha: number;
}

const darkenVec3 = (c: Vec3, t: number): Vec3 =>
  c.map((v) => Math.round(v * (1 - t))) as Vec3;

const colorsEqual = (a: Vec3, b: Vec3) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/** Closed bezier koi silhouette in local space (+x = nose). */
function traceKoiBody(c: CanvasRenderingContext2D, s: number) {
  c.beginPath();
  c.moveTo(s * 0.45, 0);
  c.bezierCurveTo(s * 0.35, -s * 0.2, s * 0.1, -s * 0.28, -s * 0.2, -s * 0.18);
  c.bezierCurveTo(-s * 0.35, -s * 0.12, -s * 0.48, -s * 0.06, -s * 0.5, 0);
  c.bezierCurveTo(-s * 0.48, s * 0.06, -s * 0.35, s * 0.12, -s * 0.2, s * 0.18);
  c.bezierCurveTo(s * 0.1, s * 0.28, s * 0.35, s * 0.2, s * 0.45, 0);
  c.closePath();
}

const WAKE_COLOR: Vec3 = [100, 160, 180];
const FOOD_COLOR: Vec3 = [180, 140, 80];

/* ── Utilities ─────────────────────────────────────────────────────── */
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const lerpColor = (c1: Vec3, c2: Vec3, t: number): Vec3 =>
  c1.map((v, i) => Math.round(lerp(v, c2[i], t))) as Vec3;

const dist = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const rgb = (c: Vec3, a?: number) =>
  a !== undefined ? `rgba(${c[0]},${c[1]},${c[2]},${a})` : `rgb(${c[0]},${c[1]},${c[2]})`;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/* Slow atmospheric drift on the base water (15–20s feel). */
function getWaterPalettes(t: number): { deep: Vec3; mid: Vec3; light: Vec3 } {
  const driftB = Math.sin(t * 0.07) * 3;
  const driftG = Math.sin(t * 0.05 + 1.2) * 2;
  const deep: Vec3 = [
    WATER_DEEP[0],
    WATER_DEEP[1] + Math.round(driftG),
    clamp(WATER_DEEP[2] + Math.round(driftB), 18, 30),
  ];
  return {
    deep,
    mid:   lerpColor(deep, WATER_MID, 0.55),
    light: WATER_LIGHT,
  };
}

function getWaterColor(x: number, y: number, t: number, palettes: { deep: Vec3; mid: Vec3; light: Vec3 }): Vec3 {
  /* Caustic time multipliers ×1.5 so shimmer stays visible at 480×320 */
  const s1 = Math.sin(x * 0.08 + t * 0.45)  * Math.cos(y * 0.06 + t * 0.3);
  const s2 = Math.sin(x * 0.12 - t * 0.225 + y * 0.04) * Math.cos(y * 0.1 + t * 0.375);
  const s3 = Math.sin((x + y) * 0.05 + t * 0.27);
  const v  = (s1 + s2 + s3) / 3;
  const n  = v * 0.5 + 0.5;
  if (n > 0.62) return lerpColor(palettes.mid, palettes.light, (n - 0.62) / 0.38);
  if (n > 0.32) return lerpColor(palettes.deep, palettes.mid, (n - 0.32) / 0.30);
  return palettes.deep;
}

/* Drifting dappled-light patches (drawn after caustics). */
interface LightPatch {
  baseX:   number;
  baseY:   number;
  radius:  number;
  phase:   number;
  speed:   number;
  orbitRx: number;
  orbitRy: number;
}

function createLightPatches(b: Bounds): LightPatch[] {
  const patches: LightPatch[] = [];
  for (let i = 0; i < 4; i++) {
    patches.push({
      baseX:   rand(b.w * 0.15, b.w * 0.85),
      baseY:   rand(b.h * 0.15, b.h * 0.85),
      radius:  rand(sc(b, 40), sc(b, 70)),
      phase:   rand(0, Math.PI * 2),
      speed:   rand(0.3, 0.8),
      orbitRx: rand(sc(b, 25), sc(b, 55)),
      orbitRy: rand(sc(b, 18), sc(b, 45)),
    });
  }
  return patches;
}

function drawLightPatches(c: CanvasRenderingContext2D, patches: LightPatch[], t: number) {
  for (const p of patches) {
    const x = p.baseX + Math.sin(t * p.speed + p.phase) * p.orbitRx;
    const y = p.baseY + Math.cos(t * p.speed * 0.65 + p.phase * 1.3) * p.orbitRy;
    const grad = c.createRadialGradient(x, y, 0, x, y, p.radius);
    grad.addColorStop(0, 'rgba(60, 100, 110, 0.04)');
    grad.addColorStop(1, 'rgba(60, 100, 110, 0)');
    c.fillStyle = grad;
    c.beginPath();
    c.ellipse(x, y, p.radius, p.radius * 0.7, 0, 0, Math.PI * 2);
    c.fill();
  }
}

type SmoothNoise = (x: number) => number;

function makeSmoothNoise(): SmoothNoise {
  const offset = Math.random() * 1000;
  return (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const t = f * f * (3 - 2 * f);
    const a = Math.sin((i + offset) * 127.1) * 0.5 + 0.5;
    const b = Math.sin((i + 1 + offset) * 127.1) * 0.5 + 0.5;
    return lerp(a, b, t);
  };
}

/* ── Water sparkle ─────────────────────────────────────────────────── */
interface WaterSparkle {
  x: number;
  y: number;
  phase: number;
  speed: number;
  radius: number;
}

function createSparkles(b: Bounds): WaterSparkle[] {
  const out: WaterSparkle[] = [];
  const m = sc(b, 8);
  for (let i = 0; i < NUM_SPARKLES; i++) {
    out.push({
      x:      rand(m, b.w - m),
      y:      rand(m, b.h - m),
      phase:  rand(0, Math.PI * 2),
      speed:  rand(0.8, 2.2),
      radius: rand(0.5, 1.0) * b.scale,
    });
  }
  return out;
}

function drawSparkles(c: CanvasRenderingContext2D, sparkles: WaterSparkle[], t: number) {
  for (const s of sparkles) {
    const twinkle = 0.3 + (Math.sin(t * s.speed + s.phase) * 0.5 + 0.5) * 0.3;
    const alpha   = clamp(twinkle, 0.25, 0.6);
    c.fillStyle = `rgba(140, 200, 210, ${alpha})`;
    c.beginPath();
    c.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    c.fill();
  }
}

/* ── Ripple ─────────────────────────────────────────────────────────── */
type RippleType = 'user' | 'rain' | 'swipe';

class Ripple {
  x: number;
  y: number;
  type: RippleType;
  radius     = 0;
  life       = 1;
  maxRadius:  number;
  speed:      number;
  rings:      number;
  alpha:      number;
  lineWidth:  number;

  ringGap: number;

  constructor(x: number, y: number, type: RippleType = 'user', scale = 1) {
    this.x    = x;
    this.y    = y;
    this.type = type;
    if (type === 'rain') {
      this.maxRadius = rand(20, 35) * scale;
      this.speed     = rand(14, 20) * scale;
      this.rings     = 2;
      this.alpha     = 0.4;
      this.lineWidth = rand(0.6, 0.8) * scale;
      this.ringGap   = 3 * scale;
    } else if (type === 'swipe') {
      this.maxRadius = rand(30, 50) * scale;
      this.speed     = rand(14, 20) * scale;
      this.rings     = 2;
      this.alpha     = 0.35;
      this.lineWidth = rand(0.8, 1.0) * scale;
      this.ringGap   = 6 * scale;
    } else {
      this.maxRadius = rand(60, 100) * scale;
      this.speed     = rand(12, 18) * scale;
      this.rings     = 3;
      this.alpha     = 0.4;
      this.lineWidth = rand(0.9, 1.0) * scale;
      this.ringGap   = 6 * scale;
    }
  }

  update(dt: number) {
    this.radius += this.speed * dt;
    this.life    = Math.max(0, 1 - this.radius / this.maxRadius);
  }

  draw(c: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    const ryScale = RIPPLE_SQUASH;
    for (let i = 0; i < this.rings; i++) {
      const r = this.radius - i * this.ringGap;
      if (r < 0) continue;
      const alpha = this.life * (1 - i / this.rings) * this.alpha;
      c.beginPath();
      c.ellipse(this.x, this.y, r, r * ryScale, 0, 0, Math.PI * 2);
      c.strokeStyle = `rgba(120, 200, 210, ${alpha})`;
      c.lineWidth   = this.lineWidth;
      c.stroke();
    }
  }

  get alive() { return this.life > 0; }
}

/* ── Fish food pellet ──────────────────────────────────────────────── */
class FoodPellet {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  eaten: boolean;
  sinkPhase: number;

  constructor(x: number, y: number, scale: number) {
    this.x         = x + rand(-3, 3) * scale;
    this.y         = y + rand(-3, 3) * scale;
    this.life      = 1;
    this.maxLife   = rand(6, 10);
    this.size      = rand(1, 2) * scale;
    this.eaten     = false;
    this.sinkPhase = rand(0, Math.PI * 2);
  }

  update(dt: number) {
    if (this.eaten) return;
    this.life -= dt / this.maxLife;
  }

  draw(c: CanvasRenderingContext2D, t: number) {
    if (this.eaten || this.life <= 0) return;
    const bobX = Math.sin(t * 2.1 + this.sinkPhase) * 0.35;
    const bobY = Math.cos(t * 1.6 + this.sinkPhase) * 0.25;
    c.save();
    c.translate(this.x + bobX, this.y + bobY);
    c.scale(1, RIPPLE_SQUASH);
    c.beginPath();
    c.arc(0, 0, this.size, 0, Math.PI * 2);
    c.fillStyle = rgb(FOOD_COLOR, clamp(this.life, 0, 1) * 0.92);
    c.fill();
    c.restore();
  }

  get alive() { return !this.eaten && this.life > 0; }
}

/* ── Lily Pad ──────────────────────────────────────────────────────── */
class LilyPad {
  x: number;
  y: number;
  r: number;
  squashY: number;
  color: Vec3;
  colorDark: Vec3;
  colorLight: Vec3;
  fillAlpha: number;
  notchAngle: number;
  notchWidth: number;
  bobPhase: number;
  bobSpeed: number;
  rotation: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  rotDriftPhase: number;
  rotDriftSpeed: number;
  rippleReach: number;

  constructor(
    b: Bounds,
    opts?: { x?: number; y?: number; r?: number; fillAlpha?: number },
  ) {
    this.rippleReach = sc(b, 20);
    this.x = opts?.x ?? rand(sc(b, 30), b.w - sc(b, 30));
    this.y = opts?.y ?? rand(sc(b, 20), b.h - sc(b, 20));
    /* ~40% small pads in dense mats */
    if (opts?.r !== undefined) {
      this.r = sc(b, opts.r);
    } else {
      this.r = Math.random() < 0.4 ? rand(sc(b, 6), sc(b, 9)) : rand(sc(b, 10), sc(b, 20));
    }
    this.squashY = rand(0.70, 0.80);
    this.fillAlpha = opts?.fillAlpha ?? 1;

    const base  = PAD_GREENS[Math.floor(Math.random() * PAD_GREENS.length)];
    const shift = rand(-14, 18);
    this.color      = base.map((v) => clamp(v + shift, 0, 255)) as Vec3;
    this.colorDark  = this.color.map((v) => Math.max(0, v - 28)) as Vec3;
    this.colorLight = this.color.map((v) => clamp(v + 22, 0, 255)) as Vec3;

    this.notchAngle    = rand(0, Math.PI * 2);
    this.notchWidth    = rand(0.3, 0.6);
    this.bobPhase      = rand(0, Math.PI * 2);
    this.bobSpeed      = rand(0.3, 0.6);
    this.rotation      = rand(0, Math.PI * 2);
    this.driftPhaseX   = rand(0, 1000);
    this.driftPhaseY   = rand(0, 1000);
    this.driftSpeedX   = rand(0.08, 0.15);
    this.driftSpeedY   = rand(0.06, 0.12);
    this.driftAmpX     = rand(0.3, 0.8);
    this.driftAmpY     = rand(0.2, 0.6);
    this.rotDriftPhase = rand(0, 1000);
    this.rotDriftSpeed = rand(0.03, 0.08);
  }

  getPosition(t: number, ripples: Ripple[]): Pos {
    const bob      = Math.sin(t * this.bobSpeed + this.bobPhase) * 0.4;
    const driftX   = Math.sin(t * this.driftSpeedX + this.driftPhaseX) * this.driftAmpX;
    const driftY   = Math.sin(t * this.driftSpeedY + this.driftPhaseY) * this.driftAmpY;
    let pushX = 0;
    let pushY = 0;
    for (const rip of ripples) {
      const d = dist(this.x, this.y, rip.x, rip.y);
      if (d < rip.radius + this.rippleReach && d > Math.abs(rip.radius - this.rippleReach)) {
        const strength = rip.type === 'rain' ? 0.4 : rip.type === 'swipe' ? 1.8 : 2.5;
        const pushStr  = rip.life * strength;
        const angle    = Math.atan2(this.y - rip.y, this.x - rip.x);
        pushX += Math.cos(angle) * pushStr;
        pushY += Math.sin(angle) * pushStr;
      }
    }
    return {
      x: this.x + driftX + pushX,
      y: this.y + bob + driftY + pushY,
    };
  }

  private tracePadPath(c: CanvasRenderingContext2D) {
    c.beginPath();
    const startAngle = this.notchAngle + this.notchWidth / 2;
    const endAngle   = this.notchAngle - this.notchWidth / 2 + Math.PI * 2;
    c.arc(0, 0, this.r, startAngle, endAngle);
    c.lineTo(0, 0);
    c.closePath();
  }

  draw(c: CanvasRenderingContext2D, t: number, ripples: Ripple[]) {
    const { x: xx, y: yy } = this.getPosition(t, ripples);
    const rotDrift = Math.sin(t * this.rotDriftSpeed + this.rotDriftPhase) * 0.03;

    c.save();
    c.translate(xx, yy);
    c.scale(1, this.squashY);
    c.rotate(this.rotation + rotDrift);

    this.tracePadPath(c);
    c.fillStyle = rgb(this.color, this.fillAlpha);
    c.fill();

    /* Directional shading — light from top-left */
    c.save();
    this.tracePadPath(c);
    c.clip();
    c.beginPath();
    c.ellipse(this.r * 0.22, this.r * 0.22, this.r * 0.55, this.r * 0.35, 0.4, 0, Math.PI * 2);
    c.fillStyle = rgb(this.colorLight, 0.2 * this.fillAlpha);
    c.fill();
    c.beginPath();
    c.ellipse(-this.r * 0.2, -this.r * 0.2, this.r * 0.5, this.r * 0.32, 0.4, Math.PI, Math.PI * 2);
    c.fillStyle = rgb(this.colorDark, 0.3 * this.fillAlpha);
    c.fill();
    c.restore();

    /* Darker centre vein */
    c.beginPath();
    c.arc(0, 0, this.r * 0.38, 0, Math.PI * 2);
    c.fillStyle = rgb(this.colorDark, 0.28 * this.fillAlpha);
    c.fill();

    c.strokeStyle = rgb(this.colorDark, 0.22 * this.fillAlpha);
    c.lineWidth   = 0.65;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      if (Math.abs(a - this.notchAngle) < this.notchWidth) continue;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(Math.cos(a) * this.r * 0.85, Math.sin(a) * this.r * 0.85);
      c.stroke();
    }

    c.restore();
  }
}

/* ── Lily pad stem (drawn under pads) ──────────────────────────────── */
class PadStem {
  rootX: number;
  rootY: number;
  pad: LilyPad;
  ctrlX: number;
  ctrlY: number;
  alpha: number;
  lineWidth: number;

  constructor(rootX: number, rootY: number, pad: LilyPad, b: Bounds) {
    this.rootX     = rootX;
    this.rootY     = rootY;
    this.pad       = pad;
    this.ctrlX     = (rootX + pad.x) / 2 + rand(-1, 1) * rand(sc(b, 16), sc(b, 36));
    this.ctrlY     = (rootY + pad.y) / 2 + rand(-sc(b, 6), sc(b, 6));
    this.alpha     = rand(0.4, 0.55);
    this.lineWidth = rand(0.6, 1.0) * b.scale;
  }

  draw(c: CanvasRenderingContext2D, t: number, ripples: Ripple[]) {
    const p = this.pad.getPosition(t, ripples);
    c.beginPath();
    c.moveTo(this.rootX, this.rootY);
    c.quadraticCurveTo(this.ctrlX, this.ctrlY, p.x, p.y);
    c.strokeStyle = rgb(STEM_COLOR, this.alpha);
    c.lineWidth   = this.lineWidth;
    c.stroke();
  }
}

/* ── Lily Flower ───────────────────────────────────────────────────── */
class LilyFlower {
  x: number;
  y: number;
  r: number;
  petals: number;
  phase: number;
  isWhite: boolean;
  bobPhase: number;
  bobSpeed: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  rippleReach: number;

  constructor(pad: LilyPad, b: Bounds) {
    this.rippleReach = pad.rippleReach;
    this.x           = pad.x + rand(-sc(b, 4), sc(b, 4));
    this.y           = pad.y + rand(-sc(b, 4), sc(b, 4));
    this.r           = rand(sc(b, 7), sc(b, 10));
    this.petals      = Math.floor(rand(5, 7));
    this.phase       = rand(0, Math.PI * 2);
    this.isWhite     = Math.random() > 0.4;
    this.bobPhase    = pad.bobPhase;
    this.bobSpeed    = pad.bobSpeed;
    this.driftPhaseX = pad.driftPhaseX + rand(-50, 50);
    this.driftPhaseY = pad.driftPhaseY + rand(-50, 50);
    this.driftSpeedX = pad.driftSpeedX;
    this.driftSpeedY = pad.driftSpeedY;
    this.driftAmpX   = pad.driftAmpX;
    this.driftAmpY   = pad.driftAmpY;
  }

  draw(c: CanvasRenderingContext2D, t: number, ripples: Ripple[]) {
    const bob    = Math.sin(t * this.bobSpeed + this.bobPhase) * 0.4;
    const driftX = Math.sin(t * this.driftSpeedX + this.driftPhaseX) * this.driftAmpX;
    const driftY = Math.sin(t * this.driftSpeedY + this.driftPhaseY) * this.driftAmpY;

    let pushX = 0;
    let pushY = 0;
    for (const rip of ripples) {
      const d = dist(this.x, this.y, rip.x, rip.y);
      if (d < rip.radius + this.rippleReach && d > Math.abs(rip.radius - this.rippleReach)) {
        const strength = rip.type === 'rain' ? 0.3 : rip.type === 'swipe' ? 1.5 : 2.0;
        const pushStr  = rip.life * strength;
        const angle    = Math.atan2(this.y - rip.y, this.x - rip.x);
        pushX += Math.cos(angle) * pushStr;
        pushY += Math.sin(angle) * pushStr;
      }
    }

    const xx                = this.x + driftX + pushX;
    const yy                = this.y + bob + driftY + pushY;
    const petalColor: Vec3  = this.isWhite ? [244, 244, 238] : [228, 188, 214];
    const centerColor: Vec3 = [244, 212, 60];

    c.save();
    c.translate(xx, yy);
    c.scale(1, RIPPLE_SQUASH);
    for (let i = 0; i < this.petals; i++) {
      const a = (i / this.petals) * Math.PI * 2 + this.phase;
      c.save();
      c.rotate(a);
      c.beginPath();
      c.ellipse(this.r * 0.55, 0, this.r * 0.65, this.r * 0.32, 0, 0, Math.PI * 2);
      c.fillStyle = rgb(petalColor, 0.95);
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, this.r * 0.32, 0, Math.PI * 2);
    c.fillStyle = rgb(centerColor);
    c.fill();
    c.restore();
  }
}

/* ── Reed ──────────────────────────────────────────────────────────── */
class Reed {
  x: number;
  y: number;
  height: number;
  segments: number;
  swayPhase: number;
  swaySpeed: number;
  color: Vec3;
  hasFlower: boolean;
  flowerColor: Vec3;
  stemWidth: number;

  constructor(b: Bounds, x?: number, y?: number, height?: number) {
    this.x         = x ?? rand(0, b.w);
    this.y         = y ?? rand(0, b.h);
    this.height    = height !== undefined ? sc(b, height) : rand(sc(b, 16), sc(b, 50));
    this.segments  = Math.floor(rand(2, 6));
    this.swayPhase = rand(0, Math.PI * 2);
    this.swaySpeed = rand(0.35, 0.85);
    this.color     = [
      28 + Math.random() * 28,
      75 + Math.random() * 55,
      28 + Math.random() * 22,
    ] as Vec3;
    this.hasFlower   = Math.random() > 0.55;
    this.flowerColor = REED_FLOWER_COLORS[Math.floor(Math.random() * REED_FLOWER_COLORS.length)];
    this.stemWidth  = rand(1.0, 1.2) * b.scale;
  }

  draw(c: CanvasRenderingContext2D, t: number) {
    const sway = Math.sin(t * this.swaySpeed + this.swayPhase) * (1.5 * (this.height / 40));
    c.save();
    c.translate(this.x, this.y);
    c.strokeStyle = rgb(this.color);
    c.lineWidth   = this.stemWidth;
    c.beginPath();
    c.moveTo(0, 0);
    let tipX = 0;
    let tipY = 0;
    for (let i = 1; i <= this.segments; i++) {
      const t2 = i / this.segments;
      const sx = sway * t2 * t2;
      const sy = -this.height * t2;
      c.lineTo(sx, sy);
      tipX = sx;
      tipY = sy;
    }
    c.stroke();
    for (let i = 1; i < this.segments; i++) {
      const t2   = i / this.segments;
      const lx   = sway * t2 * t2;
      const ly   = -this.height * t2;
      const side = i % 2 === 0 ? 1 : -1;
      c.save();
      c.translate(lx, ly);
      c.rotate(side * 0.4 + sway * 0.05);
      c.beginPath();
      const leafW = this.height * 0.05;
      c.ellipse(side * leafW, 0, leafW * 1.25, leafW * 0.32, side * 0.3, 0, Math.PI * 2);
      c.fillStyle = rgb(this.color, 0.7);
      c.fill();
      c.restore();
    }
    if (this.hasFlower) {
      c.beginPath();
      c.arc(tipX, tipY - 1, this.height * 0.028, 0, Math.PI * 2);
      c.fillStyle = rgb(this.flowerColor);
      c.fill();
    }
    c.restore();
  }
}

/* ── Fish ──────────────────────────────────────────────────────────── */
class Fish {
  x: number;
  y: number;
  heading: number;
  speed: number;
  maxSpeed     = 1.2;
  baseSpeed: number;
  size: number;
  bodyColor: Vec3;
  accentColor: Vec3;
  wanderAngle: number;
  wanderT: number;
  speedT: number;
  minCruise: number;
  maxCruise: number;
  tailPhase: number;
  finPhase: number;
  fleeVx       = 0;
  fleeVy       = 0;
  fleeFriction = 0.97;
  depth: number;
  solidColor: boolean;
  patches: KoiPatch[];
  satisfiedTimer = 0;
  private foodTarget: FoodPellet | null = null;

  constructor(b: Bounds, tier: 'hero' | 'medium' | 'small') {
    /* Spawn in open central channel */
    this.x       = rand(b.w * 0.28, b.w * 0.72);
    this.y       = rand(b.h * 0.32, b.h * 0.68);
    this.heading = rand(0, Math.PI * 2);
    this.speed   = rand(0.15, 0.35);
    this.baseSpeed = this.speed;

    if (tier === 'hero')        this.size = rand(sc(b, 16), sc(b, 20));
    else if (tier === 'medium') this.size = rand(sc(b, 10), sc(b, 14));
    else this.size = rand(sc(b, 6), sc(b, 8));

    const palette    = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
    this.bodyColor   = palette.body;
    this.accentColor = palette.accent;
    this.solidColor  = colorsEqual(palette.body, palette.accent);
    this.patches     = [];

    if (!this.solidColor) {
      const s = this.size;
      this.patches.push({
        x: rand(s * 0.12, s * 0.32),
        y: rand(-s * 0.1, s * 0.1),
        rx: rand(s * 0.32, s * 0.48),
        ry: rand(s * 0.22, s * 0.34),
        rot: rand(-0.5, 0.5),
        color: palette.accent,
        alpha: rand(0.85, 0.95),
      });
      this.patches.push({
        x: rand(-s * 0.38, -s * 0.08),
        y: rand(-s * 0.12, s * 0.12),
        rx: rand(s * 0.26, s * 0.4),
        ry: rand(s * 0.18, s * 0.28),
        rot: rand(-0.6, 0.6),
        color: palette.accent,
        alpha: rand(0.85, 0.95),
      });
      if (Math.random() < 0.5) {
        this.patches.push({
          x: rand(-s * 0.15, s * 0.2),
          y: rand(-s * 0.14, s * 0.14),
          rx: rand(s * 0.18, s * 0.3),
          ry: rand(s * 0.14, s * 0.22),
          rot: rand(-0.8, 0.8),
          color: palette.spot ?? palette.accent,
          alpha: rand(0.85, 0.95),
        });
      }
      if (palette.spot && !colorsEqual(palette.spot, palette.accent)) {
        const isDarkSpot = palette.spot[0] < 80;
        this.patches.push({
          x: rand(isDarkSpot ? s * 0.05 : -s * 0.1, s * 0.25),
          y: rand(-s * 0.1, s * 0.1),
          rx: isDarkSpot ? rand(s * 0.07, s * 0.12) : rand(s * 0.22, s * 0.38),
          ry: isDarkSpot ? rand(s * 0.05, s * 0.09) : rand(s * 0.16, s * 0.26),
          rot: rand(-0.4, 0.4),
          color: palette.spot,
          alpha: rand(0.88, 0.96),
        });
      }
    }

    this.wanderAngle = this.heading;
    this.wanderT     = rand(0, 1000);
    this.speedT      = rand(0, 1000);
    this.minCruise   = rand(0.08, 0.15);
    this.maxCruise   = rand(0.3, 0.5);
    this.tailPhase   = rand(0, Math.PI * 2);
    this.finPhase    = rand(0, Math.PI * 2);
    /* Small tier tends deeper/dimmer */
    this.depth       = tier === 'small' ? rand(0, 0.45) : tier === 'hero' ? rand(0.65, 1) : rand(0.35, 0.85);
  }

  flee(rippleX: number, rippleY: number, strength: number) {
    const dx    = this.x - rippleX;
    const dy    = this.y - rippleY;
    const d     = Math.max(dist(this.x, this.y, rippleX, rippleY), 1);
    const force = Math.min((strength / d) * 3, 1.5);
    this.fleeVx += (dx / d) * force;
    this.fleeVy += (dy / d) * force;
  }

  update(dt: number, smoothNoise: SmoothNoise, b: Bounds, food: FoodPellet[]) {
    this.foodTarget = null;
    let nearestFood = Infinity;

    let speedMult = 1;
    if (this.satisfiedTimer > 0) {
      this.satisfiedTimer -= dt;
      speedMult = 0.5;
    } else {
      for (const p of food) {
        if (!p.alive) continue;
        const d = dist(this.x, this.y, p.x, p.y);
        if (d < sc(b, 75) && d < nearestFood) {
          nearestFood = d;
          this.foodTarget = p;
        }
      }
    }

    if (this.foodTarget) {
      const angleToFood = Math.atan2(this.foodTarget.y - this.y, this.foodTarget.x - this.x);
      let diff = angleToFood - this.wanderAngle;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.wanderAngle += diff * 0.12;
      speedMult = 1.4;
      if (nearestFood < sc(b, 5)) {
        this.foodTarget.eaten = true;
        this.satisfiedTimer = 1;
        this.foodTarget = null;
        speedMult = 0.5;
      }
    }

    this.wanderT += dt * 0.4;
    const wanderInfluence = smoothNoise(this.wanderT) * 2 - 1;
    this.wanderAngle += wanderInfluence * (this.foodTarget ? 0.015 : 0.04);

    this.speedT += dt * 0.3;
    const speedNoise = smoothNoise(this.speedT + 500);
    this.baseSpeed   = lerp(this.minCruise, this.maxCruise, speedNoise);
    this.baseSpeed  *= (0.7 + this.depth * 0.3) * speedMult;

    const margin = sc(b, 36);
    let avoidX = 0;
    let avoidY = 0;
    if (this.x < margin)       avoidX =  (margin - this.x) / margin;
    if (this.x > b.w - margin) avoidX = -(this.x - (b.w - margin)) / margin;
    if (this.y < margin)       avoidY =  (margin - this.y) / margin;
    if (this.y > b.h - margin) avoidY = -(this.y - (b.h - margin)) / margin;

    if (avoidX !== 0 || avoidY !== 0) {
      const avoidAngle = Math.atan2(avoidY, avoidX);
      let diff = avoidAngle - this.wanderAngle;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.wanderAngle += diff * 0.08;
    }

    this.heading = this.wanderAngle;
    this.fleeVx *= this.fleeFriction;
    this.fleeVy *= this.fleeFriction;
    if (Math.abs(this.fleeVx) < 0.01) this.fleeVx = 0;
    if (Math.abs(this.fleeVy) < 0.01) this.fleeVy = 0;

    const fleeSpeed = Math.sqrt(this.fleeVx ** 2 + this.fleeVy ** 2);
    this.speed      = Math.min(this.baseSpeed + fleeSpeed, this.maxSpeed);

    const vx = Math.cos(this.heading) * this.baseSpeed + this.fleeVx;
    const vy = Math.sin(this.heading) * this.baseSpeed + this.fleeVy;
    this.x += vx;
    this.y += vy;
    const edge = sc(b, 6);
    this.x = clamp(this.x, edge, b.w - edge);
    this.y = clamp(this.y, edge, b.h - edge);

    if (fleeSpeed > 0.2) {
      this.heading     = Math.atan2(vy, vx);
      this.wanderAngle = this.heading;
    }
  }

  private drawWakes(
    c: CanvasRenderingContext2D,
    s: number,
    speedFactor: number,
    tailSwing: number,
  ) {
    const count = Math.max(1, Math.floor(1 + speedFactor * 4));
    const spread = 0.25 + speedFactor * 0.35;
    const alpha  = 0.2 + speedFactor * 0.15;

    for (let i = 0; i < count; i++) {
      const along = -s * (0.55 + i * 0.18);
      const side  = (i % 2 === 0 ? 1 : -1) * s * spread * (0.4 + (i / count) * 0.5);
      const wobble = Math.sin(tailSwing + i) * s * 0.08;
      const px = along;
      const py = side + wobble;

      c.save();
      c.translate(px, py);
      c.rotate(Math.PI / 2 + (i % 2 === 0 ? 0.2 : -0.2));
      c.beginPath();
      c.moveTo(-3, 0);
      c.lineTo(3, 0);
      c.strokeStyle = rgb(WAKE_COLOR, alpha);
      c.lineWidth   = 0.5 + (i / count) * 0.25;
      c.stroke();
      c.restore();
    }
  }

  private drawTailLobe(
    c: CanvasRenderingContext2D,
    s: number,
    bodyC: Vec3,
    tailSwing: number,
    upper: boolean,
  ) {
    const alpha = upper ? 0.48 : 0.44;
    const phase = upper ? tailSwing : tailSwing + 0.1;

    c.save();
    c.translate(-s * 0.5, 0);
    c.rotate(phase);

    c.beginPath();
    c.moveTo(0, 0);
    if (upper) {
      c.bezierCurveTo(-s * 0.15, -s * 0.05, -s * 0.35, -s * 0.2, -s * 0.4, -s * 0.28);
      c.bezierCurveTo(-s * 0.25, -s * 0.15, -s * 0.1, -s * 0.03, 0, 0);
    } else {
      c.bezierCurveTo(-s * 0.15, s * 0.05, -s * 0.35, s * 0.2, -s * 0.4, s * 0.28);
      c.bezierCurveTo(-s * 0.25, s * 0.15, -s * 0.1, s * 0.03, 0, 0);
    }
    c.closePath();
    c.fillStyle = rgb(bodyC, alpha);
    c.fill();
    c.restore();
  }

  private drawPectoralFin(
    c: CanvasRenderingContext2D,
    s: number,
    bodyC: Vec3,
    side: number,
    finSwing: number,
  ) {
    c.save();
    c.translate(s * 0.1, side * s * 0.22);
    c.rotate(side * (Math.PI / 2 + 0.52) + finSwing);

    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(s * 0.1, side * s * 0.03, s * 0.2, side * s * 0.05, s * 0.25, 0);
    c.bezierCurveTo(s * 0.16, side * -s * 0.04, s * 0.06, side * -s * 0.02, 0, 0);
    c.closePath();
    c.fillStyle = rgb(bodyC, side < 0 ? 0.42 : 0.38);
    c.fill();
    c.restore();
  }

  private drawDorsalFin(
    c: CanvasRenderingContext2D,
    s: number,
    bodyC: Vec3,
    dorsalBob: number,
  ) {
    const finC = darkenVec3(bodyC, 0.12);
    c.save();
    c.beginPath();
    c.ellipse(
      s * -0.05,
      -s * 0.26 - dorsalBob,
      s * 0.2,
      s * 0.07,
      -0.15,
      0,
      Math.PI * 2,
    );
    c.fillStyle = rgb(finC, 0.45);
    c.fill();
    c.restore();
  }

  draw(c: CanvasRenderingContext2D, t: number) {
    const speedFactor = this.speed / this.maxSpeed;
    const tailFreq    = 3 + speedFactor * 8;
    const tailAmp     = 0.3 + speedFactor * 0.5;
    const tailSwing   = Math.sin(t * tailFreq + this.tailPhase) * tailAmp;
    const finSwing    = Math.sin(t * tailFreq * 0.7 + this.finPhase) * 0.25;

    const depthScale   = 0.7 + this.depth * 0.3;
    const brightness   = 0.5 + this.depth * 0.5;
    const shadowOffset = 0.6 + this.depth * 3;
    const dim = (col: Vec3): Vec3 => [
      Math.round(col[0] * brightness),
      Math.round(col[1] * brightness),
      Math.round(col[2] * brightness),
    ];
    const bodyC    = dim(this.bodyColor);
    const gillC    = darkenVec3(bodyC, 0.3);
    const s        = this.size * depthScale;
    const dorsalBob  = Math.sin(t * tailFreq * 0.5 + this.finPhase) * s * 0.012 * (0.4 + speedFactor);

    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.heading);

    /* Shadow */
    c.save();
    c.translate(shadowOffset, shadowOffset);
    c.globalAlpha = 0.14 + this.depth * 0.04;
    traceKoiBody(c, s);
    c.fillStyle = '#000';
    c.fill();
    c.restore();

    /* Tail lobes (behind body) */
    this.drawTailLobe(c, s, bodyC, tailSwing, true);
    this.drawTailLobe(c, s, bodyC, tailSwing, false);

    /* Pectoral fins (behind body sides) */
    this.drawPectoralFin(c, s, bodyC, -1, finSwing);
    this.drawPectoralFin(c, s, bodyC, 1, finSwing + 0.08);

    /* Opaque body */
    traceKoiBody(c, s);
    c.fillStyle = rgb(bodyC);
    c.fill();

    /* Pattern patches clipped to body */
    if (!this.solidColor && this.patches.length > 0) {
      c.save();
      traceKoiBody(c, s);
      c.clip();
      for (const patch of this.patches) {
        c.beginPath();
        c.ellipse(patch.x, patch.y, patch.rx, patch.ry, patch.rot, 0, Math.PI * 2);
        c.fillStyle = rgb(dim(patch.color), patch.alpha);
        c.fill();
      }
      c.restore();
    }

    /* Dorsal fin on top of body */
    this.drawDorsalFin(c, s, bodyC, dorsalBob);

    /* Gill plates */
    const gillY = s * 0.12;
    c.strokeStyle = rgb(gillC, 0.32);
    c.lineWidth = 0.65;
    for (const side of [-1, 1] as const) {
      c.beginPath();
      c.moveTo(s * 0.2, side * gillY);
      c.quadraticCurveTo(s * 0.18, side * s * 0.09, s * 0.2, side * s * 0.08);
      c.stroke();
    }

    /* Mouth */
    c.beginPath();
    c.moveTo(s * 0.44, -s * 0.01);
    c.lineTo(s * 0.44, s * 0.01);
    c.strokeStyle = 'rgba(20,20,20,0.4)';
    c.lineWidth = 0.6;
    c.stroke();

    /* Eye */
    const eyeR = clamp(s * 0.05, 0.35, 1.2);
    c.beginPath();
    c.arc(s * 0.3, -s * 0.05, eyeR, 0, Math.PI * 2);
    c.fillStyle = '#111';
    c.fill();
    c.beginPath();
    c.arc(s * 0.3 + eyeR * 0.25, -s * 0.05 - eyeR * 0.2, eyeR * 0.25, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fill();

    this.drawWakes(c, s, speedFactor, tailSwing);
    c.restore();
  }
}

/* ── Scene builders ─────────────────────────────────────────────────── */

function densePadCluster(
  b: Bounds,
  pads: LilyPad[],
  fx: number,
  fy: number,
  count: number,
  spread: number,
  edgeRoot?: { x: number; y: number },
) {
  const cx = fx * b.w;
  const cy = fy * b.h;
  const clusterPads: LilyPad[] = [];

  for (let i = 0; i < count; i++) {
    const isEdge = i < count * 0.35 || Math.random() < 0.15;
    const pad = new LilyPad(b, {
      x: clamp(cx + rand(-spread, spread), sc(b, 8), b.w - sc(b, 8)),
      y: clamp(cy + rand(-spread, spread), sc(b, 8), b.h - sc(b, 8)),
      fillAlpha: isEdge ? rand(0.4, 0.65) : 1,
    });
    pads.push(pad);
    clusterPads.push(pad);
  }

  return { clusterPads, edgeRoot: edgeRoot ?? { x: fx < 0.5 ? sc(b, 4) : b.w - sc(b, 4), y: cy } };
}

/* Individual pads scattered through the centre 60% — breaks up empty water */
function scatterMidZonePads(
  b: Bounds,
  pads: LilyPad[],
  flowers: LilyFlower[],
  count: number,
) {
  const midPads: LilyPad[] = [];
  for (let i = 0; i < count; i++) {
    const pad = new LilyPad(b, {
      x: rand(b.w * 0.2, b.w * 0.8),
      y: rand(b.h * 0.2, b.h * 0.8),
      r: rand(4, 10),
    });
    pads.push(pad);
    midPads.push(pad);
  }
  const flowerCount = randInt(3, 5);
  for (let i = 0; i < flowerCount && midPads.length > 0; i++) {
    flowers.push(new LilyFlower(midPads[Math.floor(Math.random() * midPads.length)], b));
  }
}

function scatterMidReedTufts(b: Bounds, reeds: Reed[]) {
  const tuftCount = randInt(4, 6);
  for (let t = 0; t < tuftCount; t++) {
    const cx = rand(b.w * 0.25, b.w * 0.75);
    const cy = rand(b.h * 0.25, b.h * 0.75);
    const n  = randInt(2, 3);
    for (let i = 0; i < n; i++) {
      reeds.push(new Reed(
        b,
        cx + rand(-sc(b, 16), sc(b, 16)),
        cy + rand(-sc(b, 16), sc(b, 16)),
        rand(8, 16),
      ));
    }
  }
}

function createStems(clusters: { pads: LilyPad[]; root: Pos }[], b: Bounds): PadStem[] {
  const stems: PadStem[] = [];
  for (const cl of clusters) {
    for (const pad of cl.pads) {
      if (Math.random() > 0.68) continue;
      stems.push(new PadStem(cl.root.x, cl.root.y, pad, b));
    }
  }
  return stems;
}

function createScene(b: Bounds) {
  const lilyPads:    LilyPad[]    = [];
  const lilyFlowers: LilyFlower[] = [];
  const reeds:       Reed[]       = [];
  const fish:        Fish[]       = [];
  const sparkles     = createSparkles(b);
  const lightPatches = createLightPatches(b);
  const clusterMeta: { pads: LilyPad[]; root: Pos }[] = [];

  const addCluster = (fx: number, fy: number, count: number, spread: number, root?: Pos) => {
    const before = lilyPads.length;
    const { edgeRoot } = densePadCluster(b, lilyPads, fx, fy, count, spread, root);
    clusterMeta.push({ pads: lilyPads.slice(before), root: root ?? edgeRoot });
  };

  addCluster(0.10, 0.12, randInt(10, 15), sc(b, 22), { x: sc(b, 4), y: b.h * 0.12 });
  addCluster(0.12, 0.88, randInt(8, 12),  sc(b, 20), { x: sc(b, 4), y: b.h * 0.88 });
  addCluster(0.90, 0.10, randInt(8, 12),  sc(b, 20), { x: b.w - sc(b, 4), y: b.h * 0.10 });
  addCluster(0.92, 0.86, randInt(10, 15), sc(b, 22), { x: b.w - sc(b, 4), y: b.h * 0.86 });
  addCluster(0.50, 0.94, randInt(6, 8),   sc(b, 18), { x: b.w * 0.5, y: b.h - sc(b, 4) });

  scatterMidZonePads(b, lilyPads, lilyFlowers, randInt(20, 30));

  const padStems = createStems(clusterMeta, b);

  for (let i = 0; i < NUM_FLOWERS; i++) {
    const pad = lilyPads[Math.floor(Math.random() * lilyPads.length)];
    lilyFlowers.push(new LilyFlower(pad, b));
  }

  function reedCluster(fx: number, fy: number, count: number, spread: number) {
    const cx = fx * b.w;
    const cy = fy * b.h;
    for (let i = 0; i < count; i++) {
      reeds.push(new Reed(
        b,
        clamp(cx + rand(-spread, spread), 0, b.w),
        clamp(cy + rand(-spread, spread), 0, b.h),
        rand(16, 50),
      ));
    }
  }

  reedCluster(0.04, 0.06, randInt(10, 14), sc(b, 16));
  reedCluster(0.96, 0.08, randInt(9, 13),  sc(b, 16));
  reedCluster(0.05, 0.94, randInt(12, 15), sc(b, 18));
  reedCluster(0.97, 0.92, randInt(11, 14), sc(b, 18));
  reedCluster(0.22, 0.04, randInt(8, 12),  sc(b, 14));
  reedCluster(0.78, 0.05, randInt(8, 12),  sc(b, 14));

  scatterMidReedTufts(b, reeds);

  const fishTiers: Array<'hero' | 'medium' | 'small'> = [
    'hero', 'hero', 'medium', 'medium', 'medium', 'small', 'small',
  ];
  for (const tier of fishTiers) fish.push(new Fish(b, tier));
  fish.sort((a, b2) => a.depth - b2.depth);

  return { lilyPads, lilyFlowers, reeds, fish, sparkles, padStems, lightPatches };
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function applyPixelFilter(
  ctx: CanvasRenderingContext2D,
  offCtx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  w: number,
  h: number,
) {
  offCtx.drawImage(source, 0, 0);
  const imageData = offCtx.getImageData(0, 0, w, h);
  const data      = imageData.data;
  const pw        = PIXEL_SIZE;
  const result    = ctx.createImageData(w, h);
  const rd        = result.data;

  for (let py = 0; py < h; py += pw) {
    for (let px = 0; px < w; px += pw) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < pw && py + dy < h; dy++) {
        for (let dx = 0; dx < pw && px + dx < w; dx++) {
          const idx = ((py + dy) * w + (px + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      for (let dy = 0; dy < pw && py + dy < h; dy++) {
        for (let dx = 0; dx < pw && px + dx < w; dx++) {
          const idx = ((py + dy) * w + (px + dx)) * 4;
          rd[idx]     = r;
          rd[idx + 1] = g;
          rd[idx + 2] = b;
          rd[idx + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(result, 0, 0);
}

function makeBounds(width: number, height: number): Bounds {
  return { w: width, h: height, scale: width / BASE_CANVAS_W };
}

function sizeFromContainer(
  containerW: number,
  containerH: number,
  baseHeight: number,
): { width: number; height: number } | null {
  if (containerW < 2 || containerH < 2) return null;
  const height = baseHeight;
  const width  = Math.max(2, Math.round(height * (containerW / containerH)));
  return { width, height };
}

/* ── Component ─────────────────────────────────────────────────────── */

interface KoiPondProps {
  className?: string;
  style?:     React.CSSProperties;
  pixelFilter?: boolean;
  /** When true (default), internal resolution tracks container aspect via ResizeObserver. */
  fillContainer?: boolean;
  /** Pixel height used to derive width from container aspect (default 320). */
  baseHeight?: number;
  /** Fixed resolution; only used when fillContainer is false. */
  resolution?: { width: number; height: number };
}

export default function KoiPond({
  className,
  style,
  pixelFilter = false,
  fillContainer = true,
  baseHeight = BASE_CANVAS_H,
  resolution,
}: KoiPondProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);

  /* Measure container → canvas pixel dimensions (no CSS stretch distortion). */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const { width: cw, height: ch } = el.getBoundingClientRect();
      if (fillContainer) {
        const next = sizeFromContainer(cw, ch, baseHeight);
        if (next) setCanvasSize(next);
      } else if (resolution) {
        setCanvasSize({ width: resolution.width, height: resolution.height });
      } else {
        setCanvasSize(DEFAULT_RESOLUTION);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fillContainer, baseHeight, resolution?.width, resolution?.height]);

  useEffect(() => {
    if (!canvasSize) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bounds = makeBounds(canvasSize.width, canvasSize.height);
    const causticStep = Math.max(4, Math.round(CAUSTIC_STEP * bounds.scale));
    canvas.width  = bounds.w;
    canvas.height = bounds.h;

    const smoothNoise = makeSmoothNoise();
    const { lilyPads, lilyFlowers, reeds, fish, sparkles, padStems, lightPatches } = createScene(bounds);
    const ripples: Ripple[] = [];
    const foodPellets: FoodPellet[] = [];

    let offCtx: CanvasRenderingContext2D | null = null;
    if (pixelFilter) {
      const off = document.createElement('canvas');
      off.width  = bounds.w;
      off.height = bounds.h;
      offCtx = off.getContext('2d');
    }

    let nextRainDrop = rand(0.05, 0.2);

    let lastMouseX: number | null = null;
    let lastMouseY: number | null = null;
    let lastMouseTime      = 0;
    let mouseSwipeCooldown = 0;

    let pointerDown     = false;
    let pointerDownTime = 0;
    let pointerIsHold   = false;
    let lastFoodDrop    = 0;
    let pointerX        = 0;
    let pointerY        = 0;

    function getCanvasCoords(e: MouseEvent | PointerEvent) {
      const r     = canvas!.getBoundingClientRect();
      const scale = bounds.w / r.width;
      return {
        x: (e.clientX - r.left) * scale,
        y: (e.clientY - r.top)  * scale,
      };
    }

    function handlePointerDown(e: PointerEvent) {
      canvas!.setPointerCapture(e.pointerId);
      const { x, y } = getCanvasCoords(e);
      pointerDown     = true;
      pointerIsHold   = false;
      pointerDownTime = performance.now() / 1000;
      lastFoodDrop    = 0;
      pointerX        = x;
      pointerY        = y;
    }

    function handlePointerMove(e: PointerEvent) {
      const { x: mx, y: my } = getCanvasCoords(e);
      const now = performance.now() / 1000;

      if (pointerDown) {
        pointerX = mx;
        pointerY = my;
        if (now - pointerDownTime > 0.2) {
          pointerIsHold = true;
          if (lastFoodDrop === 0 || now - lastFoodDrop >= 0.25) {
            foodPellets.push(new FoodPellet(mx, my, bounds.scale));
            lastFoodDrop = now;
          }
        }
        return;
      }

      if (lastMouseX !== null && lastMouseY !== null) {
        const dx       = mx - lastMouseX;
        const dy       = my - lastMouseY;
        const moveDist = Math.sqrt(dx * dx + dy * dy);
        const dt       = now - lastMouseTime;
        const speed    = dt > 0 ? moveDist / dt : 0;

        if (speed > 200 * bounds.scale && mouseSwipeCooldown <= 0) {
          ripples.push(new Ripple(mx, my, 'swipe', bounds.scale));
          for (const f of fish) {
            if (dist(f.x, f.y, mx, my) < sc(bounds, 80)) f.flee(mx, my, 10);
          }
          mouseSwipeCooldown = 0.06;
        }
      }

      lastMouseX    = mx;
      lastMouseY    = my;
      lastMouseTime = now;
    }

    function handlePointerUp() {
      const now = performance.now() / 1000;
      if (pointerDown && !pointerIsHold && now - pointerDownTime < 0.2) {
        ripples.push(new Ripple(pointerX, pointerY, 'user', bounds.scale));
        for (const f of fish) {
          if (dist(f.x, f.y, pointerX, pointerY) < sc(bounds, 100)) {
            f.flee(pointerX, pointerY, 15);
          }
        }
      }
      pointerDown   = false;
      pointerIsHold = false;
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    let raf      = 0;
    let lastTime = performance.now();
    let time     = 0;

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      time    += dt;

      ctx!.clearRect(0, 0, bounds.w, bounds.h);

      nextRainDrop -= dt;
      if (nextRainDrop <= 0) {
        const rainM = sc(bounds, 10);
        ripples.push(new Ripple(rand(rainM, bounds.w - rainM), rand(rainM, bounds.h - rainM), 'rain', bounds.scale));
        nextRainDrop = rand(0.05, 0.2);
      }
      if (mouseSwipeCooldown > 0) mouseSwipeCooldown -= dt;

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update(dt);
        if (!ripples[i].alive) ripples.splice(i, 1);
      }
      for (let i = foodPellets.length - 1; i >= 0; i--) {
        foodPellets[i].update(dt);
        if (!foodPellets[i].alive) foodPellets.splice(i, 1);
      }

      /* 1 — water + caustics */
      const waterPalettes = getWaterPalettes(time);
      ctx!.fillStyle = rgb(waterPalettes.deep);
      ctx!.fillRect(0, 0, bounds.w, bounds.h);
      for (let y = 0; y < bounds.h; y += causticStep) {
        for (let x = 0; x < bounds.w; x += causticStep) {
          const c = getWaterColor(x, y, time, waterPalettes);
          if (c[0] !== waterPalettes.deep[0]
              || c[1] !== waterPalettes.deep[1]
              || c[2] !== waterPalettes.deep[2]) {
            ctx!.fillStyle = rgb(c, CAUSTIC_ALPHA);
            ctx!.fillRect(x, y, causticStep, causticStep);
          }
        }
      }

      /* 2 — sparkles */
      drawSparkles(ctx!, sparkles, time);

      /* 3 — drifting light */
      drawLightPatches(ctx!, lightPatches, time);

      /* 4 — stems */
      for (const stem of padStems) stem.draw(ctx!, time, ripples);

      /* 5 — rain ripples (under vegetation) */
      for (const rip of ripples) {
        if (rip.type === 'rain') rip.draw(ctx!);
      }

      /* 6 — fish */
      for (const f of fish) {
        f.update(dt, smoothNoise, bounds, foodPellets);
        ctx!.globalAlpha = 0.35 + f.depth * 0.55;
        f.draw(ctx!, time);
        ctx!.globalAlpha = 1;
      }

      /* 7 — food pellets */
      for (const pellet of foodPellets) pellet.draw(ctx!, time);

      /* 8 — pads + flowers */
      for (const pad of lilyPads) pad.draw(ctx!, time, ripples);
      for (const flower of lilyFlowers) flower.draw(ctx!, time, ripples);

      /* 9 — reeds */
      for (const r of reeds) r.draw(ctx!, time);

      /* 10 — user / swipe ripples (on top) */
      for (const rip of ripples) {
        if (rip.type !== 'rain') rip.draw(ctx!);
      }

      if (offCtx) applyPixelFilter(ctx!, offCtx, canvas!, bounds.w, bounds.h);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [canvasSize, pixelFilter]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display:        'block',
          width:          '100%',
          height:         '100%',
          cursor:         'pointer',
          imageRendering: 'pixelated',
          background:     '#080e18',
          touchAction:    'none',
        }}
      />
    </div>
  );
}
