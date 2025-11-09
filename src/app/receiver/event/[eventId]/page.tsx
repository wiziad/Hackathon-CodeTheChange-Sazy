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

export default function ReceiverEventPage({ params }: { params: { eventId: string } | Promise<{ eventId: string }> }) {
  const router = useRouter();
  const resolved = use(params as any) as { eventId: string };
  const eventId = resolved?.eventId;
  const [event, setEvent] = useState<any | null>(null);
  const [creator, setCreator] = useState<any | null>(null);
  const [poll, setPoll] = useState<any | null>(null);
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // receiver page: enforce receiver role
  const effectiveRole = "receiver";
  const [hasRSVPd, setHasRSVPd] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  useEffect(() => {
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
        { id: "1", name: "Community Center" },
        { id: "2", name: "City Park Pavilion" }
      ];

      const mockAttendees = [ { id: "1", name: "Alice Johnson" } ];

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

  const handleChat = () => {
    const prefix = "/receiver";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200" onClick={() => router.back()}>←</button>
            <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity cursor-pointer"><MetraLogo /></button>
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
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">Time</h3>
                    <p className="text-muted-foreground">{formatTimeLabel(event.timeOptions?.[0] || '')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">Location</h3>
                    <p className="text-muted-foreground">{siteOptions?.[0]?.name || 'TBD'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Items Needed</h3>
                  <div className="flex flex-wrap gap-6">
                    {event.items?.map((it: any, idx: number) => (
                      <div key={idx} className="text-sm text-muted-foreground">{it.targetQty} items</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Attendees ({attendees.length})</h3>
                  <div className="flex flex-wrap gap-10 items-center">
                    {attendees.map((a) => (
                      <div key={a.id} className="py-2 text-sm">{a.name}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* Stacked full-width action buttons: Primary status (RSVP/Leave) above Outline (Open Chat) */}
                <div>
                  <PrimaryButton className="w-full py-3" onClick={handleRSVP}>{hasRSVPd ? 'Leave' : 'RSVP'}</PrimaryButton>
                </div>
                <div>
                  <OutlineButton className="w-full py-3" onClick={handleChat}>Open Chat</OutlineButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
