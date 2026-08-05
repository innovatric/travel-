import { motion } from 'framer-motion';
import { ArrowRightLeft, Heart, MapPin, Replace, Trash2 } from 'lucide-react';

export default function TransportCard({ transport, isSaved, onSelect, onRemove, onFavorite, onReplace }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="rounded-[1.25rem] border border-border bg-surface-elevated p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">Transport</span>
            {transport.time && <span className="text-sm text-text-secondary">{transport.time}</span>}
          </div>
          <h4 className="mt-2 text-base font-semibold text-text-primary">{transport.title || 'Travel segment'}</h4>
          {transport.description && <p className="mt-2 text-sm leading-6 text-text-secondary">{transport.description}</p>}
        </div>
        <button
          onClick={() => onFavorite(transport)}
          className={`rounded-full border p-2 transition-colors ${
            isSaved
              ? 'border-red-500/40 bg-red-500/10 text-red-500'
              : 'border-border text-text-secondary hover:bg-border-subtle hover:text-accent-violet'
          }`}
          aria-label="Favorite transport"
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        {transport.location && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1">
            <MapPin className="h-3.5 w-3.5" />
            {transport.location}
          </span>
        )}
        {transport.duration && <span>{transport.duration}</span>}
        {transport.estimatedCost && <span>{transport.estimatedCost}</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onSelect(transport)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
          <ArrowRightLeft className="h-4 w-4" />
          View route
        </button>
        <button onClick={() => onReplace(transport)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
          <Replace className="h-4 w-4" />
          Replace
        </button>
        <button onClick={() => onRemove(transport)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary">
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </motion.div>
  );
}
