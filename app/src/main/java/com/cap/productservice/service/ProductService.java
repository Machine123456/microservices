package com.cap.productservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cap.productservice.dto.ProductResponse;
import com.cap.productservice.model.Product;
import com.cap.productservice.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;

   public List<ProductResponse> getAllProducts(){
        List<Product> products = productRepository.findAll();
        List<ProductResponse> responses = products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
        return responses;
    }

    private ProductResponse mapToProductResponse(Product product) {

        ProductResponse productResponse = ProductResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .price(product.getPrice())
        .build();
        
        return productResponse;
    }


}