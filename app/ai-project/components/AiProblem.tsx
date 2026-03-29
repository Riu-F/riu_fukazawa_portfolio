'use client';

import { useState, useEffect, useRef } from 'react';

function BentoBox({ title, teaser, expandedTitle, expandedContent, isOpen, onToggle }: {
  title: React.ReactNode;
  teaser: React.ReactNode;
  expandedTitle: React.ReactNode;
  expandedContent: React.ReactNode;
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
        <p className="paragraph-new">{teaser}</p>
        <p className="small-text">Click to expand</p>
      </div>
      <div className="bento-content-expanded">
        <div className="h5">{expandedTitle}</div>
        {expandedContent}
      </div>
    </div>
  );
}

export default function AiProblem() {
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

  // Clicking a collapsed box opens it; clicking an open box does nothing
  const toggle = (i: number) => setOpen(i);

  return (
    <section className="default-section">
      <div className="default-container w-container">
        <div className="_1x2-grid-2-3 w-layout-grid">
          {/* Left: text */}
          <div>
            <h2 id="section--problem-space" className="h2"><strong>Why travel websites?</strong></h2>
            <blockquote className="paragraph-new">
              <em>Low engagement. <br />Lack of relevance. <br />Lots of data. </em>
            </blockquote>
            <p className="paragraph-new">
              You&rsquo;re booking your next holiday or travel adventure, and the itinerary is
              coming together. You&rsquo;re excited, right? Until you hit the checkout page.
              Suddenly, all that excitement? Gone. Generic, boring, lifeless. &ldquo;your purchase
              is complete&rdquo;. These words should add magic, not kill it.
              <br /><br />
              These companies know a lot about you, where, when, why your traveling. But
              Personalisation? Practically nonexistent. At least, until now.
            </p>
          </div>
          {/* Right: booking example image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            sizes="(max-width: 479px) 100vw, 240px"
            alt="Example booking confirmation page"
            loading="lazy"
            src="https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6821dabc39e417df36bf943c_example_booking.png"
            srcSet="https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6821dabc39e417df36bf943c_example_booking-p-500.png 500w, https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6821dabc39e417df36bf943c_example_booking.png 990w"
            className="image---full-height"
          />
        </div>
      </div>

      {/* Bento row — full width */}
      <div className="full-width-container">
        <div className="bento-row" ref={rowRef}>

          {/* Box 1: Problem Area */}
          <BentoBox
            title="Problem Area"
            teaser="We noticed personalisation in travel stops the moment you hit 'book now'—but that's where it should start"
            expandedTitle="Defining the Gap in Post-Purchase Personalisation"
            isOpen={open === 0}
            onToggle={() => toggle(0)}
            expandedContent={
              <>
                <p className="paragraph-new">
                  While most travel platforms pour their energy into personalising search and
                  booking, the moment a trip is confirmed, the experience flattens. Across Expedia,{' '}
                  <a href="http://booking.com/" style={{ color:'inherit' }}>Booking.com</a> and even
                  newer AI tools, personalisation stops at the transaction. Everything that follows —
                  confirmation screens, checkout details, pre-trip nudges — becomes generic, despite
                  companies already holding rich contextual data about the traveller. This disconnect
                  became the foundation of the problem space I explored.
                  <br /><br />
                  For this sprint, we weren&rsquo;t aiming to reimagine the entire booking journey.
                  Instead, I focused specifically on the post-purchase phase—moments like the checkout
                  screen, confirmation page, and pre-trip reminders.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6912e5dd37804ce44cabf19c_ai-posible-intergrations.png"
                  loading="lazy"
                  alt=""
                  className="bento-image"
                />
                <p className="image-caption"><em>Brainstorm for AI-Driven Personalisation areas of possible integration</em></p>
                <p className="paragraph-new">
                  To ground the problem space, I mapped out all the touchpoints where AI could add
                  contextual value using data platforms already collect — from marketing messages to
                  after-purchase support. From this broader field,{' '}
                  <span className="highlight">
                    I deliberately narrowed the scope to a single, high-impact moment: the
                    post-checkout trip confirmation page.
                  </span>{' '}
                  It&rsquo;s the first point where excitement peaks, personal context is richest,
                  and current platforms still default to generic, boilerplate content.
                </p>
              </>
            }
          />

          {/* Box 2: Research */}
          <BentoBox
            title={<span id="section--research">Research</span>}
            teaser="With no time for user interviews, we flipped the script and used existing data as our playground"
            expandedTitle={<>Research Overview:<br />Understanding what the landscape <em>is</em> like (data, user journey, and expectations).</>}
            isOpen={open === 1}
            onToggle={() => toggle(1)}
            expandedContent={
              <>
                <p className="paragraph-new">
                  Because this sprint was about rapid AI exploration, there wasn&rsquo;t time for
                  extensive primary research. Instead, I leaned into desk research and focused on one
                  question:{' '}
                  <span className="highlight">
                    what data do travel companies already have, and why isn&rsquo;t it being used to
                    personalise the moments after booking?
                  </span>
                  <br /><br />
                  To map this out, I sketched the Travel Data Ecosystem — a visual breakdown of the
                  user information already sitting inside most booking platforms: identity data, trip
                  context, behavioural signals, partner integrations, preferences, and inferred
                  insights.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/691d75cbb7de19d1483aefa6_ai-mind-map.png"
                  loading="lazy"
                  alt=""
                  className="bento-image"
                />
                <p className="image-caption"><em>Travel Data Ecosystem diagram</em></p>
                <p className="paragraph-new">
                  From mapping the Travel Data Ecosystem and reviewing how major platforms handle
                  post-purchase interactions, a set of clear insights emerged:
                </p>
                <div className="h5">Research Insights</div>
                <ul role="list" className="list-numbered paragraph-new">
                  <li className="list-item-new">
                    <div>
                      <strong>There&rsquo;s more than enough data already.<br /></strong>
                      <span className="highlight">So the issue isn&rsquo;t data scarcity, it&rsquo;s dormant data.</span>{' '}
                      Travel companies already hold huge rich contextual information, but almost
                      none of it gets activated <em>after</em> purchase. (It&rsquo;s used
                      extensively in recommendation engines pre-purchase etc)
                    </div>
                  </li>
                  <li className="list-item-new">
                    <div>
                      <strong>Personalisation follows the transaction, not the experience arc.<br /></strong>
                      Data is heavily used to optimise search, sort, and pricing, but barely used
                      to shape the emotional arc of the journey (anticipation, reassurance,
                      preparation) once the booking is confirmed.
                    </div>
                  </li>
                  <li className="list-item-new">
                    <div>
                      <strong>Post-purchase touchpoints are treated as admin, not experience moments.<br /></strong>
                      Confirmation screens, emails, and reminders are designed for verification,
                      not value.
                    </div>
                  </li>
                </ul>
              </>
            }
          />

          {/* Box 3: Existing Solutions */}
          <BentoBox
            title="Existing Solutions"
            teaser="Everyone's personalising the search—nobody's personalising the journey after you've booked"
            expandedTitle="Existing solutions:"
            isOpen={open === 2}
            onToggle={() => toggle(2)}
            expandedContent={
              <>
                <p className="paragraph-new"><em>How</em> the industry currently tries to solve things (solution patterns, not competitors).</p>
                <div className="_3x5-grid w-layout-grid" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {/* Header */}
                  <div className="table-outline table-header"><div className="paragraph-new table-spacing">Solution Type</div></div>
                  <div className="table-outline table-header"><div className="paragraph-new table-spacing">What It Does Well</div></div>
                  <div className="table-outline table-header"><div className="paragraph-new table-spacing">Where It Falls Short</div></div>
                  {/* Rows */}
                  {[
                    ['Smart Pricing Algorithms','Optimise prices in real time based on demand, user behaviour, and inventory.','Entirely focused on transactional optimisation, not on improving the traveller\'s experience.'],
                    ['Package & Add-On Recommendations','Suggest bundles (tours, insurance, upgrades) based on past bookings or broad preferences.','Often generic and sales-driven, with little sensitivity to the specific context of the current trip or traveller.'],
                    ['AI Chatbots & Assistants','Handle support queries, FAQs, and simple changes through conversational interfaces.','Reactive by design: they only help if the user knows what to ask and chooses to engage.'],
                    ['AI-Generated Itineraries & Trip Builders','Auto-generate suggested activities, routes, and day plans.','Typically built from general content + search history, not from deeper lifestyle, confidence level, or accessibility needs.'],
                    ['Rule-Based Post-Purchase Emails & Alerts','Send confirmations, reminders, and generic pre-trip checklists.','One-size-fits-all messaging; little adaptation to who the traveller is or what situation they\'re in.'],
                  ].map(([type, good, bad]) => (
                    <div key={type} style={{ display: 'contents' }}>
                      <div className="table-outline"><div className="paragraph-new table-spacing"><strong>{type}</strong></div></div>
                      <div className="table-outline"><div className="paragraph-new table-spacing">{good}</div></div>
                      <div className="table-outline"><div className="paragraph-new table-spacing">{bad}</div></div>
                    </div>
                  ))}
                </div>
                <div className="h5" style={{ marginTop: '1.25rem' }}>Opportunity Areas</div>
                <p className="paragraph-new">From these patterns, several gaps became clear:</p>
                <ul role="list" className="list-numbered paragraph-new">
                  <li className="list-item-new"><div><strong>Automation is optimised for revenue, not confidence.<br /></strong>Smart pricing, recommendations, and funnels are finely tuned to conversion and upsell metrics, but not to reducing uncertainty or increasing readiness for the trip.</div></li>
                  <li className="list-item-new"><div><strong>AI is treated as a feature, not a layer.<br /></strong>When AI appears, it&rsquo;s usually packaged as a visible tool (chatbots, &ldquo;Ask AI&rdquo;, magic buttons) rather than a quiet layer that reshapes content and behaviour in the background.</div></li>
                  <li className="list-item-new"><div><strong>Post-purchase tooling is administrative, not experiential.<br /></strong>Existing systems handle tickets, changes, and alerts well, but do almost nothing to adapt content based on who the traveller is, why they&rsquo;re going, or what they might need next.</div></li>
                </ul>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
