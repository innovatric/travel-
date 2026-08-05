import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, MapPinned, Utensils, Hotel, Fuel, Landmark, Play, Pause, RotateCcw, Crosshair, Compass, ExternalLink, Sparkles, Coffee, AlertCircle, CheckCircle2, ArrowRight, BedDouble, ShieldCheck, Camera, Mountain, Castle } from 'lucide-react';

const CITY_COORDS = {
  'rjy': [17.0005, 81.8040],
  'rajahmundry': [17.0005, 81.8040],
  'goa': [15.2993, 74.1240],
  'hyderabad': [17.3850, 78.4867],
  'vijayawada': [16.5062, 80.6480],
  'solapur': [17.6599, 75.9064],
  'hubli': [15.3647, 75.1240],
  'belgaum': [15.8497, 74.4977],
  'paris': [48.8566, 2.3522],
  'tokyo': [35.6762, 139.6503],
  'new york': [40.7128, -74.0060],
  'london': [51.5074, -0.1278],
  'rome': [41.9028, 12.4964],
  'bali': [-8.4095, 115.1889],
  'dubai': [25.2048, 55.2708],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'bangalore': [12.9716, 77.5946],
  'sydney': [-33.8688, 151.2093],
  'barcelona': [41.3851, 2.1734],
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],
  'kerala': [10.8505, 76.2711],
  'kochi': [9.9312, 76.2673],
};

function getCoordsForPlace(name, offsetIdx = 0, baseCenter = [17.0005, 81.8040]) {
  if (!name) return baseCenter;
  const cleanName = String(name).toLowerCase().trim();
  
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (cleanName.includes(city) || city.includes(cleanName)) {
      if (offsetIdx === 0) return coords;
      const angle = (offsetIdx * 0.8) % (2 * Math.PI);
      const radius = 0.015 * Math.min(offsetIdx, 5);
      return [coords[0] + radius * Math.cos(angle), coords[1] + radius * Math.sin(angle)];
    }
  }

  const angle = (offsetIdx * 1.2);
  const radius = 0.02 * (offsetIdx + 1);
  return [baseCenter[0] + radius * Math.cos(angle), baseCenter[1] + radius * Math.sin(angle)];
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function MapAutoFollow({ center, enabled }) {
  const map = useMap();
  useEffect(() => {
    if (enabled && center) {
      map.panTo(center, { animate: true, duration: 0.6 });
    }
  }, [center, enabled, map]);
  return null;
}

function MapFlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 15, { animate: true, duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

function createCustomIcon(type) {
  let bgGradient = 'linear-gradient(135deg, #6366f1, #4f46e5)';
  let iconEmoji = '📍';

  if (type === 'start') {
    bgGradient = 'linear-gradient(135deg, #10b981, #059669)';
    iconEmoji = '🚩';
  } else if (type === 'end') {
    bgGradient = 'linear-gradient(135deg, #6366f1, #4338ca)';
    iconEmoji = '🏁';
  } else if (type === 'live-user') {
    bgGradient = 'linear-gradient(135deg, #ef4444, #dc2626)';
    iconEmoji = '🚘';
  } else if (type === 'nearby-attraction' || type === 'attraction') {
    bgGradient = 'linear-gradient(135deg, #ec4899, #be185d)';
    iconEmoji = '🏰';
  } else if (type === 'nearby-hotel' || type === 'hotel') {
    bgGradient = 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
    iconEmoji = '🏨';
  } else if (type === 'nearby-food' || type === 'restaurant') {
    bgGradient = 'linear-gradient(135deg, #f59e0b, #d97706)';
    iconEmoji = '🍽️';
  } else if (type === 'nearby-fuel') {
    bgGradient = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    iconEmoji = '⛽';
  } else if (type === 'transport') {
    bgGradient = 'linear-gradient(135deg, #0ea5e9, #0369a1)';
    iconEmoji = '🚌';
  } else if (type === 'activity') {
    bgGradient = 'linear-gradient(135deg, #10b981, #047857)';
    iconEmoji = '🎯';
  }

  const isLive = type === 'live-user';
  const html = `
    <div style="
      background: ${bgGradient};
      width: ${isLive ? '42px' : '36px'};
      height: ${isLive ? '42px' : '36px'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${isLive ? '20px' : '16px'};
      box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 0 0 ${isLive ? '4px' : '2px'} rgba(255,255,255,0.9);
      transition: transform 0.15s ease;
      cursor: pointer;
      ${isLive ? 'animation: pulse 2s infinite;' : ''}
    ">
      ${iconEmoji}
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-marker',
    html: html,
    iconSize: isLive ? [42, 42] : [36, 36],
    iconAnchor: isLive ? [21, 21] : [18, 18],
    popupAnchor: [0, -18],
  });
}

export default function TripMap({
  locations = [],
  route = [],
  startLocation = 'RJY',
  destination = 'Goa',
  requestedCategory = null,
  focusLocationItem = null,
}) {
  const [mapStyle, setMapStyle] = useState('voyager');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTrackingLive, setIsTrackingLive] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);
  const [simProgress, setSimProgress] = useState(0.25);
  // Multi-toggle: each category can be ON or OFF independently
  const [activeCategories, setActiveCategories] = useState(new Set(['attraction']));
  const [categoryPlaces, setCategoryPlaces] = useState({});
  const [selectedDestinationPlace, setSelectedDestinationPlace] = useState(null);
  const [focusCoords, setFocusCoords] = useState(null);

  // Derived: all visible nearby places = union of all active category results
  const nearbyPlaces = useMemo(() => {
    const all = [];
    for (const cat of activeCategories) {
      if (categoryPlaces[cat]) all.push(...categoryPlaces[cat]);
    }
    return all;
  }, [activeCategories, categoryPlaces]);

  const TILE_LAYERS = {
    voyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap',
    },
    standard: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap',
    },
  };

  const startCoords = useMemo(() => getCoordsForPlace(startLocation || 'RJY'), [startLocation]);
  const destCoords = useMemo(() => getCoordsForPlace(destination || 'Goa'), [destination]);

  const [userPos, setUserPos] = useState(() => {
    const lat = startCoords[0] + (destCoords[0] - startCoords[0]) * 0.25;
    const lng = startCoords[1] + (destCoords[1] - startCoords[1]) * 0.25;
    return [lat, lng];
  });

  useEffect(() => {
    if (!isTrackingLive) {
      const lat = startCoords[0] + (destCoords[0] - startCoords[0]) * simProgress;
      const lng = startCoords[1] + (destCoords[1] - startCoords[1]) * simProgress;
      setUserPos([lat, lng]);
    }
  }, [simProgress, startCoords, destCoords, isTrackingLive]);

  useEffect(() => {
    let watchId = null;
    if (isTrackingLive && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation warning:', err),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTrackingLive]);

  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimProgress((prev) => (prev >= 0.95 ? 0.05 : prev + 0.015));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Instant POI Generator
  const getInstantNearbyItems = useCallback((cat, currentLat, currentLng) => {
    let items = [];
    if (cat === 'attraction') {
      items = [
        { name: 'Sunrise Hilltop & Sunset Viewpoint', detail: 'Panoramic Valley View & Photography Point', price: 'Free Entry', dist: 2.3, rating: 4.9 },
        { name: 'Ancient Heritage Fort & Palace', detail: 'Historical Architecture & Guided Tour', price: '₹50 Entry Pass', dist: 4.5, rating: 4.8 },
        { name: 'Scenic Waterfalls & Nature Reserve', detail: 'Trekking Trail, Picnics & Cascading Falls', price: 'Free Entry', dist: 6.8, rating: 4.9 },
        { name: 'Royal Riverfront Promenade & Ghat', detail: 'Boating, Evening Aarti & Stalls', price: 'Free Entry', dist: 8.2, rating: 4.7 },
      ];
    } else if (cat === 'hotel') {
      items = [
        { name: 'Grand Highway Resort & Luxury Stay', detail: 'AC Executive Rooms, Swimming Pool, Parking', price: '₹1,850/night', dist: 1.4, rating: 4.8 },
        { name: 'Royal Comfort Lodge & Rooms', detail: 'Clean AC Deluxe Rooms, 24/7 Room Service', price: '₹1,200/night', dist: 2.8, rating: 4.6 },
        { name: 'Green Palm Highway Inn', detail: 'Garden View Suites, Free Breakfast & WiFi', price: '₹2,100/night', dist: 4.2, rating: 4.7 },
        { name: 'Star Highway Stay & Motel', detail: 'Budget AC Rooms, 24h Hot Water & Security', price: '₹999/night', dist: 5.6, rating: 4.5 },
      ];
    } else if (cat === 'food') {
      items = [
        { name: 'Grand Highway Dhaba & Biryani', detail: 'Andhra & South Indian Special Thali', price: null, dist: 1.8, rating: 4.7 },
        { name: '7 Star Family Restaurant', detail: 'North & South Indian, Tandoori', price: null, dist: 3.4, rating: 4.5 },
        { name: 'Highway Chai & Cafe Hub', detail: 'Coffee, Pizza, Snacks', price: null, dist: 4.1, rating: 4.6 },
        { name: 'Sri Balaji Pure Veg Restaurant', detail: 'Pure Veg Meals & Tiffins', price: null, dist: 5.2, rating: 4.8 },
      ];
    } else {
      items = [
        { name: 'Indian Oil Highway Fuel Station', detail: 'Petrol, Diesel, Air & Washrooms', price: null, dist: 1.1, rating: 4.6 },
        { name: 'HP Auto Fuel & EV Charging Hub', detail: 'Fast EV Charger & Rest Stop', price: null, dist: 3.2, rating: 4.7 },
        { name: 'Bharat Petroleum Highway Center', detail: 'Petrol, Diesel, 24h Convenience Store', price: null, dist: 5.4, rating: 4.5 },
      ];
    }

    return items.map((it, idx) => {
      const angle = (idx * 1.25) + 0.3;
      const r = 0.018 * (idx + 1);
      return {
        id: `instant-${cat}-${idx}`,
        title: it.name,
        type: `nearby-${cat}`,
        category: cat,
        cuisine: it.detail,
        price: it.price,
        distKm: it.dist,
        coords: [currentLat + r * Math.sin(angle), currentLng + r * Math.cos(angle)],
        rating: it.rating,
      };
    });
  }, []);

  // Toggle a category ON/OFF and load its POIs instantly
  const handleToggleCategory = useCallback((cat) => {
    const [currentLat, currentLng] = userPos;

    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
        return next;
      } else {
        next.add(cat);
      }
      return next;
    });

    // If category not yet loaded, generate instant results
    setCategoryPlaces((prev) => {
      if (prev[cat]) return prev; // already loaded
      const instantResults = getInstantNearbyItems(cat, currentLat, currentLng);

      // Background fetch to enrich
      let overpassFilter = 'tourism~"attraction|viewpoint|museum"';
      if (cat === 'hotel') overpassFilter = 'tourism~"hotel|guest_house|motel|resort"';
      if (cat === 'food') overpassFilter = 'amenity~"restaurant|cafe|fast_food|dhaba"';
      if (cat === 'fuel') overpassFilter = 'amenity~"fuel"';
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node[${overpassFilter}](around:25000,${currentLat},${currentLng}););out%20body;`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      fetch(overpassUrl, { signal: controller.signal })
        .then((r) => r.json())
        .then((res) => {
          clearTimeout(timeoutId);
          if (res?.elements?.length > 0) {
            const fetched = res.elements.slice(0, 4).map((el, i) => ({
              id: `${cat}-osm-${el.id || i}`,
              title: el.tags.name || el.tags.brand || `Nearby ${cat} #${i + 1}`,
              type: `nearby-${cat}`,
              category: cat,
              cuisine: el.tags.tourism || el.tags.amenity || 'Local Spot',
              price: cat === 'hotel' ? `₹${1200 + (i * 300)}/night` : cat === 'attraction' ? 'Popular Spot' : null,
              distKm: calculateDistanceKm(currentLat, currentLng, el.lat, el.lon),
              coords: [el.lat, el.lon],
              rating: (4.4 + (i % 5) * 0.1).toFixed(1),
            }));
            setCategoryPlaces((p) => ({ ...p, [cat]: [...fetched, ...(p[cat] || [])].slice(0, 6) }));
          }
        })
        .catch(() => {});

      return { ...prev, [cat]: instantResults };
    });
  }, [userPos, getInstantNearbyItems]);

  // Legacy handleFindNearby kept for requestedCategory prop compatibility
  const handleFindNearby = useCallback((cat) => {
    setActiveCategories((prev) => new Set([...prev, cat]));
    setCategoryPlaces((prev) => {
      if (prev[cat]) return prev;
      const [lat, lng] = userPos;
      return { ...prev, [cat]: getInstantNearbyItems(cat, lat, lng) };
    });
  }, [userPos, getInstantNearbyItems]);

  useEffect(() => {
    if (requestedCategory) {
      handleFindNearby(requestedCategory);
    }
  }, [requestedCategory, handleFindNearby]);

  // Handle focusing on specific card items ("View on map", "View stay", "View spot")
  useEffect(() => {
    if (focusLocationItem) {
      const locName = focusLocationItem.location || focusLocationItem.title || destination;
      const coords = getCoordsForPlace(locName, 1, destCoords);
      const placeObj = {
        id: focusLocationItem.id || `focus-${Date.now()}`,
        title: focusLocationItem.title || locName,
        type: focusLocationItem.type || 'activity',
        category: focusLocationItem.type || 'attraction',
        cuisine: focusLocationItem.description || focusLocationItem.category || 'Itinerary Destination Stop',
        distKm: calculateDistanceKm(userPos[0], userPos[1], coords[0], coords[1]),
        coords: coords,
        rating: '4.9',
      };

      setSelectedDestinationPlace(placeObj);
      setFocusCoords(coords);
      setCategoryPlaces((prev) => ({
        ...prev,
        focus: [placeObj, ...(prev.focus || []).filter((p) => p.title !== placeObj.title)],
      }));
      setActiveCategories((prev) => new Set([...prev, 'focus']));

      setTimeout(() => {
        document.getElementById('live-trip-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [focusLocationItem, userPos, destCoords, destination]);

  // Initial load: show attractions by default
  useEffect(() => {
    const [lat, lng] = userPos;
    setCategoryPlaces({ attraction: getInstantNearbyItems('attraction', lat, lng) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const basePoints = useMemo(() => {
    const list = [];
    list.push({ id: 'start-point', title: `Start: ${startLocation}`, coords: startCoords, type: 'start' });
    locations.forEach((item, idx) => {
      const c = getCoordsForPlace(item.location || item.title, idx + 1, destCoords);
      list.push({ id: item.id || `loc-${idx}`, title: item.title || item.location || `Stop ${idx + 1}`, coords: c, type: item.type || 'activity' });
    });
    list.push({ id: 'end-point', title: `Destination: ${destination}`, coords: destCoords, type: 'end' });
    return list;
  }, [locations, startLocation, destination, startCoords, destCoords]);

  const mainHighwayCoords = useMemo(() => [startCoords, userPos, destCoords], [startCoords, userPos, destCoords]);

  const selectedRoutePolyline = useMemo(() => {
    if (!selectedDestinationPlace) return null;
    return [userPos, selectedDestinationPlace.coords];
  }, [userPos, selectedDestinationPlace]);

  return (
    <div id="live-trip-map" className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border bg-surface-elevated">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-sm font-bold text-text-primary">Live Navigation & Route Map</p>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Traveling: <span className="font-semibold text-text-primary">{startLocation || 'RJY'}</span> ➔ <span className="font-semibold text-text-primary">{destination || 'Goa'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setIsTrackingLive(!isTrackingLive);
              if (!isTrackingLive) setIsSimulating(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              isTrackingLive ? 'bg-emerald-500 text-white shadow-md' : 'bg-surface-elevated border border-border text-text-secondary hover:bg-border-subtle'
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            {isTrackingLive ? 'GPS Active' : 'Use My GPS'}
          </button>

          <button
            onClick={() => {
              setIsSimulating(!isSimulating);
              if (!isSimulating) setIsTrackingLive(false);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              isSimulating ? 'bg-amber-500 text-white shadow-md animate-pulse' : 'bg-accent-violet/10 text-accent-violet hover:bg-accent-violet/20'
            }`}
          >
            {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isSimulating ? 'Pause Drive' : 'Simulate Drive'}
          </button>

          <button
            onClick={() => setAutoFollow(!autoFollow)}
            title="Auto follow vehicle on map"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              autoFollow ? 'bg-accent-violet text-white' : 'bg-surface border border-border text-text-muted'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            Auto-Follow
          </button>
        </div>
      </div>

      {/* Toggle Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-border bg-surface">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Find Nearby:</span>

          {[
            { cat: 'attraction', label: 'Popular Places', icon: <Landmark className="h-3.5 w-3.5" />, on: 'bg-pink-600 text-white shadow-md ring-2 ring-pink-400/30', dot: 'bg-pink-400' },
            { cat: 'hotel',      label: 'Rooms & Stays',  icon: <Hotel    className="h-3.5 w-3.5" />, on: 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/30', dot: 'bg-purple-400' },
            { cat: 'food',       label: 'Food & Dhabas',  icon: <Utensils className="h-3.5 w-3.5" />, on: 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400/30',  dot: 'bg-amber-400' },
            { cat: 'fuel',       label: 'Fuel Pumps',     icon: <Fuel     className="h-3.5 w-3.5" />, on: 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30',   dot: 'bg-blue-400' },
          ].map(({ cat, label, icon, on, dot }) => {
            const isOn = activeCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => handleToggleCategory(cat)}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  isOn ? on : 'border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-accent-violet/40'
                }`}
              >
                {isOn && (
                  <span className={`absolute -top-1 -right-1 flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-60`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${dot}`} />
                  </span>
                )}
                {icon}
                {label}
                <span className={`ml-0.5 text-[10px] font-black ${isOn ? 'opacity-90' : 'opacity-40'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDestinationPlace && (
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
            <span>Route Active:</span>
            <span>{selectedDestinationPlace.title} ({selectedDestinationPlace.distKm} km)</span>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="relative h-96 w-full z-0">
        <MapContainer center={userPos} zoom={12} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer url={TILE_LAYERS[mapStyle].url} attribution={TILE_LAYERS[mapStyle].attribution} />

          <MapAutoFollow center={userPos} enabled={autoFollow} />
          <MapFlyTo coords={focusCoords} />

          <Polyline positions={mainHighwayCoords} pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.6, dashArray: '6,6' }} />

          {selectedRoutePolyline && (
            <Polyline positions={selectedRoutePolyline} pathOptions={{ color: '#10b981', weight: 6, opacity: 0.95 }} />
          )}

          {basePoints.map((pt) => (
            <Marker key={pt.id} position={pt.coords} icon={createCustomIcon(pt.type)}>
              <Popup><div className="p-1 font-semibold text-xs text-text-primary">{pt.title}</div></Popup>
            </Marker>
          ))}

          <Marker position={userPos} icon={createCustomIcon('live-user')}>
            <Popup>
              <div className="p-1 max-w-[180px]">
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 uppercase">Current Position</span>
                <p className="mt-1 font-bold text-xs text-text-primary">En route to {destination}</p>
              </div>
            </Popup>
          </Marker>

          {nearbyPlaces.map((np) => (
            <Marker
              key={np.id}
              position={np.coords}
              icon={createCustomIcon(np.type)}
              eventHandlers={{
                click: () => setSelectedDestinationPlace(np),
              }}
            >
              <Popup>
                <div className="p-1.5 max-w-[210px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-600">
                      {np.category === 'attraction' ? '🏰 Popular Sight' : np.category === 'hotel' ? '🏨 Room / Stay' : '🍽️ Food'}
                    </span>
                    <span className="font-bold text-emerald-600">⭐ {np.rating}</span>
                  </div>
                  <h4 className="mt-1 font-bold text-sm text-text-primary">{np.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{np.cuisine}</p>
                  {np.price && <p className="mt-1 text-xs font-bold text-pink-600">{np.price}</p>}
                  <p className="text-xs font-semibold text-accent-violet mt-1">📍 {np.distKm} km away</p>
                  
                  <button
                    onClick={() => setSelectedDestinationPlace(np)}
                    className="mt-2.5 block w-full rounded-lg bg-emerald-600 py-1 text-center text-xs font-bold text-white hover:opacity-90"
                  >
                    Show Route on Map
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Places Cards Drawer */}
      {nearbyPlaces.length > 0 && (
        <div className="border-t border-border bg-surface-elevated p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-bold text-text-primary">
                📍 Showing:{' '}
                {[...activeCategories]
                  .filter(c => c !== 'focus')
                  .map(c => c === 'attraction' ? 'Places' : c === 'hotel' ? 'Stays' : c === 'food' ? 'Food' : 'Fuel')
                  .join(' + ') || 'Nearby Results'}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-text-muted">{nearbyPlaces.length} Pinned</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyPlaces.map((place) => {
              const isSelected = selectedDestinationPlace?.id === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedDestinationPlace(place)}
                  className={`rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    isSelected ? 'border-emerald-500 bg-emerald-500/5 shadow-md ring-2 ring-emerald-500/20' : 'border-border bg-surface hover:border-accent-violet/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-600/10 text-pink-600">
                        {place.category === 'attraction' ? (
                          <Landmark className="h-5 w-5" />
                        ) : place.category === 'hotel' ? (
                          <BedDouble className="h-5 w-5" />
                        ) : (
                          <Utensils className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-text-primary leading-tight">{place.title}</h5>
                        <p className="text-[11px] text-text-secondary mt-0.5">{place.cuisine}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      ⭐ {place.rating}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs">
                    <div>
                      {place.price ? (
                        <span className="font-bold text-pink-600 text-xs">{place.price}</span>
                      ) : (
                        <span className="text-text-muted text-[11px]">📍 {place.distKm} km away</span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDestinationPlace(place);
                      }}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-accent-violet/10 text-accent-violet hover:bg-accent-violet/20'
                      }`}
                    >
                      {isSelected ? 'Route Drawn ✓' : 'View Route'}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
