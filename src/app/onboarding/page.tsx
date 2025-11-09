'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, PrimaryButton, Input } from '@/components/ui/base'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'donor' | 'receiver'>('donor')
  const [postalCode, setPostalCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [householdSize, setHouseholdSize] = useState(1)
  const [dietaryTags, setDietaryTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('No user found')
      }
      
      // Create or update profile
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          auth_id: user.id,
          email: user.email,
          name: `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || 'User',
          first_name: firstName,
          last_name: lastName,
          role,
          postal_code: postalCode,
          household_size: householdSize,
          dietary_tags: dietaryTags,
          visibility: 'public',
          dm_allowed: true
        })
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      console.log('Profile created:', data)
      
      // Set flag for welcome animation
      localStorage.setItem('showWelcomeAnimation', 'true')
      
      // Redirect to home
      router.push('/')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to Metra</h1>
        <p className="text-gray-600 mb-6 text-center">Let's set up your profile</p>
        
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 1: Your Role</h2>
            <div className="space-y-4">
              <button
                onClick={() => setRole('donor')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  role === 'donor' 
                    ? 'border-brand-500 bg-brand-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium">Food Donor</h3>
                <p className="text-sm text-gray-600">Share food with your community</p>
              </button>
              <button
                onClick={() => setRole('receiver')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  role === 'receiver' 
                    ? 'border-brand-500 bg-brand-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium">Food Recipient</h3>
                <p className="text-sm text-gray-600">Find food resources in your area</p>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <PrimaryButton onClick={nextStep}>Next</PrimaryButton>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 2: Location</h2>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <Input
                  placeholder="e.g., T2X1A1"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button 
                onClick={prevStep}
                className="px-4 py-2 text-brand-600 hover:text-brand-700"
              >
                Back
              </button>
              <PrimaryButton onClick={nextStep}>Next</PrimaryButton>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 3: About You</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Household Size</label>
                <Input
                  type="number"
                  min="1"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dietary Restrictions (Optional)</label>
                <Input
                  placeholder="e.g., Vegetarian, Gluten-free"
                  value={dietaryTags}
                  onChange={(e) => setDietaryTags(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button 
                onClick={prevStep}
                className="px-4 py-2 text-brand-600 hover:text-brand-700"
              >
                Back
              </button>
              <PrimaryButton 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </PrimaryButton>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}