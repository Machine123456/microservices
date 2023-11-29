package com.cap.gateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import com.cap.gateway.components.ServiceDiscovery;
import com.cap.gateway.data.Service;
import com.cap.gateway.security.AuthenticationFilter;

@SpringBootApplication
public class GatewayApplication {

	@Autowired
	private ServiceDiscovery serviceDiscovery;

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route(r -> r
						.path("/authentication/users/**", "/authentication/roles/**", "/authentication/authorities/**")
						.filters(f -> f.stripPrefix(1).prefixPath("/api"))
						.uri(serviceDiscovery.getAuthenticationServiceUri()))
				.route(r -> r
						.path("/authentication/**")
						.filters(f -> f.stripPrefix(1).prefixPath("/request"))
						.uri(serviceDiscovery.getAuthenticationServiceUri()))
				.route(r -> r.path("/template/**")
						.filters(f -> f.stripPrefix(1).prefixPath("/api").filter(new AuthenticationFilter(Service.TEMPLATE,serviceDiscovery)))
						.uri(serviceDiscovery.getTemplateServiceUri()))
				.build();
	}
}