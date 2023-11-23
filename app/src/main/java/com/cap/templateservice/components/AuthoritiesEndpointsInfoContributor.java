package com.cap.templateservice.components;

import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import lombok.Getter;

import java.io.Serializable;
import java.util.List;

import org.springframework.boot.actuate.info.Info;

@Component
public class AuthoritiesEndpointsInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) { //{id}

        List<EndpointAuthorities> endpointAuthorities = List.of(
                new EndpointAuthorities(HttpMethod.GET,"/api/products","/api/products/{id}").hasAnyAuthorities("READ_PRODUCT"),
                new EndpointAuthorities(HttpMethod.POST, "/api/products").hasAnyAuthorities("CREAT_PRODUCT"),
                new EndpointAuthorities(HttpMethod.DELETE,"/api/products/{id}").hasAnyAuthorities("DELETE_PRODUCT"),
                new EndpointAuthorities(HttpMethod.PUT,"/api/products/{id}").hasAnyAuthorities("UPDATE_PRODUCT")
            );
        builder.withDetail("endpoints", endpointAuthorities);
    }

}

@Getter
class EndpointAuthorities implements Serializable {

    private String method;
    private String[] paths;
    private String[] authorities;

    public EndpointAuthorities(HttpMethod method, String... paths) {
        this.method = method.name();
        this.paths = paths;
    }

    public EndpointAuthorities hasAnyAuthorities(String... authorities) {
        this.authorities = authorities;
        return this;
    }

}
