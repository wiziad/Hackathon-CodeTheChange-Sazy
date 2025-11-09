"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { MapPin, Users, Clock, User, Grid } from "lucide-react";
import { 
  Card,
  EventCard,
  StickyHeader,
  HamburgerMenu
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

interface Site {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  hoursToday: string;
  accessibilityNotes?: string;
}

interface EventPost {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  items: Array<{ categoryId: string; targetQty: number }>;
  timeOptions: string[];
  siteOptions: string[];           // Site ids
  finalTime?: string;
  finalSiteId?: string;
  visibility: string;
  rsvpCount: number;
  rsvps: string[];                 // Profile ids
  distanceKm?: number;
  createdAt: string;
  status: string;
}

interface PollState {
  eventId: string;
  timeVotes: Record<string, number>;
  siteVotes: Record<string, number>;
  voterIds: string[];
}

interface FeedItem {
  event: EventPost;
  creator: Profile;
  poll: PollState;
  siteOptions: Site[];
}

export default function Feed() {
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch feed items from API
    fetchFeedItems();
  }, []);

  const fetchFeedItems = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockFeedItems: FeedItem[] = [
        {
          event: {
            id: "1",
            creatorId: "1",
            title: "Weekend Food Drive",
            description: "Join us for our weekly food drive to support local families in need",
            items: [
              { categoryId: "1", targetQty: 10 },
              { categoryId: "2", targetQty: 20 },
              { categoryId: "3", targetQty: 15 }
            ],
            timeOptions: ["today_11_13", "today_13_15", "tomorrow_09_11"],
            siteOptions: ["1", "2"],
            visibility: "public",
            rsvpCount: 5,
            rsvps: ["1", "2", "3"],
            distanceKm: 1.2,
            createdAt: new Date().toISOString(),
            status: "open"
          },
          creator: {
            id: "1",
            name: "Alice Johnson",
            role: "donor",
            bio: "Passionate about reducing food waste",
            photoUrl: "https://example.com/alice.jpg",
            rating: 4.8,
            verified: true,
            visibility: "public",
            dmAllowed: true,
            postalCode: "T2X1A1"
          },
          poll: {
            eventId: "1",
            timeVotes: {
              "today_11_13": 3,
              "today_13_15": 2,
              "tomorrow_09_11": 1
            },
            siteVotes: {
              "1": 4,
              "2": 2
            },
            voterIds: ["1", "2", "3"]
          },
          siteOptions: [
            {
              id: "1",
              name: "Community Center",
              address: "123 Main St",
              postalCode: "T2X1A1",
              lat: 51.0447,
              lng: -114.0669,
              hoursToday: "9:00 AM - 5:00 PM",
              accessibilityNotes: "Wheelchair accessible entrance"
            },
            {
              id: "2",
              name: "City Park Pavilion",
              address: "456 Park Ave",
              postalCode: "T2X1A1",
              lat: 51.0450,
              lng: -114.0600,
              hoursToday: "8:00 AM - 8:00 PM",
              accessibilityNotes: "Accessible parking available"
            }
          ]
        }
      ];
      
      setFeedItems(mockFeedItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feed items:", error);
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string) => {
    // In a real app, this would be an API call
    console.log(`RSVP to event ${eventId}`);
    
    // Update the local state
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.event.id === eventId 
          ? { ...item, event: { ...item.event, rsvpCount: item.event.rsvpCount + 1, rsvps: [...item.event.rsvps, "current-user"] } }
          : item
      )
    );
  };

  const handleViewEvent = (eventId: string) => {
    const role = useAuthStore.getState().role || (typeof window !== 'undefined' ? (() => { try { const s = localStorage.getItem('metra_session'); if (!s) return null; const parsed = JSON.parse(s); return parsed.role || parsed.user?.role; } catch { return null; } })() : null);
    const prefix = role === 'donor' ? '/donor' : role === 'receiver' ? '/receiver' : '';
    router.push(`${prefix}/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StickyHeader
        rightSide={(
          <>
            <button
              onClick={() => router.push('/donor')}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Dashboard"
            >
              <Grid className="h-5 w-5 text-brand-600" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Profile"
            >
              <User className="h-5 w-5 text-brand-600" />
            </button>
            <HamburgerMenu />
          </>
        )}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Local Events</h1>
            <p className="text-muted-foreground">Find food donation events near you</p>
          </div>

          {feedItems.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events found in your area</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {feedItems.map((item) => (
                <EventCard
                  key={item.event.id}
                  title={item.event.title}
                  description={item.event.description || ""}
                  distance={`${item.event.distanceKm?.toFixed(1)} km`}
                  time="Multiple times available"
                  attendees={item.event.rsvpCount}
                  capacity={20}
                  items={item.event.items.slice(0, 3).map(i => `${i.targetQty} items`)}
                  rsvpd={item.event.rsvps.includes("current-user")}
                  onRsvp={() => handleRSVP(item.event.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}