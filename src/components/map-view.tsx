"use client";

import { useState, useEffect, useRef } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  className?: string;
}

export function MapView({ className = "" }: MapViewProps) {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [eventsWithCoordinates, setEventsWithCoordinates] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: containerRef.current,
      style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=4d9b9abf044946b59e43d604b5e15812`,
      center: [-114.0719, 51.0447], // Default center
      zoom: 10
    });

    setMap(mapInstance);
    return () => mapInstance.remove();
  }, [containerRef.current]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Extract events with site information
        const eventsWithSites = (data.events || [])
          .filter((event: any) => event.sites && event.sites.length > 0)
          .map((event: any) => {
            const site = event.sites[0]; // Use the first site
            return {
              id: event.id,
              name: event.title,
              description: event.description,
              site: {
                name: site.name,
                address: site.address,
                lat: site.lat,
                lng: site.lng
              }
            };
          })
          .filter((event: any) => event.site.lat && event.site.lng); // Only events with valid coordinates

        setEventsWithCoordinates(eventsWithSites);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  // Add markers when map and events are ready
  useEffect(() => {
    if (!map || eventsWithCoordinates.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    if (userMarker) userMarker.remove();

    const newMarkers = eventsWithCoordinates.map(event => {
      const marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([event.site.lng, event.site.lat])
        .setPopup(new maplibregl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${event.name}</h3>
            <p>${event.site.name}</p>
            <p>${event.site.address}</p>
            ${event.description ? `<p class="mt-2 text-sm">${event.description}</p>` : ''}
          </div>
        `))
        .addTo(map);
      return marker;
    });

    setMarkers(newMarkers);
  }, [map, eventsWithCoordinates]);

  // Handle user postal code search
  const handleLocationSelect = async (location: any) => {
    if (!map || !location) return;

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location.properties.formatted)}&apiKey=4d9b9abf044946b59e43d604b5e15812`
      );
      if (!response.ok) throw new Error('Geocoding failed');

      const data = await response.json();
      if (data.features.length === 0) throw new Error('Location not found');

      const [lng, lat] = data.features[0].geometry.coordinates;

      // Remove existing user marker
      if (userMarker) userMarker.remove();

      // Add new user marker
      const newUserMarker = new maplibregl.Marker({ color: "#0000FF" })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML('Your Location'))
        .addTo(map);

      setUserMarker(newUserMarker);
      map.flyTo({ center: [lng, lat], zoom: 12 });
      setError("");
    } catch (err) {
      setError("Failed to find location. Please try again.");
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden flex flex-col ${className}`}>
      <div className="p-4 bg-white">
        <GeoapifyContext apiKey="4d9b9abf044946b59e43d604b5e15812">
          <GeoapifyGeocoderAutocomplete
            placeholder="Enter your address or postal code"
            placeSelect={handleLocationSelect}
          />
        </GeoapifyContext>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div ref={containerRef} className="w-full flex-grow" />
    </div>
  );
}