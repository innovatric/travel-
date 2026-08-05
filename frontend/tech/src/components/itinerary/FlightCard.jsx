import { motion } from 'framer-motion';
import { Plane, PlaneTakeoff, PlaneLanding, Heart, MapPin, Replace, Trash2, Ticket } from 'lucide-react';

export default function FlightCard({ flight, isSaved, onSelect, onRemove, onFavorite, onReplace }) {
  const airline = flight.airline || flight.provider || 'IndiGo / Air India';
  const flightNo = flight.flightNumber || flight.flightNo || `TF-${Math.floor(100 + Math.random() * 899)}`;
  const status = flight.status || 'CONFIRMED';
  const depTime = flight.departureTime || flight.time || '08:00 AM';
  const arrTime = flight.arrivalTime || '11:30 AM';
  const duration = flight.duration || '3h 30m';
  const cost = flight.estimatedCost || (flight.price ? `INR ${flight.price}` : 'INR 4,800');

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="overflow-hidden rounded-[1.25rem] border border-blue-500/30 bg-surface-elevated p-5 shadow-sm transition-all hover:border-blue-500/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-500 border border-blue-500/20">
              <Plane className="h-3.5 w-3.5" /> Flight Segment
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-text-secondary border border-border">
              {airline} ({flightNo})
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
              {status}
            </span>
          </div>

          <h4 className="mt-3 text-lg font-bold text-text-primary flex items-center gap-2">
            {flight.title || 'Flight Connection'}
          </h4>
          {flight.description && (
            <p className="mt-1.5 text-sm leading-6 text-text-secondary">{flight.description}</p>
          )}
        </div>

        <button
          onClick={() => onFavorite(flight)}
          className={`rounded-full border p-2 transition-colors ${
            isSaved
              ? 'border-red-500/40 bg-red-500/10 text-red-500'
              : 'border-border text-text-secondary hover:bg-border-subtle hover:text-accent-violet'
          }`}
          aria-label="Favorite flight"
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Flight Ticket Visual Box */}
      <div className="mt-4 rounded-xl border border-border/80 bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Departure</p>
              <p className="text-sm font-bold text-text-primary">{depTime}</p>
              <p className="text-xs text-text-secondary">{flight.location || 'Origin Airport'}</p>
            </div>
          </div>

          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] font-bold text-blue-500">{duration}</span>
            <div className="my-1 flex items-center gap-1 text-blue-400">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
              <Plane className="h-3.5 w-3.5 rotate-90" />
            </div>
            <span className="text-[10px] text-text-muted">Non-stop</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Arrival</p>
              <p className="text-sm font-bold text-text-primary">{arrTime}</p>
              <p className="text-xs text-text-secondary">Destination Airport</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <PlaneLanding className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
          <span className="flex items-center gap-1 font-semibold text-text-primary">
            <Ticket className="h-3.5 w-3.5 text-blue-500" /> Fare: {cost}
          </span>
          <span className="text-text-muted">Baggage: 15kg check-in + 7kg cabin included</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(flight)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
        >
          <MapPin className="h-3.5 w-3.5 text-blue-500" /> View flight route
        </button>
        <button
          onClick={() => onReplace(flight)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
        >
          <Replace className="h-3.5 w-3.5" /> Change flight
        </button>
        <button
          onClick={() => onRemove(flight)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" /> Remove
        </button>
      </div>
    </motion.div>
  );
}
