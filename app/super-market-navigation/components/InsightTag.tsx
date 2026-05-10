import type { HTMLAttributes } from 'react';

export type CaseStudyInsight = 'navigation' | 'communication' | 'distraction';

const CONFIG: Record<CaseStudyInsight, { emoji: string; label: string }> = {
  navigation: { emoji: '🧭', label: 'Navigation' },
  communication: { emoji: '💬', label: 'Communication' },
  distraction: { emoji: '🧠', label: 'Distraction' },
};

export type InsightTagProps = {
  insight: CaseStudyInsight;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

/**
 * Inline research insight pill for the supermarket case study. Drop inside copy or next to titles.
 */
export function InsightTag({ insight, className = '', ...rest }: InsightTagProps) {
  const c = CONFIG[insight];
  return (
    <span
      className={`insight-tag insight-tag--${insight} ${className}`.trim()}
      {...rest}
    >
      <span className="insight-tag__emoji" aria-hidden="true">
        {c.emoji}
      </span>
      <span className="insight-tag__label">{c.label}</span>
    </span>
  );
}
