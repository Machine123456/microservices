package com.cap.productservice.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
public class MappingResponse {

    private List<EndpointResponse> endpoints;
    @Setter
    private String adress;
    @Setter
    private String bridgeAdress;
    @Setter
    private String imageData; 

    public MappingResponse(){
        imageData = "";
        adress = "";
        bridgeAdress = "";
        endpoints = new ArrayList<>();
    }

    public void addEndpoint(String path,String requiredRole){
        endpoints.add(new EndpointResponse(path,requiredRole));
    }

    public void addEndpoint(String path){
        addEndpoint(path,"");
    }

}


@Getter
class EndpointResponse {
    private String path;
    private String requiredRole;

    // Add a no-argument constructor
    public EndpointResponse() {
        this.path = "";
        this.requiredRole = "";
    }

    // Use @JsonCreator to specify a constructor for deserialization
    @JsonCreator
    public EndpointResponse(@JsonProperty("path") String path, @JsonProperty("requiredRole") String requiredRole) {
        this.path = path;
        this.requiredRole = requiredRole;
    }
}
