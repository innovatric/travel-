/**
 * s3MediaService.js
 * Fetches images / PDFs from the Spring Boot → AWS S3 bridge.
 *
 * Bucket folder layout:
 *   travel-planner-bucket/
 *   ├── users/profile-images/       category: "profile"
 *   ├── hotels/images/              category: "hotel"
 *   ├── destinations/images/        category: "destination"
 *   ├── attractions/images/         category: "attraction"
 *   ├── restaurants/images/         category: "restaurant"
 *   └── itineraries/pdfs/           category: "itinerary"
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8085';

/**
 * Fetch images for a known category alias.
 * @param {'hotel'|'destination'|'attraction'|'restaurant'|'profile'|'itinerary'} category
 * @returns {Promise<string[]>} array of public S3 image URLs
 */
export async function fetchImagesByCategory(category) {
  const res = await fetch(`${API_BASE}/api/media/images?category=${encodeURIComponent(category)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.images || [];
}

/**
 * Fetch images by raw S3 folder path (e.g. "hotels/images").
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
export async function fetchImagesByFolder(folder) {
  const res = await fetch(`${API_BASE}/api/media/images?folder=${encodeURIComponent(folder)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.images || [];
}

/**
 * Upload a file to a specific category bucket folder.
 * @param {File} file
 * @param {'hotel'|'destination'|'attraction'|'restaurant'|'profile'|'itinerary'} category
 * @returns {Promise<string>} the uploaded file's public URL
 */
export async function uploadToCategory(file, category) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/media/upload?category=${encodeURIComponent(category)}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

/**
 * List all available category → folder mappings from the backend.
 * @returns {Promise<Record<string, string>>}
 */
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/media/categories`);
  if (!res.ok) return {};
  return res.json();
}
