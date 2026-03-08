import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data/mapLocations';

interface MapViewProps {
  locations: MapLocation[];
  mapStyle?: 'default' | 'satellite' | 'dark';
  onMarkerClick?: (location: MapLocation) => void;
  flyTo?: [number, number] | null;
  selectedId?: number | null;
  userLocation?: [number, number] | null;
}

const TILE_URLS: Record<string, { url: string; attr: string }> = {
  default: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attr: '© OpenStreetMap',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attr: '© CARTO',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr: '© Esri',
  },
};

const CATEGORY_EMOJI: Record<string, string> = {
  university: '🎓', food: '🍔', cafe: '☕', gym: '💪',
  entertainment: '🎵', shopping: '🛍️', transport: '🚆',
  accommodation: '🏠', library: '📚', discount: '🏷️',
  bar: '🍺', restaurant: '🍽️', fastfood: '🍟', studyspot: '📖',
};

const createMarkerIcon = (loc: MapLocation, isSelected: boolean) => {
  const color = CATEGORY_COLORS[loc.category];
  const emoji = CATEGORY_EMOJI[loc.category] || '📍';
  const size = isSelected ? 40 : 32;
  const fontSize = isSelected ? 16 : 13;
  const ring = isSelected
    ? `box-shadow:0 0 0 3px ${color}44, 0 4px 12px rgba(0,0,0,0.3);`
    : `box-shadow:0 2px 8px rgba(0,0,0,0.25);`;

  return L.divIcon({
    className: 'leaflet-marker-custom',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      border:2.5px solid white;
      display:flex;align-items:center;justify-content:center;
      font-size:${fontSize}px;
      cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
      ${ring}
      ${isSelected ? 'transform:scale(1.1);z-index:9999 !important;' : ''}
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

const MapView: React.FC<MapViewProps> = ({
  locations,
  mapStyle = 'dark',
  onMarkerClick,
  flyTo,
  selectedId,
  userLocation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-29.0, 25.0],
      zoom: 5.5,
      zoomControl: false,
      maxBounds: [[-35.5, 16], [-22, 33]],
      maxBoundsViscosity: 0.8,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tile = TILE_URLS[mapStyle];
    tileRef.current = L.tileLayer(tile.url, {
      attribution: tile.attr,
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Invalidate size after mount for proper rendering
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tiles
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    const tile = TILE_URLS[mapStyle] || TILE_URLS.dark;
    tileRef.current.setUrl(tile.url);
  }, [mapStyle]);

  // Render markers
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;
    group.clearLayers();

    locations.forEach(loc => {
      const isSelected = loc.id === selectedId;
      const icon = createMarkerIcon(loc, isSelected);
      const marker = L.marker([loc.lat, loc.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(group);

      // Tooltip on hover
      const ratingStr = loc.rating ? ` ★ ${loc.rating}` : '';
      marker.bindTooltip(
        `<div style="font-size:12px;font-weight:600;max-width:180px;line-height:1.3">
          ${loc.name}
          <div style="font-size:10px;font-weight:400;opacity:0.8;margin-top:2px">
            ${CATEGORY_LABELS[loc.category]}${ratingStr} · ${loc.address}
          </div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -8],
          className: 'map-tooltip',
        }
      );

      marker.on('click', () => onMarkerClick?.(loc));

      // Hover scale effect
      const el = marker.getElement();
      if (el) {
        el.addEventListener('mouseenter', () => {
          const inner = el.querySelector('div') as HTMLElement;
          if (inner && !isSelected) inner.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          const inner = el.querySelector('div') as HTMLElement;
          if (inner && !isSelected) inner.style.transform = 'scale(1)';
        });
      }
    });
  }, [locations, selectedId, onMarkerClick]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const icon = L.divIcon({
        className: 'leaflet-marker-custom',
        html: `<div style="
          width:20px;height:20px;
          background:hsl(217,91%,60%);
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 0 6px hsla(217,91%,60%,0.25), 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userMarkerRef.current = L.marker([userLocation[1], userLocation[0]], { icon, zIndexOffset: 2000 })
        .addTo(map)
        .bindTooltip('You are here', { direction: 'top', offset: [0, -14] });
    }
  }, [userLocation]);

  // Fly to
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo([flyTo[1], flyTo[0]], 14, { duration: 1.2 });
    }
  }, [flyTo]);

  return (
    <>
      <style>{`
        .leaflet-marker-custom { background: none !important; border: none !important; }
        .map-tooltip {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
        }
        .map-tooltip::before { border-top-color: hsl(var(--card)) !important; }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border-color: hsl(var(--border)) !important;
        }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.6; }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
};

export default MapView;
