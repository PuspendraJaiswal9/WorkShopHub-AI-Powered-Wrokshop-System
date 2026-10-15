package com.example.fare_service.controller;

import com.example.fare_service.exception.FareNotFoundException;
import com.example.fare_service.model.Fare;
import com.example.fare_service.service.FareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fares")
@CrossOrigin(origins = "http://localhost:3000")
public class FareController {

    @Autowired
    private FareService fareService;

    @PostMapping
    public Fare addFare(@RequestBody Fare fare) {
        return fareService.addFare(fare);
    }

    @PutMapping("/{fareId}")
    public Fare updateFare(@PathVariable Long fareId, @RequestBody Fare fare) throws FareNotFoundException {
        return fareService.updateFare(fareId, fare);
    }

    @GetMapping("/{fareId}")
    public Fare getFareById(@PathVariable Long fareId) throws FareNotFoundException {
        return fareService.getFareById(fareId);
    }

    @DeleteMapping("/{fareId}")
    public String deleteFare(@PathVariable Long fareId) throws FareNotFoundException {
        return fareService.deleteFare(fareId);
    }
}
