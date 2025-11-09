"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetraLogo } from "@/components/ui/base";
import { Globe, Send, Users } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  rating?: number;
  verified?: boolean;
  visibility: string;
  dmAllowed: boolean;
  postalCode?: string;
}

interface ChatMessage {
  id: string;
  threadId: string;
  authorId: string;
  text: string;
  ts: string;
  readBy: string[];
  pinned?: boolean;
}

export default function EventChat({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<Profile[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat messages and participants from API
    fetchChatData();
  }, [params.eventId]);

  useEffect(() => {
    // Scroll to bottom of chat
    scrollToBottom();
  }, [messages]);

  const fetchChatData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          threadId: params.eventId,
          authorId: "1",
          text: "Hi everyone! Looking forward to tomorrow's event",
          ts: new Date(Date.now() - 7200000).toISOString(),
          readBy: ["1", "2"],
          pinned: true
        },
        {
          id: "2",
          threadId: params.eventId,
          authorId: "2",
          text: "Thanks for organizing this, Alice!",
          ts: new Date(Date.now() - 3600000).toISOString(),
          readBy: ["1", "2"]
        },
        {
          id: "3",
          threadId: params.eventId,
          authorId: "3",
          text: "We've confirmed the site for tomorrow. See you all at 11am!",
          ts: new Date().toISOString(),
          readBy: ["3"]
        }
      ];
      
      const mockParticipants: Profile[] = [
        {
          id: "1",
          name: "Alice Johnson",
          role: "donor",
          bio: "Passionate about reducing food waste",
          photoUrl: "https://example.com/alice.jpg",
          rating: 4.8,
          verified: true,
          visibility: "public",
          dmAllowed: true,
          postalCode: "T2X1A1"
        },
        {
          id: "2",
          name: "Bob Smith",
          role: "receiver",
          bio: "Community volunteer helping local families",
          photoUrl: "https://example.com/bob.jpg",
          rating: 4.5,
          verified: true,
          visibility: "public",
          dmAllowed: true,
          postalCode: "T2X1A1"
        },
        {
          id: "3",
          name: "Community Food Bank",
          role: "org",
          bio: "Non-profit organization serving the community",
          photoUrl: "https://example.com/cfb.jpg",
          rating: 4.9,
          verified: true,
          visibility: "public",
          dmAllowed: true,
          postalCode: "T2X1A1"
        }
      ];
      
      setMessages(mockMessages);
      setParticipants(mockParticipants);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would be an API call
    const mockNewMessage: ChatMessage = {
      id: (messages.length + 1).toString(),
      threadId: params.eventId,
      authorId: "current-user",
      text: newMessage,
      ts: new Date().toISOString(),
      readBy: ["current-user"]
    };
    
    setMessages([...messages, mockNewMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              ←
            </Button>
            <MetraLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col rounded-none border-0 border-b">
          <CardHeader className="border-b">
            <CardTitle>Event Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.authorId === "current-user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.authorId === "current-user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-accent"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}