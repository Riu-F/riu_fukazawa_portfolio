'use client';

import Link from 'next/link';
import { useStepperAutoCycle } from '@/app/hooks/useStepperAutoCycle';
import { Fragment, type CSSProperties, type RefObject } from 'react';

const AUTO_INTERVAL_MS = 5000;

type NodeStatus = 'complete' | 'future';

type RoadmapNode = {
  id: string;
  title: string;
  summary: string;
  status: NodeStatus;
  panel: string;
};

const NODES: RoadmapNode[] = [
  {
    id: 'validated',
    title: 'Concept Validated',
    summary: 'Three personas tested. Core personalisation confirmed.',
    status: 'complete',
    panel:
      'The persona checklists demonstrated that the system genuinely adapts its content, tone, and priorities based on traveller context. Dewi gets family reassurance. Jordan gets insider cultural picks. Harold and Margaret get comfort-first planning. The core concept works. The question is no longer whether AI can personalise a checkout page, but how to refine and scale it.',
  },
  {
    id: 'testing',
    title: 'User Testing',
    summary: 'Real travellers, not just persona checklists.',
    status: 'future',
    panel:
      'The current evaluation uses my own persona checklists, which test whether the system adapts but not whether real travellers find the output genuinely useful. The next step is putting generated outputs in front of actual travellers with different backgrounds and measuring whether the content reduces post-booking anxiety and increases preparedness. Does a first-time family traveller feel more confident after reading their personalised checkout? Does an experienced solo traveller find the tips genuinely useful rather than redundant? Those are the questions only real user testing can answer.',
  },
  {
    id: 'integration',
    title: 'Production Integration',
    summary: 'Real booking data instead of a manual form.',
    status: 'future',
    panel:
      "In the current demo, the user fills in a form to provide their traveller context. In a real implementation, all of that data would come automatically from the booking flow, customer profile, and trip history. The form would disappear entirely. The system would read the booking confirmation data and generate the personalised checkout page without the traveller doing anything at all. That's the invisible AI principle in practice: the user sees a helpful, personalised page and never knows AI was involved.",
  },
  {
    id: 'scale',
    title: 'Speed and Scale',
    summary: 'Near-instant generation and multi-platform deployment.',
    status: 'future',
    panel:
      "The current system takes a few seconds to generate a response. In production, that would need to be near-instant, either through response caching for common traveller profiles, model optimisation, or pre-generation triggered at booking time rather than at page load. As newer AI models improve at contextual inference, the prompting strategy will also evolve. Where earlier models needed explicit instructions to consider culture, weather, and group type, newer ones infer these automatically. The design challenge ahead is re-tuning the system to match each model's strengths while keeping the output structured, specific, and genuinely useful.",
  },
];

const LAST_COMPLETE_INDEX = NODES.reduce(
  (last, node, i) => (node.status === 'complete' ? i : last),
  0,
);

function lineFillPct(): string {
  if (NODES.length <= 1) return '0%';
  return `${(LAST_COMPLETE_INDEX / (NODES.length - 1)) * 100}%`;
}

function StatusIcon({ status }: { status: NodeStatus }) {
  if (status === 'complete') {
    return (
      <span className="aip-wn__status-icon aip-wn__status-icon--complete" aria-hidden>
        <span className="aip-wn__check">✓</span>
      </span>
    );
  }
  return <span className="aip-wn__status-icon aip-wn__status-icon--future" aria-hidden />;
}

function scrollToTop() {
  const root = document.querySelector('.aip');
  if (root) {
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function AiWhatsNext() {
  const { sectionRef, activeIndex, selectStep, sectionHoverProps } = useStepperAutoCycle({
    stepCount: NODES.length,
    intervalMs: AUTO_INTERVAL_MS,
  });

  const node = NODES[activeIndex];

  return (
    <section
      id="section--whats-next"
      ref={sectionRef as RefObject<HTMLElement>}
      className="default-section aip-whats-next"
      {...sectionHoverProps}
    >
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">What&rsquo;s Next</span>
        </div>

        <h2 className="h2">Where this goes</h2>

        <p className="paragraph-new width-limit aip-wn__intro">
          The concept is validated. Here&rsquo;s what comes next.
        </p>

        <div className="aip-wn__road">
          <div className="aip-wn__scroll">
            <nav className="aip-wn__timeline" aria-label="Project roadmap">
              <div
                className="aip-wn__track"
                style={{ '--aip-wn-line-pct': lineFillPct() } as CSSProperties}
              >
                <div className="aip-wn__line-bg" aria-hidden />
                <div className="aip-wn__line-fill" aria-hidden />
                {NODES.map((item, i) => (
                  <Fragment key={item.id}>
                    {i > 0 && (
                      <div
                        className={`aip-wn__connector${
                          NODES[i - 1].status === 'complete' && item.status === 'complete'
                            ? ' aip-wn__connector--solid'
                            : ' aip-wn__connector--dashed'
                        }`}
                        aria-hidden
                      />
                    )}
                    <button
                      type="button"
                      className={`aip-wn__node${activeIndex === i ? ' aip-wn__node--active' : ''}${
                        item.status === 'complete' ? ' aip-wn__node--complete' : ' aip-wn__node--future'
                      }`}
                      onClick={() => selectStep(i)}
                      aria-current={activeIndex === i ? 'step' : undefined}
                    >
                      <span className="aip-wn__status-wrap">
                        <StatusIcon status={item.status} />
                        <span className="u-sr-only">
                          {item.status === 'complete' ? 'Complete' : 'Future'}
                        </span>
                      </span>
                      <span className="aip-wn__node-title">{item.title}</span>
                      <span className="aip-wn__node-summary">{item.summary}</span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </nav>
          </div>

          <div className="aip-wn__panel-shell" aria-live="polite">
            <div key={activeIndex} className="aip-wn__panel aip-wn__panel--animate">
              <p className="paragraph-new">{node.panel}</p>
            </div>
          </div>
        </div>

        <p className="aip-wn__statement width-limit">
          This project turned a 7-week university sprint into something I genuinely believe in.
          It&rsquo;s not a chatbot and it&rsquo;s not a recommendation engine. It&rsquo;s a quiet layer
          that makes the web feel more considered. That&rsquo;s the kind of design problem I want to
          keep solving.
        </p>

        <div className="aip-wn__actions">
          <button type="button" className="aip-wn__btn" onClick={scrollToTop}>
            Back to top
          </button>
          <Link href="/" className="aip-wn__btn">
            View all projects
          </Link>
        </div>
      </div>
    </section>
  );
}
