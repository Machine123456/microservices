package com.cap.authenticationservice.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @Value("${api.endpoint.services}")
    private String servicesJson;

    public String authenticateUser(UserRequest userRequest) throws AuthenticationException {

        // Create a UsernamePasswordAuthenticationToken with the provided username and password
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword());
        
        // Use the AuthenticationManager to authenticate the user
        Authentication authentication = authenticationManager.authenticate(authRequest);

        var token = tokenService.generateToken((User)authentication.getPrincipal());

        return token;
    }

    private List<Map<String, Object>> getServices() {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(servicesJson, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            return null; 
        }
    }

  
/* 

    private final RestTemplate restTemplate;

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

        res.addEndpoint("home"); 
        res.addEndpoint("index","USER");
        res.addEndpoint("admin","ADMIN");
        res.addEndpoint("register");

        res.setBridgeAdress("http://" + bridgeHostname + ":" + bridgePort);

        InputStream inputStream = getClass().getResourceAsStream("/static/images/header/authicon.png");

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
*/

    
   

}
