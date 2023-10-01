package com.cap.authenticationservice.security;

import java.util.List;
import java.util.stream.Collectors;

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

import com.cap.authenticationservice.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;


@AllArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	private static String[] PUBLIC_POST_STRING_PATTERS = {"/auth/**"};	
	private static String[] PUBLIC_GET_STRING_PATTERS = {"/login","/static/**","/auth/**"};

	public static List<RequestMatcher> PUBLIC_POST_PATTERNS = List.of(PUBLIC_POST_STRING_PATTERS).stream().map(pattern ->(RequestMatcher)new AntPathRequestMatcher(pattern)).collect(Collectors.toList());	
	public static List<RequestMatcher> PUBLIC_GET_PATTERNS = List.of(PUBLIC_GET_STRING_PATTERS).stream().map(pattern ->(RequestMatcher)new AntPathRequestMatcher(pattern)).collect(Collectors.toList());

	private final SecurityFiler securityFiler; 

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
	}

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }

	@Bean
	public UserDetailsService userDetailsService(UserRepository userRepository) {
			return username -> userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));			
	}

	@Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            System.out.println("Unauthorized request intercepted: " + request.getRequestURI());
            System.out.println("Exception: " + authException.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        };
    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
		http
            .csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(cors -> cors.disable())
			.authenticationManager(authenticationManager)
			.addFilterBefore(securityFiler, UsernamePasswordAuthenticationFilter.class)
			.authorizeHttpRequests(requests -> requests
				.requestMatchers(HttpMethod.OPTIONS).permitAll()
				.requestMatchers(HttpMethod.GET, PUBLIC_GET_STRING_PATTERS).permitAll()
				.requestMatchers(HttpMethod.POST, PUBLIC_POST_STRING_PATTERS).permitAll()
				.requestMatchers(HttpMethod.GET,"/admin").hasRole("ADMIN")
				.anyRequest().authenticated()
			)
			.exceptionHandling(exception -> exception.defaultAuthenticationEntryPointFor(authenticationEntryPoint(), new AntPathRequestMatcher("/api/**")) )
			.formLogin(form -> form
				.loginPage("/login")
				.permitAll()
			);

		return http.build();
	}
}