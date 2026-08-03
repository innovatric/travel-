
package com.example.demo.service;

import com.example.demo.models.Restaurants;

import java.util.List;
import java.util.Optional;

public interface RestaurantsService {

    Restaurants saveRestaurant(Restaurants restaurant);

    List<Restaurants> getAllRestaurants();

    Optional<Restaurants> getRestaurantById(Long id);

    Restaurants updateRestaurant(Long id, Restaurants restaurant);

    void deleteRestaurant(Long id);
}