'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type UseStepperAutoCycleOptions = {
  stepCount: number;
  intervalMs?: number;
  /** Intersection ratio (0–1) required before auto-advance runs. */
  visibilityThreshold?: number;
  initialIndex?: number;
};

type UseStepperAutoCycleResult = {
  sectionRef: RefObject<HTMLElement | null>;
  activeIndex: number;
  /** Select a step; permanently disables auto-cycling for this page session. */
  selectStep: (index: number) => void;
  sectionHoverProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
};

/**
 * Shared stepper auto-cycle: advances only when the section is ≥30% visible,
 * the pointer is not over the section, and the user has not manually picked a step.
 */
export function useStepperAutoCycle({
  stepCount,
  intervalMs = 5000,
  visibilityThreshold = 0.3,
  initialIndex = 0,
}: UseStepperAutoCycleOptions): UseStepperAutoCycleResult {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const userLockedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  const selectStep = useCallback((index: number) => {
    setActiveIndex(index);
    userLockedRef.current = true;
  }, []);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0]?.intersectionRatio ?? 0;
        isVisibleRef.current = ratio >= visibilityThreshold;
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [visibilityThreshold]);

  useEffect(() => {
    if (stepCount <= 1) return undefined;

    const tick = () => {
      if (
        userLockedRef.current ||
        !isVisibleRef.current ||
        isHoveredRef.current ||
        prefersReducedMotionRef.current
      ) {
        return;
      }
      setActiveIndex((i) => (i + 1) % stepCount);
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [stepCount, intervalMs]);

  const sectionHoverProps = {
    onMouseEnter: () => {
      isHoveredRef.current = true;
    },
    onMouseLeave: () => {
      isHoveredRef.current = false;
    },
  };

  return { sectionRef, activeIndex, selectStep, sectionHoverProps };
}
