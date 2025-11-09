"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, Plus, Calendar, MapPin, Users } from "lucide-react";
import { 
  Card,
  PrimaryButton,
  OutlineButton,
  MetraLogo,
  HamburgerMenu
} from "@/components/ui/base";

interface Event {
  id: string;
  title: string;
  description: string;
  status: "draft" | "voting" | "finalized" | "completed";
  createdAt: string;
  timeWindow?: string;
  site?: string;
  rsvpCount: number;
  items: string[];
}

export default function MyEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "finalized" | "completed" | "requests">("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  // Load collaboration requests from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("collab_requests") || "[]");
      setRequests(stored);
    } catch (e) {
      setRequests([]);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      // Mock data - in a real app, this would be an API call
      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Weekend Food Drive",
          description: "Community food donation event for local families",
          status: "finalized",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          timeWindow: "Saturday 2:00-4:00 PM",
          site: "Community Center",
          rsvpCount: 12,
          items: ["Fresh Produce", "Canned Goods", "Bakery"]
        },
        {
          id: "2",
          title: "Monthly Pantry Collection",
          description: "Regular monthly food collection",
          status: "voting",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          rsvpCount: 8,
          items: ["Canned Goods", "Grains", "Dairy"]
        },
        {
          id: "3",
          title: "Holiday Food Share",
          description: "Special holiday event to share meals",
          status: "draft",
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          rsvpCount: 0,
          items: ["Fresh Produce", "Bakery", "Meat"]
        }
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // Manage collaboration requests
  const [requests, setRequests] = useState<Array<{id:string,eventId:string,title:string,status:string}>>([]);
  const handleRequestAction = (id: string, action: "accept" | "decline") => {
    const updated = requests.map(r => r.id === id ? { ...r, status: action } : r);
    setRequests(updated);
    localStorage.setItem("collab_requests", JSON.stringify(updated));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
      voting: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      finalized: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
      completed: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <MetraLogo />
            </button>
          </div>
          <HamburgerMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 md:pb-4">
        <div className="container max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Events</h1>
              <p className="text-muted-foreground">
                Manage your donation events
              </p>
            </div>
            <PrimaryButton onClick={() => router.push("/donor/event/new")} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              <span>Create Event</span>
            </PrimaryButton>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "finalized", "completed", "requests"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Events List */}
          {filter === "requests" ? (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Collaboration Requests</h2>
                {requests.length === 0 ? (
                  <p className="text-muted-foreground">No collaboration requests</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <Card key={req.id}>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{req.title}</p>
                            <p className="text-sm text-muted-foreground">Request ID: {req.id}</p>
                            <p className="text-xs">Status: {req.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <OutlineButton onClick={() => handleRequestAction(req.id, "accept")}>
                              Accept
                            </OutlineButton>
                            <OutlineButton onClick={() => handleRequestAction(req.id, "decline")}>
                              Decline
                            </OutlineButton>
                            <OutlineButton onClick={() => router.push(`/event/${req.eventId}/chat`)}>
                              Open Chat
                            </OutlineButton>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ) : filteredEvents.length === 0 ? (
            <Card>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {filter === "all" 
                      ? "You haven't created any events yet" 
                      : `You don't have any ${filter} events`}
                  </p>
                  <PrimaryButton onClick={() => router.push("/donor/event/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/event/${event.id}`)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>

                    {event.timeWindow && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.timeWindow}</span>
                      </div>
                    )}

                    {event.site && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.site}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Users className="h-4 w-4" />
                      <span>{event.rsvpCount} RSVPs</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.items.map((item, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <OutlineButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/event/${event.id}`);
                        }}
                        className="flex-1"
                      >
                        View Details
                      </OutlineButton>
                      {event.status === "finalized" && (
                        <OutlineButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/event/${event.id}/chat`);
                          }}
                          className="flex-1"
                        >
                          Open Chat
                        </OutlineButton>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
