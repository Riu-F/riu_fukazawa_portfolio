function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

const COMPETITOR_BRANDS = ['Booking.com', 'Airbnb', 'Google Travel', 'Expedia Group'] as const;

/** Full copy — desktop */
const DO_WELL_ROWS: [string, string, string, string, string][] = [
  ['Personalised search & filters', '✅ Deep filtering, deal surfacing', '✅ Strong intent-based filters', '✅ Aggregated search + smart sorting', '✅ Broad filtering across brands'],
  ['Behaviour / history-based recommendations', '✅ Recommends similar stays & destinations', '✅ Learns from past trips and saved stays', '✅ Uses search + browse history', '✅ Uses loyalty + history to push deals'],
  ['Dynamic pricing & conversion optimisation', '✅ Aggressive price testing, urgency cues', '✅ Smart pricing tools for hosts', '✅ Highlights "best times" and price trends', '✅ Heavy emphasis on discounts & bundles'],
  ['Cross-platform / ecosystem data use', '❌ Mostly internal', '❌ Data siloed per listing', '✅ Strong tie-in with Maps, Gmail, Flights', '✅ Shared data across Expedia brands'],
  ['Reactive support (chat, FAQs, help flows)', '✅ Chatbot + help centre', '✅ Messaging with hosts + support', '✅ Surface help content contextually', '✅ Chat + help flows across products'],
];

const DIVERGE_ROWS: [string, string, string, string, string][] = [
  ['Personalised post-purchase experience', '❌ Static confirmation pages', '❌ Host-led info only', '❌ Itinerary view, not tailored guidance', '❌ Generic confirmation + loyalty copy'],
  ['Proactive pre-trip support', '❌ Mostly notifications for changes', '❌ Depends on each host', '~ Some auto prompts (check-in, routes)', '❌ Limited to booking changes'],
  ['Invisible AI (not chatbot)', '❌ AI is surfaced as a help bot', '❌ No embedded AI layer', '~ Light AI summaries, still separate', '❌ Interruptive prompts, not woven in'],
  ['Emotional, humanised confirmation tone', '❌ Purely functional', '✅ Sometimes human via host messaging', '❌ Instrumental tone', '❌ Corporate, deal-first language'],
  ['Personalisation beyond upsell', '❌ Optimised for conversion', '✅ Manual, story-driven but inconsistent', '❌ Ad- and visibility-driven', '❌ Focus on bundles and upgrades'],
];

/** Shorter row labels + tighter cells — same facts, mobile-width grid (title attrs keep full meaning for hover) */
const DO_WELL_ROWS_COMPACT: [string, string, string, string, string][] = [
  ['Search & filters', '✅ Deep filter', '✅ Intent filter', '✅ Smart sort', '✅ Broad filter'],
  ['History → recs', '✅ Stays/dest', '✅ Past trips', '✅ Browse hist.', '✅ Loyalty deals'],
  ['Pricing / CRO', '✅ A/B price', '✅ Host tools', '✅ Trends', '✅ Discounts'],
  ['Ecosystem data', '❌ Internal', '❌ Siloed', '✅ Maps/Gmail', '✅ Cross-brand'],
  ['Support / help', '✅ Bot+FAQ', '✅ Host msg', '✅ Context help', '✅ Cross-product'],
];

const DIVERGE_ROWS_COMPACT: [string, string, string, string, string][] = [
  ['Post-purchase UX', '❌ Static', '❌ Host-only', '❌ Generic view', '❌ Generic copy'],
  ['Pre-trip support', '❌ Alerts only', '❌ Varies', '~ Some prompts', '❌ Booking only'],
  ['Invisible AI', '❌ Bot UI', '❌ None', '~ Summaries', '❌ Interruptive'],
  ['Human tone', '❌ Dry', '✅ Host voice', '❌ Instrumental', '❌ Corporate'],
  ['Beyond upsell', '❌ Conversion', '✅ Story (≠)', '❌ Ad-led', '❌ Bundles'],
];

