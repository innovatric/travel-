
package com.example.demo.serviceimpl;

import com.example.demo.models.Transport;
import com.example.demo.repository.TransportRepository;
import com.example.demo.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransportServiceImpl implements TransportService {

    @Autowired
    private TransportRepository transportRepository;

    @Override
    public Transport saveTransport(Transport transport) {
        return transportRepository.save(transport);
    }

    @Override
    public List<Transport> getAllTransport() {
        return transportRepository.findAll();
    }

    @Override
    public Optional<Transport> getTransportById(Long id) {
        return transportRepository.findById(id);
    }

    @Override
    public Transport updateTransport(Long id, Transport transport) {
        transport.setTransportId(id);
        return transportRepository.save(transport);
    }

    @Override
    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }
}