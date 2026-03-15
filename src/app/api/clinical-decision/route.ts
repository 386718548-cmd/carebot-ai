import { NextResponse } from 'next/server';
import { ClinicalDecisionRequestSchema, clinicalDecision } from '@/lib/clinical-decision';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ClinicalDecisionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid request',
        issues: parsed.error.issues
      },
      { status: 400 }
    );
  }

  const result = clinicalDecision(parsed.data);
  return NextResponse.json(result, { status: 200 });
}

