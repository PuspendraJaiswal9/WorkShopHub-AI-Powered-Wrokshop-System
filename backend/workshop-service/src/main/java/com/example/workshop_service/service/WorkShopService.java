package com.example.workshop_service.service;

import com.example.workshop_service.entity.Workshop;
import com.example.workshop_service.exception.WorkShopAllreadyHaveAddedException;
import com.example.workshop_service.exception.WorkShopNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface WorkShopService {
     Workshop addWorkShop(Workshop workshop) throws WorkShopAllreadyHaveAddedException;
     Workshop updateWorkShop(Long workshopId , Workshop workshop) throws WorkShopNotFoundException;
     String deleteWorkShop(Long workshopId) throws WorkShopNotFoundException;
     List<Workshop> getAll();
     Workshop getById(Long workshopId) throws WorkShopNotFoundException;
}
