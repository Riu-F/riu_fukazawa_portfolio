'use client';

import { useState } from 'react';

/* ── TypeScript interfaces (API-ready) ──────────────────────────── */
interface ExpandedSection {
  heading:  string;
  bullets?: string[];
  tip?:     string;
}

interface RecCard {
  icon:     string;
  label:    string;
  summary:  string;
  tag:      string;
  expanded: ExpandedSection[];
}

interface TripInfo {
  destination: string;
  dates:       string;
  travellers:  string;
  nights:      string;
}

interface PersonaData {
  id:       string;
  name:     string;
  traits:   string;
  iconName: string;
  heading:  string;
  sub:      string;
  trip:     TripInfo;
  cards:    RecCard[];
}

/* ── Mock data ──────────────────────────────────────────────────── */
const PERSONAS: PersonaData[] = [
  {
    id:       'dewi',
    name:     'Dewi',
    traits:   'Family · First overseas trip',
    iconName: 'family',
    heading:  'Your Tokyo family holiday is confirmed!',
    sub:      "Hi Dewi — here's a practical wrap-up for your first overseas trip with the kids.",
    trip: { destination: 'Tokyo, Japan', dates: '18–26 Dec', travellers: '4 Guests', nights: '8 nights' },
    cards: [
      {
        icon:    'passport',
        label:   'Arrival & Entry',
        summary: 'Visa requirements, Visit Japan Web, and the easiest airport transfer with kids.',
        tag:     'Essential',
        expanded: [
          {
            heading: 'Before you fly',
            bullets: [
              'Indonesian passports may need a Japanese tourist visa — confirm with the Embassy in Jakarta and allow time for processing.',
              'Complete Visit Japan Web before departure to generate QR codes for immigration and customs.',
              'Tokyo is only 2 hours ahead of Jakarta, so jet lag is minimal.',
            ],
          },
          {
            heading: 'Getting from the airport',
            bullets: [
              'Airport Limousine Bus is the easiest option — ample luggage space, direct to major hotels.',
              'Haneda is closer to central Tokyo (~40 min); Narita takes longer (~1hr 30min by bus).',
            ],
            tip: 'Book limousine bus tickets in advance — they can sell out during December peak season.',
          },
        ],
      },
      {
        icon:    'park',
        label:   'Family Days Out',
        summary: 'Kid-friendly parks, indoor picks for chilly days, and advance ticket tips.',
        tag:     'With kids',
        expanded: [
          {
            heading: 'December weather',
            bullets: [
              'Cool and dry, around 3–10°C with sunset near 4:30 pm.',
              'Pack layers: thermal tops, jumpers, a warm jacket, beanies, and gloves.',
              'Comfortable walking shoes are essential.',
            ],
          },
          {
            heading: 'Recommended picks',
            bullets: [
              'DisneySea or Disneyland — buy dated tickets in advance via the official app.',
              'Sanrio Puroland — great indoor option for younger kids.',
              'Sumida Aquarium at Tokyo Skytree — easy half-day with young children.',
              "Odaiba's DiverCity or Ikspiari (Disney Resort area) for shopping and food.",
            ],
            tip: 'Busy parks sell out weeks ahead in late December — book as soon as possible.',
          },
        ],
      },
      {
        icon:    'train',
        label:   'Getting Around',
        summary: 'Suica cards, child fares, and family-friendly dining including halal options.',
        tag:     'Practical',
        expanded: [
          {
            heading: 'Transport',
            bullets: [
              'Pick up a Suica or PASMO card on arrival — ask station staff to set up child cards at half fare.',
              'IC cards work on trains, buses, and many shops and convenience stores.',
            ],
          },
          {
            heading: 'Food',
            bullets: [
              'Family-friendly options: chicken or shoyu ramen, Japanese curry rice, tempura, gyoza.',
              'For halal options, use the Halal Gourmet Japan app — good coverage around Asakusa and Shinjuku.',
            ],
            tip: 'Convenience stores (7-Eleven, Lawson, FamilyMart) are excellent for quick snacks and reasonably priced meals.',
          },
        ],
      },
    ],
  },
  {
    id:       'jordan',
    name:     'Jordan',
    traits:   'Solo · Photographer · Budget-conscious',
    iconName: 'camera',
    heading:  'Your Kyoto spring getaway is confirmed, Jordan!',
    sub:      "Twelve nights to wander slow — temple walks, design detours, and the tail-end of cherry blossoms.",
    trip: { destination: 'Kyoto, Japan', dates: '1–13 Apr', travellers: '1 Guest', nights: '12 nights' },
    cards: [
      {
        icon:    'train',
        label:   'Airport to City',
        summary: 'JR Haruka Express, IC card setup, and the quickest route into Kyoto.',
        tag:     'Arrival',
        expanded: [
          {
            heading: 'From Kansai (KIX)',
            bullets: [
              'JR Haruka Express runs direct to Kyoto Station — about 75 minutes, no transfers.',
              'Add an ICOCA, Suica, or PASMO card to Apple/Google Wallet for tap-on fares.',
              'IC cards cover trains, subways, most buses, and convenience stores across Kansai.',
            ],
            tip: 'The Haruka Express requires a reserved seat — book online or at the ticket machine on arrival.',
          },
          {
            heading: 'From Itami (ITM)',
            bullets: [
              'Airport limousine bus runs to Kyoto Station in about 55 minutes.',
              'Less convenient than Kansai but works well for early-morning arrivals.',
            ],
          },
        ],
      },
      {
        icon:    'map',
        label:   'April Rhythm',
        summary: 'Beat the crowds at Fushimi Inari, Arashiyama, and Higashiyama — plus the best coffee.',
        tag:     'Discovery',
        expanded: [
          {
            heading: 'Timing',
            bullets: [
              'Fushimi Inari: arrive before sunrise — golden light, almost no crowds.',
              'Arashiyama bamboo grove: before 8 am on weekdays.',
              'Higashiyama lanes: weekday mornings before tour groups arrive (~9 am).',
            ],
          },
          {
            heading: 'Coffee precision',
            bullets: [
              'Weekenders Coffee (Fuyacho) — pour-over specialists, quiet atmosphere.',
              'Kurasu Kyoto (Kyoto Station area) — specialty espresso, great natural light.',
              '% Arabica — two locations: Higashiyama and Arashiyama, both photogenic.',
              'Vermillion Espresso Bar — near Fushimi Inari, ideal post-shoot stop.',
            ],
            tip: "April cherry blossoms typically peak in early April around Maruyama Park and Philosopher's Path — overlap with your first few days.",
          },
        ],
      },
      {
        icon:    'compass',
        label:   'Pack Smart',
        summary: 'April layering guide, waterproofing, and photography restrictions to know.',
        tag:     'Practical',
        expanded: [
          {
            heading: 'What to bring',
            bullets: [
              'Expect 8–20°C with occasional light showers — pack layers and a compact waterproof jacket.',
              'Shoes that handle cobblestones and temple stairs (cushioned soles are ideal).',
              'Small day bag: water, IC card, portable charger for long shooting days.',
            ],
          },
          {
            heading: 'Photography rules',
            bullets: [
              "Many temples and shrines ban tripods — use a compact travel tripod or shoot handheld.",
              "Drones are prohibited across almost all of Kyoto's heritage areas.",
              "Gion's private alleys (Hanamikoji) restrict photography of geiko and maiko entirely.",
            ],
            tip: "The Philosopher's Path is one of the few central spots where tripods are widely accepted — great for long exposures at dusk.",
          },
        ],
      },
    ],
  },
  {
    id:       'harold',
    name:     'Harold & Margaret',
    traits:   'Retired couple · Comfort-led · Art lovers',
    iconName: 'couple',
    heading:  'Your Paris escape is confirmed!',
    sub:      "Bonjour — 9 mellow September nights in Paris, ideal for art, gardens, and unhurried strolls.",
    trip: { destination: 'Paris, France', dates: '8–17 Sep', travellers: '2 Guests', nights: '9 nights' },
    cards: [
      {
        icon:    'car',
        label:   'Arriving with Ease',
        summary: 'Pre-booked chauffeur, official taxi fares, and the easiest route from CDG.',
        tag:     'Arrival',
        expanded: [
          {
            heading: 'Recommended options',
            bullets: [
              'Pre-booked chauffeur: meet-and-greet at the exit, luggage assistance, fixed fare to hotel.',
              'Official taxis have set fares: ~€53 to the Right Bank, ~€58 to the Left Bank.',
              'Avoid unofficial drivers — always use the official taxi rank or a pre-booked service.',
            ],
          },
          {
            heading: 'What to expect',
            bullets: [
              'The journey from CDG to central Paris takes about 45–60 minutes, depending on traffic.',
              'Paris Orly (ORF) is closer — about 30 minutes by taxi.',
            ],
            tip: 'Book a chauffeur in advance if arriving during morning rush (7–9 am) or peak weekends — availability drops quickly.',
          },
        ],
      },
      {
        icon:    'star',
        label:   'Art & Gardens',
        summary: "Timed entries for the Louvre and Musée d'Orsay, plus the most beautiful walks.",
        tag:     'Must-see',
        expanded: [
          {
            heading: 'Book in advance',
            bullets: [
              'Louvre — book timed entry online; closed Tuesdays. Aim for first entry (9 am) to beat crowds.',
              "Musée d'Orsay — closed Mondays; timed entry required in peak season.",
              "Musée de l'Orangerie — closed Tuesdays; smaller, quieter, and home to Monet's Water Lilies.",
            ],
          },
          {
            heading: 'Easy walks and gardens',
            bullets: [
              'Jardin du Luxembourg — beautiful in September, with late-season roses and shaded paths.',
              'Jardins des Tuileries — connects Louvre to Place de la Concorde, ideal for a slow afternoon.',
              'Palais Royal gardens — quieter than most, excellent for sitting and reading.',
            ],
            tip: "The Musée d'Orsay and Louvre are very large — plan one per day and arrive rested. Afternoons are best for smaller galleries.",
          },
        ],
      },
      {
        icon:    'food',
        label:   'Dining & Daily Life',
        summary: 'September weather, reservation tips, and lunch tasting menus for best value.',
        tag:     'Lifestyle',
        expanded: [
          {
            heading: 'September in Paris',
            bullets: [
              'Mild and pleasant: around 12–22°C with occasional light showers.',
              'Pack layers and a light rain jacket — evenings can be cool after dinner.',
              'Supportive, comfortable shoes for cobblestone streets and museum floors.',
            ],
          },
          {
            heading: 'Dining well',
            bullets: [
              'Parisians dine late — restaurants typically fill up from 8 pm onwards.',
              'Book popular bistros and brasseries in advance, especially Friday and Saturday evenings.',
              'Lunch tasting menus at Michelin-starred restaurants offer exceptional value — often half the dinner price.',
              'Look for the "formule" (set lunch) at neighbourhood bistros: typically 2–3 courses under €25.',
            ],
            tip: 'Le Comptoir du Relais (Saint-Germain) and Septime (Bastille) are beloved by locals — book at least 2–3 weeks ahead.',
          },
        ],
      },
    ],
  },
];

