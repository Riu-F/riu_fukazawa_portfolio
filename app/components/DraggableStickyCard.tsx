'use client';

/*
  DraggableStickyCard
  ───────────────────
  Wraps any sticky-card content with:
  • mouse + touch drag (position:absolute inside .hero)
  • hover peel effect (lift + slight extra rotation)
  • hover affordance: shows a colourful "About me →" chip near the cursor
  • click without drag → navigates to /about

  Click vs drag is decided by movement distance during the press.
  If the pointer moves more than DRAG_THRESHOLD_PX between mousedown and
  mouseup, the upcoming click is suppressed and treated as a drag.

  Props:
    baseRot  — resting rotation in degrees (e.g. 2 or -1.5)
    peelRot  — rotation while hovered (slightly more exaggerated)
    style    — initial inline style (top / right position)
    children — the note's inner content
*/

import { useRef, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import HoverAboutTooltip from './HoverAboutTooltip';

interface Props {
  baseRot: number;
  peelRot: number;
  style: CSSProperties;
  children: ReactNode;
}

const DRAG_THRESHOLD_PX = 6;

export default function DraggableStickyCard({ baseRot, peelRot, style, children }: Props) {
  const elRef  = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Hover state drives the HoverAboutTooltip; the peel transform is still
     applied via DOM mutation below so it composes cleanly with drag. */
  const [hovered, setHovered] = useState(false);

  /* Set on mousedown/touchstart, set true once movement passes the threshold.
     onClick checks this to decide whether to navigate or treat as drag. */
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let dragging  = false;
    let startX    = 0, startY = 0;
    let origLeft  = 0, origTop = 0;
    let pressX    = 0, pressY = 0;

    /*
      Convert right/bottom offsets to explicit left/top so drag math
      stays simple. Both rects are viewport-relative so scroll offsets
      cancel out automatically.
    */
    function pinToParent() {
      const pr = el!.parentElement!.getBoundingClientRect();
      const er = el!.getBoundingClientRect();
      el!.style.right  = 'auto';
      el!.style.bottom = 'auto';
      el!.style.left   = `${er.left - pr.left}px`;
      el!.style.top    = `${er.top  - pr.top}px`;
    }

    /* ── Mouse drag ──────────────────────────────────────────────── */
    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      pinToParent();
      dragging = true;
      el!.classList.add('sticky-card--dragging');
      startX   = e.clientX;
      startY   = e.clientY;
      pressX   = e.clientX;
      pressY   = e.clientY;
      origLeft = parseFloat(el!.style.left);
      origTop  = parseFloat(el!.style.top);
      suppressClickRef.current = false;
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragging) return;
      el!.style.left = `${origLeft + e.clientX - startX}px`;
      el!.style.top  = `${origTop  + e.clientY - startY}px`;
      const dx = e.clientX - pressX;
      const dy = e.clientY - pressY;
      if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        suppressClickRef.current = true;
      }
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      el!.classList.remove('sticky-card--dragging');
    }

    /* ── Touch drag ──────────────────────────────────────────────── */
    function onTouchStart(e: TouchEvent) {
      pinToParent();
      const t = e.touches[0];
      dragging = true;
      startX   = t.clientX;
      startY   = t.clientY;
      pressX   = t.clientX;
      pressY   = t.clientY;
      origLeft = parseFloat(el!.style.left);
      origTop  = parseFloat(el!.style.top);
      suppressClickRef.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      if (!dragging) return;
      const t = e.touches[0];
      el!.style.left = `${origLeft + t.clientX - startX}px`;
      el!.style.top  = `${origTop  + t.clientY - startY}px`;
      const dx = t.clientX - pressX;
      const dy = t.clientY - pressY;
      if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        suppressClickRef.current = true;
      }
    }

    function onTouchEnd() {
      dragging = false;
      el!.classList.remove('sticky-card--dragging');
    }

    /* ── Hover peel ──────────────────────────────────────────────── */
    function onMouseEnter() {
      setHovered(true);
      if (dragging) return;
      el!.style.transition =
        'box-shadow 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)';
      el!.style.boxShadow =
        '0.4375rem 0.75rem 1.25rem rgba(0,0,0,0.26),' +
        '0 0.0625rem 0.1875rem rgba(0,0,0,0.1)';
      el!.style.transform =
        `rotate(${peelRot}deg) translateY(-0.3125rem) scale(1.03)`;
    }

    function onMouseLeave() {
      setHovered(false);
      if (dragging) return;
      el!.style.transition = 'box-shadow 0.25s ease, transform 0.3s ease';
      el!.style.boxShadow  = '';
      el!.style.transform  = `rotate(${baseRot}deg)`;
    }

    el.addEventListener('mousedown',  onMouseDown);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('touchstart', onTouchStart, { passive: true });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend',  onTouchEnd);

    return () => {
      el.removeEventListener('mousedown',  onMouseDown);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend',  onTouchEnd);
    };
  }, [baseRot, peelRot]);

  /* React-level click: fires only after the browser decides a real click
     happened (i.e. press + release with minimal movement). If we already
     flagged the gesture as a drag, swallow the click. */
  const onClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    router.push('/about');
  };

  return (
    <>
      <div
        ref={elRef}
        className="sticky-card"
        role="link"
        tabIndex={0}
        aria-label="About me"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push('/about');
          }
        }}
        style={style}
      >
        {children}
      </div>
      <HoverAboutTooltip show={hovered} />
    </>
  );
}
