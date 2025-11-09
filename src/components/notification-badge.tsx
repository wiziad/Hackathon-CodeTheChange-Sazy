"use client";

import { useState, useEffect } from "react";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = "" }: NotificationBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count === 0) {
    return null;
  }

  return (
    <span 
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center ${
        isAnimating ? "animate-ping" : ""
      } ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}