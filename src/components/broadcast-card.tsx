"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BroadcastCardProps {
  title: string;
  message: string;
  expiresAt: string;
  onDismiss: () => void;
  onTakeAction: () => void;
}

export function BroadcastCard({ 
  title, 
  message, 
  expiresAt, 
  onDismiss, 
  onTakeAction 
}: BroadcastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle className="text-primary">Community Broadcast</CardTitle>
          </div>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Expires: {new Date(expiresAt).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button onClick={onTakeAction}>
            Take Action
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}