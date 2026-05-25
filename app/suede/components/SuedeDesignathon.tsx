import { PublicFolderLightboxGallery } from '@/app/components/gallery';
import { getPublicFolderGalleryImages } from '@/lib/publicFolderGallery';
import { publicAssetExists } from '@/lib/publicAssetExists';

import { SuedeDesignathonHero } from './SuedeDesignathonHero';

const DESIGNATHON_STATS = [
  { value: '150', label: 'participants' },
  { value: '3', label: 'days' },
  { value: '4', label: 'university societies' },
  { value: '30+', label: 'mentors & judges' },
] as const;

const COLLABORATING_SOCIETIES = [
  'GDG on Campus USYD',
  'StartUp Link USYD',
  'UNSW Design Society',
  'UTS UXID Society',
] as const;

const HERO_SRC = '/desk-items/suede/designathon/designathon-cover-photo.jpeg';
const HERO_PATH = 'desk-items/suede/designathon/designathon-cover-photo.jpeg';
const SPONSORS_FOLDER = 'desk-items/suede/designathon/sponsors';
const PHOTOS_FOLDER = 'desk-items/suede/designathon/photos';

export default function SuedeDesignathon() {
  const sponsorLogos = getPublicFolderGalleryImages(SPONSORS_FOLDER, 'Designathon sponsor');
  const hasSponsors = sponsorLogos.length > 0;
  const hasPhotos =
    getPublicFolderGalleryImages(PHOTOS_FOLDER, 'Designathon').length > 0;

  return (
    <section className="suede-designathon" aria-labelledby="suede-designathon-label">
      <div className="suede-designathon__inner default-container w-container">
        <p id="suede-designathon-label" className="suede-designathon__label">
          [Designathon]
        </p>

        <SuedeDesignathonHero
          src={HERO_SRC}
          imageAvailable={publicAssetExists(HERO_PATH)}
        />

        <div className="suede-designathon__intro">
          <div className="suede-designathon__copy">
            <h2 className="suede-designathon__title">SUEDE Designathon 2025</h2>
            <p className="suede-designathon__dates">26–28 September</p>
            <p className="suede-designathon__description">
              The biggest event I helped organise. A 3-day design competition bringing together
              135-150 participants from four university societies across Sydney. Teams of 3-5 tackled
              a brief around digital literacy and ethical digital experiences, supported by 30+
              mentors and judges from across the industry.
            </p>
            <p className="suede-designathon__description">
              My role spanned industry coordination, sponsor management, event operations, and
              on-the-ground facilitation across all three days. This wasn&apos;t a student meetup.
              It was closer to a small design conference.
            </p>
          </div>

          <ul className="suede-designathon__stats" aria-label="Designathon at a glance">
            {DESIGNATHON_STATS.map((stat) => (
              <li key={stat.label} className="suede-designathon__stat">
                <span className="suede-designathon__stat-value">{stat.value}</span>
                <span className="suede-designathon__stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="suede-designathon__collab">
          <span className="suede-designathon__meta-label">In collaboration with</span>
          <ul className="suede-designathon__societies">
            {COLLABORATING_SOCIETIES.map((name) => (
              <li key={name} className="suede-designathon__society">
                {name}
              </li>
            ))}
          </ul>
        </div>

        {hasSponsors ? (
          <div className="suede-designathon__sponsors">
            <span className="suede-designathon__meta-label">Sponsored by</span>
            <ul className="suede-designathon__sponsor-logos" aria-label="Designathon sponsors">
              {sponsorLogos.map((logo) => (
                <li key={logo.src} className="suede-designathon__sponsor-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="suede-designathon__sponsor-logo"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasPhotos ? (
          <div className="suede-designathon__gallery">
            <PublicFolderLightboxGallery
              folder={PHOTOS_FOLDER}
              groupAriaLabel="Designathon photo gallery"
              lightboxAriaLabel="Designathon photo"
              imageAltPrefix="Designathon"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
