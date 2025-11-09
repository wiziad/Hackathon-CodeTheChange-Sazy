"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MetraLogo } from "@/components/ui/base";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem("metra_session");
      if (!session) router.push("/auth");
      else {
        const { role } = JSON.parse(session);
        router.push(role === "donor" ? "/donor" : "/receiver");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="animate-fade-in">
        <div className="mb-6 flex justify-center animate-bounce-in"><div className="scale-150"><MetraLogo /></div></div>
        <h1 className="text-5xl font-bold text-brand-900 mb-3 animate-slide-up text-center">METRA</h1>
        <p className="text-brand-700 text-center animate-slide-up animation-delay-200">Connect. Share. Nourish your community.</p>
      </div>
    </div>
  );
}