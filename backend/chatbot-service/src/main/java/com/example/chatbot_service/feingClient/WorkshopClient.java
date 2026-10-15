package com.example.chatbot_service.feingClient;

import com.example.chatbot_service.dto.Workshop;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "workshop-service", path = "/api/workshops")
public interface WorkshopClient {
    @GetMapping
    List<Workshop> getAllWorkshops();

    @GetMapping("/{id}")
    Workshop getWorkshopById(@PathVariable("id") Long id);
}

