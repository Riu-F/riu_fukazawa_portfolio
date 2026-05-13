'use client';

import { useEffect, useState } from 'react';
import CyclingWordmark from './CyclingWordmark';

export default function SiteFooter() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const q = () => setNarrow(window.innerWidth < 640);
    q();
    window.addEventListener('resize', q);
    return () => window.removeEventListener('resize', q);
  }, []);

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="site-footer__container">
        <div className="site-footer__name" aria-label="Riu (cycling wordmark)">
          <CyclingWordmark
            targetVh={narrow ? 0.14 : 0.33}
            clampFontToViewport
            className="site-footer__wordmark"
          />
        </div>

        <p className="site-footer__tagline">Curious by nature, strategic by design.</p>

        <nav className="site-footer__links" aria-label="Contact links">
          <a
            className="site-footer__link"
            href="https://www.linkedin.com/in/riu-fukazawa-a2277a21b"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span className="site-footer__sep" aria-hidden="true">
            ·
          </span>
          <a className="site-footer__link" href="#">
            Resume
          </a>
          <span className="site-footer__sep" aria-hidden="true">
            ·
          </span>
          <a className="site-footer__link" href="mailto:riu@sol.io?subject=Get%20in%20touch!%20">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}

