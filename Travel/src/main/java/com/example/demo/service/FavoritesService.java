
package com.example.demo.service;

import com.example.demo.models.Favorites;

import java.util.List;
import java.util.Optional;

public interface FavoritesService {

    Favorites saveFavorite(Favorites favorite);

    List<Favorites> getAllFavorites();

    Optional<Favorites> getFavoriteById(Long id);

    Favorites updateFavorite(Long id, Favorites favorite);

    void deleteFavorite(Long id);
}