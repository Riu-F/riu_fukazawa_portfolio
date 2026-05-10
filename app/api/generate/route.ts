import { NextResponse } from 'next/server';

import { getAnthropicClient } from '@/app/lib/anthropic';

type GenerateRequest = {
  input?: unknown;
  debug?: boolean;
};

export async function GET() {
  const configured = Boolean(process.env.ANTHROPIC_API_KEY);
  return NextResponse.json({ ok: true, configured });
}

export async function POST(req: Request) {
  let body: GenerateRequest | null = null;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    body = null;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing server env var ANTHROPIC_API_KEY. Add it to `.env.local` (not committed).',
      },
      { status: 500 },
    );
  }

  // Placeholder structure for future Claude integration:
  // const anthropic = getAnthropicClient();
  // const result = await anthropic.messages.create({ model, max_tokens, messages });
  void getAnthropicClient;

  return NextResponse.json({
    ok: true,
    mock: true,
    message:
      'Mock response (Claude not called yet). Server route is wired and reading ANTHROPIC_API_KEY safely.',
    received: body?.debug ? body?.input : undefined,
  });
}

