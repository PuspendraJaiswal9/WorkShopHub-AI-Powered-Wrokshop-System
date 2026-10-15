package com.example.registration_service.service;

import com.example.registration_service.entity.Booking;
import com.example.registration_service.dto.BookingRequest;
import com.example.registration_service.exception.BookingAllreadyAvailableException;
import com.example.registration_service.exception.BookingNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public interface BookingService {

    // Create a new booking
    Booking createBooking(BookingRequest bookingRequest) throws BookingAllreadyAvailableException;

    // Get booking by ID
    Optional<Booking> getBookingById(Long id) throws BookingNotFoundException;

    // Get all bookings
    List<Booking> getAllBookings();

    // Get bookings by username
    List<Booking> getBookingsByUsername(String username);

    // Update booking (status, date etc.)
    Booking updateBooking(Long id, BookingRequest bookingRequest) throws BookingNotFoundException;

    // Cancel/Delete booking
    void cancelBooking(Long id) throws BookingNotFoundException;
}
