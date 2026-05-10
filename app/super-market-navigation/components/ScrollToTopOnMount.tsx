'use client';

import { useEffect } from 'react';

/*
  ScrollToTopOnMount
  ──────────────────
  Forces the window to (0, 0) on mount and again after the next two animation
  frames. Required because:

  • The FoodHub hero contains a 720px-tall iframe. While it loads, layout
    shifts and any focus-stealing inside the iframe (autofocus inputs,
    auto-scrollIntoView calls in the embedded app) can pull the parent
    page's scroll position downward — landing the user roughly halfway down.
  • Next.js's built-in scroll-to-top fires before the iframe is fully laid out,
    so the second/third pass catches up after layout settles.
*/
export default function ScrollToTopOnMount() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const goTop = () => window.scrollTo(0, 0);
    goTop();
    const r1 = requestAnimationFrame(() => {
      goTop();
      const r2 = requestAnimationFrame(goTop);
      cleanups.push(() => cancelAnimationFrame(r2));
    });

    const cleanups: Array<() => void> = [
      () => cancelAnimationFrame(r1),
      () => {
        window.history.scrollRestoration = prev;
      },
    ];

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
