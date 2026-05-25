import Image from 'next/image';

import { getSuedeMarqueeLogos } from '@/lib/suedeMarqueeLogos';

import { SuedeLogoMarquee } from './SuedeLogoMarquee';

const SUEDE_LOGO_SRC = '/desk-items/suede/suede-logo.jpg';

export default function SuedeIntro() {
  const logos = getSuedeMarqueeLogos();

  return (
    <section className="suede-intro" aria-labelledby="suede-intro-heading">
      <div className="suede-intro__inner default-container w-container">
        <header className="suede-intro__identity">
          <div className="suede-intro__logo-mark" aria-hidden="true">
            <Image
              src={SUEDE_LOGO_SRC}
              alt=""
              width={52}
              height={52}
              className="suede-intro__logo-img"
              priority
            />
          </div>
          <div className="suede-intro__identity-text">
            <span className="suede-intro__org-name">SUEDE</span>
            <span className="suede-intro__org-subtitle">
              Sydney University Experience Designers
            </span>
          </div>
        </header>

        <h1 id="suede-intro-heading" className="suede-intro__heading">
          I designed how students meet industry.
        </h1>

        <p className="suede-intro__subtitle">
          As Industry Events Director at SUEDE, I shaped events that connected design students
          with companies like Microsoft, Atlassian, Macquarie, and Deloitte. Not just panels and
          talks, but structured interactions designed to reduce the barriers between students and
          working professionals.
        </p>

        <SuedeLogoMarquee logos={logos} />
      </div>
    </section>
  );
}
