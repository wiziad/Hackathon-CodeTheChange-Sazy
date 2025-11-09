import { supabaseAdmin } from '../supabaseAdmin'

export async function syncProfile(input: { auth_id: string; email: string | null; name: string }) {
  const { auth_id, email, name } = input

  const { data: existing, error: findErr } = await supabaseAdmin
    .from('profiles')
    .select('id, auth_id')
    .eq('auth_id', auth_id)
    .maybeSingle()
  if (findErr) throw findErr
  if (existing) return existing

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(
      { auth_id, email: email ?? null, name, role: 'receiver', visibility: 'public', dm_allowed: true },
      { onConflict: 'auth_id' }
    )
    .select('id, auth_id')
    .single()
  if (error) throw error
  return data
}