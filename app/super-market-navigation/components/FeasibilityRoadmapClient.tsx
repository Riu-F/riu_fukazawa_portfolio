'use client';

import { Fragment, useState } from 'react';

import { InsightTag, type CaseStudyInsight } from './InsightTag';

type RoadmapStatus = 'complete' | 'next' | 'future';

type RoadmapNode = {
  id: string;
  title: string;
  summary: string;
  status: RoadmapStatus;
  insights: CaseStudyInsight[];
};

const NODES: RoadmapNode[] = [
  {
    id: '1d',
    title: '1D Prototype',
    summary: 'Simplified sequential navigation. Enough to validate the concept.',
    status: 'complete',
    insights: ['navigation', 'distraction'],
  },
  {
    id: 'coded',
    title: 'Coded Demo',
    summary: 'Functional front-end built after university. From Figma to working code.',
    status: 'complete',
    insights: [],
  },
  {
    id: '2d',
    title: '2D Spatial Mapping',
    summary: 'From a fixed path to a real floor plan. Dynamic routing through actual store layouts.',
    status: 'next',
    insights: ['navigation'],
  },
  {
    id: 'indoor',
    title: 'Indoor Positioning',
    summary: "GPS doesn't work indoors. Bluetooth beacons and QR markers do.",
    status: 'future',
    insights: ['navigation'],
  },
  {
    id: 'launch',
    title: 'Store Integration & Launch',
    summary: 'Real store data, real layouts, real users. Partnering with supermarkets.',
    status: 'future',
    insights: ['navigation', 'communication', 'distraction'],
  },
];

function segmentSolid(left: RoadmapStatus, right: RoadmapStatus): boolean {
  return left === 'complete' && right === 'complete';
}

function RoadmapStatusIcon({ status }: { status: RoadmapStatus }) {
  if (status === 'complete') {
    return (
      <span className="fr-road__status-icon fr-road__status-icon--complete" aria-hidden="true">
        <span className="fr-road__check">✓</span>
      </span>
    );
  }
  if (status === 'next') {
    return <span className="fr-road__status-icon fr-road__status-icon--next" aria-hidden="true" />;
  }
  return <span className="fr-road__status-icon fr-road__status-icon--future" aria-hidden="true" />;
}

function statusAria(status: RoadmapStatus): string {
  if (status === 'complete') return 'Complete';
  if (status === 'next') return 'Next step';
  return 'Future';
}

