package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Favorites;

public interface FavoritesRepository extends JpaRepository<Favorites, Long> {

}