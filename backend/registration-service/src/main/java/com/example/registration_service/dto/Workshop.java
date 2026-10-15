package com.example.registration_service.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workshopId;

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, max = 100, message = "Title should be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Size(min = 10, max = 500, message = "Description should be between 10 and 500 characters")
    private String description;

    @NotNull(message = "Date is mandatory")
    private LocalDate date;

    @NotNull(message = "Start time is mandatory")
    private LocalTime startTime;

    @NotNull(message = "End time is mandatory")
    private LocalTime endTime;

    @NotBlank(message = "Venue is mandatory")
    private String venue;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @Min(value = 0, message = "Available seats cannot be negative")
    private int availableSeats;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private double amount;

    @NotBlank(message = "Created By is mandatory")
    private String createdBy;

    // Getters and Setters
    public Long getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(Long workshopId) {
        this.workshopId = workshopId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}

