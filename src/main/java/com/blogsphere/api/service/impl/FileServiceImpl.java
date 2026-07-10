package com.blogsphere.api.service.impl;

import com.blogsphere.api.exception.BadRequestException;
import com.blogsphere.api.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;

/**
 * Implementation of {@link FileService} for local filesystem image storage.
 *
 * <p>Images are stored in the configured upload directory with a UUID-based
 * filename to prevent collisions and avoid exposing original file names.</p>
 *
 * <p>Supported file types: JPG, JPEG, PNG, GIF, WEBP</p>
 */
@Service
@Slf4j
public class FileServiceImpl implements FileService {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    @Override
    public String uploadImage(String uploadDir, MultipartFile file) throws IOException {
        // Validate file is not empty
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload an empty file");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File size exceeds the maximum limit of 5 MB");
        }

        // Validate file extension
        String originalFileName = file.getOriginalFilename();
        String extension        = getFileExtension(originalFileName);
        validateImageExtension(extension);

        // Generate a unique file name
        String uniqueFileName = UUID.randomUUID() + "." + extension;

        // Ensure the upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
        }

        // Write the file to disk
        Path targetPath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("File uploaded: {}", targetPath.toAbsolutePath());

        return uniqueFileName;
    }

    @Override
    public InputStream getResource(String uploadDir, String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + fileName);
        }

        return Files.newInputStream(filePath);
    }

    // ======================== PRIVATE HELPERS ========================

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            throw new BadRequestException("File must have a valid extension");
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    private void validateImageExtension(String extension) {
        java.util.Set<String> allowed = java.util.Set.of("jpg", "jpeg", "png", "gif", "webp");
        if (!allowed.contains(extension)) {
            throw new BadRequestException(
                    "File type '" + extension + "' is not allowed. " +
                    "Allowed types: jpg, jpeg, png, gif, webp");
        }
    }
}
