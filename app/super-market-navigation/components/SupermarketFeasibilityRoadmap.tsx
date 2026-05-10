import FeasibilityRoadmapClient from './FeasibilityRoadmapClient';

export default function SupermarketFeasibilityRoadmap() {
  return (
    <section className="default-section smp-feasibility">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Feasibility &amp; Roadmap</h2>
        <p className="paragraph-new fr-road__intro">
          The concept has been validated. Here&apos;s where it is now and where it goes next.
        </p>
        <FeasibilityRoadmapClient />
      </div>
    </section>
  );
}
