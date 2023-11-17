package com.cap.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleRequest {
    private String name;

    // Perhabs is better to add authorities 
    // in a separated method like we do when adding roles to user
    // private String[] authorities;

}
