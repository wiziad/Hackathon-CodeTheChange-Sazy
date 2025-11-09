"use client";
import { useState, useEffect } from "react";
import { PrimaryButton, OutlineButton, Card, EventCard, Input } from "@/components/ui/base";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useAuth } from '@/providers/auth-provider';

export default function RecipientHome() {
  const router = useRouter();
  const { profile } = useAuth();
  const bestWindowLabel = "2-4 PM";
  const [postalCode, setPostalCode] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
    // In a real app, this would filter events based on postal code
    console.log("Filtering events for postal code:", e.target.value);
  };

  // Load events from localStorage and API
  useEffect(() => {
    const loadEvents = async () => {
      // Load from localStorage first
      try {
        const ls = JSON.parse(localStorage.getItem('metra_events') || '[]');
        if (ls.length > 0) {
          setEvents(ls);
        }
      } catch (e) {
        console.log('No local events found');
      }

      // Try to load from API
      try {
        const res = await fetch('/api/events');
        if (!res.ok) {
          console.log('Backend not ready, using local storage only');
          return;
        }
        const data = await res.json();
        const list = (data.events || []).map((ev: any) => ({
          id: String(ev.id),
          title: ev.title,
          description: ev.description ?? '',
          status: ev.status || 'open',
          createdAt: ev.created_at || new Date().toISOString(),
          items: (ev.event_items || []).map((it: any) => String(it.category_id)),
          rsvpCount: 0
        }));
        if (list.length > 0) {
          setEvents(list);
        }
      } catch (error) {
        console.log('Backend not ready, using local storage only');
      }
    };
    loadEvents();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-brand-100 to-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-1">Find nearby food, {profile?.name || 'Friend'}</h1>
        <p className="text-brand-700">Best time to go today: <span className="font-semibold text-brand-600">{bestWindowLabel}</span></p>
      </div>

      <div className="mb-6">
        <label htmlFor="postalCode" className="block text-sm font-medium mb-2">Enter your postal code to find nearby events</label>
        <Input
          id="postalCode"
          type="text"
          placeholder="e.g., T2X1A1"
          value={postalCode}
          onChange={handlePostalCodeChange}
          icon={<MapPin size={18} />}
        />
      </div>

      <Card className="p-4 mb-6">
        <h2 className="text-xl font-bold mb-3">Events near you</h2>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-muted-foreground">No events available yet.</p>
          ) : (
            events.slice(0, 4).map((event) => (
              <div key={event.id} onClick={() => router.push(`/receiver/event/${event.id}`)} className="cursor-pointer">
                <EventCard 
                  title={event.title}
                  description={event.description || 'Event'}
                  distance="N/A"
                  time="TBD"
                  attendees={event.rsvpCount || 0}
                  capacity={20}
                  items={event.items || []}
                />
              </div>
            ))
          )}
        </div>
        <OutlineButton onClick={() => router.push("/feed")} className="mt-4">Open Feed</OutlineButton>
      </Card>
    </div>
  );
}