package com.example.chatbot_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.chatbot_service")
@EnableJpaRepositories(basePackages = "com.example.chatbot_service.repository")
@ComponentScan(basePackages = "com.example.chatbot_service")
public class ChatbotServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatbotServiceApplication.class, args);
	}
}
