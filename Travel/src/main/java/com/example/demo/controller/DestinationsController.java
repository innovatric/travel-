
package com.example.demo.controller;

import com.example.demo.models.Destinations;
import com.example.demo.service.DestinationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        return destinationsService.getAllDestinations();
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