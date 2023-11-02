package com.cap.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String username;
    private String email;
    private String[] authorities;

    private boolean hasError;
    private String errorMsg;

    public static UserResponse ofError(String errorMsg) {
        return UserResponse.builder()
            .hasError(true)
            .errorMsg(errorMsg)
            .build();
    }
}
