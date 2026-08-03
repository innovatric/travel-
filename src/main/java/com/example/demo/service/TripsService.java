
package com.example.demo.service;

import com.example.demo.models.Trips;
import java.util.List;
import java.util.Optional;

public interface TripsService {

    Trips saveTrip(Trips trip);

    List<Trips> getAllTrips();

    Optional<Trips> getTripById(Long id);

    Trips updateTrip(Long id, Trips trip);

    void deleteTrip(Long id);
}

