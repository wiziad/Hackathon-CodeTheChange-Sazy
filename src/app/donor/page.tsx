"use client";
import { StickyHeader, PrimaryButton, SecondaryButton, Card, EventCard } from "@/components/ui/base";
import { useRouter } from "next/navigation";

export default function DonorHome() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-brand-50">
      <StickyHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-brand-100 to-white p-6 rounded-2xl mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-brand-700">Best times to donate today: <span className="font-semibold text-brand-600">2-4 PM, 4-6 PM</span></p>
        </div>

        <div className="flex gap-3 mb-6">
          <PrimaryButton onClick={() => router.push("/donor/event/new")} className="flex-1">Create Event</PrimaryButton>
          <SecondaryButton onClick={() => router.push("/donor/my-events")}>My Events</SecondaryButton>
        </div>

        <Card className="p-4">
          <h2 className="text-xl font-bold mb-3">Suggested events</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <EventCard title="Fresh Produce Drop-Off" description="Local garden share" distance="0.8 km" time="Today, 2-4 PM" attendees={12} capacity={20} items={["Vegetables","Fruits","Bread"]} />
            <EventCard title="Community Food Drive" description="Monthly collection" distance="1.2 km" time="Tomorrow, 10 AM-12 PM" attendees={8} capacity={15} items={["Canned Goods","Grains","Protein"]} sponsored />
          </div>
        </Card>
      </main>
    </div>
  );
}