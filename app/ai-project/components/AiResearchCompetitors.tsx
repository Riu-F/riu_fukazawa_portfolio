'use client';

import { useState } from 'react';
import {
  EXISTING_SOLUTIONS_CONTENT,
  EXISTING_SOLUTIONS_ROWS,
  RESEARCH_MIND_MAP_IMAGE,
} from '../content/aiProblemSection5Archive';
import {
  CompetitorTablePair,
  DIVERGE_ROWS,
  DIVERGE_ROWS_COMPACT,
  DO_WELL_ROWS,
  DO_WELL_ROWS_COMPACT,
} from './ai-competitor-tables';
import { AiInsightTag, type AiInsightPrinciple } from './AiInsightTag';

const PLATFORM_CARDS = [
  {
    name: 'Booking.com',
    positioning: 'Deep search personalisation, but purely transactional after booking.',
    strengths: [
      'Deep filtering and deal surfacing',
      'Behaviour-based recommendations',
      'Aggressive dynamic pricing',
    ],
    gaps: [
      'Static confirmation pages',
      'AI only surfaced as a help bot',
      'Purely functional, conversion-focused tone',
    ],
  },
  {
    name: 'Airbnb',
    positioning: 'Human touch through hosts, but no embedded AI layer.',
    strengths: [
      'Learns from past trips and saved stays',
      'Sometimes human tone via host messaging',
      'Story-driven, manual personalisation',
    ],
    gaps: [
      'Host-led info only after booking',
      'No embedded AI layer',
      'Data siloed per listing, inconsistent',
    ],
  },
  {
    name: 'Google Travel',
    positioning: 'Strong ecosystem data, but instrumental tone and no tailored guidance.',
    strengths: [
      'Maps, Gmail, Flights integration',
      'Aggregated search with smart sorting',
      'Contextual help content surfacing',
    ],
    gaps: [
      'Itinerary view, not tailored guidance',
      'AI summaries still separate from content',
      'Instrumental, ad-driven tone',
    ],
  },
  {
    name: 'Expedia',
    positioning: 'Cross-brand data sharing, but generic confirmation and deal-first language.',
    strengths: [
      'Shared data across Expedia brands',
      'Loyalty and history-based deal pushing',
      'Broad filtering across products',
    ],
    gaps: [
      'Generic confirmation plus loyalty copy',
      'Interruptive AI prompts, not woven in',
      'Corporate, deal-first language',
    ],
  },
] as const;

const RESEARCH_INSIGHTS_DISPLAY = [
  {
    title: "There's more than enough data already.",
    body: "The issue isn't data scarcity, it's dormant data. Travel companies already hold rich contextual information, but almost none of it gets activated after purchase.",
  },
  {
    title: 'Personalisation follows the transaction, not the experience arc.',
    body: 'Data is heavily used to optimise search, sort, and pricing, but barely used to shape the emotional arc of the journey once the booking is confirmed.',
  },
  {
    title: 'Post-purchase touchpoints are treated as admin, not experience moments.',
    body: 'Confirmation screens, emails, and reminders are designed for verification, not value.',
  },
] as const;

