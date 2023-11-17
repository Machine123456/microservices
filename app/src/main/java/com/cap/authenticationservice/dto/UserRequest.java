package com.cap.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String username;
    private String email;
    private String password;

    /* 
    private String[] roles;

    public void setRoles(String... roles){
        this.roles = roles;
    }*/
}
