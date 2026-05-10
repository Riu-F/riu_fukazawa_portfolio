const PDF_REPORT =
  'https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/680cd9246c57f2b993845f02_1%3A2%20report.pdf';
const PDF_FEATURES =
  'https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/680cd9238d32b6ad7650e5b4_2%3A2%20report.pdf';

export default function SupermarketLearnMore() {
  return (
    <section className="showcase-grid ai-project-2">
      <div className="default-container w-container">
        <h1 className="h2 ai-project-3">Learn More</h1>
        <p className="paragraph-new ai-project-14">
          This is just a glimpse into what we tackled over 13 intense weeks of design and development. If
          you&apos;re curious to dive deeper, feel free to check out the full visual report we submitted at
          the end of the project. I&apos;d also be more than happy to chat in detail about the process,
          insights, or anything else that sparked your interest!
        </p>
        <div className="w-layout-grid showcase---grid ai-project">
          <div className="showcase---grid-div supermarket">
            <h3 className="h3">Visual Report</h3>
            <p className="paragraph-new">
              Take a closer look at our final report, which covers everything from user research and design
              rationale to testing outcomes and reflections. It&apos;s a comprehensive snapshot of the entire
              project journey—packed with insights, visuals, and key takeaways.
            </p>
            <a href={PDF_REPORT} target="_blank" rel="noopener noreferrer" className="button w-button">
              Take a look! 👀
            </a>
          </div>
        </div>
        <div className="w-layout-grid showcase---grid ai-project">
          <div className="showcase---grid-div supermarket">
            <h3 className="h3">App Key Features</h3>
            <p className="paragraph-new">
              Take a closer look at our final design, featuring detailed explanations of the key features,
              branding, and design choices.
            </p>
            <a href={PDF_FEATURES} target="_blank" rel="noopener noreferrer" className="button w-button">
              Take a look! 👀
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
