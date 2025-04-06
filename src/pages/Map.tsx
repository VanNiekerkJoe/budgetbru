
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Settings, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import MapView from '@/components/map/MapView';
import NavBar from '@/components/NavBar';
import DiscountFinder from '@/components/map/DiscountFinder';
import ReceiptIcon from '@/components/ReceiptIcon';

const Map: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'discounts'>('map');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | undefined>(undefined);

  const handleSelectLocation = (coords: [number, number]) => {
    setSelectedLocation(coords);
    setActiveTab('map');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Map Container */}
      <div className="relative w-full h-screen pb-28">
        {activeTab === 'map' ? (
          <MapView selectedLocation={selectedLocation} />
        ) : (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-95 z-10">
            <div className="h-full overflow-auto p-4 pb-24">
              <DiscountFinder onSelectLocation={handleSelectLocation} />
            </div>
          </div>
        )}

        {/* Floating UI Elements */}
        <div className="absolute bottom-28 left-0 right-0 px-4 z-20">
          <div className="mx-auto max-w-md">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'map' | 'discounts')}
              className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg border border-gray-100 dark:border-gray-700"
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
                className="shadow-md flex items-center gap-1.5"
              >
                <Compass size={14} className="text-blue-500" />
                <span>Campus</span>
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
                  className="shadow-md h-8 w-8"
                  onClick={() => setActiveTab(activeTab === 'map' ? 'discounts' : 'map')}
                >
                  <Search size={14} />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary"
                  size="icon"
                  className="shadow-md h-8 w-8"
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
                  className="shadow-md h-8 w-8"
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
