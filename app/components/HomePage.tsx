'use client';

/*
  HomePage — assembles the full page.
  • CursorCanvas        — cursor glow, shadow excluded from ProjectDeck area
  • DraggableStickyCard — draggable + hover-peel sticky note (random right-side position)
  • PhotoCard           — draggable stacked photo (random right-side position)
  • TitleSection        — font cycling, cap-height normalisation, tagline
  • ProjectDeck         — rotating stacked deck below the hero
*/

import { useState, useEffect, useRef }  from 'react';
import CursorCanvas        from './CursorCanvas';
import DraggableStickyCard from './DraggableStickyCard';
import PhotoCard           from './PhotoCard';
import TitleSection        from './TitleSection';
import ProjectDeck         from './ProjectDeck';
import AiNav               from '../ai-project/components/AiNav';

interface FloatPos {
  photo:  React.CSSProperties;
  sticky: React.CSSProperties;
}

export default function HomePage() {
  /*
    Random positions for the floating photo and sticky note.
    Computed client-side only (useEffect) to avoid SSR hydration mismatch.

    Desktop:  right side of hero (past 50% width), any vertical position.
    Mobile:   bottom half of hero, any horizontal in the right half.
    5–35% from the right edge keeps both elements away from the viewport edge.
    Sticky is guaranteed to be at least 15% below photo vertically.
  */
  const [floatPos, setFloatPos] = useState<FloatPos | null>(null);

  useEffect(() => {
    const vw     = window.innerWidth;
    const mobile = vw < 640;
    const rand   = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    if (mobile) {
      /*
        Mobile: elements placed in the BOTTOM HALF of the hero section.
        Use right-percentage so we stay away from both edges.
        right: 5–18% keeps elements fully on-screen with safe padding.
        Vertical: top 52–75% (bottom half, not too close to bottom).
      */
      const photoTop  = rand(52, 68);
      const stickyTop = Math.min(76, photoTop + 12 + rand(0, 10));

      setFloatPos({
        photo: {
          position: 'absolute',
          top:      `${photoTop}%`,
          right:    `${rand(5, 18)}%`,
        },
        sticky: {
          position: 'absolute',
          top:      `${stickyTop}%`,
          right:    `${rand(5, 18)}%`,
        },
      });
    } else {
      /*
        Desktop: elements always on the RIGHT side of the hero.
        x-position guaranteed > 53% of viewport width by computing
        left in px rather than right in % (avoids element-width math ambiguity).

        photoW ~200px (PNG card), stickyW ~184px (11.5rem at 16px base).
        padPx = 8% of vw (min 48px) keeps elements from the right edge.
        leftMin = 53% of vw guarantees both elements are past the midpoint.
      */
      const photoW   = 200;
      const stickyW  = 200;   // generous; actual ~184px
      const padPx    = Math.max(48, vw * 0.08);
      const leftMin  = vw * 0.53;

      const photoLeft  = rand(leftMin, vw - padPx - photoW);
      const stickyLeft = rand(leftMin, vw - padPx - stickyW);

      const photoTop  = rand(8, 42);
      const stickyTop = Math.min(56, photoTop + 14 + rand(0, 12));

      setFloatPos({
        photo: {
          position: 'absolute',
          top:      `${photoTop}%`,
          left:     `${Math.round(photoLeft)}px`,
        },
        sticky: {
          position: 'absolute',
          top:      `${stickyTop}%`,
          left:     `${Math.round(stickyLeft)}px`,
        },
      });
    }
  }, []);

  /* Ref forwarded to ProjectDeck's sticky shell so CursorCanvas can
     clip its shadow to the background grid only */
  const deckRef = useRef<HTMLDivElement>(null);

  return (
    <main className="page">
      <AiNav current="home" />
      <CursorCanvas excludeRef={deckRef} />

      <section className="hero">

        {/* ── Photo card — random right-side position ───────────────── */}
        <PhotoCard
          src="/images/riu_selfie.png"
          alt="Riu"
          rotation={3}
          style={floatPos?.photo ?? { top: '2.5rem', right: '16rem' }}
        />

        {/* ── Sticky: Todo — random right-side position ─────────────── */}
        <DraggableStickyCard
          baseRot={2}
          peelRot={3.5}
          style={floatPos?.sticky
            ? { ...floatPos.sticky, transform: 'rotate(2deg)' }
            : { top: '5rem', right: '4.5rem', transform: 'rotate(2deg)' }
          }
        >
          <div className="sticky-card__title">riu&apos;s to do:</div>
          <div className="sticky-card__item">
            <span className="sticky-card__checkbox">✓</span>
            <span>graduate</span>
          </div>
          <div className="sticky-card__item">
            <span className="sticky-card__checkbox"></span>
            <span>make a portfolio</span>
          </div>
          <div className="sticky-card__item">
            <span className="sticky-card__checkbox"></span>
            <span>learn web dev</span>
          </div>
          <hr className="sticky-card__divider" />
          <div className="sticky-card__status">👀 open to work</div>
        </DraggableStickyCard>

        {/* ── Hero bottom: hello + font-cycling title + tagline ─────── */}
        <TitleSection />

      </section>

      {/* ── Project deck — directly below the hero ────────────────── */}
      <ProjectDeck ref={deckRef} />

    </main>
  );
}
