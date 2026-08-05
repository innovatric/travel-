package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Restaurants;

public interface RestaurantsRepository extends JpaRepository<Restaurants, Long> {

}