package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        String genAiUrl = "http://localhost:8000/api/chat";
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(genAiUrl, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            String message = (String) request.getOrDefault("message", "");
            String destination = (String) request.getOrDefault("destination", "your destination");
            String msgLower = message.toLowerCase();
            String reply;

            if (msgLower.contains("pack")) {
                reply = "🎒 **Packing Checklist for " + destination + ":**\n- Breathable cotton clothes & footwear\n- Sunscreen, sunglasses & hat\n- Portable power bank & universal adapter\n- Essential medications & reusable water bottle";
            } else if (msgLower.contains("food") || msgLower.contains("eat") || msgLower.contains("dish") || msgLower.contains("cuisine")) {
                reply = "🍽️ **Must-Try Local Food in " + destination + ":**\n- Signature regional delicacies & street food stalls\n- Authentic local breakfast spots\n- Ask locals for non-touristy dhabas & cafes!";
            } else if (msgLower.contains("transport") || msgLower.contains("cab") || msgLower.contains("bus") || msgLower.contains("travel")) {
                reply = "🚌 **Transport Tips for " + destination + ":**\n- Renting a scooter/bike or taking local cabs works best\n- Book intercity buses/trains at least 1 day prior\n- Keep small cash change for local fares";
            } else if (msgLower.contains("weather") || msgLower.contains("rain") || msgLower.contains("temp")) {
                reply = "☀️ **Weather Advice for " + destination + ":**\n- Morning & late afternoons have pleasant climate\n- Carry a compact umbrella & light jacket for evening breezes";
            } else if (msgLower.contains("budget") || msgLower.contains("money") || msgLower.contains("cheap") || msgLower.contains("save")) {
                reply = "💰 **Budget Saving Tips:**\n- Dine at local food markets instead of resort restaurants\n- Use public transit or shared rides\n- Book attraction tickets online in advance for discounts";
            } else if (msgLower.contains("gem") || msgLower.contains("hidden") || msgLower.contains("spot") || msgLower.contains("place")) {
                reply = "🌟 **Hidden Gems near " + destination + ":**\n- Explore quiet coastal viewpoints and old heritage alleys\n- Visit sunrise spots before 7:00 AM to avoid crowds";
            } else {
                reply = "✈️ **AI Travel Guide:** Regarding '" + message + "' for " + destination + " — I recommend scheduling this during morning hours for peak light and lighter crowds, and checking local timings in advance!";
            }

            return ResponseEntity.ok(Map.of("response", reply));
        }
    }
}
