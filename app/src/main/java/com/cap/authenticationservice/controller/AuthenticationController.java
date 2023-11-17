package com.cap.authenticationservice.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.dto.UserResponse;
import com.cap.authenticationservice.service.AuthenticationService;
import com.cap.authenticationservice.service.TokenService;
import com.cap.authenticationservice.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/request")
@RequiredArgsConstructor
public class AuthenticationController{

    private final UserService userService;
    private final TokenService tokenService;
    private final AuthenticationService authService;

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<String> registerUser(@RequestBody UserRequest userRequest, HttpServletResponse response){

        try {
            userService.createUser(userRequest);

            String token = authService.authenticateUser(userRequest);
            response.addCookie(tokenService.generateTokenCookie(token));

            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create user: " + e.getMessage());
        }
    }

   
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<String> loginUser(@RequestBody UserRequest userRequest, HttpServletResponse response) {
        try {
            System.out.println("Received login request: " + userRequest.getUsername() + " " + userRequest.getPassword());
            String token = authService.authenticateUser(userRequest);
            response.addCookie(tokenService.generateTokenCookie(token));
            System.out.println("Login Successfully");

            return ResponseEntity.ok(token);
        } catch ( Exception e) {
            System.out.println("Login Request Failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed: " + e.getMessage());
        }
    }

    @GetMapping("/logout")
    @ResponseBody
    public ResponseEntity<String> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        try {

            String token = tokenService.recoverToken(request);

            if(token == null || token.isBlank())
                return ResponseEntity.ok("Logout successful: The user was not logged in");

            response.addCookie(tokenService.generateEmptyTokenCookie());

            // Invalidate the token on the server (this is a simplified example)
            tokenService.invalidateToken(token);

            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed: " + e.getMessage());
        }
    }


    @GetMapping("/getUserFromToken")
    @ResponseBody
    public ResponseEntity<UserResponse> getUserFromToken(HttpServletRequest request) {
        try {
            var token = tokenService.recoverToken(request);
            var tokenResult = tokenService.validateToken(token);//URLDecoder.decode(token, "UTF-8"));

            if(!tokenResult.isPresent())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(UserResponse.ofError(tokenResult.getErrorMsg()));

            var userId = tokenResult.get();
            var user = userService.findUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(UserResponse.ofError(e.getMessage()));
        }
    }

    @GetMapping("/getUserRequirements")
    @ResponseBody
    public ResponseEntity<Map<String,Map<String,String>>> getUserRequirements() {
        return ResponseEntity.ok(userService.getUserFieldsRequirements());
    }


    /*
    
    
    @GetMapping("/recoverToken")
    @ResponseBody
    public ResponseEntity<String> recoverToken(HttpServletRequest request) {
        try {
            return ResponseEntity.ok(tokenService.recoverToken(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        } 
    }

    @GetMapping("/getServicesMapping")
    @ResponseBody
    public ResponseEntity<Map<String, MappingResponse>> getServicesMapping(HttpServletRequest request) {

        try {
            Map<String, MappingResponse> res = authService.getServicesMapping();
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        } 
    }

    @GetMapping("/getMapping")
    @ResponseBody
    public ResponseEntity<MappingResponse> getMapping(HttpServletRequest request) {
        try {
            MappingResponse res = authService.getMapping();
            return ResponseEntity.ok(res);
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
    
    @GetMapping("/getBridgeHostname")
    @ResponseBody
    public ResponseEntity<String> getBridgeHostname() {
        return ResponseEntity.ok(authService.getBridgeHostname());
    }

    */


    
}