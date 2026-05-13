import type { Persona, CheckoutData } from './ai-checkout-types';

/* ── Input: persona selector ────────────────────────────────────── */
export const PERSONAS: Persona[] = [
  { id: 'dewi',   name: 'Dewi',               traits: 'Family · First overseas trip',       iconName: 'family' },
  { id: 'jordan', name: 'Jordan',              traits: 'Solo · Photographer · Budget-led',   iconName: 'camera' },
  { id: 'harold', name: 'Harold & Margaret',   traits: 'Retired couple · Comfort · Art',     iconName: 'couple' },
];

/* ── Output: one CheckoutData per persona ───────────────────────── */
const MOCK_DATA: Record<string, CheckoutData> = {
  dewi: {
    title:    'Your Tokyo family holiday is confirmed!',
    subtitle: "Hi Dewi — here's a practical wrap-up for your first overseas trip with the kids.",
    trip_info: { destination: 'Tokyo, Japan', dates: '18–26 Dec', travellers: '4 Guests', nights: '8 nights' },
    cards: [
      {
        id:      'arrival',
        icon:    'passport',
        title:   'Arrival & Entry',
        summary: 'Visa requirements, Visit Japan Web, and the easiest airport transfer with kids.',
        tag:     'Essential',
        expanded: {
          intro: "Here are the essentials to sort before you land — entry requirements, Visit Japan Web registration, and the most hassle-free way to get from the airport with luggage and young children.",
          sections: [
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
                'Airport Limousine Bus is the easiest option — ample luggage space, direct routes to major hotels.',
                'Haneda is closer to central Tokyo (~40 min); Narita takes longer (~1hr 30min by bus).',
              ],
              tip: 'Book limousine bus tickets in advance — they sell out during December peak season.',
            },
          ],
        },
      },
      {
        id:      'days-out',
        icon:    'park',
        title:   'Family Days Out',
        summary: 'Kid-friendly parks, indoor picks for chilly days, and advance ticket tips.',
        tag:     'With kids',
        expanded: {
          intro: "Tokyo in late December means winter weather, illuminations, and very popular attractions. Knowing what to book — and what fills up fast — makes the difference between a smooth holiday and a stressful one.",
          sections: [
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
      },
      {
        id:      'getting-around',
        icon:    'train',
        title:   'Getting Around',
        summary: 'Suica cards, child fares, halal dining, and convenience store tips.',
        tag:     'Family tip',
        expanded: {
          intro: "IC cards make Tokyo's transport system easy for the whole family, and there are some specifically family-friendly food options worth knowing before you arrive.",
          sections: [
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
      },
    ],
  },

  jordan: {
    title:    'Your Kyoto spring getaway is confirmed, Jordan!',
    subtitle: "Twelve nights to wander slow — temple walks, design detours, and the tail-end of cherry blossoms.",
    trip_info: { destination: 'Kyoto, Japan', dates: '1–13 Apr', travellers: '1 Guest', nights: '12 nights' },
    cards: [
      {
        id:      'airport-to-city',
        icon:    'train',
        title:   'Airport to City',
        summary: 'JR Haruka Express, IC card setup, and the quickest route into Kyoto.',
        tag:     'Getting there',
        expanded: {
          intro: "Getting from the airport to Kyoto is straightforward, but a few small decisions at arrival will save time and hassle for the rest of the trip.",
          sections: [
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
      },
      {
        id:      'april-rhythm',
        icon:    'map',
        title:   'April Rhythm',
        summary: 'Beat the crowds at Fushimi Inari, Arashiyama, and Higashiyama — plus the best coffee.',
        tag:     'Golden hour',
        expanded: {
          intro: "April is Kyoto's peak season for a reason — the light is extraordinary and the city is at its most photogenic. The difference between a crowd-heavy day and a quiet one is almost entirely about timing.",
          sections: [
            {
              heading: 'Timing',
              bullets: [
                'Fushimi Inari: arrive before sunrise — golden light, almost no crowds.',
                'Arashiyama bamboo grove: before 8 am on weekdays.',
                'Higashiyama lanes: weekday mornings before tour groups arrive (~9 am).',
              ],
            },
            {
              heading: 'Coffee stops',
              bullets: [
                'Weekenders Coffee (Fuyacho) — pour-over specialists, quiet atmosphere.',
                'Kurasu Kyoto (near Kyoto Station) — specialty espresso, great natural light.',
                '% Arabica — two locations: Higashiyama and Arashiyama, both photogenic.',
                'Vermillion Espresso Bar — near Fushimi Inari, ideal post-shoot stop.',
              ],
              tip: "Cherry blossoms typically peak in early April around Maruyama Park and Philosopher's Path — overlap with your first few days.",
            },
          ],
        },
      },
      {
        id:      'pack-smart',
        icon:    'compass',
        title:   'Pack Smart',
        summary: 'April layering guide, waterproofing, and photography restrictions to know.',
        tag:     'Gear & rules',
        expanded: {
          intro: "Twelve nights means you'll feel everything April throws at you. A few non-obvious items and some site-specific rules will make your shooting days noticeably smoother.",
          sections: [
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
                "Many temples and shrines ban tripods — check each site before setting up.",
                "Drones are prohibited across almost all of Kyoto's heritage areas.",
                "Gion's private alleys (Hanamikoji) restrict photography of geiko and maiko entirely.",
              ],
              tip: "Philosopher's Path is one of the few central spots where tripods are widely accepted — great for long exposures at dusk.",
            },
          ],
        },
      },
    ],
  },

  harold: {
    title:    'Your Paris escape is confirmed!',
    subtitle: "Bonjour — 9 mellow September nights in Paris, ideal for art, gardens, and unhurried strolls.",
    trip_info: { destination: 'Paris, France', dates: '8–17 Sep', travellers: '2 Guests', nights: '9 nights' },
    cards: [
      {
        id:      'arriving',
        icon:    'car',
        title:   'Arriving with Ease',
        summary: 'Pre-booked chauffeur, official taxi fares, and the smoothest route from CDG.',
        tag:     'Premium',
        expanded: {
          intro: "Paris CDG can feel chaotic after a long flight. A pre-arranged transfer removes all the friction — here's what to expect and how to organise it.",
          sections: [
            {
              heading: 'Best options from CDG',
              bullets: [
                'Pre-booked chauffeur: meet-and-greet at the exit, luggage assistance, fixed fare to hotel.',
                'Official taxis have set fares: ~€53 to the Right Bank, ~€58 to the Left Bank.',
                'Avoid unofficial drivers — always use the official taxi rank or a pre-booked service.',
              ],
            },
            {
              heading: 'Journey times',
              bullets: [
                'CDG to central Paris takes about 45–60 minutes, depending on traffic.',
                'Paris Orly (ORF) is closer — about 30 minutes by taxi.',
              ],
              tip: 'Book a chauffeur in advance if arriving during morning rush (7–9 am) or peak weekends — availability drops quickly.',
            },
          ],
        },
      },
      {
        id:      'art-gardens',
        icon:    'star',
        title:   'Art & Gardens',
        summary: "Timed entries for the Louvre and Musée d'Orsay, plus the most beautiful walks.",
        tag:     'Curated',
        expanded: {
          intro: "Paris in September is ideal — the summer crowds have thinned and the city is at its most pleasant. The galleries and parks deserve unhurried mornings and a plan that doesn't rush.",
          sections: [
            {
              heading: 'Book in advance',
              bullets: [
                'Louvre — book timed entry online; closed Tuesdays. Aim for first entry (9 am) to beat crowds.',
                "Musée d'Orsay — closed Mondays; timed entry required in peak season.",
                "Musée de l'Orangerie — closed Tuesdays; smaller, quieter, home to Monet's Water Lilies.",
              ],
            },
            {
              heading: 'Gardens & walks',
              bullets: [
                'Jardin du Luxembourg — beautiful in September, with late-season roses and shaded paths.',
                'Jardins des Tuileries — connects Louvre to Place de la Concorde, ideal for a slow afternoon.',
                'Palais Royal gardens — quieter than most, excellent for sitting and reading.',
              ],
              tip: "The Louvre and Musée d'Orsay are very large — plan one per day and arrive rested. Afternoons are best for smaller galleries.",
            },
          ],
        },
      },
      {
        id:      'dining',
        icon:    'food',
        title:   'Dining & Daily Life',
        summary: 'September weather, reservation tips, and lunch tasting menus for the best value.',
        tag:     'Fine dining',
        expanded: {
          intro: "Paris dining operates on its own rhythm — slow lunches, late dinners, and a preference for neighbourhood bistros over tourist-facing spots. Here's how to navigate it well.",
          sections: [
            {
              heading: 'September in Paris',
              bullets: [
                'Mild and pleasant: around 12–22°C with occasional light showers.',
                'Pack a light rain jacket — evenings can be cool after dinner.',
                'Comfortable shoes for cobblestone streets and museum floors.',
              ],
            },
            {
              heading: 'Dining well',
              bullets: [
                'Parisians dine late — restaurants fill up from 8 pm onwards.',
                'Book popular bistros and brasseries in advance, especially Friday and Saturday evenings.',
                'Lunch tasting menus at Michelin-starred restaurants offer exceptional value — often half the dinner price.',
                'Look for the "formule" at neighbourhood bistros: typically 2–3 courses under €25.',
              ],
              tip: 'Le Comptoir du Relais (Saint-Germain) and Septime (Bastille) are beloved by locals — book at least 2–3 weeks ahead.',
            },
          ],
        },
      },
    ],
  },
};

/* ── generateCheckout ────────────────────────────────────────────
   Placeholder — replace body with:
     const res = await fetch('/api/generate', {
       method: 'POST', body: JSON.stringify({ personaId })
     });
     return res.json() as CheckoutData;
──────────────────────────────────────────────────────────────── */
export function generateCheckout(personaId: string): CheckoutData {
  return MOCK_DATA[personaId];
}
