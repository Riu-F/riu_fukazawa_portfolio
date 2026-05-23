import { AiInsightTag, type AiInsightPrinciple } from './AiInsightTag';

const GOAL_PRINCIPLES: { principle: AiInsightPrinciple; text: string }[] = [
  { principle: 'invisible-ai', text: 'over visible AI' },
  { principle: 'post-purchase', text: 'is prime real estate' },
  { principle: 'activate-data', text: "don't collect more" },
];

export default function AiGoal() {
  return (
    <section className="default-section aip-goal">
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">The Goal</span>
        </div>

        <p className="aip-goal__statement width-limit">
          Use AI as an invisible layer that reads existing booking data and generates a personalised
          post-checkout page. One that tells each traveller what they specifically need to know,
          based on who they are and where they&rsquo;re going.
        </p>

        <p className="paragraph-new width-limit aip-goal__support">
          A first-time family from Jakarta heading to Tokyo in winter needs visa guidance, cold
          weather prep, and kid-friendly logistics. A solo photographer revisiting Kyoto in spring
          needs insider cultural spots and efficient transit tips. Same system, same UI, completely
          different output. That kind of contextual adaptation at scale is what AI makes possible.
        </p>

        <ul className="aip-goal__principles" role="list">
          {GOAL_PRINCIPLES.map(({ principle, text }) => (
            <li key={principle} className="aip-goal__principle-row">
              <AiInsightTag principle={principle} />
              <span className="aip-goal__principle-text">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
