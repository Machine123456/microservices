package com.cap.authenticationservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cap.authenticationservice.dto.AuthorityRequest;
import com.cap.authenticationservice.dto.AuthorityResponse;
import com.cap.authenticationservice.dto.RoleRequest;
import com.cap.authenticationservice.dto.RoleResponse;
import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.dto.UserResponse;
import com.cap.authenticationservice.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /* Users 
     * 
     * Create User is registerUser method of AuthenticationController
     * 
    */

    @GetMapping("/users")
    @ResponseBody
    public ResponseEntity<List<UserResponse>> getUsers() {

        try {
            var users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") long id, @RequestBody UserRequest userRequest) {

        try {
            userService.updateUser(id, userRequest);
            return ResponseEntity.ok("User Updated");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user " + id +" : " + e.getMessage());
        }

    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user " + id +" : " + e.getMessage());
        }
    }

    /* Roles */
 
    @PostMapping("/roles")
    @ResponseBody
    public ResponseEntity<String> createRole(@RequestBody RoleRequest roleRequest) {

        try {
            userService.createRole(roleRequest);
            return ResponseEntity.ok("Role Created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Failed to create role \"" + roleRequest.getName() +"\" : " + e.getMessage());
        }
    }

    @GetMapping("/roles")
    @ResponseBody
    public ResponseEntity<List<RoleResponse>> getRoles() {

        try {
            var roles = userService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

     @PutMapping("/roles/{id}")
    public ResponseEntity<String> updateRole(@PathVariable("id") long id, @RequestBody RoleRequest roleRequest) {

        try {
            userService.updateRole(id, roleRequest);
            return ResponseEntity.ok("Role Updated");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update role " + id +" : " + e.getMessage());
        }

    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable("id") long id) {
        try {
            userService.deleteRole(id);
            return ResponseEntity.ok("Role Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete role " + id +" : " + e.getMessage());
        }
    }

    /* Authorities */

     @PostMapping("/authorities")
    @ResponseBody
    public ResponseEntity<String> createAuthority(@RequestBody AuthorityRequest authorityRequest) {

        try {
            userService.createAuthority(authorityRequest);
            return ResponseEntity.ok("Authority Created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Failed to create authority \"" + authorityRequest.getAuthority() +"\" : " + e.getMessage());
        }
    }

    @GetMapping("/authorities")
    @ResponseBody
    public ResponseEntity<List<AuthorityResponse>> getAuthorities() {

        try {
            var authorities = userService.getAllAuthorities();
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    
     @PutMapping("/authorities/{id}")
    public ResponseEntity<String> updateAuthority(@PathVariable("id") long id, @RequestBody AuthorityRequest authorityRequest) {

        try {
            userService.updateAuthority(id, authorityRequest);
            return ResponseEntity.ok("Authority Updated");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update authority " + id +" : " + e.getMessage());
        }

    }

    @DeleteMapping("/authorities/{id}")
    public ResponseEntity<String> deleteAuthority(@PathVariable("id") long id) {
        try {
            userService.deleteAuthority(id);
            return ResponseEntity.ok("Authority Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete authority " + id +" : " + e.getMessage());
        }
    }




}
