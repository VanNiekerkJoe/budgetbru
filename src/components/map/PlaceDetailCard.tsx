import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Navigation, Bookmark, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapLocation, CATEGORY_COLORS, CATEGORY_LABELS } from '@/data/mapLocations';

const CATEGORY_EMOJI: Record<string, string> = {
  university: '🎓', food: '🍔', cafe: '☕', gym: '💪',
  entertainment: '🎵', shopping: '🛍️', transport: '🚆',
  accommodation: '🏠', library: '📚', discount: '🏷️',
  bar: '🍺', restaurant: '🍽️', fastfood: '🍟', studyspot: '📖',
};

interface PlaceDetailCardProps {
  place: MapLocation;
  onClose: () => void;
  userLocation?: [number, number] | null;
}

const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, onClose, userLocation }) => {
  const color = CATEGORY_COLORS[place.category];
  const emoji = CATEGORY_EMOJI[place.category] || '📍';

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
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank');
  };

  const handleShare = async () => {
    const text = `Check out ${place.name} — ${place.address}`;
    if (navigator.share) {
      try { await navigator.share({ title: place.name, text, url: window.location.href }); }
      catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleSave = () => toast.success(`${place.name} saved to favourites`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.97 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="absolute bottom-20 left-3 right-3 z-30 mx-auto max-w-md"
    >
      <div className="bg-card/97 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/60 overflow-hidden">
        {/* Gradient accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
        />

        <div className="p-4">
          <div className="flex gap-3">
            {/* Emoji icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
              style={{ background: `${color}18` }}
            >
              {emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Badge
                  className="text-[9px] px-1.5 py-0 text-white border-0 rounded-md"
                  style={{ background: color }}
                >
                  {CATEGORY_LABELS[place.category]}
                </Badge>
                {place.rating && (
                  <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                    <Star size={10} className="fill-warning text-warning" />
                    {place.rating}
                  </span>
                )}
                {place.priceLevel && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {'R'.repeat(place.priceLevel)}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-1">
                {place.name}
              </h3>

              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">{place.address}</span>
                {distance && (
                  <span className="shrink-0 text-primary font-semibold">· {distance}</span>
                )}
              </div>

              {place.description && (
                <p className="text-[11px] text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              )}
            </div>

            {/* Close */}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 rounded-full -mt-0.5 -mr-1"
              onClick={onClose}
            >
              <X size={14} />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="flex-1 text-xs gap-1.5 rounded-xl h-9"
              onClick={openDirections}
            >
              <Navigation size={13} />
              Directions
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 rounded-xl h-9"
              onClick={handleSave}
            >
              <Bookmark size={12} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 rounded-xl h-9"
              onClick={handleShare}
            >
              <Share2 size={12} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceDetailCard;
