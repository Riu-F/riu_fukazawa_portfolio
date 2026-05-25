import { publicAssetExists } from '@/lib/publicAssetExists';

import { SuedeEventCardMedia } from './SuedeEventCardMedia';

const EVENTS = [
  {
    imageSrc: '/desk-items/suede/events/case-crack/IMG_0318.jpg',
    imageFile: 'desk-items/suede/events/case-crack/IMG_0318.jpg',
    placeholderLabel: 'Design Case Crack',
    imageAlt: 'Deloitte Design Case Crack event',
    company: 'Deloitte Digital',
    title: 'Design Case Crack',
    description:
      "An 8-hour design challenge with 24 students in teams of 4-5. Industry mentors from Deloitte guided teams through a live design brief, ending with pitches to a panel of judges. I coordinated the partnership, structured the day's flow, and ran operations on the ground.",
  },
  {
    imageSrc: '/desk-items/suede/events/panels/IMG_6021.jpeg',
    imageFile: 'desk-items/suede/events/panels/IMG_6021.jpeg',
    placeholderLabel: 'Design Leaders Panel',
    imageAlt: 'Macquarie Design Leaders Panel event',
    company: 'Macquarie Group',
    title: 'Design Leaders Panel',
    description:
      "Four senior design leaders, including Macquarie's Global Head of Product Design, speaking to a full lecture theatre. The format moved from panel to breakout discussions to open networking. I co-planned the event structure and managed coordination between SUEDE and the Macquarie team.",
  },
  {
    imageSrc: '/desk-items/suede/events/portfolio-party/HWU_6842.JPG',
    imageFile: 'desk-items/suede/events/portfolio-party/HWU_6842.JPG',
    placeholderLabel: 'Portfolio Party',
    imageAlt: 'Atlassian Portfolio Party event',
    company: 'Atlassian',
    title: 'Portfolio Party',
    description:
      "Portfolio reviews with working Atlassian designers. Students brought their work, got direct feedback, and asked about internship pathways. Hosted at Atlassian's George Street office. I helped design the event flow so that every student got meaningful face time rather than standing around awkwardly.",
  },
  {
    imageSrc: '/desk-items/suede/events/speed-networking/speed-networking.jpg',
    imageFile: 'desk-items/suede/events/speed-networking/speed-networking.jpg',
    placeholderLabel: 'Speed Networking',
    imageAlt: 'Speed Networking event',
    company: 'frog · EY · Atlassian',
    title: 'Speed Networking',
    description:
      'Networking events where students rotate between professionals from frog, EY, and Atlassian. I noticed students kept freezing up, not knowing what to ask. So I designed a structured question sheet: conversation starters organised by theme (career path, day-to-day work, advice for students) that gave people a starting point without scripting the interaction. Small intervention, big difference in conversation quality.',
  },
] as const;

export default function SuedeEvents() {
  return (
    <section className="suede-events" aria-labelledby="suede-events-label">
      <div className="suede-events__inner default-container w-container">
        <p id="suede-events-label" className="suede-events__label">
          [Events]
        </p>

        <ul className="suede-events__grid">
          {EVENTS.map((event) => (
            <li key={event.title} className="suede-events__card">
              <SuedeEventCardMedia
                src={event.imageSrc}
                alt={event.imageAlt}
                placeholderLabel={event.placeholderLabel}
                imageAvailable={publicAssetExists(event.imageFile)}
              />
              <div className="suede-events__body">
                <span className="suede-events__company">{event.company}</span>
                <h3 className="suede-events__title">{event.title}</h3>
                <p className="suede-events__description">{event.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
