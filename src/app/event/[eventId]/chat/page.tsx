"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetraLogo } from "@/components/ui/base";
import { Globe, Send, Users } from "lucide-react";

export default function EventChatPage({ params }: { params: { eventId: string } | Promise<{ eventId: string }> }) {
  const router = useRouter();
  const resolved = use(params as any) as { eventId: string };
  const eventId = resolved?.eventId;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    fetchChatData();
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatData = async () => {
    try {
      const mockMessages = [
        {
          id: "1",
          threadId: eventId,
          authorId: "1",
          text: "Hi everyone! Looking forward to tomorrow's event",
          ts: new Date(Date.now() - 7200000).toISOString(),
          readBy: ["1", "2"],
          pinned: true
        }
      ];

      const mockParticipants = [
        {
          id: "1",
          name: "Alice Johnson",
          role: "donor",
          photoUrl: "https://example.com/alice.jpg",
        }
      ];

      setMessages(mockMessages);
      setParticipants(mockParticipants);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const mockNewMessage = {
      id: (messages.length + 1).toString(),
      threadId: eventId,
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

      <main className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col rounded-none border-0 border-b">
          <CardHeader className="border-b">
            <CardTitle>Event Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.authorId === "current-user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-lg px-4 py-2 ${message.authorId === "current-user" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center gap-2">
              <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} className="flex-1" />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}