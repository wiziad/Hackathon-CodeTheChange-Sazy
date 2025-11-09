"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe, MapPin, Star, MessageCircle, User, Shield } from "lucide-react";
import { 
  Card,
  PrimaryButton,
  OutlineButton,
  MetraLogo
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

export default function Profile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile from API
    fetchProfile();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockProfile: Profile = {
        id: params.id,
        name: "Alice Johnson",
        role: "donor",
        bio: "Passionate about reducing food waste and helping my community. I organize weekly food drives and partner with local businesses to collect surplus food.",
        photoUrl: "https://example.com/alice.jpg",
        rating: 4.8,
        verified: true,
        visibility: "public",
        dmAllowed: true,
        postalCode: "T2X1A1"
      };
      
      setProfile(mockProfile);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleMessage = () => {
    // In a real app, this would create a new DM thread
    router.push(`/messages/new?userId=${params.id}`);
  };

  const handleReport = () => {
    // In a real app, this would open a report dialog
    console.log(`Report user ${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <MetraLogo />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
              <Globe className="h-5 w-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-2xl mx-auto space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-green-600"></div>
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                    {profile.name}
                    {profile.verified && (
                      <Shield className="h-5 w-5 text-green-500" />
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.role === "donor" && "Food Donor"}
                    {profile.role === "receiver" && "Food Receiver"}
                    {profile.role === "org" && "Organization"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {profile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold">{profile.rating?.toFixed(1)}</span>
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
                
                {profile.postalCode && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.postalCode}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 mt-6">
                <PrimaryButton 
                  className="w-full" 
                  onClick={handleMessage}
                  disabled={!profile.dmAllowed}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </PrimaryButton>
                <OutlineButton className="w-full" onClick={handleReport}>
                  Report User
                </OutlineButton>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}