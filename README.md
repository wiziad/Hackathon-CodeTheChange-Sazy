# Metra

A front-end only social coordination app for community food donations with three roles: Donor, Receiver, Organization Staff.

## Features

- **Role-based experience**: Donors create events, Receivers browse and RSVP, Organization Staff broadcast needs
- **Familiar UI**: Location-aware feed cards, rich profiles, direct messages, group chats, notifications, and polls
- **Mock APIs**: Fully functional frontend with MSW for API mocking
- **Modern stack**: Next.js App Router with TypeScript, Tailwind CSS, shadcn/ui, Zustand for state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with mock APIs:

```bash
npm run dev:mock
```

Or start without mocks:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions
├── store/               # Zustand global state
├── mocks/               # MSW mock API handlers
├── types/               # TypeScript type definitions
└── messages/            # i18n translations
```

## Key Flows

### Event Creation (Donor)
1. Create Event wizard
2. Step Basics: title, description, items needed
3. Step Time: choose time windows
4. Step Site: pick sites from list or map
5. Step Visibility: Public, Followers, Invite-only
6. Publish event

### Voting and Decision Making
- Users vote on time and site options
- Progress pills show vote counts
- When threshold reached, mock LLM decides final options
- Event locks to winning options

### RSVP and Chat
- RSVP reveals attendee list
- Opens event group chat
- Real-time messaging with unread badges

## Mock Mode

The app uses MSW (Mock Service Worker) to simulate API calls. To enable mock mode:

```bash
NEXT_PUBLIC_MOCK=1 npm run dev
```

Or use the convenience script:

```bash
npm run dev:mock
```

## Tech Stack

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **API Mocking**: MSW (Mock Service Worker)
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Maps**: Leaflet with OpenStreetMap
- **Fonts**: Inter (body), Space Grotesk (headings)
- **Animations**: Framer Motion

## Design System

- **Light theme**: White background, green accents
- **Dark theme**: Black background, green accents
- **Brand green**: #008542
- **Border radius**: 12px (rounded-xl)
- **Focus states**: Visible focus rings for accessibility

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:mock` - Start development server with mock APIs
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [MSW Documentation](https://mswjs.io/docs/)

## Deployment

The app can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or AWS.

```bash
npm run build
```