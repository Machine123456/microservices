package com.cap.templateservice.data.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cap.templateservice.data.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
     Optional<Product> findByName(String name);
}

