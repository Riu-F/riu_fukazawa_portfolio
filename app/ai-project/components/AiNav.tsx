'use client';

import { useEffect, useState, useCallback } from 'react';

interface AiNavProps {
  current?: 'home' | 'ai-project';
}

export default function AiNav({ current = 'ai-project' }: AiNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);
  const toggle = useCallback(() => setMobileOpen((o) => !o), []);

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

  return (
    <>
      {/* Desktop pill nav — hidden on small screens via CSS */}
      <nav className="aip-nav-bar aip-nav-bar--desktop" aria-label="Main navigation">
        <a href="/" className={current === 'home' ? 'current' : ''}>Home</a>
        <div className="nav-divider" />
        <a href="/ai-project" className={current === 'ai-project' ? 'current' : ''}>Ai &times; Design</a>
        <a href="/supermarket">Supermarket Navigation</a>
      </nav>

      {/* Mobile — hamburger + folder-tab panels (hidden ≥ 769px via CSS) */}
      <div className={`aip-nav-mobile${mobileOpen ? ' aip-nav-mobile--open' : ''}`}>
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
          {/* Back layer — Projects (paper folder) */}
          <div className="aip-folder aip-folder--projects">
            <div className="aip-folder-tab" aria-hidden>Projects</div>
            <div className="aip-folder-sheet aip-folder-sheet--projects">
              <ul className="aip-folder-list">
                <li>
                  <a href="/" onClick={close}>Home</a>
                </li>
                <li>
                  <a href="/ai-project" onClick={close}>Ai &times; Design</a>
                </li>
                <li>
                  <a href="/supermarket" onClick={close}>Supermarket Navigation</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Front layer — Contact (sticky-note yellow) */}
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
