"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/ui/base";

export default function NavigationWrapper() {
  const pathname = usePathname();
  
  // Don't show bottom nav on landing page, auth, onboarding, etc.
  const hideNav = pathname === "/" || pathname === "/auth" || pathname === "/onboarding";

  if (hideNav) {
    return null;
  }

  // Determine active tab based on current path
  let activeTab: any = "home";
  if (pathname === "/notifications") {
    activeTab = "notifications";
  } else if (pathname === "/map") {
    activeTab = "map";
  } else if (pathname === "/profile") {
    activeTab = "profile";
  } else if (pathname === "/donor/event/new") {
    activeTab = "create";
  } else if (pathname === "/donor/my-events") {
    activeTab = "my-events";
  } else if (pathname === "/donor") {
    activeTab = "dashboard";
  }

  return (
    <BottomNav 
      activeTab={activeTab} 
      onTabChange={(tab) => {
        // In a real app, this would navigate to the appropriate page
        console.log(`Navigate to ${tab}`);
      }} 
    />
  );
}