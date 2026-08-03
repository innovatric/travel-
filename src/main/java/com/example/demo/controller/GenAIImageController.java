package com.example.demo.controller;

import com.example.demo.service.GenAIImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoints used by the frontend to request AI‑generated images.
 *
 *   POST /api/genai/route-images   – body {"start":"…","destination":"…","tripId":"…"}
 *   POST /api/genai/poi-images    – body {"category":"hotel|restaurant|attraction","location":"…","count":3}
 */
@RestController
@RequestMapping("/api/genai")
@CrossOrigin(origins = "*")
public class GenAIImageController {

    @Autowired
    private GenAIImageService genAIImageService;

    /**
     * Generate a handful of images that illustrate the travel route.
     * Images are stored under "routes/{tripId}/" in the S3 bucket and the public URLs are returned.
     */
    @PostMapping("/route-images")
    public ResponseEntity<Map<String, Object>> generateRouteImages(@RequestBody Map<String, String> payload) {
        String start = payload.getOrDefault("start", "");
        String destination = payload.getOrDefault("destination", "");
        String tripId = payload.getOrDefault("tripId", "default");
        // Build three simple prompts for a carousel view
        String basePrompt = String.format(
                "Show a scenic view of a road from %s to %s in a vibrant travel style.",
                start, destination);
        List<String> prompts = List.of(basePrompt, basePrompt, basePrompt);
        List<String> urls = genAIImageService.generateBatchAndStore(prompts, "routes/" + tripId);
        return ResponseEntity.ok(Map.of("images", urls));
    }

    /**
     * Generate AI images for a point‑of‑interest category (hotel, restaurant, attraction, etc.).
     * Images are stored under "ai/{category}/{location}/" and public URLs are returned.
     */
    @PostMapping("/poi-images")
    public ResponseEntity<Map<String, Object>> generatePoiImages(@RequestBody Map<String, String> payload) {
        String category = payload.getOrDefault("category", "attraction");
        String location = payload.getOrDefault("location", "");
        int count = Integer.parseInt(payload.getOrDefault("count", "3"));
        // Very simple prompt template – can be externalised later
        String promptTemplate = "Create a high‑resolution photo of a %s in %s.";
        String prompt = String.format(promptTemplate, category, location);
        List<String> prompts = java.util.Collections.nCopies(count, prompt);
        String folder = "ai/" + category + "/" + location.replaceAll("[^a-zA-Z0-9_-]", "");
        List<String> urls = genAIImageService.generateBatchAndStore(prompts, folder);
        return ResponseEntity.ok(Map.of("images", urls));
    }
}
