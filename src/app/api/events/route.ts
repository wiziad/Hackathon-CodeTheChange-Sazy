import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// GET /api/events - list events with related options and sites
// POST /api/events - create event with time/site options and items (basic)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*, event_time_options(*), event_site_options(*), sites(*)')
      .limit(50)

    if (error) throw error
    return NextResponse.json({ ok: true, events: data || [] })
  } catch (e: any) {
    console.error('Events list error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, creator_id, capacity, items = [], timeOptions = [], siteOptions = [] } = body

    if (!title || !creator_id) {
      return NextResponse.json({ ok: false, error: 'title and creator_id are required' }, { status: 400 })
    }

    const { data: event, error: insErr } = await supabaseAdmin
      .from('events')
      .insert({ title, description: description ?? null, creator_id, capacity: capacity ?? null, status: 'open' })
      .select('*')
      .single()
    if (insErr) throw insErr

    // Insert time options
    if (Array.isArray(timeOptions) && timeOptions.length) {
      const toInsert = timeOptions.map((id: string) => ({ event_id: event.id, option_id: id }))
      await supabaseAdmin.from('event_time_options').insert(toInsert)
    }

    // Insert site options
    if (Array.isArray(siteOptions) && siteOptions.length) {
      const soInsert = siteOptions.map((id: string) => ({ event_id: event.id, site_id: id }))
      await supabaseAdmin.from('event_site_options').insert(soInsert)
    }

    // Insert items if a table exists (event_items)
    if (Array.isArray(items) && items.length) {
      try {
        const eiInsert = items.map((it: any) => ({ event_id: event.id, category_id: it.categoryId, target_qty: it.targetQty }))
        await supabaseAdmin.from('event_items').insert(eiInsert)
      } catch (e) {
        console.warn('Skipping event_items insert (table may not exist):', e)
      }
    }

    return NextResponse.json({ ok: true, event })
  } catch (e: any) {
    console.error('Event create error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
