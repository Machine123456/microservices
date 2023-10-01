package com.cap.authenticationservice;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.cap.authenticationservice.model.Role;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.RoleRepository;
import com.cap.authenticationservice.repository.UserRepository;

@SpringBootApplication
public class AuthenticationServiceApplication {

	@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
	
	public static void main(String[] args) {
		SpringApplication.run(AuthenticationServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder){
		return  args -> {

			if(roleRepository.findByAuthority("ROLE_ADMIN").isPresent()) return;

			Role adminRole = roleRepository.save(new Role("ROLE_ADMIN"));
			//Role userRole = 
			roleRepository.save(new Role("ROLE_USER"));

			Set<Role> roles = new HashSet<>();
			roles.add(adminRole);

			User admin = User.builder()
			.username("admin")
			.password(passwordEncoder.encode("admin"))
			.email("admin@gmail.com")
			.authorities(roles)
			.build();

			userRepository.save(admin);

		};
	}
}
