"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton, OutlineButton, Card, EventCard, Input, MetraLogo } from "@/components/ui/base";
import { Package, Heart, MapPin, Calendar, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/providers/auth-provider';
import { MapView } from "@/components/map-view";

export default function HomePage() {
  const router = useRouter();
  const { profile, user, loading: authLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [initialLoadTimeout, setInitialLoadTimeout] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<any[]>([]);
  
  // Use profile role if available, otherwise fallback to localStorage
  // Normalize: 'recipient' is treated as 'receiver' for UI consistency
  const storedRole = typeof window !== 'undefined' ? localStorage.getItem('metra_role') : null;
  const normalizedStoredRole = storedRole === 'recipient' ? 'receiver' : storedRole;
  const userRole = profile?.role === 'recipient' ? 'receiver' : (profile?.role || normalizedStoredRole);
  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

  useEffect(() => {
    setIsClient(true);
    
    // Set a timeout to stop waiting for auth after 2 seconds
    const timeout = setTimeout(() => {
      setInitialLoadTimeout(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);

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

  // Check if we should show the welcome animation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShowWelcome = localStorage.getItem('showWelcomeAnimation');
      if (shouldShowWelcome === 'true') {
        setShowWelcome(true);
        // Remove the flag so it doesn't show again
        localStorage.removeItem('showWelcomeAnimation');
        
        // Auto-hide after 1.5 seconds (shorter duration)
        const timer = setTimeout(() => {
          setShowWelcome(false);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

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

  // If user is logged in, they'll be redirected by the effect above
  // If not logged in or if timeout reached, show the landing page
  if (authLoading && !initialLoadTimeout) {
    return (
      <div className="min-h-screen bg-brand-50 text-brand-900 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show the landing page for all users (guests, donors, and recipients)
  // But add role-specific functionality
  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      

      <AnimatePresence>
        {showWelcome && isClient && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
              <p className="font-bold">Welcome back{profile?.name ? `, ${profile.name}` : ''}!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          {(!authLoading || initialLoadTimeout)
            ? (user
                ? `Hey ${displayName || (profile?.name || 'Friend')}, how would you like to help today?`
                : 'Hey Guest, How would you like to help today?'
              )
            : 'How would you like to help today?'}
        </h1>

        {(!authLoading || initialLoadTimeout) && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-8 hover:border-brand-500 cursor-pointer transition-all duration-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Package className="text-brand-600" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">I want to donate</h2>
                  <p className="text-brand-700 mb-4">Share food and help your neighbors</p>
                  <PrimaryButton 
                    onClick={() => {
                      if (userRole === 'donor') {
                        router.push("/donor/event/new");
                      } else {
                        router.push("/donor");
                      }
                    }} 
                    data-testid="landing-primary-cta"
                  >
                    {userRole === 'donor' ? 'Create Event' : 'Get Started as Donor'}
                  </PrimaryButton>
                </div>
              </Card>

              <Card className="p-8 hover:border-brand-500 cursor-pointer transition-all duration-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Heart className="text-brand-600" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">I need food today</h2>
                  <p className="text-brand-700 mb-4">Find nearby food and connect with donors</p>
                  <PrimaryButton 
                    onClick={() => {
                      if (userRole === 'receiver' || userRole === 'recipient') {
                        router.push("/feed");
                      } else {
                        router.push("/receiver");
                      }
                    }}
                  >
                    {userRole === 'receiver' || userRole === 'recipient' ? 'Find Food' : 'Get Started as Recipient'}
                  </PrimaryButton>
                </div>
              </Card>
            </div>

            {/* Add the MapView component with the specified styling */}
            <div className="max-w-4xl mx-auto mb-12">
              <MapView className="h-[400px] rounded-lg" />
            </div>

            <div className="max-w-md mx-auto mb-16">
              <Input placeholder="Enter your postal code" icon={<MapPin size={18} />} />
            </div>
          </>
        )}

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