'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';

const SCROLL_PX_PER_SEC = 35;

type SuedeLogoMarqueeProps = {
  logos: PublicFolderGalleryImage[];
};

export function SuedeLogoMarquee({ logos }: SuedeLogoMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const loop = logos.length > 0 ? [...logos, ...logos] : [];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const onTouchStart = useCallback(() => setPaused(true), []);
  const onTouchEnd = useCallback(() => setPaused(false), []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || loop.length === 0 || reducedMotion) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      if (!paused) {
        const dt = (now - last) / 1000;
        el.scrollLeft += SCROLL_PX_PER_SEC * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop.length, paused, reducedMotion]);

  if (logos.length === 0) return null;

  return (
    <div className="suede-intro__marquee" aria-label="Industry partners">
      <div
        ref={viewportRef}
        className="suede-intro__marquee-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <ul className="suede-intro__marquee-track">
          {loop.map((logo, index) => (
            <li
              key={`${logo.src}-${index}`}
              className="suede-intro__marquee-item"
              aria-hidden={index >= logos.length ? true : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={index < logos.length ? logo.alt : ''}
                className="suede-intro__marquee-logo"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
