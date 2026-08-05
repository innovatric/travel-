
package com.example.demo.serviceimpl;

import com.example.demo.models.Trips;
import com.example.demo.repository.TripsRepository;
import com.example.demo.service.TripsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripsServiceImpl implements TripsService {

    @Autowired
    private TripsRepository tripsRepository;

    @Override
    public Trips saveTrip(Trips trip) {
        return tripsRepository.save(trip);
    }

    @Override
    public List<Trips> getAllTrips() {
        return tripsRepository.findAll();
    }

    @Override
    public Optional<Trips> getTripById(Long id) {
        return tripsRepository.findById(id);
    }

    @Override
    public Trips updateTrip(Long id, Trips trip) {
        trip.setTripId(id);
        return tripsRepository.save(trip);
    }

    @Override
    public void deleteTrip(Long id) {
        tripsRepository.deleteById(id);
    }
}