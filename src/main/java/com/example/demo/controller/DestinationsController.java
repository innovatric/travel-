package com.example.demo.controller;

import com.example.demo.models.Destinations;
import com.example.demo.service.DestinationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/destinations")
@CrossOrigin(origins = "*")
public class DestinationsController {

    @Autowired
    private DestinationsService destinationsService;

    @PostMapping
    public Destinations saveDestination(@RequestBody Destinations destination) {
        return destinationsService.saveDestination(destination);
    }

    @GetMapping
    public List<Destinations> getAllDestinations() {
        List<Destinations> list = destinationsService.getAllDestinations();
        if (list.isEmpty()) {
            List<Destinations> seed = new ArrayList<>();
            
            Destinations d1 = new Destinations();
            d1.setName("Paris, France");
            d1.setCountry("France");
            d1.setDescription("The City of Light boasts iconic monuments, romantic cafes, and world-class museums.");
            d1.setCategory("Cultural & Romantic");
            
            Destinations d2 = new Destinations();
            d2.setName("Kyoto, Japan");
            d2.setCountry("Japan");
            d2.setDescription("Ancient temples, sublime bamboo groves, traditional tea houses, and vibrant autumn foliage.");
            d2.setCategory("Historical & Heritage");

            Destinations d3 = new Destinations();
            d3.setName("Goa, India");
            d3.setCountry("India");
            d3.setDescription("Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and delicious seafood.");
            d3.setCategory("Beach & Relax");

            destinationsService.saveDestination(d1);
            destinationsService.saveDestination(d2);
            destinationsService.saveDestination(d3);
            return destinationsService.getAllDestinations();
        }
        return list;
    }

    @GetMapping("/{id}")
    public Optional<Destinations> getDestinationById(@PathVariable Long id) {
        return destinationsService.getDestinationById(id);
    }

    @PutMapping("/{id}")
    public Destinations updateDestination(@PathVariable Long id, @RequestBody Destinations destination) {
        return destinationsService.updateDestination(id, destination);
    }

    @DeleteMapping("/{id}")
    public void deleteDestination(@PathVariable Long id) {
        destinationsService.deleteDestination(id);
    }
}