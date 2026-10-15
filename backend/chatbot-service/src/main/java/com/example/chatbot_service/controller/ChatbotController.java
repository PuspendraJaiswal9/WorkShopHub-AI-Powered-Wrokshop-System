package com.example.chatbot_service.controller;

import com.example.chatbot_service.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    // UserId parameter added to track which user is chatting
    @GetMapping("/ask")
    public String ask(@RequestParam Long userId, @RequestParam String message) {
        return chatbotService.getChatResponse(userId, message);
    }
}
