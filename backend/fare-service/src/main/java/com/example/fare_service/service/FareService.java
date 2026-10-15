package com.example.fare_service.service;

import com.example.fare_service.exception.FareNotFoundException;
import com.example.fare_service.model.Fare;

public interface FareService {
    Fare addFare(Fare fare);
    Fare updateFare(Long fareId,Fare fare)throws FareNotFoundException;
    Fare getFareById(Long fareId)throws FareNotFoundException;
    String deleteFare(Long fareId)throws FareNotFoundException;
}
