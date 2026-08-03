
package com.example.demo.controller;

import com.example.demo.models.Transport;
import com.example.demo.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transport")
@CrossOrigin(origins = "*")
public class TransportController {

    @Autowired
    private TransportService transportService;

    @PostMapping
    public Transport saveTransport(@RequestBody Transport transport) {
        return transportService.saveTransport(transport);
    }

    @GetMapping
    public List<Transport> getAllTransport() {
        return transportService.getAllTransport();
    }

    @GetMapping("/{id}")
    public Optional<Transport> getTransportById(@PathVariable Long id) {
        return transportService.getTransportById(id);
    }

    @PutMapping("/{id}")
    public Transport updateTransport(@PathVariable Long id,
                                     @RequestBody Transport transport) {
        return transportService.updateTransport(id, transport);
    }

    @DeleteMapping("/{id}")
    public void deleteTransport(@PathVariable Long id) {
        transportService.deleteTransport(id);
    }
}