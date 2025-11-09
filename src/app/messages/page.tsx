"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe, MessageCircle, User, Clock } from "lucide-react";
import { 
  Card,
  PrimaryButton
} from "@/components/ui/base";

interface Thread {
  id: string;
  type: "dm" | "group";
  participantIds: string[];
  eventId?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  title: string;
  lastMessage: string;
  participants: string[];
}

export default function Messages() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch threads from API
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockThreads: Thread[] = [
        {
          id: "1",
          type: "group",
          participantIds: ["1", "2", "3"],
          eventId: "1",
          lastMessageAt: new Date().toISOString(),
          unreadCount: 2,
          title: "Weekend Food Drive",
          lastMessage: "We've confirmed the site for tomorrow. See you all at 11am!",
          participants: ["Alice", "Bob", "Community Food Bank"]
        },
        {
          id: "2",
          type: "dm",
          participantIds: ["1", "2"],
          lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0,
          title: "Bob Smith",
          lastMessage: "No problem! Happy to help",
          participants: ["Alice", "Bob"]
        },
        {
          id: "3",
          type: "group",
          participantIds: ["1", "3"],
          eventId: "2",
          lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
          unreadCount: 0,
          title: "Community Food Bank Distribution",
          lastMessage: "Thanks for your continued support!",
          participants: ["Alice", "Community Food Bank"]
        }
      ];
      
      setThreads(mockThreads);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching threads:", error);
      setLoading(false);
    }
  };

  const handleOpenThread = (threadId: string) => {
    router.push(`/messages/${threadId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Your conversations</p>
      </div>

      {threads.length === 0 ? (
        <Card>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                When you start conversations or join events, they'll appear here
              </p>
              <PrimaryButton>Find Events</PrimaryButton>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card 
              key={thread.id} 
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              onClick={() => handleOpenThread(thread.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                    {thread.type === "dm" ? (
                      <User className="h-6 w-6 text-white" />
                    ) : (
                      <MessageCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-semibold truncate">{thread.title}</h3>
                      {thread.lastMessageAt && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {thread.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex -space-x-1">
                        {thread.participants.slice(0, 3).map((participant, index) => (
                          <div 
                            key={index} 
                            className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center"
                          >
                            <User className="h-3 w-3 text-white" />
                          </div>
                        ))}
                        {thread.participants.length > 3 && (
                          <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs">
                            +{thread.participants.length - 3}
                          </div>
                        )}
                      </div>
                      {thread.unreadCount && thread.unreadCount > 0 && (
                        <span className="inline-flex items-center rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}