"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe, Send, Users, User, Shield } from "lucide-react";
import { 
  Card,
  Input,
  IconButton,
  MetraLogo
} from "@/components/ui/base";

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

export default function MessageThread({ params }: { params: { threadId: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [threadTitle, setThreadTitle] = useState("Conversation");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat messages and participants from API
    fetchThreadData();
  }, [params.threadId]);

  useEffect(() => {
    // Scroll to bottom of chat
    scrollToBottom();
  }, [messages]);

  const fetchThreadData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          threadId: params.threadId,
          authorId: "1",
          text: "Hi everyone! Looking forward to tomorrow's event",
          ts: new Date(Date.now() - 7200000).toISOString(),
          readBy: ["1", "2"],
          pinned: true
        },
        {
          id: "2",
          threadId: params.threadId,
          authorId: "2",
          text: "Thanks for organizing this, Alice!",
          ts: new Date(Date.now() - 3600000).toISOString(),
          readBy: ["1", "2"]
        },
        {
          id: "3",
          threadId: params.threadId,
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
      setThreadTitle(params.threadId === "1" ? "Weekend Food Drive" : "Conversation");
    } catch (error) {
      console.error("Error fetching thread data:", error);
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
      threadId: params.threadId,
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
            <button 
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200"
              onClick={() => router.back()}
            >
              ←
            </button>
            <MetraLogo />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
              <Globe className="h-5 w-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col rounded-none border-0 border-b">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">{threadTitle}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.authorId === "current-user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.authorId === "current-user" 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-100 dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className="h-4 w-4 rounded-full bg-green-700"></div>
                      <span className="text-xs font-medium">
                        {message.authorId === "1" ? "Alice" : 
                         message.authorId === "2" ? "Bob" : 
                         message.authorId === "3" ? "Community Food Bank" : "You"}
                      </span>
                      {message.authorId === "3" && (
                        <Shield className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <IconButton 
                icon={<Send className="h-4 w-4" />} 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}