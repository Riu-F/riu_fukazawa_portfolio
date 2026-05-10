'use client';

import { PublicFolderLightboxGalleryClient } from '@/app/components/gallery/PublicFolderLightboxGalleryClient';
import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';
import type { CSSProperties } from 'react';
import { useState } from 'react';

import { ProjectDetailsAccordion } from '@/app/components/project-page/ProjectDetailsAccordion';
import { InsightTag, type CaseStudyInsight } from '../InsightTag';
import { UserTestingMethodAccordion } from './UserTestingMethodAccordion';

export type UserTestingGalleries = {
  round1: PublicFolderGalleryImage[];
  round2: PublicFolderGalleryImage[];
  round3Gallery: PublicFolderGalleryImage[];
};

const R3_ASSETS = {
  compass: '/super-market-navigation/user-testing/r3/comparison/testing-r3-compass.png',
  map: '/super-market-navigation/user-testing/r3/comparison/testing-r3-map.png',
  basketWith: '/super-market-navigation/user-testing/r3/comparison/testing-r3-basket-with.png',
  basketWithout: '/super-market-navigation/user-testing/r3/comparison/testing-r3-basket-without.png',
} as const;

const VIDEO_IDS = [
  '1ITaQP2zafS97bVRXVGg0sC_gzGIiR9BT',
  '1IaCP_cOfxcQtXUptsL-0ttVz0sX-YHCZ',
] as const;

const TIMELINE: {
  label: string;
  title: string;
  summary: string;
  insights: CaseStudyInsight[];
}[] = [
  {
    label: 'Round 1',
    title: 'Preliminary Testing',
    summary:
      'Testing the prototype, not the idea. Finding everything broken before the main event.',
    insights: ['navigation', 'communication', 'distraction'],
  },
  {
    label: 'Round 2',
    title: 'Main Testing Round',
    summary: '200 possible participants. Three testing methods. One shot to get it right.',
    insights: ['navigation', 'communication', 'distraction'],
  },
  {
    label: 'Round 3',
    title: 'A/B Testing',
    summary: 'Two features on trial. Head-to-head testing to make final decisions.',
    insights: ['navigation', 'distraction'],
  },
];

function AbComparison({
  heading,
  insight,
  optionA,
  optionB,
  winner: winnerSide,
  result,
}: {
  heading: string;
  insight: CaseStudyInsight;
  optionA: { title: string; description: string; imageSrc: string };
  optionB: { title: string; description: string; imageSrc: string };
  winner: 'a' | 'b';
  result: string;
}) {
  return (
    <div className="ut-ab">
      <div className="ut-ab__heading">
        <InsightTag insight={insight} />
        <h4 className="ut-ab__title">{heading}</h4>
      </div>
      <div className="ut-ab__grid">
        <div className={`ut-ab__card${winnerSide === 'a' ? ' ut-ab__card--winner' : ''}`}>
          {winnerSide === 'a' && <span className="ut-ab__badge">Preferred</span>}
          <h5 className="ut-ab__option-title">{optionA.title}</h5>
          <p className="ut-ab__option-desc paragraph-new">{optionA.description}</p>
          <div className="ut-ab__img-wrap">
            <img src={optionA.imageSrc} alt="" className="ut-ab__img" width={640} height={360} loading="lazy" />
          </div>
        </div>
        <div className={`ut-ab__card${winnerSide === 'b' ? ' ut-ab__card--winner' : ''}`}>
          {winnerSide === 'b' && <span className="ut-ab__badge">Preferred</span>}
          <h5 className="ut-ab__option-title">{optionB.title}</h5>
          <p className="ut-ab__option-desc paragraph-new">{optionB.description}</p>
          <div className="ut-ab__img-wrap">
            <img src={optionB.imageSrc} alt="" className="ut-ab__img" width={640} height={360} loading="lazy" />
          </div>
        </div>
      </div>
      <p className="ut-ab__result">{result}</p>
    </div>
  );
}

