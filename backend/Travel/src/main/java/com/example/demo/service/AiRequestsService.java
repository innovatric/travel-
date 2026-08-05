
package com.example.demo.service;

import com.example.demo.models.AiRequests;

import java.util.List;
import java.util.Optional;

public interface AiRequestsService {

    AiRequests saveAiRequest(AiRequests aiRequest);

    List<AiRequests> getAllAiRequests();

    Optional<AiRequests> getAiRequestById(Long id);

    AiRequests updateAiRequest(Long id, AiRequests aiRequest);

    void deleteAiRequest(Long id);
}
