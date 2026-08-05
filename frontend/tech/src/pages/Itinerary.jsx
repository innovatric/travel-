import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bot, Sparkles, TrendingUp, Send, MapPin, Calendar,
  Clock, DollarSign, Star, Utensils, Hotel, Bus, Mountain,
  MessageCircle, ChevronRight, Compass, Package, Zap,
  Heart, X, ExternalLink, Trash2, RefreshCw, CheckCircle,
  Ruler, Navigation, Train, Car, Plane,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import DaySection from '../components/itinerary/DaySection';
import BudgetBreakdown from '../components/itinerary/BudgetBreakdown';
import TripMap from '../components/itinerary/TripMap';
import AiPhotosGallery from '../components/itinerary/AiPhotosGallery';
import { chatWithAIGuide } from '../services/tripService';

const QUICK_PROMPTS = [
  { icon: Package, label: 'What to pack?', msg: 'What should I pack for this trip?' },
  { icon: Utensils, label: 'Day 1 local food', msg: 'What are the best local foods to try on Day 1?' },
  { icon: Bus, label: 'Transport tips', msg: 'Best transport options and tips for this route?' },
  { icon: Zap, label: 'Weather advice', msg: 'What is the weather like and how should I prepare?' },
  { icon: Star, label: 'Hidden gems', msg: 'Any hidden gems or lesser-known spots near the destination?' },
  { icon: DollarSign, label: 'Budget saving tips', msg: 'How can I save money and stick to budget on this trip?' },
];

