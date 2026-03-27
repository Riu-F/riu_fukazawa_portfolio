export default function AiGoal() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <div className="container-limit-width">
          <div className="bento-box-style-only">
            <h3 className="h3-new">The goal</h3>
            <p className="paragraph-new">
              <span className="highlight">
                The goal of this project isn&rsquo;t to show a dynamically generated website content
              </span>
              , thats not new. This website, will try to show what it thinks is you want to know,
              and what you should know based on what you probably don&rsquo;t know. For example:
            </p>
            <ul role="list" className="list-numbered paragraph-new">
              <li className="list-item-new">
                <div>
                  A user from a warm season-less tropical country, if traveling to a cold wintery
                  snowy holiday, probably needs a lot more information about cold weather clothing
                  to prepare that someone from a already cold climate country traveling to the same
                  destination.
                </div>
              </li>
              <li className="list-item-new">
                <div>
                  A user visiting a country for the first time or traveling overseas for the first
                  time, probably needing lots of background information about simple travel
                  procedures and customs to feel comforted and reassured, compared to a experienced
                  or repeat traveler who wants something new and adventurous
                </div>
              </li>
            </ul>
            <p className="paragraph-new">
              Such a hyper personalised experience would have been too much work to implement well
              before AI, and AI has opened the door for infinitely scalable personalisation in so
              many industries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
