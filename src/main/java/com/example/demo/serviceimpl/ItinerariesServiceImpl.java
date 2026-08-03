
package com.example.demo.serviceimpl;

import com.example.demo.models.Itineraries;
import com.example.demo.repository.ItinerariesRepository;
import com.example.demo.service.ItinerariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItinerariesServiceImpl implements ItinerariesService {

    @Autowired
    private ItinerariesRepository itinerariesRepository;

    @Override
    public Itineraries saveItinerary(Itineraries itinerary) {
        return itinerariesRepository.save(itinerary);
    }

    @Override
    public List<Itineraries> getAllItineraries() {
        return itinerariesRepository.findAll();
    }

    @Override
    public Optional<Itineraries> getItineraryById(Long id) {
        return itinerariesRepository.findById(id);
    }

    @Override
    public Itineraries updateItinerary(Long id, Itineraries itinerary) {
        itinerary.setItineraryId(id);
        return itinerariesRepository.save(itinerary);
    }

    @Override
    public void deleteItinerary(Long id) {
        itinerariesRepository.deleteById(id);
    }
}
