const OUR_STORY_SRC =
  'https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory.png';

export default function SupermarketFinalDesign() {
  return (
    <section className="default-section">
      <div className="default-container w-container">
        <h2 className="h2">
          <strong>Final Design</strong>
        </h2>
        <p className="paragraph-new">
          We developed a high-fidelity digital prototype that integrated our core design
          features—navigation support, communication aids, and distraction reduction—into a cohesive and
          accessible shopping experience. The prototype was built for mobile, with an emphasis on intuitive
          flows and clear visual hierarchy.
        </p>
        <div className="slot---empty">
          <img
            src={OUR_STORY_SRC}
            loading="lazy"
            alt=""
            sizes="(max-width: 366px) 100vw, 366px"
            srcSet="
              https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory-p-500.png 500w,
              https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory-p-800.png 800w,
              https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory-p-1080.png 1080w,
              https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory-p-1600.png 1600w,
              https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/6800f89d7689986a7cfb6350_3.OurStory.png 1684w
            "
            className="image---full-width"
          />
        </div>
      </div>
    </section>
  );
}
