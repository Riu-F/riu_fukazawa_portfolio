/*
  AI at Checkout — persona content for the home deck demo.
  Edit labels, copy, and recommendation cards here.
*/

export interface AiCheckoutRecCard {
  label: string;
  desc:  string;
  tag:   string;
  icon:  string;
}

export interface AiCheckoutPersonaState {
  name:       string;
  traits:     string;
  heading:    string;
  sub:        string;
  travellers: string;
  cards:      AiCheckoutRecCard[];
}

export const AI_CHECKOUT_PERSONAS: AiCheckoutPersonaState[] = [
  {
    name:       'Solo Explorer',
    traits:     'Flexible · Adventure-led',
    heading:    'Your booking is confirmed',
    sub:        "Here's everything you need to start exploring Tokyo.",
    travellers: '1 Guest',
    cards: [
      {
        label: 'Hidden Gems Nearby',
        desc:  'Quiet neighbourhoods and local favourites within walking distance.',
        tag:   'Discovery',
        icon:  'map',
      },
      {
        label: 'Solo Dining Spots',
        desc:  'Counter seating, set menus, and places that welcome solo diners.',
        tag:   'Local',
        icon:  'food',
      },
      {
        label: 'Adventure Activities',
        desc:  'Day trips, walking tours, and experiences you can join on your own.',
        tag:   'Flexible',
        icon:  'bell',
      },
    ],
  },
  {
    name:       'Budget Traveller',
    traits:     'Cost-conscious · Efficient',
    heading:    'Purchase complete',
    sub:        "We've prioritised the most useful next steps to help you save.",
    travellers: '1 Guest',
    cards: [
      {
        label: 'Best Value Transport',
        desc:  'Cheapest Narita transfer: bus, train, and shuttle compared.',
        tag:   'Save ¥2,400',
        icon:  'coins',
      },
      {
        label: 'Cheap Eats Nearby',
        desc:  'Top-rated budget spots and konbini guides near your hotel.',
        tag:   'Under ¥800',
        icon:  'food',
      },
      {
        label: 'Budget-Friendly Add-ons',
        desc:  'Free tours, discount museum passes, and low-cost day trips.',
        tag:   'Best value',
        icon:  'heart',
      },
    ],
  },
  {
    name:       'Luxury Couple',
    traits:     'Comfort · Premium',
    heading:    "You're all set",
    sub:        'Your post-booking experience has been tailored for comfort and ease.',
    travellers: '2 Guests',
    cards: [
      {
        label: 'Premium Lounge Access',
        desc:  'Priority boarding, lounge entry, and fast-track arrival options.',
        tag:   'Premium',
        icon:  'star',
      },
      {
        label: 'Fine Dining',
        desc:  'Michelin picks, sommelier notes, and reservations held for two.',
        tag:   'Reserved',
        icon:  'food',
      },
      {
        label: 'Spa & Wellness',
        desc:  'Couples treatments, onsen bookings, and in-room wellness add-ons.',
        tag:   'Top-rated',
        icon:  'home',
      },
    ],
  },
];

/** Default highlighted persona when the card is not front (Budget Traveller). */
export const AI_CHECKOUT_DEFAULT_INDEX = 1;
