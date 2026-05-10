import { PrimaryResearchMethods } from './primary-research/PrimaryResearchMethods';

export default function SupermarketPrimaryResearch() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Primary Research</h2>
        <p className="paragraph-new">
          Three out of four of us live with a cognitive disability. We weren&apos;t designing for an abstract
          user group, we were designing for ourselves. Our research spanned interviews, surveys, in-store
          observations, and online ethnography. Across all of it, the same story kept emerging: supermarkets
          are built around store logic, not human cognition.
        </p>

        <div className="pr-stats">
          <div className="pr-stat">
            <div className="pr-stat__value">15 pages</div>
            <div className="pr-stat__label">
              Secondary research into cognitive disabilities, accessibility frameworks, and design patterns
            </div>
          </div>
          <div className="pr-stat">
            <div className="pr-stat__value">9 interviews</div>
            <div className="pr-stat__label">
              In-depth sessions (20+ min each) with people living with cognitive and learning disabilities
            </div>
          </div>
          <div className="pr-stat">
            <div className="pr-stat__value">32 responses</div>
            <div className="pr-stat__label">Targeted survey from individuals with cognitive and learning disabilities</div>
          </div>
          <div className="pr-stat">
            <div className="pr-stat__value">100+</div>
            <div className="pr-stat__label">General supermarket user survey responses</div>
          </div>
        </div>

        <PrimaryResearchMethods />
      </div>
    </section>
  );
}
