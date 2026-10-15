package com.example.registration_service.feing;

import com.example.registration_service.dto.Workshop;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "workshop-service")
public interface WorkshopClient {

    @GetMapping("/api/workshops/{id}")
    Workshop getWorkshopById(@PathVariable("id") Long id);

    @PutMapping("/api/workshops/{id}")
    Workshop updateWorkshop(@PathVariable("id") Long id, @RequestBody Workshop workshop);
}


