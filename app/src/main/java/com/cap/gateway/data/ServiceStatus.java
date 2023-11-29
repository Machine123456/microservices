package com.cap.gateway.data;

import java.util.List;

import com.cap.gateway.dto.EndpointResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ServiceStatus {
    private boolean isHealth;
    private List<EndpointResponse> endpoints;

}
