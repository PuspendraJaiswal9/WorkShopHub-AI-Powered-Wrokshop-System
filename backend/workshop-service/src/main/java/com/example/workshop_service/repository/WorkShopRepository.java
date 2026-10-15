package com.example.workshop_service.repository;

import com.example.workshop_service.entity.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkShopRepository extends JpaRepository<Workshop, Long> {
    public Workshop findByTitle(String title);
}
