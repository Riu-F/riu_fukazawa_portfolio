export type PhotoStackTransform = { x: number; y: number; deg: number };

export const IMG_W = 236;
export const IMG_H = 316;
export const STICKER_STACK_IMG_W = 140;
export const STICKER_STACK_IMG_H = Math.round((STICKER_STACK_IMG_W * IMG_H) / IMG_W);
export const POLAROID_STACK_IMG_W = 180;
export const POLAROID_STACK_IMG_H = 240;

export const PHOTO_STACK_TRANSITION_MS = 380;

const PAD = 18;

/**
 * Resting stack offsets in **base** coordinates for `IMG_W` × `IMG_H`.
 * Horizontal step ≈ 28% of card width so ~30% of the card underneath stays visible;
 * vertical offsets stay modest so the pile reads as mostly horizontal drift.
 */
const REST: PhotoStackTransform[] = [
  { x: 0, y: 0, deg: -0.6 },
  { x: 66, y: 10, deg: -2.4 },
  { x: 132, y: 18, deg: 1.9 },
  { x: 198, y: 26, deg: -1.7 },
  { x: 264, y: 34, deg: 2.3 },
];

function expandRawForFan(fan: number): PhotoStackTransform[] {
  return [
    { x: 0, y: 0, deg: -1.0 },
    { x: 132 * fan, y: 20 * fan, deg: 2.6 },
    { x: -126 * fan, y: 26 * fan, deg: -2.2 },
    { x: 70 * fan, y: -128 * fan, deg: 2.05 },
    { x: 54 * fan, y: 140 * fan, deg: -2.45 },
    { x: -112 * fan, y: -110 * fan, deg: 2.35 },
    { x: 122 * fan, y: -118 * fan, deg: -2.05 },
    { x: -100 * fan, y: 136 * fan, deg: 2.2 },
    { x: 210 * fan, y: 88 * fan, deg: -1.75 },
    { x: -36 * fan, y: 92 * fan, deg: 1.85 },
  ];
}

export function restTransform(i: number): PhotoStackTransform {
  return REST[i] ?? REST[REST.length - 1];
}

export function layoutForTransforms(
  raw: PhotoStackTransform[],
  imgW: number,
  imgH: number,
  pad: number,
) {
  if (raw.length === 0) {
    return { w: imgW + pad * 2, h: imgH + pad * 2, layers: [] };
  }
  const ax = raw[0].x;
  const ay = raw[0].y;
  const shifted = raw.map((t) => ({
    x: t.x - ax,
    y: t.y - ay,
    deg: t.deg,
  }));
  let maxX = 0;
  let maxY = 0;
  for (const t of shifted) {
    maxX = Math.max(maxX, t.x + imgW);
    maxY = Math.max(maxY, t.y + imgH);
  }
  const w = Math.ceil(maxX + pad * 2);
  const h = Math.ceil(maxY + pad * 2);
  const layers = shifted.map((t) => ({
    x: t.x + pad,
    y: t.y + pad,
    deg: t.deg,
  }));
  return { w, h, layers };
}

export function layoutRestingForSize(visibleCount: number, imgW: number, imgH: number) {
  const raw = Array.from({ length: visibleCount }, (_, i) => {
    const t = restTransform(i);
    return {
      x: (t.x * imgW) / IMG_W,
      y: (t.y * imgH) / IMG_H,
      deg: t.deg,
    };
  });
  return layoutForTransforms(raw, imgW, imgH, PAD);
}

export function layoutExpandedForSize(totalLayers: number, imgW: number, imgH: number) {
  const fan = imgW / 118;
  const exp = expandRawForFan(fan);
  const raw = Array.from(
    { length: totalLayers },
    (_, i) => exp[i] ?? exp[exp.length - 1],
  );
  return layoutForTransforms(raw, imgW, imgH, PAD);
}

export function layoutResting(visibleCount: number) {
  return layoutRestingForSize(visibleCount, IMG_W, IMG_H);
}

export function layoutExpanded(totalLayers: number) {
  return layoutExpandedForSize(totalLayers, IMG_W, IMG_H);
}

export const IMG_W_REST = IMG_W;
export const IMG_H_REST = IMG_H;
