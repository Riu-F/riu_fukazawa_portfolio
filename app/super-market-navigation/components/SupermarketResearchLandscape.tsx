import { ResearchLandscapeCards } from './research-landscape/ResearchLandscapeCards';

export default function SupermarketResearchLandscape() {
  return (
    <section id="smp-section-research-landscape" className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Research Landscape</h2>
        <p className="paragraph-new">
          Before talking to anyone, we needed to understand the existing landscape. What does accessibility
          actually mean in a supermarket context? What&apos;s already been tried? And where are the gaps that
          no one&apos;s addressed?
        </p>
        <ResearchLandscapeCards />
      </div>
    </section>
  );
}

