import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Size = { width: number; height: number };
type Point = { x: number; y: number };

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export const BOARD_PAN_DRAG_THRESHOLD_PX = 20;
export const BOARD_DEFAULT_ZOOM = 1;
/** Maximum zoom-in: 1:1 board scale (no zoom beyond initial view). */
export const BOARD_MAX_ZOOM = 1;
export const BOARD_MIN_ZOOM = 0.35;
/**
 * Toolbar ± zoom: one step multiplier (~3.6% change per click).
 * Tuned ~70% gentler than the previous 1.12 (~12%) step.
 */
export const BOARD_ZOOM_STEP = 1.036;
/**
 * ⌘/Ctrl + wheel / pinch: zoom scales by exp(-deltaY * k) per event.
 * k chosen ~70% lower than a typical “snappy” canvas (~0.0012 → ~0.00036).
 */
export const BOARD_ZOOM_WHEEL_SENSITIVITY = 0.00700;

export function clampBoardZoom(z: number) {
  return clamp(z, BOARD_MIN_ZOOM, BOARD_MAX_ZOOM);
}

export function getBoardCameraClamped(
  camera: Point,
  board: Size,
  viewport: Size,
  zoom: number,
): Point {
  if (viewport.width <= 0 || viewport.height <= 0) return { x: 0, y: 0 };
  const z = clampBoardZoom(zoom);
  const viewW = viewport.width / z;
  const viewH = viewport.height / z;
  const maxX = Math.max(0, board.width - viewW);
  const maxY = Math.max(0, board.height - viewH);
  return {
    x: clamp(camera.x, 0, maxX),
    y: clamp(camera.y, 0, maxY),
  };
}

/**
 * Keep the board point under (anchorPx, anchorPy) in viewport space fixed after zoom changes z0 → z1.
 */
function cameraForZoomAroundViewportPoint(
  camera: Point,
  z0: number,
  z1: number,
  anchorPx: number,
  anchorPy: number,
  board: Size,
  viewport: Size,
): Point {
  const boardX = camera.x + anchorPx / z0;
  const boardY = camera.y + anchorPy / z0;
  const raw = {
    x: boardX - anchorPx / z1,
    y: boardY - anchorPy / z1,
  };
  return getBoardCameraClamped(raw, board, viewport, z1);
}

