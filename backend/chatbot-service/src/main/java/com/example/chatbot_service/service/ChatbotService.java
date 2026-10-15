package com.example.chatbot_service.service;

import com.example.chatbot_service.dto.Booking;
import com.example.chatbot_service.dto.Fare;
import com.example.chatbot_service.dto.Workshop;
import com.example.chatbot_service.entity.ChatHistory;
import com.example.chatbot_service.entity.Ticket;
import com.example.chatbot_service.entity.Users;
import com.example.chatbot_service.feingClient.BookingClient;
import com.example.chatbot_service.feingClient.FareClient;
import com.example.chatbot_service.feingClient.WorkshopClient;
import com.example.chatbot_service.repository.ChatHistoryRepository;
import com.example.chatbot_service.repository.TicketRepository;
import com.example.chatbot_service.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatbotService {

    @Value("${azure.openai.key}")
    private String apiKey;

    private final AzureOpenAIClient azureClient;
    private final String deploymentName;

    private final WorkshopClient workshopClient;
    private final FareClient fareClient;
    private final BookingClient bookingClient;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    public ChatbotService(AzureOpenAIClient azureClient,
                          @Value("${azure.openai.deployment-name}") String deploymentName,
                          WorkshopClient workshopClient,
                          FareClient fareClient,
                          BookingClient bookingClient) {
        this.azureClient = azureClient;
        this.deploymentName = deploymentName;
        this.workshopClient = workshopClient;
        this.fareClient = fareClient;
        this.bookingClient = bookingClient;
    }

    public String getChatResponse(Long userId, String userMessage) {
        Users user = usersRepository.findById(userId).orElseGet(() -> {
            Users newUser = new Users();
            newUser.setName("User" + userId);
            newUser.setEmail("user" + userId + "@example.com");
            return usersRepository.save(newUser);
        });

        String message = userMessage.toLowerCase();
        String response = "";

        // ✅ Booking request
        if (message.contains("book") && (message.contains("workshop") || message.contains("want to book"))) {
            response = "🎫 To book a workshop, please follow these steps:\n\n" +
                    "1️⃣ Go to the 'Bookings' section\n" +
                    "2️⃣ Click on 'New Booking'\n" +
                    "3️⃣ Enter your details:\n" +
                    "   • Name\n" +
                    "   • Workshop ID\n" +
                    "   • Number of tickets\n" +
                    "4️⃣ Complete the payment\n\n" +
                    "💡 Tip: Type 'list workshops' to see all available workshops first!";
        }

        // ✅ Greeting
        else if (message.contains("hello") || message.contains("hi") || message.contains("hey") || message.contains("hy")) {
            response = "👋 Hello! Welcome to Workshop Hub!\n\n" +
                    "I can help you with:\n" +
                    "🎪 Browse available workshops\n" +
                    "💰 Check workshop pricing\n" +
                    "📅 View your bookings\n" +
                    "🎫 Raise support tickets\n\n" +
                    "What would you like to know?";
        }

        // ✅ Workshop list
        else if (message.contains("list") || message.contains("all workshop") || message.contains("available workshop")) {
            try {
                List<Workshop> workshops = workshopClient.getAllWorkshops();
                if (workshops != null && !workshops.isEmpty()) {
                    StringBuilder sb = new StringBuilder("📋 Available Workshops:\n\n");
                    for (Workshop w : workshops) {
                        sb.append("🎪 ").append(w.getTitle()).append("\n")
                          .append("   ID: ").append(w.getWorkshopId())
                          .append(" | Date: ").append(w.getDate())
                          .append(" | Venue: ").append(w.getVenue())
                          .append("\n   Seats: ").append(w.getAvailableSeats())
                          .append("\n\n");
                    }
                    sb.append("Type 'workshop <ID>' for more details!");
                    response = sb.toString();
                } else {
                    response = "No workshops available at the moment.";
                }
            } catch (Exception e) {
                response = "Unable to fetch workshops. Please try again later.";
            }
        }

        // ✅ FAQ handling
        else if (message.contains("faq") || message.contains("how to") || message.contains("help")) {
            response = "❓ Frequently Asked Questions:\n\n" +
                    "📌 How to book a workshop?\n" +
                    "   Go to Bookings → New Booking → Enter details\n\n" +
                    "📌 How to check workshop details?\n" +
                    "   Type 'list workshops' or 'workshop <ID>'\n\n" +
                    "📌 How to check fare?\n" +
                    "   Type 'fare <workshop ID>'\n\n" +
                    "📌 Need help?\n" +
                    "   Type 'problem' or 'issue' to create a support ticket";
        }

        // ✅ Ticket status check (priority upar rakho)
        else if ((message.contains("ticket") && message.contains("status")) || message.contains("check ticket")) {
            List<Ticket> tickets = ticketRepository.findByUsername(user.getName());
            if (tickets.isEmpty()) {
                response = "You don’t have any active tickets right now.";
            } else {
                Ticket last = tickets.get(tickets.size() - 1);
                response = "Your last ticket (ID: " + last.getId() + ") is currently " + last.getStatus() + ".";
            }
        }

        // ✅ Live agent request
        else if (message.contains("human") || message.contains("live agent") || message.contains("talk to agent")) {
            Ticket ticket = new Ticket();
            ticket.setUsername(user.getName());
            ticket.setSubject("Live Agent Request");
            ticket.setDescription(userMessage);
            ticket.setStatus("OPEN");
            ticket.setPriority("HIGH");
            ticket.setCreatedAt(LocalDateTime.now());
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
            response = "Connecting you to a live support agent... Ticket ID: " + ticket.getId();
        }

        // ✅ Ticket creation only for real problems (exclude status check)
        else if ((message.contains("problem") || message.contains("issue") || message.contains("error") || message.contains("not working"))
                && !message.contains("status")) {
            Ticket ticket = new Ticket();
            ticket.setUsername(user.getName());
            ticket.setSubject("Support Issue");
            ticket.setDescription(userMessage);
            ticket.setStatus("OPEN");
            ticket.setPriority("MEDIUM");
            ticket.setCreatedAt(LocalDateTime.now());
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
            response = "I understand you're facing an issue. A support ticket has been created successfully! Ticket ID: " + ticket.getId() + ". Our team will get back to you soon.";
        }

        // ✅ Workshop info
        else if (message.contains("workshop") && message.matches(".*\\d+.*")) {
            try {
                Long workshopId = Long.parseLong(message.replaceAll("[^0-9]", ""));
                Workshop workshop = workshopClient.getWorkshopById(workshopId);
                if (workshop != null) {
                    response = "🎪 Workshop Details:\n\n" +
                            "📌 Title: " + workshop.getTitle() + "\n" +
                            "📅 Date: " + workshop.getDate() + "\n" +
                            "🕐 Time: " + workshop.getStartTime() + " - " + workshop.getEndTime() + "\n" +
                            "📍 Venue: " + workshop.getVenue() + "\n" +
                            "💺 Available Seats: " + workshop.getAvailableSeats() + "\n" +
                            "📝 Description: " + workshop.getDescription() + "\n\n" +
                            "Type 'fare " + workshopId + "' to check pricing!";
                } else {
                    response = "Workshop not found. Type 'list workshops' to see all available workshops.";
                }
            } catch (Exception e) {
                response = "Please provide a valid workshop ID. Example: 'workshop 1'";
            }
        }

        // ✅ General workshop query
        else if (message.contains("workshop")) {
            response = "🎪 Workshop Information:\n\n" +
                    "To see all workshops, type: 'list workshops'\n" +
                    "To see specific workshop, type: 'workshop <ID>'\n" +
                    "Example: 'workshop 2'\n\n" +
                    "Need help? Type 'help'";
        }

        // ✅ Price query with workshop mention
        else if ((message.contains("price") || message.contains("cost") || message.contains("fare")) && message.contains("workshop")) {
            try {
                Long fareId = Long.parseLong(message.replaceAll("[^0-9]", ""));
                Fare fare = fareClient.getFareById(fareId);
                if (fare != null) {
                    response = "💰 Pricing Information:\n\n" +
                            "Workshop ID: " + fareId + "\n" +
                            "Price per ticket: ₹" + fare.getPrice() + "\n\n" +
                            "Ready to book? Go to Bookings section!";
                } else {
                    response = "Fare information not available for this workshop.";
                }
            } catch (Exception e) {
                response = "Please provide a valid workshop ID. Example: 'price of workshop 1'";
            }
        }

        // ✅ Fare info
        else if (message.contains("fare") || message.contains("price") || message.contains("cost")) {
            try {
                Long fareId = Long.parseLong(message.replaceAll("[^0-9]", ""));
                Fare fare = fareClient.getFareById(fareId);
                if (fare != null) {
                    response = "💰 Pricing Information:\n\n" +
                            "Workshop ID: " + fareId + "\n" +
                            "Price per ticket: ₹" + fare.getPrice() + "\n\n" +
                            "Ready to book? Go to Bookings section!";
                } else {
                    response = "Fare information not available for this workshop.";
                }
            } catch (Exception e) {
                response = "Please provide a valid workshop ID. Example: 'fare 1'";
            }
        }

        // ✅ Booking info
        else if (message.contains("booking") || message.contains("my booking")) {
            try {
                Long bookingId = Long.parseLong(message.replaceAll("[^0-9]", ""));
                Optional<Booking> bookingOpt = bookingClient.getBookingById(bookingId);
                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();
                    response = "📅 Booking Details:\n\n" +
                            "🎫 Booking ID: #" + booking.getBookingId() + "\n" +
                            "👤 Name: " + booking.getName() + "\n" +
                            "🎪 Workshop: " + booking.getTitle() + "\n" +
                            "📍 Venue: " + booking.getVenue() + "\n" +
                            "📅 Date: " + booking.getDate() + "\n" +
                            "🎟️ Tickets: " + booking.getNumberOfBooking() + "\n" +
                            "💰 Amount: ₹" + booking.getAmount() + "\n" +
                            "✅ Status: " + booking.getStatus();
                } else {
                    response = "Booking not found. Please check your booking ID.";
                }
            } catch (Exception e) {
                response = "Please provide a valid booking ID. Example: 'booking 1'";
            }
        }

        // ✅ AI fallback
        else {
            Map<String, Object> requestBody = Map.of(
                    "messages", List.of(Map.of("role", "user", "content", userMessage)),
                    "max_tokens", 200,
                    "temperature", 0.7
            );
            Map<String, Object> aiResponse = azureClient.sendRequest(deploymentName, requestBody, apiKey);
            if (aiResponse != null && aiResponse.containsKey("choices")) {
                Map firstChoice = ((List<Map>) aiResponse.get("choices")).get(0);
                Map msg = (Map) firstChoice.get("message");
                response = msg.get("content").toString();
            } else {
                response = "Sorry, I couldn’t understand your message.";
            }
        }

        ChatHistory chat = new ChatHistory();
        chat.setUserId(user.getId());
        chat.setMessage(userMessage);
        chat.setResponse(response);
        chat.setCreatedAt(LocalDateTime.now());
        chatHistoryRepository.save(chat);

        return response;
    }


}
