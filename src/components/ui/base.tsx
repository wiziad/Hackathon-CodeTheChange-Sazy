"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Menu, MessageCircle, Users, Bell, User, Home, Plus, Grid } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export function MetraLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Metra">
      <circle cx="16" cy="16" r="14" fill="currentColor" className="text-brand-600" />
      <path d="M10 12L16 18L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 18L16 24L22 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Buttons */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; icon?: React.ReactNode; };

export function PrimaryButton({ className, children, ...props }: BtnProps) {
  return (
    <button
      {...props}
      style={{ backgroundColor: "var(--brand)" }}  // fallback green even if CSS classes fail
      className={cn(
        "px-6 py-3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl",
        "transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg shadow-brand-600/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        className
      )}
    >{children}</button>
  );
}

export function SecondaryButton({ className, children, ...props }: BtnProps) {
  return (
    <button {...props}
      className={cn(
        "px-6 py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-xl",
        "transition-all duration-200 transform hover:scale-105 active:scale-95",
        className
      )}
    >{children}</button>
  );
}

export function OutlineButton({ className, children, ...props }: BtnProps) {
  return (
    <button {...props}
      className={cn(
        "px-6 py-3 border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold rounded-xl",
        "transition-all duration-200 transform hover:scale-105 active:scale-95",
        className
      )}
    >{children}</button>
  );
}

export function IconButton({ className, children, icon, active, ...props }: BtnProps) {
  return (
    <button {...props}
      className={cn(
        "px-5 py-3 flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95",
        active ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
               : "bg-brand-50 text-brand-700 hover:bg-brand-100",
        className
      )}
    >
      {icon}{children}
    </button>
  );
}

/* Card */
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "bg-white border border-brand-200 rounded-2xl p-6",
        "shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200",
        className
      )}
      {...rest}
    />
  );
}

/* Input */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode; };
export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400">{icon}</div>}
      <input
        {...props}
        className={cn(
          "w-full py-3 bg-brand-50 border border-brand-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200",
          icon ? "pl-12 pr-4" : "px-4",
          className
        )}
      />
    </div>
  );
}

/* PollOption */
export function PollOption({
  label, votes, total, onClick, selected, className,
}: { label: string; votes: number; total: number; onClick?: () => void; selected?: boolean; className?: string; }) {
  const pct = Math.max(0, Math.min(100, Math.round((votes / Math.max(1, total)) * 100)));
  return (
    <button onClick={onClick} className={cn("w-full mb-3 text-left group", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("font-medium transition-colors duration-200", selected && "text-brand-600")}>{label}</span>
        <span className="text-sm text-brand-500">{votes} votes</span>
      </div>
      <div className="h-3 bg-brand-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500 ease-out", selected ? "bg-brand-700" : "bg-brand-600")} style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}

