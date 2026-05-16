import { NextResponse }      from 'next/server';
import { getAnthropicClient } from '@/app/lib/anthropic';
import type { CheckoutData, TripContext } from '@/app/ai-project/components/ai-checkout-types';

/* ── Persona context ─────────────────────────────────────────────
   Each entry provides the traveller detail injected into the prompt.
   Extend this map as new personas / form inputs are added.
──────────────────────────────────────────────────────────────── */
const PERSONA_CONTEXTS: Record<string, string> = {
  dewi:
    'A family of 4 (including young children) from Indonesia, travelling to Tokyo, Japan from 18–26 December for 8 nights. This is their first overseas trip.',
  jordan:
    'A solo traveller and photographer who is budget-conscious, travelling to Kyoto, Japan from 1–13 April for 12 nights.',
  harold:
    'A retired couple (Harold and Margaret) who are comfort-led art lovers, travelling to Paris, France from 8–17 September for 9 nights.',
};

/* Icons that AiCheckoutPrototype can actually render */
const VALID_ICONS = new Set([
  'passport', 'park', 'train', 'map', 'compass', 'car', 'star', 'food',
]);

/* ── Schema shown to Claude ──────────────────────────────────────
   Kept as a string literal so it appears verbatim in the prompt.
──────────────────────────────────────────────────────────────── */
const SCHEMA = `{
  "title": "string",
  "subtitle": "string",
  "trip_info": {
    "destination": "string",
    "dates": "string",
    "travellers": "string",
    "nights": "string"
  },
  "cards": [
    {
      "id": "string (kebab-case, unique across the 3 cards)",
      "icon": "one of: passport | park | train | map | compass | car | star | food",
      "title": "string (2–4 words)",
      "summary": "string (exactly one sentence)",
      "tag": "string (1–2 words, persona-specific label)",
      "expanded": {
        "intro": "string (1–2 sentences of context)",
        "sections": [
          {
            "heading": "string",
            "bullets": ["string"],
            "tip": "string (optional — omit the field entirely if not needed)"
          }
        ]
      }
    }
  ]
}`;

/* ── Build context string from live trip form data ───────────────
   Assembles optional fields into a natural-language context sentence
   that is then injected into the same prompt template as persona mode.
──────────────────────────────────────────────────────────────── */
function buildTripContextString(tc: TripContext): string {
  const parts: string[] = [];

  const name      = tc.name?.trim();
  const dest      = tc.destination.trim();
  const groupType = tc.groupType?.trim();
  const ageRange  = tc.ageRange?.trim();

  let who = name ? `${name}, a` : 'A';
  if (groupType && groupType.toLowerCase() !== 'solo') {
    who += ` ${groupType.toLowerCase()}`;
  } else {
    who += ' solo traveller';
  }
  if (ageRange) who += ` in their ${ageRange}`;
  if (tc.countryOrigin?.trim()) who += `, from ${tc.countryOrigin.trim()}`;
  who += `, travelling to ${dest}`;
  if (tc.tripDates?.trim())    who += ` in ${tc.tripDates.trim()}`;
  if (tc.lengthOfStay?.trim()) who += ` for ${tc.lengthOfStay.trim()}`;
  parts.push(who + '.');

  if (tc.travelPurpose?.trim())    parts.push(`Purpose: ${tc.travelPurpose.trim()}.`);
  if (tc.travelExperience?.trim()) parts.push(`Travel experience: ${tc.travelExperience.trim()}.`);
  if (tc.interests?.trim())        parts.push(`Interests: ${tc.interests.trim()}.`);
  if (tc.budgetLevel?.trim())      parts.push(`Budget: ${tc.budgetLevel.trim()}.`);

  return parts.join(' ');
}

function buildPrompt(personaContext: string): string {
  return `You are an AI travel assistant generating a post-checkout travel summary shown on a booking confirmation page.

Traveller context: ${personaContext}

Generate a post-checkout travel summary as valid JSON matching this exact schema:

${SCHEMA}

Rules:
- Return valid JSON only. No markdown fences. No text before or after the JSON object.
- Exactly 3 cards. Each card should cover a distinct, genuinely useful topic for this traveller (e.g. arrival logistics, local activities, practical tips).
- The "summary" field must be exactly one sentence.
- The "intro" field must be 1–2 sentences providing context before the detail sections.
- Each section should have 2–5 concise bullets. No padding or filler.
- Only include a "tip" if it adds clear value. Omit the field entirely otherwise.
- Use Australian English spelling throughout.
- Do not hallucinate specific facts (e.g. exact prices, visa fees, opening hours). If uncertain, phrase as something to confirm or check in advance.
- Tags must feel persona-specific, not generic. Vary them across cards. Examples: Essential, With kids, Family tip, Golden hour, Gear & rules, Premium, Curated, Fine dining, Getting there, Discovery, Budget tip.
- Expanded content must be meaningfully different across personas — same destination can appear but the angle, tone, and recommendations should reflect the traveller's priorities.`;
}

