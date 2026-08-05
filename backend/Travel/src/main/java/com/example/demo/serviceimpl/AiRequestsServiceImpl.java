
package com.example.demo.serviceimpl;

import com.example.demo.models.AiRequests;
import com.example.demo.repository.AiRequestsRepository;
import com.example.demo.service.AiRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AiRequestsServiceImpl implements AiRequestsService {

    @Autowired
    private AiRequestsRepository aiRequestsRepository;

    @Override
    public AiRequests saveAiRequest(AiRequests aiRequest) {
        return aiRequestsRepository.save(aiRequest);
    }

    @Override
    public List<AiRequests> getAllAiRequests() {
        return aiRequestsRepository.findAll();
    }

    @Override
    public Optional<AiRequests> getAiRequestById(Long id) {
        return aiRequestsRepository.findById(id);
    }

    @Override
    public AiRequests updateAiRequest(Long id, AiRequests aiRequest) {
        aiRequest.setRequestId(id);
        return aiRequestsRepository.save(aiRequest);
    }

    @Override
    public void deleteAiRequest(Long id) {
        aiRequestsRepository.deleteById(id);
    }
}