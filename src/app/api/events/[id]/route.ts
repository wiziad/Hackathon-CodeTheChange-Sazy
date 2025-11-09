import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// GET /api/events/[id] - fetch event with relations
// PATCH /api/events/[id] - update event fields (including finalize/complete)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*, event_time_options(*), event_site_options(*), sites(*), event_items(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, event: data })
  } catch (e: any) {
    console.error('Event get error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const { title, description, capacity, finalTime, finalSiteId, status } = body

    const update: any = {}
    if (title !== undefined) update.title = title
    if (description !== undefined) update.description = description
    if (capacity !== undefined) update.capacity = capacity
    if (finalTime !== undefined) update.final_time = finalTime
    if (finalSiteId !== undefined) update.final_site_id = finalSiteId
    if (status !== undefined) update.status = status

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, event: data })
  } catch (e: any) {
    console.error('Event update error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
