
package com.example.demo.serviceimpl;

import com.example.demo.models.Favorites;
import com.example.demo.repository.FavoritesRepository;
import com.example.demo.service.FavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoritesServiceImpl implements FavoritesService {

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Override
    public Favorites saveFavorite(Favorites favorite) {
        return favoritesRepository.save(favorite);
    }

    @Override
    public List<Favorites> getAllFavorites() {
        return favoritesRepository.findAll();
    }

    @Override
    public Optional<Favorites> getFavoriteById(Long id) {
        return favoritesRepository.findById(id);
    }

    @Override
    public Favorites updateFavorite(Long id, Favorites favorite) {
        favorite.setFavoriteId(id);
        return favoritesRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(Long id) {
        favoritesRepository.deleteById(id);
    }
}