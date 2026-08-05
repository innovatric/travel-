
package com.example.demo.serviceimpl;

import com.example.demo.models.ItineraryItems;
import com.example.demo.repository.ItineraryItemsRepository;
import com.example.demo.service.ItineraryItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItineraryItemsServiceImpl implements ItineraryItemsService {

    @Autowired
    private ItineraryItemsRepository itineraryItemsRepository;

    @Override
    public ItineraryItems saveItineraryItem(ItineraryItems itineraryItem) {
        return itineraryItemsRepository.save(itineraryItem);
    }

    @Override
    public List<ItineraryItems> getAllItineraryItems() {
        return itineraryItemsRepository.findAll();
    }

    @Override
    public Optional<ItineraryItems> getItineraryItemById(Long id) {
        return itineraryItemsRepository.findById(id);
    }

    @Override
    public ItineraryItems updateItineraryItem(Long id, ItineraryItems itineraryItem) {
        itineraryItem.setItemId(id);
        return itineraryItemsRepository.save(itineraryItem);
    }

    @Override
    public void deleteItineraryItem(Long id) {
        itineraryItemsRepository.deleteById(id);
    }
}