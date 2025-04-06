
import React, { useState, useEffect } from 'react';
import EnhancedNavBar from '@/components/EnhancedNavBar';
import MapView from '@/components/map/MapView';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, MapPin, Filter, Search, Calendar, MapIcon, Menu, X, Info } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BadgeGlow } from '@/components/ui/badge-glow';
import { Card, CardContent } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import { toast } from 'sonner';

type EventMarker = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'social' | 'academic' | 'sport' | 'food';
  date?: string;
  description?: string;
};

const MOCK_EVENTS: EventMarker[] = [
  { id: 1, name: "Friday Night Market", lat: -26.1915, lng: 28.0264, type: "social", date: "2025-04-12", description: "Local food, crafts, and live music" },
  { id: 2, name: "Library Study Hall", lat: -26.1932, lng: 28.0301, type: "academic", description: "Open 24/7 for exam period" },
  { id: 3, name: "Campus Rugby Match", lat: -26.1853, lng: 28.0283, type: "sport", date: "2025-04-10", description: "Varsity cup semi-final" },
  { id: 4, name: "Budget Café", lat: -26.1898, lng: 28.0315, type: "food", description: "Student discounts available" },
  { id: 5, name: "Career Fair", lat: -26.1867, lng: 28.0292, type: "academic", date: "2025-04-14", description: "Top companies recruiting" }
];

