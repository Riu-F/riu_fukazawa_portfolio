/*
  Deck card data.
  No browser APIs here, safe to import anywhere.
*/

export interface DeckCard {
  id:      number;
  tab:     string;  /* tab label */
  num:     string;  /* zero-padded index shown in peek strip */
  heading: string;
  sub:     string;
  body:    string;
  btn?:    string;  /* optional CTA label */
}

export const DECK_CARDS: DeckCard[] = [
  {
    id:      0,
    tab:     'AI at Checkout',
    num:     '01',
    heading: 'AI at Checkout',
    sub:     'Personalising the Post-Purchase Experience',
    body:    'A design experiment on adaptive, data-driven travel interfaces.',
    btn:     'Find out more',
  },
  {
    id:      1,
    tab:     'Accessible Design',
    num:     '02',
    heading: 'Accessible Design',
    sub:     'Unseen Barriers in Supermarkets',
    body:    'Designing cognitive accessibility in supermarkets.',
    btn:     'Find out more',
  },
  {
    id:      2,
    tab:     'Age of AI',
    num:     '03',
    heading: 'Designing in an\nAge of AI',
    sub:     'Essay · Reflection · Practice',
    body:    'Exploring what it means to design in a world where AI is a creative collaborator.',
  },
];
