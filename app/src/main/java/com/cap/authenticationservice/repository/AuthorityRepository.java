package com.cap.authenticationservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cap.authenticationservice.model.Authority;

public interface AuthorityRepository  extends JpaRepository<Authority, Long>{

    Optional<Authority> findByAuthority(String authorityString);
}
