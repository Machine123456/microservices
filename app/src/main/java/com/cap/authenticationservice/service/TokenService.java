package com.cap.authenticationservice.service;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.InvalidClaimException;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.cap.authenticationservice.data.Result;
import com.cap.authenticationservice.model.User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private Set<String> invalidTokens = new HashSet<>(); // Store invalid tokens here

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("authentication-service")
                    //.withSubject(user.getUsername())
                    .withSubject(String.valueOf(user.getId()))
                    .withExpiresAt(Instant.now().plusSeconds(1000))
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error while generating token", e);
        }
    }

    public Result<Long> validateToken(String token) {

        String errorMsg = "";

        if (invalidTokens.contains(token)) {
            errorMsg = "Invalid Token, the user of the token was logged off";
            System.out.println(errorMsg);
            return Result.ofError(errorMsg);
        }

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var jwt = JWT.require(algorithm).withIssuer("authentication-service").build();
            var verify = jwt.verify(token);
            //var username = verify.getSubject();
            long id = Long.parseLong(verify.getSubject());
            return Result.of(id);
        } catch (JWTVerificationException e) {
            // Log the specific exception for troubleshooting
            if (e instanceof TokenExpiredException) {
                 errorMsg = "Token has expired.";
            } else if (e instanceof InvalidClaimException) {
                 errorMsg = "Invalid claim in the token.";
            } else {
                errorMsg = "Token verification failed: " + e.getMessage();
            }

            System.out.println(errorMsg);
            return Result.ofError(errorMsg);
        }
    }

    public void invalidateToken(String token) {
        invalidTokens.add(token);
    }
    public String recoverToken(HttpServletRequest request) {

        var tokenParam = request.getParameter("token");
        if (tokenParam != null)
            try {
                return URLDecoder.decode(tokenParam, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                System.out.println("Error decoding the token parameter: " + e.getMessage());
            }

        var authHeader = request.getHeader("Authorization");
        if (authHeader != null)
            return authHeader.replace("Bearer", "").trim();

        var cookies = request.getCookies();
        if (cookies != null) {
            for (var cookie : cookies)
                if (cookie.getName().equals("token"))
                    return cookie.getValue();
        }

        return null;

    }

    public Cookie generateTokenCookie(String token) {
        return token == null ? generateEmptyTokenCookie() : genTokenCookie(token, (int) TimeUnit.HOURS.toSeconds(1));
    }

    public Cookie generateEmptyTokenCookie() {
        return genTokenCookie("", 0);
    };

    private Cookie genTokenCookie(String token, int maxAge) {
        Cookie cookie = new Cookie("token", token);
        cookie.setMaxAge(maxAge); // Set cookie expiration time as needed
        cookie.setPath("/"); // Set the cookie path as needed
        cookie.setHttpOnly(true);

        return cookie;
    }
}