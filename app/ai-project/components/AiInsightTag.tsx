import type { CSSProperties, HTMLAttributes, SVGProps } from 'react';

export type AiInsightPrinciple = 'invisible-ai' | 'post-purchase' | 'activate-data';

const CONFIG: Record<
  AiInsightPrinciple,
  { label: string; color: string; textColor: string; bg: string }
> = {
  'invisible-ai': {
    label: 'Invisible AI',
    color: '#7b61ff',
    textColor: '#7b61ff',
    bg: 'rgba(123, 97, 255, 0.14)',
  },
  'post-purchase': {
    label: 'Post-purchase',
    color: '#4ecdc4',
    textColor: '#4ecdc4',
    bg: 'rgba(78, 205, 196, 0.14)',
  },
  'activate-data': {
    label: 'Activate Data',
    color: '#ffd166',
    textColor: '#8a6d00',
    bg: 'rgba(255, 209, 102, 0.15)',
  },
};

function IconInvisibleAi(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden {...props}>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconPostPurchase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden {...props}>
      <path
        d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6l2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M7 8h12M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconActivateData(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" aria-hidden {...props}>
      <circle cx="8" cy="14" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M11 11 20 4m0 0h-5m5 0v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<AiInsightPrinciple, typeof IconInvisibleAi> = {
  'invisible-ai': IconInvisibleAi,
  'post-purchase': IconPostPurchase,
  'activate-data': IconActivateData,
};

export type AiInsightTagProps = {
  principle: AiInsightPrinciple;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export function AiInsightTag({ principle, className = '', ...rest }: AiInsightTagProps) {
  const c = CONFIG[principle];
  const Icon = ICONS[principle];

  return (
    <span
      className={`ai-insight-tag ai-insight-tag--${principle} ${className}`.trim()}
      style={
        {
          '--ai-tag-color': c.color,
          '--ai-tag-text': c.textColor,
          '--ai-tag-bg': c.bg,
        } as CSSProperties
      }
      {...rest}
    >
      <Icon className="ai-insight-tag__icon" />
      <span className="ai-insight-tag__label">{c.label}</span>
    </span>
  );
}
