'use client';

import { ProjectDetailsAccordion } from '@/app/components/project-page/ProjectDetailsAccordion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PublicFolderLightboxGalleryClient } from '@/app/components/gallery/PublicFolderLightboxGalleryClient';
import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';
import { InsightTag } from '../InsightTag';

const SAMPLE_TRANSCRIPT_URL = '#';

type MethodId = 'interviews' | 'surveys' | 'observations' | 'ethnography';

type Method = {
  id: MethodId;
  title: string;
  preview: string;
  tags: ('navigation' | 'communication' | 'distraction')[];
};

const METHODS: Method[] = [
  {
    id: 'interviews',
    title: 'Interviews',
    tags: ['navigation', 'communication', 'distraction'],
    preview: '9 in-depth sessions. The same patterns kept surfacing across every conversation.',
  },
  {
    id: 'surveys',
    title: 'Surveys',
    tags: ['navigation', 'communication', 'distraction'],
    preview: '61 responses across two surveys. Validating whether interview frustrations were shared experiences.',
  },
  {
    id: 'observations',
    title: 'Observations',
    tags: ['navigation', 'distraction'],
    preview: 'In-store walkthroughs to see friction in context, not just how people describe it.',
  },
  {
    id: 'ethnography',
    title: 'Online Ethnography',
    tags: ['distraction', 'communication'],
    preview: "Surfacing experiences people wouldn't share face to face.",
  },
];

