package com.agrilink.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUploadService {
    String uploadProductImage(MultipartFile file);
}
