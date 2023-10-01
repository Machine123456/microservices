package com.cap.productservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cap.productservice.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
     Optional<Product> findByName(String name);
}

