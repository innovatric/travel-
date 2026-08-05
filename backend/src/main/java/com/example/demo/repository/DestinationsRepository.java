package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Destinations;

public interface DestinationsRepository extends JpaRepository<Destinations, Long> {

}