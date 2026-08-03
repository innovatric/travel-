
package com.example.demo.controller;

import com.example.demo.models.Hotels;
import com.example.demo.service.HotelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/hotels")
@CrossOrigin(origins = "*")
public class HotelsController {

    @Autowired
    private HotelsService hotelsService;

    @PostMapping
    public Hotels saveHotel(@RequestBody Hotels hotel) {
        return hotelsService.saveHotel(hotel);
    }

    @GetMapping
    public List<Hotels> getAllHotels() {
        return hotelsService.getAllHotels();
    }

    @GetMapping("/{id}")
    public Optional<Hotels> getHotelById(@PathVariable Long id) {
        return hotelsService.getHotelById(id);
    }

    @PutMapping("/{id}")
    public Hotels updateHotel(@PathVariable Long id,
                              @RequestBody Hotels hotel) {
        return hotelsService.updateHotel(id, hotel);
    }

    @DeleteMapping("/{id}")
    public void deleteHotel(@PathVariable Long id) {
        hotelsService.deleteHotel(id);
    }
}