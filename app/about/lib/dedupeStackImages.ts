import type { BoardStackImage } from "../types";

/** Preserve order; drop repeated `src` (and empty src). */
export function dedupeStackImagesPreserveOrder(
  images: readonly BoardStackImage[] | null | undefined,
): BoardStackImage[] {
  if (!images?.length) return [];
  const seen = new Set<string>();
  const out: BoardStackImage[] = [];
  for (const im of images) {
    const src = im.src?.trim() ?? "";
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push({ src, alt: im.alt });
  }
  return out;
}

/**
 * Visible images once, then revealed images whose `src` is not already in visible.
 * Each list is de-duped internally; cross-list duplicates are dropped from revealed.
 */
export function mergeVisibleAndRevealedStacks(
  visible: readonly BoardStackImage[] | null | undefined,
  revealed: readonly BoardStackImage[] | null | undefined,
): { visible: BoardStackImage[]; revealed: BoardStackImage[] } {
  const v = dedupeStackImagesPreserveOrder(visible);
  const seen = new Set(v.map((x) => x.src));
  const rRaw = dedupeStackImagesPreserveOrder(revealed);
  const r = rRaw.filter((im) => !seen.has(im.src));
  return { visible: v, revealed: r };
}
