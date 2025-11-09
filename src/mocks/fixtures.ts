import { Profile, Site, EventPost, PollState, Thread, ChatMessage, Notification, Category } from '@/types';

// Mock data
export const mockProfiles: Record<string, Profile> = {
  "1": {
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
  "2": {
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
  "3": {
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
};

export const mockSites: Record<string, Site> = {
  "1": {
    id: "1",
    name: "Community Center",
    address: "123 Main St",
    postalCode: "T2X1A1",
    lat: 51.0447,
    lng: -114.0669,
    hoursToday: "9:00 AM - 5:00 PM",
    accessibilityNotes: "Wheelchair accessible entrance"
  },
  "2": {
    id: "2",
    name: "City Park Pavilion",
    address: "456 Park Ave",
    postalCode: "T2X1A1",
    lat: 51.0450,
    lng: -114.0600,
    hoursToday: "8:00 AM - 8:00 PM",
    accessibilityNotes: "Accessible parking available"
  },
  "3": {
    id: "3",
    name: "Library Meeting Room",
    address: "789 Library Ln",
    postalCode: "T2X1A1",
    lat: 51.0420,
    lng: -114.0650,
    hoursToday: "10:00 AM - 6:00 PM",
    accessibilityNotes: "Elevator access to meeting room"
  }
};

export const mockCategories: Category[] = [
  { id: "1", name: "Fresh Produce", unit: "kg" },
  { id: "2", name: "Canned Goods", unit: "items" },
  { id: "3", name: "Bakery", unit: "items" },
  { id: "4", name: "Dairy", unit: "items" },
  { id: "5", name: "Meat", unit: "kg" }
];

export const mockEvents: Record<string, EventPost> = {
  "1": {
    id: "1",
    creatorId: "1",
    title: "Weekend Food Drive",
    description: "Join us for our weekly food drive to support local families in need",
    items: [
      { categoryId: "1", targetQty: 10 },
      { categoryId: "2", targetQty: 20 },
      { categoryId: "3", targetQty: 15 }
    ],
    timeOptions: ["today_11_13", "today_13_15", "tomorrow_09_11"],
    siteOptions: ["1", "2"],
    visibility: "public",
    rsvpCount: 5,
    rsvps: ["1", "2", "3"],
    distanceKm: 1.2,
    createdAt: new Date().toISOString(),
    status: "open"
  },
  "2": {
    id: "2",
    creatorId: "3",
    title: "Community Food Bank Distribution",
    description: "Monthly distribution event for registered families",
    items: [
      { categoryId: "1", targetQty: 30 },
      { categoryId: "2", targetQty: 50 },
      { categoryId: "4", targetQty: 20 },
      { categoryId: "5", targetQty: 15 }
    ],
    timeOptions: ["today_09_11", "today_11_13", "today_13_15"],
    siteOptions: ["3"],
    visibility: "public",
    rsvpCount: 12,
    rsvps: ["1", "2", "3"],
    distanceKm: 0.8,
    createdAt: new Date().toISOString(),
    status: "open"
  }
};

export const mockPolls: Record<string, PollState> = {
  "1": {
    eventId: "1",
    timeVotes: {
      "today_09_11": 0,
      "today_11_13": 3,
      "today_13_15": 2,
      "today_15_17": 0,
      "today_17_19": 0,
      "tomorrow_09_11": 1,
      "tomorrow_11_13": 0,
      "tomorrow_13_15": 0,
      "tomorrow_15_17": 0,
      "tomorrow_17_19": 0
    },
    siteVotes: {
      "1": 4,
      "2": 2
    },
    voterIds: ["1", "2", "3"]
  },
  "2": {
    eventId: "2",
    timeVotes: {
      "today_09_11": 5,
      "today_11_13": 7,
      "today_13_15": 3,
      "today_15_17": 0,
      "today_17_19": 0,
      "tomorrow_09_11": 0,
      "tomorrow_11_13": 0,
      "tomorrow_13_15": 0,
      "tomorrow_15_17": 0,
      "tomorrow_17_19": 0
    },
    siteVotes: {
      "3": 15
    },
    voterIds: ["1", "2", "3"]
  }
};

export const mockThreads: Thread[] = [
  {
    id: "1",
    type: "group",
    participantIds: ["1", "2", "3"],
    eventId: "1",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2
  },
  {
    id: "2",
    type: "dm",
    participantIds: ["1", "2"],
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0
  }
];

export const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      threadId: "1",
      authorId: "1",
      text: "Hi everyone! Looking forward to tomorrow's event",
      ts: new Date(Date.now() - 7200000).toISOString(),
      readBy: ["1", "2"],
      pinned: true
    },
    {
      id: "2",
      threadId: "1",
      authorId: "2",
      text: "Thanks for organizing this, Alice!",
      ts: new Date(Date.now() - 3600000).toISOString(),
      readBy: ["1", "2"]
    },
    {
      id: "3",
      threadId: "1",
      authorId: "3",
      text: "We've confirmed the site for tomorrow. See you all at 11am!",
      ts: new Date().toISOString(),
      readBy: ["3"]
    }
  ],
  "2": [
    {
      id: "4",
      threadId: "2",
      authorId: "1",
      text: "Thanks for your help yesterday",
      ts: new Date(Date.now() - 3600000).toISOString(),
      readBy: ["1", "2"]
    },
    {
      id: "5",
      threadId: "2",
      authorId: "2",
      text: "No problem! Happy to help",
      ts: new Date().toISOString(),
      readBy: ["2"]
    }
  ]
};

export const mockNotifications: Notification[] = [
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
  }
];

// Export feed data
export const feed = Object.values(mockEvents).map(event => ({
  event,
  creator: mockProfiles[event.creatorId],
  poll: mockPolls[event.id],
  siteOptions: event.siteOptions.map(id => mockSites[id])
}));

export default {
  profiles: mockProfiles,
  sites: mockSites,
  categories: mockCategories,
  events: mockEvents,
  polls: mockPolls,
  threads: mockThreads,
  messages: mockMessages,
  notifications: mockNotifications,
  feed
};