export function PrimaryResearchMethodsClient({
  observationImages,
  interviewImages,
  surveyImages,
}: {
  observationImages: PublicFolderGalleryImage[];
  interviewImages: PublicFolderGalleryImage[];
  surveyImages: PublicFolderGalleryImage[];
}) {
  const [active, setActive] = useState<MethodId>('interviews');
  const panelRef = useRef<HTMLDivElement>(null);

  const activeMethod = useMemo(() => METHODS.find((m) => m.id === active)!, [active]);

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [active]);

  const renderPanel = (id: MethodId) => {
    if (id === 'interviews') {
      return (
        <>
          <p className="paragraph-new">
            We ran 9 semi-structured interviews with a mix of participants: people with ADHD, dyslexia, ASD,
            and memory difficulties, plus one supermarket staff member who worked across online picking and
            nightfill. Transcripts were thematically grouped using affinity diagrams, which clustered
            findings into four areas: Navigating Stores, Signage, Reducing Cognitive Load, and the broader
            Shopping Experience.
          </p>
          <PublicFolderLightboxGalleryClient
            images={interviewImages}
            groupAriaLabel="Interview transcript excerpts"
            lightboxAriaLabel="Interview transcript image"
          />
          <a className="pr-link" href={SAMPLE_TRANSCRIPT_URL} target="_blank" rel="noopener noreferrer">
            View sample transcript
          </a>

          <div className="pr-accordion">
            <ProjectDetailsAccordion title="Interview findings">
              <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
                <p>
                  <strong>
                    People navigate supermarkets through memory, not signage. <InsightTag insight="navigation" />
                  </strong>
                </p>
                <p>
                  Across interviews, participants described relying heavily on positional memory and mental
                  maps built over repeated visits. Once that internal map exists, shopping feels manageable.
                  When layouts change, or when entering an unfamiliar store, that map collapses and
                  frustration spikes. Aisle signage was widely described as too broad, inconsistent, or
                  unable to meaningfully represent the complexity of what's actually stocked in an aisle.
                </p>
                <blockquote>&quot;The signs on the aisles… they're pretty useless most of the time.&quot;</blockquote>
                <blockquote>
                  &quot;You're trying to encapsulate a whole aisle in a couple of words. That just doesn't work.&quot;
                </blockquote>
                <p>
                  This reliance on memory explains why layout changes feel disproportionately disruptive,
                  even when signage technically exists.
                </p>
                <p>
                  <strong>
                    Category logic often conflicts with how people think. <InsightTag insight="navigation" />
                  </strong>
                </p>
                <p>
                  Participants repeatedly described confusion caused by inconsistent categorisation:
                  products grouped by brand, origin, promotion, or 'inspiration' rather than by how people
                  mentally associate them. Items that logically belong together (toothpaste with bathroom
                  items, sauces with similar cuisines) are often separated across different aisles.
                </p>
                <blockquote>
                  &quot;Sometimes things are sorted by brand, other times by country, other times just scattered.&quot;
                </blockquote>
                <blockquote>
                  &quot;You think you know where it should be… and it turns out it technically fits two categories.&quot;
                </blockquote>
                <p>
                  This mismatch forces people to scan entire aisles, double back, or abandon items
                  altogether, especially for niche or infrequently purchased products.
                </p>
                <p>
                  <strong>
                    Cognitive load accumulates through small frictions. <InsightTag insight="distraction" />
                  </strong>
                </p>
                <p>
                  Very few interviewees described a single catastrophic problem. Instead, stress emerged
                  through stacking micro-frictions: unclear signage, dense shelves, bright lighting, noise,
                  crowds, promotional clutter, and time pressure. For people with ADHD or ASD, this often
                  translated into distraction, decision paralysis, or a strong desire to get in and get out
                  as fast as possible.
                </p>
                <blockquote>
                  &quot;There's just a lot going on… it's more interactive than it needs to be.&quot;
                </blockquote>
                <blockquote>&quot;I could spend an hour comparing things if I don't have a plan.&quot;</blockquote>
                <p>
                  <strong>
                    Help exists, but people avoid using it. <InsightTag insight="communication" />
                  </strong>
                </p>
                <p>
                  Asking staff for help was consistently framed as a last resort, not a support mechanism.
                  Reasons included social anxiety, difficulty finding staff, low confidence that staff would
                  know the answer, or previous negative experiences.
                </p>
                <blockquote>
                  &quot;I don't feel confident asking, and half the time they just point to an aisle anyway.&quot;
                </blockquote>
                <blockquote>&quot;It feels like I'm interrupting them.&quot;</blockquote>
                <p>
                  <strong>
                    Avoidance is already a coping strategy. <InsightTag insight="distraction" />
                  </strong>
                </p>
                <p>
                  Several participants described actively avoiding large supermarkets, busy hours, certain
                  aisles, or specific stores altogether. Others shopped at off-peak times, rushed their
                  trips, or abandoned items when friction became too high.
                </p>
                <blockquote>&quot;I just want to leave as fast as possible.&quot;</blockquote>
                <blockquote>&quot;If it's too busy, I'll come back another time.&quot;</blockquote>
                <p>
                  This reinforces that accessibility issues don't just slow people down. They change
                  behaviour.
                </p>
              </div>
            </ProjectDetailsAccordion>
          </div>

          <p className="paragraph-new pr-closing">
            The interviews revealed that supermarket accessibility issues aren't caused by a lack of effort
            from users, but by environments that demand constant cognitive work. Navigation, categorisation,
            and assistance all rely on users adapting to the system, rather than the system supporting
            diverse ways of thinking.
          </p>
        </>
      );
    }

    if (id === 'surveys') {
      return (
        <>
          <p className="paragraph-new">
            To complement the depth of interviews, we ran a survey to capture broader patterns across
            shopping behaviours and accessibility challenges. The goal was to validate whether the
            frustrations raised in interviews were isolated anecdotes or shared experiences, and to
            identify which issues were most common and most disruptive. The survey combined frequency
            scales, multi-select questions, and open-ended responses, allowing us to capture both
            quantitative trends and qualitative context. We received 61 responses in total, primarily from
            people who shop regularly, making the findings reflective of everyday supermarket experiences
            rather than edge cases.
          </p>

          <PublicFolderLightboxGalleryClient
            images={surveyImages}
            groupAriaLabel="Survey charts and results"
            lightboxAriaLabel="Survey result image"
          />

          <div className="pr-accordion">
            <ProjectDetailsAccordion title="Survey findings">
              <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
                <p>
                  <strong>Who we heard from</strong>
                </p>
                <ul role="list">
                  <li>
                    <strong>83.9%</strong> of respondents were university students
                  </li>
                  <li>
                    Most shop <strong>at least once a week</strong>, with a large portion visiting{' '}
                    <strong>2 to 3 times per week</strong>
                  </li>
                  <li>
                    While only <strong>16.1%</strong> explicitly identified as having a learning difficulty,
                    many still reported challenges associated with cognitive load, navigation, and
                    overstimulation
                  </li>
                </ul>
                <p>
                  <strong>
                    Navigation is the dominant pain point. <InsightTag insight="navigation" />
                  </strong>
                </p>
                <ul role="list">
                  <li>75% of respondents reported difficulty finding specific product locations</li>
                  <li>62.5% cited confusing store layouts</li>
                  <li>29.2% struggled with reading aisle signage</li>
                </ul>
                <p>
                  <strong>
                    Environmental unpredictability increases anxiety. <InsightTag insight="distraction" />
                  </strong>
                </p>
                <ul role="list">
                  <li>60% reported discomfort caused by unpredictable changes in store layout</li>
                  <li>50% identified busy or crowded aisles as a major stressor</li>
                </ul>
                <p>
                  <strong>
                    Information overload affects comprehension. <InsightTag insight="distraction" />
                  </strong>
                </p>
                <ul role="list">
                  <li>46.4% found store signage difficult to read or understand</li>
                  <li>39.3% struggled with nutritional information</li>
                </ul>
                <p>
                  <strong>
                    Self-checkout is efficient until it breaks. <InsightTag insight="communication" />
                  </strong>
                </p>
                <ul role="list">
                  <li>83.3% rated self-checkout as generally easy to use (4 to 5 on a 5-point scale)</li>
                  <li>77.8% identified system errors or alerts as the most frustrating part</li>
                  <li>51.9% found requesting staff assistance during self-checkout difficult or stressful</li>
                </ul>
                <p>
                  <strong>
                    Help exists, but isn't dependable. <InsightTag insight="communication" />
                  </strong>
                </p>
                <p>
                  Most respondents rated asking staff for help as moderately comfortable (ratings clustered
                  around 3 to 4), but open responses revealed hesitation, difficulty locating staff, and low
                  confidence that staff would know where items were.
                </p>
                <p>
                  <strong>
                    Avoidance behaviours are already happening. <InsightTag insight="distraction" />
                  </strong>
                </p>
                <ul role="list">
                  <li>77.4% of respondents reported not using delivery or click-and-collect services</li>
                </ul>
              </div>
            </ProjectDetailsAccordion>
          </div>

          <p className="paragraph-new pr-closing">
            The survey confirmed that supermarket accessibility issues are systemic, not individual.
            Difficulty navigating, processing information, and maintaining focus are common experiences,
            even among people without formally identified disabilities. Importantly, many of these issues
            emerge before checkout, reinforcing the need to address navigation and cognitive load early in
            the shopping journey.
          </p>
        </>
      );
    }

    if (id === 'observations') {
      return (
        <>
          <p className="paragraph-new">
            We conducted in-store walkthroughs to see friction in context, because supermarkets behave
            differently to how people describe them afterwards. Observations helped us spot where stress
            accumulates: decision points, aisle transitions, signage visibility, and moments where users
            considered asking for help but didn't.
          </p>
          <PublicFolderLightboxGalleryClient
            images={observationImages}
            groupAriaLabel="Observation photos"
            lightboxAriaLabel="Observation photo"
          />
        </>
      );
    }

    return (
      <>
        <p className="paragraph-new">
          We used online ethnography as a preliminary method to surface insights that other approaches
          couldn&apos;t easily reach. Given the sensitive and personal nature of many shopping experiences,
          people are often more candid in online spaces than in a face-to-face interview. Analysing these
          accounts helped us identify patterns early, which we then validated through our other research
          methods.
        </p>

        <div className="pr-accordion">
          <ProjectDetailsAccordion title="Ethnography findings">
            <div className="paragraph-new w-richtext u-text-style-main u-child-contain u-rich-text">
              <p>
                <strong>
                  Decision paralysis. <InsightTag insight="distraction" />
                </strong>{' '}
                People described being unable to choose between similar products, unsure whether something
                would work or if it was the right option. The fear of making the wrong choice created stress
                and anxiety that compounded throughout the shop.
              </p>
              <blockquote>
                &quot;The worry that we might choose the wrong option can give us unwanted stress and anxiety.&quot;
              </blockquote>
              <p>
                <strong>
                  Impulsive buying. <InsightTag insight="distraction" />
                </strong>{' '}
                Many people found themselves impulse buying due to strategically placed sale sections,
                limited edition items, or simply chasing a dopamine hit.
              </p>
              <p>
                <strong>
                  Budgeting difficulties. <InsightTag insight="distraction" />
                </strong>{' '}
                People struggled to calculate running totals while shopping, partly due to difficulty
                reading price labels and partly due to challenges with mental arithmetic.
              </p>
              <p>
                <strong>
                  Uncomfortable environments. <InsightTag insight="distraction" />
                </strong>{' '}
                Loud noises and bright lighting cause overstimulation. Poorly stocked shelves force people
                to find alternatives on the spot, triggering decision paralysis. And when stores rearrange
                their layouts, shoppers have to endure the overstimulation for longer as they search for
                products that have moved.
              </p>
            </div>
          </ProjectDetailsAccordion>
        </div>
      </>
    );
  };

  return (
    <div className="pr">
      <div className="pr-grid" role="group" aria-label="Primary research methods">
        {METHODS.map((m) => {
          const isActive = m.id === active;
          return (
            <div key={m.id} className="pr-item">
              <button
                type="button"
                className={`pr-card${isActive ? ' pr-card--active' : ''}`}
                onClick={() => setActive(m.id)}
                aria-expanded={isActive}
              >
                <div className="pr-card__title-row">
                  <div className="pr-card__title">{m.title}</div>
                  <div className="pr-card__tags">
                    {m.tags.map((t) => (
                      <InsightTag key={`${m.id}-${t}`} insight={t} />
                    ))}
                  </div>
                </div>
                <div className="pr-card__preview">{m.preview}</div>
              </button>

              <div className={`pr-panel-mobile${isActive ? ' pr-panel-mobile--open' : ''}`}>
                {isActive ? (
                  <div className="pr-panel pr-panel--animate" role="region" aria-label={`${m.title} details`}>
                    {renderPanel(m.id)}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={panelRef} className="pr-panel-desktop" aria-hidden>
        <div key={active} className="pr-panel pr-panel--animate" role="region" aria-label={`${activeMethod.title} details`}>
          {renderPanel(active)}
        </div>
      </div>
    </div>
  );
}

