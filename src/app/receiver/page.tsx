"use client";
import { StickyHeader, PrimaryButton, OutlineButton, Card, EventCard } from "@/components/ui/base";
import { useRouter } from "next/navigation";

export default function RecipientHome() {
  const router = useRouter();
  const bestWindowLabel = "2-4 PM";
  return (
    <div className="min-h-screen bg-brand-50">
      <StickyHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-brand-100 to-white p-6 rounded-2xl mb-6">
          <h1 className="text-2xl font-bold mb-1">Find nearby food</h1>
          <p className="text-brand-700">Best time to go today: <span className="font-semibold text-brand-600">{bestWindowLabel}</span></p>
        </div>

        <Card className="p-4 mb-6">
          <h2 className="text-xl font-bold mb-3">Events near you</h2>
          <div className="space-y-3">
            <EventCard title="Afternoon Drop" description="Southview Centre" distance="0.9 km" time="Today, 2-4 PM" attendees={10} capacity={18} items={["Grains","Produce"]} />
            <EventCard title="Protein Help" description="Forest Lawn Library" distance="1.4 km" time="Today, 4-6 PM" attendees={7} capacity={15} items={["Canned Tuna","Beans"]} />
          </div>
          <OutlineButton onClick={() => router.push("/feed")} className="mt-4">Open Feed</OutlineButton>
        </Card>
      </main>
    </div>
  );
}