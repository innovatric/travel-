import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';

export default function TripMapPreview({ locations = [] }) {
  const hasValidLocations = locations.some((location) => location?.latitude && location?.longitude);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-surface px-4 py-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">Route preview</p>
          <p className="text-sm text-text-secondary">Prepared for future map and geocoding integration.</p>
        </div>
      </div>

      <div className="flex h-64 items-center justify-center rounded-[1.25rem] border border-dashed border-border bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,246,249,0.92))]">
        {hasValidLocations ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl gradient-ai-subtle">
              <MapPinned className="h-6 w-6 text-accent-violet" />
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary">Map markers and route lines will render here</p>
            <p className="mt-1 text-sm text-text-secondary">
              Add latitude and longitude data from a future geocoding source.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl gradient-ai-subtle">
              <MapPinned className="h-6 w-6 text-accent-violet" />
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary">Your journey will appear here as you add destinations.</p>
            <p className="mt-1 text-sm text-text-secondary">
              The map layer is ready for future location data without hardcoded trip destinations.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
