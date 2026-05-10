"use client";

import type { BoardItem } from "../types";
import { mergeVisibleAndRevealedStacks } from "../lib/dedupeStackImages";
import {
  IMG_H,
  IMG_W,
  layoutExpandedForSize,
  layoutRestingForSize,
  PHOTO_STACK_TRANSITION_MS,
  POLAROID_STACK_IMG_H,
  POLAROID_STACK_IMG_W,
  STICKER_STACK_IMG_H,
  STICKER_STACK_IMG_W,
} from "./photoStackLayout";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

function resolveStackImages(item: BoardItem): {
  visible: { src: string; alt?: string }[];
  revealed: { src: string; alt?: string }[];
  layers: { src: string; alt?: string }[];
} {
  const hasSplit = item.stackVisibleImages != null;
  const visibleRaw = hasSplit
    ? (item.stackVisibleImages ?? [])
    : (item.stackImages ?? []);
  const revealedRaw = hasSplit ? (item.revealedImages ?? []) : [];
  const { visible, revealed } = mergeVisibleAndRevealedStacks(visibleRaw, revealedRaw);
  const layers = [...visible, ...revealed];
  return { visible, revealed, layers };
}

function stackDims(item: BoardItem): { w: number; h: number } {
  const p = item.stackPresentation;
  if (p === "sticker") return { w: STICKER_STACK_IMG_W, h: STICKER_STACK_IMG_H };
  if (p === "polaroid") return { w: POLAROID_STACK_IMG_W, h: POLAROID_STACK_IMG_H };
  return { w: IMG_W, h: IMG_H };
}

export default function PhotoStackBoardItem(params: {
  item: BoardItem;
  focused: boolean;
  onFocus: (id: string) => void;
  registerItemEl: (id: string, el: HTMLDivElement | null) => void;
}) {
  const { item, focused, onFocus, registerItemEl } = params;
  const { visible, layers } = resolveStackImages(item);
  if (layers.length === 0) return null;

  const visibleCount = visible.length;
  const total = layers.length;

  const { w: imgW, h: imgH } = stackDims(item);

  const restLayout = layoutRestingForSize(visibleCount, imgW, imgH);
  const expandLayout = layoutExpandedForSize(total, imgW, imgH);

  const rootW = focused ? expandLayout.w : restLayout.w;
  const rootH = focused ? expandLayout.h : restLayout.h;

  return (
    <div
      ref={(el) => registerItemEl(item.id, el)}
      className="about-item about-item--interactive about-photo-stack"
      data-board-item="true"
      data-focused={focused ? "true" : "false"}
      style={{
        left: item.x,
        top: item.y,
        width: rootW,
        height: rootH,
        ["--photo-stack-img-w" as string]: `${imgW}px`,
      }}
      onClick={() => onFocus(item.id)}
    >
      {item.hoverAside ? (
        <div className="about-hover-aside" aria-hidden="true">
          {item.hoverAside}
        </div>
      ) : null}
      <div
        className="about-photo-stack__root"
        style={{
          width: rootW,
          height: rootH,
          transition: `width ${PHOTO_STACK_TRANSITION_MS}ms ${EASE_OUT}, height ${PHOTO_STACK_TRANSITION_MS}ms ${EASE_OUT}`,
        }}
      >
        <div className="about-photo-stack__inner">
          {[...layers].reverse().map((im, rev) => {
            const i = layers.length - 1 - rev;
            const isRevealedOnly = i >= visibleCount;

            let t: { x: number; y: number; deg: number };
            if (focused) {
              t = expandLayout.layers[i] ?? expandLayout.layers[expandLayout.layers.length - 1];
            } else if (isRevealedOnly) {
              const bottom = visibleCount > 0 ? visibleCount - 1 : 0;
              t =
                restLayout.layers[bottom] ??
                restLayout.layers[restLayout.layers.length - 1];
            } else {
              t = restLayout.layers[i] ?? restLayout.layers[restLayout.layers.length - 1];
            }

            const z = focused ? total - i : isRevealedOnly ? 0 : visibleCount - i;
            const opacity = focused || !isRevealedOnly ? 1 : 0;

            return (
              <div
                key={`${item.id}__${i}__${im.src}`}
                className="about-photo-stack__layer"
                data-layer={i}
                aria-hidden={isRevealedOnly && !focused ? true : undefined}
                style={{
                  zIndex: z,
                  opacity,
                  transform: `translate(${t.x}px, ${t.y}px) rotate(${t.deg}deg)`,
                  transition: `transform ${PHOTO_STACK_TRANSITION_MS}ms ${EASE_OUT}, opacity ${PHOTO_STACK_TRANSITION_MS * 0.85}ms ${EASE_OUT}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={im.src}
                  alt={im.alt ?? ""}
                  className="about-photo-stack__img"
                  width={imgW}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
