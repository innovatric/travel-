package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.ItineraryItems;

public interface ItineraryItemsRepository extends JpaRepository<ItineraryItems, Long> {

}