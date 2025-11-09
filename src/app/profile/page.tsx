"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Star, Shield, Settings, LogOut, User as UserIcon } from "lucide-react";
import { 
  Card,
  PrimaryButton,
  OutlineButton,
  SecondaryButton
} from "@/components/ui/base";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  rating?: number;
  verified?: boolean;
  visibility: string;
  dmAllowed: boolean;
  postalCode?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { loading, user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = profile?.email || user?.email || '';
  const role = profile?.role || (user as any)?.role || 'receiver';
  const verified = (profile as any)?.verified ?? false;
  const rating = (profile as any)?.rating as number | undefined;
  const postalCode = (profile as any)?.postal_code ?? (profile as any)?.postalCode ?? undefined;
  const photoUrl = (profile as any)?.photo_url || user?.user_metadata?.avatar_url || (user?.user_metadata as any)?.picture || undefined;

  const getRoleLabel = () => {
    switch (role) {
      case 'donor': return 'Food Donor';
      case 'receiver':
      case 'recipient': return 'Food Receiver';
      case 'org': return 'Organization';
      default: return role;
    }
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="container max-w-md mx-auto">
        <Card>
          <div className="p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">View Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view your profile and manage your account
            </p>
            <div className="space-y-3">
              <PrimaryButton 
                className="w-full" 
                onClick={() => router.push('/auth')}
              >
                Log In / Sign Up
              </PrimaryButton>
              <OutlineButton 
                className="w-full" 
                onClick={() => router.push('/')}
              >
                Back to Home
              </OutlineButton>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Logged in - show profile
  return (
    <div className="container max-w-2xl mx-auto space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative">
              {photoUrl ? (
                <img src={photoUrl} alt={displayName} className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {verified && (
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                {displayName}
                {verified && (
                  <Shield className="h-5 w-5 text-green-500" />
                )}
              </h2>
              <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
              {email && (
                <p className="text-xs text-muted-foreground mt-1">{email}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {profile?.bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-4">
              {typeof rating === 'number' && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold">{rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              )}
            </div>
            
            {postalCode && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{postalCode}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <PrimaryButton 
              className="w-full" 
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile & Settings
            </PrimaryButton>
            <SecondaryButton 
              className="w-full" 
              onClick={() => router.push('/')}
            >
              Back to Home
            </SecondaryButton>
            <OutlineButton className="w-full" onClick={handleLogout} disabled={signingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </OutlineButton>
          </div>
        </div>
      </Card>
    </div>
  );
}