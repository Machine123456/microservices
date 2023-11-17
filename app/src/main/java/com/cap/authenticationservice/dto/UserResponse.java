package com.cap.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserResponse {
    private long id;
    private String username;
    private String email;
    private RoleResponse[] roles;

    private boolean hasError;
    private String errorMsg;

    // Add a no-argument constructor
    public UserResponse() {
        id = -1;
        username = "";
        email = "";
        roles = new RoleResponse[0];

        hasError = false;
        errorMsg = "";
    }

    public static UserResponse ofError(String errorMsg) {
        return UserResponse.builder()
                .hasError(true)
                .errorMsg(errorMsg)
                .build();
    }
}
