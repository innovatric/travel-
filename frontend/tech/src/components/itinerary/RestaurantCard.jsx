import { motion as m } from 'framer-motion';
import { Heart, MapPin, Replace, Trash2, UtensilsCrossed, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchRealPlacePhoto } from '../../services/wikimediaImageService';

export default function RestaurantCard({ restaurant, isSaved, onSelect, onRemove, onFavorite, onReplace }) {
  const [foodImg, setFoodImg] = useState(
    restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  );

  useEffect(() => {
    if (restaurant.imageUrl) {
      setFoodImg(restaurant.imageUrl);
      return;
    }
    let isMounted = true;
    fetchRealPlacePhoto(restaurant.title, restaurant.location, 'restaurant').then((url) => {
      if (isMounted && url) setFoodImg(url);
    });
    return () => { isMounted = false; };
  }, [restaurant.title, restaurant.location, restaurant.imageUrl]);

  return (
    <m.div whileHover={{ y: -2, scale: 1.01 }} className="overflow-hidden rounded-[1.25rem] border border-border bg-surface-elevated shadow-sm">
      {/* Real Food Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-surface">
        <img
          src={foodImg}
          alt={restaurant.title || 'Real Food Spot'}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          <Camera className="h-3 w-3 text-amber-400" /> Real Food Photo
        </div>
        <button
          onClick={() => onFavorite(restaurant)}
          className={`absolute top-3 right-3 rounded-full border p-2 backdrop-blur-md transition-colors ${
            isSaved
              ? 'border-red-500/40 bg-red-500/80 text-white'
              : 'border-white/30 bg-black/40 text-white hover:bg-black/70'
          }`}
          aria-label="Favorite food spot"
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
              Food & Dining
            </span>
            {restaurant.time && <span className="text-xs text-slate-200">{restaurant.time}</span>}
          </div>
          <h4 className="mt-1 text-base font-bold text-white drop-shadow-sm">{restaurant.title || 'Dining suggestion'}</h4>
        </div>
      </div>

      <div className="p-4">
        {restaurant.description && <p className="text-sm leading-6 text-text-secondary">{restaurant.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          {restaurant.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              {restaurant.location}
            </span>
          )}
          {restaurant.duration && <span>{restaurant.duration}</span>}
          {restaurant.estimatedCost && <span className="font-semibold text-text-primary">{restaurant.estimatedCost}</span>}
          {restaurant.rating && <span className="font-semibold text-amber-500">★ {restaurant.rating}</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onSelect(restaurant)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <UtensilsCrossed className="h-4 w-4" />
            View food spot
          </button>
          <button onClick={() => onReplace(restaurant)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <Replace className="h-4 w-4" />
            Replace
          </button>
          <button onClick={() => onRemove(restaurant)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </m.div>
  );
}