/* ── SVG helpers ─────────────────────────────────────────────────── */
function Svg({ children, size = 16, stroke = 'currentColor' }: {
  children: React.ReactNode; size?: number; stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke={stroke}
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Icon({ name, size = 15, stroke = '#666' }: { name: string; size?: number; stroke?: string }) {
  switch (name) {
    case 'passport': return <Svg size={size} stroke={stroke}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 7h6m-6 4h6m-6 4h4"/></Svg>;
    case 'park':     return <Svg size={size} stroke={stroke}><path d="M12 2l4 8H8l4-8z"/><path d="M7 10l5 10 5-10M12 20v-6"/></Svg>;
    case 'train':    return <Svg size={size} stroke={stroke}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20M7 20l-2-2M17 20l2-2"/></Svg>;
    case 'map':      return <Svg size={size} stroke={stroke}><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/></Svg>;
    case 'compass':  return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Svg>;
    case 'car':      return <Svg size={size} stroke={stroke}><path d="M5 17H3a2 2 0 0 1-2-2v-3l2.5-7h13l2.5 7v3a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Svg>;
    case 'star':     return <Svg size={size} stroke={stroke}><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.7l-6.2 4.3 2.4-7.3L2 9.2h7.6z"/></Svg>;
    case 'food':     return <Svg size={size} stroke={stroke}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3m4-3v3m4-3v3"/></Svg>;
    case 'family':   return <Svg size={size} stroke={stroke}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
    case 'camera':   return <Svg size={size} stroke={stroke}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Svg>;
    case 'couple':   return <Svg size={size} stroke={stroke}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
    case 'check':    return <Svg size={size} stroke={stroke}><polyline points="20 6 9 17 4 12"/></Svg>;
    case 'chevron':  return <Svg size={size} stroke={stroke}><polyline points="6 9 12 15 18 9"/></Svg>;
    default:         return <Svg size={size} stroke={stroke}><circle cx="12" cy="12" r="5"/></Svg>;
  }
}

/* ── Persona icon ────────────────────────────────────────────────── */
function PersonaIcon({ iconName, active }: { iconName: string; active: boolean }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background:  active ? '#2a2a2a' : '#f0f0f0',
      transition:  'background 220ms ease-out',
    }}>
      <Icon name={iconName} size={15} stroke={active ? '#fff' : '#777'} />
    </div>
  );
}

