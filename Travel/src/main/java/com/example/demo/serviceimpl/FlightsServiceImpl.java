
package com.example.demo.serviceimpl;

import com.example.demo.models.Flights;
import com.example.demo.repository.FlightsRepository;
import com.example.demo.service.FlightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlightsServiceImpl implements FlightsService {

    @Autowired
    private FlightsRepository flightsRepository;

    @Override
    public Flights saveFlight(Flights flight) {
        return flightsRepository.save(flight);
    }

    @Override
    public List<Flights> getAllFlights() {
        return flightsRepository.findAll();
    }

    @Override
    public Optional<Flights> getFlightById(Long id) {
        return flightsRepository.findById(id);
    }

    @Override
    public Flights updateFlight(Long id, Flights flight) {
        flight.setFlightId(id);
        return flightsRepository.save(flight);
    }

    @Override
    public void deleteFlight(Long id) {
        flightsRepository.deleteById(id);
    }
}