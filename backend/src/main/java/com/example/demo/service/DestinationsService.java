
package com.example.demo.service;

import com.example.demo.models.Destinations;

import java.util.List;
import java.util.Optional;

public interface DestinationsService {

    Destinations saveDestination(Destinations destination);

    List<Destinations> getAllDestinations();

    Optional<Destinations> getDestinationById(Long id);

    Destinations updateDestination(Long id, Destinations destination);

    void deleteDestination(Long id);
}
