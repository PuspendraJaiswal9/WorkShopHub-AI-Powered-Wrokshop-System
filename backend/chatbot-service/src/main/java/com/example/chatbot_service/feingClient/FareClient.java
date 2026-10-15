package com.example.chatbot_service.feingClient;

import com.example.chatbot_service.dto.Fare;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "fare-service", path = "/fares")
public interface FareClient {
    @GetMapping("/{fareId}")
    Fare getFareById(@PathVariable("fareId") Long fareId);
}

