package com.cap.authenticationservice.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class AuthorityResponse {
    private long id;
    private String authority;

    public AuthorityResponse() {
        id = -1;
        this.authority = "";
    }

    // Use @JsonCreator to specify a constructor for deserialization
    @JsonCreator
    public AuthorityResponse(@JsonProperty("id") long id,@JsonProperty("authority") String authority) {
        this.id = id;
        this.authority = authority;
    }
}