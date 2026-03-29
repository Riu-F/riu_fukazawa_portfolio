'use client';

import { useState, useEffect, useRef } from 'react';

function PersonaBentoBox({
  title, teaser, persona, jsonData, outputHref, isOpen, onToggle,
}: {
  title: string;
  teaser: string;
  persona: string;
  jsonData: Record<string, string>;
  outputHref: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bento-box${isOpen ? ' expanded' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (!isOpen) onToggle(); }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isOpen) { e.preventDefault(); onToggle(); } }}
    >
      <div className="h5">{title}</div>
      <div className="bento-content-small">
        <p className="paragraph-new"><em>{teaser}</em></p>
        <p className="small-text">Click to expand</p>
      </div>
      <div className="bento-content-expanded">
        <p className="paragraph-new">{persona}</p>
        <pre className="code-block">
          <code>{JSON.stringify(jsonData, null, 2)}</code>
        </pre>
        <div style={{ marginTop: '1rem' }}>
          <a href={outputHref} className="button-inverted black" style={{ textDecoration: 'none' }}>output</a>
        </div>
      </div>
    </div>
  );
}

function DewiChecklistA() {
  return (
    <div className="table-divider-columns aip-outcome-p1a">
      <ul role="list" className="paragraph-new">
        <li className="list-item-tick"><div><strong>Visa info<br /></strong>Explicitly calls out Indonesian visa requirements and Visit Japan Web; this directly targets her passport and first-time status.</div></li>
        <li className="list-item-tick"><div><strong>Family logistics<br /></strong>Mentions Airport Limousine Bus as easiest with kids, and child IC cards with half fares — a strong family calibration.</div></li>
        <li className="list-item-tick"><div><strong>Winter prep<br /></strong>Gives exact temps, sunset time, and layered clothing guidance; fully aligned with &ldquo;tropical to winter&rdquo; experience gap.</div></li>
        <li className="list-item-tick"><div><strong>Food Comfort<br /></strong>Suggests mild spice staples (ramen, curry, tempura, gyoza) and adds Halal Gourmet Japan; a comfort and familiar recommendation.</div></li>
        <li className="list-item-tick"><div><strong>Connectivity<br /></strong>Covers eSIM/pocket Wi-Fi, Type A/100V, and recommends comprehensive travel insurance — all high-utility and persona-specific.</div></li>
      </ul>
    </div>
  );
}

function DewiChecklistB() {
  return (
    <div className="table-divider-columns aip-outcome-p1b">
      <ul role="list" className="paragraph-new">
        <li className="list-item-tick"><div><strong>Omit Unnecessary<br /></strong>No unnecessary noise info appears, such as JR Pass, nightlife, coworking, deep dives. Scope discipline is good and keeps cognitive load low.</div></li>
        <li className="list-item-tick"><div><strong>Reassuring and structured tone<br /></strong>Reads like a calm checklist for nervous parents, not an exciting hype — exactly what parents need.</div></li>
      </ul>
    </div>
  );
}

function JordanChecklistA() {
  return (
    <div className="table-divider-columns aip-outcome-p2a">
      <ul role="list" className="paragraph-new">
        <li className="list-item-tick"><div><strong>Insider picks<br /></strong>Delivers Ando, Miho Museum, KYOCERA, MoMAK, specific coffee spots; strong alignment with design/UX/photography angle.</div></li>
        <li className="list-item-tick"><div><strong>Seasonal timing for April</strong> (cherry blossoms) Calls out April conditions, tail-end blossoms, blue hour/sunrise slots; clearly tuned to timing + photography.</div></li>
        <li className="list-item-asterix"><div><strong>Streamlined itinerary logic<br /></strong>Smart plan (linking close neighbourhoods and early starts for busy attractions), close but could be more planned and precise.</div></li>
        <li className="list-item-asterix"><div><strong>Advanced tips and information<br /></strong>Covers crowd timing, restrictions, reservations; but is missing deeper hacks, so it&rsquo;s solid but not maxed-out for seasoned travellers.</div></li>
      </ul>
    </div>
  );
}

