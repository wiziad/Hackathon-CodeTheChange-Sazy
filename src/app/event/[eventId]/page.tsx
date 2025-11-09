"use client";

import { use, useState, useEffect } from "react";
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

  // effectiveRole is the detected role from session/localStorage
  const effectiveRole = role;

  const handleChat = () => {
    const prefix = effectiveRole === "donor" ? "/donor" : effectiveRole === "receiver" ? "/receiver" : "";
    router.push(`${prefix}/event/${eventId}/chat`);
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

  const formatTimeLabel = (timeOption: string) => {
    const parts = timeOption.split('_');
    if (parts.length === 3) {
      const day = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      const startTime = `${parts[1]}:00`;
      const endTime = `${parts[2]}:00`;
      return `${day} ${startTime} - ${endTime}`;
    }
    return timeOption;
  };

  const totalTimeVotes = Object.values(poll.timeVotes).reduce((sum: number, votes: any) => sum + Number(votes), 0);
  const totalSiteVotes = Object.values(poll.siteVotes).reduce((sum: number, votes: any) => sum + Number(votes), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <button
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <MetraLogo />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground">{event.description}</p>

          <Card>
            <div className="p-4">
              <div className="flex gap-4 items-center mb-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Organized by {creator.name}</p>
                </div>
                <div className="flex gap-2">
                  <PrimaryButton onClick={handleRSVP}>{hasRSVPd ? 'Leave' : 'RSVP'}</PrimaryButton>
                  <SecondaryButton onClick={handleRequestCollaborate} disabled={hasRequested}>{hasRequested ? 'Requested' : 'Request to Collaborate'}</SecondaryButton>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Time options</h3>
                  {event.timeOptions.map((t: string) => (
                    <div key={t} className="mb-2">
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg border ${selectedTime === t ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleVote(t, undefined)}
                      >
                        <div className="flex justify-between">
                          <span>{formatTimeLabel(t)}</span>
                          <span className="text-sm text-muted-foreground">{poll.timeVotes[t] || 0} votes</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Site options</h3>
                  {siteOptions.map((s) => (
                    <div key={s.id} className="mb-2">
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg border ${selectedSite === s.id ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleVote(undefined, s.id)}
                      >
                        <div className="flex justify-between">
                          <span>{s.name}</span>
                          <span className="text-sm text-muted-foreground">{poll.siteVotes[s.id] || 0} votes</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Card>

          {/* Stacked full-width action buttons (original visual) */}
          <div className="mt-6 space-y-3">
            {effectiveRole === "donor" ? (
              <PrimaryButton onClick={handleRequestCollaborate} disabled={hasRequested} className="w-full py-4 rounded-2xl">
                {hasRequested ? 'Requested - Pending' : 'Request to Collaborate'}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleRSVP} className="w-full py-4 rounded-2xl">
                {hasRSVPd ? 'Leave' : 'RSVP'}
              </PrimaryButton>
            )}

            <OutlineButton onClick={handleChat} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" /> Open Chat
            </OutlineButton>
          </div>
        </div>
      </main>
    </div>
  );
}
