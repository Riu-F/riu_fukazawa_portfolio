'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InsightTag, type CaseStudyInsight } from './InsightTag';

const INTERVAL_MS = 5000;

type HeroFeatureCard = {
  id: string;
  title: string;
  insight: CaseStudyInsight;
  body: string;
};

const CARDS: HeroFeatureCard[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    insight: 'navigation',
    body:
      '70% of our research participants, disabled and non-disabled, said their biggest challenge in supermarkets was simply finding things. FoodHub generates an interactive map that guides users item-by-item through the store, so they always know where they are and where they\'re going next.',
  },
  {
    id: 'assistance',
    title: 'Assistance',
    insight: 'communication',
    body:
      'Most in-store help requests (70 to 80%) are just asking where something is. FoodHub handles that before you ever need to talk to anyone, narrowing location by shelf and row, then offering image-based search, and only escalating to staff as a last resort.',
  },
  {
    id: 'overload',
    title: 'Cognitive overload reduction',
    insight: 'distraction',
    body:
      'The app plans the entire shopping journey upfront, a structured route that reduces decision-making, limits distractions, and keeps users focused on what they came for. For autistic users, that means less sensory overload. For users with ADHD, fewer opportunities to lose the thread.',
  },
];

function CardInner({ card }: { card: HeroFeatureCard }) {
  return (
    <>
      <h3 className="smp-foodhub-hero__fcard-title">{card.title}</h3>
      <div className="smp-foodhub-hero__fcard-tag">
        <InsightTag insight={card.insight} />
      </div>
      <p className="paragraph-new smp-foodhub-hero__fcard-body">{card.body}</p>
    </>
  );
}

export function FoodHubHeroFeatureCarousel() {
  const [active, setActive] = useState(0);
  const [minHeight, setMinHeight] = useState(300);
  const measureRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % CARDS.length);
    }, INTERVAL_MS);
  }, [clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer]);

  const goTo = useCallback(
    (index: number) => {
      setActive(index % CARDS.length);
      startTimer();
    },
    [startTimer],
  );

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % CARDS.length);
    startTimer();
  }, [startTimer]);

  const measureHeights = useCallback(() => {
    const root = measureRef.current;
    if (!root) return;
    let max = 0;
    for (const child of Array.from(root.children)) {
      max = Math.max(max, (child as HTMLElement).offsetHeight);
    }
    if (max > 0) {
      setMinHeight(Math.ceil(max));
    }
  }, []);

  useLayoutEffect(() => {
    measureHeights();
    const root = measureRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => measureHeights());
    ro.observe(root);
    window.addEventListener('resize', measureHeights);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureHeights);
    };
  }, [measureHeights]);

  return (
    <div className="smp-foodhub-hero__carousel">
      <div ref={measureRef} className="smp-foodhub-hero__carousel-measure" aria-hidden="true">
        {CARDS.map((card) => (
          <article
            key={`m-${card.id}`}
            className={`smp-foodhub-hero__fcard smp-foodhub-hero__fcard--${card.insight}`}
            data-card-insight={card.insight}
          >
            <CardInner card={card} />
          </article>
        ))}
      </div>

      <div className="smp-foodhub-hero__carousel-viewport" style={{ minHeight: `${minHeight}px` }}>
        <div
          className="smp-foodhub-hero__carousel-track"
          role="region"
          aria-roledescription="carousel"
          aria-label="FoodHub feature highlights"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.id}
              className={`smp-foodhub-hero__fcard smp-foodhub-hero__fcard--${card.insight} smp-foodhub-hero__fcard-panel${
                i === active ? ' is-active' : ''
              }`}
              data-card-insight={card.insight}
              aria-hidden={i !== active}
              onClick={advance}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  advance();
                }
              }}
              role="group"
              aria-label={`${card.title}. Card ${i + 1} of ${CARDS.length}. Click for next.`}
              tabIndex={i === active ? 0 : -1}
            >
              <CardInner card={card} />
            </article>
          ))}
        </div>
      </div>

      <div className="smp-foodhub-hero__carousel-dots" role="tablist" aria-label="Feature card">
        {CARDS.map((card, i) => (
          <button
            key={card.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${card.title}`}
            className={`smp-foodhub-hero__carousel-dot${i === active ? ' is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
