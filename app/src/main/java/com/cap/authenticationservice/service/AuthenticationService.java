package com.cap.authenticationservice.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cap.authenticationservice.dto.MappingResponse;
import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.model.Role;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.RoleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;  
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    private final RestTemplate restTemplate;

    @Value("${api.endpoint.services}")
    private String servicesJson;

    @Value("${api.endpoint.server.bridge.host}")
    private String bridgeHostname;

    @Value("${api.endpoint.server.bridge.port}")
    private String bridgePort;

    public String authenticateUser(UserRequest userRequest) throws AuthenticationException {

        // Create a UsernamePasswordAuthenticationToken with the provided username and password
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword());
        
        // Use the AuthenticationManager to authenticate the user
        Authentication authentication = authenticationManager.authenticate(authRequest);

        var token = tokenService.generateToken((User)authentication.getPrincipal());

        return token;
    }

  
    public User mapToUser(UserRequest userRequest) {

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


    public Map<String, MappingResponse> getServicesMapping() throws Exception{

        Map<String, MappingResponse> res =  new HashMap<>();
    
        HttpHeaders headers = new HttpHeaders();
        //headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);

        //res.put(serviceName, getMapping());
    
        for (Map<String,Object> service : getServices()) {
            try {
            String name = (String) service.get("name");
            String address = (String) service.get("address");
        
            ResponseEntity<MappingResponse> response = 
                restTemplate.exchange(address +  "/auth/getMapping" , HttpMethod.GET, httpEntity, MappingResponse.class);
    
            if(response.hasBody() && response.getBody() != null){
                MappingResponse mapping = response.getBody();

                mapping.setAdress(address);
                res.put(name, mapping);
            }
    
            }
            catch(Exception e) {
                System.out.println(e.getMessage());
                continue;
            } 
        }
        return res;
    }

      public HttpStatus redirect(HttpServletRequest request, HttpServletResponse response, String href) {
        try {
            System.out.println("Redirect request to " + href);
            String token = tokenService.recoverToken(request);

            if (token != null) {
                //response.sendRedirect(address.getHostAddress() + "?token=" + token);
                response.setHeader("Location", href + "?token=" + token);
                return HttpStatus.OK;
            } else {
                return HttpStatus.UNAUTHORIZED;
            }
        } catch (Exception e) {
            System.out.println("Redirect request to " + href + " failed. " + e.getMessage());
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    public String getBridgeHostname(){
        return bridgeHostname;
    }

    public MappingResponse getMapping() throws Exception{

        MappingResponse res = new MappingResponse();

        res.addEndpoint("home","USER"); 
        res.addEndpoint("login");
        res.addEndpoint("admin","ADMIN");

        res.setBridgeAdress("http://" + bridgeHostname + ":" + bridgePort);

        InputStream inputStream = getClass().getResourceAsStream("/static/images/authicon.png");

        if (inputStream  != null)  {
            try {
                BufferedImage image = ImageIO.read(inputStream);

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "png", byteArrayOutputStream);

                byte[] imageBytes = byteArrayOutputStream.toByteArray();
                String base64Encoded = Base64.getEncoder().encodeToString(imageBytes);

                res.setImageData("data:image/png;base64," + base64Encoded);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return res;
      
    }

    private List<Map<String, Object>> getServices() {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(servicesJson, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            return null; 
        }
    }
    
   

}
