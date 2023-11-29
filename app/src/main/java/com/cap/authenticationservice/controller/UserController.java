package com.cap.authenticationservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /*
     * Users
     * 
     * Create User is registerUser method of AuthenticationController
     * 
     */

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {

        try {
            var users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET, params = "id")
    public ResponseEntity<UserResponse> getUser(
            @RequestParam("id") long id) {
        try {
            var user = userService.getUser(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/users", method = RequestMethod.PUT, params = "id")
    public ResponseEntity<String> updateUser(
            @RequestParam("id") long id,
            @RequestBody Object requestBody) {
        try {
            if (requestBody instanceof UserRequest) {
                // Handle user update logic
                userService.updateUser(id, (UserRequest) requestBody);
                return ResponseEntity.ok("User Updated");
            } else if (requestBody instanceof long[]) {
                // Handle setting user roles logic
                userService.setUserRoles(id, (long[]) requestBody);
                return ResponseEntity.ok("User Roles Set");
            } else {
                // Handle unsupported request body type
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request body");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process request for user " + id + ": " + e.getMessage());
        }
    }

     @RequestMapping(value = "/users", method = RequestMethod.DELETE, params = "id")
    public ResponseEntity<String> deleteUser(@RequestParam("id") long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user " + id + " : " + e.getMessage());
        }
    }

    /* Roles */

    @PostMapping("/roles")
    public ResponseEntity<String> createRole(@RequestBody RoleRequest roleRequest) {

        try {
            userService.createRole(roleRequest);
            return ResponseEntity.ok("Role Created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Failed to create role \"" + roleRequest.getName() + "\" : " + e.getMessage());
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponse>> getRoles() {

        try {
            var roles = userService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/roles", method = RequestMethod.GET, params = "id")
    public ResponseEntity<RoleResponse> getRole(@RequestParam("id") long id) {

        try {
            var role = userService.getRole(id);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/roles", method = RequestMethod.PUT, params = "id")
    public ResponseEntity<String> updateRoleOrSetAuthorities(@RequestParam("id") long id,
            @RequestBody Object requestBody) {
        try {
            if (requestBody instanceof RoleRequest) {
                // Handle role update logic
                userService.updateRole(id, (RoleRequest) requestBody);
                return ResponseEntity.ok("Role Updated");
            } else if (requestBody instanceof long[]) {
                // Handle setting role authorities logic
                userService.setRoleAuthorities(id, (long[]) requestBody);
                return ResponseEntity.ok("Role Authorities Set");
            } else {
                // Handle unsupported request body type
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request body");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process request for role " + id + ": " + e.getMessage());
        }
    }

    @RequestMapping(value = "/roles", method = RequestMethod.DELETE, params = "id")
    public ResponseEntity<String> deleteRole(@RequestParam("id") long id) {
        try {
            userService.deleteRole(id);
            return ResponseEntity.ok("Role Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete role " + id + " : " + e.getMessage());
        }
    }

    /* Authorities */

    @PostMapping("/authorities")
    public ResponseEntity<String> createAuthority(@RequestBody AuthorityRequest authorityRequest) {

        try {
            userService.createAuthority(authorityRequest);
            return ResponseEntity.ok("Authority Created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Failed to create authority \"" + authorityRequest.getAuthority() + "\" : " + e.getMessage());
        }
    }

    @GetMapping("/authorities")
    public ResponseEntity<List<AuthorityResponse>> getAuthorities() {

        try {
            var authorities = userService.getAllAuthorities();
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/authorities", method = RequestMethod.GET, params = "id")
    public ResponseEntity<AuthorityResponse> getAuthority(@RequestParam("id") long id) {

        try {
            var authority = userService.getAuthority(id);
            return ResponseEntity.ok(authority);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null);
        }
    }

    @RequestMapping(value = "/authorities", method = RequestMethod.PUT, params = "id")
    public ResponseEntity<String> updateAuthority(@RequestParam("id") long id,
            @RequestBody AuthorityRequest authorityRequest) {

        try {
            userService.updateAuthority(id, authorityRequest);
            return ResponseEntity.ok("Authority Updated");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update authority " + id + " : " + e.getMessage());
        }

    }

    @RequestMapping(value = "/authorities", method = RequestMethod.DELETE, params = "id")
    public ResponseEntity<String> deleteAuthority(@RequestParam("id") long id) {
        try {
            userService.deleteAuthority(id);
            return ResponseEntity.ok("Authority Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete authority " + id + " : " + e.getMessage());
        }
    }

}