const Map: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilters, setEventFilters] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'dark'>('default');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventMarker | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleFilter = (filter: string) => {
    if (eventFilters.includes(filter)) {
      setEventFilters(eventFilters.filter(f => f !== filter));
    } else {
      setEventFilters([...eventFilters, filter]);
    }
  };
  
  const handleStyleChange = (style: 'default' | 'satellite' | 'dark') => {
    setMapStyle(style);
    toast.success(`Map style changed to ${style}`);
  };
  
  const handleEventSelect = (event: EventMarker) => {
    setSelectedEvent(event);
  };
  
  const getFilteredEvents = () => {
    return MOCK_EVENTS.filter(event => {
      // Filter by search query
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by event type
      if (eventFilters.length > 0 && !eventFilters.includes(event.type)) {
        return false;
      }
      
      return true;
    });
  };
  
  const filteredEvents = getFilteredEvents();
  
  // Get event type icon
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'social': return "🎉";
      case 'academic': return "📚";
      case 'sport': return "🏅";
      case 'food': return "🍔";
      default: return "📍";
    }
  };
  
  const getEventColor = (type: string) => {
    switch(type) {
      case 'social': return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case 'academic': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'sport': return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'food': return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen pb-28 ${darkMode ? 'bg-theme-navy text-white' : 'bg-gradient-to-br from-theme-indigo/20 to-theme-teal/20'}`}>
      <ParticleBackground count={15} className="opacity-20" />
      
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy/80' : 'bg-white/80'} backdrop-blur-md py-6 px-4 shadow-lg`}
      >
        <div className="container mx-auto max-w-md">
          <motion.div 
            className="flex items-center justify-center mb-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <BadgeGlow glowColor="rgba(6, 182, 212, 0.5)">
              <div className="flex items-center bg-cyan-600 text-white px-3 py-1.5 rounded-full">
                <MapIcon size={18} className="mr-2" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >Campus</motion.span>
                <motion.span 
                  className="text-cyan-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >Map</motion.span>
              </div>
            </BadgeGlow>
          </motion.div>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <Input 
              type="text"
              placeholder="Search locations or events..." 
              className="pl-9 bg-gray-100/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-100/80 dark:bg-gray-800/80"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </Button>
          
          <Toggle 
            className="p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80"
            pressed={darkMode}
            onPressedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} className="animate-pulse-soft" /> : <Moon size={18} />}
          </Toggle>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                >
                  <Filter size={14} className="mr-2" />
                  Filter Events {eventFilters.length > 0 && `(${eventFilters.length})`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={eventFilters.includes('social') ? "default" : "outline"}
                    onClick={() => toggleFilter('social')}
                    className={eventFilters.includes('social') ? "bg-purple-600" : ""}
                  >
                    🎉 Social
                  </Button>
                  <Button 
                    size="sm" 
                    variant={eventFilters.includes('academic') ? "default" : "outline"}
                    onClick={() => toggleFilter('academic')}
                    className={eventFilters.includes('academic') ? "bg-blue-600" : ""}
                  >
                    📚 Academic
                  </Button>
                  <Button 
                    size="sm" 
                    variant={eventFilters.includes('sport') ? "default" : "outline"}
                    onClick={() => toggleFilter('sport')}
                    className={eventFilters.includes('sport') ? "bg-green-600" : ""}
                  >
                    🏅 Sports
                  </Button>
                  <Button 
                    size="sm" 
                    variant={eventFilters.includes('food') ? "default" : "outline"}
                    onClick={() => toggleFilter('food')}
                    className={eventFilters.includes('food') ? "bg-amber-600" : ""}
                  >
                    🍔 Food
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                >
                  <MapIcon size={14} className="mr-2" />
                  Map Style
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800">
                <div className="flex flex-col gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleStyleChange('default')}
                    className={mapStyle === 'default' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" : ""}
                  >
                    Standard
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleStyleChange('satellite')}
                    className={mapStyle === 'satellite' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" : ""}
                  >
                    Satellite
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleStyleChange('dark')}
                    className={mapStyle === 'dark' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" : ""}
                  >
                    Dark
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="icon"
                variant="outline"
                className="bg-white/80 dark:bg-gray-800/80 rounded-full border-gray-200 dark:border-gray-700 h-9 w-9"
              >
                <Info size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Map Legend</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🎉</span>
                    <span>Social Events</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">📚</span>
                    <span>Academic</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🏅</span>
                    <span>Sports</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🍔</span>
                    <span>Food Spots</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl overflow-hidden shadow-xl relative"
          style={{ height: "400px" }}
        >
          <MapView mapStyle={mapStyle} markers={filteredEvents} onMarkerClick={handleEventSelect} />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg p-4 relative"
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-2 h-6 w-6" 
                onClick={() => setSelectedEvent(null)}
              >
                <X size={14} />
              </Button>
              
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getEventColor(selectedEvent.type)}`}>
                {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
              </div>
              
              <h3 className="text-lg font-medium mt-2">{selectedEvent.name}</h3>
              
              {selectedEvent.date && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <Calendar size={14} className="mr-1.5" />
                  {new Date(selectedEvent.date).toLocaleDateString('en-ZA', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              )}
              
              {selectedEvent.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedEvent.description}
                </p>
              )}
              
              <div className="mt-3 flex justify-end space-x-2">
                <Button variant="outline" size="sm">Get Directions</Button>
                <Button size="sm">More Info</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <h3 className="text-sm font-medium">Nearby Events</h3>
          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 3).map((event) => (
              <motion.div 
                key={event.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-3 shadow-sm cursor-pointer"
                onClick={() => handleEventSelect(event)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-xl mr-2">{getEventIcon(event.type)}</div>
                    <div>
                      <h3 className="text-sm font-medium">{event.name}</h3>
                      {event.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('en-ZA', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-4 text-center"
            >
              <MapPin className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-gray-500 dark:text-gray-400">No events found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-lg">Map Settings</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Map Styles</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Card 
                        className={`cursor-pointer border-2 ${mapStyle === 'default' ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => handleStyleChange('default')}
                      >
                        <CardContent className="p-2 text-center">
                          <div className="w-full h-12 bg-blue-100 dark:bg-blue-900/30 rounded mb-1"></div>
                          <span className="text-xs">Standard</span>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer border-2 ${mapStyle === 'satellite' ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => handleStyleChange('satellite')}
                      >
                        <CardContent className="p-2 text-center">
                          <div className="w-full h-12 bg-green-100 dark:bg-green-900/30 rounded mb-1"></div>
                          <span className="text-xs">Satellite</span>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer border-2 ${mapStyle === 'dark' ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => handleStyleChange('dark')}
                      >
                        <CardContent className="p-2 text-center">
                          <div className="w-full h-12 bg-gray-800 dark:bg-gray-700 rounded mb-1"></div>
                          <span className="text-xs">Dark</span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Event Types</h3>
                    <div className="space-y-2">
                      <Button 
                        className="w-full justify-start"
                        size="sm" 
                        variant={eventFilters.includes('social') ? "default" : "outline"}
                        onClick={() => toggleFilter('social')}
                      >
                        🎉 Social Events
                      </Button>
                      
                      <Button 
                        className="w-full justify-start"
                        size="sm" 
                        variant={eventFilters.includes('academic') ? "default" : "outline"}
                        onClick={() => toggleFilter('academic')}
                      >
                        📚 Academic Spots
                      </Button>
                      
                      <Button 
                        className="w-full justify-start"
                        size="sm" 
                        variant={eventFilters.includes('sport') ? "default" : "outline"}
                        onClick={() => toggleFilter('sport')}
                      >
                        🏅 Sports Facilities
                      </Button>
                      
                      <Button 
                        className="w-full justify-start"
                        size="sm" 
                        variant={eventFilters.includes('food') ? "default" : "outline"}
                        onClick={() => toggleFilter('food')}
                      >
                        🍔 Food & Cafes
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setEventFilters([]);
                      setSearchQuery('');
                      toast.success("Filters cleared");
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <EnhancedNavBar />
    </div>
  );
};

export default Map;
