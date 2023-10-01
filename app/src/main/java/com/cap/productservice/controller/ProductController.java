package com.cap.productservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cap.productservice.dto.ProductResponse;
import com.cap.productservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {
    
private final ProductService productService;


@GetMapping("products")
@ResponseBody
public ResponseEntity<List<ProductResponse>> getProducts() {
   
   try {
        var products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    }
}

}
