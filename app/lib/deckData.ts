/*
  Deck card data.
  No browser APIs here, safe to import anywhere.

  IDs are stable identifiers used to look up tab x-position, theme, and
  to gate AI-specific layout/demo rendering. Display order in the deck
  follows the array order below — so to reorder projects, just reorder
  this array (keeping ids stable).
*/

export type DeckTag = 'navigation' | 'distraction' | 'communication';

export interface DeckCard {
  id:      number;
  tab:     string;  /* tab label */
  num:     string;  /* zero-padded index shown in peek strip */
  heading: string;
  sub:     string;
  body:    string;
  btn?:    string;  /* optional CTA label */
  href?:   string;  /* optional CTA link target (and mobile-card wrapping link) */
  tags?:   DeckTag[];  /* optional GitHub-style chips rendered above the body */
}

export const DECK_CARDS: DeckCard[] = [
  {
    id:      0,
    tab:     'Accessible Supermarkets',
    num:     '01',
    heading: 'FoodHub',
    sub:     'Unseen Barriers in Supermarkets',
    body:    'A navigation-first shopping app for cognitively accessible supermarket experiences. From research through to a coded prototype.',
    btn:     'View case study',
    href:    '/super-market-navigation',
    tags:    ['navigation', 'distraction', 'communication'],
  },
  {
    id:      1,
    tab:     'AI at Checkout',
    num:     '02',
    heading: 'AI at Checkout',
    sub:     'Personalising the Post-Purchase Experience',
    body:    'A design experiment on adaptive, data-driven travel interfaces.',
    btn:     'Find out more',
    href:    '/ai-project',
  },
  {
    id:      2,
    tab:     'Interactive Art',
    num:     '03',
    heading: 'Pixel Koi Pond',
    sub:     'Interactive Canvas Artwork',
    body:    'A pixel art koi pond, rebuilt from a first-year university project. Click to disturb the water.',
    btn:     'Dive In →',
    href:    '/404',
  },
];
