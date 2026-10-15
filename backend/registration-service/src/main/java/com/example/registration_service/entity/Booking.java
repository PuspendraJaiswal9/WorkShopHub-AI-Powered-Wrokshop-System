package com.example.registration_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Workshop ID is required")
    private Long workshopId;

    private LocalDateTime bookingDate;

    @Min(value = 1, message = "Number of booking must be at least 1")
    private int numberOfBooking;

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

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private double amount;

    @NotBlank(message = "Created By is mandatory")
    private String createdBy;

    private String status = "PENDING";

    private String sessionId;

    @Column(length=1000)
    private String sessionUrl;

    @PrePersist
    public void onCreate() {
        this.bookingDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

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

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public int getNumberOfBooking() {
        return numberOfBooking;
    }

    public void setNumberOfBooking(int numberOfBooking) {
        this.numberOfBooking = numberOfBooking;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }
}
