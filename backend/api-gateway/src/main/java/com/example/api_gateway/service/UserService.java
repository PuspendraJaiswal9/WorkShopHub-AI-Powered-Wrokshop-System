package com.example.api_gateway.service;

import com.example.api_gateway.dto.RegisterDTO;
import com.example.api_gateway.entity.User;
import com.example.api_gateway.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Fixed: Directly return the roles list
    public List<String> getUserRoles(User user) {
        return user.getRoles();  // No need for split()
    }

    public User createUser(RegisterDTO registerDTO) {
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail());
        user.setRoles(Collections.singletonList("ROLE_USER"));
        return userRepository.save(user);
    }
}
