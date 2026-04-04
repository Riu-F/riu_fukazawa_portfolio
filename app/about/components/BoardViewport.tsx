"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BoardItem } from "../types";
import { isBoardItemInteractive } from "../types";
import BoardItemRenderer from "./BoardItemRenderer";
import FocusAnnotation from "./FocusAnnotation";
import {
  BOARD_DEFAULT_ZOOM,
  BOARD_MAX_ZOOM,
  BOARD_MIN_ZOOM,
  BOARD_ZOOM_STEP,
  useBoardPan,
} from "../hooks/useBoardPan";

export default function BoardViewport(params: {
  boardWidth: number;
  boardHeight: number;
  initialFocus: { x: number; y: number };
  items: BoardItem[];
  isDesktop: boolean;
}) {
  const { boardWidth, boardHeight, initialFocus, items, isDesktop } = params;

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusedIdRef = useRef<string | null>(null);
  focusedIdRef.current = focusedId;

  const beforeWheelRef = useRef<((e: WheelEvent) => void) | undefined>(undefined);

  const pan = useBoardPan({
    boardSize: { width: boardWidth, height: boardHeight },
    initialFocus,
    isDesktop,
    beforeWheelRef,
  });

  const itemElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const annotationRef = useRef<HTMLDivElement | null>(null);

  const registerItemEl = useCallback((id: string, el: HTMLDivElement | null) => {
    const m = itemElsRef.current;
    if (!el) m.delete(id);
    else m.set(id, el);
  }, []);

  const clearFocus = useCallback(() => setFocusedId(null), []);

  const focusedItem = useMemo(
    () => (focusedId ? items.find((i) => i.id === focusedId) ?? null : null),
    [focusedId, items],
  );

  const onFocus = useCallback((id: string) => {
    const it = items.find((i) => i.id === id);
    if (!it || !isBoardItemInteractive(it)) return;
    setFocusedId(id);
  }, [items]);

  const [annotationStyle, setAnnotationStyle] = useState<React.CSSProperties>({
    visibility: "hidden",
  });

  const updateAnnotationPosition = useCallback(() => {
    if (!focusedItem || !focusedId) return;
    const vp = pan.viewportRef.current;
    const el = itemElsRef.current.get(focusedId);
    if (!vp || !el) return;
    const vr = vp.getBoundingClientRect();
    const ir = el.getBoundingClientRect();
    const pad = 14;
    let left = ir.right - vr.left + pad;
    const tentativeMax = vr.width - left - 12;
    if (tentativeMax < 200) {
      const w = Math.min(380, ir.left - vr.left - 24);
      left = Math.max(12, ir.left - vr.left - w - pad);
    }
    setAnnotationStyle({
      position: "absolute",
      left: Math.round(left),
      top: Math.round(ir.top - vr.top),
      maxWidth: Math.min(380, vr.width - left - 12),
      visibility: "visible",
    });
  }, [focusedId, focusedItem, pan.viewportRef]);

  useLayoutEffect(() => {
    updateAnnotationPosition();
  }, [
    updateAnnotationPosition,
    pan.camera.x,
    pan.camera.y,
    pan.zoom,
    pan.viewportSize.width,
    pan.viewportSize.height,
    focusedId,
  ]);

  useEffect(() => {
    const vp = pan.viewportRef.current;
    if (!vp) return;
    const ro = new ResizeObserver(() => updateAnnotationPosition());
    ro.observe(vp);
    return () => ro.disconnect();
  }, [pan.viewportRef, updateAnnotationPosition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearFocus]);

  const onPointerDownCapture = useCallback(
    (e: React.PointerEvent) => {
      if (!focusedId) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-about-focus-annotation="true"]')) return;
      if (target.closest('[data-board-zoom-control="true"]')) return;
      if (target.closest('[data-focused="true"]')) return;
      clearFocus();
    },
    [clearFocus, focusedId],
  );

  beforeWheelRef.current = (e: WheelEvent) => {
    if (!focusedIdRef.current) return;
    const t = e.target as Node | null;
    if (
      t &&
      !annotationRef.current?.contains(t) &&
      !(t instanceof Element && t.closest?.('[data-focused="true"]'))
    ) {
      clearFocus();
    }
  };

  const zoomIn = useCallback(() => {
    pan.setZoom(Math.min(BOARD_MAX_ZOOM, pan.zoom * BOARD_ZOOM_STEP));
  }, [pan]);

  const zoomOut = useCallback(() => {
    pan.setZoom(Math.max(BOARD_MIN_ZOOM, pan.zoom / BOARD_ZOOM_STEP));
  }, [pan]);

  const zoomReset = useCallback(() => {
    pan.setZoom(BOARD_DEFAULT_ZOOM);
  }, [pan]);

  const zoomPercent = Math.round(pan.zoom * 100);
  const zoomAtMax = pan.zoom >= BOARD_MAX_ZOOM - 0.001;
  const zoomAtMin = pan.zoom <= BOARD_MIN_ZOOM + 0.001;

  return (
    <div
      ref={pan.viewportRef}
      className="about-viewport"
      data-dragging={pan.dragging ? "true" : "false"}
      {...pan.bind}
      onPointerDownCapture={onPointerDownCapture}
      aria-label="About board viewport"
      role="application"
    >
      <div className="about-viewport__zoom" data-board-zoom-control="true">
        <button type="button" onClick={zoomOut} aria-label="Zoom out" disabled={zoomAtMin}>
          −
        </button>
        <button type="button" onClick={zoomReset} aria-label="Reset zoom">
          {zoomPercent}%
        </button>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          disabled={zoomAtMax}
          title={zoomAtMax ? "Already at maximum zoom (100%)" : undefined}
        >
          +
        </button>
      </div>

      <div
        className="about-board"
        data-has-focus={focusedId ? "true" : "false"}
        style={{
          width: boardWidth,
          height: boardHeight,
          transform: pan.boardTransform,
          transformOrigin: "0 0",
        }}
      >
        <div className="about-board-grid" />
        {items.map((item) => (
          <BoardItemRenderer
            key={item.id}
            item={item}
            focused={focusedId === item.id}
            onFocus={onFocus}
            registerItemEl={registerItemEl}
          />
        ))}
      </div>

      {focusedItem && focusedId ? (
        <FocusAnnotation
          rootRef={annotationRef}
          item={focusedItem}
          onClose={clearFocus}
          style={annotationStyle}
        />
      ) : null}
    </div>
  );
}
