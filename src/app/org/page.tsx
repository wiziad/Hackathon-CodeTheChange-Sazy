"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyHeader as GlobalStickyHeader } from "@/components/ui/base";
import { AlertTriangle, CheckCircle, Users, Package } from "lucide-react";

interface Site {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  hoursToday: string;
  accessibilityNotes?: string;
  riskLevel: "low" | "medium" | "high";
}

export default function OrgDashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([
    {
      id: "1",
      name: "Community Center",
      address: "123 Main St",
      postalCode: "T2X1A1",
      lat: 51.0447,
      lng: -114.0669,
      hoursToday: "9:00 AM - 5:00 PM",
      accessibilityNotes: "Wheelchair accessible entrance",
      riskLevel: "low"
    },
    {
      id: "2",
      name: "City Park Pavilion",
      address: "456 Park Ave",
      postalCode: "T2X1A1",
      lat: 51.0450,
      lng: -114.0600,
      hoursToday: "8:00 AM - 8:00 PM",
      accessibilityNotes: "Accessible parking available",
      riskLevel: "medium"
    },
    {
      id: "3",
      name: "Library Meeting Room",
      address: "789 Library Ln",
      postalCode: "T2X1A1",
      lat: 51.0420,
      lng: -114.0650,
      hoursToday: "10:00 AM - 6:00 PM",
      accessibilityNotes: "Elevator access to meeting room",
      riskLevel: "high"
    }
  ]);

  const handleCreateBroadcast = () => {
    router.push("/org/broadcast");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <GlobalStickyHeader />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Organization Dashboard</h1>
            <p className="text-muted-foreground">Manage your food distribution sites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Queue Risk</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Medium</div>
                <p className="text-sm text-muted-foreground">2 sites at risk</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span>Shortage Risk</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Low</div>
                <p className="text-sm text-muted-foreground">1 item category low</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span>Active Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <span>Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">48</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Site Overview</CardTitle>
              <CardDescription>Manage your distribution sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sites.map((site) => (
                  <div key={site.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`h-3 w-3 rounded-full mt-1.5 ${
                      site.riskLevel === "low" 
                        ? "bg-green-500" 
                        : site.riskLevel === "medium" 
                          ? "bg-blue-500" 
                          : "bg-red-500"
                      }`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{site.name}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          site.riskLevel === "low" 
                            ? "bg-green-100 text-green-800" 
                            : site.riskLevel === "medium" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {site.riskLevel === "low" 
                            ? "Low risk" 
                            : site.riskLevel === "medium" 
                              ? "Medium risk" 
                              : "High risk"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{site.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {site.hoursToday}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreateBroadcast}>
                Create Broadcast
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}