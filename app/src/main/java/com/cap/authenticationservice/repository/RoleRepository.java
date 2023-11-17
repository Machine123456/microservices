package com.cap.authenticationservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cap.authenticationservice.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
     Optional<Role> findByName(String name);    
}
