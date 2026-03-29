'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function AiHowItWorks() {
  const contentRef = useRef<HTMLDivElement>(null);
  const progress   = useScrollProgress(contentRef as React.RefObject<HTMLElement | null>);

  return (
    <div className="default-section">
      <div className="default-container w-container">
        <div className="timeline-heading-div">
          <h2 className="h2">how does it work?</h2>
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
                <div className="h5">Gathering Known Data</div>
                <p className="paragraph-new">
                  The program begins by combining any existing user information—such as travel
                  preferences, past destinations and experiences, and demographic details such as
                  occupation, age and gender — with real-time data about the searched destination,
                  including weather, hotels, activities, customs requirements and cultural factors.
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
                <div className="h5">1. Webflow: Collecting and Sending User Data</div>
                <p className="paragraph-new">
                  The program begins by combining any existing user information—such as travel
                  preferences, past destinations and experiences, and demographic details such as
                  occupation, age and gender — with real-time data about the searched destination,
                  including weather, hotels, activities, customs requirements and cultural factors.
                </p>
                <div className="h5">2. Vercel: The Middle Layer</div>
                <p className="paragraph-new">
                  Vercel acts as the server-side logic layer. It receives the JSON payload from
                  Webflow and forwards it to the <strong>Wordware API</strong>.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="timeline10_row">
              <div className="timeline10_item">
                <div className="big-number">02</div>
                <div className="h5">Persona Expansion</div>
                <p className="paragraph-new">
                  Using the combined input, the system builds a more detailed travel persona. This
                  includes generalising traits and expanding on inferred needs, like budget
                  considerations, temporal experience, language support, climatic needs&hellip;
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
                <div className="h5">3. Wordware + ChatGPT: AI Personalisation Pipeline</div>
                <p className="paragraph-new">
                  This is where the real magic happens. Wordware runs a three-step internal AI
                  process (using ChatGPT) to generate hyper-personalised output:
                </p>
                <ul role="list" className="list-numbered paragraph-new">
                  <li className="list-item-new">
                    <div>
                      <strong>Persona Building:</strong> It expands on the input data to create a
                      rich persona. For example, if a user says they&rsquo;re from Indonesia, it
                      infers relevant contextual traits (e.g., culturally diverse, tropical climate,
                      language background).
                    </div>
                  </li>
                  <li className="list-item-new">
                    <div>
                      <strong>Gap Identification:</strong> It analyses what the user might not know
                      about the destination — identifying gaps between their background and where
                      they&rsquo;re going. E.g., someone from Indonesia visiting Japan might need
                      info on colder weather, cultural norms, or local etiquette.
                    </div>
                  </li>
                  <li className="list-item-new">
                    <div>
                      <strong>Content Generation:</strong> It produces well-written, friendly
                      content that feels human and relevant, delivered in structured JSON (headings,
                      paragraphs, etc.).
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 03 */}
            <div className="timeline10_row">
              <div className="timeline10_item">
                <div className="big-number">03</div>
                <div className="h5">Personalised Checkout Page</div>
                <p className="paragraph-new">
                  Finally, the program generates a customised post-search checkout page. This page
                  includes tailored recommendations for accommodations, activities, health and
                  safety tips, required travel documents, and local transport options—curated to
                  align with the user&rsquo;s persona and destination data.
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
                <div className="h5">4. Back to Webflow: Displaying the Output</div>
                <p className="paragraph-new">
                  The AI&rsquo;s final output is sent back to Vercel, which filters and returns the
                  cleaned JSON. Webflow&rsquo;s JavaScript then takes that response and dynamically
                  inserts the content into the appropriate divs on the page — no page reloads, no
                  buttons, just seamless personalisation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
