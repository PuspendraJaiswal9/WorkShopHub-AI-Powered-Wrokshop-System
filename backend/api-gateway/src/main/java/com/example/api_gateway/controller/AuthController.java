package com.example.api_gateway.controller;

import com.example.api_gateway.dto.LoginDTO;
import com.example.api_gateway.dto.RegisterDTO;
import com.example.api_gateway.entity.User;
import com.example.api_gateway.security.JwtUtil;
import com.example.api_gateway.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtUtil jwtUtil, UserService userService, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<Map<String, String>>> login(@RequestBody LoginDTO loginDTO) {
        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();

        return Mono.fromCallable(() -> userService.findByUsername(username))
                .flatMap(optionalUser -> {
                    if (optionalUser.isPresent()) {
                        User user = optionalUser.get();
                        if (passwordEncoder.matches(password, user.getPassword())) {
                            String token = jwtUtil.generateToken(username, userService.getUserRoles(user));
                            return Mono.just(ResponseEntity.ok(Map.of(
                                    "token", token,
                                    "role", user.getRoles() != null && !user.getRoles().isEmpty() ? user.getRoles().get(0) : "ROLE_USER"
                            )));

                        }
                    }
                    return Mono.just(ResponseEntity.<Map<String, String>>badRequest().build());
                });
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<User>> register(@RequestBody RegisterDTO registerDTO) {
        return Mono.fromCallable(() -> {
            User user = userService.createUser(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        }).onErrorResume(e -> {
            System.err.println("Registration error: " + e.getMessage());
            return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
        });
    }

    @GetMapping("/test")
    public Mono<ResponseEntity<String>> test() {
        return Mono.just(ResponseEntity.ok("API Gateway is working!"));
    }
}