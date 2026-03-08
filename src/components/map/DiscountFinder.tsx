import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, MapPin, Search, ArrowRight, Calendar } from 'lucide-react';
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
  { id: '1', title: 'Student Monday Special', business: 'Campus Cafe', location: 'Student Center', category: 'Food', discount: '20% off all meals', validUntil: '2023-12-31', studentOnly: true, coordinates: [28.0473, -26.1945] },
  { id: '2', title: 'Tech Tuesday', business: 'Digital Hub', location: 'Tech Building', category: 'Electronics', discount: '15% off accessories', validUntil: '2023-10-15', studentOnly: true, coordinates: [28.0475, -26.1948] },
  { id: '3', title: 'Weekend Book Sale', business: 'University Bookstore', location: 'Library Plaza', category: 'Books', discount: 'Buy 2 Get 1 Free', validUntil: '2023-11-30', studentOnly: false, coordinates: [28.0480, -26.1940] },
  { id: '4', title: 'Happy Hour Special', business: 'Student Pub', location: 'West Campus', category: 'Entertainment', discount: '2 for 1 on selected drinks', validUntil: '2023-12-31', studentOnly: true, coordinates: [28.0468, -26.1952] },
  { id: '5', title: 'Fitness Membership Discount', business: 'Campus Gym', location: 'Sports Complex', category: 'Fitness', discount: '30% off semester membership', validUntil: '2023-09-30', studentOnly: true, coordinates: [28.0460, -26.1960] },
];

interface DiscountFinderProps {
  onSelectLocation?: (coords: [number, number]) => void;
  currentLocation?: [number, number];
}

const DiscountFinder: React.FC<DiscountFinderProps> = ({ onSelectLocation, currentLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const discountsWithDistance = currentLocation
    ? MOCK_DISCOUNTS.map(d => ({
        ...d,
        distance: calculateDistance(currentLocation[1], currentLocation[0], d.coordinates[1], d.coordinates[0]),
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    : MOCK_DISCOUNTS;

  const categories = Array.from(new Set(MOCK_DISCOUNTS.map(d => d.category)));

  const filteredDiscounts = discountsWithDistance.filter(d =>
    (selectedCategory === null || d.category === selectedCategory) &&
    (searchTerm === '' ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.business.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  }

  const handleShowOnMap = (discount: Discount) => {
    onSelectLocation?.(discount.coordinates);
    toast.success(`Showing ${discount.business} on map`, { description: discount.location });
  };

  return (
    <div className="py-2 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <Input
          placeholder="Search discounts..."
          className="pl-9 h-9 text-xs rounded-xl bg-muted/50 border-border/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-[10px] h-7 rounded-full px-2.5"
        >
          All
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="text-[10px] h-7 rounded-full px-2.5 whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      {filteredDiscounts.length === 0 ? (
        <div className="text-center py-6">
          <Tag className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">No discounts found</p>
          <p className="text-xs text-muted-foreground">Try changing your search or filters</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          className="space-y-2 max-h-[400px] overflow-y-auto pr-0.5"
        >
          {filteredDiscounts.map(discount => (
            <motion.div
              key={discount.id}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground mb-1 text-[10px]">
                      {discount.discount}
                    </Badge>
                    <h3 className="font-semibold text-sm text-foreground">{discount.title}</h3>
                    <p className="text-xs text-muted-foreground">{discount.business}</p>
                  </div>
                  {discount.studentOnly && (
                    <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent shrink-0 text-[9px]">
                      Students Only
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {discount.location}
                    {discount.distance !== undefined && <span>· {discount.distance} km</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    Until {new Date(discount.validUntil).toLocaleDateString()}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2.5 text-xs rounded-xl h-8 gap-1"
                  onClick={() => handleShowOnMap(discount)}
                >
                  Show on Map <ArrowRight size={11} />
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
