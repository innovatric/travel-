
package com.example.demo.controller;

import com.example.demo.models.Favorites;
import com.example.demo.models.Users;
import com.example.demo.repository.UsersRepository;
import com.example.demo.service.FavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/favorites")
@CrossOrigin(origins = "*")
public class FavoritesController {

    @Autowired
    private FavoritesService favoritesService;

    @Autowired
    private UsersRepository usersRepository;

    /**
     * Resolves a user from the Authorization header token.
     * Falls back to a guest dev user so favorites are always persisted.
     */
    private Users resolveUser(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer dummy-jwt-token-for-")) {
            try {
                Long userId = Long.parseLong(authHeader.replace("Bearer dummy-jwt-token-for-", "").trim());
                Optional<Users> userOpt = usersRepository.findById(userId);
                if (userOpt.isPresent()) {
                    return userOpt.get();
                }
            } catch (Exception ignored) {}
        }

        // Fallback: find or create a guest/dev user
        String guestEmail = "guest@tripflow.dev";
        Optional<Users> guestOpt = usersRepository.findByEmail(guestEmail);
        if (guestOpt.isPresent()) {
            return guestOpt.get();
        }

        Users guestUser = new Users();
        guestUser.setName("Guest User");
        guestUser.setEmail(guestEmail);
        guestUser.setPassword("guest_placeholder");
        return usersRepository.save(guestUser);
    }

    @PostMapping
    public Favorites saveFavorite(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Users user = resolveUser(authHeader);

        Favorites favorite = new Favorites();
        favorite.setUser(user);

        // itemId can be a string like "fav-12345" — parse to long or use hash
        Object rawItemId = body.get("itemId");
        Long itemId = 1L;
        if (rawItemId != null) {
            try {
                itemId = Long.parseLong(rawItemId.toString().replaceAll("[^0-9]", ""));
                if (itemId == 0L) itemId = (long) rawItemId.toString().hashCode();
            } catch (Exception e) {
                itemId = (long) rawItemId.toString().hashCode();
            }
        }
        favorite.setItemId(itemId);

        String itemType = body.getOrDefault("itemType", "activity").toString();
        favorite.setItemType(itemType);

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