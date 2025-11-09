"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock } from "lucide-react";
import { PollChips } from "@/components/poll-chips";
import { RsvpBar } from "@/components/rsvp-bar";
import { useRequireAuth } from "@/lib/requireAuth";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  distanceKm?: number;
  timeOptions: Array<{ id: string; label: string; votes: number }>;
  siteOptions: Array<{ id: string; label: string; votes: number }>;
  rsvpCount: number;
  isRsvped: boolean;
  onRsvp: () => void;
  onVote: (type: "time" | "site", optionId: string) => void;
  onViewDetails: () => void;
  votedTimeId?: string;
  votedSiteId?: string;
  attendees: Array<{ id: string; name: string }>;
}

export function EventCard({
  id,
  title,
  description,
  creatorName,
  distanceKm,
  timeOptions,
  siteOptions,
  rsvpCount,
  isRsvped,
  onRsvp,
  onVote,
  onViewDetails,
  votedTimeId,
  votedSiteId,
  attendees
}: EventCardProps) {
  const requireAuth = useRequireAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>by {creatorName}</CardDescription>
            </div>
            {distanceKm && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{distanceKm.toFixed(1)} km</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-2">Time Options</h3>
              <PollChips 
                options={timeOptions} 
                onVote={(optionId) => requireAuth(() => onVote("time", optionId))}
                votedOptionId={votedTimeId}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Site Options</h3>
              <PollChips 
                options={siteOptions} 
                onVote={(optionId) => requireAuth(() => onVote("site", optionId))}
                votedOptionId={votedSiteId}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <RsvpBar 
            rsvpCount={rsvpCount}
            isRsvped={isRsvped}
            onRsvp={() => requireAuth(onRsvp)}
            attendees={attendees}
          />
          <Button className="w-full" onClick={onViewDetails}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}