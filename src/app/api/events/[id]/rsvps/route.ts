import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// GET /api/events/[id]/rsvps - list RSVPs for an event
// POST /api/events/[id]/rsvps - toggle RSVP for user { user_id }
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const event_id = params.id
    const { data, error } = await supabaseAdmin
      .from('event_rsvps')
      .select('id, event_id, user_id, created_at')
      .eq('event_id', event_id)
    if (error) throw error

    return NextResponse.json({ ok: true, rsvps: data || [], count: (data || []).length })
  } catch (e: any) {
    console.error('RSVP list error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const event_id = params.id
    const body = await req.json()
    const { user_id } = body
    if (!user_id) return NextResponse.json({ ok: false, error: 'user_id required' }, { status: 400 })

    // Check if existing RSVP
    const { data: existing, error: exErr } = await supabaseAdmin
      .from('event_rsvps')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .maybeSingle()
    if (exErr) throw exErr

    if (existing) {
      // Remove RSVP (toggle off)
      const { error: delErr } = await supabaseAdmin
        .from('event_rsvps')
        .delete()
        .eq('id', existing.id)
      if (delErr) throw delErr
      return NextResponse.json({ ok: true, toggled: 'removed' })
    }

    // Enforce capacity if event has capacity set
    const { data: event, error: evErr } = await supabaseAdmin
      .from('events')
      .select('id, capacity')
      .eq('id', event_id)
      .single()
    if (evErr) throw evErr

    if (event?.capacity) {
      const { data: current } = await supabaseAdmin
        .from('event_rsvps')
        .select('id', { count: 'exact' })
        .eq('event_id', event_id)
      const count = (current || []).length
      if (count >= event.capacity) {
        return NextResponse.json({ ok: false, error: 'capacity reached' }, { status: 409 })
      }
    }

    const { data, error } = await supabaseAdmin
      .from('event_rsvps')
      .insert({ event_id, user_id })
      .select('*')
      .single()
    if (error) throw error

    return NextResponse.json({ ok: true, rsvp: data })
  } catch (e: any) {
    console.error('RSVP toggle error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
