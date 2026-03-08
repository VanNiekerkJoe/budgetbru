import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation, CATEGORY_COLORS, toGeoJSON } from '@/data/mapLocations';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNscmhtMzZvYjI3OXIya3BlbHBzcWhwc3kifQ.Lxxiuyvv8UYsaXrVX9v6dw';

interface MapViewProps {
  locations: MapLocation[];
  mapStyle?: 'default' | 'satellite' | 'dark';
  onMarkerClick?: (location: MapLocation) => void;
  flyTo?: [number, number] | null;
  selectedId?: number | null;
}

const MapView: React.FC<MapViewProps> = ({
  locations,
  mapStyle = 'dark',
  onMarkerClick,
  flyTo,
  selectedId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const getStyleUrl = useCallback(() => {
    switch (mapStyle) {
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'default': return 'mapbox://styles/mapbox/streets-v12';
      default: return 'mapbox://styles/mapbox/dark-v11';
    }
  }, [mapStyle]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: getStyleUrl(),
      center: [25.0, -29.0],
      zoom: 5,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(getStyleUrl());
    }
  }, [getStyleUrl]);

  // Render markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addMarkers = () => {
      // Clear old
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      locations.forEach(loc => {
        const color = CATEGORY_COLORS[loc.category];
        const isSelected = loc.id === selectedId;
        const size = isSelected ? 36 : 28;

        const el = document.createElement('div');
        el.style.cssText = `
          width:${size}px;height:${size}px;cursor:pointer;transition:transform 0.2s;
          display:flex;align-items:center;justify-content:center;
        `;
        el.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="2.5"
              opacity="${isSelected ? 1 : 0.9}" />
            ${loc.category === 'university'
              ? '<text x="14" y="18" text-anchor="middle" fill="white" font-size="12" font-weight="bold">U</text>'
              : `<circle cx="14" cy="14" r="4" fill="white" opacity="0.9" />`
            }
          </svg>
        `;

        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = isSelected ? 'scale(1.15)' : 'scale(1)'; });

        if (isSelected) el.style.transform = 'scale(1.15)';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onMarkerClick?.(loc);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([loc.lng, loc.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once('style.load', addMarkers);
    }
  }, [locations, selectedId, onMarkerClick]);

  // Fly to
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({
        center: [flyTo[0], flyTo[1]],
        zoom: 14,
        essential: true,
        duration: 1500,
      });
    }
  }, [flyTo]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MapView;
