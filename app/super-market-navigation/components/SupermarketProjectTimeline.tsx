'use client';

const SCROLL_OPTS: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' };

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView(SCROLL_OPTS);
}

type Segment = {
  id: string;
  label: string;
  range: string;
  /** grid-column start (1-based), inclusive */
  colStart: number;
  /** number of week columns spanned */
  span: number;
  tone: 'research' | 'synthesis' | 'ideation' | 'proto' | 'product';
  /** optional short line inside segment (e.g. repeated 3×) */
  annotation?: string;
};

const MAIN_SEGMENTS: Segment[] = [
  { id: 'smp-section-research-landscape', label: 'Research', range: 'Weeks 1–2', colStart: 1, span: 2, tone: 'research' },
  { id: 'smp-section-affinity-diagramming', label: 'Research Synthesis', range: 'Week 3', colStart: 3, span: 1, tone: 'synthesis' },
  { id: 'smp-section-ideation', label: 'Ideation', range: 'Weeks 3–4', colStart: 3, span: 2, tone: 'ideation' },
  {
    id: 'smp-section-prototyping',
    label: 'Prototype + Testing',
    range: 'Weeks 5–10',
    colStart: 5,
    span: 6,
    tone: 'proto',
    annotation: 'repeated 3×',
  },
  { id: 'smp-section-evaluation', label: 'Product Development', range: 'Weeks 10–12', colStart: 11, span: 2, tone: 'product' },
];

export default function SupermarketProjectTimeline() {
  return (
    <div className="smp-project-timeline" aria-label="Project phases across the 12-week studio">
      <div className="smp-project-timeline__intro">
        <h3 className="smp-project-timeline__subheading">Project Timeline</h3>
        <p className="smp-project-timeline__hint">Click a phase to jump to that part of the case study.</p>
      </div>

      {/* Desktop / tablet: horizontal proportional bar */}
      <div className="smp-project-timeline__horiz">
        <div className="smp-project-timeline__track-wrap">
          <div className="smp-project-timeline__week-ruler" aria-label="Week numbers 1 to 12">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="smp-project-timeline__tick" aria-hidden="true">
                {i + 1}
              </span>
            ))}
          </div>
          <div className="smp-project-timeline__track">
            <div className="smp-project-timeline__grid12">
              {MAIN_SEGMENTS.map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  className={`smp-project-timeline__seg smp-project-timeline__seg--${seg.tone}`}
                  style={{
                    gridColumn: `${seg.colStart} / span ${seg.span}`,
                  }}
                  onClick={() => scrollToId(seg.id)}
                  aria-label={`${seg.label}, ${seg.range}. Scroll to section.`}
                >
                  <span className="smp-project-timeline__seg-label">{seg.label}</span>
                  {seg.annotation ? (
                    <span className="smp-project-timeline__seg-note">{seg.annotation}</span>
                  ) : null}
                  <span className="smp-project-timeline__seg-tip" aria-hidden="true">
                    <span className="smp-project-timeline__seg-tip-title">{seg.label}</span>
                    <span className="smp-project-timeline__seg-tip-range">{seg.range}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="smp-project-timeline__connector" aria-hidden="true" />
          <button
            type="button"
            className="smp-project-timeline__seg smp-project-timeline__seg--demo"
            onClick={() => scrollToId('smp-section-evaluation-gallery')}
            aria-label="Demo Development, after university. Scroll to evaluation gallery."
          >
            <span className="smp-project-timeline__seg-label smp-project-timeline__seg-label--post">
              Demo Development
            </span>
            <span className="smp-project-timeline__seg-range">After uni</span>
            <span className="smp-project-timeline__seg-tip" aria-hidden="true">
              <span className="smp-project-timeline__seg-tip-title">Demo Development</span>
              <span className="smp-project-timeline__seg-tip-range">After university</span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile: vertical list, same scroll targets */}
      <ul className="smp-project-timeline__vertical">
        {MAIN_SEGMENTS.map((seg) => (
          <li key={`v-${seg.id}`}>
            <button
              type="button"
              className={`smp-project-timeline__v-row smp-project-timeline__v-row--${seg.tone}`}
              onClick={() => scrollToId(seg.id)}
              aria-label={`${seg.label}, ${seg.range}. Scroll to section.`}
            >
              <span className="smp-project-timeline__v-bar" aria-hidden="true" />
              <span className="smp-project-timeline__v-text">
                <span className="smp-project-timeline__v-title">{seg.label}</span>
                <span className="smp-project-timeline__v-range">{seg.range}</span>
                {seg.annotation ? (
                  <span className="smp-project-timeline__v-note">{seg.annotation}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="smp-project-timeline__v-row smp-project-timeline__v-row--demo"
            onClick={() => scrollToId('smp-section-evaluation-gallery')}
            aria-label="Demo Development, after university. Scroll to evaluation gallery."
          >
            <span className="smp-project-timeline__v-bar" aria-hidden="true" />
            <span className="smp-project-timeline__v-text">
              <span className="smp-project-timeline__v-title smp-project-timeline__v-title--italic">
                Demo Development
              </span>
              <span className="smp-project-timeline__v-range">After university</span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
