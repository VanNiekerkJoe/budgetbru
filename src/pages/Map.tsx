
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Settings, Search, Tag, Navigation, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import MapView from '@/components/map/MapView';
import NavBar from '@/components/NavBar';
import DiscountFinder from '@/components/map/DiscountFinder';
import ReceiptIcon from '@/components/ReceiptIcon';
import { toast } from 'sonner';
import { EventMarker } from '@/components/map/MapView';

const Map: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'discounts'>('map');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | undefined>(undefined);
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'dark'>('default');
  const [showEventDetails, setShowEventDetails] = useState<EventMarker | null>(null);

  const handleSelectLocation = (coords: [number, number]) => {
    setSelectedLocation(coords);
    setActiveTab('map');
  };
  
  const handleMarkerClick = (event: EventMarker) => {
    setShowEventDetails(event);
    toast.success(`Selected: ${event.name}`);
  };
  
  const eventMarkers: EventMarker[] = [
    { id: 1, name: 'Student Budget Workshop', lat: -33.9249, lng: 18.4241, type: 'academic', 
      description: 'Learn how to manage your finances effectively as a student',
      date: '2023-07-15' },
    { id: 2, name: 'Savings Challenge Meetup', lat: -33.9229, lng: 18.4251, type: 'social',
      description: 'Join fellow students for the monthly savings challenge',
      date: '2023-07-20' },
    { id: 3, name: 'Budget-Friendly Food Market', lat: -33.9269, lng: 18.4231, type: 'food',
      description: 'Affordable food options from local vendors',
      date: '2023-07-18' },
    { id: 4, name: 'Financial Fitness Run', lat: -33.9209, lng: 18.4271, type: 'sport',
      description: 'Run to raise awareness about financial literacy',
      date: '2023-07-25' },
  ];

  const cycleMapStyle = () => {
    if (mapStyle === 'default') setMapStyle('satellite');
    else if (mapStyle === 'satellite') setMapStyle('dark');
    else setMapStyle('default');
    
    toast.success(`Map style changed to ${mapStyle === 'default' ? 'satellite' : mapStyle === 'satellite' ? 'dark' : 'default'}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      {/* Background lighting effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '15s'}} />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s'}} />
      </div>
      
      {/* Map Container */}
      <div className="relative w-full h-screen pb-28">
        {activeTab === 'map' ? (
          <MapView 
            selectedLocation={selectedLocation}
            mapStyle={mapStyle}
            markers={eventMarkers}
            onMarkerClick={handleMarkerClick}
          />
        ) : (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-10">
            <div className="h-full overflow-auto p-4 pb-24">
              <DiscountFinder onSelectLocation={handleSelectLocation} />
            </div>
          </div>
        )}

        {/* Event Details Popup */}
        <AnimatePresence>
          {showEventDetails && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-36 left-0 right-0 mx-4 z-30"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-lg p-4 max-w-md mx-auto border border-white/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{showEventDetails.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {showEventDetails.description}
                    </p>
                    
                    {showEventDetails.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Date: {new Date(showEventDetails.date).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => {
                          toast.success("Event added to your calendar");
                        }}
                      >
                        Add to Calendar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast.success("Event shared");
                        }}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setShowEventDetails(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating UI Elements */}
        <div className="absolute bottom-28 left-0 right-0 px-4 z-20">
          <div className="mx-auto max-w-md">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'map' | 'discounts')}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-1 rounded-full shadow-lg border border-white/20"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="map" className="flex items-center gap-1.5 rounded-full">
                  <MapPin size={14} />
                  <span>Map</span>
                </TabsTrigger>
                <TabsTrigger value="discounts" className="flex items-center gap-1.5 rounded-full">
                  <Tag size={14} />
                  <span>Discounts</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Map Controls (Top) */}
        <div className="absolute top-4 left-0 right-0 px-4 z-20">
          <div className="mx-auto max-w-md flex justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="secondary"
                size="sm"
                className="shadow-md flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20"
              >
                <Home size={14} className="text-blue-500" />
                <span>Home</span>
              </Button>
            </motion.div>

            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary"
                  size="icon"
                  className="shadow-md h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20"
                  onClick={() => setActiveTab(activeTab === 'map' ? 'discounts' : 'map')}
                >
                  {activeTab === 'map' ? <Tag size={14} /> : <MapPin size={14} />}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary"
                  size="icon"
                  className="shadow-md h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20"
                  onClick={cycleMapStyle}
                >
                  <Settings size={14} />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary"
                  size="icon"
                  className="shadow-md h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20"
                  onClick={() => window.location.href = '/receipts'}
                >
                  <ReceiptIcon size={14} showAnimation={false} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default Map;
