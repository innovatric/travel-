import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Heart,
  Landmark,
  Map,
  NotebookPen,
  Route,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import QuickActionCard from '../components/common/QuickActionCard';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

const preferenceOptions = ['Multi-city', 'Budget friendly', 'Adventure', 'Food', 'Beaches', 'Culture'];

const quickActions = [
  {
    title: 'Create New Trip',
    description: 'Start a fresh planning session and shape your journey from scratch.',
    to: '/planner',
    icon: NotebookPen,
  },
  {
    title: 'Explore Map',
    description: 'Discover popular destinations, interactive maps, and regional guides.',
    to: '/explore',
    icon: Route,
  },
  {
    title: 'My Trips',
    description: 'View and manage all your saved multi-day trip itineraries.',
    to: '/trips',
    icon: Map,
  },
  {
    title: 'Saved Favorites',
    description: 'Access your favorite saved stays, food spots, and activities.',
    to: '/favorites',
    icon: Heart,
  },
];

const capabilities = [
  {
    title: 'Multi-City Route Planning',
    description: 'Coordinate connected stops, travel gaps, and transition pacing with clarity.',
    icon: Route,
    to: '/planner',
    actionText: 'Plan multi-city',
  },
  {
    title: 'Smart Budget Optimization',
    description: 'Balance stay quality, local experiences, and transport with a practical spend lens.',
    icon: Wallet,
    to: '/planner',
    actionText: 'Optimize budget',
  },
  {
    title: 'Personalized Itineraries',
    description: 'Shape each day around your interests, pace, and preferred travel rhythm.',
    icon: Compass,
    to: '/planner',
    actionText: 'Build itinerary',
  },
  {
    title: 'Interactive Journey Maps',
    description: 'Visualize your path and keep every destination aligned with the larger trip story.',
    icon: Landmark,
    to: '/explore',
    actionText: 'Explore route map',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isDevelopmentMode } = useAuth();
  const { trips = [], setPlannerDraft } = useTrip();
  const [prompt, setPrompt] = useState('');
  const [preferences, setPreferences] = useState([]);

  const firstName = user?.firstName || user?.name?.split(' ')[0] || '';
  const welcomeTitle = firstName ? `Welcome back, ${firstName}` : 'Welcome to TripFlow AI';

  const togglePreference = (value) => {
    setPreferences((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const handleStartPlanning = () => {
    setPlannerDraft({ prompt, preferences });
    navigate('/planner');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-(--radius-card-lg) border border-border bg-surface-elevated p-6 shadow-(--shadow-soft) sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-violet">
                {welcomeTitle}
              </p>
              {isDevelopmentMode && (
                <span className="rounded-full border border-accent-violet/20 bg-accent-violet/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-violet">
                  Development Preview
                </span>
              )}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Where should your next journey take you?
            </h2>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              Shape a calm, premium planning experience with AI guidance for routes, stays, pacing, and budget.
            </p>
          </div>
          <Button size="lg" onClick={handleStartPlanning} className="whitespace-nowrap">
            <Sparkles className="h-5 w-5" />
            Start Planning
          </Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-card-lg border border-border bg-surface-elevated p-6 shadow-card sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.13),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_38%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-violet">
            <Sparkles className="h-3.5 w-3.5" />
            AI TRIP PLANNER
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Plan your entire journey with AI
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                Describe your dream trip and let AI organize your destinations, route, stays, experiences, and budget in one refined workspace.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-border/80 bg-white/80 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-ai-subtle">
                  <Sparkles className="h-5 w-5 text-accent-violet" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={4}
                    placeholder="Plan a 7-day trip from Hyderabad to Goa and Mumbai under ₹50,000..."
                    className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {preferenceOptions.map((option) => {
                      const active = preferences.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => togglePreference(option)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                            active
                              ? 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet'
                              : 'border-border bg-white text-text-secondary hover:border-accent-violet/20 hover:text-text-primary'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-text-secondary">
                      These selections stay in your browser and help shape the planner draft.
                    </p>
                    <Button onClick={handleStartPlanning} className="whitespace-nowrap">
                      <ArrowRight className="h-4 w-4" />
                      Continue to planner
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="rounded-(--radius-card-lg) border border-border bg-surface-elevated p-6 shadow-(--shadow-soft)"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Recent Trips</h3>
              <p className="mt-1 text-sm text-text-secondary">Your most recent AI-planning work will appear here.</p>
            </div>
            <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              Live state
            </div>
          </div>
          <div className="mt-6">
            {trips.length > 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-sm text-text-secondary">
                Trip data will render here once your backend returns real trip records.
              </div>
            ) : (
              <EmptyState
                icon={Map}
                title="No trips yet"
                description="Your AI-planned journeys will appear here once you begin building them."
                action={
                  <Button variant="outline" onClick={() => navigate('/planner')}>
                    Plan your first trip
                  </Button>
                }
              />
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="rounded-(--radius-card-lg) border border-border bg-surface-elevated p-6 shadow-(--shadow-soft)"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Upcoming Trips</h3>
              <p className="mt-1 text-sm text-text-secondary">Drafts and plans you save will stay organized here.</p>
            </div>
            <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              Ready soon
            </div>
          </div>
          <div className="mt-6">
            <EmptyState
              icon={CalendarDays}
              title="Nothing scheduled yet"
              description="Upcoming journeys will appear once you have a confirmed itinerary flow."
              action={
                <Button variant="outline" onClick={() => navigate('/planner')}>
                  Open planner
                </Button>
              }
            />
          </div>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="rounded-(--radius-card-lg) border border-border bg-surface-elevated p-6 shadow-(--shadow-soft) sm:p-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">AI capabilities</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-text-secondary">
              TripFlow AI is designed as a calm, intelligent travel workspace for planning, refining, and organizing your next route.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <motion.button
                key={capability.title}
                onClick={() => navigate(capability.to)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col text-left rounded-[1.5rem] border border-border bg-surface px-5 py-5 transition-all hover:border-accent-violet/50 hover:bg-accent-violet/5 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-violet/10 group-hover:bg-accent-violet group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5 text-accent-violet group-hover:text-white transition-colors" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-text-primary group-hover:text-accent-violet transition-colors">{capability.title}</h4>
                <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">{capability.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-violet group-hover:underline">
                  {capability.actionText}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
