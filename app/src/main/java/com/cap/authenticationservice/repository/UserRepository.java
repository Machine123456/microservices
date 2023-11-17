package com.cap.authenticationservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cap.authenticationservice.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findFirstByEmailOrUsername(String email, String username);
    Optional<User> findByUsername(String username);
}