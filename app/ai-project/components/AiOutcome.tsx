'use client';

import { useState } from 'react';
import { AiInsightTag, type AiInsightPrinciple } from './AiInsightTag';

type FindingStatus = 'pass' | 'partial' | 'fail';

type Finding = {
  title: string;
  description: string;
  status: FindingStatus;
};

type PersonaEvaluation = {
  title: string;
  tags: AiInsightPrinciple[];
  summary: string;
  jsonData: Record<string, string>;
  findings: Finding[];
};

const VERDICT_ROWS = [
  {
    persona: 'Dewi',
    profile: 'Family, first overseas trip, Jakarta → Tokyo, December',
    test: 'Does it provide family logistics, visa guidance, winter prep, and cultural food comfort?',
    verdict: 'strong' as const,
    verdictText: 'Strong pass. Visa info, kid-specific transport, halal dining, and winter clothing all addressed.',
  },
  {
    persona: 'Jordan',
    profile: 'Solo photographer, frequent traveller, Sydney → Kyoto, April',
    test: 'Does it skip beginner guidance and provide insider cultural picks and efficient logistics?',
    verdict: 'partial' as const,
    verdictText:
      'Partial pass. Strong on cultural curation, but includes some basic info a frequent traveller wouldn\u2019t need.',
  },
  {
    persona: 'Harold & Margaret',
    profile: 'Retired couple, comfort-first, Melbourne → Paris, September',
    test: 'Does it prioritise accessibility, comfort, guided experiences, and avoid tech complexity?',
    verdict: 'strong' as const,
    verdictText:
      'Strong pass. Comfort transport, timed entries, calm tone. Some accessibility detail could go deeper.',
  },
];

