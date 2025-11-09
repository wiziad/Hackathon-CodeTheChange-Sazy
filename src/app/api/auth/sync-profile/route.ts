import { NextResponse } from 'next/server'
import { syncProfile } from '@/backend/auth/syncProfile'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Syncing profile for user:', body.auth_id)
    
    const res = await syncProfile(body)
    console.log('Profile sync result:', res)
    
    return NextResponse.json({ ok: true, profile: res })
  } catch (e: any) {
    console.error('Profile sync error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}