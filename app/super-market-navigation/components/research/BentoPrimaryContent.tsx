import { ProjectDetailsAccordion } from '../../../components/project-page/ProjectDetailsAccordion';

export default function BentoPrimaryContent() {
  return (
    <>
      <p className="paragraph-new">
        To avoid designing from assumptions, we ran three primary methods in parallel:{' '}
        <span className="highlight">
          semi-structured interviews (depth), a survey (breadth) and contextual observation.
        </span>{' '}
        We focused on people with cognitive and learning disabilities (ADHD, dyslexia, ASD, memory
        impairments), while still capturing related accessibility needs that surfaced naturally (e.g.,
        physical reach, overstimulation, signage readability).
      </p>
      <h1 className="h5">Interviews</h1>
      <p className="paragraph-new">
        We ran <span className="highlight">9 semi-structured interviews</span> with a mix of participants:
        people with ADHD, dyslexia, ASD, and memory difficulties, plus a &nbsp;one supermarket staff member
        (online picking + nightfill). Transcripts were thematically grouped using the affinity diagrams,
        which clustered the findings into four big buckets: Navigating Stores, Signage, Reducing
        Cognitive Load, and the broader Shopping Experience.
      </p>

      <ProjectDetailsAccordion title="Interview Findings">
        <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
          <p>
            <strong>People navigate supermarkets through memory, not signage.</strong>
          </p>
          <p>
            Across interviews, participants described relying heavily on <strong>positional memory</strong>{' '}
            and mental maps built over repeated visits. Once that internal map exists, shopping feels
            manageable. When layouts change — or when entering an unfamiliar store — that map collapses
            and frustration spikes.
          </p>
          <p>
            Aisle signage was widely described as insufficient for rebuilding orientation. Participants
            noted that signs are too broad, inconsistent, or unable to meaningfully represent the
            complexity of what&apos;s actually in an aisle.
          </p>
          <blockquote>
            &quot;The signs on the aisles… they&apos;re pretty useless most of the time.&quot;
          </blockquote>
          <blockquote>
            &quot;You&apos;re trying to encapsulate a whole aisle in a couple of words — that just
            doesn&apos;t work.&quot;
          </blockquote>
          <p>
            This reliance on memory explains why layout changes feel disproportionately disruptive, even
            when signage technically exists.
          </p>
          <p>‍</p>
          <p>
            <strong>Category logic often conflicts with how people think.</strong>
          </p>
          <p>
            Participants repeatedly described confusion caused by inconsistent categorisation: products
            grouped by brand, origin, promotion, or &quot;inspiration&quot; rather than by how people
            mentally associate them. Items that logically &quot;belong together&quot; (e.g. toothpaste with
            bathroom items, sauces with similar cuisines) are often separated.
          </p>
          <blockquote>
            &quot;Sometimes things are sorted by brand, other times by country, other times just
            scattered.&quot;
          </blockquote>
          <blockquote>
            &quot;You think you know where it should be… and it turns out it technically fits two
            categories.&quot;
          </blockquote>
          <p>
            This mismatch forces people to scan entire aisles, double back, or abandon items altogether —
            especially for niche or infrequently purchased products.
          </p>
          <p>‍</p>
          <p>
            <strong>Cognitive load accumulates through small frictions.</strong>
          </p>
          <p>
            Very few interviewees described a single catastrophic problem. Instead, stress emerged through{' '}
            <strong>stacking micro-frictions</strong>: unclear signage, dense shelves, bright lighting,
            noise, crowds, promotional clutter, and time pressure.
          </p>
          <p>
            For people with ADHD or ASD, this often translated into distraction, decision paralysis, or a
            strong desire to &quot;get in and get out&quot; as fast as possible.
          </p>
          <blockquote>
            &quot;There&apos;s just a lot going on… it&apos;s more interactive than it needs to be.&quot;
          </blockquote>
          <blockquote>
            &quot;I could spend an hour comparing things if I don&apos;t have a plan.&quot;
          </blockquote>
          <p>
            Even participants who did not feel overwhelmed still described{' '}
            <strong>shopping as something to minimise</strong>, not enjoy.
          </p>
          <p>‍</p>
          <p>
            <strong>Help exists, but people avoid using it.</strong>
          </p>
          <p>
            Asking staff for help was consistently framed as a <strong>last resort</strong>, not a support
            mechanism. Reasons included social anxiety, difficulty finding staff, low confidence that
            staff would know the answer, or previous negative experiences.
          </p>
          <blockquote>
            &quot;I don&apos;t feel confident asking — and half the time they just point to an aisle
            anyway.&quot;
          </blockquote>
          <blockquote>&quot;It feels like I&apos;m interrupting them.&quot;</blockquote>
          <p>
            Notably, even when help was available, the <em>emotional cost</em> of asking often outweighed
            the perceived benefit.
          </p>
          <p>‍</p>
          <p>
            <strong>Avoidance is already a coping strategy.</strong>
          </p>
          <p>
            Several participants described actively avoiding large supermarkets, busy hours, certain
            aisles, or specific stores altogether. Others shopped at off-peak times, rushed their trips,
            or abandoned items when friction became too high.
          </p>
          <blockquote>&quot;I just want to leave as fast as possible.&quot;</blockquote>
          <blockquote>&quot;If it&apos;s too busy, I&apos;ll come back another time.&quot;</blockquote>
          <p>
            This reinforces that accessibility issues don&apos;t just slow people down — they{' '}
            <strong>change behaviour</strong>.
          </p>
          <p>‍</p>
        </div>
      </ProjectDetailsAccordion>

      <p className="paragraph-new">
        The interviews revealed that supermarket accessibility issues are not caused by a lack of effort
        from users, but by environments that demand constant cognitive work. Navigation, categorisation,
        and assistance all{' '}
        <span className="highlight">
          rely on users adapting to the system — rather than the system supporting diverse ways of
          thinking
        </span>
        .
      </p>
      <h5 className="h5">Contextual Observation</h5>
      <p className="paragraph-new">
        We conducted walkthroughs to see friction in context—because supermarkets behave differently to
        how people describe them later. Observations helped us spot where stress accumulates: decision
        points, aisle transitions, signage visibility, and moments where users consider asking for help but
        don&apos;t.
      </p>
      <h5 className="h5">Surveys</h5>
      <p className="paragraph-new">
        To complement the depth of interviews, we ran a survey to capture broader patterns across
        supermarket shopping behaviours and accessibility challenges. The survey was designed to validate
        whether the frustrations raised in interviews were isolated anecdotes or shared experiences, and to
        identify which issues were most common and most disruptive.The survey combined multiple question
        types — frequency scales, multi-select questions, and open-ended responses — allowing us to
        capture both <span className="highlight">quantitative trends and qualitative context</span>. In
        total, we received <span className="highlight">61 responses</span>, primarily from people who
        shop regularly, making the findings reflective of everyday supermarket experiences rather than
        edge cases.
      </p>

      <ProjectDetailsAccordion title="Survey Findings">
        <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
          <p>
            <strong>Who we heard from</strong>
          </p>
          <ul role="list">
            <li>
              <strong>83.9%</strong> of respondents were university students
            </li>
            <li>
              Most respondents shop <strong>at least once a week</strong>, with a large portion visiting{' '}
              <strong>2–3 times per week</strong>, reinforcing that these frustrations are frequent, not
              occasional
            </li>
            <li>
              While only <strong>16.1%</strong> explicitly identified as having a learning difficulty,
              many respondents still reported challenges commonly associated with cognitive load,
              navigation, and overstimulation — highlighting that these issues extend beyond diagnosed
              disabilities
            </li>
          </ul>
          <p>
            <strong>Key findings</strong>
          </p>
          <p>
            <strong>Navigation is the dominant pain point.</strong>
          </p>
          <ul role="list">
            <li>
              <strong>75%</strong> of respondents reported difficulty finding specific product locations
            </li>
            <li>
              <strong>62.5%</strong> cited confusing store layouts
            </li>
            <li>
              <strong>29.2%</strong> struggled with reading aisle signage
            </li>
            <li>
              Many respondents described scanning entire aisles, second-guessing where items &quot;should&quot;
              be, or discovering products categorised inconsistently across stores.
            </li>
          </ul>
          <p>
            <strong>Environmental unpredictability increases anxiety.</strong>
          </p>
          <ul role="list">
            <li>
              <strong>60%</strong> reported discomfort caused by unpredictable changes in store layout
            </li>
            <li>
              <strong>50%</strong> identified busy or crowded aisles as a major stressor
            </li>
            <li>
              Bright lighting, loud or unexpected noises, and strong smells were repeatedly mentioned as
              compounding factors rather than isolated issues
            </li>
            <li>
              This suggests that stress is often cumulative — small design decisions stack together and
              overwhelm users over time.
            </li>
          </ul>
          <p>
            <strong>Information overload affects comprehension.</strong>
          </p>
          <ul role="list">
            <li>
              <strong>46.4%</strong> found store signage difficult to read or understand
            </li>
            <li>
              <strong>39.3%</strong> struggled with nutritional information
            </li>
            <li>
              Respondents described avoiding reading labels where possible, relying instead on visual cues
              such as large price tags or &quot;special&quot; signage — even when this led to less informed
              choices
            </li>
          </ul>
          <p>
            <strong>Self-checkout is efficient until it breaks.</strong>
          </p>
          <ul role="list">
            <li>
              While <strong>83.3%</strong> rated self-checkout as generally easy to use (4–5 on a 5-point
              scale), <strong>77.8%</strong> identified system errors or alerts as the most frustrating
              part of the experience
            </li>
            <li>
              <strong>51.9%</strong> found requesting staff assistance during self-checkout difficult or
              stressful
            </li>
            <li>
              This reinforces a recurring theme: systems that rely on staff intervention fail users
              precisely when they are already overloaded.
            </li>
          </ul>
          <p>
            <strong>Help exists, but isn&apos;t dependable.</strong>
          </p>
          <ul role="list">
            <li>
              Most respondents rated asking staff for help as moderately comfortable (ratings clustered
              around 3–4), but open responses revealed hesitation, difficulty locating staff, and low
              confidence that staff would know where items were
            </li>
            <li>
              Asking for help often felt like a last resort rather than a reliable support mechanism
            </li>
          </ul>
          <p>
            <strong>Avoidance behaviours are already happening.</strong>
          </p>
          <ul role="list">
            <li>
              <strong>77.4%</strong> of respondents reported <em>not</em> using delivery or click-and-collect
              services, meaning most still rely on in-store shopping despite the challenges
            </li>
            <li>
              Open-ended responses revealed coping strategies such as rushing, abandoning items, impulse
              buying, or avoiding certain stores altogether
            </li>
          </ul>
        </div>
      </ProjectDetailsAccordion>

      <p className="paragraph-new">
        The survey confirmed that supermarket accessibility issues are{' '}
        <span className="highlight">systemic, not individual</span>. Difficulty navigating, processing
        information, and maintaining focus are common experiences — even among people without formally
        identified disabilities. Importantly, many of these issues emerge before checkout, reinforcing the
        need to address navigation and cognitive load early in the shopping journey.
      </p>
    </>
  );
}
