import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit/runAudit';
import { validatePublicUrl } from '@/lib/security/validatePublicUrl';
import { getClientIp, rateLimiter } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function normalizeUrl(input: string): string {
  let clean = input.trim().toLowerCase();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean.replace(/\/+$/, '');
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const { success } = await rateLimiter.limit(getClientIp(request));
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const cleanUrl = normalizeUrl(url);

  const isPublic = await validatePublicUrl(cleanUrl);
  if (!isPublic) {
    return NextResponse.json(
      { error: 'Access to private or invalid network addresses is prohibited.' },
      { status: 400 }
    );
  }

  try {
    const results = await runAudit(cleanUrl);
    return NextResponse.json({ url: cleanUrl, results });
  } catch {
    return NextResponse.json({ error: 'Audit execution error' }, { status: 500 });
  }
}
