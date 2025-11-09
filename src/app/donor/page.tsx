"use client";
import { useState } from "react";
import { PrimaryButton, SecondaryButton, Card, EventCard, Input } from "@/components/ui/base";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useAuth } from '@/providers/auth-provider';

export default function DonorHome() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [postalCode, setPostalCode] = useState("");
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
    // In a real app, this would filter events based on postal code
    console.log("Filtering events for postal code:", e.target.value);
  };

  const requestCollaborate = async (eventId: string, title: string) => {
    try {
      if (!user?.id) {
        localStorage.setItem('metra_return_to', `/donor/event/${eventId}`);
        router.push('/auth');
        return;
      }
      const res = await fetch(`/api/events/${eventId}/collab-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donor_id: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequested(prev => ({ ...prev, [eventId]: true }));
      } else {
        console.error('Collab request failed:', data);
      }
    } catch (e) {
      console.error('Collab request error:', e);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-brand-100 to-white p-6 rounded-2xl mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name || 'Donor'}!</h1>
        <p className="text-brand-700">Best times to donate today: <span className="font-semibold text-brand-600">2-4 PM, 4-6 PM</span></p>
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

      <div className="flex gap-3 mb-6">
        <PrimaryButton onClick={() => router.push("/donor/event/new")} className="flex-1">Create Event</PrimaryButton>
        <SecondaryButton onClick={() => router.push("/donor/my-events")}>My Events</SecondaryButton>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-3">Suggested events</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div onClick={() => router.push("/donor/event/1")} className="cursor-pointer">
            <EventCard 
              title="Fresh Produce Drop-Off" 
              description="Local garden share" 
              distance="0.8 km" 
              time="Today, 2-4 PM" 
              attendees={12} 
              capacity={20} 
              items={["Vegetables","Fruits","Bread"]}
              actionLabel="Request to Collaborate"
              pendingLabel="Requested - Pending"
              pending={requested["1"]}
              onRsvp={() => requestCollaborate("1", "Fresh Produce Drop-Off")}
            />
          </div>
          <div onClick={() => router.push("/donor/event/2")} className="cursor-pointer">
            <EventCard 
              title="Community Food Drive" 
              description="Monthly collection" 
              distance="1.2 km" 
              time="Tomorrow, 10 AM-12 PM" 
              attendees={8} 
              capacity={15} 
              items={["Canned Goods","Grains","Protein"]}

              actionLabel="Request to Collaborate"
              pendingLabel="Requested - Pending"
              pending={requested["2"]}
              onRsvp={() => requestCollaborate("2", "Community Food Drive")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}