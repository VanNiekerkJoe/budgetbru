import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Navigation, Bookmark, X, Share2, Clock } from 'lucide-react';
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

// Mock opening hours
const getOpenStatus = (category: string): { open: boolean; text: string } => {
  const hour = new Date().getHours();
  if (category === 'bar') return hour >= 16 && hour < 2 ? { open: true, text: 'Open · Closes 2 AM' } : { open: false, text: 'Closed · Opens 4 PM' };
  if (category === 'cafe') return hour >= 7 && hour < 18 ? { open: true, text: 'Open · Closes 6 PM' } : { open: false, text: 'Closed · Opens 7 AM' };
  if (category === 'restaurant' || category === 'fastfood') return hour >= 8 && hour < 22 ? { open: true, text: 'Open · Closes 10 PM' } : { open: false, text: 'Closed · Opens 8 AM' };
  if (category === 'gym') return hour >= 5 && hour < 22 ? { open: true, text: 'Open · Closes 10 PM' } : { open: false, text: 'Closed · Opens 5 AM' };
  if (category === 'studyspot' || category === 'library') return hour >= 8 && hour < 21 ? { open: true, text: 'Open · Closes 9 PM' } : { open: false, text: 'Closed · Opens 8 AM' };
  return { open: true, text: 'Open' };
};

interface PlaceDetailCardProps {
  place: MapLocation;
  onClose: () => void;
  userLocation?: [number, number] | null;
}

const PlaceDetailCard: React.FC<PlaceDetailCardProps> = ({ place, onClose, userLocation }) => {
  const color = CATEGORY_COLORS[place.category];
  const emoji = CATEGORY_EMOJI[place.category] || '📍';
  const openStatus = getOpenStatus(place.category);

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
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={(_, info) => {
        if (info.offset.y > 80) onClose();
      }}
      className="absolute bottom-16 left-3 right-3 z-30 mx-auto max-w-md"
    >
      <div className="bg-card/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/40 overflow-hidden">
        {/* Swipe indicator */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Photo placeholder with gradient overlay */}
        <div
          className="h-24 mx-3 rounded-2xl relative overflow-hidden mb-3"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">{emoji}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/80 to-transparent" />
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-card/60 backdrop-blur-xl hover:bg-card/80"
            onClick={onClose}
          >
            <X size={14} />
          </Button>
        </div>

        <div className="px-4 pb-4">
          {/* Category & rating row */}
          <div className="flex items-center gap-1.5 mb-1">
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
              <span className="flex items-center gap-0.5 ml-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i < place.priceLevel! ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                  />
                ))}
              </span>
            )}
          </div>

          <h3 className="font-bold text-base text-foreground leading-snug mb-0.5">
            {place.name}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{place.address}</span>
            {distance && (
              <span className="shrink-0 text-primary font-semibold">· {distance}</span>
            )}
          </div>

          {/* Opening hours */}
          <div className="flex items-center gap-1 text-[11px] mb-2">
            <Clock size={10} className="shrink-0" />
            <span className={openStatus.open ? 'text-green-500 font-medium' : 'text-destructive font-medium'}>
              {openStatus.text}
            </span>
          </div>

          {place.description && (
            <p className="text-[11px] text-muted-foreground/80 mb-2.5 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}

          {/* Tag chips */}
          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {place.tags.slice(0, 5).map(tag => (
                <span
                  key={tag}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 text-xs gap-1.5 rounded-xl h-10"
              onClick={openDirections}
            >
              <Navigation size={13} />
              Directions
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 rounded-xl h-10 px-3"
              onClick={handleSave}
            >
              <Bookmark size={12} />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 rounded-xl h-10 px-3"
              onClick={handleShare}
            >
              <Share2 size={12} />
              Share
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceDetailCard;
