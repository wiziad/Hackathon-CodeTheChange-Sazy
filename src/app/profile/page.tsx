"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Star, Shield, Settings, LogOut, User as UserIcon } from "lucide-react";
import { 
  Card,
  PrimaryButton,
  OutlineButton,
  SecondaryButton
} from "@/components/ui/base";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = () => {
    const session = localStorage.getItem("metra_session");
    
    if (!session) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    
    // Parse session and fetch profile
    try {
      const { user } = JSON.parse(session);
      
      // Mock profile data - in real app, fetch from API
      const mockProfile: Profile = {
        id: user.id,
        name: user.name,
        role: user.role,
        bio: "Passionate about reducing food waste and helping my community. I organize weekly food drives and partner with local businesses to collect surplus food.",
        photoUrl: "https://example.com/user.jpg",
        rating: 4.8,
        verified: true,
        visibility: "public",
        dmAllowed: true,
        postalCode: "T2X1A1"
      };
      
      setProfile(mockProfile);
      setLoading(false);
    } catch (error) {
      console.error("Error parsing session:", error);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("metra_session");
    router.push("/auth");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!isLoggedIn) {
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
              <div className="h-24 w-24 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profile?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {profile?.verified && (
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                {profile?.name}
                {profile?.verified && (
                  <Shield className="h-5 w-5 text-green-500" />
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.role === "donor" && "Food Donor"}
                {profile?.role === "recipient" && "Food Receiver"}
                {profile?.role === "org" && "Organization"}
              </p>
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
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">{profile?.rating?.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              
              <div className="text-center">
                <div className="font-bold">24</div>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
              
              <div className="text-center">
                <div className="font-bold">156</div>
                <p className="text-sm text-muted-foreground">Impacted</p>
              </div>
            </div>
            
            {profile?.postalCode && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.postalCode}</span>
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
              onClick={() => router.push('/feed')}
            >
              Back to Home
            </SecondaryButton>
            <OutlineButton className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </OutlineButton>
          </div>
        </div>
      </Card>
    </div>
  );
}