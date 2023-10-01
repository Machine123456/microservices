package com.cap.productservice.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cap.productservice.dto.UserResponse;
import com.cap.productservice.service.AuthenticationService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class SecurityFiler extends OncePerRequestFilter {

    private final AuthenticationService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = authService.recoverToken(request);

        if(doAuthentication(request, token))
            response.addCookie(authService.generateTokenCookie(token));

        filterChain.doFilter(request, response); 
    }

    private boolean doAuthentication(HttpServletRequest request, String token) {
        if(!isPublicRequest(request)){
            System.out.println("Private request intercepted: "  + request.getMethod() + " " +  request.getRequestURI());
            return fetchAndAuthWithToken(token);
            }
        else {
            System.out.println("Public request intercepted: "  + request.getMethod() + " " +  request.getRequestURI());
            return token != null;    
        }

    }

    private Boolean fetchAndAuthWithToken(String token){
        if(token == null) {
            System.out.println("Authentication token not found");
            return false;
        }

        ResponseEntity<UserResponse> responseEntity = authService.getUserFromToken(token);

        // Check the response status
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            System.out.println("Error fetching user from token: " + token);
            return false;
        }
        UserResponse authResult = responseEntity.getBody();

        if(authResult == null){
            System.out.println("Authentication token not valid: " + token);
            return false;
        }
        Collection<GrantedAuthority> authorities = Arrays.stream(authResult.getAuthorities()).map(role ->  new SimpleGrantedAuthority(role)).collect(Collectors.toList());
        var authenticationToken = new UsernamePasswordAuthenticationToken(authResult.getUsername(), null, authorities);
            
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        return true;
    }



    private boolean isPublicRequest(HttpServletRequest request) {
        
        switch (request.getMethod()) {
            case "POST":
                return WebSecurityConfig.PUBLIC_POST_PATTERNS.stream().anyMatch(pattern -> pattern.matches(request));
            case "GET":
                return WebSecurityConfig.PUBLIC_GET_PATTERNS.stream().anyMatch(pattern -> pattern.matches(request));
            case "OPTIONS":
                return true; // CORS preflight request
            default:
                return false;
        }
    }


   
}