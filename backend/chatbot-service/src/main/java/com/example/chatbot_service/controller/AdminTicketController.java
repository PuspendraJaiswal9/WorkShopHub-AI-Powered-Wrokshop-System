package com.example.chatbot_service.controller;

import com.example.chatbot_service.entity.Ticket;
import com.example.chatbot_service.repository.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminTicketController {

    private final TicketRepository ticketRepository;

    public AdminTicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public List<Ticket> getAllTickets(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ticketRepository.findByStatus(status.toUpperCase());
        }
        return ticketRepository.findAll();
    }

    @GetMapping("/stats")
    public java.util.Map<String, Long> getTicketStats() {
        List<Ticket> all = ticketRepository.findAll();
        return java.util.Map.of(
            "total", (long) all.size(),
            "open", all.stream().filter(t -> "OPEN".equals(t.getStatus())).count(),
            "escalated", all.stream().filter(t -> "ESCALATED".equals(t.getStatus())).count(),
            "resolved", all.stream().filter(t -> "RESOLVED".equals(t.getStatus())).count()
        );
    }

    @PutMapping("/{id}/escalate")
    public Ticket escalateTicket(@PathVariable Long id) {
        Optional<Ticket> opt = ticketRepository.findById(id);
        if (opt.isPresent()) {
            Ticket t = opt.get();
            t.setStatus("ESCALATED");
            t.setPriority("HIGH");
            t.setUpdatedAt(java.time.LocalDateTime.now());
            return ticketRepository.save(t);
        }
        return null;
    }

    @PutMapping("/{id}/resolve")
    public Ticket resolveTicket(@PathVariable Long id) {
        Optional<Ticket> opt = ticketRepository.findById(id);
        if (opt.isPresent()) {
            Ticket t = opt.get();
            t.setStatus("RESOLVED");
            t.setUpdatedAt(java.time.LocalDateTime.now());
            return ticketRepository.save(t);
        }
        return null;
    }

    @PutMapping("/{id}/assign")
    public Ticket assignTicket(@PathVariable Long id, @RequestParam String adminName) {
        Optional<Ticket> opt = ticketRepository.findById(id);
        if (opt.isPresent()) {
            Ticket t = opt.get();
            t.setAssignedTo(adminName);
            t.setUpdatedAt(java.time.LocalDateTime.now());
            return ticketRepository.save(t);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
    }
}
