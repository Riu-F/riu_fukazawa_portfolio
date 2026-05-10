"use client";

import type { BoardItem } from "../types";
import { isBoardItemInteractive } from "../types";
import { AboutIntroBody, AboutIntroChip, AboutIntroHeading } from "../content/aboutIntroContent";
import PhotoStackBoardItem from "./PhotoStackBoardItem";

function HoverAside({ text }: { text: string | undefined }) {
  if (!text) return null;
  return (
    <div className="about-hover-aside" aria-hidden="true">
      {text}
    </div>
  );
}

export default function BoardItemRenderer(params: {
  item: BoardItem;
  focused: boolean;
  onFocus: (id: string) => void;
  registerItemEl: (id: string, el: HTMLDivElement | null) => void;
}) {
  const { item, focused, onFocus, registerItemEl } = params;

  if (item.type === "instructionCard") {
    return (
      <div
        className="about-item about-item--noninteractive"
        style={{ left: item.x, top: item.y }}
      >
        <div className="about-card">
          <div className="about-chip">
            <AboutIntroChip />
          </div>
          <h1 style={{ marginTop: 10 }}>
            <AboutIntroHeading />
          </h1>
          <p>
            <AboutIntroBody />
          </p>
        </div>
      </div>
    );
  }

  if (item.type === "placeholderObject") {
    const interactive = isBoardItemInteractive(item);
    const fallback = item.boardFallback ?? "emoji";
    const showTitleFallback = fallback === "title";
    return (
      <div
        ref={(el) => {
          if (interactive) registerItemEl(item.id, el);
        }}
        className={
          interactive
            ? "about-item about-item--interactive"
            : "about-item about-item--noninteractive"
        }
        data-board-item={interactive ? "true" : undefined}
        data-focused={focused ? "true" : "false"}
        data-board-fallback={showTitleFallback ? "title" : "emoji"}
        style={{ left: item.x, top: item.y }}
      >
        <button
          type="button"
          className={showTitleFallback ? "about-board-fallback-btn" : "about-object-btn"}
          aria-pressed={focused}
          disabled={!interactive}
          onClick={() => interactive && onFocus(item.id)}
        >
          {showTitleFallback ? (
            <span className="about-board-fallback-btn__label">{item.title ?? item.id}</span>
          ) : (
            (item.placeholderEmoji ?? "◆")
          )}
        </button>
        {interactive ? <HoverAside text={item.hoverAside} /> : null}
      </div>
    );
  }

  if (item.type === "photoStackObject") {
    return (
      <PhotoStackBoardItem
        item={item}
        focused={focused}
        onFocus={onFocus}
        registerItemEl={registerItemEl}
      />
    );
  }

  if (item.type === "stickerObject" || item.type === "polaroidObject") {
    const mod = item.type === "stickerObject" ? "sticker" : "polaroid";
    const imgClass =
      mod === "sticker"
        ? "about-asset-img about-asset-img--sticker"
        : "about-asset-img about-asset-img--polaroid";
    return (
      <div
        ref={(el) => registerItemEl(item.id, el)}
        className="about-item about-item--interactive"
        data-board-item="true"
        data-focused={focused ? "true" : "false"}
        style={{ left: item.x, top: item.y }}
      >
        <button
          type="button"
          className={`about-asset-hit about-asset-hit--${mod}`}
          onClick={() => onFocus(item.id)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={imgClass}
            src={item.imageSrc}
            alt={item.alt ?? ""}
            draggable={false}
          />
        </button>
        <HoverAside text={item.hoverAside} />
      </div>
    );
  }

  return null;
}
