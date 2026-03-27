'use client';

/*
  TitleSection
  ────────────
  Owns:
  • cap-height normalised font sizing
  • flywheel scroll → font cycling
  • tagline text cycling (in sync with font index)

  The title renders as plain text — no custom "i" treatment.
*/

import { useEffect, useRef, useCallback } from 'react';
import { FONTS, TAGLINES, PROBE_PX, TARGET_VH, type FontDef } from '../lib/titleData';

export default function TitleSection() {
  const titleRef   = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  /*
    Cap-height ratio cache.
    Keyed by "family|style|weight" → ratio (capHeightPx / PROBE_PX).
    Stored in a ref so it persists across renders without re-render churn.
  */
  const capRatios = useRef<Record<string, number>>({});

  /* Hidden off-screen probe element for cap-height measurement */
  const probeRef = useRef<HTMLSpanElement | null>(null);

  /* ── Cap-height measurement ─────────────────────────────────────── */
  const measureCapRatio = useCallback((f: FontDef): number => {
    const key = `${f.family}|${f.style}|${f.weight}`;
    if (capRatios.current[key] !== undefined) return capRatios.current[key];

    const probe = probeRef.current;
    if (!probe) return 0.72;

    probe.style.fontFamily = `'${f.family}', serif`;
    probe.style.fontStyle  = f.style;
    probe.style.fontWeight = String(f.weight);

    const h = probe.getBoundingClientRect().height;
    /* Guard: if measurement fails (0 or suspiciously large), fall back */
    const ratio = (h > 10 && h < PROBE_PX * 1.5) ? h / PROBE_PX : 0.72;
    capRatios.current[key] = ratio;
    return ratio;
  }, []);

  /* ── Apply font + recalculate title size ────────────────────────── */
  const applyFont = useCallback((idx: number) => {
    const el = titleRef.current;
    if (!el) return;
    const f     = FONTS[idx];
    const ratio = measureCapRatio(f);
    /* fontSize so that (fontSize × ratio) equals TARGET_VH × viewportHeight */
    const fsPx  = (TARGET_VH * window.innerHeight) / ratio;
    el.style.fontFamily = `'${f.family}', serif`;
    el.style.fontStyle  = f.style;
    el.style.fontWeight = String(f.weight);
    el.style.fontSize   = `${fsPx.toFixed(1)}px`;
  }, [measureCapRatio]);

  /* ── Flywheel state — refs avoid re-render churn ────────────────── */
  const velocityRef     = useRef(0);
  const fontProgressRef = useRef(0);
  const fontIdxRef      = useRef(0);
  const lastRAFTimeRef  = useRef(0);
  const lastScrollYRef  = useRef(0);
  const rafIdRef        = useRef<number>(0);

  const switchFont = useCallback(() => {
    fontIdxRef.current = (fontIdxRef.current + 1) % FONTS.length;
    const idx = fontIdxRef.current;
    if (taglineRef.current) {
      taglineRef.current.textContent = TAGLINES[idx % TAGLINES.length];
    }
    applyFont(idx);
  }, [applyFont]);

  /* ── Main setup effect ──────────────────────────────────────────── */
  useEffect(() => {
    /* Hidden probe span for cap-height measurement */
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

    /* Preload all fonts and warm the cap-ratio cache */
    FONTS.forEach((f) => {
      const descriptor = `${f.style} ${f.weight} ${PROBE_PX}px "${f.family}"`;
      document.fonts.load(descriptor).then(() => measureCapRatio(f));
    });

    /* Apply initial font (Playfair Display) once it is ready */
    const f0         = FONTS[0];
    const descriptor = `${f0.style} ${f0.weight} ${PROBE_PX}px "${f0.family}"`;
    document.fonts.load(descriptor).then(() => applyFont(0));

    /* Resize handler */
    const onResize = () => applyFont(fontIdxRef.current);
    window.addEventListener('resize', onResize);

    /* ── Flywheel tick ────────────────────────────────────────────── */
    function flywheelTick(now: number) {
      const dt = lastRAFTimeRef.current
        ? Math.min(now - lastRAFTimeRef.current, 50)
        : 16;
      lastRAFTimeRef.current = now;

      if (velocityRef.current > 0.35) {
        velocityRef.current     *= Math.pow(0.968, dt / 16);
        fontProgressRef.current += velocityRef.current * dt * 0.00016;

        while (fontProgressRef.current >= 1) {
          fontProgressRef.current -= 1;
          switchFont();
        }
      } else {
        velocityRef.current     = 0;
        fontProgressRef.current = 0;
      }

      rafIdRef.current = requestAnimationFrame(flywheelTick);
    }
    rafIdRef.current = requestAnimationFrame(flywheelTick);

    /* ── Wheel + scroll → build velocity ─────────────────────────── */
    const onWheel = (e: WheelEvent) => {
      velocityRef.current = Math.min(
        velocityRef.current + Math.abs(e.deltaY) * 0.0325,
        100,
      );
    };
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
      velocityRef.current = Math.min(velocityRef.current + dy * 0.055, 100);
    };

    window.addEventListener('wheel',  onWheel,  { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize',  onResize);
      window.removeEventListener('wheel',   onWheel);
      window.removeEventListener('scroll',  onScroll);
      probe.remove();
    };
  }, [applyFont, measureCapRatio, switchFont]);

  /*
    All three hero text layers live in hero_bottom so they shift as one
    unit when the JS font-size changes — no positional drift between them.

    Reading order:
      1. .hello-intro  — "Hello, I'm"  (small, understated)
      2. .title        — "Riu"          (hero focal point, JS-sized)
      3. .tagline      — cycling phrase (secondary, below title)
  */
  return (
    <div className="hero_bottom">
      <p className="hello-intro">Hello, I&rsquo;m</p>

      {/* Plain text — no custom letter decomposition */}
      <div className="title" ref={titleRef}>
        Riu
      </div>

      {/* white-space: pre-line in CSS makes \n a visible line break */}
      <p className="tagline" ref={taglineRef}>
        {TAGLINES[0]}
      </p>
    </div>
  );
}
