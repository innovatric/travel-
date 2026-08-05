package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * Service that delegates to the external GenAI (FastAPI) to generate images
 * and stores the results in S3.
 */
public interface GenAIImageService {

    /**
     * Generate a single image from the given prompt, store it in the given S3 folder
     * and return the public URL.
     */
    String generateAndStore(String prompt, String folder);

    /**
     * Generate a batch of images from a list of prompts, store each in the same folder
     * and return the list of public URLs.
     */
    List<String> generateBatchAndStore(List<String> prompts, String folder);
}
