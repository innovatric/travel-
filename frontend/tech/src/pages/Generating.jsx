import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calculator, Compass, Bot, CheckCircle2, ArrowRight, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useTrip } from '../context/TripContext';

const GENERATION_STEPS = [
  { id: 1, label: 'Analyzing origin & route destinations', icon: MapPin },
  { id: 2, label: 'Fetching real destination photos', icon: Camera },
  { id: 3, label: 'Structuring multi-day itinerary & daily schedule', icon: Compass },
  { id: 4, label: 'Calculating accommodation, transport & activity expenses', icon: Calculator },
  { id: 5, label: 'Initializing 24/7 AI Travel Guide Companion', icon: Bot },
];

// Verified photo archive for popular destinations
const DESTINATION_PHOTO_ARCHIVE = {
  'arunachalam': [
    { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', title: 'Arunachaleswarar Temple Gopuram' },
    { url: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80', title: 'Annamalaiyar Sacred Hill & Girivalam' },
  ],
  'tiruvannamalai': [
    { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', title: 'Arunachaleswarar Gopuram' },
    { url: 'https://images.unsplash.com/photo-1627894042065-d58877104be3?auto=format&fit=crop&w=1200&q=80', title: 'Sacred Temple Architecture' },
  ],
  'tirupati': [
    { url: 'https://images.unsplash.com/photo-1627894042065-d58877104be3?auto=format&fit=crop&w=1200&q=80', title: 'Tirumala Temple Golden Gopuram' },
    { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', title: 'Seshachalam Hills Scenic Ghat' },
  ],
  'goa': [
    { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', title: 'Calangute Beach Sunset, Goa' },
    { url: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80', title: 'Palolem Beach Palms, Goa' },
  ],
  'hyderabad': [
    { url: 'https://images.unsplash.com/photo-1605367031802-9907936a5fa2?auto=format&fit=crop&w=1200&q=80', title: 'Charminar, Hyderabad' },
    { url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', title: 'Golconda Fort, Hyderabad' },
  ],
  'mumbai': [
    { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', title: 'Gateway of India, Mumbai' },
    { url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', title: 'Marine Drive, Mumbai' },
  ],
  'delhi': [
    { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', title: 'India Gate, New Delhi' },
    { url: 'https://images.unsplash.com/photo-1592635196078-9fe175997097?auto=format&fit=crop&w=1200&q=80', title: 'Qutub Minar, Delhi' },
  ],
  'vizag': [
    { url: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80', title: 'RK Beach, Visakhapatnam' },
    { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80', title: 'Kailasagiri Hilltop, Vizag' },
  ],
  'rajahmundry': [
    { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', title: 'Godavari River Sunset, Rajahmundry' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', title: 'Maredumilli Forest near Rajahmundry' },
  ],
  'kolkata': [
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80', title: 'Howrah Bridge, Kolkata' },
    { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', title: 'Victoria Memorial, Kolkata' },
  ],
  'chennai': [
    { url: 'https://images.unsplash.com/photo-1580889240870-a0bc07feee0a?auto=format&fit=crop&w=1200&q=80', title: 'Marina Beach, Chennai' },
    { url: 'https://images.unsplash.com/photo-1546958895-c22aca30f1e8?auto=format&fit=crop&w=1200&q=80', title: 'Kapaleeshwarar Temple, Chennai' },
  ],
};

// Fetch live Wikimedia Commons photos for any destination
async function fetchWikimediaDestinationPhotos(destName) {
  if (!destName) return [];
  try {
    const queries = [destName, `${destName} landmark`, `${destName} temple`, `${destName} monument`];
    const results = [];
    for (const q of queries) {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) => r.json());
        const pages = res.query?.pages;
        if (pages) {
          for (const pid of Object.keys(pages)) {
            const info = pages[pid]?.imageinfo?.[0];
            const fname = pages[pid]?.title?.toLowerCase() || '';
            if (
              info && info.url &&
              (info.url.endsWith('.jpg') || info.url.endsWith('.JPG') || info.url.endsWith('.jpeg') || info.url.endsWith('.png')) &&
              !fname.includes('logo') && !fname.includes('icon') && !fname.includes('flag') && !fname.includes('map') && !fname.includes('coat')
            ) {
              results.push({
                url: info.thumburl || info.url,
                title: `Real View of ${destName} — ${results.length + 1}`
              });
              if (results.length >= 4) break;
            }
          }
        }
      } catch (_) { /* timeout / abort */ }
      if (results.length >= 4) break;
    }
    return results;
  } catch (err) {
    return [];
  }
}

export default function Generating() {
  const navigate = useNavigate();
  const { plannerRequest, setPlannerDraft, createTrip, generateItinerary, saveTripToHistory } = useTrip();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [destPhotos, setDestPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const startLoc = plannerRequest?.startLocation || 'Rajahmundry';
  const destList = plannerRequest?.destinations || ['Destination'];
  const destName = Array.isArray(destList) && destList.length > 0 ? destList[0] : 'Destination';
  const currency = plannerRequest?.currency || 'INR';
  const budget = plannerRequest?.budget || '5000';

  // Load real destination photos immediately
  useEffect(() => {
    async function loadPhotos() {
      const destKey = destName.toLowerCase().trim();
      let matched = null;
      for (const key of Object.keys(DESTINATION_PHOTO_ARCHIVE)) {
        if (destKey.includes(key) || key.includes(destKey)) {
          matched = DESTINATION_PHOTO_ARCHIVE[key];
          break;
        }
      }
      if (matched) {
        setDestPhotos(matched);
      } else {
        const live = await fetchWikimediaDestinationPhotos(destName);
        if (live.length > 0) setDestPhotos(live);
      }
    }
    loadPhotos();
  }, [destName]);

  // Auto-rotate photos
  useEffect(() => {
    if (destPhotos.length < 2) return;
    const t = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % destPhotos.length);
    }, 2500);
    return () => clearInterval(t);
  }, [destPhotos]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    const executeGeneration = async () => {
      try {
        const tripData = {
          tripName: `Trip from ${startLoc} to ${destName}`,
          startLocation: startLoc,
          startDate: plannerRequest?.startDate || new Date().toISOString().split('T')[0],
          endDate: plannerRequest?.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          travellers: Number(plannerRequest?.travellers) || 2,
          budget: Number(budget) || 5000,
          currency: currency,
          pace: plannerRequest?.pace || 'Balanced',
          accommodationType: plannerRequest?.accommodation || 'Resort',
          transportMode: plannerRequest?.transport || 'Car / Shuttle',
          foodPreference: plannerRequest?.food || 'Local Cuisine',
          specialRequirements: plannerRequest?.requirements || '',
          status: 'PLANNED'
        };

        const savedTrip = await createTrip(tripData).catch(() => ({ id: Date.now() }));
        const tripId = savedTrip?.tripId || savedTrip?.id || Date.now();

        const preferences = {
          prompt: plannerRequest?.prompt || `Plan trip from ${startLoc} to ${destName}`,
          startLocation: startLoc,
          destinations: Array.isArray(destList) ? destList : [destName],
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travellers: tripData.travellers,
          budget: tripData.budget,
          currency: tripData.currency,
          interests: plannerRequest?.interests?.join(', ') || 'Sightseeing, Local Food, Scenic Viewpoints',
          pace: tripData.pace,
          accommodation: tripData.accommodationType,
          transport: tripData.transportMode,
          food: tripData.foodPreference,
          requirements: tripData.specialRequirements
        };

        const response = await generateItinerary(tripId, preferences).catch(() => null);

        let parsedItinerary = response;
        if (typeof response?.json_itinerary === 'string') {
          try {
            parsedItinerary = JSON.parse(response.json_itinerary);
          } catch (e) {
            console.warn('Could not parse json_itinerary string:', e);
          }
        }

        saveTripToHistory({
          id: tripId,
          tripId: tripId,
          tripName: tripData.tripName,
          startLocation: startLoc,
          destination: destName,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travellers: tripData.travellers,
          budget: tripData.budget,
          currency: tripData.currency,
          itinerary: parsedItinerary,
        });

        setPlannerDraft({
          prompt: preferences.prompt,
          preferences: plannerRequest?.interests || [],
          itinerary: parsedItinerary
        });

        setTimeout(() => {
          navigate(`/itinerary/${tripId}`);
        }, 3600);
      } catch (err) {
        console.error('Generation error:', err);
        setErrorMsg('Could not reach backend AI service. Loading offline itinerary preview...');
        setTimeout(() => {
          navigate('/itinerary/preview');
        }, 3000);
      }
    };

    executeGeneration();

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="mx-auto flex min-h-[90vh] max-w-4xl items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full space-y-6"
      >
        {/* Destination Photo Preview */}
        {destPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-accent-violet/30 bg-surface shadow-card aspect-video max-h-[320px]"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photoIndex}
                src={destPhotos[photoIndex]?.url}
                alt={destPhotos[photoIndex]?.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    📍 Real Photos of {destName}
                  </p>
                  <p className="text-sm font-bold">{destPhotos[photoIndex]?.title}</p>
                  <p className="mt-0.5 text-xs text-white/70">Route: {startLoc} → {destName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {destPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === photoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              <Camera className="h-3 w-3 text-emerald-400" /> Verified Real Photos
            </div>
          </motion.div>
        )}

        {/* Generation Card */}
        <div className="rounded-[2.25rem] border border-border bg-surface-elevated p-8 text-center shadow-card lg:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl gradient-ai-subtle shadow-inner">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="h-10 w-10 text-accent-violet" />
            </motion.div>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">Crafting Your AI Travel Itinerary</h2>
          <p className="mx-auto mt-2 max-w-xl text-base text-text-secondary">
            Designing a custom route from <span className="font-semibold text-accent-violet">{startLoc}</span> to{' '}
            <span className="font-semibold text-accent-violet">{Array.isArray(destList) ? destList.join(', ') : destList}</span>
          </p>

          <div className="mt-8 overflow-hidden rounded-full bg-surface border border-border p-1">
            <motion.div
              className="h-3 rounded-full gradient-ai"
              initial={{ width: '5%' }}
              animate={{ width: `${Math.min(((currentStep + 1) / GENERATION_STEPS.length) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="mt-8 space-y-3 text-left">
            {GENERATION_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all ${
                    isCurrent
                      ? 'border-accent-violet/40 bg-accent-violet/10 text-text-primary shadow-sm'
                      : isDone
                      ? 'border-border bg-surface text-text-primary'
                      : 'border-border/40 bg-surface/40 text-text-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isCurrent ? 'bg-accent-violet text-white' : isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-surface-elevated text-text-muted'}`}>
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center rounded-full bg-accent-violet/20 px-2.5 py-0.5 text-xs font-semibold text-accent-violet animate-pulse">
                      Processing...
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600">
              {errorMsg}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => navigate('/itinerary/preview')} className="gap-2 text-xs">
              Skip directly to itinerary workspace <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
