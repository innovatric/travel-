import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import TransportCard from './TransportCard';
import HotelCard from './HotelCard';
import RestaurantCard from './RestaurantCard';
import FlightCard from './FlightCard';

export default function DaySection({ day, savedIds = new Set(), onSelect, onRemove, onFavorite, onReplace }) {
  const items = day?.items || [];

  if (!day) {
    return null;
  }

  const isFlightItem = (item) => {
    const t = (item.type || '').toLowerCase();
    const c = (item.category || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();

    return (
      t === 'flight' ||
      c === 'flight' ||
      c === 'air' ||
      title.includes('flight') ||
      desc.includes('flight')
    );
  };

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-[1.25rem] border border-border bg-surface-elevated p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-violet">Day {day.dayNumber || 1}</p>
            <h3 className="mt-1 text-xl font-semibold text-text-primary">{day.title || 'Planned day'}</h3>
          </div>
          {day.date && <p className="text-sm text-text-secondary">{day.date}</p>}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-border bg-surface p-6 text-center text-sm text-text-secondary">
          No itinerary items left for this day.
        </div>
      ) : (
        items.map((item) => {
          const isSaved = savedIds?.has?.(item.id);
          if (isFlightItem(item)) {
            return (
              <FlightCard
                key={item.id || item.title}
                flight={item}
                isSaved={isSaved}
                onSelect={onSelect}
                onRemove={onRemove}
                onFavorite={() => onFavorite(item)}
                onReplace={onReplace}
              />
            );
          }
          if (item.type === 'transport') return <TransportCard key={item.id || item.title} transport={item} isSaved={isSaved} onSelect={onSelect} onRemove={onRemove} onFavorite={() => onFavorite(item)} onReplace={onReplace} />;
          if (item.type === 'hotel') return <HotelCard key={item.id || item.title} hotel={item} isSaved={isSaved} onSelect={onSelect} onRemove={onRemove} onFavorite={() => onFavorite(item)} onReplace={onReplace} />;
          if (item.type === 'restaurant') return <RestaurantCard key={item.id || item.title} restaurant={item} isSaved={isSaved} onSelect={onSelect} onRemove={onRemove} onFavorite={() => onFavorite(item)} onReplace={onReplace} />;
          return <ActivityCard key={item.id || item.title} activity={item} isSaved={isSaved} onSelect={onSelect} onRemove={onRemove} onFavorite={() => onFavorite(item)} onReplace={onReplace} />;
        })
      )}
    </motion.section>
  );
}
