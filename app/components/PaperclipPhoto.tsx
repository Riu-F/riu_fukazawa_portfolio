'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface PaperclipPhotoProps {
  src:      string;
  alt?:     string;
  style?:   React.CSSProperties;
  rotation?: number; /* degrees */
}

function Paperclip() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -2, position: 'relative', zIndex: 2 }}>
      <svg width="22" height="42" viewBox="0 0 22 42" fill="none">
        <path
          d="M11 38 C5 38 2 33 2 27 L2 10 C2 5.8 6 2 11 2 C16 2 20 5.8 20 10 L20 29 C20 33 17 37 13 37 C9 37 7 33 7 29 L7 12 C7 10.3 8.8 9 11 9 C13.2 9 15 10.3 15 12 L15 27"
          stroke="#c0c0c0"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function PaperclipPhoto({ src, alt = 'Photo', style, rotation = -3 }: PaperclipPhotoProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [pos, setPos]     = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const dragging = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });

  /* Convert right/top inline style to left/top before first drag */
  const pinToParent = useCallback(() => {
    if (pos) return;
    const el = cardRef.current;
    if (!el) return;
    const rect       = el.getBoundingClientRect();
    const parentRect = (el.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? { left: 0, top: 0 };
    setPos({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
  }, [pos]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    pinToParent();
    dragging.current = true;
    const rect = cardRef.current!.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, [pinToParent]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !cardRef.current) return;
      const parentRect = (cardRef.current.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? { left: 0, top: 0 };
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

  const dynamicPos: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : {};

  return (
    <div
      ref={cardRef}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:   'absolute',
        cursor:     dragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        transform:  `rotate(${rotation}deg) translateY(${hovered ? -8 : 0}px)`,
        transition: dragging.current ? 'none' : 'transform 0.28s ease',
        zIndex:     50,
        ...style,
        ...dynamicPos,
      }}
    >
      <Paperclip />
      <div style={{
        width:      152,
        height:     188,
        background: '#d8d8d8',
        boxShadow:  hovered
          ? '0 14px 36px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)'
          : '0.125rem 0.375rem 0.75rem rgba(0,0,0,0.18), 0 0.0625rem 0.125rem rgba(0,0,0,0.08)',
        overflow:   'hidden',
        transition: 'box-shadow 0.28s ease',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    </div>
  );
}
