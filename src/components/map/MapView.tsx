
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// This is a temporary public token - in a real app, you would store this securely
// and load it from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNscmhtMzZvYjI3OXIya3BlbHBzcWhwc3kifQ.Lxxiuyvv8UYsaXrVX9v6dw';

interface Event {
  id: string;
  title: string;
  lat: number;
  lng: number;
  color: string;
}

interface Person {
  id: string;
  name: string;
  lat: number;
  lng: number;
  avatar?: string;
}

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapBoxToken, setMapBoxToken] = useState<string>(MAPBOX_TOKEN);
  
  // Mock data for events and people
  const events: Event[] = [
    { id: '1', title: 'Budget Workshop', lat: -33.9249, lng: 18.4241, color: '#CA529A' },
    { id: '2', title: 'Finance Meetup', lat: -33.9169, lng: 18.4231, color: '#304575' },
    { id: '3', title: 'Saving Tips Webinar', lat: -33.9209, lng: 18.4301, color: '#106A94' },
  ];
  
  const people: Person[] = [
    { id: '1', name: 'James', lat: -33.9279, lng: 18.4211 },
    { id: '2', name: 'Sarah', lat: -33.9189, lng: 18.4271 },
    { id: '3', name: 'Mike', lat: -33.9149, lng: 18.4191 },
  ];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapBoxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Use dark style
      center: [18.4241, -33.9249], // Cape Town coordinates
      zoom: 13
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('load', () => {
      // Add events to the map
      events.forEach(event => {
        const markerEl = document.createElement('div');
        markerEl.className = 'event-marker';
        markerEl.innerHTML = `
          <div class="bg-[${event.color}] p-2 rounded-full">
            <div class="bg-[${event.color}] p-1 rounded-full animate-pulse-soft">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
        `;
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 class="font-bold">${event.title}</h3>`);
          
        new mapboxgl.Marker(markerEl)
          .setLngLat([event.lng, event.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
      
      // Add people to the map
      people.forEach(person => {
        const markerEl = document.createElement('div');
        markerEl.className = 'person-marker';
        markerEl.innerHTML = `
          <div class="bg-white p-1 rounded-full">
            <div class="bg-[#106A94] p-1 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        `;
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 class="font-bold">${person.name}</h3>`);
          
        new mapboxgl.Marker(markerEl)
          .setLngLat([person.lng, person.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapBoxToken]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapBoxToken(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-220px)] w-full relative rounded-lg overflow-hidden border-4 border-[#03213D] shadow-xl">
      <div className="absolute top-2 left-2 right-2 z-10 bg-[#03213D]/80 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2">
        <div className="flex gap-1 items-center">
          <div className="bg-[#CA529A] p-1 rounded-full">
            <MapPin size={14} className="text-white" />
          </div>
          <span className="text-xs text-white">Events</span>
        </div>
        <div className="flex gap-1 items-center ml-4">
          <div className="bg-[#106A94] p-1 rounded-full">
            <User size={14} className="text-white" />
          </div>
          <span className="text-xs text-white">People</span>
        </div>
      </div>
      
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute bottom-2 left-2 right-2 z-10 bg-[#03213D]/80 backdrop-blur-sm p-2 rounded-lg">
        <input
          type="text"
          className="w-full text-xs bg-transparent border border-white/30 rounded px-2 py-1 text-white"
          placeholder="Enter your Mapbox token (optional)"
          value={mapBoxToken}
          onChange={handleTokenChange}
        />
        <p className="text-xs text-white/70 mt-1">
          For a production app, you would store your Mapbox token securely.
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge className="bg-[#CA529A] hover:bg-[#CA529A]/80">Pink #CA529A</Badge>
          <Badge className="bg-[#03213D] hover:bg-[#03213D]/80">Navy #03213D</Badge>
          <Badge className="bg-[#304575] hover:bg-[#304575]/80">Indigo #304575</Badge>
          <Badge className="bg-[#106A94] hover:bg-[#106A94]/80">Teal #106A94</Badge>
        </div>
      </div>
    </div>
  );
};

export default MapView;
