'use client';

import { useEffect, useRef, useState } from 'react';

function SecondaryLandscapeTable() {
  return (
    <div className="research-table-wrap" role="region" aria-label="Accessibility breakdown matrix">
      <table className="research-table">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">Navigation</th>
            <th scope="col">Labels</th>
            <th scope="col">Assistance</th>
            <th scope="col">Checkout</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Attention</th>
            <td>Difficulty staying oriented in long aisles</td>
            <td>Missed promotional tags / important info</td>
            <td>Hard to notice staff availability</td>
            <td>Distraction leads to missed steps</td>
          </tr>
          <tr>
            <th scope="row">Memory</th>
            <td>Forgetting item locations</td>
            <td>Difficulty recalling product differences</td>
            <td>Forgetting what to ask</td>
            <td>Losing track of budget/items</td>
          </tr>
          <tr>
            <th scope="row">Processing</th>
            <td>Overwhelming layout complexity</td>
            <td>Dense, hard-to-parse labels</td>
            <td>Unclear instructions</td>
            <td>Confusing payment flows</td>
          </tr>
          <tr>
            <th scope="row">Sensory</th>
            <td>Bright lights / noise affect wayfinding</td>
            <td>Visual clutter on packaging</td>
            <td>Social anxiety in interactions</td>
            <td>Overstimulation at busy checkouts</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CompetitorComparisonTable() {
  return (
    <div className="research-table-wrap" role="region" aria-label="Competitor comparison table">
      <table className="research-table research-table--compact">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">Navigation</th>
            <th scope="col">Assistance</th>
            <th scope="col">Distractions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Coles App</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th scope="row">Scan &amp; Go</th>
            <td>❌</td>
            <td>❌</td>
            <td>✴️</td>
          </tr>
          <tr>
            <th scope="row">MappedIn</th>
            <td>✅</td>
            <td>❌</td>
            <td>✴️</td>
          </tr>
          <tr>
            <th scope="row">HK Airport Signage</th>
            <td>✅</td>
            <td>❌</td>
            <td>✅</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SecondaryResearchExpanded() {
  return (
    <div className="rl-expanded">
      <p className="paragraph-new">
        We started by mapping the accessibility landscape: visual, auditory, physical, and cognitive
        impairments, then deliberately zoomed into cognitive and learning disabilities because supermarkets
        are sensory-rich environments where attention, memory, processing load, and decision-making are
        constantly taxed.
      </p>
      <p className="paragraph-new">
        A key takeaway from secondary research was that &quot;accessibility&quot; isn&apos;t just screen readers
        and ramps. In a supermarket context it includes wayfinding and spatial clarity (how easily someone
        can form and maintain a mental map), information readability (font size, label density, signage
        clarity), cognitive load and decision pressure (choice overload, price comparisons, interruptions),
        and environmental stressors (noise, lighting, crowds, clutter).
      </p>
      <p className="paragraph-new">
        We used this framework to map where breakdowns occur across different user needs and supermarket
        touchpoints:
      </p>
      <SecondaryLandscapeTable />
      <p className="paragraph-new">
        We also explored accessibility audit methods (checklists and observational techniques) to evaluate
        how well an environment supports different users. This gave us a practical lens for analysing
        supermarkets as systems, not just interfaces, which was useful later when we conducted walkthroughs
        and mapped pain points.
      </p>
      <p className="paragraph-new">
        Finally, we grounded the work in Australian legal and ethical context, including the Disability
        Discrimination Act 1992 (DDA), not as a compliance checkbox, but as a reminder that exclusion is
        often a design decision by default.
      </p>
    </div>
  );
}

function CompetitorAnalysisExpanded() {
  return (
    <div className="rl-expanded">
      <p className="paragraph-new">
        We evaluated existing tools not just for features, but for whether they reduce cognitive load or
        accidentally increase it.
      </p>

      <div className="rl-competitors">
        <div className="rl-competitor">
          <h3 className="h4 rl-competitor__title">Coles App</h3>
          <p className="paragraph-new rl-competitor__lead">
            None of the Australian supermarkets have any navigation, list, or assistance app of any sort.
          </p>
          <p className="paragraph-new">
            Though it provides product info, deals, and checkout options, the Coles app lacks in-store aisle
            guidance and advanced accessibility features.
          </p>
        </div>

        <div className="rl-competitor">
          <h3 className="h4 rl-competitor__title">Scan &amp; Go Trolleys</h3>
          <p className="paragraph-new rl-competitor__lead">
            A convenience-focused solution, similar to existing self-checkouts. A different category to what
            we&apos;re designing.
          </p>
          <p className="paragraph-new">
            This system allows customers to scan, bag, and pay via their phones, reducing wait times.
            However, it limits staff interaction, lacks aisle guidance, and can overstimulate some users.
            Our solution aims for similar ease of use without disrupting employment roles or adding stress.
          </p>
        </div>

        <div className="rl-competitor">
          <h3 className="h4 rl-competitor__title">MappedIn</h3>
          <p className="paragraph-new rl-competitor__lead">Navigation, but not accessible.</p>
          <p className="paragraph-new">
            While MappedIn provides warehouse staff with item maps for efficient order fulfilment, it&apos;s
            designed for internal logistics rather than customer navigation, and lacks accessibility features
            for end-users.
          </p>
        </div>

        <div className="rl-competitor">
          <h3 className="h4 rl-competitor__title">Hong Kong Airport Signage</h3>
          <p className="paragraph-new rl-competitor__lead">
            Colour-coded, strategically placed signage at the airport helps guide passengers effectively.
            Why did we look at this? It&apos;s arguably the most similar to our idea: it provides navigation
            while being highly accessible, designed to reduce friction and confusion.
          </p>
        </div>
      </div>

      <CompetitorComparisonTable />

      <p className="paragraph-new">
        Our differentiator becomes clear: most solutions optimise for efficiency or sales, not for cognitive
        accessibility. FoodHub targets navigation, clarity, and assistance in a way that can scale to many
        users, not just expert shoppers.
      </p>
    </div>
  );
}

export function ResearchLandscapeCards() {
  const [active, setActive] = useState<'secondary' | 'competitors' | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);

  return (
    <div className="rl">
      <div className="rl-row">
        <button
          type="button"
          className={`rl-card${active === 'secondary' ? ' rl-card--active' : ''}`}
          onClick={() => setActive((v) => (v === 'secondary' ? null : 'secondary'))}
          aria-expanded={active === 'secondary'}
        >
          <div className="rl-card__title">Secondary Research</div>
          <div className="rl-card__preview">
            We mapped the full accessibility landscape, then narrowed our focus to cognitive and learning
            disabilities. What we found reframed what &apos;accessibility&apos; actually means in a supermarket.
          </div>
          <div className="rl-card__cta">View framework →</div>
        </button>

        <button
          type="button"
          className={`rl-card${active === 'competitors' ? ' rl-card--active' : ''}`}
          onClick={() => setActive((v) => (v === 'competitors' ? null : 'competitors'))}
          aria-expanded={active === 'competitors'}
        >
          <div className="rl-card__title">Competitor Analysis</div>
          <div className="rl-card__preview">
            We evaluated four existing tools and systems against navigation, assistance, and cognitive load
            reduction. None scored well across all three. That gap is where FoodHub sits.
          </div>
          <div className="rl-card__cta">View comparison →</div>
        </button>
      </div>

      {active ? (
        <div ref={expandedRef} className="rl-panel" role="region" aria-label="Expanded research landscape">
          <div className="rl-panel__inner">
            <button type="button" className="rl-panel__close" onClick={() => setActive(null)} aria-label="Collapse">
              ×
            </button>
            {active === 'secondary' ? <SecondaryResearchExpanded /> : <CompetitorAnalysisExpanded />}
          </div>
        </div>
      ) : null}
    </div>
  );
}

