
package com.example.demo.controller;

import com.example.demo.models.Flights;
import com.example.demo.service.FlightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/flights")
@CrossOrigin(origins = "*")
public class FlightsController {

    @Autowired
    private FlightsService flightsService;

    @PostMapping
    public Flights saveFlight(@RequestBody Flights flight) {
        return flightsService.saveFlight(flight);
    }

    @GetMapping
    public List<Flights> getAllFlights() {
        return flightsService.getAllFlights();
    }

    @GetMapping("/{id}")
    public Optional<Flights> getFlightById(@PathVariable Long id) {
        return flightsService.getFlightById(id);
    }

    @PutMapping("/{id}")
    public Flights updateFlight(@PathVariable Long id,
                                @RequestBody Flights flight) {
        return flightsService.updateFlight(id, flight);
    }

    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable Long id) {
        flightsService.deleteFlight(id);
    }
}