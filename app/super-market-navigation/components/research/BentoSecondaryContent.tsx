export default function BentoSecondaryContent() {
  return (
    <>
      <p className="paragraph-new">
        We started by mapping the accessibility landscape: visual, auditory, physical, and cognitive
        impairments—then deliberately zoomed into{' '}
        <span className="highlight">cognitive and learning disabilities</span> because supermarkets are
        sensory-rich environments where attention, memory, processing load, and decision-making are
        constantly taxed.
      </p>
      <p className="paragraph-new">
        A key takeaway from secondary research was that &quot;accessibility&quot; isn&apos;t just screen
        readers and ramps. In a supermarket context it includes:
      </p>
      <ul role="list" className="list-numbered">
        <li className="list-item-new">
          <div>
            <strong>Wayfinding and spatial clarity </strong>(how easily someone can form and maintain a
            mental map)
          </div>
        </li>
        <li className="list-item-new">
          <div>
            <strong>Information readability</strong> (font size, label density, signage clarity)
          </div>
        </li>
        <li className="list-item-new">
          <div>
            <strong>Cognitive load and decision pressure</strong> (choice overload, price comparisons,
            interruptions)
            <br />
          </div>
        </li>
        <li className="list-item-new">
          <div>
            <strong>Environmental stressors</strong> (noise, lighting, crowds, clutter)
            <br />
          </div>
        </li>
      </ul>
      <p className="paragraph-new">
        We also explored <span className="highlight">accessibility audit methods</span> (checklists +
        observational techniques) to evaluate how well an environment supports different users. This gave
        us a practical lens for analysing supermarkets as systems, not just interfaces—useful later when
        we conducted walkthroughs and mapped pain points.
      </p>
      <p className="paragraph-new">
        Finally, we grounded the work in Australian legal and ethical context, including the{' '}
        <strong>Disability Discrimination Act 1992 (DDA)</strong>—not as a compliance checkbox, but as a
        reminder that exclusion is often a design decision by default.
      </p>
    </>
  );
}
