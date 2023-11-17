package com.cap.authenticationservice.data;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cap.authenticationservice.model.Authority;
import com.cap.authenticationservice.model.Role;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.AuthorityRepository;
import com.cap.authenticationservice.repository.RoleRepository;
import com.cap.authenticationservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApplicationStartupRunner implements CommandLineRunner {

	/*
	 * @Bean
	 * public RestTemplate restTemplate() {
	 * return new RestTemplate();
	 * }
	 */

	private final RoleRepository roleRepository;
	private final AuthorityRepository authorityRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		if (userRepository.count() > 0)
			return;

		var userAuthorities = createCrudAuthorities("user");
		var roleAuthorities = createCrudAuthorities("role");
		var authorityAuthorities = createCrudAuthorities("authority");

		var adminRole = createRole("admin", userAuthorities, roleAuthorities, authorityAuthorities);
		var userRole = createRole("user", userAuthorities[1],roleAuthorities[1],authorityAuthorities[1]);

		var adminUser = createUser("admin", adminRole);

	}

	Authority[] createCrudAuthorities(String targetName) {

		String targetStr = targetName == "" ? "" : "_" + targetName.toUpperCase();
		// CREATE, READ, UPDATE, DELETE
		var authorities = new Authority[] {
				new Authority("CREATE" + targetStr),
				new Authority("READ" + targetStr),
				new Authority("UPDATE" + targetStr),
				new Authority("DELETE" + targetStr)
		};

		for (Authority userAuthority : authorities)
			authorityRepository.save(userAuthority);

		return authorities;
	}

	Role createRole(String roleName, Authority... roleAuthorities) {
		Role role = roleRepository.save(
				Role.builder()
						.name("ROLE_" + roleName.toUpperCase())
						.authorities(new HashSet<>(Arrays.asList(roleAuthorities)))
						.build());
		return role;
	}

	Role createRole(String roleName, Authority[]... roleAuthoritiesArrays) {
		Set<Authority> authorities = new HashSet<>();

		for (Authority[] roleAuthorities : roleAuthoritiesArrays) {
			authorities.addAll(Arrays.asList(roleAuthorities));
		}

		Role role = roleRepository.save(
				Role.builder()
						.name("ROLE_" + roleName.toUpperCase())
						.authorities(authorities)
						.build());
		return role;
	}

	User createUser(String userName, Role... userRoles) {
		return createUser(userName, userName, userName + "@gmail.com", userRoles);
	}

	User createUser(String userName, String password, String email, Role... userRoles) {
		User user = userRepository.save(User.builder()
				.username(userName)
				.password(passwordEncoder.encode(password))
				.email(email)
				.roles(new HashSet<>(Arrays.asList(userRoles)))
				.build());

		return user;
	}

}
