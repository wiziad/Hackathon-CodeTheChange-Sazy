import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// PATCH /api/sites/[id] - update site
// DELETE /api/sites/[id] - delete site
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const { name, address, postalCode, lat, lng, hoursToday, accessibilityNotes, riskLevel } = body

    const update: any = {}
    if (name !== undefined) update.name = name
    if (address !== undefined) update.address = address
    if (postalCode !== undefined) update.postal_code = postalCode
    if (lat !== undefined) update.lat = lat
    if (lng !== undefined) update.lng = lng
    if (hoursToday !== undefined) update.hours_today = hoursToday
    if (accessibilityNotes !== undefined) update.accessibility_notes = accessibilityNotes
    if (riskLevel !== undefined) update.risk_level = riskLevel

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('sites')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, site: data })
  } catch (e: any) {
    console.error('Site update error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { error } = await supabaseAdmin.from('sites').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Site delete error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
