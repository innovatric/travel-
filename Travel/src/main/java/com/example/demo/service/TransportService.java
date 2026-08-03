
package com.example.demo.service;

import com.example.demo.models.Transport;

import java.util.List;
import java.util.Optional;

public interface TransportService {

    Transport saveTransport(Transport transport);

    List<Transport> getAllTransport();

    Optional<Transport> getTransportById(Long id);

    Transport updateTransport(Long id, Transport transport);

    void deleteTransport(Long id);
}