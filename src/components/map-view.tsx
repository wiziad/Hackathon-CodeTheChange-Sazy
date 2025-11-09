"use client";

import { useState, useEffect, useRef } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Hardcoded events with only addresses
const PLACEHOLDER_EVENTS = [
  { id: '2', name: 'Community Kitchen', address: 'Beltline, Calgary, AB, Canada' },
  { id: '3', name: 'Emergency Food Bank', address: 'Bridgeland, Calgary, AB, Canada' },
  { id: '4', name: 'Youth Shelter Meal Service', address: 'Mission District, Calgary, AB, Canada' },
  { id: '5', name: 'Senior Center Lunch Program', address: 'Kensington, Calgary, AB, Canada' },
  { id: '6', name: 'Weekend Soup Kitchen', address: 'Inglewood, Calgary, AB, Canada' },
  { id: '7', name: 'Community Pantry Distribution', address: 'Forest Lawn, Calgary, AB, Canada' },
  { id: '8', name: 'Holiday Food Basket Drive', address: 'Riverside, Calgary, AB, Canada' },
  { id: '9', name: 'Neighbourhood Grocery Assistance', address: 'Acadia, Calgary, AB, Canada' },
  { id: '10', name: 'Local Farmers Market Donation', address: 'Sunalta, Calgary, AB, Canada' },
];

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

  // Geocode hardcoded events
  useEffect(() => {
    const geocodeEvents = async () => {
      try {
        const geocoded = await Promise.all(
          PLACEHOLDER_EVENTS.map(async (event) => {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(event.address)}&apiKey=4d9b9abf044946b59e43d604b5e15812`
            );
            const data = await response.json();
            if (!data.features || data.features.length === 0) return null;

            const [lng, lat] = data.features[0].geometry.coordinates;
            return { ...event, location: { lat, lng } };
          })
        );

        setEventsWithCoordinates(geocoded.filter((e) => e !== null));
      } catch (err) {
        console.error(err);
        setError("Failed to geocode events.");
      }
    };

    geocodeEvents();
  }, []);

  // Add markers when map and events are ready
  useEffect(() => {
    if (!map || eventsWithCoordinates.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    if (userMarker) userMarker.remove();

    const newMarkers = eventsWithCoordinates.map(event => {
      const marker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([event.location.lng, event.location.lat])
        .setPopup(new maplibregl.Popup().setHTML(`
          <h3>${event.name}</h3>
          <p>${event.address}</p>
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
