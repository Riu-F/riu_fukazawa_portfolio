import { PublicFolderLightboxGallery } from '@/app/components/gallery';

import { ProjectDetailsAccordion } from '../../components/project-page/ProjectDetailsAccordion';
import { IdeationIdeaCards } from './IdeationIdeaCards';
import { InsightTag } from './InsightTag';

export default function SupermarketIdeation() {
  return (
    <section id="smp-section-ideation" className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Ideation</h2>
        <p className="paragraph-new">
          We needed to go wide before we could go narrow. Using brainstorming, brain writing, Crazy 8s, and
          reverse thinking, we generated as many ideas as possible across every pain point we&apos;d
          identified, without filtering for quality yet.
        </p>

        <PublicFolderLightboxGallery
          folder="super-market-navigation/ideation"
          groupAriaLabel="Ideation sketch thumbnails"
          lightboxAriaLabel="Ideation sketch"
          imageAltPrefix="Ideation sketch"
        />

        <div className="ideation-accordion-wrap">
          <ProjectDetailsAccordion title="How we combined ideas">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                Our strongest concept didn&apos;t come from a single brainstorm. It emerged from combining
                separate ideas that each targeted different parts of the problem—threads like structured
                shopping lists <InsightTag insight="distraction" />
                {', '}map-led wayfinding <InsightTag insight="navigation" />
                {', '}and refreshed aisle signage <InsightTag insight="navigation" />.
              </p>
              <p>
                The process was informal but deliberate. Each team member pitched their ideas to the group,
                including the impractical ones. We&apos;d then build on top of them: adding features,
                identifying advantages, or connecting them to specific pain points from our research. At
                this stage nothing came off the table. We were expanding, not narrowing. The narrowing came
                later through a decision matrix.
              </p>
            </div>
          </ProjectDetailsAccordion>
        </div>

        <h3 className="h4 ideation-other-title">Other ideas we explored</h3>
        <IdeationIdeaCards />
      </div>
    </section>
  );
}
