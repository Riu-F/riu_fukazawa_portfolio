'use client';

/*
  HoverAboutTooltip
  ─────────────────
  A small colourful "About me →" chip that follows the cursor while
  hovering over a draggable hero object (sticky note, paperclip photo).
  Renders nothing on mobile (no hover) and nothing when not hovered.

  Positioning: position: fixed in viewport coordinates, offset slightly
  down-right from the cursor so it never sits under the pointer or
  intercepts events (pointer-events: none).
*/

import { useEffect, useState } from 'react';

interface Props {
  show:  boolean;
  text?: string;
}

export default function HoverAboutTooltip({ show, text = 'About me' }: Props) {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!show) {
      setMouse(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [show]);

  if (!show || !mouse) return null;

  return (
    <div
      aria-hidden
      className="about-hover-chip"
      style={{
        position:       'fixed',
        left:           mouse.x + 16,
        top:            mouse.y + 18,
        pointerEvents:  'none',
        zIndex:         9999,
        padding:        '6px 14px 7px',
        borderRadius:   999,
        background:
          'linear-gradient(120deg, #fbbf24 0%, #ec4899 35%, #818cf8 70%, #34d399 100%)',
        backgroundSize: '220% 220%',
        color:          '#fff',
        fontFamily:     "'Inter', sans-serif",
        fontSize:       12.5,
        fontWeight:     600,
        letterSpacing:  '0.02em',
        whiteSpace:     'nowrap',
        boxShadow:
          '0 6px 18px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.45) inset',
        transform:      'translateZ(0)',
      }}
    >
      {text}
      <span style={{ marginLeft: 6, opacity: 0.9 }} aria-hidden>→</span>
    </div>
  );
}
