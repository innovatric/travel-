
package com.example.demo.controller;

import com.example.demo.models.AiRequests;
import com.example.demo.service.AiRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ai-requests")
@CrossOrigin(origins = "*")
public class AiRequestsController {

    @Autowired
    private AiRequestsService aiRequestsService;

    @PostMapping
    public AiRequests saveAiRequest(@RequestBody AiRequests aiRequest) {
        return aiRequestsService.saveAiRequest(aiRequest);
    }

    @GetMapping
    public List<AiRequests> getAllAiRequests() {
        return aiRequestsService.getAllAiRequests();
    }

    @GetMapping("/{id}")
    public Optional<AiRequests> getAiRequestById(@PathVariable Long id) {
        return aiRequestsService.getAiRequestById(id);
    }

    @PutMapping("/{id}")
    public AiRequests updateAiRequest(@PathVariable Long id,
                                      @RequestBody AiRequests aiRequest) {
        return aiRequestsService.updateAiRequest(id, aiRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteAiRequest(@PathVariable Long id) {
        aiRequestsService.deleteAiRequest(id);
    }
}