package com.cap.productservice;

import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.cap.productservice.model.Product;
import com.cap.productservice.repository.ProductRepository;

@SpringBootApplication
@EnableConfigurationProperties 
public class ProductServiceApplication {
	
	@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner run(ProductRepository productRepository){
		return  args -> {

			if(productRepository.findByName("P1").isPresent()) return;

			int initProductCount = 3;
			Random rand = new Random();

			for (int i = 1; i <= initProductCount; i++) {
				
				Product product = Product.builder()
					.name("P"+i)
					.price(rand.nextFloat()*90 + 10)
					.build();

				productRepository.save(product);
			}

		};
	}

}
