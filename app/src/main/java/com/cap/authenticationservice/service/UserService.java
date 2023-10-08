package com.cap.authenticationservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.dto.UserResponse;
import com.cap.authenticationservice.model.Role;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.RoleRepository;
import com.cap.authenticationservice.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;  

    public List<UserResponse> getAllUsers(){
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
        return responses;
    }

    public UserResponse findUserByUsername(String uname) throws IllegalArgumentException {
        var user = userRepository.findByUsername(uname).orElseThrow(() -> new IllegalArgumentException("User not found with username: " + uname));
        return mapToUserResponse(user);
    }

    public void saveUser(UserRequest userRequest) throws IllegalArgumentException{
        var user = mapToUser(userRequest);
        saveUser(user);
    }

    public void saveUser(User user) throws IllegalArgumentException{
        if(userRepository.findFirstByEmailOrUsername(user.getEmail(), user.getUsername()).isPresent())
            throw new IllegalArgumentException("User with the same email or username already exists.");
    
        userRepository.save(user);
    }

    public Map<String,Map<String,String>> getUserFieldsRequirements(){
        return new HashMap<String,Map<String, String>>() {{ 
                put("username", User.USERNAME_PATTERNS);           
                put("email", User.EMAIL_PATTERNS);
                put("password", User.PASSWORD_PATTERNS);
            }};
    }

    public UserResponse mapToUserResponse(User user) {

        List<String> authorities = user.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());

        UserResponse userResponse = UserResponse.builder()
        .username(user.getUsername())
        .email(user.getEmail())
        .authorities(authorities.toArray(String[]::new))
        .build();
        return userResponse;
    }

    public User mapToUser(UserRequest userRequest) {

        validateFields(userRequest.getUsername(),userRequest.getEmail(),userRequest.getPassword());

        Role userRole = roleRepository.findByAuthority("ROLE_USER").orElseThrow(() -> new IllegalArgumentException("Roles are not properly fetched in the database"));
        // Check requested authorities TODO
        User user = User.builder()
        .username(userRequest.getUsername())
        .email(userRequest.getEmail())
        .password(passwordEncoder.encode(userRequest.getPassword()))
        .authorities(Set.of(userRole))
        .build();
        
        return user;
    }


    private void validateFields(String username, String email, String password) {
        List<String> errorMessages = new ArrayList<>();

        errorMessages.addAll(validateFieldWithPattern(username, User.USERNAME_PATTERNS));
        errorMessages.addAll(validateFieldWithPattern(email, User.EMAIL_PATTERNS));
        errorMessages.addAll(validateFieldWithPattern(password, User.PASSWORD_PATTERNS));

        if (!errorMessages.isEmpty()) {
            throw new IllegalArgumentException("Invalid field(s):\n- " + String.join("\n- ", errorMessages));
        }
    }

    private List<String> validateFieldWithPattern(String field, Map<String, String> patterns) {


      List<String> errorMessages = new ArrayList<>();

        for (Map.Entry<String, String> entry : patterns.entrySet()) {
            String pattern = entry.getKey();
            String errorMessage = entry.getValue();

            if (!field.matches(pattern)) {
                errorMessages.add(errorMessage);
            }
        }

      return errorMessages;
    }
}
