'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type NavCurrent = 'home' | 'about' | 'ai-project' | 'supermarket' | undefined;

interface AiNavProps {
  current?: NavCurrent;
  /** Frosted dark pill for pages with dark full-bleed backgrounds (e.g. 404 pond). */
  transparent?: boolean;
}

type OpenFolder = 'projects' | 'contact' | null;

const LEAVE_MS = 160;

/*
  AiNav
  ─────
  • Desktop (≥ 769px): centred frosted pill — Home | About | Projects ▾ | Contact ▾
    Projects / Contact open layered folder panels (hover + click, Escape to close).
  • Mobile (≤ 768px): hamburger + bottom folder dock (unchanged).

  Desktop Projects contains Accessible Supermarkets + AI x Design.
  Desktop Contact contains Email + LinkedIn.
*/
export default function AiNav({ current, transparent = false }: AiNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFolder, setOpenFolder] = useState<OpenFolder>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const projectsActive =
    current === 'ai-project' || current === 'supermarket';

  const close = useCallback(() => setMobileOpen(false), []);
  const toggle = useCallback(() => setMobileOpen((o) => !o), []);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const scheduleCloseFolder = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => setOpenFolder(null), LEAVE_MS);
  }, [clearLeaveTimer]);

  const openProjects = useCallback(() => {
    clearLeaveTimer();
    setOpenFolder('projects');
  }, [clearLeaveTimer]);

  const openContact = useCallback(() => {
    clearLeaveTimer();
    setOpenFolder('contact');
  }, [clearLeaveTimer]);

  const toggleProjects = useCallback(() => {
    clearLeaveTimer();
    setOpenFolder((o) => (o === 'projects' ? null : 'projects'));
  }, [clearLeaveTimer]);

  const toggleContact = useCallback(() => {
    clearLeaveTimer();
    setOpenFolder((o) => (o === 'contact' ? null : 'contact'));
  }, [clearLeaveTimer]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, close]);

  /* Desktop: Escape closes folder panels */
  useEffect(() => {
    if (!openFolder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenFolder(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openFolder]);

  /* Desktop: click outside closes folders */
  useEffect(() => {
    if (!openFolder) return;
    const onDocPointerDown = (e: MouseEvent | PointerEvent) => {
      const nav = navRef.current;
      if (nav && !nav.contains(e.target as Node)) setOpenFolder(null);
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [openFolder]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, [clearLeaveTimer]);

  return (
    <>
      {/* Desktop — centred pill + folder dropdowns */}
      <nav
        ref={navRef}
        className={`aip-nav-bar aip-nav-bar--desktop${transparent ? ' aip-nav-bar--transparent' : ''}`}
        aria-label="Site"
      >
        <Link href="/" className={current === 'home' ? 'current' : undefined}>
          Home
        </Link>
        <span className="nav-divider" aria-hidden />

        <Link href="/about" className={current === 'about' ? 'current' : undefined}>
          About
        </Link>
        <span className="nav-divider" aria-hidden />

        <div
          className={`aip-nav-dd aip-nav-dd--projects${openFolder === 'projects' ? ' aip-nav-dd--open' : ''}`}
          onMouseEnter={openProjects}
          onMouseLeave={scheduleCloseFolder}
        >
          <button
            type="button"
            className={`aip-nav-dd__trigger aip-nav-dd__trigger--projects${projectsActive ? ' current' : ''}`}
            aria-expanded={openFolder === 'projects'}
            aria-haspopup="true"
            aria-controls="aip-nav-panel-projects"
            id="aip-nav-trigger-projects"
            onClick={toggleProjects}
          >
            Projects
          </button>
          <div
            id="aip-nav-panel-projects"
            role="region"
            aria-labelledby="aip-nav-trigger-projects"
            aria-hidden={openFolder !== 'projects'}
            className="aip-nav-dd__panel aip-nav-dd__panel--projects"
          >
            <div className="aip-nav-dd__panel-inner">
              <Link
                href="/super-market-navigation"
                className={`aip-nav-dd__link aip-nav-dd__link--supermarket${current === 'supermarket' ? ' current' : ''}`}
                onClick={() => setOpenFolder(null)}
              >
                Accessible Supermarkets
              </Link>
              <Link
                href="/ai-project"
                className={`aip-nav-dd__link aip-nav-dd__link--ai${current === 'ai-project' ? ' current' : ''}`}
                onClick={() => setOpenFolder(null)}
              >
                AI x Design
              </Link>
            </div>
          </div>
        </div>

        <span className="nav-divider" aria-hidden />

        <div
          className={`aip-nav-dd aip-nav-dd--contact${openFolder === 'contact' ? ' aip-nav-dd--open' : ''}`}
          onMouseEnter={openContact}
          onMouseLeave={scheduleCloseFolder}
        >
          <button
            type="button"
            className="aip-nav-dd__trigger aip-nav-dd__trigger--contact"
            aria-expanded={openFolder === 'contact'}
            aria-haspopup="true"
            aria-controls="aip-nav-panel-contact"
            id="aip-nav-trigger-contact"
            onClick={toggleContact}
          >
            Contact
          </button>
          <div
            id="aip-nav-panel-contact"
            role="region"
            aria-labelledby="aip-nav-trigger-contact"
            aria-hidden={openFolder !== 'contact'}
            className="aip-nav-dd__panel aip-nav-dd__panel--contact"
          >
            <div className="aip-nav-dd__panel-inner">
              <a href="mailto:riu.fukazawa@gmail.com" onClick={() => setOpenFolder(null)}>
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/riu-fukazawa-a2277a21b/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpenFolder(null)}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile — hamburger + folder-tab dock */}
      <div className={`aip-nav-mobile${mobileOpen ? ' aip-nav-mobile--open' : ''}${transparent ? ' aip-nav-mobile--transparent' : ''}`}>
        <button
          type="button"
          className="aip-nav-mobile-toggle"
          aria-expanded={mobileOpen}
          aria-controls="aip-nav-mobile-panels"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={toggle}
        >
          <span className="aip-nav-mobile-toggle-bars" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="aip-nav-mobile-toggle-close" aria-hidden />
        </button>

        <div
          className="aip-nav-mobile-backdrop"
          aria-hidden={!mobileOpen}
          onClick={close}
        />

        <div
          id="aip-nav-mobile-panels"
          className="aip-nav-mobile-dock"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Folders stack from back to front: Home → About → Projects → Contact.
              Each one's coloured bottom tucks under the next via negative margin
              on .aip-folder + matching padding-bottom on .aip-folder-sheet. */}
          <div className="aip-folder aip-folder--home">
            <div className="aip-folder-tab" aria-hidden>Home</div>
            <div className="aip-folder-sheet aip-folder-sheet--home">
              <ul className="aip-folder-list">
                <li>
                  <Link href="/" onClick={close}>Home</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="aip-folder aip-folder--about">
            <div className="aip-folder-tab" aria-hidden>About</div>
            <div className="aip-folder-sheet aip-folder-sheet--about">
              <ul className="aip-folder-list">
                <li>
                  <Link href="/about" onClick={close}>About</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="aip-folder aip-folder--projects">
            <div className="aip-folder-tab" aria-hidden>Projects</div>
            <div className="aip-folder-sheet aip-folder-sheet--projects">
              <ul className="aip-folder-list">
                <li>
                  <Link href="/super-market-navigation" onClick={close}>
                    Accessible Supermarkets
                  </Link>
                </li>
                <li>
                  <Link href="/ai-project" onClick={close}>AI x Design</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="aip-folder aip-folder--contact">
            <div className="aip-folder-tab" aria-hidden>Contact</div>
            <div className="aip-folder-sheet aip-folder-sheet--contact">
              <ul className="aip-folder-list">
                <li>
                  <a href="mailto:riu.fukazawa@gmail.com" onClick={close}>Email</a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/riu-fukazawa-a2277a21b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
