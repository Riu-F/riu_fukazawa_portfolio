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

export default function CursorCanvas() {
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
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      if (mouseX < 0) { pending = false; return; }
      const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 240);
      g.addColorStop(0,    'rgba(0,0,0,0.08)');
      g.addColorStop(0.45, 'rgba(0,0,0,0.03)');
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
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
  }, []);

  return <canvas ref={canvasRef} className="cursor-canvas" />;
}
