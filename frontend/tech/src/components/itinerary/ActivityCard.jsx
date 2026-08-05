import { motion as m } from 'framer-motion';
import { ChevronDown, ChevronUp, Heart, MapPin, Sparkles, Trash2, Replace, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchRealPlacePhoto } from '../../services/wikimediaImageService';

export default function ActivityCard({ activity, isSaved, onSelect, onRemove, onFavorite, onReplace }) {
  const [expanded, setExpanded] = useState(false);
  const [photoImg, setPhotoImg] = useState(
    activity.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  );
  const handleToggle = () => setExpanded((value) => !value);

  useEffect(() => {
    if (activity.imageUrl) {
      setPhotoImg(activity.imageUrl);
      return;
    }
    let isMounted = true;
    fetchRealPlacePhoto(activity.title, activity.location, 'activity').then((url) => {
      if (isMounted && url) setPhotoImg(url);
    });
    return () => { isMounted = false; };
  }, [activity.title, activity.location, activity.imageUrl]);

  return (
    <m.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="overflow-hidden rounded-[1.25rem] border border-border bg-surface-elevated shadow-sm"
    >
      {/* Real Place Photo Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-surface">
        <img
          src={photoImg}
          alt={activity.title || 'Real Sightseeing Spot'}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          <Camera className="h-3 w-3 text-emerald-400" /> Real Place Photo
        </div>
        <button
          onClick={() => onFavorite(activity)}
          className={`absolute top-3 right-3 rounded-full border p-2 backdrop-blur-md transition-colors ${
            isSaved
              ? 'border-red-500/40 bg-red-500/80 text-white'
              : 'border-white/30 bg-black/40 text-white hover:bg-black/70'
          }`}
          aria-label="Favorite activity"
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {activity.category || 'Sightseeing'}
            </span>
            {activity.time && <span className="text-xs text-slate-200">{activity.time}</span>}
          </div>
          <h4 className="mt-1 text-base font-bold text-white drop-shadow-sm">{activity.title || 'Untitled activity'}</h4>
        </div>
      </div>

      <div className="p-4">
        {activity.description && <p className="text-sm leading-6 text-text-secondary">{activity.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          {activity.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              {activity.location}
            </span>
          )}
          {activity.duration && <span>{activity.duration}</span>}
          {activity.estimatedCost && <span className="font-semibold text-text-primary">{activity.estimatedCost}</span>}
          {activity.rating && <span className="font-semibold text-emerald-500">★ {activity.rating}</span>}
        </div>

        {expanded && (
          <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
            {activity.details && <p className="leading-6">{activity.details}</p>}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onSelect(activity)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <Sparkles className="h-4 w-4" />
            View on map
          </button>
          <button onClick={() => onReplace(activity)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <Replace className="h-4 w-4" />
            Replace
          </button>
          <button onClick={() => onRemove(activity)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
          <button onClick={handleToggle} className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>
    </m.div>
  );
}
