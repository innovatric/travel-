package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.TripPlanRequest;
import com.example.demo.service.AIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    // General AI Chat
    @PostMapping("/chat")
    public String chat(@RequestBody String message) {
        return aiService.chat(message);
    }

    // AI Travel Itinerary Planner
    @PostMapping("/plan-trip")
    public String planTrip(@RequestBody TripPlanRequest request) {
        return aiService.planTrip(request);
    }
}