package com.example.chatbot_service.feingClient;

import com.example.chatbot_service.dto.Booking;
import com.example.chatbot_service.dto.BookingRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@FeignClient(name = "registration-service", path = "/api/bookings")
public interface BookingClient {
    @GetMapping("/{id}")
    Optional<Booking> getBookingById(@PathVariable("id") Long id);

    @PostMapping
    Booking createBooking(@RequestBody BookingRequest request);
}

