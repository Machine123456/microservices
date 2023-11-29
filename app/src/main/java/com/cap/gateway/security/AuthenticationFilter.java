package com.cap.gateway.security;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ServerWebExchange;

import com.cap.gateway.components.ServiceDiscovery;
import com.cap.gateway.data.Service;
import com.cap.gateway.dto.EndpointResponse;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
public class AuthenticationFilter implements GatewayFilter {

    private final Service serviceFilter;
    private final ServiceDiscovery serviceDiscovery;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Implement your authentication logic here
        // Check authorities, handle authentication tokens, communicate with the
        // authentication service, etc.

        // If authentication is successful, proceed with the chain
        // Otherwise, return an error response

        System.out.println("----------------------------");
        
        System.out.println("Received request for " + serviceFilter.name() + " service ...");

        var service = serviceDiscovery.getServiceStatus(serviceFilter);

        if (service == null || !service.isHealth()) {
            System.out.println("Service " + serviceFilter.name() + " is unavailable");
            return errorStatus(exchange, HttpStatus.SERVICE_UNAVAILABLE);
        }
        var requiredAuthorities = getRequiredAuthorities(exchange, service.getEndpoints());

        if (requiredAuthorities.size() == 0) {
            System.out.println("No required authorities found for requested path ... Authorization Skipped");
            System.out.println("----------------------------");
            return chain.filter(exchange);
        }

        System.out.println("Required authorities found for requested path: " + requiredAuthorities.toString());

        String token = recoverToken(exchange);

        if (token == null) {
            System.out.println("Token not found ... Unauthorized Request");
            System.out.println("----------------------------");
            return errorStatus(exchange, HttpStatus.UNAUTHORIZED);
        }

        System.out.println("Found Token: " + token);
        List<String> tokenAuthorities = getTokenAuthorities(token);

        System.out.println("Token Authorities: " + tokenAuthorities.toString());

        boolean hasAuthorities = tokenAuthorities.containsAll(requiredAuthorities);

        if (!hasAuthorities){
            System.out.println("Token does not have the necessary authorities ... Unauthorized Request");
            System.out.println("----------------------------");
            return errorStatus(exchange, HttpStatus.UNAUTHORIZED);
        }

        exchange.getRequest().mutate().headers(httpHeaders -> httpHeaders.setBearerAuth("token"));

        System.out.println("Authentication completed ... continue of filter chain");

        System.out.println("----------------------------");
        return chain.filter(exchange);
        
    }

    private List<String> getRequiredAuthorities(ServerWebExchange exchange, List<EndpointResponse> endpoints) {

        String requestedPath = exchange.getRequest().getPath().toString();
        String requestedMethod = exchange.getRequest().getMethod().toString();

        System.out.println(requestedMethod + " " + requestedPath);

        for (EndpointResponse endpoint : endpoints) {
            if (endpoint.getMethod().equalsIgnoreCase(requestedMethod) && isValidPath(requestedPath, endpoint.getPaths()))
                return endpoint.getAuthorities();
        }

        return List.of();
    }

    public static boolean isValidPath(String input, List<String> filters) {
        
        for (String filter : filters) {
            if (matchesFilter(input, filter)) {
                return true;
            }
        }
        return false;
    }

    private static boolean matchesFilter(String input, String filter) {
        // Convert filter pattern to a regex pattern
        String regex = filter
                .replace("/", "\\/") // Escape slashes
                .replace("*", ".*"); // Replace * with .*

        // Compile the regex pattern
        Pattern pattern = Pattern.compile(regex);

        // Create a Matcher and check for matches
        Matcher matcher = pattern.matcher(input);
        return matcher.matches();
    }

    private String recoverToken(ServerWebExchange exchange) {
        // Retrieve the token from different sources in the request
        String tokenParam = exchange.getRequest().getQueryParams().getFirst("token");
        if (tokenParam != null) {
            try {
                return URLDecoder.decode(tokenParam, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                System.out.println("Error decoding the token parameter: " + e.getMessage());
            }
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader != null) {
            return authHeader.replace("Bearer", "").trim();
        }

        var cookies = exchange.getRequest().getCookies();
        if (cookies.containsKey("token"))
            return cookies.getFirst("token").getValue().toString();

        return null;
    }

    private List<String> getTokenAuthorities(String token) {

        RestTemplate restTemplate = new RestTemplate();
        String endpoint = serviceDiscovery.getAuthenticationServiceUri() + "/request/tokenAuthorities";

        try {
           
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);

            ResponseEntity<List<String>> responseEntity = restTemplate.exchange(
                    endpoint,
                    org.springframework.http.HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<List<String>>() {
                    });

            return responseEntity.getBody();

        } catch (ResourceAccessException error) {
            System.out.println("Failed to get user from token: " + token);
            return List.of();
        } catch (java.lang.IllegalArgumentException | HttpClientErrorException  error) {
            System.out.println("Error fetching authorities " + endpoint + " : " + error.getMessage());
            return List.of();
        } 

    }

    private Mono<Void> errorStatus(ServerWebExchange exchange, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return Mono.empty();
    }
}