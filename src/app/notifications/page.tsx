"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Globe, Bell, CheckCircle, User, Calendar, MessageCircle } from "lucide-react";
import { 
  Card,
  OutlineButton
} from "@/components/ui/base";

interface Notification {
  id: string;
  type: "vote" | "finalized" | "rsvp" | "chat" | "broadcast";
  title: string;
  body?: string;
  eventId?: string;
  actorId?: string;
  createdAt: string;
  read: boolean;
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from API
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "rsvp",
          title: "New RSVP",
          body: "Bob Smith has RSVP'd to your event",
          eventId: "1",
          actorId: "2",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: "2",
          type: "vote",
          title: "New Vote",
          body: "Someone voted on your event time",
          eventId: "1",
          actorId: "3",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          read: false
        },
        {
          id: "3",
          type: "broadcast",
          title: "Community Update",
          body: "New items needed at the food bank",
          eventId: "2",
          actorId: "3",
          createdAt: new Date().toISOString(),
          read: false
        },
        {
          id: "4",
          type: "chat",
          title: "New Message",
          body: "Alice sent a message in the Weekend Food Drive chat",
          eventId: "1",
          actorId: "1",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        {
          id: "5",
          type: "finalized",
          title: "Event Finalized",
          body: "The time and location for Weekend Food Drive have been finalized",
          eventId: "1",
          actorId: "system",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const handleMarkAllRead = () => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
  };

  const handleNotificationClick = (notification: Notification) => {
    // In a real app, this would navigate to the relevant page
    if (notification.eventId) {
      const role = useAuthStore.getState().role || (typeof window !== 'undefined' ? (() => { try { const s = localStorage.getItem('metra_session'); if (!s) return null; const parsed = JSON.parse(s); return parsed.role || parsed.user?.role; } catch { return null; } })() : null);
      const prefix = role === 'donor' ? '/donor' : role === 'receiver' ? '/receiver' : '';
      router.push(`${prefix}/event/${notification.eventId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "rsvp":
        return <User className="h-5 w-5 text-blue-500" />;
      case "vote":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "finalized":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "chat":
        return <MessageCircle className="h-5 w-5 text-yellow-500" />;
      case "broadcast":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {
      "Today": [],
      "Yesterday": [],
      "Earlier": []
    };
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      
      if (notificationDate.toDateString() === today.toDateString()) {
        groups["Today"].push(notification);
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groups["Yesterday"].push(notification);
      } else {
        groups["Earlier"].push(notification);
      }
    });
    
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <OutlineButton onClick={handleMarkAllRead} className="text-sm">
          Mark all as read
        </OutlineButton>
      </div>

      {Object.entries(groupedNotifications).map(([date, notifications]) => (
        notifications.length > 0 && (
          <div key={date} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{date}</h2>
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  notification.read ? "bg-background" : "bg-accent"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{notification.title}</h3>
                    {notification.body && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )
      ))}

      {notifications.length === 0 && (
        <Card className="p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </Card>
      )}
    </div>
  );
}