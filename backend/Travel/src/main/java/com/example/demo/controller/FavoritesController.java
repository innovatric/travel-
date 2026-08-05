
package com.example.demo.controller;

import com.example.demo.models.Favorites;
import com.example.demo.service.FavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = "*")
public class FavoritesController {

    @Autowired
    private FavoritesService favoritesService;

    @PostMapping
    public Favorites saveFavorite(@RequestBody Favorites favorite) {
        return favoritesService.saveFavorite(favorite);
    }

    @GetMapping
    public List<Favorites> getAllFavorites() {
        return favoritesService.getAllFavorites();
    }

    @GetMapping("/{id}")
    public Optional<Favorites> getFavoriteById(@PathVariable Long id) {
        return favoritesService.getFavoriteById(id);
    }

    @PutMapping("/{id}")
    public Favorites updateFavorite(@PathVariable Long id,
                                    @RequestBody Favorites favorite) {
        return favoritesService.updateFavorite(id, favorite);
    }

    @DeleteMapping("/{id}")
    public void deleteFavorite(@PathVariable Long id) {
        favoritesService.deleteFavorite(id);
    }
}