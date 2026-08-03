
package com.example.demo.controller;

import com.example.demo.models.ItineraryItems;
import com.example.demo.service.ItineraryItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/itinerary-items")
@CrossOrigin(origins = "*")
public class ItineraryItemsController {

    @Autowired
    private ItineraryItemsService itineraryItemsService;

    @PostMapping
    public ItineraryItems saveItineraryItem(@RequestBody ItineraryItems item) {
        return itineraryItemsService.saveItineraryItem(item);
    }

    @GetMapping
    public List<ItineraryItems> getAllItineraryItems() {
        return itineraryItemsService.getAllItineraryItems();
    }

    @GetMapping("/{id}")
    public Optional<ItineraryItems> getItineraryItemById(@PathVariable Long id) {
        return itineraryItemsService.getItineraryItemById(id);
    }

    @PutMapping("/{id}")
    public ItineraryItems updateItineraryItem(@PathVariable Long id,
                                              @RequestBody ItineraryItems item) {
        return itineraryItemsService.updateItineraryItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void deleteItineraryItem(@PathVariable Long id) {
        itineraryItemsService.deleteItineraryItem(id);
    }
}