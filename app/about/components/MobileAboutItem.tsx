"use client";

import type { BoardItem } from "../types";
import { getMobileBoardPlacement } from "../lib/mobileBoardPlacement";
import { visibleImagesForMobilePreview } from "../lib/mobileVisibleImages";
import MobileAboutStackPreview from "./MobileAboutStackPreview";

/**
 * Mood-board tile: visuals only; tap opens parent overlay (no inline copy).
 */
export default function MobileAboutItem(params: {
  item: BoardItem;
  onOpen: (id: string) => void;
  overlayOpen: boolean;
  isSourceOfOpenOverlay: boolean;
}) {
  const { item, onOpen, overlayOpen, isSourceOfOpenOverlay } = params;
  const title = item.title ?? item.id;
  const placement = getMobileBoardPlacement(item.id);

  const hit = (
    <button
      type="button"
      className="mobile-about-item__hit"
      aria-haspopup="dialog"
      aria-expanded={isSourceOfOpenOverlay}
      aria-label={`Open notes: ${title}`}
      onClick={() => onOpen(item.id)}
    >
      <div
        className="mobile-about-item__visual"
        style={{
          transform: `translateX(${placement.translateXPct}%) rotate(${placement.rotateDeg}deg)`,
        }}
      >
        {item.type === "placeholderObject" ? (
          <PlaceholderVisual item={item} title={title} />
        ) : item.type === "photoStackObject" ||
          item.type === "stickerObject" ||
          item.type === "polaroidObject" ? (
          <AssetVisual item={item} title={title} />
        ) : null}
      </div>
    </button>
  );

  return (
    <div
      className={`mobile-about-item${overlayOpen && isSourceOfOpenOverlay ? " mobile-about-item--overlay-source" : ""}${overlayOpen && !isSourceOfOpenOverlay ? " mobile-about-item--dimmed" : ""}`}
      style={{
        marginTop: `${placement.marginTopRem + placement.overlapPullRem}rem`,
        marginBottom: `${placement.marginBottomRem}rem`,
      }}
    >
      {hit}
    </div>
  );
}

function PlaceholderVisual({ item, title }: { item: BoardItem; title: string }) {
  const fb = item.boardFallback ?? "emoji";
  const showTitleMedia = fb === "title";
  return (
    <div
      className={
        showTitleMedia
          ? "mobile-about-item__media mobile-about-item__media--fallback-title"
          : "mobile-about-item__media mobile-about-item__media--emoji"
      }
      aria-hidden
    >
      {showTitleMedia ? (
        <span className="mobile-about-item__fallback-title">{title}</span>
      ) : (
        <span className="mobile-about-item__emoji-only">{item.placeholderEmoji ?? "◆"}</span>
      )}
    </div>
  );
}

function AssetVisual({ item, title }: { item: BoardItem; title: string }) {
  if (item.type === "photoStackObject") {
    const imgs = visibleImagesForMobilePreview(item);
    if (imgs.length === 0) {
      return (
        <div className="mobile-about-item__media mobile-about-item__media--fallback-title" aria-hidden>
          <span className="mobile-about-item__fallback-title">{title}</span>
        </div>
      );
    }
    const p = item.stackPresentation ?? "stack";
    return <MobileAboutStackPreview id={item.id} images={imgs} presentation={p} />;
  }
  if (item.type === "stickerObject" || item.type === "polaroidObject") {
    const imgs = visibleImagesForMobilePreview(item);
    if (imgs.length === 0) {
      return (
        <div className="mobile-about-item__media mobile-about-item__media--fallback-title" aria-hidden>
          <span className="mobile-about-item__fallback-title">{title}</span>
        </div>
      );
    }
    const p = item.type === "stickerObject" ? "sticker" : "polaroid";
    return <MobileAboutStackPreview id={item.id} images={imgs} presentation={p} />;
  }
  return null;
}
