import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// POST /api/events/[id]/collab-requests - create pending collab request for donor
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const event_id = params.id
    const body = await req.json()
    const { donor_id } = body
    if (!donor_id) return NextResponse.json({ ok: false, error: 'donor_id required' }, { status: 400 })

    // Enforce one pending request per donor per event
    const { data: existing, error: exErr } = await supabaseAdmin
      .from('collab_requests')
      .select('id,status')
      .eq('event_id', event_id)
      .eq('donor_id', donor_id)
      .eq('status', 'pending')
      .maybeSingle()
    if (exErr) throw exErr
    if (existing) {
      return NextResponse.json({ ok: true, request: existing, note: 'pending request already exists' })
    }

    const { data, error } = await supabaseAdmin
      .from('collab_requests')
      .insert({ event_id, donor_id, status: 'pending' })
      .select('*')
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, request: data })
  } catch (e: any) {
    console.error('Collab request create error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
