package com.blogsphere.api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * Service interface for file upload operations.
 */
public interface FileService {

    /**
     * Save an uploaded file to the specified directory.
     *
     * @param uploadDir the target directory path
     * @param file      the multipart file to save
     * @return the generated file name used for storage
     * @throws IOException if file I/O fails
     */
    String uploadImage(String uploadDir, MultipartFile file) throws IOException;

    /**
     * Retrieve an uploaded image as an InputStream.
     *
     * @param uploadDir the directory containing the file
     * @param fileName  the file name
     * @return InputStream for the requested file
     * @throws IOException if the file cannot be read
     */
    InputStream getResource(String uploadDir, String fileName) throws IOException;
}
