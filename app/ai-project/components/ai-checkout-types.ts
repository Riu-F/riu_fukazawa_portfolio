/* ── AI Checkout — shared TypeScript interfaces ─────────────────
   Schema maps 1:1 to the UI structure of AiCheckoutPrototype.
   Designed so CheckoutData can be produced by Claude API output.
──────────────────────────────────────────────────────────────── */

export interface TripInfo {
  destination: string;
  dates:       string;
  travellers:  string;
  nights:      string;
}

export interface Section {
  heading: string;
  bullets: string[];
  tip?:    string;
}

export interface CardExpanded {
  intro:    string;    /* short paragraph rendered at top of expanded drawer */
  sections: Section[];
}

export interface Card {
  id:       string;
  icon:     string;
  title:    string;
  summary:  string;   /* 1-sentence collapsed description */
  tag:      string;   /* label chip, e.g. "Essential", "Premium" */
  expanded: CardExpanded;
}

export interface CheckoutData {
  title:     string;
  subtitle:  string;
  trip_info: TripInfo;
  cards:     Card[];  /* always 3 */
}

/* Input persona — drives which CheckoutData gets generated */
export interface Persona {
  id:       string;
  name:     string;
  traits:   string;
  iconName: string;
}

/* Live trip context — collected from user-entered form data */
export interface TripContext {
  destination:       string;   /* required */
  name?:             string;
  countryOrigin?:    string;
  tripDates?:        string;
  lengthOfStay?:     string;
  ageRange?:         string;
  travelPurpose?:    string;
  travelExperience?: string;
  interests?:        string;
  budgetLevel?:      string;
  groupType?:        string;
}
