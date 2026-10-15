package com.example.registration_service.feing;

import com.example.registration_service.dto.Fare;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "fare-service")
public interface FareClient {

    @GetMapping("/fares/{id}")
    Fare getFareById(@PathVariable("id") Long id);
}
