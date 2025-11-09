import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// GET /api/collab-requests?organizerId=... - list incoming requests for event creators
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const organizerId = url.searchParams.get('organizerId')
    if (!organizerId) return NextResponse.json({ ok: false, error: 'organizerId required' }, { status: 400 })

    // Join events to filter by organizer
    const { data, error } = await supabaseAdmin
      .from('collab_requests')
      .select('*, events!inner(id, title, creator_id)')
      .eq('events.creator_id', organizerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ ok: true, requests: data || [] })
  } catch (e: any) {
    console.error('Collab requests list error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
