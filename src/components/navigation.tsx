"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { 
  Home, 
  User, 
  Bell,
  Map,
  Menu,
  X,
  Plus,
  Calendar,
  Grid
} from "lucide-react";

type NavItem = { href: string; label: string; icon: any };

function buildNavItems(role: string | null): NavItem[] {
  // Receiver: only Home, Notifications, Profile
  // Donor: Home, Notifications, Profile + Create Event, My Events, Donor Dashboard
  const base = [
    { href: "/", label: "Home", icon: Home },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/map", label: "Map", icon: Map },
    { href: "/profile", label: "Profile", icon: User },
  ];

  if (role === "donor") {
    return [
      ...base,
      { href: "/donor/event/new", label: "Create Event", icon: Plus },
      { href: "/donor/my-events", label: "My Events", icon: Calendar },
      { href: "/donor", label: "Donor Dashboard", icon: Grid },
    ];
  }

  return base;
}

export function Navigation() {
  const pathname = usePathname();
  const roleFromStore = useAuthStore((s) => s.role);
  // If the store doesn't have the role (e.g., page refresh), fall back to localStorage session
  const role = roleFromStore || (typeof window !== "undefined" ? (() => {
    try {
      const s = localStorage.getItem("metra_session");
      if (!s) return null;
      const parsed = JSON.parse(s);
      return parsed.role || parsed.user?.role || null;
    } catch {
      return null;
    }
  })() : null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = buildNavItems(role);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item: NavItem) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full w-full ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <span className="text-xl font-bold">Metra</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item: NavItem) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 w-full p-2 rounded-lg ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="p-4 pt-16">
            <ul className="space-y-4">
              {navItems.map((item: NavItem) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}