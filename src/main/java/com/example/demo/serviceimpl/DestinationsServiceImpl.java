
package com.example.demo.serviceimpl;

import com.example.demo.models.Destinations;
import com.example.demo.repository.DestinationsRepository;
import com.example.demo.service.DestinationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DestinationsServiceImpl implements DestinationsService {

    @Autowired
    private DestinationsRepository destinationsRepository;

    @Override
    public Destinations saveDestination(Destinations destination) {
        return destinationsRepository.save(destination);
    }

    @Override
    public List<Destinations> getAllDestinations() {
        return destinationsRepository.findAll();
    }

    @Override
    public Optional<Destinations> getDestinationById(Long id) {
        return destinationsRepository.findById(id);
    }

    @Override
    public Destinations updateDestination(Long id, Destinations destination) {
        destination.setDestinationId(id);
        return destinationsRepository.save(destination);
    }

    @Override
    public void deleteDestination(Long id) {
        destinationsRepository.deleteById(id);
    }
}
