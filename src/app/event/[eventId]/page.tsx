"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Users, Clock, MessageCircle } from "lucide-react";
import {
  Card,
  PollOption,
  PrimaryButton,
  SecondaryButton,
  OutlineButton
} from "@/components/ui/base";

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const router = useRouter();
  const resolved = use(params as any) as { eventId: string };
  const eventId = resolved?.eventId;
  const [event, setEvent] = useState<any | null>(null);
  const [creator, setCreator] = useState<any | null>(null);
  const [poll, setPoll] = useState<any | null>(null);
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const sessionRaw = localStorage.getItem("metra_session");
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          return session.role || session.user?.role || null;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [hasRSVPd, setHasRSVPd] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  useEffect(() => {
    // Fetch event details from API (mock for now)
    fetchEventDetails();
    try {
      const reqs = JSON.parse(localStorage.getItem("collab_requests") || "[]");
      if (reqs.some((r: any) => r.eventId === eventId && r.status === "pending")) {
        setHasRequested(true);
      }
    } catch (e) {
      // ignore
    }
  }, [eventId]);

  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem("metra_session");
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        setRole(session.role || session.user?.role || null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const fetchEventDetails = async () => {
    try {
      const mockEvent = {
        id: eventId,
        creatorId: "1",
        title: "Weekend Food Drive",
        description: "Join us for our weekly food drive to support local families in need. We're collecting non-perishable food items to distribute to families in need in our community. All donations are welcome!",
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
      };

      const mockCreator = {
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

      const mockPoll = {
        eventId: eventId,
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

      const mockSiteOptions = [
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

      const mockAttendees = [
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
    if (hasRSVPd) {
      setEvent({ ...event, rsvpCount: Math.max(0, event.rsvpCount - 1), rsvps: event.rsvps.filter((id: string) => id !== "current-user") });
      setHasRSVPd(false);
    } else {
      setEvent({ ...event, rsvpCount: event.rsvpCount + 1, rsvps: [...event.rsvps, "current-user"] });
      setHasRSVPd(true);
    }
  };

  const handleRequestCollaborate = () => {
    if (!event) return;
    const req = { id: `${event.id}-${Date.now()}`, eventId: event.id, title: event.title, status: "pending" };
    try {
      const existing = JSON.parse(localStorage.getItem("collab_requests") || "[]");
      existing.push(req);
      localStorage.setItem("collab_requests", JSON.stringify(existing));
    } catch (e) {
      localStorage.setItem("collab_requests", JSON.stringify([req]));
    }
    setHasRequested(true);
  };

  const handleVote = async (time?: string, siteId?: string) => {
    if (!event || !poll) return;
    const updatedPoll = { ...poll } as any;
    if (time) {
      if (selectedTime === time) {
        updatedPoll.timeVotes[time] = Math.max(0, (updatedPoll.timeVotes[time] || 0) - 1);
        setSelectedTime(null);
      } else {
        if (selectedTime) {
          updatedPoll.timeVotes[selectedTime] = Math.max(0, (updatedPoll.timeVotes[selectedTime] || 0) - 1);
        }
        updatedPoll.timeVotes[time] = (updatedPoll.timeVotes[time] || 0) + 1;
        setSelectedTime(time);
      }
    }
    if (siteId) {
      if (selectedSite === siteId) {
        updatedPoll.siteVotes[siteId] = Math.max(0, (updatedPoll.siteVotes[siteId] || 0) - 1);
        setSelectedSite(null);
      } else {
        if (selectedSite) {
          updatedPoll.siteVotes[selectedSite] = Math.max(0, (updatedPoll.siteVotes[selectedSite] || 0) - 1);
        }
        updatedPoll.siteVotes[siteId] = (updatedPoll.siteVotes[siteId] || 0) + 1;
        setSelectedSite(siteId);
      }
    }
    setPoll(updatedPoll);
  };

  const handleViewChat = () => {
    router.push(`/event/${eventId}/chat`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Event not found</h2>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <PrimaryButton onClick={handleBack}>Go Back</PrimaryButton>
        </Card>
      </div>
    );
  }

  const timeLabels: Record<string, string> = {
    "today_11_13": "Today, 11:00 AM - 1:00 PM",
    "today_13_15": "Today, 1:00 PM - 3:00 PM",
    "tomorrow_09_11": "Tomorrow, 9:00 AM - 11:00 AM"
  };

  const totalVotes = Object.values(poll?.timeVotes || {}).reduce((sum: number, votes: unknown) => sum + (votes as number), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex items-center gap-2">
        <button 
          className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          onClick={handleBack}
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">{event.title}</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {creator?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold">{creator?.name}</h2>
            <p className="text-sm text-muted-foreground">Event organizer</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{event.distanceKm?.toFixed(1)} km away</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{event.rsvpCount} people going</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Items needed</h3>
          <div className="flex flex-wrap gap-2">
            {event.items.map((item: any, index: number) => (
              <span key={index} className="px-3 py-1 bg-brand-100 text-brand-800 text-sm rounded-full">
                {item.targetQty} {item.categoryId === "1" ? "Produce" : item.categoryId === "2" ? "Canned Goods" : "Bakery"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {role === "donor" ? (
            <PrimaryButton 
              className="flex-1" 
              onClick={handleRequestCollaborate}
              disabled={hasRequested}
            >
              {hasRequested ? "Requested - Pending" : "Request to Collaborate"}
            </PrimaryButton>
          ) : (
            <PrimaryButton 
              className="flex-1" 
              onClick={handleRSVP}
              disabled={hasRSVPd}
            >
              {hasRSVPd ? "RSVP'd" : "RSVP"}
            </PrimaryButton>
          )}
          <OutlineButton onClick={handleViewChat}>
            <MessageCircle className="h-5 w-5" />
          </OutlineButton>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Time Options</h3>
        <div className="space-y-3">
          {event.timeOptions.map((time: string) => (
            <PollOption
              key={time}
              label={timeLabels[time]}
              votes={poll?.timeVotes[time] || 0}
              total={totalVotes as number}
              selected={selectedTime === time}
              onClick={() => handleVote(time)}
            />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Site Options</h3>
        <div className="space-y-4">
          {siteOptions.map((site) => (
            <div 
              key={site.id} 
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSite === site.id 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleVote(undefined, site.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{site.name}</h4>
                  <p className="text-sm text-muted-foreground">{site.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">{site.hoursToday}</p>
                  {site.accessibilityNotes && (
                    <p className="text-xs text-blue-600 mt-1">{site.accessibilityNotes}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{poll?.siteVotes[site.id] || 0}</div>
                  <div className="text-xs text-muted-foreground">votes</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Attendees</h3>
        <div className="flex -space-x-2">
          {attendees.slice(0, 5).map((attendee) => (
            <div 
              key={attendee.id} 
              className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center border-2 border-white"
            >
              <span className="text-white font-medium">
                {attendee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          ))}
          {attendees.length > 5 && (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
              <span className="text-gray-600 font-medium">+{attendees.length - 5}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}