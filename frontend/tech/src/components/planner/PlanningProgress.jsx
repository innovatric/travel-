import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

const defaultSteps = [
  'Understanding your trip',
  'Analyzing destinations',
  'Finding travel options',
  'Finding suitable stays',
  'Discovering experiences',
  'Optimizing your budget',
  'Building your day-by-day itinerary',
];

export default function PlanningProgress({ steps = defaultSteps, currentStep = 0, status = 'idle' }) {
  const activeIndex = Math.min(Math.max(currentStep, 0), steps.length - 1);

  return (
    <div className="rounded-[1.5rem] border border-border bg-surface px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Planning workflow</p>
          <p className="text-sm text-text-secondary">Live progress updates will connect here once the backend streams events.</p>
        </div>
        <div className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-violet">
          {status}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 rounded-2xl border px-3 py-3 ${
                isCompleted
                  ? 'border-accent-violet/20 bg-accent-violet/10'
                  : isActive
                    ? 'border-accent-violet/20 bg-surface-elevated'
                    : 'border-border bg-surface'
              }`}
            >
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-accent-violet text-white' : isActive ? 'bg-surface-elevated text-accent-violet' : 'bg-surface text-text-muted'}`}>
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${isCompleted || isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{step}</p>
                <p className="text-sm text-text-secondary">
                  {isCompleted ? 'Completed in your workflow' : isActive ? 'Current step' : 'Pending'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
