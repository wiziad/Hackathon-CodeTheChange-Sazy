"use client";

import { useEffect, useState } from "react";

export default function TestMapPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        console.log('Events data:', data);
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Map Data</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Events ({events.length})</h2>
        {events.map((event: any) => (
          <div key={event.id} className="border p-4 rounded">
            <h3 className="font-bold">{event.title}</h3>
            <p>ID: {event.id}</p>
            <p>Description: {event.description}</p>
            <p>Created: {event.created_at}</p>
            <div className="mt-2">
              <h4 className="font-semibold">Sites:</h4>
              {event.sites && event.sites.length > 0 ? (
                <ul className="list-disc pl-5">
                  {event.sites.map((site: any) => (
                    <li key={site.id}>
                      {site.name} - {site.address}
                      <br />
                      Lat: {site.lat}, Lng: {site.lng}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sites associated</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}