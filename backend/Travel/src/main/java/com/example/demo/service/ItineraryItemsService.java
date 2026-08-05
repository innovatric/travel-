
package com.example.demo.service;

import com.example.demo.models.ItineraryItems;

import java.util.List;
import java.util.Optional;

public interface ItineraryItemsService {

    ItineraryItems saveItineraryItem(ItineraryItems itineraryItem);

    List<ItineraryItems> getAllItineraryItems();

    Optional<ItineraryItems> getItineraryItemById(Long id);

    ItineraryItems updateItineraryItem(Long id, ItineraryItems itineraryItem);

    void deleteItineraryItem(Long id);
}
