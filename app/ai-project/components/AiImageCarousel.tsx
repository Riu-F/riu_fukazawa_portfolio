'use client';

import { useEffect, useRef } from 'react';
import type { StaticImageData } from 'next/image';

/* ── Image imports ─────────────────────────────────────────────── */
import cathayImg     from '../images/post-putchase-images/cathay-website.png';
import tripFlight2   from '../images/post-putchase-images/trip-flight2.png';
import allianzImg    from '../images/post-putchase-images/allianz.png';
import tripFlightImg from '../images/post-putchase-images/trip.com-flight.png';
import tripHotelImg  from '../images/post-putchase-images/trip-hotel.png';
import tripCom3Img   from '../images/post-putchase-images/trip.com - 3.png';

const IMAGES: { img: StaticImageData; alt: string }[] = [
  { img: cathayImg,     alt: 'Cathay Pacific post-purchase page'  },
  { img: tripFlight2,   alt: 'Trip.com flight confirmation'       },
  { img: allianzImg,    alt: 'Allianz travel insurance page'      },
  { img: tripFlightImg, alt: 'Trip.com flight details'            },
  { img: tripHotelImg,  alt: 'Trip.com hotel booking'             },
  { img: tripCom3Img,   alt: 'Trip.com booking confirmation'      },
];

/* ── Config ────────────────────────────────────────────────────── */
// Peek: positive = back cards shift RIGHT + DOWN, visible to the
// bottom-right of the front card. Padding on .aip-carousel-root
// reserves the matching space so the layout box is correct.
const CFG = { peekX: 16, peekY: 12, radius: 18, shadow: 24, threshold: 40 };
const N_CARDS        = IMAGES.length;             // 6
const MAX_PEEK_X     = (N_CARDS - 1) * CFG.peekX; // 80 px
const MAX_PEEK_Y     = (N_CARDS - 1) * CFG.peekY; // 60 px

const AUTO_INTERVAL   = 1300; // ~2× faster than original
const MANUAL_COOLDOWN = 2500; // resume auto after this many ms

