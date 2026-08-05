import api from './api';

export async function createTrip(tripData) {
  const response = await api.post('/trips', tripData);
  return response.data;
}

export async function getTrips(params = {}) {
  const response = await api.get('/trips', { params });
  return response.data;
}

export async function getTripById(tripId) {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
}

export async function generateItinerary(tripId, preferences = {}) {
  // Call the GenAI Python service directly for AI trip planning
  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/planTrip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) throw new Error(`AI service error ${response.status}`);
    return await response.json();
  } catch {
    // Fallback: try Spring Boot generate endpoint
    const response = await api.post(`/trips/${tripId}/generate-itinerary`, preferences);
    return response.data;
  }
}

export async function chatWithAIGuide(message, context = {}) {
  const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
  const payload = {
    message,
    session_id: context.session_id || 'session-1',
    destination: context.destination || 'Destination',
    startLocation: context.startLocation || 'Origin',
  };
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`AI chat error ${response.status}`);
    return await response.json();
  } catch {
    // Fallback: try Spring Boot chat endpoint
    const response = await api.post('/chat', payload);
    return response.data;
  }
}




export async function generateRouteImages(start, destination, tripId = 'default') {
  try {
    const response = await api.post('/api/genai/route-images', { start, destination, tripId });
    return response.data?.images || [];
  } catch (error) {
    console.error('Error generating route images:', error);
    return [];
  }
}

export async function generatePoiImages(category, location, count = 3) {
  try {
    const response = await api.post('/api/genai/poi-images', { category, location, count: String(count) });
    return response.data?.images || [];
  } catch (error) {
    console.error('Error generating POI images:', error);
    return [];
  }
}

export async function updateTrip(tripId, updates) {
  const response = await api.patch(`/trips/${tripId}`, updates);
  return response.data;
}

export async function deleteTrip(tripId) {
  const response = await api.delete(`/trips/${tripId}`);
  return response.data;
}

export async function addFavorite(itemId, itemType) {
  const response = await api.post('/favorites', { itemId, itemType });
  return response.data;
}

export async function getFavorites() {
  const response = await api.get('/favorites');
  return response.data;
}

export async function removeFavorite(favoriteId) {
  const response = await api.delete(`/favorites/${favoriteId}`);
  return response.data;
}

