
package com.example.demo.controller;

import com.example.demo.models.Itineraries;
import com.example.demo.service.ItinerariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/itineraries")
@CrossOrigin(origins = "*")
public class ItinerariesController {

    @Autowired
    private ItinerariesService itinerariesService;

    @PostMapping
    public Itineraries saveItinerary(@RequestBody Itineraries itinerary) {
        return itinerariesService.saveItinerary(itinerary);
    }

    @GetMapping
    public List<Itineraries> getAllItineraries() {
        return itinerariesService.getAllItineraries();
    }

    @GetMapping("/{id}")
    public Optional<Itineraries> getItineraryById(@PathVariable Long id) {
        return itinerariesService.getItineraryById(id);
    }

    @PutMapping("/{id}")
    public Itineraries updateItinerary(@PathVariable Long id, @RequestBody Itineraries itinerary) {
        return itinerariesService.updateItinerary(id, itinerary);
    }

    @DeleteMapping("/{id}")
    public void deleteItinerary(@PathVariable Long id) {
        itinerariesService.deleteItinerary(id);
    }
}