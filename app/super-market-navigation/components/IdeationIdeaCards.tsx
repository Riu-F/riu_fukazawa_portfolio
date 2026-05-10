'use client';

import { useState } from 'react';

import { InsightTag, type CaseStudyInsight } from './InsightTag';

/**
 * Card sketch images — replace files in `public/super-market-navigation/ideation-ideas/` (same filenames).
 */
const IDEA_IMAGE_BASE = '/super-market-navigation/ideation-ideas';

const IDEAS: {
  key: string;
  title: string;
  imageSrc: string;
  description: string;
  insights: CaseStudyInsight[];
}[] = [
  {
    key: 'trolley',
    title: 'Sectioned Trolley',
    imageSrc: `${IDEA_IMAGE_BASE}/idea-trolley.png`,
    description:
      'A shopping trolley with built-in dividers to help shoppers visually separate planned purchases from impulse buys. Targeting the impulsive buying pain point by making unplanned items physically obvious.',
    insights: ['distraction'],
  },
  {
    key: 'signage',
    title: 'Accessible Signage',
    imageSrc: `${IDEA_IMAGE_BASE}/idea-signage.png`,
    description:
      'A rethought signage system combining readable text, iconography, braille, and colour-coded shelf markers. Grouped similar products more visibly and added aisle layout diagrams at the head of each aisle.',
    insights: ['navigation'],
  },
  {
    key: 'kiosk',
    title: 'Search Kiosk',
    imageSrc: `${IDEA_IMAGE_BASE}/idea-kiosk.png`,
    description:
      'A digital kiosk at the start of each aisle where users could search for products, get shelf-level directions (row 1, shelf 2), or call for staff assistance. Essentially a stationary version of what FoodHub does on your phone.',
    insights: ['navigation', 'communication'],
  },
];

export function IdeationIdeaCards() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="ideation-ideas">
      <div className="ideation-ideas__row">
        {IDEAS.map((idea) => {
          const isOpen = openKey === idea.key;
          return (
            <button
              key={idea.key}
              type="button"
              className={`ideation-ideas__card${isOpen ? ' ideation-ideas__card--active' : ''}`}
              aria-expanded={isOpen}
              onClick={() => setOpenKey(isOpen ? null : idea.key)}
            >
              <span className="ideation-ideas__thumb-wrap">
                <img
                  src={idea.imageSrc}
                  alt=""
                  width={220}
                  height={154}
                  className="ideation-ideas__thumb"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="ideation-ideas__card-heading">
                <span className="ideation-ideas__card-title">{idea.title}</span>
                <span className="ideation-ideas__card-tags">
                  {idea.insights.map((ins) => (
                    <InsightTag key={`${idea.key}-${ins}`} insight={ins} />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {openKey !== null && (
        <div className="ideation-ideas__expand" id={`ideation-detail-${openKey}`} role="region">
          {(() => {
            const idea = IDEAS.find((i) => i.key === openKey)!;
            return (
              <>
                <img
                  src={idea.imageSrc}
                  alt={idea.title}
                  className="ideation-ideas__expand-img"
                  loading="lazy"
                  decoding="async"
                />
                <p className="ideation-ideas__expand-text paragraph-new">{idea.description}</p>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
