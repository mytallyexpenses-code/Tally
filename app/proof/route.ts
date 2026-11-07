import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSession } from '@/lib/session';

// Opens a proof file: signs a short-lived URL on click and redirects to it.
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '';
  const { profile } = await getSession();
  if (!profile || !path.startsWith(`${profile.company_id}/`) || path.includes('..')) return new NextResponse('Not found', { status: 404 });
  const { data } = await createAdminClient().storage.from('proofs').createSignedUrl(path, 300);
  if (!data?.signedUrl) return new NextResponse('Not found', { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
