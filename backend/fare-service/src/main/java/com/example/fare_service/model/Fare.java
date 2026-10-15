package com.example.fare_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Fare {

    @Id
    private Long fareId;

    private Long workshopId;

    private double price;

    // Getters and Setters
    public Long getFareId() {
        return fareId;
    }

    public void setFareId(Long fareId) {
        this.fareId = fareId;
    }

    public Long getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(Long workshopId) {
        this.workshopId = workshopId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
