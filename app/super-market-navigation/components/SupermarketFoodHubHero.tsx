'use client';

import { useCallback, useEffect, useState } from 'react';
import { FoodHubHeroFeatureCarousel } from './FoodHubHeroFeatureCarousel';

const FOODHUB_EMBED_SRC = '/super-market-navigation/foodhub/index.html';

export default function SupermarketFoodHubHero() {
  const [showTapHint, setShowTapHint] = useState(true);

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'foodhub-interaction') {
      setShowTapHint(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  return (
    <section className="smp-foodhub-hero" aria-label="FoodHub interactive demo">
      <div className="default-container w-container">
        <div className="smp-foodhub-hero__grid">
          <div className="smp-foodhub-hero__copy">
            <h1 className="h1 smp-foodhub-hero__title">Try FoodHub</h1>
            <p className="smp-foodhub-hero__subtitle">
              A navigation-first shopping assistant for cognitively accessible supermarket experiences.
            </p>
            <p className="paragraph-new smp-foodhub-hero__desc">
              This is a fully interactive prototype. Add items to your list, start a shop, and navigate
              through the store. Built as a proof of concept after the university project using Claude Code
              and Cursor AI.
            </p>
            <FoodHubHeroFeatureCarousel />
          </div>

          <div
            className={`smp-foodhub-hero__device${showTapHint ? ' smp-foodhub-hero__device--hint' : ''}`}
          >
            <div className="smp-foodhub-hero__device-stack">
              <div className="smp-foodhub-frame">
                <div className="smp-foodhub-frame__bezel">
                  <div className="smp-foodhub-frame__island" aria-hidden="true" />
                  <div className="smp-foodhub-frame__screen">
                  <iframe
                    className="smp-foodhub-frame__iframe"
                    src={FOODHUB_EMBED_SRC}
                    title="FoodHub — interactive supermarket navigation prototype"
                    width={390}
                    height={720}
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  </div>
                </div>
              </div>
              {showTapHint ? (
                <p className="smp-foodhub-hero__hint smp-foodhub-hero__hint--device" aria-live="polite">
                  <span className="smp-foodhub-hero__hint-icon" aria-hidden="true">
                    👆
                  </span>
                  Tap to interact
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