function JordanChecklistB() {
  return (
    <div className="table-divider-columns aip-outcome-p2b">
      <ul role="list" className="paragraph-new">
        <li className="list-item-cross"><div>Includes airport train vs bus breakdown, Visit Japan Web, IC card setup, ATM advice — too much onboarding for a &ldquo;frequent&rdquo; traveller; this dilutes the persona fit.</div></li>
        <li className="list-item-tick"><div><strong>NO Generic top-10s<br /></strong>No kid fluff, no shallow top-10 spam; recommendations are curated and on-theme.</div></li>
        <li className="list-item-asterix"><div><strong>Few but high-value insights<br /></strong>Strong curation on spots and timing, but space is spent on things Jordan likely knows already, so some optimisation is needed.</div></li>
        <li className="list-item-asterix"><div><strong>Prioritises discovery, not reassurance<br /></strong>Good on discovery, but reassurance/logistics creep in — the program is caught between &ldquo;experienced&rdquo; and &ldquo;semi-new&rdquo;. It only partially trusts Jordan.</div></li>
      </ul>
    </div>
  );
}

function HaroldChecklistA() {
  return (
    <div className="table-divider-columns no-boarder aip-outcome-p3a">
      <ul role="list" className="paragraph-new">
        <li className="list-item-tick"><div><strong>Simplest arrival plan</strong> Effective: pushes official taxis, de-prioritises train for comfort.</div></li>
        <li className="list-item-tick"><div><strong>Connectivity &amp; Payment<br /></strong>Basic and reassuring. Simple explanation of tipping, cards, cash, adaptors, and travel eSIM; accessible and calm.</div></li>
        <li className="list-item-tick"><div><strong>Comfort<br /></strong>Emphasis on car over train, jet lag easing, mild walking, queues avoided — strong comfort logic.</div></li>
        <li className="list-item-asterix"><div><strong>Activities and rest<br /></strong>Timed entries and museum closures are covered, but guided tours and explicit rest breaks are implied rather than clearly recommended.</div></li>
        <li className="list-item-asterix"><div><strong>Accessibility cues<br /></strong>Covers accessibility for public transport, but lacks detailed accessibility cues for each activity/location.</div></li>
      </ul>
    </div>
  );
}

function HaroldChecklistB() {
  return (
    <div className="table-divider-columns no-boarder aip-outcome-p3b">
      <ul role="list" className="paragraph-new">
        <li className="list-item-tick"><div><strong>Omit<br /></strong>No nightlife, no budget gaming, no app maze; tone stays age-appropriate.</div></li>
        <li className="list-item-tick"><div><strong>Calm, trust-building tone<br /></strong>Language is steady, direct, and respectful.</div></li>
      </ul>
    </div>
  );
}

