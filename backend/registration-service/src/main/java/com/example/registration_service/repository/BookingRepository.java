package com.example.registration_service.repository;

import com.example.registration_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    Booking findByNameAndWorkshopId(String name,Long workshopId);
    Booking findByNameAndWorkshopIdAndStatus(String name, Long workshopId, String status);
    java.util.List<Booking> findByName(String name);
}
