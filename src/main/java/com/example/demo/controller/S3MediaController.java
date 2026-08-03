package com.example.demo.controller;

import com.example.demo.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * S3MediaController
 *
 * Bucket folder layout:
 *   travel-planner-bucket/
 *   ├── users/profile-images/
 *   ├── hotels/images/
 *   ├── destinations/images/
 *   ├── attractions/images/
 *   ├── restaurants/images/
 *   └── itineraries/pdfs/
 *
 * Frontend calls:
 *   GET  /api/media/images?folder=hotels/images        → list hotel images
 *   GET  /api/media/images?folder=destinations/images  → list destination images
 *   GET  /api/media/images?category=hotel              → same, using friendly alias
 *   POST /api/media/upload?folder=hotels/images        → upload new image
 */
@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class S3MediaController {

    // Friendly category → S3 folder prefix map (matches your bucket structure)
    private static final Map<String, String> CATEGORY_FOLDER = Map.of(
        "profile",     "users/profile-images",
        "hotel",       "hotels/images",
        "destination", "destinations/images",
        "attraction",  "attractions/images",
        "restaurant",  "restaurants/images",
        "itinerary",   "itineraries/pdfs"
    );

    @Autowired
    private S3Service s3Service;

    /**
     * List images from a bucket folder.
     * Accepts either ?folder=hotels/images  or  ?category=hotel
     */
    @GetMapping("/images")
    public ResponseEntity<?> listImages(
            @RequestParam(required = false) String folder,
            @RequestParam(required = false) String category) {
        try {
            String resolvedFolder = resolveFolder(folder, category);
            if (resolvedFolder == null) {
                return ResponseEntity.badRequest()
                        .body("Provide ?folder=<path> or ?category=<hotel|destination|attraction|restaurant|profile|itinerary>");
            }
            List<String> urls = s3Service.listImages(resolvedFolder);
            return ResponseEntity.ok(Map.of(
                "folder", resolvedFolder,
                "count",  urls.size(),
                "images", urls
            ));
        } catch (Exception e) {
            // Return empty list so frontend degrades gracefully
            return ResponseEntity.ok(Map.of(
                "folder", folder != null ? folder : (category != null ? category : ""),
                "count",  0,
                "images", List.of(),
                "error",  e.getMessage()
            ));
        }
    }

    /**
     * Upload a file to a specific bucket folder.
     * POST /api/media/upload?folder=hotels/images  (or ?category=hotel)
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String folder,
            @RequestParam(required = false) String category) {
        try {
            String resolvedFolder = resolveFolder(folder, category);
            if (resolvedFolder == null) {
                return ResponseEntity.badRequest()
                        .body("Provide ?folder=<path> or ?category=<hotel|destination|attraction|restaurant|profile|itinerary>");
            }
            String url = s3Service.UploadFile(file, resolvedFolder);
            return ResponseEntity.ok(Map.of(
                "url",    url,
                "folder", resolvedFolder
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    /**
     * List all available categories and their S3 folder paths.
     */
    @GetMapping("/categories")
    public ResponseEntity<?> listCategories() {
        return ResponseEntity.ok(CATEGORY_FOLDER);
    }

    // ── helpers ──────────────────────────────────────────────────
    private String resolveFolder(String folder, String category) {
        if (folder != null && !folder.isBlank()) return folder.trim();
        if (category != null && !category.isBlank()) return CATEGORY_FOLDER.get(category.toLowerCase().trim());
        return null;
    }
}
