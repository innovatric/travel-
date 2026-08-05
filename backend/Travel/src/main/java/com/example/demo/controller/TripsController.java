
package com.example.demo.controller;

import com.example.demo.models.Trips;
import com.example.demo.service.TripsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripsController {

    @Autowired
    private TripsService tripsService;

    @PostMapping
    public Trips saveTrip(@RequestBody Trips trip) {
        return tripsService.saveTrip(trip);
    }

    @GetMapping
    public List<Trips> getAllTrips() {
        return tripsService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Optional<Trips> getTripById(@PathVariable Long id) {
        return tripsService.getTripById(id);
    }

    @PutMapping("/{id}")
    public Trips updateTrip(@PathVariable Long id, @RequestBody Trips trip) {
        return tripsService.updateTrip(id, trip);
    }
    
    @PostMapping("/{id}/generate-itinerary")
    public Map<String, Object> generateItinerary(
            @PathVariable Long id,
            @RequestBody Map<String, Object> preferences) {

        Optional<Trips> trip = tripsService.getTripById(id);

        if (trip.isEmpty()) {
            throw new RuntimeException("Trip not found with ID: " + id);
        }

        return Map.of(
                "tripId", id,
                "trip", trip.get(),
                "preferences", preferences,
                "message", "Itinerary generated successfully"
        );
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripsService.deleteTrip(id);
    }
}