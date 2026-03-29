'use client';

import { useEffect, useRef, useState } from 'react';
import AiImageCarousel from './AiImageCarousel';

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      const traveled = vh - rect.top;
      const total    = rect.height + vh;
      setProgress(Math.max(0, Math.min(100, (traveled / total) * 100)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [ref]);
  return progress;
}

const PHASES = [
  {
    phase: 'Phase 01\nStart',
    label: 'Assumptions',
    content: (
      <>
        <p className="paragraph-new white">
          This project began as a university brief to apply AI meaningfully—find a problem space
          and design an intervention. I started fast: a Wordware.ai prototype that ingested a few
          simple inputs (name, age, nationality) and chained LLM steps to infer personality traits
          and recommend accommodation. It worked—but that early success exposed a bigger truth:{' '}
          <strong>LLMs aren&rsquo;t recommendation engines.</strong> They&rsquo;re language models.
          What I&rsquo;d built competed with mature, data-driven algorithms already used by
          Booking.com, Expedia, and Trip.com, and brought no clear advantage. That realisation was a
          turning point: learn the difference, and use the right tool for the job.
        </p>
        <p className="paragraph-new white">
          Rather than force LLMs into matching tasks, I reframed the problem around their natural
          strength—language and context. If algorithms are excellent at ranking hotels, what&rsquo;s
          missing is the human layer: the &ldquo;why,&rdquo; the nuance, the <em>for-you</em> context
          that lives in copy, guidance, and tone. I shifted the focus to the post-purchase moment
          (checkout/confirmation), where personalisation usually disappears. The question became:{' '}
          <strong>
            What if AI could quietly reshape page content based on known user data—no chat prompts,
            no buttons—so the experience felt specific, timely, and helpful?
          </strong>
        </p>
        {/* Post-purchase screen examples */}
        <AiImageCarousel />
      </>
    ),
  },
  {
    phase: 'Phase 02\nConcept',
    label: 'Refined Concept',
    content: (
      <p className="paragraph-new white">
        From there, the concept crystallised: expand the user profile with contextual inference,
        identify gaps between a traveller&rsquo;s background and destination (e.g., a warm-climate
        traveller heading to a cold country; a family vs a solo traveller), and generate dynamic,
        structured content—packing advice, etiquette notes, seasonal tips, transport options—inserted
        directly into the page.
      </p>
    ),
  },
  {
    phase: 'Phase 03\nMVP',
    label: 'Iteration',
    content: (
      <>
        <p className="paragraph-new white">
          I iterated the AI pipeline extensively in Wordware: refining prompt stages (Persona
          &rarr; Gap Identification &rarr; Output), enforcing structured JSON, and tuning style and
          tone. Along the way, I wrestled with three core LLM challenges:
        </p>
        <ul role="list" className="paragraph-new white">
          <li style={{ listStyleType: 'none', paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
            ▪&nbsp;&nbsp;<strong>Useful depth vs fluff:</strong> securing concrete,
            destination-specific advice rather than generic filler. (Improved with prompt
            restructuring and model upgrades—from early runs to later models that handled reasoning
            better.)
          </li>
          <li style={{ listStyleType: 'none', paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
            ▪&nbsp;&nbsp;<strong>Avoiding stereotypes:</strong> removing brittle assumptions tied to
            nationality/occupation; adding guardrails and neutral, evidence-based phrasing.
          </li>
          <li style={{ listStyleType: 'none', paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
            ▪&nbsp;&nbsp;<strong>Structure vs creativity:</strong> keeping JSON predictable for the
            UI while leaving room for delightful, serendipitous suggestions (nearby cities, seasonal
            events).
          </li>
        </ul>
      </>
    ),
  },
  {
    phase: 'Phase 4\nPrototype Development',
    label: 'Low Fidelity Prototype',
    content: (
      <>
        <p className="paragraph-new white">
          Mid-sprint I built a working demo with a local site: a Python script gathered inputs,
          called Wordware, and returned clean text. I briefly integrated a hotel search API to add
          live properties and used AI to explain why a place might suit a given traveller—but I cut
          it due to token costs and because it risked drifting back into
          &ldquo;recommendation engine&rdquo; territory. The learning: be ruthless about scope; keep
          the AI where it adds unique value.
        </p>
        <div className="margin-bottom-xlarge">
          <div className="inline-block">
            <a
              href="https://www.figma.com/proto/CSquBVgWMu5arEto9KXHbg/Visual-Report?node-id=0-1&t=2PJaHZ0rkJ6AofgL-1"
              target="_blank"
              rel="noopener noreferrer"
              className="timeline_link"
            >
              <div>Our Slide Deck</div>
              <svg className="link-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 13L13 7M13 7H7M13 7v6"/></svg>
            </a>
            <a
              href="https://app.wordware.ai/explore/apps/d46b28f1-2b84-4276-ac17-b0d352c197ad"
              target="_blank"
              rel="noopener noreferrer"
              className="timeline_link"
            >
              <div>Wordware project</div>
              <svg className="link-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 13L13 7M13 7H7M13 7v6"/></svg>
            </a>
            <a
              href="https://github.com/loganbondoc/DECO3000"
              target="_blank"
              rel="noopener noreferrer"
              className="timeline_link"
            >
              <div>Github code</div>
              <svg className="link-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 13L13 7M13 7H7M13 7v6"/></svg>
            </a>
          </div>
        </div>
      </>
    ),
  },
  {
    phase: 'Phase 5\nPrototype Refinement',
    label: 'Personal Project',
    content: (
      <>
        <p className="paragraph-new white">
          After the class and semester ended, I&rsquo;ve kept going. I rewrote the integration from
          scratch: Webflow on the front, Vercel as the server layer, Wordware for the AI pipeline.
          Webflow JS now collects inputs, Vercel orchestrates the request, Wordware returns structured
          JSON (headings, paragraphs, cards), and the UI injects content directly into the right
          components—no reloads, no prompts. The result is a proof-of-concept that feels like the
          page simply knows you.
        </p>
        <p className="paragraph-new white">What I learned (and applied):</p>
        <ul role="list" className="paragraph-new white">
          {[
            <><strong>Product judgement:</strong> don&rsquo;t chase novelty; place AI where it&rsquo;s <em>comparatively</em> strong (language, explanation, tone, context).</>,
            <><strong>Invisible AI</strong> is a design decision: proactive, context-aware content beats another chatbot.</>,
            <><strong>Technical depth:</strong> API design, JSON contracts, async flows, prompt design/guardrails, and front-end injection patterns for dynamic content.</>,
            <>Data viability &gt; data hunger: use the rich data travel companies already have; don&rsquo;t burden the user.</>,
            <><strong>Ethics &amp; inclusion:</strong> steer clear of cultural stereotyping; prioritise neutral, practical guidance. I&rsquo;m genuinely energised by where this landed. It&rsquo;s not a chatbot and it&rsquo;s not a recommender—it&rsquo;s a quiet layer that makes the web feel more considerate.</>,
          ].map((item, i) => (
            <li key={i} style={{ listStyleType: 'none', paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
              ▪&nbsp;&nbsp;{item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    phase: '🚀 Future\nDirections',
    label: null,
    content: (
      <>
        <div className="margin-bottom-medium">
          <div className="h5 white">Performance and Speed</div>
          <p className="paragraph-new white">
            Right now, the system&rsquo;s biggest limitation is speed. Each round of reasoning inside
            Wordware adds latency, and Wordflow itself slows down the response chain. In future
            iterations, I plan to interface directly with the ChatGPT API rather than relying on
            Wordware, allowing tighter control over token usage and request flow. By streamlining
            the logic and reducing token count, the system could return results faster while still
            maintaining contextual depth.
          </p>
        </div>
        <div className="margin-bottom-medium">
          <div className="h5 white">Adapting to New Models</div>
          <p className="paragraph-new white">
            This project began on ChatGPT-3.0 and later upgraded through 4.0 and 5.0, with each
            model bringing exponential improvements in reasoning, context retention, and nuance. As
            these models evolve, the prompting strategy will need to evolve too. Where earlier
            versions required explicit instructions to &ldquo;consider culture, weather, and group
            type,&rdquo; newer ones infer these automatically. The design challenge ahead lies in
            re-tuning prompts and logic to match each model&rsquo;s strengths, ensuring the system
            remains efficient, adaptive, and intelligent.
          </p>
        </div>
      </>
    ),
  },
];

export default function AiProcess() {
  const innerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(innerRef as React.RefObject<HTMLElement | null>);

  return (
    <div id="section--story" className="section-story-timeline">
      {/* Intro */}
      <div className="container-limit-width story-intro">
        <h1 className="h5 no-spacing white">The story:</h1>
        <p className="paragraph-new white" style={{ marginTop: '1rem', maxWidth: '65ch' }}>
          Every project starts with curiosity, and this one began with a question: What if AI could
          make a website feel genuinely personal—without the user ever typing, clicking, or asking?
        </p>
      </div>

      <div className="aip-story-phases" style={{ position: 'relative' }} ref={innerRef}>
        {/* Rainbow progress fill — spans full height of the phases */}
        <div className="story-progress-track" aria-hidden="true">
          <div className="story-progress-fill" style={{ height: `${progress}%` }} />
        </div>

        <div className="overlay-fade-top" />

        {PHASES.map((phase, i) => (
          <div key={i} className="timeline_item">
            {/* Left: phase label */}
            <div className="timeline_left">
              <div className="timeline_date-text">
                {phase.phase.split('\n').map((line, li) => (
                  <span key={li} style={li > 0 ? { display: 'block' } : undefined}>{line}</span>
                ))}
              </div>
            </div>

            {/* Centre: vertical line + sticky circle */}
            <div className="timeline_centre">
              <div className="timeline_circle" />
            </div>

            {/* Right: content */}
            <div className="timeline_right">
              <div className="margin-bottom-medium">
                {phase.label && <div className="h5 white">{phase.label}</div>}
                {phase.content}
              </div>
            </div>
          </div>
        ))}

        <div className="overlay-fade-bottom" />
      </div>
    </div>
  );
}