export function UserTestingSectionClient({ galleries }: { galleries: UserTestingGalleries }) {
  const [active, setActive] = useState(0);
  const progressPct = active === 0 ? '0%' : active === 1 ? '50%' : '100%';
  const trackStyle = { '--ut-line-pct': progressPct } as CSSProperties;

  return (
    <div className="ut-client">
      <div className="ut-sticky-head">
        <nav className="ut-timeline" aria-label="User testing rounds">
          <div className="ut-timeline__track" style={trackStyle}>
            <div className="ut-timeline__line-bg" aria-hidden />
            <div className="ut-timeline__line-fill" aria-hidden />
            <div className="ut-timeline__nodes">
              {TIMELINE.map((round, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <button
                    key={round.label}
                    type="button"
                    className={`ut-node${isActive ? ' ut-node--active' : ''}${isPast ? ' ut-node--past' : ''}${!isActive && !isPast ? ' ut-node--future' : ''}`}
                    onClick={() => setActive(i)}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="ut-node__dot-wrap" aria-hidden>
                      <span className="ut-node__dot" />
                    </span>
                    <span className="ut-node__label">{round.label}</span>
                    <span className="ut-node__title">{round.title}</span>
                    <span className="ut-node__summary">{round.summary}</span>
                    <span className="ut-node__tags">
                      {round.insights.map((ins) => (
                        <InsightTag key={`${i}-${ins}`} insight={ins} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      <div className="ut-panel-shell">
        <div key={active} className="ut-panel ut-panel--animate">
          {active === 0 && (
            <>
              <p className="paragraph-new ut-panel__lead">
                Round 1 wasn&apos;t about testing the idea. It was about testing the prototype.
              </p>
              <p className="paragraph-new">
                We had one shot at a large-scale user testing fair later in the semester, with close to 200
                participants available. We couldn&apos;t afford to spend that day debugging UI issues or
                explaining confusing icons. So we ran a preliminary round of think-aloud sessions, having users
                work through 9 core features while verbalising their thought process. Adding items, removing
                items, navigating the store, using the basket, moving the spatial prototype figurine.
              </p>
              <p className="paragraph-new">
                The goal was simple: find everything that&apos;s broken or confusing now, fix it, and present
                a functional prototype at the fair.
              </p>

              <div className="ut-panel__accordion">
                <ProjectDetailsAccordion title="What we found.">
                  <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
                    <p>
                      The basket feature failed completely. Not a single user understood how to use it from the
                      app&apos;s explanation alone. Every participant had to ask us for clarification. Even
                      after understanding it, most ignored it and just placed items in the basket without
                      sectioning. We responded by adding an onboarding animation showing the basket being
                      divided, along with clearer instructions and visuals.
                    </p>
                    <p>
                      We also discovered the app lacked positive feedback loops. Users would add an item and
                      nothing would happen visually. They&apos;d start navigation and have no confirmation it
                      was working. We added confirmation states throughout: &apos;item added,&apos; &apos;starting
                      shop,&apos; progress indicators.
                    </p>
                    <p>
                      Beyond those, we caught dozens of smaller issues: unclear icons, confusing page
                      transitions, button placements, colour contrast problems. All the things that would have
                      eaten into our testing time at the fair if we hadn&apos;t caught them here.
                    </p>
                  </div>
                </ProjectDetailsAccordion>
              </div>

              <PublicFolderLightboxGalleryClient
                images={galleries.round1}
                groupAriaLabel="Round 1 testing photos"
                lightboxAriaLabel="Round 1 photo"
              />
            </>
          )}

          {active === 1 && (
            <>
              <p className="paragraph-new">
                This round took place at the cohort&apos;s user testing fair, a bi-yearly event where close to
                200 design students rotated between project showcases and testing stations. It was our
                biggest opportunity to gather volume and diversity in feedback, but it was also a one-shot
                situation. Every minute spent troubleshooting was a minute not spent testing.
              </p>
              <p className="paragraph-new">
                Each participant went through the same sequence: an onboarding briefing (including consent to
                record), then three evaluation methods run back to back.
              </p>

              <div className="ut-videos">
                {VIDEO_IDS.map((id, idx) => (
                  <div key={id} className="ut-video-block">
                    <div className="ut-video-frame">
                      <iframe
                        title={`User testing session recording ${idx + 1}`}
                        src={`https://drive.google.com/file/d/${id}/preview`}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="ut-video-iframe"
                      />
                    </div>
                    <a
                      href={`https://drive.google.com/file/d/${id}/view?usp=sharing`}
                      className="ut-video-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="ut-video-link__play" aria-hidden>
                        ▶
                      </span>
                      Watch: User testing session {idx + 1} (open in Google Drive)
                    </a>
                  </div>
                ))}
              </div>

              <div className="ut-methods">
                <UserTestingMethodAccordion
                  title="Think-Alouds"
                  preview="Testing how well users could translate app directions into spatial movement."
                  insight="navigation"
                >
                  <p>
                    We used think-alouds to test how well users could translate the app&apos;s directions into
                    spatial movement. Using the miniature supermarket model, participants narrated their
                    thinking while navigating to items. First without the app to establish a baseline, then with
                    it. This comparison let us see whether the app actually improved orientation or just added
                    another layer of information to process.
                  </p>
                  <p>
                    We tracked time taken for each run, number of errors (missed items, off-list picks, wrong
                    basket placement), and the qualitative difference in confidence between the two runs.
                  </p>
                </UserTestingMethodAccordion>

                <UserTestingMethodAccordion
                  title="Cognitive Load Testing"
                  preview="Measuring mental effort, not just task completion."
                  insight="distraction"
                >
                  <p>
                    This was the method we were most deliberate about. Standard usability testing tells you
                    whether someone can complete a task. It doesn&apos;t tell you how much mental effort it
                    cost them. For users with ADHD or memory impairments, that effort is the whole problem.
                  </p>
                  <p>
                    We used a dual-task approach: participants were given a sequence of 5 numbers to remember
                    at the start, then asked to complete their shopping task. Afterwards, we checked how many
                    numbers they could recall. The idea is that if the app is genuinely reducing cognitive load,
                    users should have more mental capacity left over for the secondary task.
                  </p>
                  <p>
                    Alongside the recall test, we observed and recorded signs of cognitive strain: hesitation
                    at decision points, time spent engaging with a promotional distraction we&apos;d placed in
                    the model, indecisiveness when choosing between products, and any visible stress responses.
                  </p>
                </UserTestingMethodAccordion>

                <UserTestingMethodAccordion
                  title="SUS Survey and Interviews"
                  preview="Capturing candid reactions after the test, not guided answers."
                  insight="communication"
                >
                  <p>
                    After completing the tasks, participants filled out a System Usability Scale survey and
                    then answered open-ended interview questions. We kept the questions broad on purpose: what
                    stood out, what frustrated you, what would you change, did it feel more efficient than
                    shopping without the app. We wanted candid reactions, not guided answers.
                  </p>
                  <p>
                    The detailed evaluation of this round&apos;s findings is covered in the next section. But
                    the headline outcome from round 2 was clear: the concept was working for its core purpose
                    (structured navigation reduced confusion and time), but the specific navigation method
                    we&apos;d designed, the map view, was not intuitive. That finding drove everything in round
                    3.
                  </p>
                </UserTestingMethodAccordion>
              </div>

              <PublicFolderLightboxGalleryClient
                images={galleries.round2}
                groupAriaLabel="Round 2 testing photos"
                lightboxAriaLabel="Round 2 photo"
              />
            </>
          )}

          {active === 2 && (
            <>
              <p className="paragraph-new">
                Round 2 told us two things needed resolving: the navigation view wasn&apos;t working, and the
                basket was still causing friction. Rather than guess at solutions, we built alternatives for
                both and tested them head to head.
              </p>

              <AbComparison
                heading="Navigation A/B"
                insight="navigation"
                winner="b"
                optionA={{
                  title: 'Compass Navigation',
                  description:
                    'Inspired by Apple\'s AirTag tracking. The app shows an arrow pointing toward your next item and you find your own way there. A hands-off approach that gives direction without dictating a route.',
                  imageSrc: R3_ASSETS.compass,
                }}
                optionB={{
                  title: 'Map Navigation',
                  description:
                    'Closer to Google Maps in walking mode. The view shifts to a lower angle, centres on your position, and shows a clear route to follow. A guided approach with less room for interpretation.',
                  imageSrc: R3_ASSETS.map,
                }}
                result="Users overwhelmingly preferred map navigation. Both participants with cognitive disabilities and those without. The success rate was higher, the time to understand was faster, and when asked directly, participants chose the map. A few users asked if they could switch to compass mode when close to an item, which was interesting feedback, but the primary navigation method was clearly the map."
              />

              <AbComparison
                heading="Basket A/B"
                insight="distraction"
                winner="b"
                optionA={{
                  title: 'App with basket divider',
                  description:
                    'The app tells users how to section their basket based on their shopping list categories. A physical tool to make purchasing patterns visible and reduce impulse buying.',
                  imageSrc: R3_ASSETS.basketWith,
                }}
                optionB={{
                  title: 'App without basket',
                  description:
                    'The app handles everything digitally. Shopping list, navigation, and post-shop report address impulse buying through structure and reflection rather than a physical tool.',
                  imageSrc: R3_ASSETS.basketWithout,
                }}
                result="Participants found the divider belittling. It took up needed space and nobody gravitated towards it. People preferred placing items directly into the basket without sectioning. The divider was intended to reduce cognitive load, but it was adding to it by introducing an extra decision at every item. We dropped the basket entirely. FoodHub became a standalone digital product from this point forward."
              />

              <PublicFolderLightboxGalleryClient
                images={galleries.round3Gallery}
                groupAriaLabel="Round 3 testing photos"
                lightboxAriaLabel="Round 3 photo"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
