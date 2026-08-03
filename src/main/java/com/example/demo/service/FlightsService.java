
package com.example.demo.service;

import com.example.demo.models.Flights;

import java.util.List;
import java.util.Optional;

public interface FlightsService {

    Flights saveFlight(Flights flight);

    List<Flights> getAllFlights();

    Optional<Flights> getFlightById(Long id);

    Flights updateFlight(Long id, Flights flight);

    void deleteFlight(Long id);
}
