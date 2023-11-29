package com.cap.gateway.components;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.cap.gateway.data.Service;
import com.cap.gateway.data.ServiceStatus;
import com.cap.gateway.dto.EndpointResponse;
import com.cap.gateway.dto.HealthResponse;
import com.cap.gateway.dto.InfoResponse;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

class ServiceStatusWrapper {
    private String uri;
    private ServiceStatus serviceStatus;

    private LocalDateTime lastHealthFetchTime;
    private long healthTimeOut_ms;
    private LocalDateTime lastInfoFetchTime;
    private long infoTimeOut_ms;

    public ServiceStatusWrapper(String uri, long healthTimeOut_ms, long infoTimeOut_ms) {
        this.uri = uri;
        this.healthTimeOut_ms = healthTimeOut_ms;
        this.infoTimeOut_ms = infoTimeOut_ms;

        doFetch();
    }

    public ServiceStatus getServiceStatus() {
        doFetch();
        return serviceStatus;
    }

    private void doFetch() {
        RestTemplate restTemplate = new RestTemplate();

        boolean isHealth = serviceStatus != null ? serviceStatus.isHealth() : false;

        if (hasTimePassed(lastHealthFetchTime, healthTimeOut_ms)) {

            lastHealthFetchTime = LocalDateTime.now();

            try {
                // Check /actuator/health
                String healthEndpoint = uri + "/actuator/health";
                HealthResponse healthResponse = restTemplate.getForObject(healthEndpoint, HealthResponse.class);

                isHealth = healthResponse != null && "UP".equals(healthResponse.getStatus());

                System.out.println("Fetched " + uri + " health: " + isHealth);

            } catch (ResourceAccessException error) {
                System.out.println("Failed to fetch " + uri + " health");
                isHealth = false;
            }
        }

        List<EndpointResponse> endpoints = serviceStatus != null ? serviceStatus.getEndpoints() :  List.of();

        if (isHealth && hasTimePassed(lastInfoFetchTime, infoTimeOut_ms)) {

            lastInfoFetchTime = LocalDateTime.now();

            try {
                // If the service is up, fetch /actuator/info
                String infoEndpoint = uri + "/actuator/info";
                InfoResponse infoResponse = restTemplate.getForObject(infoEndpoint, InfoResponse.class);

                if (infoResponse != null && infoResponse.getEndpoints() != null) {
                    endpoints = infoResponse.getEndpoints();
                    System.out.println("Fetched " + uri + " info: " + endpoints);
                }
            } catch (ResourceAccessException error) {
                System.out.println("Failed to fetch " + uri + " info");
            }
        }

        serviceStatus = new ServiceStatus(isHealth, endpoints);

    }

    private static boolean hasTimePassed(LocalDateTime startTime, float milliseconds) {

        if (startTime == null)
            return true;

        if (milliseconds <= 0)
            return false;

        LocalDateTime currentTime = LocalDateTime.now();
        Duration duration = Duration.between(startTime, currentTime);
        long millisecondsPassed = duration.toMillis();

        return millisecondsPassed >= milliseconds;
    }
}

@Component
@RequiredArgsConstructor
public class ServiceDiscovery {

    @Getter
    @Value("${api.services.authentication}")
    private String authenticationServiceUri;

    @Getter
    @Value("${api.services.template}")
    private String templateServiceUri;

    private Map<Service, ServiceStatusWrapper> _ServiceCachedStatus;

    public Map<Service, ServiceStatusWrapper> getServiceStatusMap() {
        return _ServiceCachedStatus;
    }
    
    @PostConstruct
    private void initializeServiceStatus() {
        _ServiceCachedStatus = new HashMap<>() {
            {
                //put(Service.AUTHENTICATION, new ServiceStatusWrapper(authenticationServiceUri, 10_000l, 0));
                put(Service.TEMPLATE, new ServiceStatusWrapper(templateServiceUri, 10_000l, 0));
            }
        };

        //ServiceStatus templateServiceStatus = _ServiceCachedStatus.get(Service.TEMPLATE).getServiceStatus();
    }

    public ServiceStatus getServiceStatus(Service service) {

        if (_ServiceCachedStatus == null)
            return null;

        switch (service) {
            
            case TEMPLATE:
                return _ServiceCachedStatus.get(service).getServiceStatus();
            case AUTHENTICATION:
            default:
                return null;
        }
    }

    // serviceUri/actuator/health
    /* {"status":"UP"} */

    // serviceUri/actuator/info
    /*
     * {"endpoints":[
     * {
     * "method":"GET",
     * "paths":[
     * "/api/products",
     * "/api/products/{id}"
     * ],
     * "authorities":[
     * "READ_PRODUCT"
     * ]
     * },
     * {
     * "method":"POST",
     * "paths":[
     * "/api/products"
     * ],
     * "authorities":[
     * "CREAT_PRODUCT"
     * ]
     * },
     * {
     * "method":"DELETE",
     * "paths":[
     * "/api/products/{id}"
     * ],
     * "authorities":[
     * "DELETE_PRODUCT"
     * ]
     * },
     * {
     * "method":"PUT",
     * "paths":[
     * "/api/products/{id}"
     * ],
     * "authorities":[
     * "UPDATE_PRODUCT"
     * ]
     * }
     * ]}
     */

}
