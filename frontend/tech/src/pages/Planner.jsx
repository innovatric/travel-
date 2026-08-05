import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Sparkles, MapPin, Clock, Zap, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import TripMapPreview from '../components/planner/TripMapPreview';
import { useTrip } from '../context/TripContext';

const interestOptions = ['Beaches', 'Nature', 'Adventure', 'Food', 'History', 'Culture', 'Shopping', 'Nightlife', 'Relaxation', 'Photography'];
const paceOptions = ['Relaxed', 'Balanced', 'Fast-paced'];
const accommodationOptions = ['Budget', 'Mid-range', 'Premium', 'Luxury'];
const transportOptions = ['Flight', 'Train', 'Bus', 'Car', 'Let AI decide'];
const foodOptions = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Local cuisine', 'No preference'];
const currencyOptions = ['INR', 'USD', 'EUR', 'GBP'];

// ── Distance & Transport Intelligence ──────────────────────────────────────
const PLACE_COORDS = {
  'rajahmundry': [17.0005, 81.804], 'rjy': [17.0005, 81.804],
  'goa': [15.2993, 74.124], 'hyderabad': [17.385, 78.4867],
  'vijayawada': [16.5062, 80.648], 'visakhapatnam': [17.6868, 83.2185],
  'vizag': [17.6868, 83.2185], 'bangalore': [12.9716, 77.5946],
  'mumbai': [19.076, 72.8777], 'delhi': [28.6139, 77.209],
  'new delhi': [28.6139, 77.209], 'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639], 'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125], 'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739], 'kochi': [9.9312, 76.2673],
  'kerala': [10.8505, 76.2711], 'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714], 'surat': [21.1702, 72.8311],
  'bhopal': [23.2599, 77.4126], 'indore': [22.7196, 75.8577],
  'nagpur': [21.1458, 79.0882], 'solapur': [17.6599, 75.9064],
  'hubli': [15.3647, 75.124], 'belgaum': [15.8497, 74.4977],
  'mangalore': [12.9141, 74.856], 'mysore': [12.2958, 76.6394],
  'paris': [48.8566, 2.3522], 'london': [51.5074, -0.1278],
  'tokyo': [35.6762, 139.6503], 'dubai': [25.2048, 55.2708],
  'bali': [-8.4095, 115.1889], 'singapore': [1.3521, 103.8198],
  'bangkok': [13.7563, 100.5018], 'new york': [40.7128, -74.006],
};