export default function AiOutcome() {
  const [open, setOpen] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggle = (i: number) => setOpen(i);

  return (
    <section className="default-section">
      <div className="default-container w-container">
        <h2 id="section--effectiveness-evaluation" className="h2">Output / Outcome</h2>
        <p className="paragraph-new">
          So as you can see it generates something. But the biggest question is does it actually
          personalise the content to each specific user? is it providing valuable insights, advice
          or comfort to the users? or is it generating generic content each time?
          <br /><br />
          To evaluate this, I created a <span>persona checklist</span> — a structured way to test
          whether the AI was genuinely adapting its tone, content, and priorities to each user,
          rather than just generating generic travel copy. Each checklist outlined what I{' '}
          <em>expected to see</em> (key inclusions and omissions) based on that traveller&rsquo;s
          background, experience, and goals. By comparing the generated output against these
          criteria, I could measure how well the model understood contextual nuances — for example,
          whether it gave family-focused reassurance for Dewi, efficient insider tips for Jordan,
          or comfort and accessibility for Harold and Margaret. This process turned subjective
          impressions into something observable and repeatable, allowing me to critique the
          system&rsquo;s strengths and pinpoint where it went wrong with defaulted or generic
          information.
        </p>
      </div>

      <div className="default-container w-container">
        <div className="aip-outcome-grid" ref={rowRef}>
          <div className="aip-outcome-p1bento">
            <PersonaBentoBox
              title="Persona 1"
              teaser="Family first-time traveller."
              persona="Dewi is a 36-year-old primary school teacher from Jakarta taking her first overseas trip with her husband and two young kids to Tokyo. She values clarity, reassurance, and practical, family-oriented advice for her December winter holiday."
              jsonData={{
                'User Identity': 'Dewi Santoso',
                'Trip Info': 'Tokyo, Japan — from Jakarta, Indonesia — December — 7 nights (Dec 20–27)',
                'Demographics': '36 — Primary school teacher — Leisure',
                'Experience Level': 'First overseas trip',
                'Interests': 'Theme parks, easy sightseeing, local mild food, shopping malls',
                'Preferences': 'Moderate — guided, family-friendly, simple planning',
                'Companions': 'Family of four (two young children)',
              }}
              outputHref="#section--the-product"
              isOpen={open === 0}
              onToggle={() => toggle(0)}
            />
          </div>
          <div className="aip-outcome-p2bento">
            <PersonaBentoBox
              title="Persona 2"
              teaser="Independent design-savvy solo explorer."
              persona="Jordan is a 28-year-old UX designer from Sydney spending 12 days in Kyoto in April. A confident and frequent traveller, Jordan values insider knowledge, aesthetic experiences, and efficient logistics over beginner guidance."
              jsonData={{
                'User Identity': 'Jordan Lee',
                'Trip Info': 'Kyoto, Japan — from Sydney, Australia — April — 12 nights',
                'Demographics': '28 — UX designer — Leisure / Cultural exploration',
                'Experience Level': 'Frequent traveller',
                'Interests': 'Local art, design, architecture, coffee culture, photography, historical walks',
                'Preferences': 'Independent — mid-to-high budget, flexible schedule',
                'Companions': 'Solo traveller',
              }}
              outputHref="#section--the-product"
              isOpen={open === 1}
              onToggle={() => toggle(1)}
            />
          </div>
          <div className="aip-outcome-p3bento">
            <PersonaBentoBox
              title="Persona 3"
              teaser="Comfort-first retired couple."
              persona="Harold (68) and Margaret (65) are retired teachers from Melbourne revisiting Europe for the first time in 15 years. They're travelling to Paris for nine nights in September and want comfort, safety, and guided experiences without tech complexity."
              jsonData={{
                'User Identity': 'Harold & Margaret Thompson',
                'Trip Info': 'Paris, France — from Melbourne, Australia — September — 9 nights',
                'Demographics': '68 & 65 — Retired teachers — Leisure / Cultural discovery',
                'Experience Level': 'Moderate (Europe once, 15 years ago)',
                'Interests': 'Art museums, walking tours, French cuisine, gardens, scenic viewpoints',
                'Preferences': 'Luxury — guided, minimal digital tools',
                'Companions': 'Couple',
              }}
              outputHref="#section--the-product"
              isOpen={open === 2}
              onToggle={() => toggle(2)}
            />
          </div>

          <DewiChecklistA />
          <JordanChecklistA />
          <HaroldChecklistA />
          <DewiChecklistB />
          <JordanChecklistB />
          <HaroldChecklistB />
        </div>

        <h5 className="h5">It works!</h5>
        <p className="paragraph-new">
          Across the three personas, the AI demonstrates credible personalisation range, from
          Dewi&rsquo;s guided reassurance, through Jordan&rsquo;s creative autonomy, to Harold
          and Margaret&rsquo;s comfort-centric clarity. The system clearly adapts to intent,
          region, and confidence level.
          <br /><br />
          These persona evaluations hint where future iterations should cut redundancy and deepen
          contextual sensitivity. While proof that the personalisation is working, it still needs
          further refinement.
        </p>
      </div>
    </section>
  );
}
