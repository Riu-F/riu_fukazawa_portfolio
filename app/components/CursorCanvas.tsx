'use client';

/*
  CursorCanvas
  ────────────
  Single fixed canvas that renders a subtle radial glow following the cursor.
  Pointer-events are disabled so it never interferes with page interaction.

  The dot burst and all dot-click/hover logic have been removed.
  The dot's idle pulse lives in TitleSection, which owns the dot element.
*/

import { useEffect, useRef } from 'react';

interface Props {
  /** Optional element to exclude from the shadow — the shadow is clipped
   *  to a hole around this element's bounding rect so the background grid
   *  is darkened but the element itself is not. */
  excludeRef?: React.RefObject<HTMLElement | null>;
}

export default function CursorCanvas({ excludeRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    /* ── Resize ──────────────────────────────────────────────────── */
    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Cursor glow ─────────────────────────────────────────────── */
    let mouseX = -999, mouseY = -999, pending = false;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);
      if (mouseX < 0) { pending = false; return; }

      ctx.save();

      /*
        If an exclude element is provided, punch a rectangular hole in
        the clipping region so the shadow never darkens that area.
        Even-odd fill rule: outer rect fills, inner rect (same winding
        path added second) subtracts — creating the hole.
      */
      const excl = excludeRef?.current;
      if (excl) {
        const r = excl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const path = new Path2D();
          path.rect(0, 0, w, h);
          path.rect(r.left, r.top, r.width, r.height);
          ctx.clip(path, 'evenodd');
        }
      }

      const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 240);
      g.addColorStop(0,    'rgba(0,0,0,0.08)');
      g.addColorStop(0.45, 'rgba(0,0,0,0.03)');
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
      pending = false;
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(draw);
      }
    }
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  // excludeRef is a ref object — its identity is stable, no need in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="cursor-canvas" />;
}
