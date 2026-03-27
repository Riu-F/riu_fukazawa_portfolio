'use client';

/*
  HomePage — assembles the full page.
  • CursorCanvas        — cursor glow (no dot interaction)
  • DraggableStickyCard — draggable + hover-peel sticky note (top-right)
  • PhotoCard           — draggable stacked photo element (right, staggered)
  • TitleSection        — font cycling, cap-height normalisation, tagline
  • ProjectDeck         — rotating stacked deck below the hero
*/

import CursorCanvas        from './CursorCanvas';
import DraggableStickyCard from './DraggableStickyCard';
import PhotoCard           from './PhotoCard';
import TitleSection        from './TitleSection';
import ProjectDeck         from './ProjectDeck';

export default function HomePage() {
  return (
    <main className="page">
      <CursorCanvas />

      <section className="hero">

        {/* ── Photo card — right side, staggered above sticky ──────── */}
        <PhotoCard
          src="/images/riu_selfie.png"
          alt="Riu"
          rotation={3}
          style={{ top: '2.5rem', right: '16rem' }}
        />

        {/* ── Sticky: Todo — top-right (original position) ─────────── */}
        <DraggableStickyCard
          baseRot={2}
          peelRot={3.5}
          style={{ top: '5rem', right: '4.5rem', transform: 'rotate(2deg)' }}
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
      <ProjectDeck />

    </main>
  );
}
