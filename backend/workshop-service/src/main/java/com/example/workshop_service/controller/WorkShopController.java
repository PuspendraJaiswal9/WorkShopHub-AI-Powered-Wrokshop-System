package com.example.workshop_service.controller;

import com.example.workshop_service.entity.Workshop;
import com.example.workshop_service.exception.WorkShopAllreadyHaveAddedException;
import com.example.workshop_service.exception.WorkShopNotFoundException;
import com.example.workshop_service.service.WorkShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workshops")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkShopController {

    @Autowired
    private WorkShopService workShopService;

    // Add Workshop
    @PostMapping
    public ResponseEntity<Workshop> addWorkShop(@RequestBody Workshop workshop) throws WorkShopAllreadyHaveAddedException {
        Workshop savedWorkshop = workShopService.addWorkShop(workshop);
        return ResponseEntity.ok(savedWorkshop);
    }

    // Update Workshop
    @PutMapping("/{id}")
    public ResponseEntity<Workshop> updateWorkShop(@PathVariable("id") Long workshopId,
                                                   @RequestBody Workshop workshop) throws WorkShopNotFoundException {
        Workshop updatedWorkshop = workShopService.updateWorkShop(workshopId, workshop);
        return ResponseEntity.ok(updatedWorkshop);
    }

    // Delete Workshop
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkShop(@PathVariable("id") Long workshopId) throws WorkShopNotFoundException {
        String message = workShopService.deleteWorkShop(workshopId);
        return ResponseEntity.ok(message);
    }

    // Get All Workshops
    @GetMapping
    public ResponseEntity<List<Workshop>> getAllWorkShops() {
        List<Workshop> allWorkshops = workShopService.getAll();
        return ResponseEntity.ok(allWorkshops);
    }

    // Get Workshop By ID
    @GetMapping("/{id}")
    public ResponseEntity<Workshop> getWorkShopById(@PathVariable("id") Long workshopId)
            throws WorkShopNotFoundException {
        Workshop workshop = workShopService.getById(workshopId);
        return ResponseEntity.ok(workshop);
    }
}

