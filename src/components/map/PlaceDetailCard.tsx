import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Navigation, Bookmark, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapLocation, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data/mapLocations';

interface PlaceDetailCardProps {
  place: MapLocation;
  onClose: () => void;
  userLocation?: [number, number] | null;
}

const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, onClose, userLocation }) => {
  const color = CATEGORY_COLORS[place.category];

  const getDistance = (): string | null => {
    if (!userLocation) return null;
    const R = 6371;
    const dLat = ((place.lat - userLocation[1]) * Math.PI) / 180;
    const dLng = ((place.lng - userLocation[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation[1] * Math.PI) / 180) *
        Math.cos((place.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  const distance = getDistance();

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, '_blank');
  };

  const handleSave = () => {
    toast.success(`${place.name} saved to favourites`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute bottom-24 left-3 right-3 z-30 mx-auto max-w-md"
    >
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Color accent bar */}
        <div className="h-1.5 w-full" style={{ background: color }} />

        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className="text-[10px] px-2 py-0 text-white border-0 shrink-0"
                  style={{ background: color }}
                >
                  {CATEGORY_LABELS[place.category]}
                </Badge>
                {place.rating && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star size={11} className="fill-warning text-warning" />
                    {place.rating}
                  </span>
                )}
                {place.priceLevel && (
                  <span className="text-xs text-muted-foreground">
                    {'R'.repeat(place.priceLevel)}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-foreground leading-tight truncate">
                {place.name}
              </h3>

              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin size={11} />
                <span className="truncate">{place.address}</span>
                {distance && (
                  <span className="shrink-0 ml-1 text-primary font-medium">• {distance}</span>
                )}
              </div>

              {place.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {place.description}
                </p>
              )}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={onClose}
            >
              <X size={14} />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="flex-1 text-xs gap-1.5"
              onClick={openDirections}
            >
              <Navigation size={13} />
              Directions
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5"
              onClick={handleSave}
            >
              <Bookmark size={13} />
              Save
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceDetailCard;
