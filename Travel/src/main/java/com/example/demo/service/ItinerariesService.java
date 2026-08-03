
package com.example.demo.service;

import com.example.demo.models.Itineraries;

import java.util.List;
import java.util.Optional;

public interface ItinerariesService {

    Itineraries saveItinerary(Itineraries itinerary);

    List<Itineraries> getAllItineraries();

    Optional<Itineraries> getItineraryById(Long id);

    Itineraries updateItinerary(Long id, Itineraries itinerary);

    void deleteItinerary(Long id);
}
