import type { BoardItem, BoardStackImage } from "../types";
import { dedupeStackImagesPreserveOrder } from "./dedupeStackImages";

const MAX_PREVIEW_LAYERS = 4;

/**
 * Visible-only images for mobile mood-board previews (no `revealed/`).
 */
export function visibleImagesForMobilePreview(item: BoardItem): BoardStackImage[] {
  if (item.type === "photoStackObject") {
    const raw = item.stackVisibleImages ?? item.stackImages ?? [];
    return dedupeStackImagesPreserveOrder(raw).slice(0, MAX_PREVIEW_LAYERS);
  }
  if (item.type === "stickerObject" || item.type === "polaroidObject") {
    if (!item.imageSrc) return [];
    return [{ src: item.imageSrc, alt: item.alt ?? "" }];
  }
  return [];
}
