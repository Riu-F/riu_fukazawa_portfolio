'use client';

import { useEffect, useRef, useState } from 'react';
import { AiInsightTag } from './AiInsightTag';

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

function StepTitle({
  tag,
  title,
}: {
  tag: React.ReactNode;
  title: string;
}) {
  return (
    <div className="aip-how__step-head">
      {tag}
      <div className="h5">{title}</div>
    </div>
  );
}

export default function AiHowItWorks() {
  const contentRef = useRef<HTMLDivElement>(null);
  const progress   = useScrollProgress(contentRef as React.RefObject<HTMLElement | null>);

  return (
    <div className="default-section">
      <div className="default-container w-container">
        <div className="timeline-heading-div">
          <h2 className="h2">how the system works</h2>
        </div>

        {/* Title row — hidden on mobile via .timeline10-top-labels-row */}
        <div className="timeline10_row timeline10-top-labels-row">
          <div className="timeline10_item">
            <div className="h3">(Basically)</div>
          </div>
          <div className="timeline10_circle-wrapper" />
          <div className="timeline10_item">
            <div className="h3">[Backend]</div>
          </div>
        </div>

        {/* Content with vertical line + rainbow progress */}
        <div className="timeline10_content" ref={contentRef}>
          <div className="timeline10_progress">
            <div className="timeline10_fade-overlay-top" />
            <div className="timeline10_line" />
            <div className="timeline10_fill" style={{ height: `${progress}%` }} />
            <div className="timeline10_fade-overlay-bottom" />
          </div>

          <div className="timeline10_list">
            {/* Step 01 */}
            <div className="timeline10_row">
              <div className="timeline10_item">
                <div className="big-number">01</div>
                <StepTitle
                  tag={<AiInsightTag principle="activate-data" />}
                  title="Known Data"
                />
                <p className="paragraph-new">
                  The system starts with what the travel platform already knows about you. Your
                  destination, dates, where you&rsquo;re flying from, group type, experience level,
                  interests, and budget. In a real platform, this data comes from the booking flow
                  and customer profile automatically. In the demo on this page, the form makes that
                  data visible so you can test how different inputs change the output.
                </p>
              </div>
              <div className="timeline10_circle-wrapper">
                <div className="timeline10_circle" />
              </div>
              <div className="timeline10_item">
                <div className="timeline-backend-marker">
                  <div className="grid---left-flex-horizontal">
                    <div className="ai-bubbles">[Backend]</div>
                  </div>
                </div>
                <div className="h5">1. Next.js Form &rarr; API Route</div>
                <p className="paragraph-new">
                  The front end collects traveller context through a structured form (11 fields:
                  name, destination, origin, dates, length of stay, age range, purpose, experience
                  level, budget, group type, interests). On submit, the form data is validated
                  client-side (destination is required, all others optional) and sent as a POST
                  request to a Next.js API route at /api/generate. An AbortController handles race
                  conditions if the user resubmits before a previous request completes.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="timeline10_row">
              <div className="timeline10_item">
                <div className="big-number">02</div>
                <StepTitle
                  tag={<AiInsightTag principle="invisible-ai" />}
                  title="Persona Inference"
                />
                <p className="paragraph-new">
                  Using the combined input, the AI builds a richer picture of who you are as a
                  traveller. A family from Jakarta visiting Tokyo in December isn&rsquo;t just
                  &ldquo;family, Tokyo.&rdquo; The model infers that they&rsquo;re likely first-time
                  overseas travellers from a tropical climate heading into winter, probably needing
                  visa guidance, cold-weather clothing advice, kid-friendly transport options, and
                  halal food recommendations. It identifies the gaps between your background and your
                  destination.
                </p>
              </div>
              <div className="timeline10_circle-wrapper">
                <div className="timeline10_circle" />
              </div>
              <div className="timeline10_item">
                <div className="timeline-backend-marker">
                  <div className="grid---left-flex-horizontal">
                    <div className="ai-bubbles">[Backend]</div>
                  </div>
                </div>
                <div className="h5">2. Claude Haiku via Anthropic SDK</div>
                <p className="paragraph-new">
                  The API route calls Claude Haiku (claude-haiku-4-5-20251001) through the Anthropic
                  SDK with a structured prompt. The prompt instructs the model to perform three
                  reasoning steps in sequence: first, expand the raw traveller data into a rich
                  persona (inferring cultural context, climate familiarity, experience gaps, and
                  likely concerns). Second, identify what this specific traveller probably
                  doesn&rsquo;t know about their destination. Third, generate structured content
                  addressing those gaps. The model returns JSON matching a strict schema: a title,
                  subtitle, trip info summary, and exactly three expandable cards, each with a
                  heading, summary, tag, and detailed sections containing bullet points and tips.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="timeline10_row">
              <div className="timeline10_item">
                <div className="big-number">03</div>
                <StepTitle
                  tag={<AiInsightTag principle="post-purchase" />}
                  title="Personalised Output"
                />
                <p className="paragraph-new">
                  The system generates a customised confirmation page. Instead of a generic
                  &ldquo;booking confirmed&rdquo; screen, the traveller sees a personalised header
                  addressing them by name and trip context, a trip summary card, and three
                  expandable recommendation cards covering the specific areas most relevant to their
                  situation. Different travellers seeing the same UI get completely different content,
                  tone, and priorities.
                </p>
              </div>
              <div className="timeline10_circle-wrapper">
                <div className="timeline10_circle" />
              </div>
              <div className="timeline10_item">
                <div className="timeline-backend-marker">
                  <div className="grid---left-flex-horizontal">
                    <div className="ai-bubbles">[Backend]</div>
                  </div>
                </div>
                <div className="h5">3. Structured JSON &rarr; React Components</div>
                <p className="paragraph-new">
                  The API route validates and normalises the Claude response server-side before
                  returning it as {'{ ok: true, checkout: CheckoutData }'}. The front end receives
                  the structured JSON and renders it through a shared CheckoutOutput component: a
                  browser-chrome-framed card layout with a confirmation header, trip info grid, and
                  three expandable cards. Each card uses flex-grow animation for smooth expansion.
                  The same rendering component is used by both the preloaded hero demo (with mock
                  data) and the live generator (with API data), ensuring visual consistency. Icon
                  names in the response are validated against a known set and fall back to a default
                  compass icon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
