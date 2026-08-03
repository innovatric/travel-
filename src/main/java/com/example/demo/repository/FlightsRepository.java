package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Flights;

public interface FlightsRepository extends JpaRepository<Flights, Long> {

}