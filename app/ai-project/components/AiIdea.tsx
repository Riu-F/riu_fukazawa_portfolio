const PRINCIPLES = [
  {
    title: 'No prompts',
    description:
      'The user never types a query or interacts with an AI interface. The system works without any input beyond what\u2019s already known.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path
          d="M9 10.5h14a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3H16.5L11 27v-4.5H9a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M24 12 12 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'No chat windows',
    description:
      'There\u2019s no chatbot, no assistant panel, no \u201cAsk AI\u201d button. The AI operates behind the page, shaping what appears.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path
          d="M18 8.5c5.8 0 10.5 4.2 10.5 9.5 0 2.2-.9 4.2-2.4 5.7L27 27l-4.2-1.1c-1.2.6-2.6.9-4.1.9-5.8 0-10.5-4.2-10.5-9.5S12.2 8.5 18 8.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="18" r="2.25" fill="currentColor" />
        <path d="M10 26l16-16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Just adaptation',
    description:
      'The page reads your booking data and generates content specific to your trip, your background, and your needs. It simply knows you.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
        <path
          d="M24.5 14.5A8 8 0 0 0 12 18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M11.5 21.5A8 8 0 0 0 24 18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="m21 11 3.5-3.5M15 25l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function AiIdea() {
  return (
    <section className="default-section aip-idea">
      <div className="default-container w-container">
        <div className="aip-idea__eyebrow-wrap">
          <div className="aip-idea__accent-bar" aria-hidden />
          <span className="aip-idea__eyebrow">The Concept</span>
        </div>

        <h2 className="h2">Invisible AI</h2>

        <p className="paragraph-new width-limit">
          Every day there&rsquo;s a new AI tool, and most of them want you to know they&rsquo;re AI.
          Chatbots, magic generate buttons, prompt interfaces. This project goes the other direction.
        </p>
        <p className="paragraph-new width-limit">
          What if AI could reshape the content of a webpage based on who&rsquo;s looking at it,
          without the user ever typing, clicking, or noticing? No prompts. No chat windows. Just a
          page that quietly adapts its language, priorities, and recommendations based on what&rsquo;s
          already known about you: your age, destination, travel purpose, group type, experience
          level.
        </p>
        <p className="paragraph-new width-limit aip-idea__lead-out">
          This project applies that idea to one specific moment: the post-purchase checkout page on
          travel platforms. The moment where personalisation usually disappears, and where it matters
          most.
        </p>

        <ul className="aip-idea__cards" role="list">
          {PRINCIPLES.map(({ icon, title, description }) => (
            <li key={title} className="aip-idea__card">
              <div className="aip-idea__card-icon">{icon}</div>
              <h3 className="aip-idea__card-title">{title}</h3>
              <p className="aip-idea__card-desc">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
