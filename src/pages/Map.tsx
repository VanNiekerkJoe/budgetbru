import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Layers, GraduationCap, UtensilsCrossed, Coffee,
  Dumbbell, Music, ShoppingBag, Train, Home, BookOpen, Tag, X,
  MapPin, ChevronUp, Star, ArrowUpDown, LocateFixed, Beer,
  ChefHat, Zap, ArrowLeft, Sandwich,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MapView from '@/components/map/MapView';
import PlaceDetailCard from '@/components/map/PlaceDetailCard';
import DiscountFinder from '@/components/map/DiscountFinder';
import {
  SA_LOCATIONS, CATEGORY_COLORS, CATEGORY_LABELS, MapLocation, LocationCategory,
  getPOIsForCampus, getUniversity,
} from '@/data/mapLocations';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<LocationCategory, React.ReactNode> = {
  university: <GraduationCap size={13} />,
  food: <UtensilsCrossed size={13} />,
  cafe: <Coffee size={13} />,
  gym: <Dumbbell size={13} />,
  entertainment: <Music size={13} />,
  shopping: <ShoppingBag size={13} />,
  transport: <Train size={13} />,
  accommodation: <Home size={13} />,
  library: <BookOpen size={13} />,
  discount: <Tag size={13} />,
  bar: <Beer size={13} />,
  restaurant: <ChefHat size={13} />,
  fastfood: <Sandwich size={13} />,
  studyspot: <BookOpen size={13} />,
};

// Categories shown on national view
const NATIONAL_CATEGORIES: LocationCategory[] = [
  'university', 'food', 'cafe', 'gym', 'entertainment',
  'shopping', 'transport', 'library', 'discount',
];

// Categories shown when zoomed into a campus
const CAMPUS_CATEGORIES: LocationCategory[] = [
  'bar', 'restaurant', 'fastfood', 'cafe', 'studyspot',
  'gym', 'entertainment', 'shopping', 'transport', 'discount',
];

