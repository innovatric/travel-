package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    String uploadFile(MultipartFile file);

    void deleteFile(String key);

	String UploadFile(MultipartFile file, String folder);

}