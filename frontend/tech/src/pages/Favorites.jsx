import { useEffect, useMemo } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useTrip } from '../context/TripContext';

export default function Favorites() {
  const { favorites = [], localFavorites = [], fetchFavorites, removeFavorite, isLoading } = useTrip();

  useEffect(() => {
    fetchFavorites().catch((err) => console.warn('Could not fetch favorites:', err));
  }, [fetchFavorites]);

  const allFavorites = useMemo(() => {
    const combined = [...localFavorites, ...(Array.isArray(favorites) ? favorites : [])];
    const seen = new Set();
    return combined.filter((item) => {
      const key = item.id || item.favoriteId || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [favorites, localFavorites]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Favorites</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Destinations, hotels, and experiences you&apos;ve saved ({allFavorites.length})
        </p>
      </div>

      {isLoading && allFavorites.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-secondary">Loading favorites...</div>
      ) : allFavorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allFavorites.map((item, idx) => (
            <div key={item.favoriteId || item.id || idx} className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent-violet/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-violet">
                  {item.itemType || item.category || 'Saved'}
                </span>
                <button
                  onClick={() => removeFavorite(item.id || item.favoriteId)}
                  className="text-text-muted hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{item.title || item.itemName || 'Saved Place'}</h3>
              {item.details && <p className="text-sm text-text-secondary leading-relaxed">{item.details}</p>}
              {item.location && <p className="text-xs text-text-muted">📍 {item.location}</p>}
              {item.estimatedCost && <p className="text-xs font-semibold text-accent-violet">{item.estimatedCost}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-card-lg)] border border-border bg-surface-elevated shadow-[var(--shadow-soft)]">
          <EmptyState
            icon={Heart}
            title="No favorites saved"
            description="Save places and experiences from your itineraries to quickly access them later."
          />
        </div>
      )}
    </div>
  );
}
