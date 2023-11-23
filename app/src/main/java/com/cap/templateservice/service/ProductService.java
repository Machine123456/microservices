package com.cap.templateservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cap.templateservice.data.dto.ProductRequest;
import com.cap.templateservice.data.dto.ProductResponse;
import com.cap.templateservice.data.model.Product;
import com.cap.templateservice.data.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductResponse> responses = products.stream().map(this::mapToDto).collect(Collectors.toList());
        return responses;
    }

    public ProductResponse getProductById(long id) throws IllegalArgumentException{
        var product = findProductById(id);
        return mapToDto(product);
    }

    public ProductResponse updateProduct(long id, ProductRequest productRequest) throws IllegalArgumentException{
        var product = findProductById(id);

        product.setName(productRequest.getName());
        product.setPrice(productRequest.getPrice());

        return mapToDto(product);
    }

    public void deleteProduct(long id) throws IllegalArgumentException{
        productRepository.deleteById(id);
    }

    public ProductResponse createProduct(ProductRequest productRequest) throws IllegalArgumentException{
        var product = mapToObj(productRequest);
        productRepository.save(product);

        return mapToDto(product);
    }

    private Product findProductById(long id) throws IllegalArgumentException{
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No product found with id " + id));
    }

    private ProductResponse mapToDto(Product product) {
        return ProductResponse.builder()
                .name(product.getName())
                .price(product.getPrice())
                .build();
    }

    private Product mapToObj(ProductRequest productRequest) {
        return Product.builder()
                .name(productRequest.getName())
                .price(productRequest.getPrice())
                .build();
    }

}