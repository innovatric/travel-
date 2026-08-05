
package com.example.demo.serviceimpl;

import com.example.demo.models.Restaurants;
import com.example.demo.repository.RestaurantsRepository;
import com.example.demo.service.RestaurantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantsServiceImpl implements RestaurantsService {

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    @Override
    public Restaurants saveRestaurant(Restaurants restaurant) {
        return restaurantsRepository.save(restaurant);
    }

    @Override
    public List<Restaurants> getAllRestaurants() {
        return restaurantsRepository.findAll();
    }

    @Override
    public Optional<Restaurants> getRestaurantById(Long id) {
        return restaurantsRepository.findById(id);
    }

    @Override
    public Restaurants updateRestaurant(Long id, Restaurants restaurant) {
        restaurant.setRestaurantId(id);
        return restaurantsRepository.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long id) {
        restaurantsRepository.deleteById(id);
    }
}