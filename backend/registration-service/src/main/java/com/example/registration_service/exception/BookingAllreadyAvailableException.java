package com.example.registration_service.exception;

public class BookingAllreadyAvailableException extends Exception{
    public BookingAllreadyAvailableException(String message){
        super(message);
    }
}