export function useBoardCamera(params: {
  boardSize: Size;
  initialFocus: Point;
  isDesktop: boolean;
  /** Optional hook (e.g. focus dismiss); runs before board pan/zoom on each wheel tick. */
  beforeWheelRef?: React.MutableRefObject<((e: WheelEvent) => void) | undefined>;
}) {
  const { boardSize, initialFocus, isDesktop, beforeWheelRef } = params;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState<Size>({ width: 0, height: 0 });
  const [camera, setCamera] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoomState] = useState(BOARD_DEFAULT_ZOOM);
  const [dragging, setDragging] = useState(false);

  const boardSizeRef = useRef(boardSize);
  boardSizeRef.current = boardSize;
  const viewportSizeRef = useRef(viewportSize);
  viewportSizeRef.current = viewportSize;
  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  /** Last pointer position in viewport-local pixels (for toolbar zoom anchor). */
  const lastAnchorRef = useRef<Point>({ x: 0, y: 0 });

  const didInitRef = useRef(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      lastAnchorRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      };
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setViewportSize({ width: cr.width, height: cr.height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyView = useCallback(
    (cam: Point, z: number) => {
      const nz = clampBoardZoom(z);
      const nc = getBoardCameraClamped(cam, boardSize, viewportSize, nz);
      setZoomState(nz);
      setCamera(nc);
    },
    [boardSize, viewportSize.height, viewportSize.width],
  );

  /** Zoom toward a viewport-local point (px, py) relative to viewport element top-left. */
  const applyZoomAtViewportPoint = useCallback(
    (newZoom: number, anchorPx: number, anchorPy: number) => {
      const nz = clampBoardZoom(newZoom);
      const c = cameraRef.current;
      const z0 = zoomRef.current;
      const nc = cameraForZoomAroundViewportPoint(
        c,
        z0,
        nz,
        anchorPx,
        anchorPy,
        boardSize,
        viewportSize,
      );
      setZoomState(nz);
      setCamera(nc);
    },
    [boardSize, viewportSize.height, viewportSize.width],
  );

  const setZoom = useCallback(
    (z: number) => {
      const el = viewportRef.current;
      let ax = lastAnchorRef.current.x;
      let ay = lastAnchorRef.current.y;
      if (el && viewportSize.width > 0 && viewportSize.height > 0) {
        ax = clamp(ax, 0, viewportSize.width);
        ay = clamp(ay, 0, viewportSize.height);
      } else {
        ax = viewportSize.width / 2;
        ay = viewportSize.height / 2;
      }
      applyZoomAtViewportPoint(z, ax, ay);
    },
    [applyZoomAtViewportPoint, viewportSize.height, viewportSize.width],
  );

  const setCameraClamped = useCallback(
    (updater: Point | ((p: Point) => Point)) => {
      setCamera((prev) => {
        const raw = typeof updater === "function" ? updater(prev) : updater;
        return getBoardCameraClamped(raw, boardSize, viewportSize, zoomRef.current);
      });
    },
    [boardSize, viewportSize.height, viewportSize.width],
  );

  useEffect(() => {
    if (didInitRef.current) return;
    if (viewportSize.width <= 0 || viewportSize.height <= 0) return;

    const z = BOARD_DEFAULT_ZOOM;
    const viewW = viewportSize.width / z;
    const viewH = viewportSize.height / z;
    const desired: Point = {
      x: initialFocus.x - viewW / 2,
      y: initialFocus.y - viewH / 2,
    };
    applyView(desired, z);
    lastAnchorRef.current = {
      x: viewportSize.width / 2,
      y: viewportSize.height / 2,
    };
    didInitRef.current = true;
  }, [applyView, initialFocus.x, initialFocus.y, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    if (!didInitRef.current) return;
    if (viewportSize.width <= 0 || viewportSize.height <= 0) return;
    setCamera((c) =>
      getBoardCameraClamped(c, boardSize, viewportSize, zoomRef.current),
    );
  }, [boardSize.height, boardSize.width, viewportSize.height, viewportSize.width]);

  const boardTransform = useMemo(
    () =>
      `translate3d(${-camera.x * zoom}px, ${-camera.y * zoom}px, 0) scale(${zoom})`,
    [camera.x, camera.y, zoom],
  );

  const dragStateRef = useRef<{
    pointerId: number;
    startClient: Point;
    startCamera: Point;
    startZoom: number;
    moved: boolean;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isDesktop) return;
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-board-item="true"]')) return;
      if (target?.closest?.('[data-board-zoom-control="true"]')) return;

      const el = viewportRef.current;
      if (!el) return;

      el.setPointerCapture(e.pointerId);
      dragStateRef.current = {
        pointerId: e.pointerId,
        startClient: { x: e.clientX, y: e.clientY },
        startCamera: camera,
        startZoom: zoomRef.current,
        moved: false,
      };
      setDragging(true);
      e.preventDefault();
    },
    [camera, isDesktop],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = dragStateRef.current;
      if (!s) return;
      if (e.pointerId !== s.pointerId) return;

      const dx = e.clientX - s.startClient.x;
      const dy = e.clientY - s.startClient.y;
      if (
        !s.moved &&
        (Math.abs(dx) > BOARD_PAN_DRAG_THRESHOLD_PX ||
          Math.abs(dy) > BOARD_PAN_DRAG_THRESHOLD_PX)
      ) {
        s.moved = true;
      }

      const z = zoomRef.current;
      const next = getBoardCameraClamped(
        { x: s.startCamera.x - dx / z, y: s.startCamera.y - dy / z },
        boardSize,
        viewportSize,
        z,
      );
      setCamera(next);
      e.preventDefault();
    },
    [boardSize, viewportSize.height, viewportSize.width],
  );

  const endDrag = useCallback((e?: React.PointerEvent) => {
    const s = dragStateRef.current;
    if (!s) return;
    if (e && e.pointerId !== s.pointerId) return;
    dragStateRef.current = null;
    setDragging(false);
  }, []);

  /**
   * Non-passive `wheel` on the viewport so preventDefault() blocks browser page zoom
   * (⌘/Ctrl + scroll / trackpad pinch) while the cursor is over the board.
   */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      beforeWheelRef?.current?.(e);
      if (!isDesktopRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const r = el.getBoundingClientRect();
        const anchorPx = e.clientX - r.left;
        const anchorPy = e.clientY - r.top;
        const factor = Math.exp(-e.deltaY * BOARD_ZOOM_WHEEL_SENSITIVITY);
        const nz = clampBoardZoom(zoomRef.current * factor);
        const nc = cameraForZoomAroundViewportPoint(
          cameraRef.current,
          zoomRef.current,
          nz,
          anchorPx,
          anchorPy,
          boardSizeRef.current,
          viewportSizeRef.current,
        );
        setZoomState(nz);
        setCamera(nc);
        return;
      }

      const z = zoomRef.current;
      const c = cameraRef.current;
      const next = getBoardCameraClamped(
        { x: c.x + e.deltaX / z, y: c.y + e.deltaY / z },
        boardSizeRef.current,
        viewportSizeRef.current,
        z,
      );
      setCamera(next);
      e.preventDefault();
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [beforeWheelRef]);

  const bind = useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
    }),
    [endDrag, onPointerDown, onPointerMove],
  );

  const clampCamera = useCallback(
    (c: Point) => getBoardCameraClamped(c, boardSize, viewportSize, zoomRef.current),
    [boardSize, viewportSize.height, viewportSize.width],
  );

  const getLastViewportAnchor = useCallback(() => lastAnchorRef.current, []);

  return {
    viewportRef,
    viewportSize,
    camera,
    zoom,
    boardTransform,
    dragging,
    bind,
    setCamera: setCameraClamped,
    setZoom,
    applyView,
    applyZoomAtViewportPoint,
    clampCamera,
    getLastViewportAnchor,
  };
}
