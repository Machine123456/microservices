package com.cap.productservice.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cap.productservice.dto.MappingResponse;
import com.cap.productservice.dto.UserResponse;
import com.cap.productservice.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController{

    private final AuthenticationService authService;

    @CrossOrigin
    @GetMapping("/getMapping")
    @ResponseBody
    public ResponseEntity<MappingResponse> getMapping(HttpServletRequest request) {
    try {
        return ResponseEntity.ok(authService.getMapping());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    } 
    }

    @GetMapping("/recoverToken")
    @ResponseBody
    public ResponseEntity<String> recoverToken(HttpServletRequest request) {
    try {
        return ResponseEntity.ok(authService.recoverToken(request));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    } 
    }

    @GetMapping("/getServicesMapping")
    @ResponseBody
    public ResponseEntity<Map<String, MappingResponse>> getServicesMapping() {
    try {
        return authService.getServicesMapping();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    } 
    }

    @GetMapping("/getUserFromToken")
    @ResponseBody
    public ResponseEntity<UserResponse> getUserFromToken(HttpServletRequest request) {
    try {
        return authService.getUserFromToken(request);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    } 
    }

    @GetMapping("/logout")
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletRequest request) {
    try {
        return authService.logout(request);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
    } 
    }

    @GetMapping("/redirect")
    @ResponseBody
    public ResponseEntity<Void> redirect(HttpServletRequest request, HttpServletResponse response, @RequestParam("href") String href) {
        try {
        return ResponseEntity.status(authService.redirect(request,response,href)).build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    } 
    }


}
