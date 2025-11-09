import { http, HttpResponse } from 'msw';
import { Profile, Role, Site, EventPost, PollState, ChatMessage, Thread, Notification, Category, TimeWindowId } from '@/types';

// Mock data
const mockProfiles: Record<string, Profile> = {
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

const mockSites: Record<string, Site> = {
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

const mockCategories: Category[] = [
  { id: "1", name: "Fresh Produce", unit: "kg" },
  { id: "2", name: "Canned Goods", unit: "items" },
  { id: "3", name: "Bakery", unit: "items" },
  { id: "4", name: "Dairy", unit: "items" },
  { id: "5", name: "Meat", unit: "kg" }
];

const mockEvents: Record<string, EventPost> = {
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

const mockPolls: Record<string, PollState> = {
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

const mockThreads: Thread[] = [
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

const mockMessages: Record<string, ChatMessage[]> = {
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
  }
];

// Auth handlers
export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = await request.json() as { email: string };
    
    // Find or create user
    const userId = Object.keys(mockProfiles).find(id => 
      mockProfiles[id].name.toLowerCase() === email.split('@')[0].toLowerCase()
    ) || "1";
    
    const user = mockProfiles[userId];
    const role = user.role;
    
    return HttpResponse.json({ user, role, token: "mock" });
  }),
  
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ ok: true });
  })
];

// Feed handlers
export const feedHandlers = [
  http.get('/api/feed', ({ request }) => {
    const url = new URL(request.url);
    const postal = url.searchParams.get('postal') || 'T2X1A1';
    const cursor = url.searchParams.get('cursor') || null;
    
    // Filter events by postal code
    const events = Object.values(mockEvents).filter(event => {
      const creator = mockProfiles[event.creatorId];
      return creator.postalCode === postal;
    });
    
    // Map to feed items
    const items = events.map(event => ({
      event,
      creator: mockProfiles[event.creatorId],
      poll: mockPolls[event.id],
      siteOptions: event.siteOptions.map(id => mockSites[id])
    }));
    
    return HttpResponse.json({ items, nextCursor: null });
  }),
  
  http.get('/api/explore', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || '';
    const distanceKm = Number(url.searchParams.get('distanceKm')) || 10;
    
    // Filter events by category and distance
    const events = Object.values(mockEvents).filter(event => {
      // For demo purposes, we'll just return all events
      return true;
    });
    
    // Map to feed items
    const items = events.map(event => ({
      event,
      creator: mockProfiles[event.creatorId],
      poll: mockPolls[event.id],
      siteOptions: event.siteOptions.map(id => mockSites[id])
    }));
    
    return HttpResponse.json({ items, nextCursor: null });
  })
];

// Event handlers
export const eventHandlers = [
  http.post('/api/event', async ({ request }) => {
    const eventData = await request.json() as Partial<EventPost>;
    
    // Create new event
    const newEvent: EventPost = {
      id: (Object.keys(mockEvents).length + 1).toString(),
      creatorId: "1", // For demo purposes
      title: eventData.title || "New Event",
      description: eventData.description,
      items: eventData.items || [],
      timeOptions: eventData.timeOptions || [],
      siteOptions: eventData.siteOptions || [],
      visibility: eventData.visibility || "public",
      rsvpCount: 0,
      rsvps: [],
      createdAt: new Date().toISOString(),
      status: "open"
    };
    
    mockEvents[newEvent.id] = newEvent;
    
    // Create initial poll state
    mockPolls[newEvent.id] = {
      eventId: newEvent.id,
      timeVotes: {
        "today_09_11": 0,
        "today_11_13": 0,
        "today_13_15": 0,
        "today_15_17": 0,
        "today_17_19": 0,
        "tomorrow_09_11": 0,
        "tomorrow_11_13": 0,
        "tomorrow_13_15": 0,
        "tomorrow_15_17": 0,
        "tomorrow_17_19": 0
      },
      siteVotes: {},
      voterIds: []
    };
    
    return HttpResponse.json({ event: newEvent });
  }),
  
  http.get('/api/event/:eventId', ({ params }) => {
    const { eventId } = params;
    const event = mockEvents[eventId as string];
    
    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json({
      event,
      creator: mockProfiles[event.creatorId],
      poll: mockPolls[event.id],
      siteOptions: event.siteOptions.map(id => mockSites[id]),
      attendees: event.rsvps.map(id => mockProfiles[id])
    });
  }),
  
  http.post('/api/event/:eventId/vote', async ({ params, request }) => {
    const { eventId } = params;
    const { time, siteId } = await request.json() as { time?: TimeWindowId; siteId?: string };
    
    const poll = mockPolls[eventId as string];
    if (!poll) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Update votes
    if (time) {
      poll.timeVotes[time] = (poll.timeVotes[time] || 0) + 1;
    }
    
    if (siteId) {
      poll.siteVotes[siteId] = (poll.siteVotes[siteId] || 0) + 1;
    }
    
    // Add voter (in real app, we'd check if they've already voted)
    poll.voterIds.push("mock-voter");
    
    return HttpResponse.json({ poll });
  }),
  
  http.post('/api/llm/decide', async ({ request }) => {
    const { eventId } = await request.json() as { eventId: string };
    
    // Mock LLM decision - just pick the option with most votes
    const poll = mockPolls[eventId];
    if (!poll) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Find time with most votes
    let finalTime: TimeWindowId = "today_11_13"; // default
    let maxTimeVotes = 0;
    for (const [time, votes] of Object.entries(poll.timeVotes)) {
      if (votes > maxTimeVotes) {
        maxTimeVotes = votes;
        finalTime = time as TimeWindowId;
      }
    }
    
    // Find site with most votes
    let finalSiteId = "";
    let maxSiteVotes = 0;
    for (const [siteId, votes] of Object.entries(poll.siteVotes)) {
      if (votes > maxSiteVotes) {
        maxSiteVotes = votes;
        finalSiteId = siteId;
      }
    }
    
    // Update event
    const event = mockEvents[eventId];
    if (event) {
      event.finalTime = finalTime;
      event.finalSiteId = finalSiteId;
      event.status = "finalized";
    }
    
    return HttpResponse.json({ finalTime, finalSiteId, note: "Mock LLM decision" });
  }),
  
  http.post('/api/event/:eventId/rsvp', ({ params }) => {
    const { eventId } = params;
    const event = mockEvents[eventId as string];
    
    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Add RSVP (in real app, we'd check if user is already RSVP'd)
    event.rsvps.push("mock-user");
    event.rsvpCount = event.rsvps.length;
    
    return HttpResponse.json({
      event,
      attendees: event.rsvps.map(id => mockProfiles[id])
    });
  })
];

