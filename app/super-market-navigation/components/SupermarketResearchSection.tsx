import ProjectBentoRow from '../../components/project-page/ProjectBentoRow';
import BentoSecondaryContent from './research/BentoSecondaryContent';
import BentoPrimaryContent from './research/BentoPrimaryContent';
import BentoCompetitorContent from './research/BentoCompetitorContent';

export default function SupermarketResearchSection() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <h2 className="h2">Research</h2>
        <p className="paragraph-new">
          We set out to design for cognitive accessibility because it&apos;s both under-served and deeply
          practical: supermarkets are unavoidable, but often overwhelming. Accessibility has been a
          long-standing interest for our team, and it was personally relevant too—
          <span className="highlight">three out of four team members live with a cognitive disability</span>{' '}
          (including ADHD and dyslexia). That lived experience helped us narrow the problem space quickly.
          We also believed this was a space where a digital layer could meaningfully reduce cognitive load
          without requiring the physical store to be rebuilt from scratch.
        </p>
        <p className="paragraph-new">
          Our research combined <span className="highlight">qualitative and quantitative methods</span> to
          build a rounded understanding of supermarket accessibility. While our focus was cognitive and
          learning disabilities (ADHD, dyslexia, ASD), we also drew broader insights from people with
          visual, auditory, and physical impairments to avoid designing a solution that only works for one
          narrow slice of users. Across surveys, interviews, and contextual observation, we repeatedly saw
          the same friction points: confusing layouts, low-quality wayfinding, difficulty getting help, and
          sensory overload. One headline result:{' '}
          <span className="highlight">
            64% of participants reported difficulty finding items due to confusing store layouts
          </span>
          . We synthesised findings using an affinity diagram to surface themes and identify concrete design
          opportunities.
        </p>
      </div>
      <div className="full-width-container">
        <div>
          <ProjectBentoRow>
            <div className="bento-box">
              <h1 className="h5">Secondary</h1>
              <div className="bento-content-small">
                <p className="paragraph-new">Description</p>
                <p className="small-text">Click to expand</p>
              </div>
              <div className="bento-content-expanded">
                <BentoSecondaryContent />
              </div>
            </div>
            <div className="bento-box">
              <h5 id="section--research" className="h5">
                Primary
              </h5>
              <div className="bento-content-small">
                <p className="paragraph-new">Description</p>
                <p className="small-text">Click to expand</p>
              </div>
              <div className="bento-content-expanded">
                <BentoPrimaryContent />
              </div>
            </div>
            <div className="bento-box">
              <h1 className="h5">Competitor Analysis</h1>
              <div className="bento-content-small">
                <p className="paragraph-new">Description</p>
                <p className="small-text">Click to expand</p>
              </div>
              <div className="bento-content-expanded">
                <BentoCompetitorContent />
              </div>
            </div>
          </ProjectBentoRow>
        </div>
      </div>
    </section>
  );
}
