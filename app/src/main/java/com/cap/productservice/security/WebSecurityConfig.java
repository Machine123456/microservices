package com.cap.productservice.security;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.cap.productservice.service.AuthenticationService;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

	private static String[] PUBLIC_POST_STRING_PATTERS = {};	
	private static String[] PUBLIC_GET_STRING_PATTERS = {"/static/**","/auth/**"};

	public static List<RequestMatcher> PUBLIC_POST_PATTERNS = List.of(PUBLIC_POST_STRING_PATTERS).stream().map(pattern ->(RequestMatcher)new AntPathRequestMatcher(pattern)).collect(Collectors.toList());	
	public static List<RequestMatcher> PUBLIC_GET_PATTERNS = List.of(PUBLIC_GET_STRING_PATTERS).stream().map(pattern ->(RequestMatcher)new AntPathRequestMatcher(pattern)).collect(Collectors.toList());

	private final AuthenticationService authService;

	@Bean 
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            System.out.println("Unauthorized request intercepted: " + request.getRequestURI());
            System.out.println("Exception: " + authException.getMessage());

			var map = authService.getAuthMapping();
			if(map != null)
				response.sendRedirect(map.getBridgeAdress());
        };
    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, SecurityFiler securityFiler) throws Exception {
		http
            .csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.addFilterBefore(securityFiler,UsernamePasswordAuthenticationFilter.class)
			.authorizeHttpRequests(requests -> requests
				.requestMatchers(HttpMethod.OPTIONS).permitAll()
				.requestMatchers(HttpMethod.GET, PUBLIC_GET_STRING_PATTERS).permitAll()
				.requestMatchers(HttpMethod.POST, PUBLIC_POST_STRING_PATTERS).permitAll()
				.requestMatchers(HttpMethod.GET, "/admin").hasRole("ADMIN")
				.anyRequest().authenticated())
			.exceptionHandling(exception -> exception
				.defaultAuthenticationEntryPointFor(authenticationEntryPoint(),
				 new AntPathRequestMatcher("**")) );
            

		return http.build();
	}



}