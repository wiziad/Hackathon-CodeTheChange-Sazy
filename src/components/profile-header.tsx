"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, MapPin, MessageCircle } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  role: string;
  bio?: string;
  rating?: number;
  verified?: boolean;
  postalCode?: string;
  dmAllowed: boolean;
  onMessage: () => void;
  onReport: () => void;
}

export function ProfileHeader({
  name,
  role,
  bio,
  rating,
  verified,
  postalCode,
  dmAllowed,
  onMessage,
  onReport
}: ProfileHeaderProps) {
  const getRoleLabel = () => {
    switch (role) {
      case "donor": return "Food Donor";
      case "receiver": return "Food Receiver";
      case "org": return "Organization";
      default: return role;
    }
  };

  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary"></div>
            {verified && (
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">{name}</h1>
              {verified && (
                <Shield className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-muted-foreground">{getRoleLabel()}</p>
          </div>
          
          {bio && (
            <p className="text-center text-muted-foreground">{bio}</p>
          )}
          
          <div className="flex items-center gap-4">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{rating.toFixed(1)}</span>
              </div>
            )}
            
            {postalCode && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{postalCode}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1" 
              onClick={onMessage}
              disabled={!dmAllowed}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" onClick={onReport}>
              Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}