const PERSONAS: PersonaEvaluation[] = [
  {
    title: 'Dewi — Family first-time traveller',
    tags: ['post-purchase', 'invisible-ai'],
    summary:
      'Dewi is a 36-year-old primary school teacher from Jakarta taking her first overseas trip with her husband and two young kids to Tokyo. She values clarity, reassurance, and practical, family-oriented advice for her December winter holiday.',
    jsonData: {
      'User Identity': 'Dewi Santoso',
      'Trip Info': 'Tokyo, Japan — from Jakarta, Indonesia — December — 7 nights (Dec 20–27)',
      'Demographics': '36 — Primary school teacher — Leisure',
      'Experience Level': 'First overseas trip',
      'Interests': 'Theme parks, easy sightseeing, local mild food, shopping malls',
      'Preferences': 'Moderate — guided, family-friendly, simple planning',
      'Companions': 'Family of four (two young children)',
    },
    findings: [
      {
        title: 'Visa info',
        status: 'pass',
        description:
          'Explicitly calls out Indonesian visa requirements and Visit Japan Web; this directly targets her passport and first-time status.',
      },
      {
        title: 'Family logistics',
        status: 'pass',
        description:
          'Mentions Airport Limousine Bus as easiest with kids, and child IC cards with half fares — a strong family calibration.',
      },
      {
        title: 'Winter prep',
        status: 'pass',
        description:
          'Gives exact temps, sunset time, and layered clothing guidance; fully aligned with "tropical to winter" experience gap.',
      },
      {
        title: 'Food comfort',
        status: 'pass',
        description:
          'Suggests mild spice staples (ramen, curry, tempura, gyoza) and adds Halal Gourmet Japan; a comfort and familiar recommendation.',
      },
      {
        title: 'Connectivity',
        status: 'pass',
        description:
          'Covers eSIM/pocket Wi-Fi, Type A/100V, and recommends comprehensive travel insurance — all high-utility and persona-specific.',
      },
      {
        title: 'No generic top-10s',
        status: 'pass',
        description:
          'No unnecessary noise info appears, such as JR Pass, nightlife, coworking, deep dives. Scope discipline is good and keeps cognitive load low.',
      },
      {
        title: 'Reassuring and structured tone',
        status: 'pass',
        description:
          'Reads like a calm checklist for nervous parents, not exciting hype — exactly what parents need.',
      },
    ],
  },
  {
    title: 'Jordan — Independent solo explorer',
    tags: ['invisible-ai'],
    summary:
      'Jordan is a 28-year-old UX designer from Sydney spending 12 days in Kyoto in April. A confident and frequent traveller, Jordan values insider knowledge, aesthetic experiences, and efficient logistics over beginner guidance.',
    jsonData: {
      'User Identity': 'Jordan Lee',
      'Trip Info': 'Kyoto, Japan — from Sydney, Australia — April — 12 nights',
      'Demographics': '28 — UX designer — Leisure / Cultural exploration',
      'Experience Level': 'Frequent traveller',
      'Interests': 'Local art, design, architecture, coffee culture, photography, historical walks',
      'Preferences': 'Independent — mid-to-high budget, flexible schedule',
      'Companions': 'Solo traveller',
    },
    findings: [
      {
        title: 'Insider picks',
        status: 'pass',
        description:
          'Delivers Ando, Miho Museum, KYOCERA, MoMAK, specific coffee spots; strong alignment with design/UX/photography angle.',
      },
      {
        title: 'Seasonal timing for April',
        status: 'pass',
        description:
          'Calls out April conditions, tail-end blossoms, blue hour/sunrise slots; clearly tuned to timing + photography.',
      },
      {
        title: 'Streamlined itinerary logic',
        status: 'partial',
        description:
          'Smart plan (linking close neighbourhoods and early starts for busy attractions), close but could be more planned and precise.',
      },
      {
        title: 'Advanced tips and information',
        status: 'partial',
        description:
          'Covers crowd timing, restrictions, reservations; but is missing deeper hacks, so it\u2019s solid but not maxed-out for seasoned travellers.',
      },
      {
        title: 'Few but high-value insights',
        status: 'partial',
        description:
          'Strong curation on spots and timing, but space is spent on things Jordan likely knows already, so some optimisation is needed.',
      },
      {
        title: 'Prioritises discovery, not reassurance',
        status: 'partial',
        description:
          'Good on discovery, but reassurance/logistics creep in — the program is caught between "experienced" and "semi-new". It only partially trusts Jordan.',
      },
      {
        title: 'Unnecessary beginner logistics',
        status: 'fail',
        description:
          'Includes airport train vs bus breakdown, Visit Japan Web, IC card setup, ATM advice — too much onboarding for a "frequent" traveller; this dilutes the persona fit.',
      },
      {
        title: 'No generic top-10s',
        status: 'pass',
        description: 'No kid fluff, no shallow top-10 spam; recommendations are curated and on-theme.',
      },
    ],
  },
  {
    title: 'Harold & Margaret — Comfort-first retired couple',
    tags: ['post-purchase'],
    summary:
      'Harold (68) and Margaret (65) are retired teachers from Melbourne revisiting Europe for the first time in 15 years. They\u2019re travelling to Paris for nine nights in September and want comfort, safety, and guided experiences without tech complexity.',
    jsonData: {
      'User Identity': 'Harold & Margaret Thompson',
      'Trip Info': 'Paris, France — from Melbourne, Australia — September — 9 nights',
      'Demographics': '68 & 65 — Retired teachers — Leisure / Cultural discovery',
      'Experience Level': 'Moderate (Europe once, 15 years ago)',
      'Interests': 'Art museums, walking tours, French cuisine, gardens, scenic viewpoints',
      'Preferences': 'Luxury — guided, minimal digital tools',
      'Companions': 'Couple',
    },
    findings: [
      {
        title: 'Simplest arrival plan',
        status: 'pass',
        description: 'Effective: pushes official taxis, de-prioritises train for comfort.',
      },
      {
        title: 'Connectivity and payment',
        status: 'pass',
        description:
          'Basic and reassuring. Simple explanation of tipping, cards, cash, adaptors, and travel eSIM; accessible and calm.',
      },
      {
        title: 'Comfort',
        status: 'pass',
        description:
          'Emphasis on car over train, jet lag easing, mild walking, queues avoided — strong comfort logic.',
      },
      {
        title: 'Activities and rest',
        status: 'partial',
        description:
          'Timed entries and museum closures are covered, but guided tours and explicit rest breaks are implied rather than clearly recommended.',
      },
      {
        title: 'Accessibility cues',
        status: 'partial',
        description:
          'Covers accessibility for public transport, but lacks detailed accessibility cues for each activity/location.',
      },
      {
        title: 'Omit unnecessary',
        status: 'pass',
        description: 'No nightlife, no budget gaming, no app maze; tone stays age-appropriate.',
      },
      {
        title: 'Calm, trust-building tone',
        status: 'pass',
        description: 'Language is steady, direct, and respectful.',
      },
    ],
  },
];

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

