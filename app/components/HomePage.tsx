'use client';

/*
  HomePage — assembles the full page.
  • CursorCanvas        — cursor glow, shadow excluded from ProjectDeck area
  • DraggableStickyCard — draggable + hover-peel sticky note (random right-side position)
  • PhotoCard           — draggable stacked photo (random right-side position)
  • TitleSection        — font cycling, cap-height normalisation, tagline
  • ProjectDeck         — rotating stacked deck below the hero
*/

import { useState, useEffect, useLayoutEffect, useRef }  from 'react';
import CursorCanvas        from './CursorCanvas';
import DraggableStickyCard from './DraggableStickyCard';
import PhotoCard           from './PhotoCard';
import TitleSection        from './TitleSection';
import ProjectDeck         from './ProjectDeck';
import DeskSection         from './DeskSection';
import SiteFooter          from './SiteFooter';
import AiNav               from '../ai-project/components/AiNav';

const INTRO_STORAGE_KEY = 'homeIntroPlayed';

type IntroPhase = 'pending' | 'loading' | 'ready' | 'skip';

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

  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {
    if (typeof window === 'undefined') return 'pending';
    return sessionStorage.getItem(INTRO_STORAGE_KEY) === '1' ? 'skip' : 'loading';
  });
  const [seedFlywheel, setSeedFlywheel] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1';
  });

  useLayoutEffect(() => {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY) === '1') return;

    document.body.classList.add('home-intro-active', 'page--intro-loading');

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIntroPhase('ready');
        document.body.classList.remove('page--intro-loading');
        document.body.classList.add('page--intro-ready');
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      document.body.classList.remove(
        'home-intro-active',
        'page--intro-loading',
        'page--intro-ready',
      );
    };
  }, []);

  useEffect(() => {
    const vw     = window.innerWidth;
    const mobile = vw < 640;
    const rand   = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    if (mobile) {
      /* Photo position is handled in CSS (flex-centred in hero); sticky is hidden on mobile. */
      setFloatPos({
        photo:  {},
        sticky: {},
      });
    } else {
      const photoW   = 200;
      const stickyW  = 200;
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

  const deckRef = useRef<HTMLDivElement>(null);

  const introReveal = introPhase === 'loading' || introPhase === 'ready';
  const pageClass   = [
    'page',
    introPhase === 'loading' && 'page--intro-loading',
    introPhase === 'ready'   && 'page--intro-ready',
  ].filter(Boolean).join(' ');

  return (
    <main className={pageClass}>
      <AiNav current="home" />
      <CursorCanvas excludeRef={deckRef} />

      <section className="hero">

        <div
          className="home-intro-float home-intro-float--photo hero__photo-zone"
          style={floatPos?.photo ?? { position: 'absolute', top: '2.5rem', right: '16rem' }}
        >
          <PhotoCard
            src="/images/riu_selfie.png"
            alt="Riu"
            rotation={3}
            style={{ position: 'relative', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
          />
        </div>

        <div
          className="home-intro-float home-intro-float--sticky"
          style={floatPos?.sticky ?? { position: 'absolute', top: '5rem', right: '4.5rem' }}
        >
          <DraggableStickyCard
            baseRot={2}
            peelRot={3.5}
            style={{ position: 'relative', top: 'auto', right: 'auto', left: 'auto', transform: 'rotate(2deg)' }}
          >
            <div className="sticky-card__title">riu&apos;s to do:</div>
            <div className="sticky-card__item">
              <span className="sticky-card__checkbox">✓</span>
              <span>graduate</span>
            </div>
            <div className="sticky-card__item">
              <span className="sticky-card__checkbox">✓</span>
              <span>build a portfolio</span>
            </div>
            <hr className="sticky-card__divider" />
            <div className="sticky-card__status">👀 open to work</div>
          </DraggableStickyCard>
        </div>

        <TitleSection seedFlywheelOnMount={seedFlywheel} />

      </section>

      <ProjectDeck ref={deckRef} introReveal={introReveal} />

      <DeskSection />

      <SiteFooter variant="dark" />

    </main>
  );
}
