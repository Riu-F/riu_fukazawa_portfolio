/**
 * Deterministic "mood board" offsets from item id — stable across renders and reloads.
 */

export type MobileBoardPlacement = {
  /** Horizontal shift as % of **half-column** (2-col mood board; keep small to avoid clipping). */
  translateXPct: number;
  /** Whole-card tilt in degrees (small). */
  rotateDeg: number;
  /** Extra top spacing (rem). */
  marginTopRem: number;
  /** Extra bottom spacing (rem). */
  marginBottomRem: number;
  /** Slight negative margin-top for overlap with previous card (rem, ≤ 0). */
  overlapPullRem: number;
};

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getMobileBoardPlacement(id: string): MobileBoardPlacement {
  const h = hashId(id);
  const band = h % 3;
  /* ~½ previous wander so two columns stay readable. */
  const translateXPct =
    band === 0 ? -3 - (h % 5) * 0.32 : band === 1 ? ((h >> 3) % 5) * 0.55 - 1.1 : 3 + (h % 5) * 0.3;
  const rotateDeg = (((h >> 5) % 11) - 5) * 0.35;
  /* ~½ prior vertical gaps (2-up grid + mood-board overlap). */
  const marginTopRem = (0.08 + ((h >> 7) % 5) * 0.05) * 0.5;
  const marginBottomRem = (0.15 + ((h >> 9) % 6) * 0.06) * 0.5;
  const overlapPullRem = -((h >> 11) % 4) * 0.4;
  return {
    translateXPct: Math.round(translateXPct * 10) / 10,
    rotateDeg: Math.round(rotateDeg * 100) / 100,
    marginTopRem: Math.round(marginTopRem * 100) / 100,
    marginBottomRem: Math.round(marginBottomRem * 100) / 100,
    overlapPullRem: Math.round(overlapPullRem * 100) / 100,
  };
}

/** Per-layer rotation in a stack preview (deterministic). */
export function mobileStackLayerDeg(id: string, layerIndex: number): number {
  const h = hashId(`${id}#${layerIndex}`);
  return (((h % 9) - 4) * 0.45) / 1;
}
