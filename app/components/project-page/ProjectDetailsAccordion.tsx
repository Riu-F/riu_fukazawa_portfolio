import type { ReactNode } from 'react';

function Chevron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" className="g_svg">
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

/**
 * Native &lt;details&gt; accordion matching the Webflow project-page pattern
 * (summary + chevron, block-size animation via scoped CSS on .aip.smp or similar).
 */
export function ProjectDetailsAccordion({
  title,
  children,
  className = '',
}: {
  /** Plain string or inline elements (e.g. insight tags next to the heading). */
  title: ReactNode;
  children: ReactNode;
  /** Extra classes on the root `details` element (e.g. compact variants). */
  className?: string;
}) {
  return (
    <details className={`accordion_1_component ${className}`.trim()}>
      <summary className="accordion_toggle">
        <span className="span u-text-style-h5 accordion_1_title_slot">{title}</span>
        <div data-accordion="icon" className="accordion_1_toggle_icon u-ratio-1-1 u-flex-noshrink">
          <Chevron />
        </div>
      </summary>
      <div className="accordion_1_content">
        <h3 className="u-sr-only">
          This is a long question or heading to teaser the hidden content
        </h3>
        {children}
      </div>
    </details>
  );
}
