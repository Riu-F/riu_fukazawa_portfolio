'use client';

import Link from 'next/link';

export default function SuedeClosing() {
  return (
    <section className="suede-close" aria-label="Closing">
      <div className="suede-close__inner default-container w-container">
        <blockquote className="suede-close__quote">
          <p>
            The overlap between designing events and designing products is bigger than most people
            think.
          </p>
        </blockquote>

        <p className="suede-close__body">
          Both require understanding your audience, structuring an experience around their needs,
          coordinating across stakeholders, and iterating when something isn&apos;t working. The skills I
          built here, stakeholder management, experience design, team coordination, thinking about how
          people move through a structured flow, are the same ones I bring to product design work.
        </p>

        <div className="suede-close__actions">
          <button type="button" className="suede-close__btn" onClick={scrollToPageTop}>
            Back to top
          </button>
          <Link href="/" className="suede-close__btn suede-close__btn--link">
            View all projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function scrollToPageTop() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
}