/* ── Expandable rec card ─────────────────────────────────────────── */
function ExpandableCard({ card, isExpanded, onToggle }: {
  card:       RecCard;
  isExpanded: boolean;
  onToggle:   () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        background:   isExpanded ? '#fff' : '#f7f7f7',
        borderRadius: 9,
        border:       `1px solid ${isExpanded ? '#e0e0e0' : 'transparent'}`,
        cursor:       'pointer',
        transition:   'border-color 200ms ease, background 200ms ease',
      }}
    >
      {/* Collapsed header — always visible */}
      <div style={{ padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background:  isExpanded ? '#2a2a2a' : '#fff',
              display:     'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink:  0, transition: 'background 200ms ease',
            }}>
              <Icon name={card.icon} size={13} stroke={isExpanded ? '#fff' : '#666'} />
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13.5, fontWeight: 500, color: '#111', lineHeight: 1.2,
            }}>
              {card.label}
            </span>
          </div>
          <div style={{
            transform:  isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 250ms ease',
            flexShrink: 0, marginTop: 2,
          }}>
            <Icon name="chevron" size={14} stroke="#aaa" />
          </div>
        </div>

        {!isExpanded && (
          <span style={{ fontSize: 12, fontWeight: 300, color: '#666', lineHeight: 1.45 }}>
            {card.summary}
          </span>
        )}

        <span style={{
          display:       'inline-block',
          fontFamily:    "'DM Mono', monospace",
          fontSize:      9, fontWeight: 500, letterSpacing: '0.4px',
          textTransform: 'uppercase', color: '#888',
          background:    isExpanded ? '#f0f0f0' : '#ebebeb',
          padding:       '2px 7px', borderRadius: 4,
          alignSelf:     'flex-start', transition: 'background 200ms ease',
        }}>
          {card.tag}
        </span>
      </div>

      {/* Expanded content — animates open/closed */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isExpanded ? '1fr' : '0fr',
        transition: 'grid-template-rows 300ms ease',
      }}>
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '0 12px 14px', borderTop: '1px solid #ebebeb' }}>
            {card.expanded.map((section, si) => (
              <div key={si} style={{ marginTop: 12 }}>
                <div style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      9.5, fontWeight: 500, letterSpacing: '0.7px',
                  textTransform: 'uppercase', color: '#aaa', marginBottom: 6,
                }}>
                  {section.heading}
                </div>
                {section.bullets && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {section.bullets.map((b, bi) => (
                      <li key={bi} style={{
                        fontSize: 12, lineHeight: 1.55, color: '#444',
                        paddingLeft: '1rem', position: 'relative', marginBottom: 4,
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#ccc' }}>–</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {section.tip && (
                  <div style={{
                    marginTop: 8, padding: '7px 10px',
                    background: '#fafafa', borderRadius: 6,
                    borderLeft: '2px solid #d4d4d4',
                    fontSize: 11.5, color: '#666', lineHeight: 1.5, fontStyle: 'italic',
                  }}>
                    {section.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function AiCheckoutPrototype() {
  const [activeIdx, setActiveIdx]         = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const persona = PERSONAS[activeIdx];

  function handlePersonaChange(idx: number) {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setExpandedCards(new Set());
  }

  function toggleCard(cardIdx: number) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardIdx)) next.delete(cardIdx); else next.add(cardIdx);
      return next;
    });
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px 24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      gap: 16,
    }}>

      {/* ── Persona selector ──────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Traveller personas"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {PERSONAS.map((p, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handlePersonaChange(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background:   isActive ? '#fff' : '#fafafa',
                border:       `1px solid ${isActive ? '#b8b8b8' : '#e4e4e4'}`,
                borderRadius: 10, cursor: 'pointer', userSelect: 'none',
                transition:   'border-color 220ms ease-out, background 220ms ease-out, box-shadow 220ms ease-out',
                boxShadow:    isActive
                  ? '0 2px 8px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.04), 0 3px 12px rgba(180,140,240,0.11), 0 3px 12px rgba(130,200,220,0.09)'
                  : 'none',
                outline: 'none',
              }}
            >
              <PersonaIcon iconName={p.iconName} active={isActive} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13, fontWeight: 500, color: '#111', lineHeight: 1.2,
                }}>
                  {p.name}
                </span>
                <span style={{
                  fontSize: 10.5, fontWeight: 400, color: '#999', letterSpacing: '0.1px',
                }}>
                  {p.traits}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Browser chrome + output ────────────────────────────────── */}
      <div style={{
        borderRadius: 14, border: '1px solid #e4e4e4',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.03)',
        overflow: 'hidden', background: '#fff',
      }}>

        {/* Browser toolbar */}
        <div style={{
          height: 32, flexShrink: 0, background: '#f5f5f5',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 5,
        }}>
          {[0,1,2].map(d => (
            <span key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd', flexShrink: 0 }} />
          ))}
          <div style={{
            flex: 1, height: 20, background: '#fff', borderRadius: 4,
            marginLeft: 8, display: 'flex', alignItems: 'center', padding: '0 10px',
            fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#aaa',
            letterSpacing: '0.2px', overflow: 'hidden', whiteSpace: 'nowrap',
          }}>
            travel.app/booking/confirmed
          </div>
        </div>

        {/* Rainbow separator */}
        <div className="ai-output-separator" />

        {/* Output body */}
        <div style={{ padding: '20px 20px 24px' }}>

          {/* Success indicator + heading */}
          <div style={{
            textAlign: 'center', marginBottom: 16,
            paddingBottom: 16, borderBottom: '1px solid #f0f0f0',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: '#2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <Icon name="check" size={15} stroke="#fff" />
            </div>
            <h3 style={{
              fontFamily:    "'Outfit', sans-serif",
              fontSize:      20, fontWeight: 500, letterSpacing: '-0.3px',
              marginBottom:  5, color: '#111',
            }}>
              {persona.heading}
            </h3>
            <p style={{
              fontSize: 13.5, fontWeight: 300, color: '#555',
              lineHeight: 1.5, maxWidth: 420, margin: '0 auto',
            }}>
              {persona.sub}
            </p>
          </div>

          {/* Trip strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
            padding: '9px 16px', background: '#f7f7f7', borderRadius: 8, marginBottom: 16,
          }}>
            {[
              { label: 'Destination', value: persona.trip.destination },
              { label: 'Dates',       value: persona.trip.dates       },
              { label: 'Travellers',  value: persona.trip.travellers  },
              { label: 'Length',      value: persona.trip.nights      },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily:    "'DM Mono', monospace",
                  fontSize:      9.5, fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '0.9px', color: '#aaa', marginBottom: 3,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13.5, fontWeight: 500, color: '#222',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Next steps label */}
          <div style={{
            fontFamily:    "'DM Mono', monospace",
            fontSize:      10, fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '1px', color: '#aaa', marginBottom: 10,
          }}>
            Recommended next steps
          </div>

          {/* Expandable rec cards */}
          <div className="aip-proto-rec-grid">
            {persona.cards.map((card, ci) => (
              <ExpandableCard
                key={`${persona.id}-${ci}`}
                card={card}
                isExpanded={expandedCards.has(ci)}
                onToggle={() => toggleCard(ci)}
              />
            ))}
          </div>

          {/* Footer note */}
          <p style={{
            marginTop:  16, fontSize: 11, color: '#ccc', textAlign: 'center',
            fontFamily: "'DM Mono', monospace", letterSpacing: '0.3px',
          }}>
            Content generated by AI · Based on known traveller data
          </p>
        </div>
      </div>
    </div>
  );
}
