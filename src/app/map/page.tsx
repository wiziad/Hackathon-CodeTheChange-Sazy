"use client";

import { useState, useRef } from "react";
import { MapView } from "@/components/map-view";
import { Card } from "@/components/ui/base";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapViewRef = useRef<any>(null);

  const handleGetUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          // Fallback to a default location if geolocation fails
          setUserLocation({ lat: 51.0447, lng: -114.0719 }); // Calgary as default
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      // Fallback to a default location if geolocation is not supported
      setUserLocation({ lat: 51.0447, lng: -114.0719 }); // Calgary as default
    }
  };

  const handleRefreshEvents = () => {
    // This will trigger a re-render of the MapView component
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Event Map</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleRefreshEvents}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
            <button 
              onClick={handleGetUserLocation}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Locating..." : "Find My Location"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Find Events Near You</h2>
          <p className="text-muted-foreground mb-4">
            Click the button above to find your location and see events happening nearby.
          </p>
          {userLocation && (
            <p className="text-green-600">
              Location found! Showing events near you on the map.
            </p>
          )}
        </Card>

        <div className="h-[calc(100vh-180px)] rounded-lg overflow-hidden">
          <MapView 
            className="h-full" 
            userLocation={userLocation}
          />
        </div>
      </main>
    </div>
  );
}