export default function AiImageCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root  = rootRef.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>('.aip-card-stage')!;

    root.style.setProperty('--aip-radius', CFG.radius + 'px');
    root.style.setProperty('--aip-shadow', CFG.shadow + 'px');

    /* ── Helpers ─────────────────────────────────────────────── */
    const cards = (): HTMLElement[] =>
      Array.from(stage.children).filter(el =>
        (el as HTMLElement).classList.contains('aip-card')
      ) as HTMLElement[];

    function layout() {
      const list = cards();
      for (let i = 0; i < list.length; i++) {
        // Positive peek: back cards go right + down
        const tx = i * CFG.peekX;
        const ty = i * CFG.peekY;
        const sc = 1 - i * 0.015;
        list[i].style.transform = `translate(${tx}px,${ty}px) scale(${sc})`;
        list[i].style.zIndex    = String(list.length - i);
      }
    }

    function sendToBack() {
      const list = cards();
      if (!list.length) return;
      stage.appendChild(list[0]);
      requestAnimationFrame(layout);
    }

    function advance() {
      const list = cards();
      if (!list.length) return;
      const top = list[0];
      top.style.transition = 'transform 200ms cubic-bezier(.22,.61,.36,1)';
      let fired = false;
      const done = () => {
        if (fired) return; fired = true;
        top.removeEventListener('transitionend', done);
        top.style.transition = '';
        sendToBack();
      };
      top.addEventListener('transitionend', done);
      setTimeout(done, 260);
      top.style.transform = 'translate(0,-8px) scale(.995)';
    }

    /* ── Auto-play ───────────────────────────────────────────── */
    let autoTimer:  ReturnType<typeof setInterval> | null = null;
    let lastManual  = 0;
    let hovered     = false;

    function startAuto() {
      if (autoTimer) return;
      autoTimer = setInterval(() => {
        if (!hovered && performance.now() - lastManual > MANUAL_COOLDOWN) advance();
      }, AUTO_INTERVAL);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    const onMouseEnter = () => { hovered = true;  };
    const onMouseLeave = () => { hovered = false; };
    root.addEventListener('mouseenter', onMouseEnter);
    root.addEventListener('mouseleave', onMouseLeave);

    /* ── Drag / pointer ──────────────────────────────────────── */
    let isActive      = false;
    let lastGestureAt = 0;
    type Drag = { sx: number; sy: number; dx: number; dy: number; moved: number };
    let drag: Drag | null = null;

    function onDown(e: PointerEvent) {
      if (!root || !root.contains(e.target as Node)) return;
      isActive = true;
      drag = { sx: e.clientX, sy: e.clientY, dx: 0, dy: 0, moved: 0 };
      cards()[0]?.classList.add('aip-dragging');
      e.preventDefault(); e.stopPropagation();
    }

    function onMove(e: PointerEvent) {
      if (!isActive || !drag) return;
      drag.dx = e.clientX - drag.sx;
      drag.dy = e.clientY - drag.sy;
      drag.moved = Math.max(drag.moved, Math.hypot(drag.dx, drag.dy));
      const list = cards(); const top = list[0]; if (!top) return;
      top.style.transform = `translate(${drag.dx}px,${drag.dy}px)`;
      // Back cards: stay close to their resting positions; subtle parallax
      for (let i = 1; i < list.length; i++) {
        const tx = i * CFG.peekX - drag.dx * 0.06 * Math.log(i + 1);
        const ty = i * CFG.peekY - drag.dy * 0.06 * Math.log(i + 1);
        list[i].style.transform = `translate(${tx}px,${ty}px) scale(${1 - i * 0.015})`;
      }
      e.preventDefault(); e.stopPropagation();
    }

    function onUp(e: PointerEvent) {
      if (!isActive) return;
      isActive = false;
      const d = drag; drag = null;
      const list = cards(); const top = list[0];
      if (!top || !d) return;
      top.classList.remove('aip-dragging');
      const dist = Math.hypot(d.dx, d.dy);
      lastGestureAt = performance.now();
      lastManual    = performance.now();

      if (dist < CFG.threshold) {
        top.style.transition = 'transform 260ms cubic-bezier(.22,.61,.36,1)';
        top.style.transform  = 'translate(0,0)';
        const snap = () => { top.style.transition = ''; layout(); };
        top.addEventListener('transitionend', snap, { once: true });
        setTimeout(snap, 300);
      } else {
        const offX = d.dx * 1.8, offY = d.dy * 1.8;
        top.style.transition = 'transform 320ms cubic-bezier(.2,.7,.2,1)';
        let fired = false;
        const fling = () => {
          if (fired) return; fired = true;
          top.removeEventListener('transitionend', fling);
          top.style.transition = '';
          sendToBack();
        };
        top.addEventListener('transitionend', fling);
        setTimeout(fling, 420);
        top.style.transform = `translate(${offX}px,${offY}px) rotate(${(Math.random() - 0.5) * 14}deg)`;
      }
      e.stopPropagation();
    }

    function onClick(e: MouseEvent) {
      if (!root || !root.contains(e.target as Node)) return;
      if (performance.now() - lastGestureAt < 60) return;
      lastManual = performance.now();
      advance();
      e.stopPropagation();
    }

    /* Global capture listeners — same pattern as Webflow original */
    document.addEventListener('pointerdown',   onDown  as EventListener, { capture: true, passive: false });
    document.addEventListener('pointermove',   onMove  as EventListener, { capture: true, passive: false });
    document.addEventListener('pointerup',     onUp    as EventListener, { capture: true });
    document.addEventListener('pointercancel', onUp    as EventListener, { capture: true });
    document.addEventListener('click',         onClick as EventListener, { capture: true });

    window.addEventListener('resize', layout, { passive: true });
    layout(); setTimeout(layout, 50);
    startAuto();

    return () => {
      stopAuto();
      document.removeEventListener('pointerdown',   onDown  as EventListener, { capture: true });
      document.removeEventListener('pointermove',   onMove  as EventListener, { capture: true });
      document.removeEventListener('pointerup',     onUp    as EventListener, { capture: true });
      document.removeEventListener('pointercancel', onUp    as EventListener, { capture: true });
      document.removeEventListener('click',         onClick as EventListener, { capture: true });
      window.removeEventListener('resize', layout);
      root.removeEventListener('mouseenter', onMouseEnter);
      root.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    /* Outer wrapper: padding-right + padding-bottom reserves layout space
       for back cards that peek RIGHT + DOWN of the front card. */
    <div
      className="aip-carousel-root"
      style={{ paddingRight: MAX_PEEK_X, paddingBottom: MAX_PEEK_Y }}
    >
      <p className="aip-carousel-hint">Drag or click to explore</p>

      <div
        ref={rootRef}
        className="aip-card-stack"
        role="region"
        aria-label="Post-purchase screen examples"
      >
        <div className="aip-card-stage">
          {IMAGES.map(({ img, alt }, i) => (
            <div key={i} className="aip-card">
              <img
                src={img.src}
                alt={alt}
                width={img.width}
                height={img.height}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
