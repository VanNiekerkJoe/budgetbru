import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLocation, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data/mapLocations';

interface MapViewProps {
  locations: MapLocation[];
  mapStyle?: 'default' | 'satellite' | 'dark';
  onMarkerClick?: (location: MapLocation) => void;
  flyTo?: [number, number] | null;
  flyToZoom?: number;
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

const createMarkerHTML = (loc: MapLocation, isSelected: boolean) => {
  const color = CATEGORY_COLORS[loc.category];
  const emoji = CATEGORY_EMOJI[loc.category] || '📍';
  const isUni = loc.category === 'university';

  if (isUni) {
    // University markers: larger, prominent pin shape
    const s = isSelected ? 48 : 42;
    return {
      html: `<div class="uni-marker${isSelected ? ' selected' : ''}" style="--c:${color}">
        <div class="uni-pin">
          <span>${emoji}</span>
        </div>
        <div class="uni-label">${loc.name.match(/\(([^)]+)\)/)?.[1] || loc.name.split(' ')[0]}</div>
      </div>`,
      size: s,
    };
  }

  // POI markers: clean circles with emoji
  const s = isSelected ? 38 : 30;
  return {
    html: `<div class="poi-marker${isSelected ? ' selected' : ''}" style="--c:${color}">
      <span>${emoji}</span>
    </div>`,
    size: s,
  };
};

const MapView: React.FC<MapViewProps> = ({
  locations,
  mapStyle = 'dark',
  onMarkerClick,
  flyTo,
  flyToZoom = 14,
  selectedId,
  userLocation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Init
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-29.0, 25.0],
      zoom: 5.5,
      zoomControl: false,
      maxBounds: [[-36, 15], [-21, 34]],
      maxBoundsViscosity: 0.85,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tile = TILE_URLS[mapStyle];
    tileRef.current = L.tileLayer(tile.url, {
      attribution: tile.attr,
      maxZoom: 18,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Multiple invalidateSize calls to handle various mount timing issues
    map.invalidateSize();
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 500);

    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tiles
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    const tile = TILE_URLS[mapStyle] || TILE_URLS.dark;
    tileRef.current.setUrl(tile.url);
  }, [mapStyle]);

  // Markers
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;
    group.clearLayers();

    locations.forEach(loc => {
      const isSelected = loc.id === selectedId;
      const { html, size } = createMarkerHTML(loc, isSelected);

      const icon = L.divIcon({
        className: 'lm-marker',
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([loc.lat, loc.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : loc.category === 'university' ? 500 : 0,
      }).addTo(group);

      // Tooltip
      const ratingStr = loc.rating ? ` · ★ ${loc.rating}` : '';
      const priceStr = loc.priceLevel ? ` · ${'R'.repeat(loc.priceLevel)}` : '';
      marker.bindTooltip(
        `<strong>${loc.name}</strong><br/>
        <span style="opacity:0.7">${CATEGORY_LABELS[loc.category]}${ratingStr}${priceStr}</span>`,
        {
          direction: 'top',
          offset: [0, -size / 2 + 2],
          className: 'map-tooltip',
        }
      );

      marker.on('click', () => onMarkerClick?.(loc));
    });
  }, [locations, selectedId, onMarkerClick]);

  // User location
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
    if (!userLocation) return;

    const icon = L.divIcon({
      className: 'lm-marker',
      html: `<div class="user-dot"><div class="user-dot-pulse"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    userMarkerRef.current = L.marker([userLocation[1], userLocation[0]], { icon, zIndexOffset: 2000 })
      .addTo(map)
      .bindTooltip('You are here', { direction: 'top', offset: [0, -16], className: 'map-tooltip' });
  }, [userLocation]);

  // Fly to
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo([flyTo[1], flyTo[0]], flyToZoom, { duration: 1.4, easeLinearity: 0.3 });
    }
  }, [flyTo, flyToZoom]);

  return (
    <>
      <style>{`
        /* Reset leaflet marker defaults */
        .lm-marker { background: none !important; border: none !important; }

        /* University pin markers */
        .uni-marker {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          cursor: pointer; transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
        }
        .uni-marker:hover, .uni-marker.selected { transform: scale(1.15); }
        .uni-pin {
          width: 40px; height: 40px; border-radius: 50% 50% 50% 4px;
          background: var(--c); border: 2.5px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; transform: rotate(-45deg);
        }
        .uni-pin span { transform: rotate(45deg); display: block; }
        .uni-marker.selected .uni-pin {
          width: 46px; height: 46px; font-size: 20px;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 30%, transparent);
        }
        .uni-label {
          font-size: 9px; font-weight: 700; color: white;
          background: var(--c); padding: 1px 6px; border-radius: 6px;
          white-space: nowrap; letter-spacing: 0.02em;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          max-width: 70px; overflow: hidden; text-overflow: ellipsis;
        }

        /* POI circle markers */
        .poi-marker {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--c); border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer;
          transition: transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
        }
        .poi-marker:hover { transform: scale(1.25); }
        .poi-marker.selected {
          width: 38px; height: 38px; font-size: 17px;
          transform: scale(1.1);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 35%, transparent), 0 4px 12px rgba(0,0,0,0.3);
        }

        /* User location dot */
        .user-dot {
          width: 16px; height: 16px; border-radius: 50%;
          background: hsl(217, 91%, 60%); border: 3px solid white;
          box-shadow: 0 0 0 5px hsla(217,91%,60%,0.2), 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        }
        .user-dot-pulse {
          position: absolute; inset: -8px; border-radius: 50%;
          background: hsla(217,91%,60%,0.15);
          animation: udp 2s ease-out infinite;
        }
        @keyframes udp {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* Tooltip */
        .map-tooltip {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 12px !important;
          padding: 8px 14px !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important;
        }
        .map-tooltip::before { border-top-color: hsl(var(--card)) !important; }

        /* Leaflet controls */
        .leaflet-control-zoom { border: none !important; overflow: hidden; border-radius: 12px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important; }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          width: 36px !important; height: 36px !important; line-height: 36px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:last-child { border-bottom: none !important; }
        .leaflet-control-zoom a:hover { background: hsl(var(--muted)) !important; }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.5; }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
};

export default MapView;
