
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, User, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// This is a temporary public token - in a real app, you would store this securely
// and load it from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNscmhtMzZvYjI3OXIya3BlbHBzcWhwc3kifQ.Lxxiuyvv8UYsaXrVX9v6dw';

export interface EventMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'social' | 'academic' | 'sport' | 'food';
  date?: string;
  description?: string;
}

interface MapViewProps {
  compact?: boolean;
  mapStyle?: 'default' | 'satellite' | 'dark';
  markers?: EventMarker[];
  onMarkerClick?: (event: EventMarker) => void;
  selectedLocation?: [number, number];
}

const MapView: React.FC<MapViewProps> = ({ 
  compact = false, 
  mapStyle = 'dark',
  markers = [],
  onMarkerClick,
  selectedLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapBoxToken, setMapBoxToken] = useState<string>(MAPBOX_TOKEN);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Find user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true
            });
            
            // Add a marker for the user's location
            const userMarkerEl = document.createElement('div');
            userMarkerEl.className = 'user-location-marker';
            userMarkerEl.innerHTML = `
              <div class="bg-blue-500 p-2 rounded-full shadow-lg pulse-animation">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
            `;
            
            new mapboxgl.Marker(userMarkerEl)
              .setLngLat([longitude, latitude])
              .addTo(map.current);
              
            toast.success("Found your location!");
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast.error("Couldn't access your location");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapBoxToken;
    
    // Use the mapStyle prop to determine the style
    let mapboxStyle = 'mapbox://styles/mapbox/dark-v11';
    if (mapStyle === 'satellite') {
      mapboxStyle = 'mapbox://styles/mapbox/satellite-streets-v12';
    } else if (mapStyle === 'default') {
      mapboxStyle = 'mapbox://styles/mapbox/streets-v12';
    }
    
    // Use selected location if provided, otherwise default to Cape Town
    // Using proper LngLat formatting for Mapbox GL
    const initialCenter: mapboxgl.LngLatLike = selectedLocation ? 
      [selectedLocation[1], selectedLocation[0]] as [number, number] : 
      [18.4241, -33.9249] as [number, number];
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapboxStyle,
        center: initialCenter,
        zoom: compact ? 11.5 : 13,
        interactive: !compact
      });
      
      // Only add navigation controls if not compact
      if (!compact) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
      }
      
      // Add a marker for the selected location if provided
      if (selectedLocation) {
        const markerEl = document.createElement('div');
        markerEl.className = 'selected-location-marker';
        markerEl.innerHTML = `
          <div class="bg-theme-pink p-2 rounded-full shadow-lg pulse-animation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `;
        
        new mapboxgl.Marker(markerEl)
          .setLngLat([selectedLocation[1], selectedLocation[0]] as [number, number])
          .addTo(map.current);
      }
      
      map.current.on('load', () => {
        // Check if we have markers from props
        if (markers && markers.length > 0) {
          markers.forEach(marker => {
            const markerEl = document.createElement('div');
            markerEl.className = 'event-marker';
            
            // Determine color based on marker type
            let color = '#CA529A';
            switch(marker.type) {
              case 'social': color = '#9b87f5'; break;
              case 'academic': color = '#33C3F0'; break;
              case 'sport': color = '#4BC0C0'; break;
              case 'food': color = '#FF9F40'; break;
            }
            
            markerEl.innerHTML = `
              <div class="bg-[${color}] p-2 rounded-full shadow-lg animate-pulse-soft">
                <svg width="${compact ? '12' : '24'}" height="${compact ? '12' : '24'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            `;
            
            if (!compact && onMarkerClick) {
              const el = new mapboxgl.Marker(markerEl)
                .setLngLat([marker.lng, marker.lat])
                .addTo(map.current!);
                
              // Add click event listener
              markerEl.addEventListener('click', () => {
                onMarkerClick(marker);
              });
            } else {
              new mapboxgl.Marker(markerEl)
                .setLngLat([marker.lng, marker.lat])
                .addTo(map.current!);
            }
          });
        } else {
          // Use default locations if no markers provided
          const defaultLocations = [
            { id: 1, name: 'University Main Campus', lat: -33.9249, lng: 18.4241, type: 'academic' as const },
            { id: 2, name: 'Student Center', lat: -33.9269, lng: 18.4261, type: 'social' as const },
            { id: 3, name: 'Library', lat: -33.9239, lng: 18.4221, type: 'academic' as const },
            { id: 4, name: 'Sports Complex', lat: -33.9279, lng: 18.4201, type: 'sport' as const },
            { id: 5, name: 'Student Cafeteria', lat: -33.9259, lng: 18.4281, type: 'food' as const },
          ];
          
          defaultLocations.forEach(location => {
            const markerEl = document.createElement('div');
            markerEl.className = 'location-marker';
            
            // Determine color based on location type
            let color = '#CA529A';
            switch(location.type) {
              case 'social': color = '#9b87f5'; break;
              case 'academic': color = '#33C3F0'; break;
              case 'sport': color = '#4BC0C0'; break;
              case 'food': color = '#FF9F40'; break;
            }
            
            markerEl.innerHTML = `
              <div class="bg-[${color}] p-2 rounded-full shadow-lg">
                <svg width="${compact ? '12' : '24'}" height="${compact ? '12' : '24'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            `;
            
            if (!compact) {
              const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-bold">${location.name}</h3>
                    <p class="text-xs mt-1">${location.type}</p>
                  </div>
                `);
                
              new mapboxgl.Marker(markerEl)
                .setLngLat([location.lng, location.lat])
                .setPopup(popup)
                .addTo(map.current!);
            } else {
              new mapboxgl.Marker(markerEl)
                .setLngLat([location.lng, location.lat])
                .addTo(map.current!);
            }
          });
        }
        
        setLoading(false);
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.innerHTML = `
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
          }
        `;
        document.head.appendChild(style);
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Error loading map. Please check your Mapbox token.');
      setLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapBoxToken, compact, mapStyle, markers, onMarkerClick, selectedLocation]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapBoxToken(e.target.value);
  };

  return (
    <div className={`${compact ? 'h-full' : 'h-[calc(100vh-220px)]'} w-full relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-theme-pink border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
            <p className="text-white font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      {!compact && (
        <motion.div 
          className="absolute bottom-4 right-4 z-10 flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={getUserLocation}
            disabled={loading}
          >
            <Navigation size={16} className="mr-2" />
            Find My Location
          </Button>
        </motion.div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {!compact && (
        <motion.div 
          className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-medium mb-1">Mapbox Token (for testing)</p>
          <input
            type="text"
            className="w-full text-xs bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
            placeholder="Enter your Mapbox token"
            value={mapBoxToken}
            onChange={handleTokenChange}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MapView;
