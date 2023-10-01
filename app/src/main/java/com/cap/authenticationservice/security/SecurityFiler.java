package com.cap.authenticationservice.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cap.authenticationservice.repository.UserRepository;
import com.cap.authenticationservice.service.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class SecurityFiler extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = tokenService.recoverToken(request);

        if(doAuthentication(request, token))
            response.addCookie(tokenService.generateTokenCookie(token));

        filterChain.doFilter(request, response); 
    }

    private boolean doAuthentication(HttpServletRequest request, String token) {
        if(!isPublicRequest(request)){
            System.out.println("Private request intercepted: "  + request.getMethod() + " " + request.getRequestURI());
            return fetchAndAuthWithToken(token);
        } 
        else {
            System.out.println("Public request intercepted: "  + request.getMethod() + " " +  request.getRequestURI());
            return token != null;    
        }

    }

    private Boolean fetchAndAuthWithToken(String token){
        if(token == null) {
            System.out.println("Authentication token not valid: " + token);
            return false;
        }

        var username = tokenService.validateToken(token);
        var opt = userRepository.findByUsername(username);

        if(opt.isPresent()){
            UserDetails user = opt.get();
            var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

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