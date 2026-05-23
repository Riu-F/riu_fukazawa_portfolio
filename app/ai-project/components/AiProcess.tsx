'use client';

import { useStepperAutoCycle } from '@/app/hooks/useStepperAutoCycle';
import { type CSSProperties, type RefObject } from 'react';

import AiProcessPrototypeLinks from './AiProcessPrototypeLinks';

const AUTO_INTERVAL_MS = 5000;

const PHASES = [
  {
    number: '01',
    title: 'University Brief',
    summary: 'A 7-week sprint exploring AI in design.',
    panel: (
      <>
        <p className="paragraph-new">
          This started as a university course exploring AI in design. The brief was open-ended: find
          a real problem and investigate how AI could meaningfully address it. I was responsible for
          every stage, from research and concept framing to system logic and technical build.
        </p>
        <p className="paragraph-new">
          The aim wasn&rsquo;t to create a polished product. It was to push the boundaries of emerging
          technology and explore how AI could unlock new opportunities for context-aware,
          user-adaptive design. Seven weeks, start to finish.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'First Attempt',
    summary: 'Built a recommendation engine. Realised that was the wrong approach.',
    panel: (
      <>
        <p className="paragraph-new">
          My first prototype used Wordware.ai to chain LLM steps: take a few inputs (name, age,
          nationality), infer personality traits, and recommend accommodation. It worked technically,
          but it exposed a fundamental misunderstanding.
        </p>
        <p className="paragraph-new">
          I was using a language model as a recommendation engine, competing directly with mature
          algorithms that Booking.com and Expedia already run far better. LLMs aren&rsquo;t good at
          ranking hotels. They&rsquo;re good at language, context, and tone. That realisation changed
          everything about the project&rsquo;s direction.
        </p>
      </>
    ),
  },
  {
    number: '03',
    title: 'The Pivot',
    summary: 'Shifted focus to post-purchase, where language models have a real advantage.',
    panel: (
      <>
        <p className="paragraph-new">
          I stopped trying to beat recommendation engines and started thinking about where language
          models genuinely excel. The answer was the post-purchase moment.
        </p>
        <p className="paragraph-new">
          After you book a trip, every platform gives you the same generic confirmation page
          regardless of who you are. But by that point, the platform already knows your destination,
          dates, group type, purpose, and experience level. What if AI could use that data to generate
          a checkout page that actually helps you, one that&rsquo;s specific to your trip, your
          background, and your needs? No prompts, no chat interface. Just a page that adapts.
        </p>
      </>
    ),
  },
  {
    number: '04',
    title: 'Building the Prototype',
    summary: 'AI pipeline, prompt engineering, and the challenges of getting real specificity.',
    panel: (
      <>
        <p className="paragraph-new">
          I built a working pipeline: inputs fed into a multi-step AI process (persona building, gap
          identification, content generation) that returned structured content inserted directly into
          the page. No reloads, no buttons.
        </p>
        <p className="paragraph-new">Along the way I wrestled with three core challenges:</p>
        <ul className="aip-process__list paragraph-new" role="list">
          <li>
            <strong>Getting useful specificity instead of generic filler.</strong> Early outputs read
            like travel brochure copy. I restructured the prompts and upgraded through model versions
            until the system produced concrete, destination-specific advice.
          </li>
          <li>
            <strong>Avoiding cultural stereotypes.</strong> Early prompts made brittle assumptions tied
            to nationality and occupation. I added guardrails and shifted to neutral, evidence-based
            phrasing.
          </li>
          <li>
            <strong>Balancing structure and creativity.</strong> The output needed to be predictable
            enough for the UI (structured JSON with headings, bullets, tips) while leaving room for
            genuinely helpful, unexpected suggestions like seasonal events or nearby day trips.
          </li>
        </ul>
        <AiProcessPrototypeLinks />
      </>
    ),
  },
  {
    number: '05',
    title: 'Personal Rebuild',
    summary: 'Rebuilt the entire system independently. Twice.',
    panel: (
      <>
        <p className="paragraph-new">
          After the semester ended, I kept going. The first rebuild moved the stack to Webflow on the
          front end, Vercel as the server layer, and Wordware for the AI pipeline. Webflow&rsquo;s
          JavaScript collected inputs, Vercel orchestrated the request, Wordware ran the multi-step AI
          process and returned structured JSON, and the UI injected content directly into the page
          components. No reloads, no prompts. It worked.
        </p>
        <p className="paragraph-new">
          Then as models improved, the structured prompt-chaining logic in Wordware became unnecessary
          overhead. Newer models could handle the full persona-building, gap-identification, and
          content-generation pipeline in a single well-crafted prompt. The abstraction layer was adding
          latency without adding value.
        </p>
        <p className="paragraph-new">
          So I rebuilt again. This time from scratch: a Next.js application with an API route calling
          Claude (Anthropic&rsquo;s model) directly via the SDK. The prompt, validation, and response
          normalisation all happen server-side. The output renders as expandable cards in the browser.
          Faster, cleaner, and fully under my control.
        </p>
        <p className="paragraph-new">
          The version on this page is that second rebuild. It&rsquo;s not the university prototype and
          it&rsquo;s not the Webflow/Wordware version. It&rsquo;s a proof of concept I built
          independently because I believed the idea was worth pursuing.
        </p>
        <p className="paragraph-new aip-process__learn-heading">
          What I learned across all three versions:
        </p>
        <ul className="aip-process__list paragraph-new" role="list">
          <li>
            <strong>Product judgement matters more than novelty.</strong> Place AI where it&rsquo;s
            comparatively strong: language, explanation, tone, and context.
          </li>
          <li>
            <strong>Invisible AI is a design decision.</strong> Proactive, context-aware content beats
            another chatbot.
          </li>
          <li>
            <strong>Technical depth compounds.</strong> Each rebuild taught me more about API design,
            JSON contracts, async flows, prompt engineering, and frontend rendering patterns.
          </li>
          <li>
            <strong>Data viability over data hunger.</strong> Use the rich data travel companies already
            have. Don&rsquo;t burden the user.
          </li>
          <li>
            <strong>Ethics and inclusion require active effort.</strong> Steer clear of cultural
            stereotyping. Prioritise neutral, practical guidance.
          </li>
        </ul>
      </>
    ),
  },
] as const;

function lineProgressPct(activeIndex: number, total: number): string {
  if (total <= 1) return '0%';
  return `${(activeIndex / (total - 1)) * 100}%`;
}

export default function AiProcess() {
  const { sectionRef, activeIndex, selectStep, sectionHoverProps } = useStepperAutoCycle({
    stepCount: PHASES.length,
    intervalMs: AUTO_INTERVAL_MS,
  });

  const trackStyle = {
    '--aip-process-line-pct': lineProgressPct(activeIndex, PHASES.length),
  } as CSSProperties;

  const phase = PHASES[activeIndex];

  return (
    <section
      id="section--story"
      ref={sectionRef as RefObject<HTMLElement>}
      className="default-section aip-process"
      {...sectionHoverProps}
    >
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">The Journey</span>
        </div>

        <h2 className="h2">How this project evolved</h2>

        <p className="paragraph-new width-limit aip-process__intro">
          From a 7-week university sprint to an independently rebuilt proof of concept.
        </p>

        <nav className="aip-process__stepper" aria-label="Project evolution phases">
          <div className="aip-process__track" style={trackStyle}>
            <div className="aip-process__line-bg" aria-hidden />
            <div className="aip-process__line-fill" aria-hidden />
            <div className="aip-process__nodes">
              {PHASES.map((step, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                  <button
                    key={step.number}
                    type="button"
                    className={`aip-process__node${isActive ? ' aip-process__node--active' : ''}${isPast ? ' aip-process__node--past' : ''}${!isActive && !isPast ? ' aip-process__node--future' : ''}`}
                    onClick={() => selectStep(i)}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="aip-process__dot-wrap" aria-hidden>
                      <span className="aip-process__dot" />
                    </span>
                    <span className="aip-process__number">{step.number}</span>
                    <span className="aip-process__node-title">{step.title}</span>
                    <span className="aip-process__node-summary">{step.summary}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="aip-process__panel" aria-live="polite">
          <div key={activeIndex} className="aip-process__panel-inner">
            {phase.panel}
          </div>
        </div>
      </div>
    </section>
  );
}
