import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/backend/supabaseAdmin'

// PATCH /api/collab-requests/[id] { status: 'accepted'|'declined', decided_by }
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const { status, decided_by } = body
    if (!status || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ ok: false, error: 'status must be accepted|declined' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('collab_requests')
      .update({ status, decided_by: decided_by ?? null, decided_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error

    return NextResponse.json({ ok: true, request: data })
  } catch (e: any) {
    console.error('Collab request update error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
