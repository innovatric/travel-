import { createContext, useContext, useReducer, useCallback } from 'react';
import * as tripService from '../services/tripService';

const TripContext = createContext(null);

const loadSavedTrips = () => {
  try {
    const raw = localStorage.getItem('tripflow_saved_trips');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState = {
  trips: [],
  localTrips: loadSavedTrips(),
  activeTrip: null,
  favorites: [],
  localFavorites: [], // local-state fallback when API unavailable
  plannerDraft: { prompt: '', preferences: [] },
  plannerForm: null,
  plannerRequest: null,
  isLoading: false,
  error: null,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TRIPS_SUCCESS':
      return { ...state, trips: action.payload, isLoading: false };
    case 'FETCH_TRIP_SUCCESS':
      return { ...state, activeTrip: action.payload, isLoading: false };
    case 'FETCH_FAVORITES_SUCCESS':
      return { ...state, favorites: action.payload, isLoading: false };
    case 'ADD_LOCAL_TRIP': {
      const filtered = state.localTrips.filter((t) => String(t.id) !== String(action.payload.id));
      const nextTrips = [action.payload, ...filtered];
      try {
        localStorage.setItem('tripflow_saved_trips', JSON.stringify(nextTrips));
      } catch {}
      return { ...state, localTrips: nextTrips };
    }
    case 'DELETE_LOCAL_TRIP': {
      const nextTrips = state.localTrips.filter((t) => String(t.id) !== String(action.payload));
      try {
        localStorage.setItem('tripflow_saved_trips', JSON.stringify(nextTrips));
      } catch {}
      return { ...state, localTrips: nextTrips };
    }
    case 'ADD_LOCAL_FAVORITE': {
      const alreadySaved = state.localFavorites.some((f) => f.id === action.payload.id);
      if (alreadySaved) return state;
      return { ...state, localFavorites: [action.payload, ...state.localFavorites] };
    }
    case 'REMOVE_LOCAL_FAVORITE':
      return { ...state, localFavorites: state.localFavorites.filter((f) => f.id !== action.payload) };
    case 'SET_ACTIVE_TRIP':
      return { ...state, activeTrip: action.payload };
    case 'CLEAR_ACTIVE_TRIP':
      return { ...state, activeTrip: null };
    case 'SET_PLANNER_DRAFT':
      return { ...state, plannerDraft: action.payload };
    case 'SET_PLANNER_FORM':
      return { ...state, plannerForm: action.payload };
    case 'SET_PLANNER_REQUEST':
      return { ...state, plannerRequest: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const fetchTrips = useCallback(async (params) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await tripService.getTrips(params);
      dispatch({ type: 'FETCH_TRIPS_SUCCESS', payload: data.trips ?? data ?? [] });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load trips.';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const fetchTripById = useCallback(async (tripId) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await tripService.getTripById(tripId);
      dispatch({ type: 'FETCH_TRIP_SUCCESS', payload: data.trip ?? data });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load trip.';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await tripService.getFavorites();
      dispatch({ type: 'FETCH_FAVORITES_SUCCESS', payload: data.favorites ?? data ?? [] });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load favorites.';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const createTrip = useCallback(async (tripData) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await tripService.createTrip(tripData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create trip.';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const generateItinerary = useCallback(async (tripId, preferences) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await tripService.generateItinerary(tripId, preferences);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate itinerary.';
      dispatch({ type: 'FETCH_FAILURE', payload: message });
      throw error;
    }
  }, []);

  const addFavorite = useCallback(async (item) => {
    // Optimistic local update
    const localItem = {
      id: item.id || `fav-${Date.now()}`,
      title: item.title || item.name || 'Saved item',
      details: item.description || '',
      itemType: item.type || item.category || 'Activity',
      location: item.location || '',
      estimatedCost: item.estimatedCost || '',
      savedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LOCAL_FAVORITE', payload: localItem });
    try {
      await tripService.addFavorite(item.id, item.type || 'activity');
    } catch {
      // Keep local copy even if API fails
    }
    return localItem;
  }, []);

  const removeFavorite = useCallback(async (itemId) => {
    dispatch({ type: 'REMOVE_LOCAL_FAVORITE', payload: itemId });
    try {
      await tripService.removeFavorite(itemId);
    } catch {
      // Silently ignore
    }
  }, []);

  const saveTripToHistory = useCallback((tripRecord) => {
    const record = {
      id: tripRecord.id || tripRecord.tripId || `trip-${Date.now()}`,
      tripId: tripRecord.id || tripRecord.tripId || `trip-${Date.now()}`,
      tripName: tripRecord.tripName || `Trip to ${tripRecord.destination || 'Destination'}`,
      startLocation: tripRecord.startLocation || 'Origin',
      destination: tripRecord.destination || 'Destination',
      startDate: tripRecord.startDate || new Date().toISOString().split('T')[0],
      endDate: tripRecord.endDate || '',
      travellers: tripRecord.travellers || 1,
      budget: tripRecord.budget || 5000,
      currency: tripRecord.currency || 'INR',
      status: 'PLANNED',
      createdAt: new Date().toISOString(),
      itinerary: tripRecord.itinerary || null,
    };
    dispatch({ type: 'ADD_LOCAL_TRIP', payload: record });
    return record;
  }, []);

  const deleteTripFromHistory = useCallback((tripId) => {
    dispatch({ type: 'DELETE_LOCAL_TRIP', payload: tripId });
    try {
      tripService.deleteTrip(tripId).catch(() => {});
    } catch {}
  }, []);

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });
  const setActiveTrip = (trip) => dispatch({ type: 'SET_ACTIVE_TRIP', payload: trip });
  const clearActiveTrip = () => dispatch({ type: 'CLEAR_ACTIVE_TRIP' });
  const setPlannerDraft = (draft) => dispatch({ type: 'SET_PLANNER_DRAFT', payload: draft });
  const setPlannerForm = (form) => dispatch({ type: 'SET_PLANNER_FORM', payload: form });
  const setPlannerRequest = (request) => dispatch({ type: 'SET_PLANNER_REQUEST', payload: request });

  const value = {
    ...state,
    fetchTrips,
    fetchTripById,
    fetchFavorites,
    createTrip,
    generateItinerary,
    addFavorite,
    removeFavorite,
    saveTripToHistory,
    deleteTripFromHistory,
    setActiveTrip,
    clearActiveTrip,
    setPlannerDraft,
    setPlannerForm,
    setPlannerRequest,
    clearError,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
