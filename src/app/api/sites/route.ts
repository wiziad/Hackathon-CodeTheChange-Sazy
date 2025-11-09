import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// GET /api/sites - list sites
// POST /api/sites - create a site
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('sites').select('*').limit(100)
    if (error) throw error
    return NextResponse.json({ ok: true, sites: data || [] })
  } catch (e: any) {
    console.error('Sites list error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, address, postalCode, lat, lng, hoursToday, accessibilityNotes, riskLevel } = body

    if (!name || !address || !postalCode) {
      return NextResponse.json({ ok: false, error: 'name, address, postalCode are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('sites')
      .insert({
        name,
        address,
        postal_code: postalCode,
        lat,
        lng,
        hours_today: hoursToday ?? null,
        accessibility_notes: accessibilityNotes ?? null,
        risk_level: riskLevel ?? null,
      })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, site: data })
  } catch (e: any) {
    console.error('Site create error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
