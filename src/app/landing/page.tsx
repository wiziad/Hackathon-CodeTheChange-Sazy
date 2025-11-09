"use client";
import { useRouter } from "next/navigation";
import { StickyHeader, PrimaryButton, SecondaryButton, Card, Input, MetraLogo } from "@/components/ui/base";
import { Package, Heart, MapPin } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <StickyHeader />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">How would you like to help today?</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 hover:border-brand-500 cursor-pointer transition-all duration-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Package className="text-brand-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">I want to donate</h2>
              <p className="text-brand-700 mb-4">Share food and help your neighbors</p>
              <PrimaryButton onClick={() => router.push("/donor")} data-testid="landing-primary-cta">Get Started as Donor</PrimaryButton>
            </div>
          </Card>

          <Card className="p-8 hover:border-brand-500 cursor-pointer transition-all duration-200 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Heart className="text-brand-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">I need food today</h2>
              <p className="text-brand-700 mb-4">Find nearby food and connect with donors</p>
              <PrimaryButton onClick={() => router.push("/receiver")}>Get Started as Recipient</PrimaryButton>
            </div>
          </Card>
        </div>

        <div className="max-w-md mx-auto mb-16">
          <Input placeholder="Enter your postal code" icon={<MapPin size={18} />} />
          <div className="flex gap-3 justify-center mt-6">
            <SecondaryButton>EN</SecondaryButton>
            <SecondaryButton>FR</SecondaryButton>
          </div>
        </div>

        <div className="bg-brand-100 rounded-2xl py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Save Time", desc: "Quick coordination" },
                { title: "Reduce Waste", desc: "Less food thrown away" },
                { title: "Help Community", desc: "Support neighbors" },
              ].map((b) => (
                <Card key={b.title} className="p-6 text-center">
                  <div className="w-16 h-16 bg-brand-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MetraLogo size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                  <p className="text-brand-700">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}