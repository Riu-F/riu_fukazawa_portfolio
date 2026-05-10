import { ProjectDetailsAccordion } from '../../components/project-page/ProjectDetailsAccordion';
import { InsightTag } from './InsightTag';

/** Replace `matrix-screenshot.jpg` in this folder for a higher-res asset (see README there). */
const DECISION_MATRIX_IMAGE_SRC = '/super-market-navigation/decision-matrix/matrix-screenshot.jpg';

const DECISION_MATRIX_SHEETS_URL =
  'https://docs.google.com/spreadsheets/d/17gjeB6U-RfetEQyOiYP4uZ00ATwD1IO1WUTec7EavGM/edit?usp=sharing';

export default function SupermarketDesignConcept() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <div className="w-layout-grid _1x2-grid-2-3">
          <div>
            <div className="grid---left-flex-horizontal h3-headings" />
            <h2 className="h2">Decision Matrix</h2>
            <p className="paragraph-new">
              With a wall of ideas in front of us, we needed a structured way to narrow them down. We built
              a decision matrix that scored each concept against our three core insights (
              <InsightTag insight="navigation" />
              {', '}
              <InsightTag insight="communication" />
              {', '}and <InsightTag insight="distraction" />
              ), general accessibility criteria, and specific support for cognitive disabilities like dyslexia,
              ADHD, ASD, and memory impairment.
            </p>
            <p className="paragraph-new">
              The winner: a shopping list and map app. It scored highest across the board because it could
              realistically address navigation, assistance, and cognitive load within a single interface,
              while also meeting the accessibility standards we&apos;d identified through our secondary
              research.
            </p>
          </div>
          <div className="decision-matrix-media">
            <img
              src={DECISION_MATRIX_IMAGE_SRC}
              loading="lazy"
              alt="Decision matrix spreadsheet scoring concepts against research insights and accessibility criteria"
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 940px"
              className="image---full-height"
            />
            <a
              href={DECISION_MATRIX_SHEETS_URL}
              className="decision-matrix-full-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View full matrix
            </a>
          </div>
        </div>

        <div className="decision-matrix-accordion-wrap">
          <ProjectDetailsAccordion title="Why this concept won">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>The app concept gave us the widest coverage across our decision criteria: it directly addressed all three insights.</p>
              <p>
                <InsightTag insight="navigation" /> Navigation through in-store mapping and guided routing.
              </p>
              <p>
                <InsightTag insight="communication" /> Communication through built-in assistance flows that
                reduce the need to find and ask staff.
              </p>
              <p>
                <InsightTag insight="distraction" /> Distraction through structured shopping lists and planned
                routes that keep users focused.
              </p>
              <p>
                It supported cognitive disability-specific needs we&apos;d researched: simplified language
                and audio alternatives for dyslexia, minimal layouts and checklists for ADHD, predictable
                interfaces and sensory customisation for ASD, and step-by-step guidance with progress
                tracking for memory impairments.
              </p>
              <p>
                It also met general accessibility benchmarks across physical, visual, auditory, and speech
                accessibility.
              </p>
              <p>
                One constraint worth noting: this was a university project that required our solution to
                span digital, physical, and spatial design. This influenced some early decisions, like
                incorporating a physical sectioned basket system into the concept. That feature was later
                dropped after testing showed it wasn&apos;t effective, but at this stage it was part of our
                thinking.
              </p>
            </div>
          </ProjectDetailsAccordion>
        </div>
      </div>
      <div className="full-width-container" />
    </section>
  );
}
