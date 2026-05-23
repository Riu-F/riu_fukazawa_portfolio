/**
 * Archived from AiProblem for Section 5 (Research + Existing Solutions).
 * Not rendered on the page until that section is built.
 */

export const RESEARCH_MIND_MAP_IMAGE =
  'https://cdn.prod.website-files.com/67c27ff15b4cfea2617027af/691d75cbb7de19d1483aefa6_ai-mind-map.png';

export const RESEARCH_CONTENT = {
  teaser:
    'With no time for user interviews, we flipped the script and used existing data as our playground',
  expandedTitle:
    'Research Overview: Understanding what the landscape is like (data, user journey, and expectations).',
  intro: `Because this sprint was about rapid AI exploration, there wasn't time for extensive primary research. Instead, I leaned into desk research and focused on one question: what data do travel companies already have, and why isn't it being used to personalise the moments after booking?

To map this out, I sketched the Travel Data Ecosystem — a visual breakdown of the user information already sitting inside most booking platforms: identity data, trip context, behavioural signals, partner integrations, preferences, and inferred insights.`,
  mindMapCaption: 'Travel Data Ecosystem diagram',
  insightsHeading: 'Research Insights',
  insights: [
    {
      title: "There's more than enough data already.",
      highlight: "So the issue isn't data scarcity, it's dormant data.",
      body: "Travel companies already hold huge rich contextual information, but almost none of it gets activated after purchase. (It's used extensively in recommendation engines pre-purchase etc)",
    },
    {
      title: 'Personalisation follows the transaction, not the experience arc.',
      body: 'Data is heavily used to optimise search, sort, and pricing, but barely used to shape the emotional arc of the journey (anticipation, reassurance, preparation) once the booking is confirmed.',
    },
    {
      title: 'Post-purchase touchpoints are treated as admin, not experience moments.',
      body: 'Confirmation screens, emails, and reminders are designed for verification, not value.',
    },
  ],
} as const;

export const EXISTING_SOLUTIONS_ROWS = [
  {
    type: 'Smart Pricing Algorithms',
    doesWell: 'Optimise prices in real time based on demand, user behaviour, and inventory.',
    fallsShort:
      "Entirely focused on transactional optimisation, not on improving the traveller's experience.",
  },
  {
    type: 'Package & Add-On Recommendations',
    doesWell: 'Suggest bundles (tours, insurance, upgrades) based on past bookings or broad preferences.',
    fallsShort:
      'Often generic and sales-driven, with little sensitivity to the specific context of the current trip or traveller.',
  },
  {
    type: 'AI Chatbots & Assistants',
    doesWell: 'Handle support queries, FAQs, and simple changes through conversational interfaces.',
    fallsShort:
      'Reactive by design: they only help if the user knows what to ask and chooses to engage.',
  },
  {
    type: 'AI-Generated Itineraries & Trip Builders',
    doesWell: 'Auto-generate suggested activities, routes, and day plans.',
    fallsShort:
      'Typically built from general content + search history, not from deeper lifestyle, confidence level, or accessibility needs.',
  },
  {
    type: 'Rule-Based Post-Purchase Emails & Alerts',
    doesWell: 'Send confirmations, reminders, and generic pre-trip checklists.',
    fallsShort:
      "One-size-fits-all messaging; little adaptation to who the traveller is or what situation they're in.",
  },
] as const;

export const EXISTING_SOLUTIONS_OPPORTUNITIES = [
  {
    title: 'Automation is optimised for revenue, not confidence.',
    body: 'Smart pricing, recommendations, and funnels are finely tuned to conversion and upsell metrics, but not to reducing uncertainty or increasing readiness for the trip.',
  },
  {
    title: 'AI is treated as a feature, not a layer.',
    body: "When AI appears, it's usually packaged as a visible tool (chatbots, \"Ask AI\", magic buttons) rather than a quiet layer that reshapes content and behaviour in the background.",
  },
  {
    title: 'Post-purchase tooling is administrative, not experiential.',
    body: "Existing systems handle tickets, changes, and alerts well, but do almost nothing to adapt content based on who the traveller is, why they're going, or what they might need next.",
  },
] as const;

export const EXISTING_SOLUTIONS_CONTENT = {
  teaser: "Everyone's personalising the search—nobody's personalising the journey after you've booked",
  expandedTitle: 'Existing solutions:',
  intro:
    'How the industry currently tries to solve things (solution patterns, not competitors).',
  opportunitiesHeading: 'Opportunity Areas',
  opportunitiesIntro: 'From these patterns, several gaps became clear:',
} as const;
