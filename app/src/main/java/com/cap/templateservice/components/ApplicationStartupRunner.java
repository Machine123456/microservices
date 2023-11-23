package com.cap.templateservice.components;

import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.cap.templateservice.data.model.Product;
import com.cap.templateservice.data.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApplicationStartupRunner implements CommandLineRunner {

	private final ProductRepository productRepository;

	@Override
	public void run(String... args) throws Exception {
		if (productRepository.findByName("P1").isPresent())
			return;

		int initProductCount = 3;
		Random rand = new Random();

		for (int i = 1; i <= initProductCount; i++) {

			Product product = Product.builder()
					.name("P" + i)
					.price(rand.nextFloat() * 90 + 10)
					.build();

			productRepository.save(product);
		}

	}

}
