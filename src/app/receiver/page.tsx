"use client";
import { useState } from "react";
import { StickyHeader, PrimaryButton, OutlineButton, Card, EventCard, Input } from "@/components/ui/base";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function RecipientHome() {
  const router = useRouter();
  const bestWindowLabel = "2-4 PM";
  const [postalCode, setPostalCode] = useState("");
  
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
    // In a real app, this would filter events based on postal code
    console.log("Filtering events for postal code:", e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-brand-50">
      <StickyHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-brand-100 to-white p-6 rounded-2xl mb-6">
          <h1 className="text-2xl font-bold mb-1">Find nearby food</h1>
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
            <div onClick={() => router.push("/event/1")} className="cursor-pointer">
              <EventCard title="Afternoon Drop" description="Southview Centre" distance="0.9 km" time="Today, 2-4 PM" attendees={10} capacity={18} items={["Grains","Produce"]} />
            </div>
            <div onClick={() => router.push("/event/2")} className="cursor-pointer">
              <EventCard title="Protein Help" description="Forest Lawn Library" distance="1.4 km" time="Today, 4-6 PM" attendees={7} capacity={15} items={["Canned Tuna","Beans"]} />
            </div>
          </div>
          <OutlineButton onClick={() => router.push("/feed")} className="mt-4">Open Feed</OutlineButton>
        </Card>
      </main>
    </div>
  );
}