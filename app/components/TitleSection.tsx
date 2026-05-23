'use client';

/*
  TitleSection
  ────────────
  Owns:
  • cap-height normalised font sizing
  • flywheel scroll → font cycling
  • tagline text cycling (in sync with font index)

  The title renders as plain text — no custom "i" treatment.
*/

import { useState, useEffect, useRef, useCallback } from 'react';
import { TAGLINES } from '../lib/titleData';
import CyclingWordmark from './CyclingWordmark';

type TitleSectionProps = {
  seedFlywheelOnMount?: boolean;
};

export default function TitleSection({ seedFlywheelOnMount = false }: TitleSectionProps) {
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const onIndexChange = useCallback((idx: number) => {
    if (taglineRef.current) {
      taglineRef.current.textContent = TAGLINES[idx % TAGLINES.length];
    }
  }, []);

  /*
    Mobile: render a completely different DOM structure so the layout is
    tagline → hello-intro → rotated wordmark, with no CSS `order` tricks.

    The fragment dissolves — its two children become direct flex children
    of .hero, which on mobile is a flex column filling 100svh.

    Desktop: hello-intro → title → tagline in hero_bottom (unchanged).
  */
  if (isMobile) {
    return (
      <>
        {/* Top text block: subtitle first, then "Hello, I'm" */}
        <div className="hero_mobile_text">
          <p className="tagline hero-intro-fade" ref={taglineRef}>{TAGLINES[0]}</p>
          <p className="hello-intro hero-intro-fade">Hello, I&rsquo;m</p>
        </div>

        {/* Wordmark: "Riu" rotated 90° as a single sideways wordmark */}
        <div className="hero_mobile_wordmark_wrap">
          <CyclingWordmark
            onIndexChange={onIndexChange}
            seedFlywheelOnMount={seedFlywheelOnMount}
          />
        </div>
      </>
    );
  }

  return (
    <div className="hero_bottom">
      <p className="hello-intro hero-intro-fade">Hello, I&rsquo;m</p>

      {/* Plain text — no custom letter decomposition */}
      <CyclingWordmark
        onIndexChange={onIndexChange}
        seedFlywheelOnMount={seedFlywheelOnMount}
      />

      {/* white-space: pre-line in CSS makes \n a visible line break */}
      <p className="tagline hero-intro-fade" ref={taglineRef}>
        {TAGLINES[0]}
      </p>
    </div>
  );
}
