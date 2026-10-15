package com.example.registration_service.controller;

import com.example.registration_service.dto.BookingRequest;
import com.example.registration_service.entity.Booking;
import com.example.registration_service.exception.BookingAllreadyAvailableException;
import com.example.registration_service.exception.BookingNotFoundException;
import com.example.registration_service.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest bookingRequest) throws BookingAllreadyAvailableException {
        Booking booking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(booking);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Booking>> getBookingById(@PathVariable Long id) throws BookingNotFoundException {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // Get bookings by username
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestParam String username) {
        List<Booking> bookings = bookingService.getBookingsByUsername(username);
        return ResponseEntity.ok(bookings);
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Update booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody BookingRequest bookingRequest) throws BookingNotFoundException {
        Booking updatedBooking = bookingService.updateBooking(id, bookingRequest);
        return ResponseEntity.ok(updatedBooking);
    }

    // Cancel/Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) throws BookingNotFoundException {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully with id: " + id);
    }
}
