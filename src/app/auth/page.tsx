"use client";
import { useRouter } from "next/navigation";
import { Card, Input, PrimaryButton, SecondaryButton, StickyHeader, MetraLogo } from "@/components/ui/base";

export default function AuthPage() {
  const router = useRouter();
  const demo = (role: "donor" | "recipient") => {
    const mock = { token: "mock", user: { id: `${role}_1`, name: role==="donor" ? "Alex" : "Sara", role }, role };
    localStorage.setItem("metra_session", JSON.stringify(mock));
    router.push(role === "donor" ? "/donor" : "/receiver");
  };

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <StickyHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MetraLogo /><span className="text-xl font-bold">Metra</span>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Welcome to Metra</h1>
            <p className="text-center text-brand-700 mb-8">Sign in to coordinate food donations</p>

            <Input placeholder="Enter your email" type="email" className="mb-6" />

            <div className="space-y-3 mb-6">
              <PrimaryButton onClick={() => demo("donor")} className="w-full">Try as Donor</PrimaryButton>
              <PrimaryButton onClick={() => demo("recipient")} className="w-full">Try as Recipient</PrimaryButton>
              <SecondaryButton onClick={() => router.push("/landing")} className="w-full">Browse as Guest</SecondaryButton>
            </div>

            <p className="text-xs text-brand-600 text-center">Your privacy matters. We never share your information.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}