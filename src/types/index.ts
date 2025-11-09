export type Role = "donor" | "receiver" | "org";

export interface Profile {
  id: string;
  name: string;
  role: Role;
  bio?: string;
  photoUrl?: string;
  rating?: number;
  verified?: boolean;
  visibility: "public" | "private" | "limited";
  dmAllowed: boolean;
  postalCode?: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  hoursToday: string;
  accessibilityNotes?: string;
}

export type TimeWindowId =
  | "today_09_11" | "today_11_13" | "today_13_15" | "today_15_17" | "today_17_19"
  | "tomorrow_09_11" | "tomorrow_11_13" | "tomorrow_13_15" | "tomorrow_15_17" | "tomorrow_17_19";

export interface EventPost {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  items: Array<{ categoryId: string; targetQty: number }>;
  timeOptions: TimeWindowId[];
  siteOptions: string[];           // Site ids
  finalTime?: TimeWindowId;
  finalSiteId?: string;
  visibility: "public" | "followers" | "invite";
  rsvpCount: number;
  rsvps: string[];                 // Profile ids
  distanceKm?: number;
  createdAt: string;
  status: "open" | "finalized" | "completed" | "cancelled";
}

export interface PollState {
  eventId: string;
  timeVotes: Record<TimeWindowId, number>;
  siteVotes: Record<string, number>;
  voterIds: string[];
}

export interface ChatMessage {
  id: string;
  threadId: string;
  authorId: string;
  text: string;
  ts: string;
  readBy: string[];
  pinned?: boolean;
}

export interface Thread {
  id: string;
  type: "dm" | "group";
  participantIds: string[];
  eventId?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

export interface Notification {
  id: string;
  type: "vote" | "finalized" | "rsvp" | "chat" | "broadcast";
  title: string;
  body?: string;
  eventId?: string;
  actorId?: string;
  createdAt: string;
  read: boolean;
}

export interface Category { 
  id: string; 
  name: string; 
  unit: "kg" | "items" | "packs" | "cans" 
}