/** Leading ✅ / ❌ / ~ for mobile emoji-only cells */
function splitLeadingMarker(cell: string): { symbol: string; rest: string } {
  const t = cell.trimStart();
  if (t.startsWith('✅')) return { symbol: '✅', rest: t.slice(1).trim() };
  if (t.startsWith('❌')) return { symbol: '❌', rest: t.slice(1).trim() };
  if (t.startsWith('~')) return { symbol: '~', rest: t.slice(1).trim() };
  return { symbol: cell, rest: '' };
}

function CompetitorTable({
  rows,
  variant,
  fullRowsForTitles,
}: {
  rows: [string, string, string, string, string][];
  variant: 'full' | 'compact';
  /** Same row order as `rows`; used for native tooltips on compact cells (full wording). */
  fullRowsForTitles?: [string, string, string, string, string][];
}) {
  return (
    <div
      className={`table-5-collums w-layout-grid aip-competitor-table-${variant}`}
      role="grid"
      aria-label={variant === 'compact' ? 'Competitor comparison (compact)' : 'Competitor comparison'}
    >
      <div className="table-outline table-header" role="columnheader" />
      {COMPETITOR_BRANDS.map((h) => (
        <div
          key={h}
          className={`table-outline table-header${variant === 'compact' ? ' aip-competitor-rotate-header' : ''}`}
          role="columnheader"
        >
          <div className={`paragraph-new table-spacing${variant === 'compact' ? ' aip-competitor-header-label' : ''}`}>
            <strong>{h}</strong>
          </div>
        </div>
      ))}
      {rows.map((row, ri) =>
        row.map((cell, ci) => {
          const full = fullRowsForTitles?.[ri];
          const cellTitle = variant === 'compact' && full ? full[ci] : undefined;
          if (ci === 0) {
            return (
              <div key={`${row[0]}-${ci}`} className="table-outline aip-competitor-criterion" role="gridcell">
                <div className="paragraph-new table-spacing" title={variant === 'compact' && full ? full[0] : undefined}>
                  <strong>{cell}</strong>
                </div>
              </div>
            );
          }
          if (variant === 'full') {
            return (
              <div key={`${row[0]}-${ci}`} className="table-outline" role="gridcell">
                <div className="paragraph-new table-spacing">{cell}</div>
              </div>
            );
          }
          const { symbol, rest } = splitLeadingMarker(cell);
          return (
            <div key={`${row[0]}-${ci}`} className="table-outline" role="gridcell">
              <div className="paragraph-new table-spacing" title={cellTitle}>
                <span className="aip-competitor-symbol" aria-hidden="true">{symbol}</span>
                {rest ? <span className="aip-competitor-cell-rest"> {rest}</span> : null}
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
}

function CompetitorTablePair({ rows, rowsCompact }: { rows: typeof DO_WELL_ROWS; rowsCompact: typeof DO_WELL_ROWS_COMPACT }) {
  return (
    <>
      <CompetitorTable rows={rows} variant="full" />
      <CompetitorTable rows={rowsCompact} variant="compact" fullRowsForTitles={rows} />
    </>
  );
}

export default function AiCompetitor() {
  return (
    <>
      <section id="section--competitors" className="default-section">
        <div className="default-container w-container">
          <h1 className="h2">Competitor breakdown</h1>
          <p className="paragraph-new">
            To position this concept, I analysed how major travel platforms currently use data and AI.
          </p>

          <details className="accordion_1_component">
            <summary className="accordion_toggle">
              <span className="span u-text-style-h5">🗂️ What They Already Do Well</span>
              <div className="accordion_1_toggle_icon"><ChevronDown /></div>
            </summary>
            <div className="accordion_1_content">
              <div className="accordion_1_body">
                <CompetitorTablePair rows={DO_WELL_ROWS} rowsCompact={DO_WELL_ROWS_COMPACT} />
              </div>
            </div>
          </details>

          <h5 className="h5">Where My Concept Diverges</h5>
          <CompetitorTablePair rows={DIVERGE_ROWS} rowsCompact={DIVERGE_ROWS_COMPACT} />

          <p className="paragraph-new">
            This gap is exactly where my concept sits: using AI to personalise the moments after
            purchase; the confirmation, the lead-up, and the support no platform currently designs for.
          </p>
        </div>
      </section>

      <section className="default-section aip-mobile-unbox">
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