const DESIGN_INSIGHTS: {
  principle: AiInsightPrinciple;
  title: string;
  body: string;
}[] = [
  {
    principle: 'invisible-ai',
    title: 'Invisible AI is stronger than visible AI.',
    body: "AI shouldn't always be a chatbot or a button. It can quietly shape what the page says and shows, based on who's looking at it.",
  },
  {
    principle: 'post-purchase',
    title: 'Post-purchase is prime real estate.',
    body: "The confirmation and pre-trip moments are emotionally loaded and under-designed. They're the best place to reinvest personalisation.",
  },
  {
    principle: 'activate-data',
    title: "Activate existing data, don't collect more.",
    body: "The opportunity isn't new data pipelines. It's using what platforms already know (age, trip purpose, destination, timing, group type) to generate context-aware content at scale.",
  },
];

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion_1_component aip-rc__accordion">
      <button
        type="button"
        className="accordion_toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="span u-text-style-h5">{label}</span>
        <div
          className="accordion_1_toggle_icon"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ChevronDown />
        </div>
      </button>
      <div
        className="accordion_1_content"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="accordion_1_body">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PlatformList({
  items,
  variant,
}: {
  items: readonly string[];
  variant: 'strength' | 'gap';
}) {
  return (
    <ul className="aip-rc__platform-list" role="list">
      {items.map((item) => (
        <li key={item} className="aip-rc__platform-list-item">
          <span className={`aip-rc__marker aip-rc__marker--${variant}`} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AiResearchCompetitors() {
  return (
    <section id="section--research" className="default-section aip-rc">
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">Research</span>
        </div>

        <h2 className="h2">What exists and what&rsquo;s missing</h2>

        <p className="paragraph-new width-limit">
          With a 7-week timeline, there wasn&rsquo;t space for extensive primary research. Instead, I
          mapped the data travel platforms already hold and analysed how they use it, or don&rsquo;t.
        </p>
        <p className="paragraph-new width-limit aip-rc__intro-end">
          The finding was clear: the issue isn&rsquo;t data scarcity, it&rsquo;s dormant data. Travel
          companies already have rich contextual information about every booking, but almost none of
          it gets activated after purchase. It&rsquo;s used heavily for search, sort, and pricing. Then
          it stops.
        </p>

        <Accordion label="Research: the data landscape.">
          <p className="paragraph-new">
            To understand what&rsquo;s available, I mapped the Travel Data Ecosystem, a visual breakdown
            of the user information already sitting inside most booking platforms: identity data, trip
            context, behavioural signals, partner integrations, preferences, and inferred insights.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RESEARCH_MIND_MAP_IMAGE}
            loading="lazy"
            alt="Travel Data Ecosystem mind map"
            className="aip-rc__mindmap"
          />
          <p className="aip-rc__caption">
            Travel Data Ecosystem diagram: mapping the data travel platforms already hold.
          </p>
          <ul className="aip-rc__insights" role="list">
            {RESEARCH_INSIGHTS_DISPLAY.map((item) => (
              <li key={item.title} className="aip-rc__insight">
                <strong className="aip-rc__insight-title">{item.title}</strong>
                <span className="aip-rc__insight-body">{item.body}</span>
              </li>
            ))}
          </ul>
        </Accordion>

        <div id="section--competitors" className="aip-rc__competitors-block">
          <h3 className="aip-rc__subheading">Competitor Analysis</h3>

          <div className="aip-rc__platform-grid" role="list">
            {PLATFORM_CARDS.map((platform) => (
              <article key={platform.name} className="aip-rc__platform-card" role="listitem">
                <h4 className="aip-rc__platform-name">{platform.name}</h4>
                <p className="aip-rc__platform-positioning">{platform.positioning}</p>
                <div className="aip-rc__platform-divider" aria-hidden />
                <p className="aip-rc__platform-list-label">Strengths</p>
                <PlatformList items={platform.strengths} variant="strength" />
                <p className="aip-rc__platform-list-label">Gaps</p>
                <PlatformList items={platform.gaps} variant="gap" />
              </article>
            ))}
          </div>
        </div>

        <Accordion label="Full competitor breakdown.">
          <div className="aip-rc__table-block">
            <h4 className="aip-rc__table-heading">What They Already Do Well</h4>
            <CompetitorTablePair rows={DO_WELL_ROWS} rowsCompact={DO_WELL_ROWS_COMPACT} />
          </div>

          <div className="aip-rc__table-block">
            <h4 className="aip-rc__table-heading">Where My Concept Diverges</h4>
            <CompetitorTablePair rows={DIVERGE_ROWS} rowsCompact={DIVERGE_ROWS_COMPACT} />
          </div>

          <div className="aip-rc__table-block">
            <h4 className="aip-rc__table-heading">Existing solution patterns</h4>
            <p className="paragraph-new">{EXISTING_SOLUTIONS_CONTENT.intro}</p>
            <div className="aip-rc__table-scroll">
              <div className="aip-rc__solutions-table" role="table">
                <div className="aip-rc__solutions-row aip-rc__solutions-row--head" role="row">
                  <div className="aip-rc__solutions-cell" role="columnheader">Solution Type</div>
                  <div className="aip-rc__solutions-cell" role="columnheader">What It Does Well</div>
                  <div className="aip-rc__solutions-cell" role="columnheader">Where It Falls Short</div>
                </div>
                {EXISTING_SOLUTIONS_ROWS.map((row, i) => (
                  <div
                    key={row.type}
                    className={`aip-rc__solutions-row${i % 2 === 1 ? ' aip-rc__solutions-row--alt' : ''}`}
                    role="row"
                  >
                    <div className="aip-rc__solutions-cell aip-rc__solutions-cell--type" role="cell">
                      <strong>{row.type}</strong>
                    </div>
                    <div className="aip-rc__solutions-cell" role="cell">{row.doesWell}</div>
                    <div className="aip-rc__solutions-cell" role="cell">{row.fallsShort}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Accordion>

        <h3 className="aip-rc__subheading aip-rc__subheading--insights">Core Design Insights</h3>
        <ul className="aip-rc__insight-cards" role="list">
          {DESIGN_INSIGHTS.map((item) => (
            <li key={item.principle} className="aip-rc__insight-card">
              <AiInsightTag principle={item.principle} />
              <h4 className="aip-rc__insight-card-title">{item.title}</h4>
              <p className="aip-rc__insight-card-desc">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="paragraph-new width-limit aip-rc__closing">
          This gap is exactly where this project sits: using AI to personalise the moments after
          purchase. The confirmation, the lead-up, and the support no platform currently designs for.
        </p>
      </div>
    </section>
  );
}
