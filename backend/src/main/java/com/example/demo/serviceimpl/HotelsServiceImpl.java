
package com.example.demo.serviceimpl;

import com.example.demo.models.Hotels;
import com.example.demo.repository.HotelsRepository;
import com.example.demo.service.HotelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelsServiceImpl implements HotelsService {

    @Autowired
    private HotelsRepository hotelsRepository;

    @Override
    public Hotels saveHotel(Hotels hotel) {
        return hotelsRepository.save(hotel);
    }

    @Override
    public List<Hotels> getAllHotels() {
        return hotelsRepository.findAll();
    }

    @Override
    public Optional<Hotels> getHotelById(Long id) {
        return hotelsRepository.findById(id);
    }

    @Override
    public Hotels updateHotel(Long id, Hotels hotel) {
        hotel.setHotelId(id);
        return hotelsRepository.save(hotel);
    }

    @Override
    public void deleteHotel(Long id) {
        hotelsRepository.deleteById(id);
    }
}