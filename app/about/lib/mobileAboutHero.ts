import type { BoardItem } from "../types";

/**
 * First visible board asset for mobile static layout (desktop may still use full stacks + revealed).
 */
export function firstVisibleImage(item: BoardItem): { src: string; alt: string } | null {
  if (item.type === "photoStackObject") {
    const v = item.stackVisibleImages ?? item.stackImages ?? [];
    const first = v[0];
    return first ? { src: first.src, alt: first.alt ?? "" } : null;
  }
  if (item.type === "stickerObject" || item.type === "polaroidObject") {
    if (!item.imageSrc) return null;
    return { src: item.imageSrc, alt: item.alt ?? "" };
  }
  return null;
}
