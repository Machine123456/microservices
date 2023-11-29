package com.cap.gateway.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EndpointResponse {
    private String method;
    private List<String> paths;
    private List<String> authorities;

    @Override
    public String toString() {
        return method + " " + paths.toString() + " " + authorities.toString();
    }
}
