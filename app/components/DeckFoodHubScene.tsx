'use client';

import { useRef } from 'react';
import DeckFoodHubMini from './DeckFoodHubMini';
import DeckFoodHubFlankPhone, { FH_FLANK_SCREENSHOTS } from './DeckFoodHubFlankPhone';

/* CardPanel `show` already waits for the 440ms reorder — no extra delay here. */
const FH_ANIM_DELAY = '0.05s';

/** Gentle floor-map curve — coordinates match viewBox below. */
const FH_ROUTE_D =
  'M 18 228 C 52 198, 78 178, 102 152 S 148 98, 168 72 S 186 44, 178 28';

type DeckFoodHubSceneProps = {
  /** Gated by deck in-view + card front (set in ProjectDeck / CardPanel). */
  active?: boolean;
  compact?: boolean;
};

export default function DeckFoodHubScene({
  active = false,
  compact = false,
}: DeckFoodHubSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isActive = active;

  const sceneClass = [
    'deck-foodhub-scene',
    compact && 'deck-foodhub-scene--compact',
    isActive && 'deck-foodhub-scene--active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootRef}
      className={sceneClass}
      style={{ ['--fh-anim-delay' as string]: FH_ANIM_DELAY }}
    >
      {/* B — subtle aisle path (right panel only, thin stroke) */}
      <div className="deck-fh-route-wrap" aria-hidden="true">
        <svg
          className="deck-fh-route"
          viewBox="0 0 200 260"
          preserveAspectRatio="xMidYMid meet"
        >
          <path className="deck-fh-route__path" d={FH_ROUTE_D} />
        </svg>
      </div>

      {/* C — radial glow behind phones */}
      <div className="deck-fh-glow" aria-hidden="true" />

      {/* A — phone stage: flanks + main demo */}
      <div className="deck-fh-stage">
        <DeckFoodHubFlankPhone
          imageSrc={FH_FLANK_SCREENSHOTS.left}
          imageAlt="FoodHub store map screen"
          className="deck-fh-flank deck-fh-flank--left"
        />
        <DeckFoodHubFlankPhone
          imageSrc={FH_FLANK_SCREENSHOTS.right}
          imageAlt="FoodHub aisle navigation screen"
          className="deck-fh-flank deck-fh-flank--right"
        />
        <div className="deck-fh-main">
          <DeckFoodHubMini compact={compact} />
        </div>
      </div>
    </div>
  );
}
