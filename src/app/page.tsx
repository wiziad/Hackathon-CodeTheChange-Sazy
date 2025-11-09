"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/providers/auth-provider';
import { MetraLogo } from "@/components/ui/base";

export default function SplashPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Set flag that splash has been visited
    localStorage.setItem('metra_visited', 'true');
    
    // Redirect logic
    const timer = setTimeout(() => {
      if (!loading) {
        if (session) {
          router.replace('/home');
        } else {
          router.replace('/home');;
        }
        setShowSplash(false);
      }
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [session, loading, router]);

  if (!showSplash) {
    return <div className="min-h-screen bg-brand-50 flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center">
      <div className="animate-fade-in">
        <MetraLogo size={64} />
      </div>
      <h1 className="text-4xl font-bold mt-6 text-brand-900">Metra</h1>
      <p className="mt-2 text-brand-700">Community food sharing</p>
    </div>
  );
}
