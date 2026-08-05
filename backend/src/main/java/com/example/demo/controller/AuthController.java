package com.example.demo.controller;

import com.example.demo.models.Users;
import com.example.demo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Users> userOpt = usersRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", "dummy-jwt-token-for-" + user.getUserId());
                response.put("user", user);
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        Optional<Users> existing = usersRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email already exists"));
        }
        Users savedUser = usersRepository.save(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-jwt-token-for-" + savedUser.getUserId());
        response.put("user", savedUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer dummy-jwt-token-for-")) {
            try {
                Long userId = Long.parseLong(authHeader.replace("Bearer dummy-jwt-token-for-", ""));
                Optional<Users> user = usersRepository.findById(userId);
                if (user.isPresent()) {
                    return ResponseEntity.ok(user.get());
                }
            } catch (Exception e) {
                // Ignore and fall through to unauthorized
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().build();
    }
}