// Chat handlers
export const chatHandlers = [
  http.get('/api/messages', () => {
    return HttpResponse.json(mockThreads);
  }),
  
  http.get('/api/messages/:threadId', ({ params }) => {
    const { threadId } = params;
    const thread = mockThreads.find(t => t.id === threadId);
    
    if (!thread) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json({
      thread,
      messages: mockMessages[threadId as string] || [],
      participants: thread.participantIds.map(id => mockProfiles[id])
    });
  }),
  
  http.post('/api/messages/:threadId', async ({ params, request }) => {
    const { threadId } = params;
    const { text } = await request.json() as { text: string };
    
    const newMessage: ChatMessage = {
      id: (Object.keys(mockMessages).length + 1).toString(),
      threadId: threadId as string,
      authorId: "mock-user", // In real app, this would be the actual user ID
      text,
      ts: new Date().toISOString(),
      readBy: ["mock-user"]
    };
    
    // Add message to thread
    if (!mockMessages[threadId as string]) {
      mockMessages[threadId as string] = [];
    }
    mockMessages[threadId as string].push(newMessage);
    
    return HttpResponse.json({ message: newMessage });
  })
];

// Notification handlers
export const notificationHandlers = [
  http.get('/api/notifications', () => {
    return HttpResponse.json(mockNotifications);
  }),
  
  http.post('/api/notifications/read', async ({ request }) => {
    const { ids } = await request.json() as { ids: string[] };
    
    // Mark notifications as read
    mockNotifications.forEach(notification => {
      if (ids.includes(notification.id)) {
        notification.read = true;
      }
    });
    
    return HttpResponse.json({ ok: true });
  })
];

// Profile handlers
export const profileHandlers = [
  http.get('/api/profile/:id', ({ params }) => {
    const { id } = params;
    const profile = mockProfiles[id as string];
    
    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(profile);
  }),
  
  http.post('/api/profile', async ({ request }) => {
    const profileData = await request.json() as Partial<Profile>;
    
    // Update profile (in real app, we'd have proper ID handling)
    const profileId = profileData.id || "1";
    const existingProfile = mockProfiles[profileId] || {
      id: profileId,
      name: "",
      role: "receiver",
      visibility: "public",
      dmAllowed: true
    };
    
    const updatedProfile = { ...existingProfile, ...profileData };
    mockProfiles[profileId] = updatedProfile as Profile;
    
    return HttpResponse.json(updatedProfile);
  })
];

// Safety handlers
export const safetyHandlers = [
  http.post('/api/report', async ({ request }) => {
    const { targetType, targetId, reason } = await request.json() as { 
      targetType: "user" | "event" | "message"; 
      targetId: string; 
      reason: string 
    };
    
    // Log report (in real app, this would go to a moderation system)
    console.log(`Report received: ${targetType} ${targetId} for ${reason}`);
    
    return HttpResponse.json({ ok: true });
  })
];

// Org broadcast handlers
export const orgHandlers = [
  http.post('/api/org/broadcast', async ({ request }) => {
    const { siteId, message, expiresAt } = await request.json() as { 
      siteId?: string; 
      message: string; 
      expiresAt: string 
    };
    
    // Create broadcast notification
    const newNotification: Notification = {
      id: (mockNotifications.length + 1).toString(),
      type: "broadcast",
      title: "Community Broadcast",
      body: message,
      eventId: siteId,
      actorId: "3", // Org user
      createdAt: new Date().toISOString(),
      read: false
    };
    
    mockNotifications.push(newNotification);
    
    return HttpResponse.json({ ok: true });
  })
];

// Export all handlers
export const handlers = [
  ...authHandlers,
  ...feedHandlers,
  ...eventHandlers,
  ...chatHandlers,
  ...notificationHandlers,
  ...profileHandlers,
  ...safetyHandlers,
  ...orgHandlers
];