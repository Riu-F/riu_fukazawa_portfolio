'use client';

import { useEffect, useRef, type RefObject } from 'react';

export const DRAG_THRESHOLD_PX = 5;

export type DraggablePercentPosition = { x: number; y: number };

type UseDraggableOptions = {
  containerRef: RefObject<HTMLElement | null>;
  position: DraggablePercentPosition;
  onPositionChange: (pos: DraggablePercentPosition) => void;
  onDragStart?: () => void;
  enabled?: boolean;
  thresholdPx?: number;
  rotation?: number;
  /** When false, only left/top % are written (e.g. mobile uses CSS transform vars). */
  syncTransform?: boolean;
  /** Ignore pointerdown when target is inside this selector (e.g. expand panel). */
  ignoreSelector?: string;
};

/**
 * Percent-based drag inside a container — same click-vs-drag threshold
 * pattern as DraggableStickyCard (hero sticky note).
 */
export function useDraggable(
  elementRef: RefObject<HTMLElement | null>,
  {
    containerRef,
    position,
    onPositionChange,
    onDragStart,
    enabled = true,
    thresholdPx = DRAG_THRESHOLD_PX,
    rotation = 0,
    syncTransform = true,
    ignoreSelector = '.desk-item__panel',
  }: UseDraggableOptions,
) {
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const el = elementRef.current;
    const container = containerRef.current;
    if (!el || !container) return undefined;

    let active   = false;
    let dragging = false;
    let startX   = 0;
    let startY   = 0;
    let pressX   = 0;
    let pressY   = 0;
    let origLeft = 0;
    let origTop  = 0;

    function applyPercent(x: number, y: number) {
      el!.style.left = `${x}%`;
      el!.style.top = `${y}%`;
      if (syncTransform) {
        el!.style.transform = 'translate(-50%, -50%)';
        el!.style.setProperty('--desk-item-rot', `${rotation}deg`);
      }
    }

    function clampCenter(
      left: number,
      top: number,
      pr: DOMRect,
      halfW: number,
      halfH: number,
    ) {
      const pad = 20;
      return {
        left: Math.min(Math.max(left, halfW + pad), pr.width - halfW - pad),
        top:  Math.min(Math.max(top,  halfH + pad), pr.height - halfH - pad),
      };
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      if (
        ignoreSelector &&
        e.target instanceof Element &&
        e.target.closest(ignoreSelector)
      ) {
        return;
      }

      active = true;
      dragging = false;
      suppressClickRef.current = false;

      const pr = container!.getBoundingClientRect();
      const er = el!.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      pressX = e.clientX;
      pressY = e.clientY;
      origLeft = er.left - pr.left + er.width / 2;
      origTop  = er.top - pr.top + er.height / 2;
    }

    function onPointerMove(e: PointerEvent) {
      if (!active) return;

      const dx = e.clientX - pressX;
      const dy = e.clientY - pressY;

      if (!dragging) {
        if (dx * dx + dy * dy <= thresholdPx * thresholdPx) return;
        dragging = true;
        suppressClickRef.current = true;
        el!.classList.add('desk-item--dragging');
        onDragStart?.();
      }

      const pr = container!.getBoundingClientRect();
      const er = el!.getBoundingClientRect();
      const halfW = er.width / 2;
      const halfH = er.height / 2;
      const { left, top } = clampCenter(
        origLeft + (e.clientX - startX),
        origTop + (e.clientY - startY),
        pr,
        halfW,
        halfH,
      );

      applyPercent((left / pr.width) * 100, (top / pr.height) * 100);
    }

    function onPointerUp() {
      if (!active) return;
      active = false;

      if (dragging) {
        const pr = container!.getBoundingClientRect();
        const er = el!.getBoundingClientRect();
        const halfW = er.width / 2;
        const halfH = er.height / 2;
        const centerX = er.left - pr.left + er.width / 2;
        const centerY = er.top - pr.top + er.height / 2;
        const { left, top } = clampCenter(centerX, centerY, pr, halfW, halfH);
        onPositionChange({
          x: (left / pr.width) * 100,
          y: (top / pr.height) * 100,
        });
        el!.classList.remove('desk-item--dragging');
      }

      dragging = false;
    }

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      el.classList.remove('desk-item--dragging');
    };
  }, [
    elementRef,
    containerRef,
    enabled,
    thresholdPx,
    rotation,
    onPositionChange,
    onDragStart,
    ignoreSelector,
    syncTransform,
  ]);

  /* Sync DOM when position prop changes (not mid-drag). */
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !enabled) return;
    if (el.classList.contains('desk-item--dragging')) return;
    el.style.left = `${position.x}%`;
    el.style.top = `${position.y}%`;
    if (syncTransform) {
      el.style.transform = 'translate(-50%, -50%)';
      el.style.setProperty('--desk-item-rot', `${rotation}deg`);
    }
  }, [elementRef, position.x, position.y, rotation, enabled, syncTransform]);

  return { suppressClickRef };
}
