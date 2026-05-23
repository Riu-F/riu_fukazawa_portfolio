'use client';

import { PublicFolderLightboxGalleryClient } from '@/app/components/gallery/PublicFolderLightboxGalleryClient';
import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';
import { useState } from 'react';

import AiProblemPersonalisedPreview from './AiProblemPersonalisedPreview';

const INTEGRATIONS_DIAGRAM_IMAGE =
  'https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6912e5dd37804ce44cabf19c_ai-posible-intergrations.png';

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion_1_component aip-problem__accordion">
      <button
        type="button"
        className="accordion_toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="span u-text-style-h5">{label}</span>
        <div
          className="accordion_1_toggle_icon"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ChevronDown />
        </div>
      </button>
      <div
        className="accordion_1_content"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="accordion_1_body">{children}</div>
        </div>
      </div>
    </div>
  );
}

type AiProblemClientProps = {
  bookingScreenshots: PublicFolderGalleryImage[];
};

export default function AiProblemClient({ bookingScreenshots }: AiProblemClientProps) {
  return (
    <section id="section--problem-space" className="default-section aip-problem">
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">The Problem</span>
        </div>

        <h2 className="h2">The dead end after booking</h2>

        <div className="aip-problem__stack">
          <div className="aip-problem__block">
            <span className="aip-problem__label">What you get today</span>
            <p className="aip-problem__subtitle">
              10 post-purchase confirmation pages from major travel platforms. All generic. All identical
              regardless of who booked.
            </p>
            <div className="aip-problem__evidence-zone">
              <div className="aip-problem__gallery-scroll-wrap">
                <PublicFolderLightboxGalleryClient
                  images={bookingScreenshots}
                  groupAriaLabel="Generic booking confirmation screenshots"
                  lightboxAriaLabel="Booking confirmation screenshot"
                  layout="horizontal"
                />
              </div>
            </div>
          </div>

          <div className="aip-problem__divider" aria-hidden>
            What it could look like
          </div>

          <div className="aip-problem__block aip-problem__block--solution">
            <span className="aip-problem__label">What you could get</span>
            <p className="aip-problem__subtitle">
              Same booking system. Same UI. Completely different content, adapted to Dewi&rsquo;s family
              trip to Tokyo.
            </p>
            <div className="aip-problem__solution-preview">
              <AiProblemPersonalisedPreview />
            </div>
          </div>
        </div>

        <p className="paragraph-new width-limit">
          You&rsquo;ve just booked a trip. You&rsquo;re excited. Then you hit the confirmation page:
          &ldquo;Your purchase is complete.&rdquo; A booking reference, a generic email, maybe an
          upsell for travel insurance. All that excitement, flattened into a transaction receipt.
        </p>
        <p className="paragraph-new width-limit">
          Travel platforms know an enormous amount about you at this point. Your destination, dates,
          group type, where you&rsquo;re flying from, how experienced a traveller you are. But none
          of that data shapes what happens after you click &ldquo;book.&rdquo; Personalisation powers
          the search and pricing engines, then vanishes the moment the transaction is complete.
        </p>
        <p className="paragraph-new width-limit aip-problem__lead-out">
          The post-purchase moment is where traveller anxiety is highest (what do I need to prepare?),
          where context is richest (the platform knows exactly what trip you&rsquo;ve booked), and where
          current platforms deliver the least value. Confirmation screens are designed for verification,
          not for the traveller. That gap is where this project sits.
        </p>

        <Accordion label="Mapping the opportunity space">
          <p className="paragraph-new">
            To ground the problem, I mapped all the touchpoints where AI could add contextual value
            using data platforms already collect, from marketing messages to after-purchase support.
            From this broader field, I deliberately narrowed the scope to a single, high-impact
            moment: the post-checkout trip confirmation page. It&rsquo;s the first point where excitement
            peaks, personal context is richest, and current platforms still default to generic,
            boilerplate content.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={INTEGRATIONS_DIAGRAM_IMAGE}
            loading="lazy"
            alt="Brainstorm diagram of AI-driven personalisation integration points across the travel booking journey"
            className="aip-problem__diagram"
          />
          <p className="aip-problem__caption aip-problem__caption--diagram">
            Brainstorm: AI-driven personalisation areas of possible integration across the travel
            booking journey.
          </p>
        </Accordion>
      </div>
    </section>
  );
}
