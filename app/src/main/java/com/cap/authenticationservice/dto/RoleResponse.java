package com.cap.authenticationservice.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class RoleResponse {
    private long id;
    private String name;
    private AuthorityResponse[] authorities;

    // Add a no-argument constructor
    public RoleResponse() {
        id = -1;
        this.name = "";
        this.authorities = new AuthorityResponse[0];
    }

    // Use @JsonCreator to specify a constructor for deserialization
    @JsonCreator
    public RoleResponse(@JsonProperty("id") long id, @JsonProperty("name") String name,
            @JsonProperty("authorities") AuthorityResponse[] authorities) {
        this.id = id;
        this.name = name;
        this.authorities = authorities;
    }
}