'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Horizontal timeline hover JS ─────────────────────────────── */
function TimelineHover() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tl = ref.current;
    if (!tl) return;
    const canHover = matchMedia('(hover:hover) and (pointer:fine)');
    const wide     = matchMedia('(min-width:900px)');
    let enabled = false, active: HTMLElement | null = null;

    const clear = () => {
      if (!active) return;
      active.classList.remove('is-active');
      (active.previousElementSibling as HTMLElement)?.classList.remove('is-left');
      (active.nextElementSibling as HTMLElement)?.classList.remove('is-right');
      active = null;
    };
    const setActive = (el: HTMLElement) => {
      if (!enabled || !el || el === active) return;
      clear();
      active = el;
      el.classList.add('is-active');
      (el.previousElementSibling as HTMLElement)?.classList.add('is-left');
      (el.nextElementSibling as HTMLElement)?.classList.add('is-right');
    };
    const update = () => { enabled = canHover.matches && wide.matches; if (!enabled) clear(); };

    const onMove  = (e: MouseEvent) => {
      if (!enabled) return;
      const ms = (e.target as HTMLElement).closest<HTMLElement>('.milestone');
      if (ms && tl.contains(ms)) setActive(ms);
    };
    const onLeave = () => { if (enabled) clear(); };

    tl.addEventListener('mousemove', onMove);
    tl.addEventListener('mouseleave', onLeave);
    update();
    canHover.addEventListener('change', update);
    wide.addEventListener('change', update);
    return () => {
      tl.removeEventListener('mousemove', onMove);
      tl.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return ref;
}

const MILESTONES = [
  { label: 'Problem Definition',   href: '#section--problem-space' },
  { label: 'Background Research',  href: '#section--research' },
  { label: 'Competitor Analysis',  href: '#section--competitors' },
  { label: 'Prototype (MVP)',       href: '#section--story' },
  { label: 'High-Fi Build',         href: '#section--the-product' },
  { label: 'Product Evaluation',    href: '#section--effectiveness-evaluation' },
];

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.00005L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="16" />
    </svg>
  );
}

/* ── Animated accordion ────────────────────────────────────────── */
function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="accordion_1_component">
      <button
        type="button"
        className="accordion_toggle"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="span u-text-style-h5">{label}</span>
        <div
          className="accordion_1_toggle_icon"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        >
          <ChevronDown />
        </div>
      </button>
      <div
        ref={bodyRef}
        className="accordion_1_content"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="accordion_1_body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiContext() {
  const tlRef = TimelineHover();

  return (
    <section className="default-section">
      <div className="default-container w-container">
        {/* ── Not Your Typical UX Project ── */}
        <h2 className="h2">Not Your Typical UX Project</h2>
        <p className="paragraph-new" style={{ marginBottom: '1.5rem' }}>
          This project is not a traditional UX case study. If you&rsquo;re after that, I&rsquo;d
          recommend checking out my other design projects. This was developed as a{' '}
          <strong>proof of concept</strong>, exploring how AI can create richer, context-aware
          travel experiences. Given the{' '}
          <strong>experimental nature and sprint constraints</strong>, the process doesn&rsquo;t
          follow the standard Double Diamond or end-to-end UX methodology.
        </p>

        {/* ── Horizontal timeline ───── */}
        <div className="timeline aip-context-milestones" ref={tlRef as React.RefObject<HTMLDivElement>} style={{ marginBottom: '1.25rem' }}>
          {MILESTONES.map((m) => (
            <div key={m.label} className="milestone">
              <div className="milestone-inner">
                <a href={m.href} className="label w-button">{m.label}</a>
                <div className="tick" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Project Context accordion ── */}
        <Accordion label="🗂️ Project Context">
          <div className="paragraph-new">
            <p>
              This project was developed as part of a university course centred on the exploration
              of AI in design. Rather than following a traditional UX brief, the task was
              open-ended: <strong>identify a real-world problem and investigate how AI could be
              meaningfully applied</strong>.
            </p>
            <p style={{ marginTop: '1rem' }}>
              The aim wasn&rsquo;t to create a refined product, but to push the boundaries of
              emerging technologies and explore how AI could unlock new opportunities for
              context-aware and user-adaptive design.
            </p>
          </div>
        </Accordion>

        {/* ── The Scope accordion ── */}
        <Accordion label="🎯 The Scope">
          <div className="paragraph-new">
            <p>
              Over the course of a 7-week sprint, I developed the concept from initial idea through
              to proof-of-concept. The work included defining the problem space, researching data
              viability, mapping opportunities, and building a functional demo. While this
              wasn&rsquo;t a full end-to-end design process, the goal was to{' '}
              <strong>justify the opportunity</strong>, build a clear vision for the solution, and
              demonstrate how AI could be integrated seamlessly into the user experience.
            </p>
          </div>
        </Accordion>

        {/* ── My Role accordion ── */}
        <Accordion label="👤 My Role">
          <div className="paragraph-new">
            <p>
              This was for the most part an individual project, meaning I was responsible for every
              stage of the process—from research and concept framing to system logic, content
              design, and technical build.
            </p>
          </div>
        </Accordion>
      </div>
    </section>
  );
}
