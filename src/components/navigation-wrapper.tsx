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

  return (
    <BottomNav 
      activeTab="feed" 
      onTabChange={(tab) => {
        // In a real app, this would navigate to the appropriate page
        console.log(`Navigate to ${tab}`);
      }} 
    />
  );
}