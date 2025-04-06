
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, MapPin, Search, ArrowRight, Calendar, Star, PercentCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Discount {
  id: string;
  title: string;
  business: string;
  location: string;
  category: string;
  discount: string;
  validUntil: string;
  studentOnly: boolean;
  coordinates: [number, number];
  distance?: number;
}

const MOCK_DISCOUNTS: Discount[] = [
  {
    id: '1',
    title: 'Student Monday Special',
    business: 'Campus Cafe',
    location: 'Student Center',
    category: 'Food',
    discount: '20% off all meals',
    validUntil: '2023-12-31',
    studentOnly: true,
    coordinates: [28.0473, -26.1945]
  },
  {
    id: '2',
    title: 'Tech Tuesday',
    business: 'Digital Hub',
    location: 'Tech Building',
    category: 'Electronics',
    discount: '15% off accessories',
    validUntil: '2023-10-15',
    studentOnly: true,
    coordinates: [28.0475, -26.1948]
  },
  {
    id: '3',
    title: 'Weekend Book Sale',
    business: 'University Bookstore',
    location: 'Library Plaza',
    category: 'Books',
    discount: 'Buy 2 Get 1 Free',
    validUntil: '2023-11-30',
    studentOnly: false,
    coordinates: [28.0480, -26.1940]
  },
  {
    id: '4',
    title: 'Happy Hour Special',
    business: 'Student Pub',
    location: 'West Campus',
    category: 'Entertainment',
    discount: '2 for 1 on selected drinks',
    validUntil: '2023-12-31',
    studentOnly: true,
    coordinates: [28.0468, -26.1952]
  },
  {
    id: '5',
    title: 'Fitness Membership Discount',
    business: 'Campus Gym',
    location: 'Sports Complex',
    category: 'Fitness',
    discount: '30% off semester membership',
    validUntil: '2023-09-30',
    studentOnly: true,
    coordinates: [28.0460, -26.1960]
  }
];

interface DiscountFinderProps {
  onSelectLocation?: (coords: [number, number]) => void;
  currentLocation?: [number, number];
}

const DiscountFinder: React.FC<DiscountFinderProps> = ({ 
  onSelectLocation,
  currentLocation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  
  // Calculate distances if currentLocation is provided
  const discountsWithDistance = currentLocation 
    ? discounts.map(discount => {
        const distance = calculateDistance(
          currentLocation[1], 
          currentLocation[0], 
          discount.coordinates[1], 
          discount.coordinates[0]
        );
        return { ...discount, distance };
      }).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    : discounts;
  
  const categories = Array.from(new Set(discounts.map(d => d.category)));
  
  const filteredDiscounts = discountsWithDistance.filter(discount => {
    return (
      (selectedCategory === null || discount.category === selectedCategory) &&
      (searchTerm === '' || 
        discount.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        discount.business.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Calculate distance between two coordinates (Haversine formula)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10;
  }
  
  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleShowOnMap = (discount: Discount) => {
    if (onSelectLocation) {
      onSelectLocation(discount.coordinates);
      toast.success(`Showing ${discount.business} on map`, {
        description: discount.location
      });
    }
  };

  return (
    <div className="px-1 py-2 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-1.5">
          <Tag size={18} className="text-theme-pink" />
          <span>Student Discounts</span>
        </h2>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search discounts..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredDiscounts.length === 0 ? (
        <div className="text-center py-6">
          <Tag className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-base font-medium">No discounts found</h3>
          <p className="text-xs text-gray-500">Try changing your search or filters</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
        >
          {filteredDiscounts.map((discount) => (
            <motion.div 
              key={discount.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-theme-pink/90 hover:bg-theme-pink mb-1">
                      {discount.discount}
                    </Badge>
                    <h3 className="font-medium">{discount.title}</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{discount.business}</div>
                  </div>
                  {discount.studentOnly && (
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">
                      Students Only
                    </Badge>
                  )}
                </div>
                
                <div className="mt-2 text-xs flex flex-wrap gap-y-1">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mr-3">
                    <MapPin size={12} className="mr-1" />
                    {discount.location}
                    {discount.distance !== undefined && (
                      <span className="ml-1">• {discount.distance} km</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar size={12} className="mr-1" />
                    Valid until {new Date(discount.validUntil).toLocaleDateString()}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs flex items-center justify-center"
                  onClick={() => handleShowOnMap(discount)}
                >
                  Show on Map <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DiscountFinder;
