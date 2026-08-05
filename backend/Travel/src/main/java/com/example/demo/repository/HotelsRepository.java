package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Hotels;

public interface HotelsRepository extends JpaRepository<Hotels, Long> {

}