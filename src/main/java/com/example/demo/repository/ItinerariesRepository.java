package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Itineraries;

public interface ItinerariesRepository extends JpaRepository<Itineraries, Long> {

}