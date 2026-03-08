import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Layers, Navigation, GraduationCap, UtensilsCrossed, Coffee,
  Dumbbell, Music, ShoppingBag, Train, Home, BookOpen, Tag, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import MapView from '@/components/map/MapView';
import PlaceDetailCard from '@/components/map/PlaceDetailCard';
import DiscountFinder from '@/components/map/DiscountFinder';
import { SA_LOCATIONS, CATEGORY_COLORS, CATEGORY_LABELS, MapLocation, LocationCategory } from '@/data/mapLocations';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<LocationCategory, React.ReactNode> = {
  university: <GraduationCap size={14} />,
  food: <UtensilsCrossed size={14} />,
  cafe: <Coffee size={14} />,
  gym: <Dumbbell size={14} />,
  entertainment: <Music size={14} />,
  shopping: <ShoppingBag size={14} />,
  transport: <Train size={14} />,
  accommodation: <Home size={14} />,
  library: <BookOpen size={14} />,
  discount: <Tag size={14} />,
};

const ALL_CATEGORIES: LocationCategory[] = [
  'university', 'food', 'cafe', 'gym', 'entertainment',
  'shopping', 'transport', 'library', 'discount',
];

const Map: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<LocationCategory>>(new Set());
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'dark'>('dark');
  const [selectedPlace, setSelectedPlace] = useState<MapLocation | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCategory = (cat: LocationCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const filteredLocations = useMemo(() => {
    let locs = SA_LOCATIONS;
    if (activeCategories.size > 0) {
      locs = locs.filter(l => activeCategories.has(l.category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      locs = locs.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.tags.some(t => t.includes(q))
      );
    }
    return locs;
  }, [activeCategories, search]);

  const handleMarkerClick = useCallback((loc: MapLocation) => {
    setSelectedPlace(loc);
    setFlyTo([loc.lng, loc.lat]);
  }, []);

  const handleSearchSelect = (loc: MapLocation) => {
    setSelectedPlace(loc);
    setFlyTo([loc.lng, loc.lat]);
    setDrawerOpen(false);
  };

  const cycleMapStyle = () => {
    const styles: Array<'default' | 'satellite' | 'dark'> = ['default', 'satellite', 'dark'];
    const idx = (styles.indexOf(mapStyle) + 1) % 3;
    setMapStyle(styles[idx]);
    toast.success(`Map: ${styles[idx]}`);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        setFlyTo(coords);
        toast.success('Found your location!');
      },
      () => toast.error("Couldn't get your location")
    );
  };

  const handleDiscountSelect = (coords: [number, number]) => {
    setFlyTo([coords[1], coords[0]]);
    setDrawerOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Full-screen map */}
      <MapView
        locations={filteredLocations}
        mapStyle={mapStyle}
        onMarkerClick={handleMarkerClick}
        flyTo={flyTo}
        selectedId={selectedPlace?.id ?? null}
      />

      {/* Top overlay: Search + Filters */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 pb-0 pointer-events-none">
        <div className="max-w-lg mx-auto space-y-2 pointer-events-auto">
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campuses, cafés, deals..."
              className="pl-9 pr-9 bg-card/90 backdrop-blur-xl border-border/50 shadow-lg rounded-xl h-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {ALL_CATEGORIES.map(cat => {
              const active = activeCategories.has(cat);
              const color = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium
                    whitespace-nowrap transition-all shrink-0 border
                    ${active
                      ? 'text-white shadow-md border-transparent'
                      : 'bg-card/85 backdrop-blur-xl text-foreground border-border/40 shadow-sm hover:shadow-md'
                    }
                  `}
                  style={active ? { background: color, borderColor: color } : {}}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating controls — right side */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col gap-2">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg bg-card/90 backdrop-blur-xl border border-border/50"
            onClick={cycleMapStyle}
          >
            <Layers size={16} />
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg bg-card/90 backdrop-blur-xl border border-border/50"
            onClick={handleLocateMe}
          >
            <Navigation size={16} />
          </Button>
        </motion.div>
      </div>

      {/* Place detail card */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailCard
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            userLocation={userLocation}
          />
        )}
      </AnimatePresence>

      {/* Bottom drawer — browse & discounts */}
      <div className="absolute bottom-4 left-0 right-0 z-20 px-3">
        <div className="max-w-lg mx-auto">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="w-full rounded-xl shadow-lg bg-card/90 backdrop-blur-xl border border-border/50 text-foreground hover:bg-card gap-2 h-11"
                variant="ghost"
              >
                <Search size={15} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  Browse {filteredLocations.length} places across South Africa
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[70vh]">
              <div className="p-4 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Places
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => {}}
                  >
                    <Tag size={12} className="mr-1" /> Discounts
                  </Button>
                </div>

                {/* Quick list */}
                <div className="space-y-2">
                  {filteredLocations.slice(0, 20).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleSearchSelect(loc)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: CATEGORY_COLORS[loc.category] }}
                      >
                        <span className="text-white">{CATEGORY_ICONS[loc.category]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{loc.address}</p>
                      </div>
                      {loc.rating && (
                        <span className="text-xs text-muted-foreground shrink-0">★ {loc.rating}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Map;
