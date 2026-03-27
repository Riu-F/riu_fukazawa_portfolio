'use client';

import { useEffect, useRef } from 'react';

/*
  Letter-glitch canvas — faithful port of the original Webflow JS.
  Fills the absolute cover-image-container behind the title.
*/
function LetterGlitch({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = containerRef.current;
    const canvas = canvasRef.current;
    if (!target || !canvas) return;

    const CONFIG = {
      glitchColors: ['#cacaca','#d3d3d3','#dcdcdc','#e5e5e5','#eeeeee','#f7f7f7','#ffffff'],
      glitchSpeed:  500,
      fontSize:     16,
      charWidth:    10,
      charHeight:   20,
      fontFamily:   "'SF Mono', Menlo, Consolas, monospace",
      updatePercent: 0.015,
      colorStep:    0.03,
      trailRadiusPx: 800,
      trailStrength: 0.95,
      trailFalloffPow: 3.0,
      trailDecay:   0.9,
    };

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};<>,.0123456789:';
    const randChar  = () => letters[Math.floor(Math.random() * letters.length)];
    const colors    = CONFIG.glitchColors.map(h => {
      const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
      return {r,g,b};
    });
    const randColor = () => colors[Math.floor(Math.random() * colors.length)];
    const interp    = (a:{r:number,g:number,b:number}, b:{r:number,g:number,b:number}, t:number) =>
      ({ r: Math.round(a.r+(b.r-a.r)*t), g: Math.round(a.g+(b.g-a.g)*t), b: Math.round(a.b+(b.b-a.b)*t) });
    const white = {r:255,g:255,b:255};
    // assert non-null (checked above)
    const tgt = target!;
    const cvs = canvas!;

    let grid = {cols:0, rows:0};
    let cellArr: Array<{char:string,color:{r:number,g:number,b:number},targetColor:{r:number,g:number,b:number},colorProgress:number}> = [];
    let boosts: Float32Array;
    let dirty: Uint8Array;
    let ctx: CanvasRenderingContext2D | null = null;
    let animId: number;
    let lastTick = Date.now();
    const mouse = {x:0, y:0, active:false};

    function init() {
      const dpr  = window.devicePixelRatio || 1;
      const rect = tgt.getBoundingClientRect();
      cvs.width  = Math.max(1, Math.floor(rect.width  * dpr));
      cvs.height = Math.max(1, Math.floor(rect.height * dpr));
      cvs.style.width  = rect.width  + 'px';
      cvs.style.height = rect.height + 'px';
      ctx = cvs.getContext('2d', {alpha: false});
      if (!ctx) return;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const cols = Math.ceil(rect.width  / CONFIG.charWidth);
      const rows = Math.ceil(rect.height / CONFIG.charHeight);
      grid = {cols, rows};
      const total = cols * rows;
      cellArr = Array.from({length: total}, () => {
        const c = randColor();
        return {char: randChar(), color: {...c}, targetColor: randColor(), colorProgress: 1};
      });
      boosts = new Float32Array(total);
      dirty  = new Uint8Array(total);
      drawAll();
    }

    function drawAll() {
      if (!ctx) return;
      const rect = cvs.getBoundingClientRect();
      ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0,0,rect.width,rect.height);
      for (let i=0; i<cellArr.length; i++) drawCell(i);
      dirty.fill(0);
    }

    function drawCell(i: number) {
      if (!ctx) return;
      const c  = cellArr[i];
      const x  = (i % grid.cols) * CONFIG.charWidth;
      const y  = Math.floor(i / grid.cols) * CONFIG.charHeight;
      const b  = boosts[i];
      const rgb = b > 0 ? interp(c.color, white, Math.min(1, b * CONFIG.trailStrength)) : c.color;
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillText(c.char, x, y);
    }

    function tick() {
      const now = Date.now();
      if (now - lastTick >= CONFIG.glitchSpeed) {
        const count = Math.max(1, Math.floor(cellArr.length * CONFIG.updatePercent));
        for (let i=0; i<count; i++) {
          const idx = Math.floor(Math.random() * cellArr.length);
          const L = cellArr[idx];
          L.char = randChar(); L.targetColor = randColor(); L.colorProgress = 0;
          dirty[idx] = 1;
        }
        lastTick = now;
      }
      // smooth color transitions
      for (let i=0; i<cellArr.length; i++) {
        const L = cellArr[i];
        if (L.colorProgress < 1) {
          L.colorProgress += CONFIG.colorStep;
          if (L.colorProgress > 1) L.colorProgress = 1;
          L.color = interp(L.color, L.targetColor, CONFIG.colorStep);
          dirty[i] = 1;
        }
      }
      // decay boosts
      for (let i=0; i<boosts.length; i++) {
        if (boosts[i] > 0.001) { boosts[i] *= CONFIG.trailDecay; dirty[i]=1; }
        else if (boosts[i] > 0) { boosts[i]=0; dirty[i]=1; }
      }
      // draw dirty
      if (!ctx) { animId = requestAnimationFrame(tick); return; }
      ctx.font = `${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
      ctx.textBaseline = 'top';
      for (let i=0; i<dirty.length; i++) {
        if (dirty[i]) {
          const x = (i % grid.cols) * CONFIG.charWidth;
          const y = Math.floor(i / grid.cols) * CONFIG.charHeight;
          ctx.fillStyle = '#fafafa';
          ctx.fillRect(x,y,CONFIG.charWidth,CONFIG.charHeight);
          drawCell(i);
          dirty[i] = 0;
        }
      }
      animId = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = tgt.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const r  = CONFIG.trailRadiusPx, rSq = r*r;
      const minC = Math.max(0, Math.floor((mx-r)/CONFIG.charWidth));
      const maxC = Math.min(grid.cols-1, Math.ceil((mx+r)/CONFIG.charWidth));
      const minR = Math.max(0, Math.floor((my-r)/CONFIG.charHeight));
      const maxR = Math.min(grid.rows-1, Math.ceil((my+r)/CONFIG.charHeight));
      for (let row=minR; row<=maxR; row++) {
        const cy = row * CONFIG.charHeight + CONFIG.charHeight*0.5;
        const dy = cy - my, dySq = dy*dy;
        for (let col=minC; col<=maxC; col++) {
          const cx = col*CONFIG.charWidth+CONFIG.charWidth*0.5;
          const dx = cx-mx, dSq = dx*dx+dySq;
          if (dSq <= rSq) {
            const t = 1-(Math.sqrt(dSq)/r);
            const s = Math.pow(t, CONFIG.trailFalloffPow);
            const idx = row*grid.cols+col;
            boosts[idx] = Math.max(boosts[idx], s);
            dirty[idx]  = 1;
          }
        }
      }
    }

    let rto: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(rto); cancelAnimationFrame(animId);
      rto = setTimeout(() => { init(); animId = requestAnimationFrame(tick); }, 120);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    init();
    if (!prefersReduced) animId = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMouseMove, {passive:true});
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, display:'block' }}
    />
  );
}

export default function AiHero() {
  const coverRef = useRef<HTMLDivElement>(null);

  return (
    <section className="project---title-section ai-page-margin">
      {/* Letter glitch canvas behind everything */}
      <div ref={coverRef} className="cover-image-container letter-glitch-target">
        <LetterGlitch containerRef={coverRef} />
      </div>

      {/* Title container */}
      <div className="flex-title-page-center w-container">
        <div>
          <div className="plus_symbol_holder">
            <h1 className="h1">AI</h1>
            <h1 className="h2 plus_symbol h1_size">+</h1>
          </div>
          <h1 className="h1 black">Design</h1>
          <p className="paragraph-new width-limit">
            This project explores how AI can dynamically personalise the post&#8209;purchase
            experience on travel platforms. Focusing on the often-generic checkout and confirmation
            stages, it uses existing user data to generate{' '}
            <strong>relevant, real-time content</strong> that adapts to each traveller.
          </p>
        </div>
      </div>
    </section>
  );
}
