package com.cap.authenticationservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cap.authenticationservice.model.Role;

public interface RoleRepository extends JpaRepository<Role, UUID>{
     Optional<Role> findByAuthority(String authority);
}
