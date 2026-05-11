'use client';

import { PublicFolderLightboxGalleryClient } from '@/app/components/gallery/PublicFolderLightboxGalleryClient';
import type { PublicFolderGalleryImage } from '@/lib/publicFolderGallery';
import { useEffect, useMemo, useRef, useState } from 'react';

import { InsightTag, type CaseStudyInsight } from '../InsightTag';

export type PrototypingGalleryBundle = {
  sketches: PublicFolderGalleryImage[];
  wireframes: PublicFolderGalleryImage[];
  mockups: PublicFolderGalleryImage[];
  hifi: PublicFolderGalleryImage[];
  spatial: PublicFolderGalleryImage[];
  physical: PublicFolderGalleryImage[];
};

type ProtoId = 'digital' | 'spatial' | 'physical';

const HERO: Record<ProtoId, string> = {
  digital: '/super-market-navigation/prototyping/heroes/proto-hero-digital.png',
  spatial: '/super-market-navigation/prototyping/heroes/proto-hero-spatial.png',
  physical: '/super-market-navigation/prototyping/heroes/proto-hero-physical.png',
};

const CARDS: {
  id: ProtoId;
  title: string;
  subtitle: string;
  insights: CaseStudyInsight[];
}[] = [
  {
    id: 'digital',
    title: 'Digital',
    subtitle: 'Five iterations from paper sketches to a coded proof of concept',
    insights: ['navigation', 'communication', 'distraction'],
  },
  {
    id: 'spatial',
    title: 'Spatial',
    subtitle: 'A miniature supermarket model for testing navigation without a real store',
    insights: ['navigation'],
  },
  {
    id: 'physical',
    title: 'Physical',
    subtitle: 'A cardboard basket prototype for a feature we later scrapped',
    insights: ['distraction'],
  },
];

type DigitalStepId = 'sketches' | 'wireframes' | 'mockups' | 'hifi' | 'final';

const DIGITAL_STEPS: { id: DigitalStepId; label: string; description: string }[] = [
  {
    id: 'sketches',
    label: 'Sketches',
    description:
      "We started on paper, sketching out the core screens and annotating how they connected. The shopping list, basket divider, navigation directions, and post-shop overview were all roughed out at this stage, with notes on why each element existed and how it addressed specific pain points. Even at this level we were thinking about accessibility touches: a microphone icon for voice input, a help button that's always reachable, and progressive disclosure in the navigation (a simple direction first, with the option to tap for more detail).",
  },
  {
    id: 'wireframes',
    label: 'Wireframe',
    description:
      'Rather than designing from scratch, we studied existing apps that already solve similar interaction problems well. We used Apple Reminders as a reference for the shopping list (familiar checklist behaviour), Google Maps for the navigation and direction screens (proven wayfinding patterns), and Strava for the post-shop feedback summary (activity tracking with reflection). We built our wireframes alongside screenshots of these apps, adapting their patterns to our specific context rather than reinventing interactions people already understand.',
  },
  {
    id: 'mockups',
    label: 'Mockup',
    description:
      'We refined the wireframes with more detail: additional screens, basic interactions, and the beginning of a visual hierarchy. This is where the flow between screens started to feel like a real journey rather than isolated pages.',
  },
  {
    id: 'hifi',
    label: 'Hi-Fi Figma',
    description:
      "The high-fidelity prototype brought in the full visual language: a purple colour system, emoji identifiers on list items, collaborative lists with shared avatars, and a detailed post-shop report. The report screen is worth noting because it doesn't just show what you spent and how long you took. It compares against your previous shops, showing deltas like “7 minutes faster” or “$12 less spent.” That comparison feature directly targets behaviour awareness and impulse buying reduction, giving users a reason to stick with the structured approach over time.",
  },
  {
    id: 'final',
    label: 'Final Product',
    description:
      'The interactive version attached to this case study was built by me after the university project wrapped up. I wanted to prove the concept could work as a real application, not just a Figma prototype. I built it using Claude Code as an experiment in AI-assisted development, translating our final Figma designs into a functional front-end.',
  },
];

