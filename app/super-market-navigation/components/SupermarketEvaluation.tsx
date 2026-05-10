import type { ReactNode } from 'react';

import { PublicFolderLightboxGallery } from '@/app/components/gallery';
import { ProjectDetailsAccordion } from '../../components/project-page/ProjectDetailsAccordion';

import { InsightTag } from './InsightTag';

function EvalResultBadge({
  tone,
  children,
}: {
  tone: 'met' | 'partial' | 'inconclusive' | 'not-met';
  children: ReactNode;
}) {
  return (
    <span className={`smp-eval-result smp-eval-result--${tone}`}>
      <span className="smp-eval-result__mark" aria-hidden="true" />
      <span className="smp-eval-result__label">{children}</span>
    </span>
  );
}

export default function SupermarketEvaluation() {
  return (
    <section id="smp-section-evaluation" className="default-section">
      <div className="default-container w-container">
        <div className="grid---left-flex-horizontal h3-headings" />
        <h2 className="h2">Evaluation</h2>

        <p className="paragraph-new">
          We set out to test whether FoodHub actually addressed the problems we&apos;d identified in research.
          Not just whether it was usable, but whether it moved the needle on navigation, communication, and
          distraction. Here&apos;s how it performed.
        </p>
        <p className="paragraph-new">
          Across four SUS respondents, FoodHub scored an average of 69.4, just above the industry benchmark
          of 68. For a mid-fidelity Figma prototype, that&apos;s a solid baseline. Learnability scored
          particularly high: all four respondents agreed most people would pick the app up quickly. The
          slightly lower scores on confidence and consistency suggest the prototype&apos;s fidelity level
          affected how reliable the experience felt, a polish issue, not a conceptual one. All four
          think-aloud participants said they could see themselves using the app.
        </p>

        <div className="smp-eval-table-wrap">
          <table className="smp-eval-table">
            <caption className="u-sr-only">
              Evaluation goals by insight: result and summary
            </caption>
            <thead>
              <tr>
                <th scope="col">Insight</th>
                <th scope="col">Goal</th>
                <th scope="col">Result</th>
                <th scope="col">Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr className="smp-eval-table__row smp-eval-table__row--navigation">
                <td>
                  <InsightTag insight="navigation" />
                </td>
                <td>Product finding</td>
                <td>
                  <EvalResultBadge tone="met">Met</EvalResultBadge>
                </td>
                <td>Users found items directly instead of wandering</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--navigation">
                <td>
                  <InsightTag insight="navigation" />
                </td>
                <td>Store navigation clarity</td>
                <td>
                  <EvalResultBadge tone="partial">Partially met</EvalResultBadge>
                </td>
                <td>Route worked; map orientation needed iteration</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--navigation">
                <td>
                  <InsightTag insight="navigation" />
                </td>
                <td>Time saving</td>
                <td>
                  <EvalResultBadge tone="met">Met</EvalResultBadge>
                </td>
                <td>All users reported faster shopping with the app</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--communication">
                <td>
                  <InsightTag insight="communication" />
                </td>
                <td>Reduced staff reliance</td>
                <td>
                  <EvalResultBadge tone="met">Met</EvalResultBadge>
                </td>
                <td>Location self-service reduced help-seeking</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--communication">
                <td>
                  <InsightTag insight="communication" />
                </td>
                <td>Effective communication</td>
                <td>
                  <EvalResultBadge tone="partial">Partially met</EvalResultBadge>
                </td>
                <td>Call feature worked but needed more modalities</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--distraction">
                <td>
                  <InsightTag insight="distraction" />
                </td>
                <td>Minimise distraction</td>
                <td>
                  <EvalResultBadge tone="met">Met</EvalResultBadge>
                </td>
                <td>Impulse buying dropped from 4/5 to 1/5</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--distraction">
                <td>
                  <InsightTag insight="distraction" />
                </td>
                <td>Refocus speed</td>
                <td>
                  <EvalResultBadge tone="inconclusive">Inconclusive</EvalResultBadge>
                </td>
                <td>Prototype unfamiliarity skewed dual-task results</td>
              </tr>
              <tr className="smp-eval-table__row smp-eval-table__row--distraction">
                <td>
                  <InsightTag insight="distraction" />
                </td>
                <td>Basket organiser</td>
                <td>
                  <EvalResultBadge tone="not-met">Not met</EvalResultBadge>
                </td>
                <td>Dropped after testing showed it added cognitive load and social stigma</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="smp-eval-accordions">
          <ProjectDetailsAccordion
            title={
              <>
                Navigation <InsightTag insight="navigation" />
              </>
            }
          >
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                <strong>Did the app help users find items?</strong>
              </p>
              <p>
                Yes. In baseline tests without the app, users searched every shelf and wandered aisles
                without direction. One participant described their usual approach:{' '}
                <blockquote>
                  &quot;as there&apos;s no labels I guess I&apos;ll just walk through every aisle.&quot;
                </blockquote>
                With the app, every participant navigated directly to their items. The difference was
                immediately visible in both behaviour and confidence.
              </p>
              <p>
                <strong>Was the navigation clear?</strong>
              </p>
              <p>
                Partially. The guided route worked. Users understood where they were going and could follow
                the path. But three out of four participants raised the same issue: when the map reoriented
                between items, they lost their sense of position.
              </p>
              <blockquote>
                &quot;the map sort of changes orientation and I&apos;m trying to figure out where I am.&quot;
              </blockquote>
              <blockquote>
                &quot;what confused me with the first map was the orientation.&quot;
              </blockquote>
              <p>
                The concept was right. The specific map implementation needed iteration, which led directly
                to our round 3 A/B test.
              </p>
              <p>
                The A/B test confirmed that map navigation was preferred over compass navigation overall. But
                the transcripts revealed something more nuanced: the compass didn&apos;t suffer from the
                orientation problem because it gave direction without requiring spatial understanding of the
                whole store. Several users suggested having both available, using the map for overall
                navigation and switching to compass for close-range finding.
              </p>
              <p>
                <strong>Did it save time?</strong>
              </p>
              <p>Yes. Users described the app as &quot;definitely more efficient&quot; and noted they could go directly to items rather than scanning. One participant said it &quot;probably would have saved me time rather than looking at every single aisle and then going back and forth.&quot;</p>
              <p>
                <strong>What was missing?</strong>
              </p>
              <p>
                Users consistently asked for more spatial specificity. Three participants wanted left/right
                indicators for which side of the aisle an item was on. One asked for vertical shelf position
                (top or bottom). The app solved the macro navigation problem (which aisle) but left a gap in
                the last metre of finding.
              </p>
            </div>
          </ProjectDetailsAccordion>

          <ProjectDetailsAccordion
            title={
              <>
                Communication <InsightTag insight="communication" />
              </>
            }
          >
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                <strong>Did the app reduce the need to ask for help?</strong>
              </p>
              <p>
                Yes. Users required less staff assistance when using the app because the navigation itself
                answered the most common question (&quot;where is this item?&quot;). This aligns with our
                research finding that 70 to 80 percent of in-store help requests are about location.
              </p>
              <p>
                <strong>Was the call feature useful?</strong>
              </p>
              <p>
                Users found the call button intuitive and appreciated having it available. One participant
                said they &quot;preferred calling for staff than talking in person,&quot; validating our
                research that face-to-face requests carry emotional cost. However, one user completed the
                call task easily but then asked what it was actually for, suggesting the value proposition
                needed clearer framing in the UI.
              </p>
              <p>
                <strong>What was missing?</strong>
              </p>
              <p>
                Multiple users asked for alternatives beyond voice calling. One said &quot;I personally
                don&apos;t like phone calls so I would prefer another way to ask for help.&quot; Users
                suggested text chat, video call options, and a chatbot. The call feature was the right
                instinct, reducing the friction of seeking help, but it was too narrow. Not everyone&apos;s
                communication barrier is the same.
              </p>
            </div>
          </ProjectDetailsAccordion>

          <ProjectDetailsAccordion
            title={
              <>
                Distraction <InsightTag insight="distraction" />
              </>
            }
          >
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                <strong>Did the app reduce distractions?</strong>
              </p>
              <p>
                Yes, and this was the strongest result. We placed a promotional distraction in the testing
                environment. Without the app, 4 out of 5 users noticed the promotion and decided to purchase.
                With the app, only 1 out of 5 did. The structured route kept users focused on their list and
                moving through the store with purpose, leaving less opportunity for unplanned browsing.
              </p>
              <p>Users described this directly. One participant said:</p>
              <blockquote>
                &quot;helped avoid searching every shelf and finding the promotion, thus avoiding impulse
                buying.&quot;
              </blockquote>
              <p>
                The navigation feature wasn&apos;t just solving a navigation problem. It was solving a
                distraction problem too, because aimless wandering is what creates exposure to impulse
                triggers.
              </p>
              <p>
                <strong>Did the app reduce cognitive load?</strong>
              </p>
              <p>
                This was our most complicated finding. We ran a dual-task test where users memorised a
                sequence of 5 numbers before shopping, then recalled them afterwards. In the baseline test
                without the app, 5 out of 5 users recalled the sequence. With the app, only 1 out of 5 did.
              </p>
              <p>
                On the surface, that looks like the app increased cognitive load rather than reducing it.
                But the context matters. Users were interacting with a brand-new, unfamiliar prototype for
                the first time. They were processing a novel interface, learning new interaction patterns,
                and navigating a physical diorama simultaneously. One user acknowledged this tension directly:
                the app was
              </p>
              <blockquote>
                &quot;hard to tell because they have to learn a whole new app, inherently overloading.&quot;
              </blockquote>
              <p>
                The learning curve of an unfamiliar tool consumed the cognitive bandwidth that the tool was
                designed to free up.
              </p>
              <p>
                We&apos;d expect this to invert with repeated use. Once the interface becomes familiar, the
                structured route and guided workflow should reduce cognitive effort compared to unassisted
                shopping. But we can&apos;t claim that from this test. It&apos;s an honest limitation of
                testing a new prototype on first-time users.
              </p>
              <p>
                <strong>What about the basket?</strong>
              </p>
              <p>
                The basket feature was designed to make purchasing categories physically visible and reduce
                impulse buying through awareness. It failed. The A/B test results were decisive, but the
                qualitative feedback was even more telling:
              </p>
              <blockquote>
                &quot;It&apos;s a whole extra step I have to do, thinking which section to put the item,
                moving the slider, making space… I&apos;d rather just ignore it.&quot;
              </blockquote>
              <blockquote>
                &quot;It&apos;s kind of belittling… it constantly reminding me to do something like I&apos;m a
                3 year old. It&apos;s frustrating, like I know how to shop.&quot;
              </blockquote>
              <blockquote>
                &quot;I get the overall idea of the basket, but I don&apos;t think it&apos;ll be used by the
                people who it&apos;s designed for. It feels almost like people would give funny looks if
                you&apos;re using it.&quot;
              </blockquote>
              <p>
                That last quote is particularly significant. We were designing for people who already feel
                self-conscious in supermarkets. A feature that risks social stigma works directly against
                our goals. The basket was intended to reduce cognitive load, but it added a new decision at
                every item and carried an emotional cost we hadn&apos;t anticipated.
              </p>
              <p>
                We dropped it. The app&apos;s digital shopping list and post-shop report already addressed
                impulse buying more effectively and without the physical friction or social risk.
              </p>
            </div>
          </ProjectDetailsAccordion>

          <ProjectDetailsAccordion title="Unexpected findings">
            <h3 className="h3 smp-eval-unexpected__title">Unexpected findings</h3>
            <div className="paragraph-new smp-eval-unexpected">
              <p>
                Some of the most valuable feedback wasn&apos;t about what we&apos;d built but about what users
                wanted next. Without knowing our insight framework, participants independently requested
                features that mapped directly to our three insights:
              </p>
              <p className="smp-eval-unexpected__line">
                A progress bar showing how far through the shop they were{' '}
                <InsightTag insight="distraction" /> — maintaining focus and motivation.
              </p>
              <p className="smp-eval-unexpected__line">
                Shelf-level directions indicating left/right and top/bottom positioning{' '}
                <InsightTag insight="navigation" /> — last-metre finding.
              </p>
              <p className="smp-eval-unexpected__line">
                A post-shop summary with comparisons to previous trips, similar to Strava{' '}
                <InsightTag insight="distraction" /> — behaviour reflection and awareness.
              </p>
              <p className="smp-eval-unexpected__line">
                Text and chat alternatives to calling staff <InsightTag insight="communication" /> —
                non-verbal help options.
              </p>
              <p className="smp-eval-unexpected__line smp-eval-unexpected__line--end">
                A zoom function to switch between store overview and item-level detail{' '}
                <InsightTag insight="navigation" /> — spatial orientation.
              </p>
              <p>
                The fact that users independently identified the same problem areas we&apos;d researched, and
                proposed solutions aligned with our insights, is strong validation that the research framework
                was accurately targeting real needs.
              </p>
            </div>
          </ProjectDetailsAccordion>
        </div>

        <div id="smp-section-evaluation-gallery" className="smp-eval-gallery-anchor">
          <PublicFolderLightboxGallery
            folder="super-market-navigation/evaluation"
            groupAriaLabel="Evaluation session photos"
            lightboxAriaLabel="Evaluation photo"
            imageAltPrefix="Evaluation"
          />
        </div>
      </div>
    </section>
  );
}