/* ── Response validation ─────────────────────────────────────────
   Checks structural completeness. Does not validate string content.
──────────────────────────────────────────────────────────────── */
function validateCheckout(data: unknown): data is CheckoutData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (typeof d.title    !== 'string') return false;
  if (typeof d.subtitle !== 'string') return false;

  const ti = d.trip_info as Record<string, unknown> | null;
  if (!ti || typeof ti.destination !== 'string' || typeof ti.dates !== 'string'
          || typeof ti.travellers  !== 'string' || typeof ti.nights !== 'string') return false;

  if (!Array.isArray(d.cards) || d.cards.length !== 3) return false;

  for (const card of d.cards as unknown[]) {
    if (typeof card !== 'object' || card === null) return false;
    const c = card as Record<string, unknown>;
    if (typeof c.id      !== 'string') return false;
    if (typeof c.icon    !== 'string') return false;
    if (typeof c.title   !== 'string') return false;
    if (typeof c.summary !== 'string') return false;
    if (typeof c.tag     !== 'string') return false;

    const exp = c.expanded as Record<string, unknown> | null;
    if (!exp || typeof exp.intro !== 'string') return false;
    if (!Array.isArray(exp.sections) || exp.sections.length === 0) return false;

    for (const sec of exp.sections as unknown[]) {
      if (typeof sec !== 'object' || sec === null) return false;
      const s = sec as Record<string, unknown>;
      if (typeof s.heading !== 'string') return false;
      if (!Array.isArray(s.bullets)     ) return false;
    }
  }

  return true;
}

/* ── Normalise ───────────────────────────────────────────────────
   - Falls back unknown icon names to 'compass'
   - Strips any extra fields from sections (tip omitted if not string)
──────────────────────────────────────────────────────────────── */
function normalise(data: CheckoutData): CheckoutData {
  return {
    ...data,
    cards: data.cards.map(card => ({
      ...card,
      icon: VALID_ICONS.has(card.icon) ? card.icon : 'compass',
      expanded: {
        ...card.expanded,
        sections: card.expanded.sections.map(s => ({
          heading: s.heading,
          bullets: s.bullets,
          ...(typeof s.tip === 'string' && s.tip.length > 0 ? { tip: s.tip } : {}),
        })),
      },
    })),
  };
}

/* ── GET — health check ──────────────────────────────────────────
   Useful to confirm the route is reachable and key is set.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  return NextResponse.json({
    ok:         true,
    configured: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}

/* ── POST — generate checkout summary ───────────────────────────
   Body: { "personaId": "dewi" | "jordan" | "harold" }
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  /* ── 1. API key guard ──────────────────────────────────────── */
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: 'ANTHROPIC_API_KEY is not set. Add it to .env.local.' },
      { status: 500 },
    );
  }

  /* ── 2. Parse + validate request body ─────────────────────── */
  let prompt: string;
  try {
    const body = (await req.json()) as { personaId?: unknown; tripContext?: unknown };

    if (typeof body.personaId === 'string') {
      /* Mode A — persona */
      const personaId = body.personaId;
      if (!PERSONA_CONTEXTS[personaId]) {
        return NextResponse.json(
          { ok: false, error: `Unknown personaId. Valid values: ${Object.keys(PERSONA_CONTEXTS).join(', ')}.` },
          { status: 400 },
        );
      }
      prompt = buildPrompt(PERSONA_CONTEXTS[personaId]);

    } else if (body.tripContext && typeof body.tripContext === 'object') {
      /* Mode B — live trip context */
      const tc = body.tripContext as Record<string, unknown>;
      if (typeof tc.destination !== 'string' || !tc.destination.trim()) {
        return NextResponse.json(
          { ok: false, error: 'tripContext.destination is required.' },
          { status: 400 },
        );
      }
      prompt = buildPrompt(buildTripContextString(tc as unknown as TripContext));

    } else {
      return NextResponse.json(
        { ok: false, error: 'Provide either personaId or tripContext (with destination).' },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON in request body.' },
      { status: 400 },
    );
  }

  /* ── 3. Call Claude ────────────────────────────────────────── */
  let rawText: string;
  try {
    const client  = getAnthropicClient();
    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role:    'user',
          content: prompt,
        },
      ],
    });

    const firstBlock = message.content[0];
    if (firstBlock.type !== 'text') {
      throw new Error('Unexpected response type from Claude.');
    }
    rawText = firstBlock.text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error calling Claude API.';
    return NextResponse.json({ ok: false, error: `Claude API error: ${msg}` }, { status: 502 });
  }

  /* ── 4. Parse JSON response ────────────────────────────────── */
  let parsed: unknown;
  try {
    /* Claude occasionally wraps output in ```json ... ``` — strip if present */
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Claude returned non-JSON output.', raw: rawText },
      { status: 502 },
    );
  }

  /* ── 5. Validate schema shape ──────────────────────────────── */
  if (!validateCheckout(parsed)) {
    return NextResponse.json(
      { ok: false, error: 'Claude response did not match expected schema.', raw: parsed },
      { status: 502 },
    );
  }

  /* ── 6. Normalise + return ─────────────────────────────────── */
  const checkout = normalise(parsed);
  return NextResponse.json({ ok: true, checkout });
}
