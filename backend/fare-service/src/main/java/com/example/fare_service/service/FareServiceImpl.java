package com.example.fare_service.service;

import com.example.fare_service.exception.FareNotFoundException;
import com.example.fare_service.model.Fare;
import com.example.fare_service.repository.FareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FareServiceImpl implements FareService {

    @Autowired
    private FareRepository fareRepository;

    @Override
    public Fare addFare(Fare fare) {
        return fareRepository.save(fare);
    }

    @Override
    public Fare updateFare(Long fareId, Fare fare) throws FareNotFoundException {
        Optional<Fare> existingFare = fareRepository.findById(fareId);
        if (existingFare.isPresent()) {
            Fare updatedFare = existingFare.get();
            updatedFare.setWorkshopId(fare.getWorkshopId());
            updatedFare.setPrice(fare.getPrice());
            return fareRepository.save(updatedFare);
        } else {
            throw new FareNotFoundException("Fare not found with id: " + fareId);
        }
    }

    @Override
    public Fare getFareById(Long fareId) throws FareNotFoundException {
        return fareRepository.findById(fareId)
                .orElseThrow(() -> new FareNotFoundException("Fare not found with id: " + fareId));
    }

    @Override
    public String deleteFare(Long fareId) throws FareNotFoundException {
        if (fareRepository.existsById(fareId)) {
            fareRepository.deleteById(fareId);
            return "Fare deleted successfully with id: " + fareId;
        } else {
            throw new FareNotFoundException("Fare not found with id: " + fareId);
        }
    }

}
