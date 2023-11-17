package com.cap.authenticationservice.security;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cap.authenticationservice.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	private static String[] PUBLIC_POST_STRING_PATTERNS = { "/auth/request/**" };
	private static String[] PUBLIC_GET_STRING_PATTERNS = { "/error", "/auth/request/**" };

	public static List<RequestMatcher> PUBLIC_POST_PATTERNS = mapToMatchers(PUBLIC_POST_STRING_PATTERNS);
	public static List<RequestMatcher> PUBLIC_GET_PATTERNS = mapToMatchers(PUBLIC_GET_STRING_PATTERNS);	

	private static List<RequestMatcher> mapToMatchers(String[] string_patterns) {
		return List.of(string_patterns)
			.stream()
			.map(pattern -> (RequestMatcher) new AntPathRequestMatcher(pattern))
			.collect(Collectors.toList());
	}

	@Value("${api.endpoint.server.front-end}")
    private String fe_server;

	private final SecurityFiler securityFiler;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService);
		authenticationProvider.setPasswordEncoder(passwordEncoder);

		return new ProviderManager(authenticationProvider);
	}

	@Bean
	public UserDetailsService userDetailsService(UserRepository userRepository) {
		return username -> userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
	}

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> {
			System.out.println("Unauthorized request intercepted: " + request.getRequestURI());
			System.out.println("Exception: " + authException.getMessage());
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: " + authException.getMessage());
		};
	}

	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(fe_server));

        // You can customize other CORS properties as needed
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager,CorsConfigurationSource corsConfigurationSource)
			throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.cors(cors -> cors.disable())
				.authenticationManager(authenticationManager)
				.addFilterBefore(securityFiler, UsernamePasswordAuthenticationFilter.class)
				.authorizeHttpRequests(requests -> requests
						
						.requestMatchers(HttpMethod.OPTIONS).permitAll() // TODO try without this

						.requestMatchers(HttpMethod.GET, PUBLIC_GET_STRING_PATTERNS).permitAll()
						.requestMatchers(HttpMethod.POST, PUBLIC_POST_STRING_PATTERNS).permitAll()

						.requestMatchers(HttpMethod.GET, "/auth/api/users").hasAuthority("READ_USER")
						.requestMatchers(HttpMethod.PUT, "/auth/api/users/{id}").hasAuthority("UPDATE_USER")
						.requestMatchers(HttpMethod.DELETE, "/auth/api/users/{id}").hasAuthority("DELETE_USER")

						.requestMatchers(HttpMethod.POST, "/auth/api/roles").hasAuthority("CREATE_ROLE")
						.requestMatchers(HttpMethod.GET, "/auth/api/roles").hasAuthority("READ_ROLE")
						.requestMatchers(HttpMethod.PUT, "/auth/api/roles/{id}").hasAuthority("UPDATE_ROLE")
						.requestMatchers(HttpMethod.DELETE, "/auth/api/roles/{id}").hasAuthority("DELETE_ROLE")
						
						.requestMatchers(HttpMethod.POST, "/auth/api/authorities").hasAuthority("CREATE_AUTHORITY")
						.requestMatchers(HttpMethod.GET, "/auth/api/authorities").hasAuthority("READ_AUTHORITY")
						.requestMatchers(HttpMethod.PUT, "/auth/api/authorities/{id}").hasAuthority("UPDATE_AUTHORITY")
						.requestMatchers(HttpMethod.DELETE, "/auth/api/authorities/{id}").hasAuthority("DELETE_AUTHORITY")
						
						//.requestMatchers(HttpMethod.GET, "/admin").hasRole("ADMIN")
						.anyRequest().authenticated())
						
				.exceptionHandling(exception -> exception.defaultAuthenticationEntryPointFor(authenticationEntryPoint(),
						new AntPathRequestMatcher("/auth/**")))
				.cors(cors -> cors.configurationSource(corsConfigurationSource));
				/*
					.formLogin(form -> form
						.loginPage("/home")
						.permitAll());
				*/
		return http.build();
	}
}