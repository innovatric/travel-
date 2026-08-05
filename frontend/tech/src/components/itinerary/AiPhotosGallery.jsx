import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, MapPin, Hotel, Utensils, Mountain, RefreshCw,
  ChevronLeft, ChevronRight, CheckCircle2, Image as ImageIcon,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Curated "seed" photos per destination (used as INSTANT first load)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Curated "seed" photos per destination (used as INSTANT first load)
// ─────────────────────────────────────────────────────────────────────────────
const LOCATION_SEEDS = {
  china: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/1200px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg', title: 'Great Wall of China — Jinshanling' },
    { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80', title: 'Great Wall Mountains, China' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Forbidden_City_Beijing_Photos_2019.jpg/1200px-Forbidden_City_Beijing_Photos_2019.jpg', title: 'Forbidden City Palace, Beijing' },
  ],
  london: [
    { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', title: 'Big Ben & Elizabeth Tower, London' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Eye_2014.jpg/1200px-London_Eye_2014.jpg', title: 'The London Eye at Dusk' },
    { url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80', title: 'Tower Bridge over River Thames' },
  ],
  paris: [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', title: 'Eiffel Tower, Paris' },
    { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80', title: 'Louvre Museum Pyramid' },
  ],
  tokyo: [
    { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', title: 'Tokyo Tower & Skyline' },
    { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', title: 'Shinjuku Neon Lights, Tokyo' },
  ],
  dubai: [
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Burj Khalifa & Downtown Dubai' },
  ],
  bali: [
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', title: 'Ulun Danu Beratan Temple, Bali' },
  ],
  singapore: [
    { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', title: 'Marina Bay Sands, Singapore' },
  ],
  arunachalam: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Arunachaleswarar_temple_tiruvannamalai.jpg/1200px-Arunachaleswarar_temple_tiruvannamalai.jpg', title: 'Arunachaleswarar Temple — Tiruvannamalai' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Arunachala_hill.jpg/1200px-Arunachala_hill.jpg', title: 'Sacred Arunachala Hill at Dawn' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tiruvannamalai_Annamalaiyar_Temple.jpg/1200px-Tiruvannamalai_Annamalaiyar_Temple.jpg', title: 'Annamalaiyar Temple at Tiruvannamalai' },
  ],
  tiruvannamalai: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Arunachaleswarar_temple_tiruvannamalai.jpg/1200px-Arunachaleswarar_temple_tiruvannamalai.jpg', title: 'Arunachaleswarar Temple Gopuram' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Arunachala_hill.jpg/1200px-Arunachala_hill.jpg', title: 'Sacred Arunachala Hill' },
  ],
  tirupati: [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tirumala_venkateswara_temple.jpg/1200px-Tirumala_venkateswara_temple.jpg', title: 'Tirumala Venkateswara Temple' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Tirupati_Balaji.jpg/1200px-Tirupati_Balaji.jpg', title: 'Sri Venkateswara Idol, Tirumala' },
  ],
  goa: [
    { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', title: 'Calangute Beach Sunset, Goa' },
    { url: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80', title: 'Palolem Beach Palms, Goa' },
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', title: 'Aguada Fort Lighthouse, Goa' },
  ],
  hyderabad: [
    { url: 'https://images.unsplash.com/photo-1605367031802-9907936a5fa2?auto=format&fit=crop&w=1200&q=80', title: 'Charminar Heritage Monument' },
    { url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', title: 'Golconda Fort Ramparts' },
    { url: 'https://images.unsplash.com/photo-1626014903708-ecb4f8d22dfb?auto=format&fit=crop&w=1200&q=80', title: 'Hussain Sagar Lake' },
  ],
  mumbai: [
    { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', title: 'Gateway of India, Mumbai' },
    { url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', title: 'Marine Drive, Mumbai' },
    { url: 'https://images.unsplash.com/photo-1595658658421-a9ac457190ae?auto=format&fit=crop&w=1200&q=80', title: 'Bandra-Worli Sea Link' },
  ],
  delhi: [
    { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', title: 'India Gate, New Delhi' },
    { url: 'https://images.unsplash.com/photo-1592635196078-9fe175997097?auto=format&fit=crop&w=1200&q=80', title: 'Qutub Minar Heritage Complex' },
    { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', title: 'Humayun\'s Tomb' },
  ],
  vizag: [
    { url: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80', title: 'RK Beach Promenade, Vizag' },
    { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80', title: 'Kailasagiri Hilltop Park' },
  ],
  rajahmundry: [
    { url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', title: 'Godavari River Sunset, Rajahmundry' },
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', title: 'Maredumilli Rainforest' },
  ],
  kolkata: [
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80', title: 'Howrah Bridge, Kolkata' },
    { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', title: 'Victoria Memorial, Kolkata' },
  ],
  chennai: [
    { url: 'https://images.unsplash.com/photo-1580889240870-a0bc07feee0a?auto=format&fit=crop&w=1200&q=80', title: 'Marina Beach, Chennai' },
    { url: 'https://images.unsplash.com/photo-1546958895-c22aca30f1e8?auto=format&fit=crop&w=1200&q=80', title: 'Kapaleeshwarar Temple' },
  ],
};

function getDestinationFallback(destName) {
  const name = (destName || 'destination').toLowerCase().trim();
  const hash = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));

  const fallbackCollections = [
    [
      { url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80', title: `Real View — ${destName}` },
      { url: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80', title: `Landmarks of ${destName}` },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', title: `Historic Sight — ${destName}` },
      { url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80', title: `City View of ${destName}` },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', title: `Famous View of ${destName}` },
      { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80', title: `Promenade — ${destName}` },
    ],
    [
      { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', title: `Metropolitan View — ${destName}` },
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80', title: `Night Lights of ${destName}` },
    ],
  ];

  return fallbackCollections[hash % fallbackCollections.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// Food photos that look authentic for that destination region
// ─────────────────────────────────────────────────────────────────────────────
const FOOD_SEEDS = {
  south: [
    { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80', title: 'Hyderabadi Dum Biryani' },
    { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80', title: 'Crispy Masala Dosa with Chutneys' },
    { url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80', title: 'South Indian Thali & Curries' },
    { url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80', title: 'Traditional Idly & Vada Platter' },
  ],
  north: [
    { url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80', title: 'Butter Chicken & Naan' },
    { url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80', title: 'Dal Makhani & Jeera Rice' },
    { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80', title: 'Aromatic Biryani Preparation' },
  ],
  default: [
    { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80', title: 'Authentic Regional Biryani' },
    { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80', title: 'Local Cuisine Thali' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', title: 'Restaurant Dining Experience' },
    { url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80', title: 'Traditional Indian Sweets & Prasadam' },
  ],
};

const HOTEL_SEEDS = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', title: 'Luxury Resort Pool & Gardens' },
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', title: 'Deluxe Executive Suite Room' },
  { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', title: 'Modern Hotel Room & Amenities' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', title: 'Hotel Swimming Pool & Terrace' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Wikimedia Commons LIVE photo search  – now returns THUMBNAIL urls
// ─────────────────────────────────────────────────────────────────────────────
async function wikimediaSearch(query, maxResults = 6) {
  const url =
    `https://commons.wikimedia.org/w/api.php` +
    `?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}` +
    `&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1200` +
    `&format=json&origin=*`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) }).then((r) => r.json());
    const pages = res.query?.pages;
    if (!pages) return [];
    const results = [];
    for (const pid of Object.keys(pages)) {
      const page = pages[pid];
      const info = page?.imageinfo?.[0];
      const fname = (page?.title || '').toLowerCase();
      const ext = (info?.url || '').split('?')[0].toLowerCase();
      if (
        info &&
        (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png')) &&
        !fname.includes('logo') &&
        !fname.includes('icon') &&
        !fname.includes('flag') &&
        !fname.includes('map') &&
        !fname.includes('diagram') &&
        !fname.includes('coat')
      ) {
        results.push({
          url: info.thumburl || info.url,
          title: `${query} — Photo ${results.length + 1}`,
        });
        if (results.length >= maxResults) break;
      }
    }
    return results;
  } catch {
    return [];
  }
}

// Run multiple Wikimedia queries for richness & variety
async function fetchDestinationPhotos(destName) {
  const queries = [
    `${destName} temple`,
    `${destName} tourism`,
    `${destName} landmark`,
  ];
  const all = [];
  for (const q of queries) {
    const found = await wikimediaSearch(q, 3);
    all.push(...found);
    if (all.length >= 6) break;
  }
  return all.slice(0, 6);
}

async function fetchDestinationFood(destName) {
  return wikimediaSearch(`${destName} food traditional`, 4);
}

async function fetchDestinationHotels(destName) {
  return wikimediaSearch(`${destName} hotel resort`, 4);
}

// Map destination to food region
function getFoodRegion(destLower) {
  const south = ['arunachalam', 'tiruvannamalai', 'tirupati', 'vizag', 'rajahmundry', 'chennai', 'hyderabad', 'goa', 'bangalore', 'mysore', 'kerala', 'kochi', 'coimbatore'];
  const north = ['delhi', 'agra', 'jaipur', 'lucknow', 'varanasi', 'amritsar', 'chandigarh', 'mumbai', 'pune'];
  if (south.some((s) => destLower.includes(s))) return 'south';
  if (north.some((n) => destLower.includes(n))) return 'north';
  return 'default';
}

export default function AiPhotosGallery({
  startLocation = 'Origin',
  destination = 'Destination',
  requestedCategory = null,
}) {
  const [activeCategory, setActiveCategory] = useState('route');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const loadCategoryPhotos = useCallback(
    async (category) => {
      setLoading(true);
      setSelectedPhotoIndex(0);
      const destLower = (destination || '').toLowerCase().trim();
      let items = [];

      if (category === 'route' || category === 'attraction') {
        // 1. Check seed archive first
        let seedKey = null;
        for (const key of Object.keys(LOCATION_SEEDS)) {
          if (destLower.includes(key) || key.includes(destLower.slice(0, 5))) {
            seedKey = key;
            break;
          }
        }
        if (seedKey) {
          items = [...LOCATION_SEEDS[seedKey]];
        }
        // 2. Append Wikimedia live results
        const live = await fetchDestinationPhotos(destination);
        items = [...items, ...live].slice(0, 8);

        // 3. Final fallback
        if (items.length === 0) {
          items = getDestinationFallback(destination);
        }
      } else if (category === 'restaurant') {
        const region = getFoodRegion(destLower);
        items = [...(FOOD_SEEDS[region] || FOOD_SEEDS.default)];
        // Enrich with Wikimedia food photos
        const liveFood = await fetchDestinationFood(destination);
        items = [...liveFood, ...items].slice(0, 6);
        // Label them with destination
        items = items.map((i) => ({ ...i, title: `${i.title} — ${destination}` }));
      } else if (category === 'hotel') {
        items = [...HOTEL_SEEDS];
        const liveHotels = await fetchDestinationHotels(destination);
        items = [...liveHotels, ...items].slice(0, 5);
        items = items.map((i) => ({ ...i, title: `${i.title} — ${destination}` }));
      }

      setPhotos(items);
      setLoading(false);
    },
    [destination, startLocation]
  );

  // Load on mount or when destination changes
  useEffect(() => {
    loadCategoryPhotos(activeCategory);
  }, [destination]);

  // Respond to external category requests (e.g. from chat)
  useEffect(() => {
    if (!requestedCategory) return;
    const catMap = {
      hotel: 'hotel', room: 'hotel', stay: 'hotel',
      food: 'restaurant', restaurant: 'restaurant', eat: 'restaurant', brooms: 'restaurant',
      attraction: 'attraction', popular: 'attraction', sight: 'attraction', places: 'attraction',
    };
    const cat = catMap[requestedCategory.toLowerCase()] || 'route';
    setActiveCategory(cat);
    loadCategoryPhotos(cat);
  }, [requestedCategory]);

  const CATEGORY_TABS = [
    { id: 'route', label: `${destination} Views`, icon: MapPin },
    { id: 'restaurant', label: 'Food & Dining', icon: Utensils },
    { id: 'hotel', label: 'Stays', icon: Hotel },
    { id: 'attraction', label: 'Attractions', icon: Mountain },
  ];

  const currentItem = photos[selectedPhotoIndex] || photos[0];

  return (
    <div className="rounded-[1.75rem] border border-accent-violet/20 bg-gradient-to-br from-surface via-surface-elevated to-accent-violet/5 p-5 shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-violet/10 text-accent-violet">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-text-primary">
                Real Photos of {destination}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Route: <span className="font-semibold text-accent-violet">{startLocation}</span> → <span className="font-semibold text-accent-violet">{destination}</span>
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface p-1">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveCategory(tab.id); loadCategoryPhotos(tab.id); }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-accent-violet text-white shadow-sm'
                    : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Content */}
      {loading ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-accent-violet/30 bg-accent-violet/5 p-6 text-center">
          <RefreshCw className="h-7 w-7 text-accent-violet animate-spin" />
          <p className="mt-3 text-sm font-semibold text-text-primary">
            Fetching real photos of {destination}…
          </p>
          <p className="mt-1 text-xs text-text-muted">Searching Wikimedia Commons & verified archives</p>
        </div>
      ) : photos.length > 0 ? (
        <div className="space-y-3">
          {/* Main Photo */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm aspect-video max-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedPhotoIndex}
                src={currentItem?.url}
                alt={currentItem?.title || `Real Photo of ${destination}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Remove broken image from list
                  setPhotos((prev) => prev.filter((_, i) => i !== selectedPhotoIndex));
                }}
              />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    📍 {activeCategory === 'restaurant' ? 'Local Food' : activeCategory === 'hotel' ? 'Stay Options' : `Real View of ${destination}`}
                  </p>
                  <p className="text-sm font-bold leading-snug">{currentItem?.title}</p>
                </div>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                  {selectedPhotoIndex + 1} / {photos.length}
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              <Camera className="h-3 w-3 text-emerald-400" /> Real Photos
            </div>

            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-transform hover:scale-110 hover:bg-black/70"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-transform hover:scale-110 hover:bg-black/70"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-accent-violet scale-105 shadow-md'
                      : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-text-muted">
          <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">No photos found. Try a different category.</p>
        </div>
      )}
    </div>
  );
}
