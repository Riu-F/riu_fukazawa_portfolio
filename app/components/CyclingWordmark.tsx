'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FONTS, PROBE_PX, TARGET_VH, type FontDef } from '../lib/titleData';

type CyclingWordmarkProps = {
  text?: string;
  className?: string;
  /**
   * Target fraction of viewport height that the cap-height should fill.
   * Defaults to the homepage value for perfect consistency.
   */
  targetVh?: number;
  /**
   * Called when the font index changes (including initial 0).
   * Useful for syncing other UI (e.g. tagline) to the same index.
   */
  onIndexChange?: (idx: number) => void;
  /**
   * When true, caps computed font-size so the wordmark cannot exceed the
   * viewport width (prevents horizontal scroll on mobile footers, etc.).
   */
  clampFontToViewport?: boolean;
  /**
   * Homepage load-in only: seed desktop flywheel velocity (or a short
   * accelerated mobile font burst) so fonts cycle fast then decelerate.
   */
  seedFlywheelOnMount?: boolean;
};

/**
 * CyclingWordmark
 * Shared implementation of the homepage "Riu" font-cycling wordmark.
 * Reused anywhere we need the exact same cycling behaviour (fonts, timing, flywheel).
 */
export default function CyclingWordmark({
  text = 'Riu',
  className = '',
  targetVh = TARGET_VH,
  onIndexChange,
  clampFontToViewport = false,
  seedFlywheelOnMount = false,
}: CyclingWordmarkProps) {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const capRatios = useRef<Record<string, number>>({});
  const probeRef = useRef<HTMLSpanElement | null>(null);

  const measureCapRatio = useCallback((f: FontDef): number => {
    const key = `${f.family}|${f.style}|${f.weight}`;
    if (capRatios.current[key] !== undefined) return capRatios.current[key];

    const probe = probeRef.current;
    if (!probe) return 0.72;

    probe.style.fontFamily = `'${f.family}', serif`;
    probe.style.fontStyle = f.style;
    probe.style.fontWeight = String(f.weight);

    const h = probe.getBoundingClientRect().height;
    const ratio = h > 10 && h < PROBE_PX * 1.5 ? h / PROBE_PX : 0.72;
    capRatios.current[key] = ratio;
    return ratio;
  }, []);

  const applyFont = useCallback(
    (idx: number) => {
      const el = wordmarkRef.current;
      if (!el) return;
      const f = FONTS[idx];
      const ratio = measureCapRatio(f);
      let fsPx = (targetVh * window.innerHeight) / ratio;
      if (clampFontToViewport) {
        const w = window.innerWidth;
        /* ~3 letters wide display fonts: keep glyph box within viewport */
        fsPx = Math.min(fsPx, w * 0.36);
      }
      el.style.fontFamily = `'${f.family}', serif`;
      el.style.fontStyle = f.style;
      el.style.fontWeight = String(f.weight);
      el.style.fontSize = `${fsPx.toFixed(1)}px`;
    },
    [measureCapRatio, targetVh, clampFontToViewport],
  );

  const velocityRef = useRef(0);
  const fontProgressRef = useRef(0);
  const fontIdxRef = useRef(0);
  const lastRAFTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const flywheelSeededRef = useRef(false);

  const switchFont = useCallback(() => {
    fontIdxRef.current = (fontIdxRef.current + 1) % FONTS.length;
    const idx = fontIdxRef.current;
    onIndexChange?.(idx);
    applyFont(idx);
  }, [applyFont, onIndexChange]);

  useEffect(() => {
    const probe = document.createElement('span');
    probe.textContent = 'H';
    probe.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      'line-height:1',
      'white-space:nowrap',
      'visibility:hidden',
      `font-size:${PROBE_PX}px`,
    ].join(';');
    document.body.appendChild(probe);
    probeRef.current = probe;

    FONTS.forEach((f) => {
      const descriptor = `${f.style} ${f.weight} ${PROBE_PX}px "${f.family}"`;
      document.fonts.load(descriptor).then(() => measureCapRatio(f));
    });

    const f0 = FONTS[0];
    const descriptor = `${f0.style} ${f0.weight} ${PROBE_PX}px "${f0.family}"`;
    document.fonts.load(descriptor).then(() => applyFont(0));
    onIndexChange?.(0);

    const onResize = () => applyFont(fontIdxRef.current);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      probe.remove();
    };
  }, [applyFont, measureCapRatio, onIndexChange]);

  useEffect(() => {
    applyFont(fontIdxRef.current);
  }, [targetVh, applyFont, clampFontToViewport]);

  useEffect(() => {
    if (isMobile) {
      if (seedFlywheelOnMount) {
        let delay = 70;
        let ticks = 0;
        let burstId = 0;
        const burst = () => {
          switchFont();
          ticks++;
          if (ticks < 18) {
            delay = Math.min(480, delay + 24);
            burstId = window.setTimeout(burst, delay);
          }
        };
        burst();
        const steadyId = window.setInterval(switchFont, 500);
        return () => {
          clearTimeout(burstId);
          clearInterval(steadyId);
        };
      }
      const id = setInterval(switchFont, 500);
      return () => clearInterval(id);
    }

    if (seedFlywheelOnMount && !flywheelSeededRef.current) {
      velocityRef.current = 18;
      flywheelSeededRef.current = true;
    }

    function flywheelTick(now: number) {
      const dt = lastRAFTimeRef.current ? Math.min(now - lastRAFTimeRef.current, 50) : 16;
      lastRAFTimeRef.current = now;

      if (velocityRef.current > 0.35) {
        velocityRef.current *= Math.pow(0.968, dt / 16);
        fontProgressRef.current += velocityRef.current * dt * 0.00016;

        while (fontProgressRef.current >= 1) {
          fontProgressRef.current -= 1;
          switchFont();
        }
      } else {
        velocityRef.current = 0;
        fontProgressRef.current = 0;
      }

      rafIdRef.current = requestAnimationFrame(flywheelTick);
    }

    rafIdRef.current = requestAnimationFrame(flywheelTick);

    const onWheel = (e: WheelEvent) => {
      velocityRef.current = Math.min(velocityRef.current + Math.abs(e.deltaY) * 0.0325, 100);
    };
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
      velocityRef.current = Math.min(velocityRef.current + dy * 0.055, 100);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, switchFont, seedFlywheelOnMount]);

  return (
    <div className={`title ${className}`.trim()} ref={wordmarkRef}>
      {text}
    </div>
  );
}

