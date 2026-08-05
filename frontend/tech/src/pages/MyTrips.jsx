import { useEffect, useMemo } from 'react';
import { Map, Plus, Calendar, DollarSign, Compass, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useTrip } from '../context/TripContext';

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips = [], localTrips = [], fetchTrips, deleteTripFromHistory, setPlannerDraft, isLoading } = useTrip();

  useEffect(() => {
    fetchTrips().catch((err) => console.warn('Could not fetch trips from API:', err));
  }, [fetchTrips]);

  const allTrips = useMemo(() => {
    const combined = [...(Array.isArray(trips) ? trips : []), ...(Array.isArray(localTrips) ? localTrips : [])];
    const seenIds = new Set();
    const seenNames = new Set();

    return combined.filter((trip) => {
      const idKey = String(trip.tripId || trip.id || '');
      const nameKey = (trip.tripName || `${trip.startLocation || ''}-${trip.destination || ''}`).toLowerCase().trim();

      if (idKey && seenIds.has(idKey)) return false;
      if (nameKey && nameKey.length > 3 && seenNames.has(nameKey)) return false;

      if (idKey) seenIds.add(idKey);
      if (nameKey && nameKey.length > 3) seenNames.add(nameKey);

      return true;
    });
  }, [trips, localTrips]);

  const handleOpenTrip = (trip) => {
    if (trip.itinerary) {
      setPlannerDraft({
        prompt: `Trip to ${trip.destination || trip.startLocation || 'Destination'}`,
        preferences: [],
        itinerary: trip.itinerary,
      });
    }
    const targetId = trip.tripId || trip.id || 'preview';
    navigate(`/itinerary/${targetId}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Trip History ({allTrips.length})</h2>
          <p className="mt-1 text-sm text-text-secondary">
            View, re-open, and manage all your planned AI journeys
          </p>
        </div>
        <Link to="/planner">
          <Button>
            <Plus className="h-4 w-4" />
            New trip
          </Button>
        </Link>
      </div>

      {isLoading && allTrips.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-secondary">Loading your trip history...</div>
      ) : allTrips.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allTrips.map((trip) => {
            const tripId = trip.tripId || trip.id;
            return (
              <div
                key={tripId || trip.tripName}
                onClick={() => handleOpenTrip(trip)}
                className="group cursor-pointer rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-violet/50 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent-violet/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-violet">
                    {trip.status || 'Planned'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTripFromHistory(tripId);
                    }}
                    className="text-text-muted hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                    title="Delete trip from history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent-violet transition-colors">
                  {trip.tripName || `Trip to ${trip.destination || trip.startLocation}`}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  📍 {trip.startLocation} → {trip.destination || 'Destination'}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-text-secondary">
                  {trip.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-accent-violet" />
                      {trip.startDate}
                    </span>
                  )}
                  {trip.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-accent-violet" />
                      {trip.currency || 'INR'} {Number(trip.budget).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-accent-violet font-semibold flex items-center gap-1 group-hover:underline">
                    <Compass className="h-3.5 w-3.5" /> Re-open Full Itinerary
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent-violet opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[var(--radius-card-lg)] border border-border bg-surface-elevated shadow-[var(--shadow-soft)]">
          <EmptyState
            icon={Map}
            title="No trip history found"
            description="Your generated trip itineraries will be automatically saved here so you can re-open them anytime."
            action={
              <Link to="/planner">
                <Button>
                  <Plus className="h-4 w-4" />
                  Plan your first trip
                </Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
