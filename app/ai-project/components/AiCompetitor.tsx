function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

export default function AiCompetitor() {
  return (
    <>
      {/* ── Competitor breakdown section ──────────────────────── */}
      <section id="section--competitors" className="default-section">
        <div className="default-container w-container">
          <h1 className="h2">Competitor breakdown</h1>
          <p className="paragraph-new">
            To position this concept, I analysed how major travel platforms currently use data and AI.
          </p>

          {/* Accordion: What They Already Do Well */}
          <details className="accordion_1_component">
            <summary className="accordion_toggle">
              <span className="span u-text-style-h5">🗂️ What They Already Do Well</span>
              <div className="accordion_1_toggle_icon"><ChevronDown /></div>
            </summary>
            <div className="accordion_1_content">
              <div className="table-5-collums w-layout-grid">
                {/* Header row */}
                <div className="table-outline table-header" />
                {['Booking.com','Airbnb','Google Travel','Expedia Group'].map(h => (
                  <div key={h} className="table-outline table-header">
                    <div className="paragraph-new table-spacing"><strong>{h}</strong></div>
                  </div>
                ))}
                {/* Data rows */}
                {[
                  ['Personalised search & filters','✅ Deep filtering, deal surfacing','✅ Strong intent-based filters','✅ Aggregated search + smart sorting','✅ Broad filtering across brands'],
                  ['Behaviour / history-based recommendations','✅ Recommends similar stays & destinations','✅ Learns from past trips and saved stays','✅ Uses search + browse history','✅ Uses loyalty + history to push deals'],
                  ['Dynamic pricing & conversion optimisation','✅ Aggressive price testing, urgency cues','✅ Smart pricing tools for hosts','✅ Highlights "best times" and price trends','✅ Heavy emphasis on discounts & bundles'],
                  ['Cross-platform / ecosystem data use','❌ Mostly internal','❌ Data siloed per listing','✅ Strong tie-in with Maps, Gmail, Flights','✅ Shared data across Expedia brands'],
                  ['Reactive support (chat, FAQs, help flows)','✅ Chatbot + help centre','✅ Messaging with hosts + support','✅ Surface help content contextually','✅ Chat + help flows across products'],
                ].map((row) => row.map((cell, ci) => (
                  <div key={`${row[0]}-${ci}`} className="table-outline">
                    <div className="paragraph-new table-spacing">{ci === 0 ? <strong>{cell}</strong> : cell}</div>
                  </div>
                )))}
              </div>
            </div>
          </details>

          {/* "Where My Concept Diverges" — NOT in an accordion, just a heading + table */}
          <h5 className="h5">Where My Concept Diverges</h5>
          <div className="table-5-collums w-layout-grid">
            {/* Header row */}
            <div className="table-outline table-header" />
            {['Booking.com','Airbnb','Google Travel','Expedia Group'].map(h => (
              <div key={h} className="table-outline table-header">
                <div className="paragraph-new table-spacing"><strong>{h}</strong></div>
              </div>
            ))}
            {[
              ['Personalised post-purchase experience','❌ Static confirmation pages','❌ Host-led info only','❌ Itinerary view, not tailored guidance','❌ Generic confirmation + loyalty copy'],
              ['Proactive pre-trip support','❌ Mostly notifications for changes','❌ Depends on each host','~ Some auto prompts (check-in, routes)','❌ Limited to booking changes'],
              ['Invisible AI (not chatbot)','❌ AI is surfaced as a help bot','❌ No embedded AI layer','~ Light AI summaries, still separate','❌ Interruptive prompts, not woven in'],
              ['Emotional, humanised confirmation tone','❌ Purely functional','✅ Sometimes human via host messaging','❌ Instrumental tone','❌ Corporate, deal-first language'],
              ['Personalisation beyond upsell','❌ Optimised for conversion','✅ Manual, story-driven but inconsistent','❌ Ad- and visibility-driven','❌ Focus on bundles and upgrades'],
            ].map((row) => row.map((cell, ci) => (
              <div key={`${row[0]}-${ci}`} className="table-outline">
                <div className="paragraph-new table-spacing">{ci === 0 ? <strong>{cell}</strong> : cell}</div>
              </div>
            )))}
          </div>

          <p className="paragraph-new">
            This gap is exactly where my concept sits: using AI to personalise the moments after
            purchase; the confirmation, the lead-up, and the support no platform currently designs for.
          </p>
        </div>
      </section>

      {/* ── Core Design Insights ──────────────────────────────── */}
      <section className="default-section">
        <div className="default-container w-container">
          <div className="container-limit-width">
            <div className="bento-box-style-only">
              <h3 className="h3-new">Core Design Insights</h3>
              <ul role="list" className="list-numbered paragraph-new">
                <li className="list-item-new">
                  <div>
                    <span className="highlight"><strong>Invisible AI &gt; Visible AI.</strong></span>{' '}
                    AI shouldn&rsquo;t always be a chatbot or a button, it can quietly shape what
                    the page says and shows, based on who&rsquo;s looking at it.
                  </div>
                </li>
                <li className="list-item-new">
                  <div>
                    <span className="highlight"><strong>Post-purchase is prime real estate.</strong></span>{' '}
                    The confirmation and pre-trip moments are emotionally loaded and under-designed;
                    they&rsquo;re the best place to re-invest personalisation.
                  </div>
                </li>
                <li className="list-item-new">
                  <div>
                    <span className="highlight"><strong>Activate existing data, don&rsquo;t collect more.</strong></span>{' '}
                    The opportunity isn&rsquo;t new data pipelines, it&rsquo;s using what platforms
                    already know (age, trip purpose, destination, timing, group) to generate
                    context-aware, personalised content at scale.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
