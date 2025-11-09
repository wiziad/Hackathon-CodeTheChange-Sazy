'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error getting user:', userError)
          setError('Failed to get user information')
          router.replace('/auth')
          return
        }
        
        const user = data.user
        if (user) {
          console.log('User authenticated:', user)
          
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_id', user.id)
            .single();
          
          // If profile doesn't exist OR missing role, redirect to onboarding
          if (profileError || !profileData || !profileData.role) {
            console.log('Profile missing, redirecting to onboarding');
            // Set flag for welcome animation
            localStorage.setItem('showWelcomeAnimation', 'true');
            router.replace('/onboarding');
            return;
          }
          
          const response = await fetch('/api/auth/sync-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auth_id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            }),
          })
          
          const result = await response.json()
          console.log('Profile sync result:', result)
          
          if (!response.ok) {
            console.error('Profile sync failed:', result)
            setError('Failed to sync profile')
          }
          
          // Set session in localStorage
          const sessionData = {
            user: {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            },
            role: profileData.role || 'receiver', // Use role from profile
          }
          localStorage.setItem('metra_session', JSON.stringify(sessionData))
          
          // Set flag for welcome animation
          localStorage.setItem('showWelcomeAnimation', 'true');
          
          // Redirect to home page
          router.replace('/');
        } else {
          console.log('No user found')
          router.replace('/auth')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setError('An unexpected error occurred')
        router.replace('/auth')
      }
    }
    run()
  }, [router])

  if (error) {
    return <div className="p-6 text-center">Error: {error}. Redirecting...</div>
  }

  return <div className="p-6 text-center">Signing you in...</div>
}