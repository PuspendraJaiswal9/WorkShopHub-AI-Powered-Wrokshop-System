package com.example.registration_service.service;

import com.example.registration_service.dto.*;
import com.example.registration_service.entity.Booking;
import com.example.registration_service.exception.BookingAllreadyAvailableException;
import com.example.registration_service.exception.BookingNotFoundException;
import com.example.registration_service.feing.FareClient;
import com.example.registration_service.feing.WorkshopClient;
import com.example.registration_service.payclient.PayClient;
import com.example.registration_service.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PayClient payClient;

    @Autowired
    private WorkshopClient workshopClient;

    @Autowired
    private FareClient fareClient;

    @Override
    public Booking createBooking(BookingRequest bookingRequest) throws BookingAllreadyAvailableException {
        Long workshopId = bookingRequest.getWorkshopId();

        // Duplicate booking check -> name + workshopId + CONFIRMED status
        Booking existingBooking = bookingRepository.findByNameAndWorkshopIdAndStatus(
                bookingRequest.getName(), workshopId, "CONFIRMED");
        if (existingBooking != null) {
            throw new BookingAllreadyAvailableException("Booking already done for this workshop.");
        }

        // Workshop details Feign se
        Workshop workshop = workshopClient.getWorkshopById(workshopId);
        if (workshop == null) {
            throw new RuntimeException("Workshop not found for Id: " + workshopId);
        }

        // Check available seats
        if (workshop.getAvailableSeats() < bookingRequest.getNumberOfBooking()) {
            throw new RuntimeException("Not enough seats available. Only " + workshop.getAvailableSeats() + " seats left.");
        }

        // Fare details Feign se
        Fare fare = fareClient.getFareById(workshopId);
        if (fare == null) {
            throw new RuntimeException("Fare not found for Workshop Id: " + workshopId);
        }

        // Calculate total amount (price * number of bookings)
        long totalAmount = (long) (fare.getPrice() * bookingRequest.getNumberOfBooking());

        // New booking create (PENDING status)
        Booking booking = new Booking();
        booking.setName(bookingRequest.getName());
        booking.setWorkshopId(workshopId);
        booking.setNumberOfBooking(bookingRequest.getNumberOfBooking());
        booking.setTitle(workshop.getTitle());
        booking.setDescription(workshop.getDescription());
        booking.setDate(workshop.getDate());
        booking.setStartTime(workshop.getStartTime());
        booking.setEndTime(workshop.getEndTime());
        booking.setVenue(workshop.getVenue());
        booking.setAmount(totalAmount);
        booking.setCreatedBy(workshop.getCreatedBy());
        booking.setStatus("PENDING");
        
        Booking savedBooking = bookingRepository.save(booking);

        try {
            // Payment Request with booking ID
            PaymentRequest paymentRequest = new PaymentRequest();
            paymentRequest.setAmount(totalAmount);
            paymentRequest.setQuantity(1L);
            paymentRequest.setCurrency("INR");
            paymentRequest.setBookingId(savedBooking.getBookingId());
            StripeResponse paymentResponse = payClient.makePayment(paymentRequest);

            if (!"SUCCESS".equalsIgnoreCase(paymentResponse.getStatus())) {
                bookingRepository.deleteById(savedBooking.getBookingId());
                throw new RuntimeException("Payment Failed: " + paymentResponse.getMessage());
            }

            // Reduce available seats in workshop
            workshop.setAvailableSeats(workshop.getAvailableSeats() - bookingRequest.getNumberOfBooking());
            workshopClient.updateWorkshop(workshopId, workshop);

            savedBooking.setSessionId(paymentResponse.getSessionId());
            savedBooking.setSessionUrl(paymentResponse.getSessionUrl());
            savedBooking.setStatus("CONFIRMED");

            return bookingRepository.save(savedBooking);
        } catch (Exception e) {
            bookingRepository.deleteById(savedBooking.getBookingId());
            throw e;
        }
    }

    @Override
    public Optional<Booking> getBookingById(Long id) throws BookingNotFoundException {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isEmpty()) {
            throw new BookingNotFoundException("Booking Not Found");
        }
        return booking;
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUsername(String username) {
        return bookingRepository.findByName(username);
    }

    @Override
    public Booking updateBooking(Long id, BookingRequest bookingRequest) throws BookingNotFoundException {
        Optional<Booking> getById = bookingRepository.findById(id);
        if (getById.isPresent()) {
            Booking booking = getById.get();
            booking.setName(bookingRequest.getName());
            booking.setWorkshopId(bookingRequest.getWorkshopId());
            booking.setNumberOfBooking(bookingRequest.getNumberOfBooking());
            return bookingRepository.save(booking);
        } else {
            throw new BookingNotFoundException("Booking Not Found");
        }
    }

    @Override
    public void cancelBooking(Long id) throws BookingNotFoundException {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            
            // Return seats to workshop if booking was confirmed
            if ("CONFIRMED".equals(booking.getStatus())) {
                Workshop workshop = workshopClient.getWorkshopById(booking.getWorkshopId());
                if (workshop != null) {
                    workshop.setAvailableSeats(workshop.getAvailableSeats() + booking.getNumberOfBooking());
                    workshopClient.updateWorkshop(booking.getWorkshopId(), workshop);
                }
            }
            
            bookingRepository.deleteById(id);
        } else {
            throw new BookingNotFoundException("Booking Not Found");
        }
    }
}
