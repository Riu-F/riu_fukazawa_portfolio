'use client';

import Link from 'next/link';

export default function SupermarketCaseStudyClosing() {
  return (
    <section className="smp-case-close" aria-label="Closing">
      <div className="default-container w-container smp-case-close__inner">
        <p className="smp-case-close__statement">
          This project started with a simple observation: supermarkets are built for the store, not for the
          shopper. Everything we researched, designed, and tested came back to that. Accessibility isn&apos;t a
          feature you add at the end. It&apos;s a lens that changes how you design from the start. That&apos;s
          what I&apos;ll carry into everything I work on next.
        </p>
        <div className="smp-case-close__actions">
          <button type="button" className="smp-case-close__btn" onClick={() => scrollToCaseStudyTop()}>
            Back to top
          </button>
          <Link href="/" className="smp-case-close__btn smp-case-close__btn--link">
            View all projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function scrollToCaseStudyTop() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
}