const MAP_STYLE_LABELS: Record<string, string> = {
  dark: '🌙 Dark',
  default: '🗺️ Street',
  satellite: '🛰️ Satellite',
};

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const Map: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<LocationCategory>>(new Set());
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'dark'>('dark');
  const [selectedPlace, setSelectedPlace] = useState<MapLocation | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [flyToZoom, setFlyToZoom] = useState(14);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [locating, setLocating] = useState(false);

  // Campus focus state — when a university is selected, zoom in and show its POIs
  const [focusedCampusId, setFocusedCampusId] = useState<number | null>(null);
  const focusedUniversity = focusedCampusId ? getUniversity(focusedCampusId) : null;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.longitude, pos.coords.latitude]),
        () => {}
      );
    }
  }, []);

  const toggleCategory = (cat: LocationCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
    setSelectedPlace(null);
  };

  const clearFilters = () => {
    setActiveCategories(new Set());
    setSearch('');
    setSelectedPlace(null);
  };

  // When focused on a campus, show that university + its POIs; otherwise show all
  const baseLocations = useMemo(() => {
    if (focusedCampusId) {
      const uni = getUniversity(focusedCampusId);
      const pois = getPOIsForCampus(focusedCampusId);
      return uni ? [uni, ...pois] : pois;
    }
    return SA_LOCATIONS;
  }, [focusedCampusId]);

  const filteredLocations = useMemo(() => {
    let locs = baseLocations;
    if (activeCategories.size > 0) {
      locs = locs.filter(l => activeCategories.has(l.category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      locs = locs.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.tags.some(t => t.includes(q)) ||
        l.category.includes(q)
      );
    }
    return locs;
  }, [baseLocations, activeCategories, search]);

  const sortedLocations = useMemo(() => {
    if (!sortByDistance || !userLocation) return filteredLocations;
    return [...filteredLocations].sort((a, b) => {
      const distA = haversineDistance(userLocation[1], userLocation[0], a.lat, a.lng);
      const distB = haversineDistance(userLocation[1], userLocation[0], b.lat, b.lng);
      return distA - distB;
    });
  }, [filteredLocations, sortByDistance, userLocation]);

  const getDistanceStr = (loc: MapLocation) => {
    if (!userLocation) return null;
    const d = haversineDistance(userLocation[1], userLocation[0], loc.lat, loc.lng);
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(0)}km`;
  };

  const currentCategories = focusedCampusId ? CAMPUS_CATEGORIES : NATIONAL_CATEGORIES;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    baseLocations.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1; });
    return counts;
  }, [baseLocations]);

  const handleMarkerClick = useCallback((loc: MapLocation) => {
    if (loc.category === 'university' && !focusedCampusId) {
      setFocusedCampusId(loc.id);
      setFlyToZoom(15);
      setFlyTo([loc.lng, loc.lat]);
      setSelectedPlace(null);
      setActiveCategories(new Set());
      setSearch('');
      toast.success(`Exploring ${loc.name}`, { description: 'Showing nearby bars, restaurants & more' });
      return;
    }
    setSelectedPlace(loc);
    setFlyToZoom(16);
    setFlyTo([loc.lng, loc.lat]);
  }, [focusedCampusId]);

  const handleSearchSelect = (loc: MapLocation) => {
    if (loc.category === 'university' && !focusedCampusId) {
      setFocusedCampusId(loc.id);
      setFlyTo([loc.lng, loc.lat]);
      setSelectedPlace(null);
    } else {
      setSelectedPlace(loc);
      setFlyTo([loc.lng, loc.lat]);
    }
    setDrawerOpen(false);
    setShowSearchResults(false);
  };

  const handleBackToNational = () => {
    setFocusedCampusId(null);
    setSelectedPlace(null);
    setActiveCategories(new Set());
    setSearch('');
    setFlyTo(null);
    setFlyToZoom(5.5);
    setTimeout(() => setFlyTo([25.0, -29.0]), 50);
  };

  const cycleMapStyle = () => {
    const styles: Array<'default' | 'satellite' | 'dark'> = ['default', 'satellite', 'dark'];
    const idx = (styles.indexOf(mapStyle) + 1) % 3;
    setMapStyle(styles[idx]);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        setFlyTo(coords);
        setLocating(false);
        toast.success('Found your location!');
      },
      () => { setLocating(false); toast.error("Couldn't get your location"); }
    );
  };

  const handleDiscountSelect = (coords: [number, number]) => {
    setFlyTo([coords[1], coords[0]]);
    setDrawerOpen(false);
  };

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return filteredLocations.slice(0, 6);
  }, [search, filteredLocations]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <MapView
        locations={filteredLocations}
        mapStyle={mapStyle}
        onMarkerClick={handleMarkerClick}
        flyTo={flyTo}
        flyToZoom={flyToZoom}
        selectedId={selectedPlace?.id ?? null}
        userLocation={userLocation}
      />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 pb-0 pointer-events-none">
        <div className="max-w-lg mx-auto space-y-2 pointer-events-auto">

          {/* Campus header bar — shows when zoomed into a campus */}
          {focusedUniversity && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-primary/95 backdrop-blur-xl rounded-xl px-3 py-2.5 shadow-lg"
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-primary-foreground hover:bg-white/20 shrink-0"
                onClick={handleBackToNational}
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary-foreground truncate">
                  {focusedUniversity.name}
                </p>
                <p className="text-[10px] text-primary-foreground/70">
                  {getPOIsForCampus(focusedCampusId!).length} places nearby · Tap to explore
                </p>
              </div>
            </motion.div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              placeholder={focusedCampusId ? "Search bars, restaurants, cafés..." : "Search campuses, cafés, deals..."}
              className="pl-9 pr-20 bg-card/95 backdrop-blur-xl border-border/40 shadow-lg rounded-xl h-11 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSearchResults(true); }}
              onFocus={() => search && setShowSearchResults(true)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {search && (
                <button
                  onClick={() => { setSearch(''); setShowSearchResults(false); }}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X size={14} />
                </button>
              )}
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-medium">
                {filteredLocations.length}
              </span>
            </div>

            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden z-30"
                >
                  {searchResults.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleSearchSelect(loc)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/60 transition-colors text-left border-b border-border/20 last:border-0"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs"
                        style={{ background: CATEGORY_COLORS[loc.category] }}
                      >
                        <span className="text-white">{CATEGORY_ICONS[loc.category]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{loc.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{loc.address}</p>
                      </div>
                      {getDistanceStr(loc) && (
                        <span className="text-[10px] text-primary font-medium shrink-0">{getDistanceStr(loc)}</span>
                      )}
                    </button>
                  ))}
                  {filteredLocations.length > 6 && (
                    <button
                      onClick={() => { setShowSearchResults(false); setDrawerOpen(true); }}
                      className="w-full text-center py-2 text-xs text-primary font-medium hover:bg-muted/40"
                    >
                      View all {filteredLocations.length} results →
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {activeCategories.size > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-medium bg-destructive/10 text-destructive border border-destructive/20 shrink-0"
              >
                <X size={10} /> Clear
              </button>
            )}
            {currentCategories.map(cat => {
              const active = activeCategories.has(cat);
              const color = CATEGORY_COLORS[cat];
              const count = categoryCounts[cat] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium
                    whitespace-nowrap transition-all shrink-0 border
                    ${active
                      ? 'text-white shadow-md border-transparent'
                      : 'bg-card/90 backdrop-blur-xl text-foreground border-border/40 shadow-sm hover:shadow-md'
                    }
                  `}
                  style={active ? { background: color, borderColor: color } : {}}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORY_LABELS[cat]}
                  <span className={`text-[9px] ${active ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showSearchResults && (
        <div className="absolute inset-0 z-10" onClick={() => setShowSearchResults(false)} />
      )}

      {/* Back to app button */}
      <div className="absolute left-3 top-3 z-30">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg bg-card/95 backdrop-blur-xl border border-border/50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
          </Button>
        </motion.div>
      </div>

      {/* Floating controls */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col gap-2">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg bg-card/95 backdrop-blur-xl border border-border/50"
            onClick={cycleMapStyle}
          >
            <Layers size={16} />
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            variant="secondary"
            className={`h-10 w-10 rounded-full shadow-lg bg-card/95 backdrop-blur-xl border border-border/50 ${locating ? 'animate-pulse' : ''}`}
            onClick={handleLocateMe}
            disabled={locating}
          >
            <LocateFixed size={16} className={userLocation ? 'text-primary' : ''} />
          </Button>
        </motion.div>
      </div>

      {/* Map style pill */}
      <div className="absolute left-3 bottom-28 z-20">
        <div className="bg-card/90 backdrop-blur-xl border border-border/40 rounded-full px-3 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm">
          {MAP_STYLE_LABELS[mapStyle]}
        </div>
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

      {/* Bottom drawer */}
      <div className="absolute bottom-3 left-0 right-0 z-20 px-3">
        <div className="max-w-lg mx-auto">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="w-full rounded-xl shadow-lg bg-card/95 backdrop-blur-xl border border-border/40 text-foreground hover:bg-card gap-2 h-12"
                variant="ghost"
              >
                <ChevronUp size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">
                  {focusedUniversity
                    ? `${getPOIsForCampus(focusedCampusId!).length} places near ${focusedUniversity.name.split('(')[0].trim()}`
                    : `${filteredLocations.length} places across South Africa`
                  }
                </span>
                <MapPin size={13} className="text-primary ml-auto" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[75vh]">
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-base">
                  {focusedUniversity ? `Near ${focusedUniversity.name.split('(')[0].trim()}` : 'Explore South Africa'}
                </DrawerTitle>
              </DrawerHeader>

              <Tabs defaultValue="places" className="px-4">
                <TabsList className="grid grid-cols-2 mb-3">
                  <TabsTrigger value="places" className="text-xs gap-1">
                    <MapPin size={12} /> Places ({filteredLocations.length})
                  </TabsTrigger>
                  <TabsTrigger value="discounts" className="text-xs gap-1">
                    <Tag size={12} /> Deals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="places" className="mt-0">
                  {userLocation && (
                    <button
                      onClick={() => setSortByDistance(p => !p)}
                      className={`flex items-center gap-1.5 text-xs mb-3 px-2.5 py-1.5 rounded-full border transition-colors ${
                        sortByDistance
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'text-muted-foreground border-border/40 hover:bg-muted'
                      }`}
                    >
                      <ArrowUpDown size={11} />
                      {sortByDistance ? 'Nearest first' : 'Sort by distance'}
                    </button>
                  )}

                  <div className="space-y-1.5 overflow-y-auto max-h-[50vh] pb-4">
                    {sortedLocations.map(loc => {
                      const distStr = getDistanceStr(loc);
                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleSearchSelect(loc)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                            selectedPlace?.id === loc.id
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-muted/40 hover:bg-muted border border-transparent'
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: CATEGORY_COLORS[loc.category] }}
                          >
                            <span className="text-white">{CATEGORY_ICONS[loc.category]}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground truncate">{loc.address}</span>
                              {loc.rating && (
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
                                  <Star size={9} className="fill-warning text-warning" /> {loc.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          {distStr && (
                            <span className="text-[11px] text-primary font-semibold shrink-0">{distStr}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="discounts" className="mt-0">
                  <DiscountFinder
                    onSelectLocation={handleDiscountSelect}
                    currentLocation={userLocation ? [userLocation[0], userLocation[1]] : undefined}
                  />
                </TabsContent>
              </Tabs>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Map;
