package com.example.workshop_service.service;

import com.example.workshop_service.entity.Workshop;
import com.example.workshop_service.exception.WorkShopAllreadyHaveAddedException;
import com.example.workshop_service.exception.WorkShopNotFoundException;
import com.example.workshop_service.repository.WorkShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkShopServiceImpl implements WorkShopService{
    @Autowired
    public WorkShopRepository workShopRepository;

    @Override
    public Workshop addWorkShop(Workshop workshop) throws WorkShopAllreadyHaveAddedException {
        String title = workshop.getTitle();
        // check if workshop already exists
        Workshop existing = workShopRepository.findByTitle(title);
        if (existing != null) {
            throw new WorkShopAllreadyHaveAddedException("Workshop is already added: " + title);
        }
        return workShopRepository.save(workshop);
    }

    @Override
    public Workshop updateWorkShop(Long workshopId , Workshop workshop) throws WorkShopNotFoundException {
        Optional<Workshop> getid = workShopRepository.findById(workshopId);
        if(getid.isPresent()){
            Workshop oldworkshop = getid.get();
            oldworkshop.setTitle(workshop.getTitle());
            oldworkshop.setCapacity(workshop.getCapacity());
            oldworkshop.setDate(workshop.getDate());
            oldworkshop.setAvailableSeats(workshop.getAvailableSeats());
            oldworkshop.setDescription(workshop.getDescription());
            oldworkshop.setCreatedBy(workshop.getCreatedBy());
            oldworkshop.setAmount(workshop.getAmount());
            oldworkshop.setEndTime(workshop.getEndTime());
            oldworkshop.setVenue(workshop.getVenue());
            oldworkshop.setStartTime(workshop.getStartTime());
            return workShopRepository.save(oldworkshop);
        } else {
            throw new WorkShopNotFoundException("WorkShop Not available");
        }
    }


    @Override
    public String deleteWorkShop(Long workshopId) throws WorkShopNotFoundException{
      Optional<Workshop>getId=workShopRepository.findById(workshopId);
      if(getId.isPresent()){
          workShopRepository.deleteById(workshopId);
          return "WorkShop Deleted SuccessFully";
      }else{
          throw new WorkShopNotFoundException("WorkShop Not available");
      }
    }

    @Override
    public List<Workshop> getAll(){
       List<Workshop>AllWorkshop=workShopRepository.findAll();
       return AllWorkshop;
    }

    @Override
    public Workshop getById(Long workshopId) throws WorkShopNotFoundException {
        Optional<Workshop> getId = workShopRepository.findById(workshopId);
        if(getId.isPresent()){
            return getId.get();
        } else {
            throw new WorkShopNotFoundException("WorkShop Not available");
        }
    }

}
