package com.cap.authenticationservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cap.authenticationservice.dto.UserResponse;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers(){
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
        return responses;
    }

    public UserResponse findUserByUsername(String uname) throws IllegalArgumentException {
        var user = userRepository.findByUsername(uname).orElseThrow(() -> new IllegalArgumentException("Could not found the token retrieved username in the database"));
        return mapToUserResponse(user);
    }

    public UserResponse findFirstByEmailOrUsername(String uname, String email) {

        var checkUser = userRepository.findFirstByEmailOrUsername(email, uname);

        if(checkUser.isPresent())
            return mapToUserResponse(checkUser.get());
        
        return null;
    }

    public void saveUser(User user) throws IllegalArgumentException{
        var response = userRepository.findFirstByEmailOrUsername(user.getEmail(), user.getUsername());
        
        if(response != null) 
            throw new IllegalArgumentException("User with the same email or username already exists.");
        
        userRepository.save(user);

        return;
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


}
