// Real photo cache to prevent redundant fetches
const imageCache = new Map();

// Extensive real photo archive by destination keyword
const CITY_PHOTO_ARCHIVE = {
  arunachalam: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Arunachaleswara_Temple_Tiruvannamalai.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tiruvannamalai_gopuram.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Annamalai_hill_Tiruvannamalai.jpg?width=800',
  ],
  tiruvannamalai: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Arunachaleswara_Temple_Tiruvannamalai.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tiruvannamalai_gopuram.jpg?width=800',
  ],
  tirupati: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tirumala_090615.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tirumala_Temple_Gopuram.jpg?width=800',
  ],
  hyderabad: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Charminar_Hyderabad_1.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Golconda_Fort_Panorama.jpg?width=800',
  ],
  london: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/London_Eye_at_Night_2014.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Big_Ben_Phone_Box.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tower_Bridge_from_the_Shard%2C_London.jpg?width=800',
  ],
  paris: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Tour_Eiffel_Wikimedia_Commons.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Louvre_Museum_Wikimedia_Commons.jpg?width=800',
  ],
  goa: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Calangute_Beach_Goa.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Palolem_Beach_Goa.jpg?width=800',
  ],
  delhi: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Qutub_Minar_Delhi.jpg?width=800',
  ],
  vizag: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/RK_Beach_Visakhapatnam.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Kailasagiri_Visakhapatnam.jpg?width=800',
  ],
  visakhapatnam: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/RK_Beach_Visakhapatnam.jpg?width=800',
  ],
  rajahmundry: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Godavari_Arch_Bridge_Rajahmundry.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Rajahmundry_Godavari_River.jpg?width=800',
  ],
  pondicherry: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Promenade_Beach_Puducherry.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Matrimandir_Auroville.jpg?width=800',
  ],
  puducherry: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Promenade_Beach_Puducherry.jpg?width=800',
  ],
  mumbai: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Gateway_of_India_Mumbai.jpg?width=800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Marine_Drive_Mumbai.jpg?width=800',
  ],
  kolkata: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Howrah_Bridge_Kolkata.jpg?width=800',
  ],
  chennai: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Kapaleeshwarar_Temple_Chennai.jpg?width=800',
  ],
};

export async function fetchRealPlacePhoto(title = '', location = '', type = 'activity') {
  const cacheKey = `${title}_${location}_${type}`.toLowerCase().trim();
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const queryText = `${title} ${location}`.trim();
  const searchKey = queryText.toLowerCase();

  // 1. Check verified archive
  for (const [key, photos] of Object.entries(CITY_PHOTO_ARCHIVE)) {
    if (searchKey.includes(key) && photos.length > 0) {
      const photo = photos[Math.abs(hashString(title)) % photos.length];
      imageCache.set(cacheKey, photo);
      return photo;
    }
  }

  // 2. Fetch live Wikimedia Commons photo for place
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(queryText)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) }).then((r) => r.json());
    const pages = res.query?.pages;
    if (pages) {
      for (const pid of Object.keys(pages)) {
        const info = pages[pid]?.imageinfo?.[0];
        const fname = pages[pid]?.title?.toLowerCase() || '';
        if (
          info && (info.thumburl || info.url) &&
          (fname.endsWith('.jpg') || fname.endsWith('.jpeg') || fname.endsWith('.png')) &&
          !fname.includes('logo') && !fname.includes('map') && !fname.includes('icon') && !fname.includes('flag')
        ) {
          const photoUrl = info.thumburl || info.url;
          imageCache.set(cacheKey, photoUrl);
          return photoUrl;
        }
      }
    }
  } catch (_) { /* fallback */ }

  // 3. Dynamic category fallback
  const fallbackUrl = getCategoryUnsplashFallback(type, title);
  imageCache.set(cacheKey, fallbackUrl);
  return fallbackUrl;
}

function hashString(str) {
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function getCategoryUnsplashFallback(type, title) {
  const hash = Math.abs(hashString(title));
  if (type === 'hotel') {
    const hotelImgs = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ];
    return hotelImgs[hash % hotelImgs.length];
  }
  if (type === 'restaurant') {
    const foodImgs = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    ];
    return foodImgs[hash % foodImgs.length];
  }
  const attractionImgs = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  ];
  return attractionImgs[hash % attractionImgs.length];
}
