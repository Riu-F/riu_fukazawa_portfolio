"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BoardItem } from "../types";
import { isBoardItemInteractive } from "../types";
import BoardItemRenderer from "./BoardItemRenderer";
import FocusAnnotation from "./FocusAnnotation";
import {
  ABOUT_LAYOUT_EDIT_DEV,
  useAboutBoardLayoutEdit,
} from "../hooks/useAboutBoardEditMode";
import {
  BOARD_DEFAULT_ZOOM,
  BOARD_MAX_ZOOM,
  BOARD_MIN_ZOOM,
  BOARD_ZOOM_STEP,
  useBoardPan,
} from "../hooks/useBoardPan";

type LayoutDragSession = {
  pointerId: number;
  id: string;
  startClientX: number;
  startClientY: number;
  startBoardX: number;
  startBoardY: number;
  startZoom: number;
};

export default function BoardViewport(params: {
  boardWidth: number;
  boardHeight: number;
  initialFocus: { x: number; y: number };
  items: BoardItem[];
  isDesktop: boolean;
}) {
  const { boardWidth, boardHeight, initialFocus, items, isDesktop } = params;

  const { editModeActive, toggleUiWithE, hasEditQuery } = useAboutBoardLayoutEdit();

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusedIdRef = useRef<string | null>(null);
  focusedIdRef.current = focusedId;

  const [positionOverrides, setPositionOverrides] = useState<Record<string, { x: number; y: number }>>(
    {},
  );
  const [layoutDragVisual, setLayoutDragVisual] = useState(false);
  const layoutDragRef = useRef<LayoutDragSession | null>(null);

  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

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

  useEffect(() => {
    if (editModeActive) setFocusedId(null);
  }, [editModeActive]);

  const displayItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        x: positionOverrides[it.id]?.x ?? it.x,
        y: positionOverrides[it.id]?.y ?? it.y,
      })),
    [items, positionOverrides],
  );

  const focusedItem = useMemo(
    () => (focusedId ? displayItems.find((i) => i.id === focusedId) ?? null : null),
    [focusedId, displayItems],
  );

  const onFocus = useCallback(
    (id: string) => {
      if (editModeActive) return;
      const it = displayItems.find((i) => i.id === id);
      if (!it || !isBoardItemInteractive(it)) return;
      setFocusedId(id);
    },
    [displayItems, editModeActive],
  );

  const exportPositions = useCallback(async () => {
    const out: Record<string, { x: number; y: number }> = {};
    for (const it of items) {
      out[it.id] = {
        x: positionOverrides[it.id]?.x ?? it.x,
        y: positionOverrides[it.id]?.y ?? it.y,
      };
    }
    const json = JSON.stringify(out, null, 2);
    // eslint-disable-next-line no-console
    console.log("[about layout edit] positions JSON:\n", json);
    let copied = false;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(json);
        copied = true;
      } catch {
        copied = false;
      }
    }
    setExportFeedback(copied ? "Positions copied" : "Positions logged to console");
    window.setTimeout(() => setExportFeedback(null), 2200);
  }, [items, positionOverrides]);

  useEffect(() => {
    if (!ABOUT_LAYOUT_EDIT_DEV || !hasEditQuery) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "e" && e.key !== "E") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, select, [contenteditable=true]")) return;
      e.preventDefault();
      toggleUiWithE();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasEditQuery, toggleUiWithE]);

  useEffect(() => {
    if (!editModeActive || !ABOUT_LAYOUT_EDIT_DEV) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey || (!e.metaKey && !e.ctrlKey)) return;
      if (e.key !== "c" && e.key !== "C") return;
      e.preventDefault();
      void exportPositions();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editModeActive, exportPositions]);

  const handleLayoutEditPointerDownCapture = useCallback(
    (e: React.PointerEvent, item: BoardItem) => {
      if (!editModeActive) return;
      if (e.button !== 0) return;
      if (layoutDragRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const el = e.currentTarget as HTMLElement;
      if (typeof el.setPointerCapture === "function") {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      const drag: LayoutDragSession = {
        pointerId: e.pointerId,
        id: item.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startBoardX: item.x,
        startBoardY: item.y,
        startZoom: pan.zoom,
      };
      layoutDragRef.current = drag;
      setLayoutDragVisual(true);

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== drag.pointerId) return;
        const dx = ev.clientX - drag.startClientX;
        const dy = ev.clientY - drag.startClientY;
        const z = drag.startZoom;
        setPositionOverrides((prev) => ({
          ...prev,
          [drag.id]: {
            x: Math.round(drag.startBoardX + dx / z),
            y: Math.round(drag.startBoardY + dy / z),
          },
        }));
      };

      const done = (ev: PointerEvent) => {
        if (ev.pointerId !== drag.pointerId) return;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", done);
        window.removeEventListener("pointercancel", done);
        layoutDragRef.current = null;
        setLayoutDragVisual(false);
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch {
          /* ignore */
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", done);
      window.addEventListener("pointercancel", done);
    },
    [editModeActive, pan.zoom],
  );

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
    positionOverrides,
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
      if (editModeActive) return;
      if (!focusedId) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-about-focus-annotation="true"]')) return;
      if (target.closest('[data-board-zoom-control="true"]')) return;
      if (target.closest('[data-focused="true"]')) return;
      clearFocus();
    },
    [clearFocus, editModeActive, focusedId],
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
      data-about-layout-edit-active={editModeActive ? "true" : undefined}
      data-about-layout-dragging={layoutDragVisual ? "true" : undefined}
      {...pan.bind}
      onPointerDownCapture={onPointerDownCapture}
      aria-label="About board viewport"
      role="application"
    >
      {ABOUT_LAYOUT_EDIT_DEV && hasEditQuery && !editModeActive ? (
        <div className="about-layout-edit-banner about-layout-edit-banner--paused" role="status">
          Layout edit paused (press E to resume)
        </div>
      ) : null}
      {editModeActive ? (
        <div className="about-layout-edit-banner" role="status">
          Layout edit mode — drag items · ⌘⇧C / Ctrl⇧C export · E pause
        </div>
      ) : null}
      {exportFeedback ? (
        <div className="about-layout-edit-toast" role="status">
          {exportFeedback}
        </div>
      ) : null}

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
        {displayItems.map((item) => (
          <BoardItemRenderer
            key={item.id}
            item={item}
            focused={focusedId === item.id}
            onFocus={onFocus}
            registerItemEl={registerItemEl}
            layoutEditMode={editModeActive}
            onLayoutEditPointerDownCapture={handleLayoutEditPointerDownCapture}
          />
        ))}
      </div>

      {focusedItem && focusedId && !editModeActive ? (
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