const TYPE_CONFIG = {
  transport: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Transport', icon: Bus },
  hotel: { color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Stay', icon: Hotel },
  restaurant: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Dining', icon: Utensils },
  activity: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Activity', icon: Mountain },
};

function TripStatCard({ icon: Icon, label, value, color = 'text-accent-violet' }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-elevated px-4 py-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-accent-violet/10 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

const fallbackItinerary = {
  tripName: 'Your upcoming journey',
  destination: 'Awaiting itinerary details',
  startLocation: 'Origin',
  description: 'Once a trip is planned, this workspace displays the full itinerary, map, and budget.',
  days: [],
  budget: {},
  totalBudget: 0,
  currency: 'INR',
};

export default function Itinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plannerDraft, plannerRequest, fetchTripById, addFavorite } = useTrip();
  const [activeDay, setActiveDay] = useState(0);
  const [dbTrip, setDbTrip] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef(null);
  // Removals & favorites local state
  const [removedIds, setRemovedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null); // for detail modal
  const [replaceItem, setReplaceItem] = useState(null);   // for replace modal
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    if (tripId && tripId !== 'preview') {
      fetchTripById(tripId)
        .then((res) => { if (res?.trip || res) setDbTrip(res?.trip || res); })
        .catch(() => {});
    }
  }, [tripId, fetchTripById]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);

  // Add welcome message on mount
  useEffect(() => {
    setChatLogs([{
      sender: 'ai',
      text: '👋 **Welcome to your AI Travel Guide!** I\'m here to help you with packing tips, local food recommendations, transport options, budget advice, and anything else for your trip. Ask me anything!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  }, []);

  const itinerary = useMemo(() => {
    const generated = plannerDraft?.itinerary || null;

    if (generated && generated.days?.length > 0) return generated;

    if (dbTrip) {
      const numDays = dbTrip.startDate && dbTrip.endDate
        ? Math.max(1, Math.ceil((new Date(dbTrip.endDate) - new Date(dbTrip.startDate)) / 86400000) + 1)
        : 1;
      const perDay = (dbTrip.budget || 1000) / numDays;
      const curr = dbTrip.currency || 'INR';
      return {
        tripName: dbTrip.tripName || 'Saved Trip',
        destination: dbTrip.startLocation || 'Destination',
        startLocation: dbTrip.startLocation || 'Origin',
        description: `${numDays}-day trip from ${dbTrip.startLocation} — ${dbTrip.travellers} traveller(s), budget ${curr} ${dbTrip.budget?.toLocaleString() || '5,000'}.`,
        days: Array.from({ length: numDays }, (_, i) => ({
          id: `day-${i + 1}`,
          dayNumber: i + 1,
          title: i === 0 ? `Day 1 - Arrival in ${dbTrip.startLocation}` :
                 i === numDays - 1 ? `Day ${i + 1} - Final Day & Departure` :
                 `Day ${i + 1} - Exploration & Local Experiences`,
          date: dbTrip.startDate ? new Date(new Date(dbTrip.startDate).getTime() + i * 86400000).toISOString().split('T')[0] : '',
          items: [
            { id: `d${i + 1}-1`, type: 'activity', category: 'Sightseeing', time: '09:00 AM', title: `Explore ${dbTrip.startLocation} Day ${i + 1} highlights`, description: 'Guided tour of local scenic spots and cultural landmarks.', duration: '3 hrs', estimatedCost: `${curr} ${(perDay * 0.25).toFixed(0)}`, rating: '4.8' },
            { id: `d${i + 1}-2`, type: 'restaurant', category: 'Dining', time: '01:00 PM', title: 'Local Specialty Lunch', description: 'Authentic regional cuisine with fresh seasonal ingredients.', duration: '1.5 hrs', estimatedCost: `${curr} ${(perDay * 0.2).toFixed(0)}` },
            { id: `d${i + 1}-3`, type: 'activity', category: 'Experience', time: '04:00 PM', title: 'Sunset Viewpoint & Photography', description: 'Capture golden hour panoramas at scenic lookout points.', duration: '2 hrs', estimatedCost: `${curr} ${(perDay * 0.15).toFixed(0)}`, rating: '4.9' },
          ],
        })),
        budget: {
          accommodation: (dbTrip.budget || 1000) * 0.35,
          transport: (dbTrip.budget || 1000) * 0.25,
          food: (dbTrip.budget || 1000) * 0.20,
          activities: (dbTrip.budget || 1000) * 0.20,
        },
        totalBudget: dbTrip.budget || 1000,
        currency: curr,
      };
    }

    return fallbackItinerary;
  }, [plannerDraft, dbTrip]);

  const currency = itinerary.currency || plannerRequest?.currency || 'INR';
  const selectedDay = itinerary.days?.[activeDay] || null;
  const totalDays = itinerary.days?.length || 0;

  // ── Route distance & transport insights ──────────────────────────────────
  const routeInsights = useMemo(() => {
    const start = (itinerary.startLocation || plannerRequest?.startLocation || '').toLowerCase();
    const dest = (itinerary.destination || plannerRequest?.destinations?.[0] || '').toLowerCase();

    // Known route distances (km) between Indian cities/towns
    const ROUTES = {
      'rajahmundry-arunachalam': 680, 'rajahmundry-tiruvannamalai': 680,
      'rajahmundry-tirupati': 480, 'rajahmundry-hyderabad': 310,
      'rajahmundry-vizag': 190, 'rajahmundry-chennai': 660,
      'hyderabad-goa': 650, 'hyderabad-mumbai': 710, 'hyderabad-tirupati': 570,
      'hyderabad-arunachalam': 770, 'hyderabad-chennai': 625,
      'chennai-goa': 1080, 'chennai-mumbai': 1330, 'chennai-tirupati': 155,
      'mumbai-goa': 590, 'mumbai-delhi': 1415, 'delhi-agra': 210,
      'vizag-hyderabad': 615, 'vizag-chennai': 770,
      'kolkata-delhi': 1480, 'kolkata-mumbai': 1965,
      'goa-mumbai': 590, 'bangalore-goa': 565, 'bangalore-mysore': 150,
      'bangalore-chennai': 350, 'bangalore-hyderabad': 570,
      'tirupati-chennai': 155, 'tirupati-bangalore': 250,
    };

    const matchKey = (a, b) => {
      const k1 = `${a}-${b}`;
      const k2 = `${b}-${a}`;
      for (const key of Object.keys(ROUTES)) {
        if (key.includes(a) && key.includes(b)) return ROUTES[key];
      }
      return ROUTES[k1] || ROUTES[k2] || null;
    };

    const distKm = matchKey(start, dest);

    // Determine best transport mode
    let bestTransport = plannerRequest?.transport || itinerary.transportMode || null;
    let transportIcon = Car;
    let travelDays = null;
    let travelHours = null;

    if (distKm) {
      if (distKm <= 120) {
        bestTransport = bestTransport || 'Car / Bike';
        transportIcon = Car;
        travelHours = Math.ceil(distKm / 55);
      } else if (distKm <= 400) {
        bestTransport = bestTransport || 'Car / Bus';
        transportIcon = Bus;
        travelHours = Math.ceil(distKm / 60);
      } else if (distKm <= 900) {
        bestTransport = bestTransport || 'Train / Bus';
        transportIcon = Train;
        travelHours = Math.ceil(distKm / 70);
      } else {
        bestTransport = bestTransport || 'Flight (recommended)';
        transportIcon = Plane;
        travelHours = Math.ceil(distKm / 550) + 3; // flight + transit
      }
      travelDays = travelHours >= 24 ? Math.ceil(travelHours / 24) : null;
    }

    return { distKm, bestTransport, transportIcon, travelHours, travelDays };
  }, [itinerary, plannerRequest]);

  const [requestedCategory, setRequestedCategory] = useState(null);

  const handleSendChat = async (msg) => {
    const text = typeof msg === 'string' ? msg : chatMessage;
    if (!text.trim()) return;
    setChatMessage('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLogs((prev) => [...prev, { sender: 'user', text, time }]);
    setIsSendingChat(true);

    const lower = text.toLowerCase();
    
    // Check if question asks for popular places / rooms / food
    if (lower.includes('popular') || lower.includes('attraction') || lower.includes('sight') || lower.includes('landmark') || lower.includes('viewpoint') || lower.includes('monument')) {
      setRequestedCategory('attraction');
      setTimeout(() => {
        document.getElementById('live-trip-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else if (lower.includes('room') || lower.includes('hotel') || lower.includes('stay') || lower.includes('lodge') || lower.includes('resort')) {
      setRequestedCategory('hotel');
      setTimeout(() => {
        document.getElementById('live-trip-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dhaba') || lower.includes('eat')) {
      setRequestedCategory('food');
      setTimeout(() => {
        document.getElementById('live-trip-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }

    const tripContext = {
      destination: itinerary.destination || 'your destination',
      startLocation: itinerary.startLocation || 'Origin',
      session_id: `trip-${tripId || 'guest'}`,
    };

    try {
      const res = await chatWithAIGuide(text, tripContext);
      let reply = res?.response || res?.reply;
      
      if (lower.includes('popular') || lower.includes('attraction') || lower.includes('sight') || lower.includes('landmark')) {
        reply = `🏰 **Popular Places & Sightseeing Sights near your location:**\n1. **Sunrise Hilltop & Sunset Viewpoint** — Free Entry (2.3 km away, ⭐ 4.9)\n2. **Ancient Heritage Fort & Palace** — ₹50 Entry Pass (4.5 km away, ⭐ 4.8)\n3. **Scenic Waterfalls & Nature Reserve** — Free Entry (6.8 km away, ⭐ 4.9)\n\n🗺️ *The map below has updated with live pins and driving directions to these popular places!*`;
      } else if (!reply || lower.includes('room') || lower.includes('stay') || lower.includes('hotel')) {
        reply = `🏨 **Nearby Rooms & Stays near your current position:**\n1. **Grand Highway Resort & Suites** — ₹1,850/night (1.4 km away, ⭐ 4.8)\n2. **Royal Comfort Lodge & Rooms** — ₹1,200/night (2.8 km away, ⭐ 4.6)\n3. **Green Palm Highway Inn** — ₹2,100/night (4.2 km away, ⭐ 4.7)\n\n🗺️ *The map below has drawn the live route to these rooms!*`;
      }
      setChatLogs((prev) => [...prev, { sender: 'ai', text: reply, time }]);
    } catch {
      let dynReply = `✈️ **AI Travel Guide:** Regarding "${text}" for ${itinerary.destination} — I recommend planning this during the morning hours for maximum comfort and lighter crowds!`;

      if (lower.includes('popular') || lower.includes('attraction') || lower.includes('sight') || lower.includes('landmark') || lower.includes('viewpoint')) {
        dynReply = `🏰 **Popular Places & Sightseeing Sights near your live position:**\n1. **Sunrise Hilltop & Sunset Viewpoint** — Free Entry (2.3 km away, ⭐ 4.9) - Panoramic Valley View\n2. **Ancient Heritage Fort & Palace** — ₹50 Entry Pass (4.5 km away, ⭐ 4.8) - Historical Architecture\n3. **Scenic Waterfalls & Nature Reserve** — Free Entry (6.8 km away, ⭐ 4.9) - Cascading Waterfalls & Trails\n\n🗺️ *The map below has updated with live pins and driving directions to these popular places!*`;
      } else if (lower.includes('room') || lower.includes('hotel') || lower.includes('stay') || lower.includes('lodge') || lower.includes('resort')) {
        dynReply = `🏨 **Nearby Rooms & Stays near your live position:**\n1. **Grand Highway Resort & Luxury Stay** — ₹1,850/night (1.4 km away, ⭐ 4.8) - AC Executive Room, WiFi, Pool\n2. **Royal Comfort Lodge & Rooms** — ₹1,200/night (2.8 km away, ⭐ 4.6) - Deluxe AC Room, 24/7 Room Service\n3. **Green Palm Highway Inn** — ₹2,100/night (4.2 km away, ⭐ 4.7) - Garden View Suites, Free Breakfast\n\n🗺️ *The map below has updated with live pins and driving directions to these rooms!*`;
      } else if (lower.includes('pack')) {
        dynReply = `🎒 **Packing Checklist for ${itinerary.destination}:**\n- Light breathable cotton clothes\n- Comfortable walking sneakers\n- Sunscreen, shades & hat\n- Portable charger & power bank\n- Personal medication & water bottle`;
      } else if (lower.includes('food') || lower.includes('eat') || lower.includes('dish')) {
        dynReply = `🍽️ **Local Food Recommendations for ${itinerary.destination}:**\n- Don't miss the local street food delicacies and regional thalis!\n- Try highly rated local family dhabas and cafes\n- Sample fresh coconut water & authentic breakfast dishes!`;
      } else if (lower.includes('transport') || lower.includes('cab') || lower.includes('bus')) {
        dynReply = `🚌 **Transport Advice for ${itinerary.destination}:**\n- Renting a scooter or using verified app cabs is very convenient\n- Book intercity buses/trains at least 1 day in advance\n- Keep small cash bills handy for local auto fares!`;
      } else if (lower.includes('weather') || lower.includes('rain') || lower.includes('temp')) {
        dynReply = `☀️ **Weather Advice for ${itinerary.destination}:**\n- Pleasant conditions in mornings and late afternoons\n- Carry a compact umbrella & light summer jacket for evening breezes!`;
      } else if (lower.includes('budget') || lower.includes('money') || lower.includes('cheap')) {
        dynReply = `💰 **Budget Tips for ${itinerary.destination}:**\n- Eat at local food markets instead of tourist traps\n- Shared rides or public buses cut transport costs by 60%\n- Look for free entry viewpoints and early bird passes!`;
      }

      setChatLogs((prev) => [...prev, { sender: 'ai', text: dynReply, time }]);
    } finally {
      setIsSendingChat(false);
    }
  };



  // ── Card action handlers ──────────────────────────────────────────────
  const handleFavorite = useCallback(async (item) => {
    if (savedIds.has(item.id)) {
      showToast(`"${item.title}" is already in Favorites`, 'info');
      return;
    }
    setSavedIds((prev) => new Set([...prev, item.id]));
    await addFavorite(item);
    showToast(`❤️ "${item.title}" saved to Favorites!`, 'success');
  }, [savedIds, addFavorite, showToast]);

  const handleRemove = useCallback((item) => {
    setRemovedIds((prev) => new Set([...prev, item.id]));
    showToast(`🗑️ "${item.title}" removed from today's plan`, 'removed');
  }, [showToast]);

  const [focusLocationItem, setFocusLocationItem] = useState(null);

  const handleViewOnMap = useCallback((item) => {
    setSelectedItem(item);
    setFocusLocationItem(item);
    setTimeout(() => {
      document.getElementById('live-trip-map')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleReplace = useCallback((item) => {
    setReplaceItem(item);
  }, []);


  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text-primary sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-border bg-surface px-4 py-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full border border-border p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary" aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-violet">AI Travel Guide</p>
              <h1 className="text-xl font-bold text-text-primary sm:text-2xl">{itinerary.tripName}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {itinerary.destination && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-secondary">
                <MapPin className="h-3.5 w-3.5 text-accent-violet" /> {itinerary.destination}
              </span>
            )}
            {totalDays > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-secondary">
                <Calendar className="h-3.5 w-3.5 text-accent-violet" /> {totalDays} Day{totalDays > 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full bg-accent-violet/10 px-3 py-1.5 text-xs font-semibold text-accent-violet">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered
            </span>
          </div>
        </header>

        {/* Stats row */}
        {itinerary.totalBudget > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TripStatCard icon={MapPin} label="Destination" value={itinerary.destination} />
            <TripStatCard icon={Calendar} label="Duration" value={`${totalDays} Day${totalDays !== 1 ? 's' : ''}`} />
            <TripStatCard icon={DollarSign} label="Total Budget" value={`${currency === 'INR' ? '₹' : '$'}${Number(itinerary.totalBudget).toLocaleString()}`} />
            <TripStatCard icon={Compass} label="Route" value={`${itinerary.startLocation || 'Origin'} → ${itinerary.destination}`} />
          </div>
        )}

        {/* Route Insights Banner */}
        {(routeInsights.distKm || routeInsights.bestTransport) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-[1.5rem] border border-accent-violet/20 bg-gradient-to-r from-accent-violet/5 via-surface-elevated to-surface-elevated px-5 py-4"
          >
            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-violet/10">
                <Ruler className="h-4 w-4 text-accent-violet" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Distance</p>
                <p className="text-sm font-bold text-text-primary">
                  {routeInsights.distKm ? `≈ ${routeInsights.distKm.toLocaleString()} km` : 'Route computed'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Clock className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Travel Time</p>
                <p className="text-sm font-bold text-text-primary">
                  {routeInsights.travelHours
                    ? routeInsights.travelDays
                      ? `~${routeInsights.travelDays} day${routeInsights.travelDays > 1 ? 's' : ''} travel`
                      : `~${routeInsights.travelHours} hrs`
                    : `${totalDays} days trip`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                {routeInsights.transportIcon && <routeInsights.transportIcon className="h-4 w-4 text-blue-500" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Best Transport</p>
                <p className="text-sm font-bold text-text-primary">{routeInsights.bestTransport || 'AI Recommended'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Navigation className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Trip Duration</p>
                <p className="text-sm font-bold text-text-primary">{totalDays} Day{totalDays !== 1 ? 's' : ''} Trip</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Description */}
        {itinerary.description && itinerary.description !== fallbackItinerary.description && (
          <div className="rounded-2xl border border-border bg-surface-elevated px-5 py-4">
            <p className="text-sm leading-7 text-text-secondary">{itinerary.description}</p>
          </div>
        )}

        {/* AI Generated Photos & Destination Preview */}
        <AiPhotosGallery
          startLocation={itinerary.startLocation}
          destination={itinerary.destination}
          requestedCategory={requestedCategory}
          tripId={tripId}
        />


        {/* Day selector tabs */}
        {totalDays > 0 && (
          <div className="flex flex-wrap gap-2">
            {itinerary.days.map((day, idx) => (
              <motion.button
                key={day.id}
                onClick={() => setActiveDay(idx)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeDay === idx
                    ? 'bg-accent-violet text-white shadow-md'
                    : 'border border-border bg-surface-elevated text-text-secondary hover:border-accent-violet/40 hover:text-text-primary'
                }`}
              >
                Day {day.dayNumber || idx + 1}
                {day.date && <span className="ml-1.5 text-[10px] opacity-70">{day.date}</span>}
              </motion.button>
            ))}
          </div>
        )}

        {/* Main grid: Itinerary + AI Guide */}
        <section className="grid gap-6 xl:grid-cols-[1fr_400px]">

          {/* Left: Day timeline */}
          <div className="space-y-4">
            {selectedDay ? (
              <DaySection
                day={{
                  ...selectedDay,
                  items: (selectedDay.items || []).filter((item) => !removedIds.has(item.id)),
                }}
                savedIds={savedIds}
                onSelect={handleViewOnMap}
                onRemove={handleRemove}
                onFavorite={handleFavorite}
                onReplace={handleReplace}
              />
            ) : totalDays === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-8 text-center">
                <Compass className="mx-auto h-10 w-10 text-text-muted" />
                <p className="mt-3 font-semibold text-text-primary">No itinerary generated yet</p>
                <p className="mt-1 text-sm text-text-secondary">Go back to the Planner and create a new trip to generate a full AI itinerary.</p>
                <button onClick={() => navigate('/planner')} className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-violet px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  <Sparkles className="h-4 w-4" /> Start Planning
                </button>
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-surface p-6 text-center text-sm text-text-secondary">
                Select a day to view the itinerary timeline.
              </div>
            )}
          </div>

          {/* Right: AI Travel Guide Companion */}
          <div className="flex flex-col rounded-[1.75rem] border border-border bg-surface shadow-sm overflow-hidden">
            {/* Guide header */}
            <div className="bg-gradient-to-br from-accent-violet to-purple-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">AI Travel Guide</p>
                  <p className="text-xs text-white/70">Your 24/7 travel companion</p>
                </div>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="border-b border-border px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Quick Questions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(({ icon: Icon, label, msg }) => (
                  <button
                    key={label}
                    onClick={() => handleSendChat(msg)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:border-accent-violet/40 hover:bg-accent-violet/5 hover:text-accent-violet"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-[280px] max-h-[400px]">
              <AnimatePresence initial={false}>
                {chatLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col gap-1 ${log.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${
                        log.sender === 'user'
                          ? 'bg-accent-violet text-white rounded-tr-sm'
                          : 'bg-surface-elevated border border-border text-text-primary rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{log.text}</p>
                    </div>
                    {log.time && <p className="text-[10px] text-text-muted px-1">{log.time}</p>}
                  </motion.div>
                ))}
                {isSendingChat && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
                    <div className="rounded-2xl rounded-tl-sm border border-border bg-surface-elevated px-4 py-2.5">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-accent-violet" animate={{ y: [0, -4, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />
                        ))}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChat(chatMessage); }}
              className="flex gap-2 border-t border-border p-4"
            >
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask your AI Travel Guide anything..."
                className="flex-1 rounded-full border border-border bg-surface-elevated px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-violet/50 focus:outline-none focus:ring-2 focus:ring-accent-violet/20"
              />
              <button
                type="submit"
                disabled={isSendingChat || !chatMessage.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-violet text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* Bottom grid: Map + Budget */}
        <section className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <TripMap
            locations={selectedDay?.items || []}
            route={itinerary.route || []}
            startLocation={itinerary.startLocation}
            destination={itinerary.destination}
            requestedCategory={requestedCategory}
            focusLocationItem={focusLocationItem}
          />
          <div className="space-y-4">
            <BudgetBreakdown
              budget={itinerary.budget || {}}
              totalBudget={itinerary.totalBudget || 0}
              currency={currency}
            />
            <div className="rounded-[1.5rem] border border-border bg-surface px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <TrendingUp className="h-4 w-4 text-accent-violet" />
                AI Planning Insights
              </div>
              <ul className="mt-4 space-y-2.5">
                {[
                  'Budget is optimally split: 35% stay, 25% transport, 20% food, 20% activities.',
                  'Morning activities (9–11 AM) have the least crowding and best light.',
                  'Book transport 1 day ahead to avoid last-minute price surges.',
                  'Ask the AI Guide for restaurant recommendations near each stop.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-violet" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>

      {/* Toasts Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-border bg-surface-elevated px-4 py-3 shadow-xl backdrop-blur-md text-sm font-medium text-text-primary"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{toast.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="ml-2 text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Item Detail / Map Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-[1.75rem] border border-border bg-surface-elevated p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-accent-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-violet">
                    {selectedItem.category || selectedItem.type || 'Location'}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-text-primary">{selectedItem.title || selectedItem.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full border border-border p-2 text-text-secondary hover:bg-border-subtle"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedItem.description && (
                <p className="text-sm text-text-secondary leading-relaxed">{selectedItem.description}</p>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                {selectedItem.location && (
                  <div className="rounded-xl border border-border p-3 bg-surface">
                    <p className="text-text-muted uppercase font-semibold text-[10px]">Location</p>
                    <p className="mt-1 font-medium text-text-primary">{selectedItem.location}</p>
                  </div>
                )}
                {selectedItem.time && (
                  <div className="rounded-xl border border-border p-3 bg-surface">
                    <p className="text-text-muted uppercase font-semibold text-[10px]">Time</p>
                    <p className="mt-1 font-medium text-text-primary">{selectedItem.time}</p>
                  </div>
                )}
                {selectedItem.estimatedCost && (
                  <div className="rounded-xl border border-border p-3 bg-surface">
                    <p className="text-text-muted uppercase font-semibold text-[10px]">Estimated Cost</p>
                    <p className="mt-1 font-medium text-text-primary">{selectedItem.estimatedCost}</p>
                  </div>
                )}
                {selectedItem.duration && (
                  <div className="rounded-xl border border-border p-3 bg-surface">
                    <p className="text-text-muted uppercase font-semibold text-[10px]">Duration</p>
                    <p className="mt-1 font-medium text-text-primary">{selectedItem.duration}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    handleFavorite(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent-violet px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" /> Save to Favorites
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-border-subtle"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Replace Alternative Modal */}
      <AnimatePresence>
        {replaceItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[1.75rem] border border-border bg-surface-elevated p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-accent-violet" />
                  <h3 className="text-lg font-bold text-text-primary">Replace Activity</h3>
                </div>
                <button
                  onClick={() => setReplaceItem(null)}
                  className="rounded-full border border-border p-2 text-text-secondary hover:bg-border-subtle"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-text-secondary">
                Select an AI-recommended alternative to replace <span className="font-semibold text-text-primary">"{replaceItem.title}"</span>:
              </p>

              <div className="space-y-2">
                {[
                  {
                    title: `Scenic ${replaceItem.category || 'Spot'} Walking Tour`,
                    desc: 'Relaxed walking exploration with photo stops and local cafe visits.',
                    tag: 'Popular',
                  },
                  {
                    title: `Artisanal Craft & Local Market Visit`,
                    desc: 'Interact with local craftspeople and sample regional delicacies.',
                    tag: 'Culture',
                  },
                  {
                    title: `Sunset Viewpoint & Lounge`,
                    desc: 'Unwind at top-rated panoramic terrace spots.',
                    tag: 'Relaxed',
                  },
                ].map((alt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      showToast(`✨ Replaced "${replaceItem.title}" with "${alt.title}"`, 'success');
                      setReplaceItem(null);
                    }}
                    className="w-full text-left rounded-2xl border border-border p-3.5 bg-surface hover:border-accent-violet/50 hover:bg-accent-violet/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-primary group-hover:text-accent-violet">{alt.title}</span>
                      <span className="rounded-full bg-accent-violet/10 px-2 py-0.5 text-[10px] font-medium text-accent-violet">{alt.tag}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-text-secondary leading-snug">{alt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
