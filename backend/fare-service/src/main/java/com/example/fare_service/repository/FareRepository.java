package com.example.fare_service.repository;

import com.example.fare_service.model.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FareRepository extends JpaRepository<Fare,Long> {
}
