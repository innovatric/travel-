
package com.example.demo.service;

import com.example.demo.models.Hotels;

import java.util.List;
import java.util.Optional;

public interface HotelsService {

    Hotels saveHotel(Hotels hotel);

    List<Hotels> getAllHotels();

    Optional<Hotels> getHotelById(Long id);

    Hotels updateHotel(Long id, Hotels hotel);

    void deleteHotel(Long id);
}