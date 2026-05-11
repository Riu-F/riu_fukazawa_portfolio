'use client';

/*
  PhotoCard
  ─────────
  Renders the PNG directly as a floating, draggable object.
  The PNG already contains the full visual (paperclip, stacked sheets,
  photo cutout) — no extra framing, borders, or decoration is added.

  The wrapper div is invisible: transparent background, no border,
  no shadow, no padding. It exists only to handle position and drag.

  Interaction:
  • drag = mousedown + move > DRAG_THRESHOLD_PX
  • click without drag = navigate to /about
  • hover (desktop only) = show colourful "About me →" chip following cursor
*/

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HoverAboutTooltip from './HoverAboutTooltip';

interface PhotoCardProps {
  src:       string;
  alt?:      string;
  style?:    React.CSSProperties;
  rotation?: number;
}

const DRAG_THRESHOLD_PX = 6;

export default function PhotoCard({
  src,
  alt      = 'Photo',
  style,
  rotation = 3,
}: PhotoCardProps) {
  const router  = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const dragging        = useRef(false);
  const offset          = useRef({ x: 0, y: 0 });
  const pressStart      = useRef({ x: 0, y: 0 });
  const suppressClickRef = useRef(false);

  /* Convert initial right/top to left/top on first drag */
  const pinToParent = useCallback(() => {
    if (pos) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect       = el.getBoundingClientRect();
    const parentRect = (el.offsetParent as HTMLElement | null)
      ?.getBoundingClientRect() ?? { left: 0, top: 0 };
    setPos({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
  }, [pos]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    pinToParent();
    dragging.current = true;
    const rect = wrapRef.current!.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    pressStart.current = { x: e.clientX, y: e.clientY };
    suppressClickRef.current = false;
    e.preventDefault();
  }, [pinToParent]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !wrapRef.current) return;
      const dx = e.clientX - pressStart.current.x;
      const dy = e.clientY - pressStart.current.y;
      if (dx * dx + dy * dy > DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        suppressClickRef.current = true;
      }
      const parentRect = (wrapRef.current.offsetParent as HTMLElement | null)
        ?.getBoundingClientRect() ?? { left: 0, top: 0 };
      setPos({
        x: e.clientX - parentRect.left - offset.current.x,
        y: e.clientY - parentRect.top  - offset.current.y,
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  /* React-level click: fires after press + release. If movement exceeded
     the threshold we treat it as a drag and swallow the click. */
  const onClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    router.push('/about');
  }, [router]);

  const dynamicPos: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : {};

  return (
    <>
      <div
        ref={wrapRef}
        className="photo-card-hero"
        role="link"
        tabIndex={0}
        aria-label="About me"
        onMouseDown={onMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push('/about');
          }
        }}
        style={{
          position:   'absolute',
          cursor:     dragging.current ? 'grabbing' : 'grab',
          userSelect: 'none',
          /* Invisible wrapper — no background, border, or shadow */
          background: 'transparent',
          transform:  `rotate(${rotation}deg) translateY(${hovered ? -6 : 0}px)`,
          transition: dragging.current
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex:     50,
          ...style,
          ...dynamicPos,
        }}
      >
        {/* The PNG is the entire visual object — no wrapper styling applied */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            display:    'block',
            width:      200,
            height:     'auto',
            /* Subtle hover shadow applied directly to the image */
            filter:     hovered
              ? 'drop-shadow(0 12px 28px rgba(0,0,0,0.22))'
              : 'drop-shadow(0 5px 14px rgba(0,0,0,0.15))',
            transition: dragging.current
              ? 'none'
              : 'filter 0.28s ease',
          }}
        />
      </div>
      <HoverAboutTooltip show={hovered} />
    </>
  );
}
