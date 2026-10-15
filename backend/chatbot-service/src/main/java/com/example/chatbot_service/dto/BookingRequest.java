package com.example.chatbot_service.dto;



import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Workshop ID is required")
    private Long workshopId;

    @Min(value = 1, message = "Number of booking must be at least 1")
    private int numberOfBooking;

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(Long workshopId) {
        this.workshopId = workshopId;
    }

    public int getNumberOfBooking() {
        return numberOfBooking;
    }

    public void setNumberOfBooking(int numberOfBooking) {
        this.numberOfBooking = numberOfBooking;
    }
}

