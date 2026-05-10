import type { ReactNode } from 'react';

import { InsightTag, type CaseStudyInsight } from '../InsightTag';

type Props = {
  title: string;
  preview: string;
  insight: CaseStudyInsight;
  children: ReactNode;
};

export function UserTestingMethodAccordion({ title, preview, insight, children }: Props) {
  return (
    <details className="ut-method-details">
      <summary className="ut-method-details__summary">
        <div className="ut-method-details__summary-main">
          <div className="ut-method-details__title-row">
            <span className="ut-method-details__title">{title}</span>
            <InsightTag insight={insight} />
          </div>
          <p className="ut-method-details__preview">{preview}</p>
        </div>
        <span className="ut-method-details__chevron" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
          </svg>
        </span>
      </summary>
      <div className="ut-method-details__body">
        <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">{children}</div>
      </div>
    </details>
  );
}
