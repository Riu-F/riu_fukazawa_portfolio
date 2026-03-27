export default function AiIdea() {
  return (
    <>
      {/* ── Section: The idea ─────────────────────────────────── */}
      <section className="default-section">
        <div className="default-container w-container">
          <h1 className="h5 no-spacing">The idea:</h1>
          <h2 className="h2"><strong>AI That Quietly Shapes the Experience</strong></h2>
          <p className="paragraph-new">
            The use and application of AI is exploding. Every day, we&rsquo;re seeing new tools,
            plugins, and platforms—most of them just ChatGPT wrappers. Well&hellip; this one kind
            of is too. But instead of focusing on chatbot interactions or magic &ldquo;Generate&rdquo;
            buttons, this project explores something more subtle:{' '}
            <span className="highlight">
              What if AI could reshape the content of a webpage based on who&rsquo;s looking at
              it—without the user ever typing, clicking, or even noticing?
            </span>
            <br /><br />
            No prompts. No UI interactions. Just a dynamic, personalised experience built entirely
            from the existing data already known about the user—like their age, travel purpose,
            destination, season, or group type. This project imagines the application of that kind
            of seamless, context-aware AI system—used specifically in the checkout and confirmation
            pages of travel platforms, where personalisation usually disappears.{' '}
            <br /><br />
            AI gives us the opportunity to deliver{' '}
            <span className="highlight">hyper-specific personalisation at incredible scale.</span>{' '}
            This concept is a proof-of-possibility for what that might look like.
          </p>
        </div>
      </section>

    </>
  );
}
