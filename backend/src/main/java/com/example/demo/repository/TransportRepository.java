package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Transport;

public interface TransportRepository extends JpaRepository<Transport, Long> {

}