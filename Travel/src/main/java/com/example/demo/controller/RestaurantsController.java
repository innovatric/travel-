
package com.example.demo.controller;

import com.example.demo.models.Restaurants;
import com.example.demo.service.RestaurantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantsController {

    @Autowired
    private RestaurantsService restaurantsService;

    @PostMapping
    public Restaurants saveRestaurant(@RequestBody Restaurants restaurant) {
        return restaurantsService.saveRestaurant(restaurant);
    }

    @GetMapping
    public List<Restaurants> getAllRestaurants() {
        return restaurantsService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public Optional<Restaurants> getRestaurantById(@PathVariable Long id) {
        return restaurantsService.getRestaurantById(id);
    }

    @PutMapping("/{id}")
    public Restaurants updateRestaurant(@PathVariable Long id,
                                        @RequestBody Restaurants restaurant) {
        return restaurantsService.updateRestaurant(id, restaurant);
    }

    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable Long id) {
        restaurantsService.deleteRestaurant(id);
    }
}
