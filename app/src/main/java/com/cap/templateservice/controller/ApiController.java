package com.cap.templateservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cap.templateservice.data.dto.ProductRequest;
import com.cap.templateservice.data.dto.ProductResponse;
import com.cap.templateservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final ProductService productService;

    @PostMapping("/products")
    @ResponseBody
    public ResponseEntity<ProductResponse> createProduct( @RequestBody ProductRequest productRequest) {

        try {
            var product = productService.createProduct(productRequest);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @GetMapping("/products")
    @ResponseBody
    public ResponseEntity<List<ProductResponse>> getProducts() {

        try {
            var products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @GetMapping("/products/{id}")
    @ResponseBody
    public ResponseEntity<ProductResponse> getProduct(@PathVariable("id") long id) {

        try {
            var product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") long id, @RequestBody ProductRequest productRequest) {
        try {
            productService.updateProduct(id, productRequest);
            return ResponseEntity.ok("Product Updated");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update product " + id + " : " + e.getMessage());
        }

    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product Deleted");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete product " + id + " : " + e.getMessage());
        }

    }

}
