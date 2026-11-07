import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Company, Profile } from '@/lib/types';

export const getSession = cache(async () => {
  const supabase = await createClient();
  // Local JWT check: no network call. Data access is still enforced by Postgres RLS.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { supabase, user: null, profile: null, company: null } as const;
  const user = { id: claims.sub, email: (claims.email as string | undefined) ?? null, phone: (claims.phone as string | undefined) ?? null };
  // One query for profile + company instead of two sequential ones.
  const { data: row } = await supabase.from('profiles').select('*, companies(*)').eq('id', user.id).maybeSingle();
  if (!row) return { supabase, user, profile: null, company: null } as const;
  const { companies, ...profile } = row as Profile & { companies: Company | null };
  return { supabase, user, profile: profile as Profile, company: companies } as const;
});

/** Any signed-in member of a workspace. */
export async function requireMember() {
  const s = await getSession();
  if (!s.user) redirect('/sign-in');
  if (!s.profile) redirect('/onboarding');
  if (!s.profile.active || !s.company) redirect('/auth/sign-out?reason=inactive');
  return { supabase: s.supabase, user: s.user, profile: s.profile, company: s.company };
}

export const isAdminRole = (r: string) => r === 'owner' || r === 'admin';
export const canApproveRole = (r: string) => isAdminRole(r) || r === 'approver';

export async function requireApprover() {
  const s = await requireMember();
  if (!canApproveRole(s.profile.role)) redirect('/projects');
  return s;
}

export async function requireAdmin() {
  const s = await requireMember();
  if (!isAdminRole(s.profile.role)) redirect('/projects');
  return s;
}
