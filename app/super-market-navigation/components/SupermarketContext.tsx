import { ProjectDetailsAccordion } from '../../components/project-page/ProjectDetailsAccordion';
import SupermarketProjectTimeline from './SupermarketProjectTimeline';

export default function SupermarketContext() {
  return (
    <section className="default-section smp-context-timeline">
      <div className="default-container-2 w-container">
        <h2 className="h2">Project Context and Timeline</h2>

        <p className="paragraph-new-2 smp-context-timeline__problem">
          Supermarkets are high-stimulus, information-dense environments. For individuals with cognitive and
          learning disabilities such as dyslexia, ADHD, and ASD, they are often actively hostile spaces rather
          than neutral ones. Key challenges include difficulty navigating complex store layouts with unclear
          or inconsistent signage, limited access to timely assistance, and sensory overload caused by
          lighting, noise, crowds, and visual clutter. These barriers don&apos;t just slow shopping down, they
          increase stress and reduce independence. Despite this, accessibility in supermarkets is still
          largely framed around physical mobility, leaving cognitive accessibility under-addressed.
        </p>

        <SupermarketProjectTimeline />

        <div className="smp-context-drops">
          <ProjectDetailsAccordion title="Project Context">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                This project was completed as part of a semester-long group project in DECO3200: Interactive
                Product Design Studio, spanning 13 weeks. The course emphasised identifying, justifying, and
                responding to real-world problem spaces through research-driven product design, rather than
                jumping straight to solutions.
              </p>
            </div>
          </ProjectDetailsAccordion>

          <ProjectDetailsAccordion title="Scope">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                Our group chose to pursue the UX stream of the studio. This meant the primary focus was on
                user experience and product thinking: defining the problem space, grounding decisions in
                research, and justifying why a particular intervention was worth building. There was less
                emphasis on polished UI or engineering feasibility. While wireframes and flows were developed
                in Figma, there was no expectation to deliver a fully built or production-ready high-fidelity
                prototype. The value of the work sat in the clarity of the problem framing, the research depth,
                and the logic of the proposed system.
              </p>
            </div>
          </ProjectDetailsAccordion>

          <ProjectDetailsAccordion title="My Role">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                This was a group project with four members, and responsibilities were intentionally
                distributed. I took on a stronger leadership role within the team, helping guide the overall
                direction of the project and keeping the work aligned with our core problem statement.
              </p>
              <p>
                I played a major role in shaping the research approach, contributing heavily to both secondary
                research and the design of primary research and user testing methodologies. I was also solely
                responsible for building the wireframes and interaction flows in Figma, translating user
                testing insights into a coherent product structure and user journey.
              </p>
              <p>
                After the university project wrapped up, I independently built and coded the functional app
                mockup you see on this page using Claude Code and Cursor AI, as a proof of concept and an
                experiment in AI-assisted development.
              </p>
            </div>
          </ProjectDetailsAccordion>
        </div>
      </div>
    </section>
  );
}
