import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, CATEGORY_COLORS } from '@/data/mapLocations';

interface MapViewProps {
  locations: MapLocation[];
  mapStyle?: 'default' | 'satellite' | 'dark';
  onMarkerClick?: (location: MapLocation) => void;
  flyTo?: [number, number] | null;
  selectedId?: number | null;
}

const TILE_URLS: Record<string, string> = {
  default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

const MapView: React.FC<MapViewProps> = ({
  locations,
  mapStyle = 'dark',
  onMarkerClick,
  flyTo,
  selectedId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-29.0, 25.0],
      zoom: 5,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    tileRef.current = L.tileLayer(TILE_URLS[mapStyle], {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tiles on style change
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(TILE_URLS[mapStyle] || TILE_URLS.dark);
  }, [mapStyle]);

  // Render markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    locations.forEach(loc => {
      const color = CATEGORY_COLORS[loc.category];
      const isSelected = loc.id === selectedId;
      const size = isSelected ? 18 : 12;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width:${size * 2}px;height:${size * 2}px;
            display:flex;align-items:center;justify-content:center;
            transform:translate(-${size}px,-${size}px);
            cursor:pointer;
          ">
            <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="${color}" stroke="white" stroke-width="2.5" opacity="${isSelected ? 1 : 0.9}" />
              ${loc.category === 'university'
                ? '<text x="14" y="18" text-anchor="middle" fill="white" font-size="11" font-weight="bold">U</text>'
                : '<circle cx="14" cy="14" r="3.5" fill="white" opacity="0.9" />'
              }
            </svg>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(markersRef.current!);
      marker.on('click', () => onMarkerClick?.(loc));
    });
  }, [locations, selectedId, onMarkerClick]);

  // Fly to
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo([flyTo[1], flyTo[0]], 14, { duration: 1.5 });
    }
  }, [flyTo]);

  return (
    <>
      <style>{`.custom-marker { background: none !important; border: none !important; }`}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
};

export default MapView;
