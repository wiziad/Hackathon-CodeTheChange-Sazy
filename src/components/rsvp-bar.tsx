"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface RsvpBarProps {
  rsvpCount: number;
  isRsvped: boolean;
  onRsvp: () => void;
  attendees: Array<{
    id: string;
    name: string;
  }>;
}

export function RsvpBar({ rsvpCount, isRsvped, onRsvp, attendees }: RsvpBarProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {attendees.slice(0, 3).map((attendee) => (
            <div 
              key={attendee.id} 
              className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
            >
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          ))}
          {rsvpCount > 3 && (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
              +{rsvpCount - 3}
            </div>
          )}
        </div>
        <span className="text-sm">
          {rsvpCount} {rsvpCount === 1 ? "person" : "people"} going
        </span>
      </div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant={isRsvped ? "default" : "outline"} 
          size="sm"
          onClick={onRsvp}
        >
          {isRsvped ? "RSVP'd" : "RSVP"}
        </Button>
      </motion.div>
    </div>
  );
}