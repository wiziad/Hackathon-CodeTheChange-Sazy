'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, PrimaryButton } from '@/components/ui/base'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/home')
    })
  }, [router])

  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      localStorage.setItem('metra_return_to', '/home');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: 'select_account' },
        },
      })
      if (error) {
        console.error('OAuth error:', error)
        setError(error.message)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in to Metra</h1>
        <p className="text-gray-600 mb-6">Use your Google account</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <PrimaryButton onClick={signInWithGoogle} className="w-full">
          Continue with Google
        </PrimaryButton>
      </Card>
    </div>
  )
}