/* EventCard */
export function EventCard({
  title, description, distance, time, attendees = 0, capacity = 0, items = [],
  rsvpd, onRsvp, onMessage, sponsored, finalized, className,
  actionLabel,
  pendingLabel,
  pending
}: {
  title: string; description?: string; distance?: string; time?: string;
  attendees?: number; capacity?: number; items?: string[]; rsvpd?: boolean;
  onRsvp?: () => void; onMessage?: () => void; sponsored?: boolean; finalized?: boolean; className?: string;
  actionLabel?: string; pendingLabel?: string; pending?: boolean;
}) {
  return (
    <Card className={cn("hover:border-brand-300 transition-all duration-200", className)}>
      <div className="flex items-start justify-between mb-3">
        {sponsored ? (
          <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">Sponsored</span>
        ) : <span />}
        {finalized && (
          <span data-testid="event-finalized-badge" className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">Finalized</span>
        )}
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && <p className="text-brand-700 text-sm mb-4">{description}</p>}

      <div className="flex flex-wrap items-center gap-4 text-sm text-brand-600 mb-4">
        {distance && <span className="flex items-center gap-1"><MapPin size={16} className="text-brand-600" />{distance}</span>}
        {time && <span className="flex items-center gap-1"><Calendar size={16} className="text-brand-600" />{time}</span>}
        {(capacity || attendees) ? <span className="flex items-center gap-1"><Users size={16} className="text-brand-600" />{attendees}/{capacity}</span> : null}
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {items.map((it, i) => (
            <span key={`${it}-${i}`} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">{it}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onRsvp}
          className={cn(
            "flex-1 py-3 rounded-xl font-semibold transition-all duration-200 transform active:scale-95",
            pending ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
          )}
          disabled={pending}
        >
          {pending ? (pendingLabel ?? "Requested - Pending") : (actionLabel ?? "RSVP")}
        </button>
        <button onClick={onMessage}
          className="px-4 py-3 bg-brand-50 hover:bg-brand-100 rounded-xl transition-all duration-200 transform active:scale-95"
          aria-label="Open messages">
          <MessageCircle size={20} className="text-brand-600" />
        </button>
      </div>
    </Card>
  );
}

/* BottomNav */
type TabId = "home" | "notifications" | "profile" | "create" | "my-events" | "dashboard";
export function BottomNav({ activeTab, onTabChange, className }: { activeTab: TabId; onTabChange: (id: TabId) => void; className?: string; }) {
  const router = useRouter();
  const roleFromStore = useAuthStore((s) => s.role);
  const role = roleFromStore || (typeof window !== "undefined" ? (() => {
    try {
      const s = localStorage.getItem("metra_session"); if (!s) return null; const parsed = JSON.parse(s); return parsed.role || parsed.user?.role || null;
    } catch { return null; }
  })() : null);

  const baseTabs: { id: TabId; label: string; icon: React.ReactNode; path?: string }[] = [
    { id: "home", label: "Home", icon: <Home size={20} />, path: "/" },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    { id: "profile", label: "Profile", icon: <Users size={20} />, path: "/profile" },
  ];

  const donorTabs: { id: TabId; label: string; icon: React.ReactNode; path?: string }[] = [
    { id: "create", label: "Create Event", icon: <Plus size={20} />, path: "/donor/event/new" },
    { id: "my-events", label: "My Events", icon: <Calendar size={20} />, path: "/donor/my-events" },
    { id: "dashboard", label: "Donor Dashboard", icon: <Grid size={20} />, path: "/donor" },
  ];

  const tabs = role === "donor" ? [...baseTabs, ...donorTabs] : baseTabs;

  return (
    <div className={cn("bg-white border border-brand-200 rounded-2xl p-2 flex gap-2", className)}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => { onTabChange(t.id); if (t.path) router.push(t.path); }}
          className={cn(
            "flex-1 py-3 flex flex-col items-center gap-1 rounded-xl font-medium transition-all duration-200",
            activeTab === t.id
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
              : "text-brand-600 hover:bg-brand-50"
          )}>
          {t.icon}<span className="text-xs">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* Sticky Header (light only) */
export function StickyHeader({ rightSide }: { rightSide?: React.ReactNode }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => router.push('/')} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="text-brand-600"><MetraLogo /></div>
          <span className="text-xl font-bold">Metra</span>
        </button>
        <div className="flex items-center gap-3">
          {rightSide ?? (
            <>
              <button 
                onClick={() => router.push('/notifications')} 
                className="relative p-2 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95" 
                aria-label="Notifications"
              >
                <Bell size={20} className="text-brand-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
              </button>
              <button 
                onClick={() => router.push('/profile')} 
                className="p-2 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95" 
                aria-label="Profile"
              >
                <User size={20} className="text-brand-600" />
              </button>
              <HamburgerMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function BellDot() {
  return (
    <button className="relative p-2 rounded-xl hover:bg-brand-50 transition-all duration-200 active:scale-95" aria-label="Notifications">
      <Bell size={20} className="text-brand-600" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
    </button>
  );
}

/* Hamburger Menu */
export function HamburgerMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    // Donor-only links will be conditionally added below
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ];

  // Determine role from auth store (client-side)
  const role = useAuthStore((s) => s.role);

  // Insert donor-only items if the user is a donor
  if (role === "donor") {
    // insert after Home (index 0)
    menuItems.splice(1, 0, { label: "Donor Dashboard", path: "/donor" });
    menuItems.splice(2, 0, { label: "My Events", path: "/donor/my-events" });
    menuItems.splice(3, 0, { label: "Create Event", path: "/donor/event/new" });
  }

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-gray-200 transition-all duration-200"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-screen w-64 bg-white border-l shadow-2xl z-50 flex flex-col">
            <div className="h-16 px-4 bg-brand-50 flex-shrink-0 flex items-center justify-between border-b">
              <h2 className="text-lg font-bold text-brand-900">Navigation</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-all"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 bg-white overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-brand-50 hover:bg-gray-200 text-brand-900 font-medium transition-all duration-200 border border-brand-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 bg-brand-50 border-t flex-shrink-0">
              <p className="text-xs text-brand-700 text-center">Metra © 2024</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}