function Accordion({
  label,
  children,
  className = '',
  labelExtra,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelExtra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordion_1_component ${className}`.trim()}>
      <button
        type="button"
        className="accordion_toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="aip-outcome__accordion-label-wrap">
          <span className="span u-text-style-h5">{label}</span>
          {labelExtra}
        </span>
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

function FindingList({ findings }: { findings: Finding[] }) {
  return (
    <ul className="aip-outcome__findings" role="list">
      {findings.map((item) => (
        <li key={item.title} className={`aip-outcome__finding aip-outcome__finding--${item.status}`}>
          <span className="aip-outcome__finding-marker" aria-hidden />
          <div className="aip-outcome__finding-body">
            <strong className="aip-outcome__finding-title">{item.title}</strong>
            <p className="aip-outcome__finding-desc">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PersonaPanel({ persona }: { persona: PersonaEvaluation }) {
  return (
    <>
      <p className="paragraph-new aip-outcome__persona-summary">{persona.summary}</p>
      <Accordion label="Input data (JSON)" className="aip-outcome__json-accordion">
        <pre className="code-block aip-outcome__code">
          <code>{JSON.stringify(persona.jsonData, null, 2)}</code>
        </pre>
      </Accordion>
      <FindingList findings={persona.findings} />
    </>
  );
}

export default function AiOutcome() {
  return (
    <section
      id="section--effectiveness-evaluation"
      className="default-section aip-outcome"
    >
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">Evaluation</span>
        </div>

        <h2 className="h2">Does it actually personalise?</h2>

        <p className="paragraph-new width-limit">
          The biggest question for this project: is the system generating genuinely personalised
          content, or just generic travel copy with names swapped in?
        </p>
        <p className="paragraph-new width-limit aip-outcome__intro-end">
          To test this, I created persona checklists. For each test traveller, I outlined what I
          expected to see and what should be absent, based on their specific background, experience
          level, and trip context. Then I compared the AI output against those criteria. This turned
          subjective impressions into something observable and repeatable.
        </p>

        <div className="aip-outcome__verdict-scroll">
          <table className="aip-outcome__verdict-table">
            <thead>
              <tr>
                <th scope="col">Persona</th>
                <th scope="col">Profile</th>
                <th scope="col">Key test</th>
                <th scope="col">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {VERDICT_ROWS.map((row) => (
                <tr key={row.persona}>
                  <td data-label="Persona">
                    <strong>{row.persona}</strong>
                  </td>
                  <td data-label="Profile" className="aip-outcome__verdict-profile">
                    {row.profile}
                  </td>
                  <td data-label="Key test">{row.test}</td>
                  <td data-label="Verdict">
                    <span className={`aip-outcome__verdict aip-outcome__verdict--${row.verdict}`}>
                      {row.verdict === 'strong' ? '✅ ' : '✴️ '}
                      {row.verdictText}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="aip-outcome__personas">
          {PERSONAS.map((persona) => (
            <Accordion
              key={persona.title}
              label={persona.title}
              className="aip-outcome__persona-accordion"
              labelExtra={
                <span className="ai-insight-tag-group aip-outcome__persona-tags">
                  {persona.tags.map((tag) => (
                    <AiInsightTag key={tag} principle={tag} />
                  ))}
                </span>
              }
            >
              <PersonaPanel persona={persona} />
            </Accordion>
          ))}
        </div>

        <h3 className="aip-outcome__summary-heading">Summary</h3>
        <p className="paragraph-new width-limit">
          Across all three personas, the system demonstrates credible personalisation range. Dewi
          gets guided reassurance and family logistics. Jordan gets insider cultural picks with
          minimal hand-holding. Harold and Margaret get comfort-first planning with accessibility
          awareness. The system clearly adapts tone, content priority, and level of detail based on
          who&rsquo;s travelling.
        </p>
        <p className="paragraph-new width-limit aip-outcome__closing">
          Where it falls short: some outputs include information the persona likely already knows
          (giving a frequent traveller basic airport transfer advice), and deeper accessibility cues
          are implied rather than made explicit. These are refinement issues, not conceptual failures.
          The core personalisation works. Future iterations should sharpen the model&rsquo;s ability
          to omit what experienced travellers don&rsquo;t need and deepen contextual sensitivity for
          accessibility requirements.
        </p>
      </div>
    </section>
  );
}