function getPlaceCoords(name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  for (const [city, coords] of Object.entries(PLACE_COORDS)) {
    if (key.includes(city) || city.includes(key)) return coords;
  }
  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const TRANSPORT_SPEEDS = {
  Flight: { speedKmh: 800, label: 'Flight ✈️', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  Train: { speedKmh: 100, label: 'Train 🚂', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  Bus: { speedKmh: 60, label: 'Bus 🚌', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  Car: { speedKmh: 80, label: 'Car 🚗', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  'Let AI decide': { speedKmh: null, label: 'AI Suggested 🤖', color: 'text-pink-500', bg: 'bg-pink-500/10' },
};

function getBestTransport(distKm) {
  if (distKm < 200) return { label: 'Car or Bus 🚗🚌', reason: 'Short distance — road trip is ideal & cost-effective' };
  if (distKm < 500) return { label: 'Train or Car 🚂🚗', reason: 'Mid-range — train is comfortable & economical' };
  if (distKm < 1200) return { label: 'Train or Flight ✈️🚂', reason: 'Long route — train is scenic, flight saves time' };
  return { label: 'Flight ✈️', reason: 'Very long route — flight is strongly recommended' };
}

function formatDuration(hours) {
  if (hours < 1) return 'Less than 1 hr';
  if (hours < 24) return `~${Math.round(hours)} hrs`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return rem > 0 ? `${days}d ${rem}h` : `${days} day${days > 1 ? 's' : ''}`;
}

const defaultForm = {
  prompt: '',
  startLocation: '',
  destinations: [{ id: Date.now(), value: '' }],
  startDate: '',
  endDate: '',
  travellers: '1',
  budget: '',
  currency: 'INR',
  interests: [],
  pace: '',
  accommodation: '',
  transport: '',
  food: '',
  requirements: '',
};

function formatBudget(value) {
  if (!value) return '';
  return value.replace(/[^\d]/g, '');
}

export default function Planner() {
  const navigate = useNavigate();
  const { plannerDraft, plannerForm, setPlannerDraft, setPlannerForm, setPlannerRequest } = useTrip();
  const [form, setForm] = useState(plannerForm || defaultForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (plannerForm) {
      setForm(plannerForm);
      return;
    }

    if (plannerDraft?.prompt) {
      setForm((current) => ({ ...current, prompt: plannerDraft.prompt }));
    }
  }, [plannerDraft, plannerForm]);

  const summaryLocations = useMemo(() => {
    if (!Array.isArray(form?.destinations)) return [];
    return form.destinations
      .filter((destination) => destination && typeof destination.value === 'string' && destination.value.trim())
      .map((destination) => ({ value: destination.value, latitude: null, longitude: null }));
  }, [form?.destinations]);

  const validate = () => {
    const nextErrors = {};
    if (!form.startLocation || !form.startLocation.trim()) nextErrors.startLocation = 'Please add a starting location.';
    if (!Array.isArray(form.destinations) || !form.destinations.some((destination) => destination?.value && destination.value.trim())) nextErrors.destinations = 'Add at least one destination.';
    if (!form.startDate) nextErrors.startDate = 'Choose a start date.';
    if (!form.endDate) nextErrors.endDate = 'Choose an end date.';
    if (!form.endDate || !form.startDate || new Date(form.endDate) <= new Date(form.startDate)) nextErrors.dates = 'End date must be after the start date.';
    if (!form.travellers || Number(form.travellers) < 1) nextErrors.travellers = 'Enter at least one traveller.';
    if (!form.budget || Number(formatBudget(form.budget)) <= 0) nextErrors.budget = 'Enter a valid budget.';
    return nextErrors;
  };

  const updateForm = (updater) => {
    setForm(updater);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleDestinationChange = (id, value) => {
    updateForm((current) => ({
      ...current,
      destinations: current.destinations.map((destination) => (destination.id === id ? { ...destination, value } : destination)),
    }));
    setErrors((current) => ({ ...current, destinations: undefined }));
  };

  const addDestination = () => {
    updateForm((current) => ({ ...current, destinations: [...current.destinations, { id: Date.now() + Math.random(), value: '' }] }));
  };

  const removeDestination = (id) => {
    updateForm((current) => ({
      ...current,
      destinations: current.destinations.filter((destination) => destination.id !== id),
    }));
  };

  const moveDestination = (index, direction) => {
    updateForm((current) => {
      const next = [...current.destinations];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...current, destinations: next };
    });
  };

  const toggleChip = (key, value) => {
    updateForm((current) => {
      const currentValues = current[key] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...current, [key]: nextValues };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const destinationList = form.destinations
      .filter((d) => d.value.trim())
      .map((d) => d.value.trim());

    // Store full form in plannerRequest for the Generating page to consume
    const requestPayload = {
      prompt: form.prompt || `Plan a trip from ${form.startLocation} to ${destinationList.join(', ')}`,
      startLocation: form.startLocation,
      destinations: destinationList,
      startDate: form.startDate,
      endDate: form.endDate,
      travellers: Number(form.travellers) || 1,
      budget: Number(formatBudget(form.budget)) || 5000,
      currency: form.currency || 'INR',
      pace: form.pace || 'Balanced',
      accommodation: form.accommodation || 'Mid-range',
      transport: form.transport || 'Car / Shuttle',
      food: form.food || 'Local cuisine',
      requirements: form.requirements || '',
      interests: form.interests,
    };

    setPlannerRequest(requestPayload);
    setPlannerDraft({ prompt: requestPayload.prompt, preferences: form.interests });
    // Navigate to animated generation screen which handles API calls
    navigate('/generating');
    setIsSubmitting(false);
  };

  const duration = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24) + 1))
    : 'Not selected';

  // ── Trip Insights (live computed) ───────────────────────────────────────
  const tripInsights = useMemo(() => {
    const srcCoords = getPlaceCoords(form.startLocation);
    const destNames = form.destinations.filter(d => d.value.trim()).map(d => d.value.trim());
    const destCoords = destNames.length > 0 ? getPlaceCoords(destNames[destNames.length - 1]) : null;

    if (!srcCoords || !destCoords) return null;

    const distKm = haversineKm(srcCoords[0], srcCoords[1], destCoords[0], destCoords[1]);
    // Road distance is roughly 1.3× straight-line distance
    const roadKm = Math.round(distKm * 1.3);

    const transportKey = form.transport && TRANSPORT_SPEEDS[form.transport] ? form.transport : null;
    const speed = transportKey ? TRANSPORT_SPEEDS[transportKey].speedKmh : 80;
    const travelHours = speed ? roadKm / speed : null;

    const bestTransport = getBestTransport(roadKm);
    const selectedInfo = transportKey ? TRANSPORT_SPEEDS[transportKey] : null;

    return { distKm, roadKm, travelHours, bestTransport, selectedInfo, transportKey };
  }, [form.startLocation, form.destinations, form.transport]);

  const travelSummary = [
    { label: 'Starting location', value: form.startLocation || 'Not selected' },
    { label: 'Destination route', value: form.destinations.filter((destination) => destination.value.trim()).map((destination) => destination.value).join(' → ') || 'Not selected' },
    { label: 'Travel dates', value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : 'Not selected' },
    { label: 'Duration', value: duration === 'Not selected' ? 'Not selected' : `${duration} day${duration > 1 ? 's' : ''}` },
    { label: 'Travellers', value: form.travellers || 'Not selected' },
    { label: 'Budget', value: form.budget ? `${form.currency} ${Number(formatBudget(form.budget)).toLocaleString()}` : 'Not selected' },
    { label: 'Selected interests', value: form.interests.length ? form.interests.join(', ') : 'Not selected' },
    { label: 'Travel preferences', value: [form.pace, form.accommodation, form.transport, form.food].filter(Boolean).join(' • ') || 'Not selected' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-card-lg border border-border bg-surface-elevated p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-border p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-violet">Create your journey</p>
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Tell us what you’re imagining</h2>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              Tell us what you’re imagining. We’ll turn it into a complete travel plan.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
          <span className="rounded-full bg-accent-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-violet">Progress</span>
          <span>Share your trip essentials</span>
          <span className="text-text-muted">•</span>
          <span>Confirm the overview</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <section className="rounded-card-lg border border-border bg-surface-elevated p-6 shadow-soft">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text-primary">Describe your trip</span>
              <textarea
                name="prompt"
                value={form.prompt}
                onChange={handleChange}
                rows={5}
                placeholder="Plan a 5-day trip from Hyderabad to Goa and Mumbai..."
                className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </label>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Starting location</span>
                <input
                  name="startLocation"
                  value={form.startLocation}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                {errors.startLocation && <p className="mt-2 text-sm text-danger">{errors.startLocation}</p>}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Travellers</span>
                <input
                  name="travellers"
                  type="number"
                  min="1"
                  value={form.travellers}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none"
                />
                {errors.travellers && <p className="mt-2 text-sm text-danger">{errors.travellers}</p>}
              </label>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-border bg-surface px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Route order</p>
                  <p className="text-sm text-text-secondary">Add, remove, and reorder your destinations.</p>
                </div>
                <button
                  type="button"
                  onClick={addDestination}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-border-subtle"
                >
                  <Plus className="h-4 w-4" />
                  Add another destination
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {form.destinations.map((destination, index) => (
                  <div key={destination.id} className="rounded-2xl border border-border bg-surface-elevated p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-text-secondary">
                          {index + 1}
                        </div>
                        <div className="text-sm text-text-secondary">{index === 0 ? 'Starting point' : `Destination ${index}`}</div>
                      </div>
                      <input
                        value={destination.value}
                        onChange={(event) => handleDestinationChange(destination.id, event.target.value)}
                        placeholder={index === 0 ? 'Add your starting point' : 'Add a destination'}
                        className="flex-1 rounded-2xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveDestination(index, -1)}
                          className="rounded-xl border border-border p-2 text-text-secondary transition-colors hover:bg-border-subtle"
                          aria-label="Move destination up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDestination(index, 1)}
                          className="rounded-xl border border-border p-2 text-text-secondary transition-colors hover:bg-border-subtle"
                          aria-label="Move destination down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        {form.destinations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDestination(destination.id)}
                            className="rounded-xl border border-border p-2 text-text-secondary transition-colors hover:bg-border-subtle"
                            aria-label="Remove destination"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.destinations && <p className="mt-3 text-sm text-danger">{errors.destinations}</p>}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Start date</span>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none"
                />
                {errors.startDate && <p className="mt-2 text-sm text-danger">{errors.startDate}</p>}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">End date</span>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none"
                />
                {errors.endDate && <p className="mt-2 text-sm text-danger">{errors.endDate}</p>}
                {errors.dates && <p className="mt-2 text-sm text-danger">{errors.dates}</p>}
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Total budget</span>
                <div className="flex gap-2">
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={(event) => handleChange({ target: { name: 'budget', value: formatBudget(event.target.value) } })}
                    placeholder="50000"
                    className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="rounded-2xl border border-border bg-surface px-3 py-3 text-sm text-text-primary focus:outline-none"
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.budget && <p className="mt-2 text-sm text-danger">{errors.budget}</p>}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Travel interests</span>
                <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface px-3 py-3">
                  {interestOptions.map((option) => {
                    const active = form.interests.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleChip('interests', option)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-all ${active ? 'border-accent-violet/30 bg-accent-violet/10 text-accent-violet' : 'border-border text-text-secondary hover:text-text-primary'}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Travel pace</span>
                <select name="pace" value={form.pace} onChange={handleChange} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none">
                  <option value="">Select pace</option>
                  {paceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Accommodation preference</span>
                <select name="accommodation" value={form.accommodation} onChange={handleChange} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none">
                  <option value="">Select accommodation</option>
                  {accommodationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Transportation preference</span>
                <select name="transport" value={form.transport} onChange={handleChange} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none">
                  <option value="">Select transport</option>
                  {transportOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text-primary">Food preference</span>
                <select name="food" value={form.food} onChange={handleChange} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:outline-none">
                  <option value="">Select food preference</option>
                  {foodOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold text-text-primary">Additional requirements</span>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="Any preferences around accessibility, luggage, pace, or special needs?"
                className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </label>
          </section>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-6"
        >
          <div className="sticky top-24 rounded-card-lg border border-border bg-surface-elevated p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-violet">Live summary</p>
                <h3 className="text-xl font-semibold text-text-primary">Trip overview</h3>
              </div>
              <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                Draft
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {travelSummary.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-surface px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">{item.label}</p>
                  <p className="mt-1 text-sm text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-border bg-surface px-4 py-4">
              <TripMapPreview locations={summaryLocations} />
            </div>

            {/* ── Trip Insights Card ─────────────────────────── */}
            {tripInsights && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-4 rounded-2xl border border-accent-violet/20 bg-gradient-to-br from-accent-violet/5 to-pink-500/5 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-accent-violet" />
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-violet">Trip Insights</p>
                </div>

                <div className="space-y-3">
                  {/* Distance */}
                  <div className="flex items-start gap-3 rounded-xl bg-surface px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500/10">
                      <MapPin className="h-4 w-4 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Total Distance</p>
                      <p className="text-sm font-bold text-text-primary">{tripInsights.roadKm.toLocaleString()} km</p>
                      <p className="text-[11px] text-text-secondary">(≈ {tripInsights.distKm} km straight-line)</p>
                    </div>
                  </div>

                  {/* Travel Time */}
                  {tripInsights.travelHours !== null && (
                    <div className="flex items-start gap-3 rounded-xl bg-surface px-3 py-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Travel Time</p>
                        <p className="text-sm font-bold text-text-primary">{formatDuration(tripInsights.travelHours)}</p>
                        <p className="text-[11px] text-text-secondary">
                          via {tripInsights.selectedInfo?.label || 'Car 🚗'} (avg {tripInsights.transportKey ? TRANSPORT_SPEEDS[tripInsights.transportKey].speedKmh : 80} km/h)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Best Transport */}
                  <div className="flex items-start gap-3 rounded-xl bg-surface px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Zap className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Best Transport</p>
                      <p className="text-sm font-bold text-text-primary">{tripInsights.bestTransport.label}</p>
                      <p className="text-[11px] text-text-secondary">{tripInsights.bestTransport.reason}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
              <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
                <Sparkles className="h-4 w-4" />
                Generate My Journey
              </Button>
            </div>
          </div>
        </motion.aside>
      </form>
    </div>
  );
}
