import { NextResponse } from 'next/server';
import { z } from 'zod';

const MissingDrugReportSchema = z.object({
  query: z.string().min(1).max(200),
  context: z
    .object({
      path: z.string().max(200).optional(),
      locale: z.enum(['en', 'zh']).optional(),
      symptomId: z.string().max(80).optional()
    })
    .optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = MissingDrugReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, issues: parsed.error.issues }, { status: 400 });
  }

  const payload = {
    type: 'missing_medicine',
    ts: new Date().toISOString(),
    query: parsed.data.query,
    context: parsed.data.context ?? {}
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
  return NextResponse.json({ ok: true }, { status: 200 });
}

