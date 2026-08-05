import { useEffect, useState } from 'react';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import api from '../services/api';

export default function Explore() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations')
      .then((res) => {
        setDestinations(res.data || []);
      })
      .catch((err) => {
        console.warn('Failed to load destinations:', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handlePlanDestination = (destName) => {
    navigate('/planner');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Explore Destinations</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Discover curated global destinations and plan your next journey with AI
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-text-secondary">Loading destinations...</div>
      ) : destinations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div key={dest.destinationId || dest.name} className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-violet">
                <MapPin className="h-3.5 w-3.5" />
                {dest.country || 'Featured'}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-text-primary">{dest.name}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{dest.description}</p>
              
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-muted">
                  {dest.category || 'Popular'}
                </span>
                <Button size="sm" onClick={() => handlePlanDestination(dest.name)}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Plan Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface-elevated p-8 text-center shadow-soft">
          <p className="text-sm text-text-secondary">No destinations currently available.</p>
          <Button variant="outline" className="mt-4 gap-2" onClick={() => navigate('/planner')}>
            <Compass className="h-4 w-4" />
            Start planning manually
          </Button>
        </div>
      )}
    </div>
  );
}
