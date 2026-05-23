'use client';

/*
  Static flank phone for the FoodHub deck card fan-out.
  Reuses DeckFoodHubMini frame classes — no iframe, no DeckFoodHubMini internals.
*/

export const FH_FLANK_SCREENSHOTS = {
  left:  '/super-market-navigation/hero/1.png',
  right: '/super-market-navigation/hero/2.png',
} as const;

type Props = {
  imageSrc: string;
  imageAlt?: string;
  className?: string;
};

export default function DeckFoodHubFlankPhone({
  imageSrc,
  imageAlt = '',
  className = '',
}: Props) {
  return (
    <div className={className} aria-hidden="true">
      <div className="deck-fh-flank-phone">
        <div className="deck-foodhub-mini__frame deck-fh-flank-phone__frame">
          <div className="deck-foodhub-mini__bezel">
            <div className="deck-foodhub-mini__island" />
            <div className="deck-foodhub-mini__screen deck-fh-flank-phone__screen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="deck-fh-flank-phone__shot"
                src={imageSrc}
                alt={imageAlt}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
