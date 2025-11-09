"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Users, Clock, MessageCircle } from "lucide-react";
import { 
  Card,
  PollOption,
  PrimaryButton,
  SecondaryButton,
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

export default function EventDetail({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventPost | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [poll, setPoll] = useState<PollState | null>(null);
  const [siteOptions, setSiteOptions] = useState<Site[]>([]);
  const [attendees, setAttendees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event details from API
    fetchEventDetails();
  }, [params.eventId]);

  const fetchEventDetails = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockEvent: EventPost = {
        id: params.eventId,
        creatorId: "1",
        title: "Weekend Food Drive",
        description: "Join us for our weekly food drive to support local families in need. We're collecting non-perishable food items to distribute to families in need in our community. All donations are welcome!",
        items: [
          { categoryId: "1", targetQty: 10 },
          { categoryId: "2", targetQty: 20 },
          { categoryId: "3", targetQty: 15 },
          { categoryId: "4", targetQty: 8 },
          { categoryId: "5", targetQty: 5 }
        ],
        timeOptions: ["today_11_13", "today_13_15", "tomorrow_09_11"],
        siteOptions: ["1", "2"],
        visibility: "public",
        rsvpCount: 5,
        rsvps: ["1", "2", "3"],
        distanceKm: 1.2,
        createdAt: new Date().toISOString(),
        status: "open"
      };
      
      const mockCreator: Profile = {
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
      };
      
      const mockPoll: PollState = {
        eventId: params.eventId,
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
      };
      
      const mockSiteOptions: Site[] = [
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
      ];
      
      const mockAttendees: Profile[] = [
        {
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
        {
          id: "2",
          name: "Bob Smith",
          role: "receiver",
          bio: "Community volunteer helping local families",
          photoUrl: "https://example.com/bob.jpg",
          rating: 4.5,
          verified: true,
          visibility: "public",
          dmAllowed: true,
          postalCode: "T2X1A1"
        },
        {
          id: "3",
          name: "Community Food Bank",
          role: "org",
          bio: "Non-profit organization serving the community",
          photoUrl: "https://example.com/cfb.jpg",
          rating: 4.9,
          verified: true,
          visibility: "public",
          dmAllowed: true,
          postalCode: "T2X1A1"
        }
      ];
      
      setEvent(mockEvent);
      setCreator(mockCreator);
      setPoll(mockPoll);
      setSiteOptions(mockSiteOptions);
      setAttendees(mockAttendees);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!event) return;
    
    // In a real app, this would be an API call
    console.log(`RSVP to event ${event.id}`);
    
    // Update the local state
    setEvent({
      ...event,
      rsvpCount: event.rsvpCount + 1,
      rsvps: [...event.rsvps, "current-user"]
    });
  };

  const handleVote = async (time?: string, siteId?: string) => {
    if (!event || !poll) return;
    
    // In a real app, this would be an API call
    console.log(`Vote on event ${event.id}: time=${time}, site=${siteId}`);
    
    // Update the local state
    const updatedPoll = { ...poll };
    
    if (time) {
      updatedPoll.timeVotes[time] = (updatedPoll.timeVotes[time] || 0) + 1;
    }
    
    if (siteId) {
      updatedPoll.siteVotes[siteId] = (updatedPoll.siteVotes[siteId] || 0) + 1;
    }
    
    setPoll(updatedPoll);
  };

  const handleChat = () => {
    router.push(`/event/${params.eventId}/chat`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event || !creator || !poll) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  // Calculate total votes for time options
  const totalTimeVotes = Object.values(poll.timeVotes).reduce((sum, votes) => sum + votes, 0);
  
  // Calculate total votes for site options
  const totalSiteVotes = Object.values(poll.siteVotes).reduce((sum, votes) => sum + votes, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <MetraLogo />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <Globe className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-2xl mx-auto space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-sm text-muted-foreground">Hosted by {creator.name}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.distanceKm?.toFixed(1)} km</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {event.description}
              </p>
              
              <div className="space-y-6">
                {/* Time Voting */}
                <div>
                  <h3 className="font-semibold mb-3">Time Options</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {event.timeOptions.map((timeOption) => (
                      <PollOption
                        key={timeOption}
                        label={timeOption.replace(/_/g, ' ')}
                        votes={poll.timeVotes[timeOption] || 0}
                        total={totalTimeVotes}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Site Voting */}
                <div>
                  <h3 className="font-semibold mb-3">Site Options</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {siteOptions.map((site) => (
                      <PollOption
                        key={site.id}
                        label={site.name}
                        votes={poll.siteVotes[site.id] || 0}
                        total={totalSiteVotes}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Items Needed */}
                <div>
                  <h3 className="font-semibold mb-3">Items Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.items.map((item, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                      >
                        {item.targetQty} items
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Attendees */}
                <div>
                  <h3 className="font-semibold mb-3">Attendees ({event.rsvpCount})</h3>
                  <div className="flex flex-wrap gap-2">
                    {attendees.map((attendee) => (
                      <div 
                        key={attendee.id} 
                        className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5"
                      >
                        <div className="h-6 w-6 rounded-full bg-brand-600"></div>
                        <span className="text-sm">{attendee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  <PrimaryButton 
                    className="w-full" 
                    onClick={handleRSVP}
                  >
                    RSVP to Event
                  </PrimaryButton>
                  <OutlineButton 
                    className="w-full" 
                    onClick={handleChat}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Join Chat
                  </OutlineButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}