function DigitalProcessStepper({ galleries }: { galleries: PrototypingGalleryBundle }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [prevStepIndex, setPrevStepIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInteractionAtRef = useRef<number>(0);

  const stepCount = DIGITAL_STEPS.length;
  const activePct = stepCount <= 1 ? 0 : (stepIndex / (stepCount - 1)) * 100;

  const step = DIGITAL_STEPS[stepIndex];
  const images = step.id === 'final' ? [] : galleries[step.id];

  const prevStep = prevStepIndex === null ? null : DIGITAL_STEPS[prevStepIndex];
  const prevImages =
    prevStep && prevStep.id !== 'final' ? galleries[prevStep.id as Exclude<DigitalStepId, 'final'>] : [];

  const panelStyle = useMemo(() => ({ ['--proto-line-pct' as string]: `${activePct}%` }), [activePct]);

  const clearIntervalTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearResumeTimeout = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const clearPauseTimeout = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  const scheduleResume = (ms: number) => {
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      setPaused(false);
    }, ms);
  };

  const pauseNow = () => {
    lastInteractionAtRef.current = Date.now();
    clearResumeTimeout();
    setPaused(true);
  };

  useEffect(() => {
    if (paused) {
      clearIntervalTimer();
      return;
    }

    clearIntervalTimer();
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => (i + 1) % DIGITAL_STEPS.length);
    }, 2500);

    return clearIntervalTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    if (prevStepIndex === null) return;
    clearPauseTimeout();
    pauseTimeoutRef.current = setTimeout(() => setPrevStepIndex(null), 260);
    return clearPauseTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevStepIndex, stepIndex]);

  const setActiveStep = (nextIndex: number) => {
    setPrevStepIndex(stepIndex);
    setStepIndex(nextIndex);
    pauseNow();
    scheduleResume(5000);
  };

  const onPanelMouseEnter = () => {
    pauseNow();
  };

  const onPanelMouseLeave = () => {
    // Desktop hover: resume after a short delay so it doesn't jump immediately.
    scheduleResume(2000);
  };

  return (
    <div className="proto-digital">
      <nav
        className="proto-digital__stepper"
        role="tablist"
        aria-label="Digital prototype process"
        style={panelStyle}
      >
        <div className="proto-digital__timeline" aria-hidden="false">
          <div className="proto-digital__track" aria-hidden="true">
            <div className="proto-digital__track-fill" aria-hidden="true" />
          </div>
          <div className="proto-digital__nodes">
          {DIGITAL_STEPS.map((s, i) => (
            // state: completed (past), active, upcoming
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === stepIndex}
              id={`proto-digital-tab-${s.id}`}
              className={`proto-digital__node${
                i < stepIndex ? ' is-complete' : i === stepIndex ? ' is-active' : ' is-upcoming'
              }`}
              onClick={() => setActiveStep(i)}
              onMouseEnter={() => pauseNow()}
            >
              <span className="proto-digital__dot" aria-hidden="true" />
              <span className="proto-digital__label">{s.label}</span>
            </button>
          ))}
          </div>
        </div>
      </nav>

      <div
        className="proto-digital__panel"
        role="tabpanel"
        aria-labelledby={`proto-digital-tab-${step.id}`}
        onMouseEnter={onPanelMouseEnter}
        onMouseLeave={onPanelMouseLeave}
        onPointerDown={() => {
          pauseNow();
          scheduleResume(5000);
        }}
      >
        <div className="proto-digital__panel-stack">
          {prevStep ? (
            <div className="proto-digital__panel-layer proto-digital__panel-layer--exit" aria-hidden="true">
              <p className="paragraph-new proto-digital__desc">{prevStep.description}</p>
              {prevImages.length > 0 && (
                <PublicFolderLightboxGalleryClient
                  images={prevImages}
                  groupAriaLabel={`${prevStep.label} gallery`}
                  lightboxAriaLabel={`${prevStep.label} image`}
                />
              )}
            </div>
          ) : null}

          <div className="proto-digital__panel-layer proto-digital__panel-layer--enter">
            <p className="paragraph-new proto-digital__desc">{step.description}</p>
            {images.length > 0 && (
              <PublicFolderLightboxGalleryClient
                images={images}
                groupAriaLabel={`${step.label} gallery`}
                lightboxAriaLabel={`${step.label} image`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrototypingSectionClient({ galleries }: { galleries: PrototypingGalleryBundle }) {
  const [active, setActive] = useState<ProtoId>('digital');
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);

  const setOpen = (id: ProtoId) => {
    setActive(id);
  };

  return (
    <div className="proto-section">
      <div className="proto-cards">
        {CARDS.map((card) => {
          const isActive = active === card.id;
          return (
            <button
              key={card.id}
              type="button"
              className={`proto-card${isActive ? ' proto-card--active' : ''}`}
              onClick={() => setOpen(card.id)}
              aria-expanded={isActive}
            >
              <span className="proto-card__hero">
                <img src={HERO[card.id]} alt="" width={960} height={540} className="proto-card__hero-img" />
              </span>
              <span className="proto-card__meta">
                <span className="proto-card__title">{card.title}</span>
                <span className="proto-card__tags">
                  {card.insights.map((ins) => (
                    <InsightTag key={`${card.id}-${ins}`} insight={ins} />
                  ))}
                </span>
                <span className="proto-card__subtitle">{card.subtitle}</span>
                <span className="proto-card__cta">
                  View process <span aria-hidden="true">↗</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div ref={expandedRef} className="proto-expanded proto-expanded--open">
        <div className="proto-expanded__inner">
          <div className="proto-expanded__head">
            <div className="proto-expanded__titles">
              <h3 className="proto-expanded__heading h4">{CARDS.find((c) => c.id === active)!.title}</h3>
              <span className="proto-expanded__tags">
                {CARDS.find((c) => c.id === active)!.insights.map((ins) => (
                  <InsightTag key={`${active}-${ins}`} insight={ins} />
                ))}
              </span>
            </div>
          </div>

          <div className="proto-expanded__body">
            {active === 'digital' && <DigitalProcessStepper galleries={galleries} />}

            {active === 'spatial' && (
              <div className="proto-spatial">
                <p className="paragraph-new proto-spatial__lead">
                  We didn&apos;t design from scratch. We studied what already works and built from there.
                </p>
                <p className="paragraph-new">
                  To test how the app&apos;s digital map would translate to real-world wayfinding, we built a
                  miniature supermarket. Boxes stood in for shelves, a small figurine represented the shopper,
                  and the items on their list were placed inside the boxes. When the app said &quot;move
                  forward,&quot; the tester moved their figurine. When it said &quot;get item from shelf,&quot;
                  they opened the box and added the item to a small basket.
                </p>
                <p className="paragraph-new">
                  It sounds simple, and it was. That was the point. We could have taken testers into an actual
                  supermarket, but at this stage we needed to run tests quickly with multiple participants and
                  observe how they interpreted the app&apos;s directions in a spatial context. The model let us
                  do that in a controlled setting where we could watch decision-making happen in real time
                  without the noise and unpredictability of a live store.
                </p>
                <PublicFolderLightboxGalleryClient
                  images={galleries.spatial}
                  groupAriaLabel="Spatial prototype photos"
                  lightboxAriaLabel="Spatial prototype"
                />
              </div>
            )}

            {active === 'physical' && (
              <div className="proto-physical">
                <p className="paragraph-new">
                  Part of our university brief required a physical prototype component. We designed a shopping
                  basket with a moveable divider: the app would analyse your list and tell you how to section
                  your basket (for example, &quot;move the divider here, 60% of your items are vegetables&quot;).
                  The idea was to make purchasing categories physically visible, helping users notice when they
                  were adding unplanned items.
                </p>
                <p className="paragraph-new">
                  The first version was rough. Cardboard, masking tape, a green divider labelled &quot;VEG.&quot;
                  It was functional enough to put in front of testers and ask whether the concept made sense.
                </p>
                <h4 className="proto-physical__subheading">Version 2</h4>
                <p className="paragraph-new">
                  After initial testing, users found the divider system confusing. We refined it with stronger
                  dividers, colour-coded sections, and realistic objects that testers could physically place
                  into the basket. This made the interaction feel more tangible and gave us clearer feedback on
                  whether the categorisation logic was intuitive.
                </p>
                <p className="paragraph-new">
                  Ultimately, the basket system was dropped after user testing showed it added complexity without
                  enough benefit. The app&apos;s digital list and post-shop report already addressed impulse
                  buying more effectively. That decision is covered in the next section.
                </p>
                <PublicFolderLightboxGalleryClient
                  images={galleries.physical}
                  groupAriaLabel="Physical prototype photos"
                  lightboxAriaLabel="Physical prototype"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