export default function FeasibilityRoadmapClient() {
  const [active, setActive] = useState(0);

  return (
    <div className="fr-road">
      <div className="fr-road__scroll">
        <nav className="fr-road__timeline" aria-label="Product roadmap from prototype to production">
          <div className="fr-road__track">
            {NODES.map((node, i) => (
              <Fragment key={node.id}>
                {i > 0 && (
                  <div
                    className={`fr-road__connector ${
                      segmentSolid(NODES[i - 1].status, NODES[i].status)
                        ? 'fr-road__connector--solid'
                        : 'fr-road__connector--dashed'
                    }`}
                    aria-hidden
                  />
                )}
                <button
                  type="button"
                  className={`fr-road__node${active === i ? ' fr-road__node--active' : ''}${
                    node.status === 'complete' ? ' fr-road__node--complete' : ''
                  }${node.status === 'next' ? ' fr-road__node--next' : ''}${
                    node.status === 'future' ? ' fr-road__node--future' : ''
                  }`}
                  onClick={() => setActive(i)}
                  aria-current={active === i ? 'step' : undefined}
                  aria-label={`${node.title}, ${statusAria(node.status)}. ${node.summary}`}
                >
                  <span className="fr-road__status-wrap">
                    <RoadmapStatusIcon status={node.status} />
                    <span className="u-sr-only">{statusAria(node.status)}</span>
                  </span>
                  <span className="fr-road__node-title">{node.title}</span>
                  <span className="fr-road__node-summary">{node.summary}</span>
                  {node.insights.length > 0 ? (
                    <span className="fr-road__node-tags">
                      {node.insights.map((ins) => (
                        <InsightTag key={`${node.id}-${ins}`} insight={ins} />
                      ))}
                    </span>
                  ) : null}
                </button>
              </Fragment>
            ))}
          </div>
        </nav>
      </div>

      <div className="fr-road__panel-shell">
        <div key={active} className="fr-road-panel fr-road-panel--animate">
          {active === 0 && (
            <div className="fr-road-panel__body">
              <p className="paragraph-new">
                The current prototype represents the supermarket as a linear sequence of aisles. Users move
                along a single forward path, with each aisle appearing in a fixed order. Items are assigned
                to a category, a position in the store sequence, and a location within their aisle.
              </p>
              <p className="paragraph-new">
                This was an intentional scoping decision. It let us test whether structured step-by-step
                guidance actually reduces cognitive load and improves navigation, without solving the much
                larger problem of full indoor spatial mapping. For a conceptual prototype, it was the right
                trade-off. We validated the interaction model and its accessibility value while keeping the
                system lightweight enough to build, test, and iterate on quickly.
              </p>
            </div>
          )}

          {active === 1 && (
            <div className="fr-road-panel__body">
              <p className="paragraph-new">
                After the university project wrapped up, I independently built the coded version you see
                attached to this case study using Claude Code and Cursor AI. It translates the final Figma
                prototype into a working front-end.
              </p>
              <p className="paragraph-new">
                This was partly an experiment in AI-assisted development, but more importantly it was a proof
                of concept. A Figma prototype demonstrates how something would feel. A coded version
                demonstrates that it can actually work. The interaction patterns, the guided navigation flow,
                the shopping list management, they all translate. The project doesn&apos;t end at the
                prototype.
              </p>
            </div>
          )}

          {active === 2 && (
            <div className="fr-road-panel__body">
              <p className="paragraph-new">
                A production version would need to move from the 1D sequential model to a 2D spatial system,
                representing the store as a navigable floor plan with real relationships between aisles,
                intersections, and destinations. That&apos;s a fundamentally different system underneath. It
                requires mapped store layouts, coordinate-based shelf positioning,{' '}
                <InsightTag insight="navigation" />{' '}
                pathfinding algorithms for routing between items, and
                logic for turns, backtracking, and alternate routes.
              </p>
              <p className="paragraph-new">
                But the key insight from this project is that the user experience doesn&apos;t change. The
                interaction model we validated, structured guidance, one item at a time, clear direction,
                would sit on top of this more complex infrastructure. The interface stays simple even as the
                system underneath scales.
              </p>
            </div>
          )}

          {active === 3 && (
            <div className="fr-road-panel__body">
              <p className="paragraph-new">
                <InsightTag insight="navigation" />{' '}
                Standard GPS isn&apos;t precise enough to determine which
                aisle someone is standing in, let alone where they are within it. The most realistic approach
                would combine two methods.
              </p>
              <p className="paragraph-new">
                Bluetooth beacons placed throughout the store provide broad zone-level awareness: which aisle
                are you near? QR or visual markers integrated into store signage provide precise confirmation
                at key points: you are at the start of aisle 4. Together, these give the app reliable location
                data without depending on a single technology.
              </p>
              <p className="paragraph-new">
                The same physical markers could double as wayfinding aids for shoppers who aren&apos;t using
                the app, reinforcing the store&apos;s accessibility at the environmental level too.
              </p>
            </div>
          )}

          {active === 4 && (
            <div className="fr-road-panel__body">
              <p className="paragraph-new">
                Everything in this roadmap converges here. A production version of FoodHub would need
                partnerships with supermarket chains to access store layout data, real-time product location
                information, and the physical infrastructure for indoor positioning. It would also need to
                scale across different store formats, from small convenience stores with simple layouts to
                large supermarkets with complex floor plans.
              </p>
              <p className="paragraph-new">
                The research from this project shows the demand is real: 64% of our participants reported
                difficulty finding items, and users with cognitive disabilities face compounding barriers that
                current solutions don&apos;t address. The concept has been validated through three rounds of
                user testing. The question is no longer whether it works, but how to build the infrastructure
                to support it at scale.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
