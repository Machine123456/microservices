package com.cap.productservice.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.cap.productservice.dto.MappingResponse;
import com.cap.productservice.dto.UserResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final RestTemplate restTemplate;
    
    @Value("${api.endpoint.auth-service.adress}")
    private String authServiceAdress;

    @Value("${api.endpoint.auth-service.reg-name}")
    private String authServiceRegName;

    @Value("${api.endpoint.server.bridge.port}")
    private String bridgePort;

    /* cashing vars */
    private String bridgeHostname;
    private MappingResponse authServiceMapping; 

    public ResponseEntity<UserResponse> getUserFromToken(HttpServletRequest request) {
        return getUserFromToken(recoverToken(request));
    }

    public ResponseEntity<UserResponse> getUserFromToken(String token) {
        return sendRequest(
            "/auth/getUserFromToken",
            HttpMethod.GET,
            token, 
            UserResponse.class
        );
    }

    public ResponseEntity<Map<String, MappingResponse>> getServicesMapping(){
        var res = sendRequest(
            "/auth/getServicesMapping", 
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<Map<String, MappingResponse>>() {}
        );

        var map = getAuthServiceMapping(res);

        if(map != null)
            authServiceMapping = map;

        return res;
    }

    public ResponseEntity<String> logout(HttpServletRequest request) {
        return sendRequest(
            "/auth/logout",
            HttpMethod.GET,
            recoverToken(request),
            String.class
        );
    }

    private String getBridgeHostname(){
        ResponseEntity<String> res = sendRequest(
            "/auth/getBridgeHostname",
            HttpMethod.GET,
            null,
            String.class
        );
        //wait
        return getObjectFromOkResponse(res);
    }

    private MappingResponse getAuthServiceMapping(){
        return getAuthServiceMapping(getServicesMapping());
    }

    private MappingResponse getAuthServiceMapping(ResponseEntity<Map<String, MappingResponse>> res){
        
        Map<String, MappingResponse> servicesMapping = getObjectFromOkResponse(res);
        if(servicesMapping != null) 
            return servicesMapping.get(authServiceRegName);
            
        return null;
    }

    private <T> T getObjectFromOkResponse(ResponseEntity<T> res){

        if(res == null)  {
            System.out.println("Could not retrive body from null response");
            return null;
        }

        if(res.getStatusCode() != HttpStatus.OK) {
            System.out.println("Could not retrive body from " + res.getStatusCode() + " response");
            return null;
        }
        
        return res.getBody();
    }


    public HttpStatus redirect(HttpServletRequest request, HttpServletResponse response, String href) {
        try {
            System.out.println("Redirect request to " + href);
            String token = recoverToken(request);

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


    public String recoverToken(HttpServletRequest request) {
      
        var tokenParam = request.getParameter("token");
        if(tokenParam != null)
            try {
                return URLDecoder.decode(tokenParam, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                System.out.println("Error decoding the token parameter: " + e.getMessage());
            }

        var authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            String token = authHeader.replace("Bearer", "").trim();
            return token;
        }

        // recover token from this domain
        var cookies = request.getCookies();
        if(cookies != null) {
            for (var cookie : cookies)
                if(cookie.getName().equals("token"))
                    return cookie.getValue();
        }

        return null;
    }

    
    public Cookie generateTokenCookie(String token){
        return token == null ? generateEmptyTokenCookie() : genTokenCookie(token ,(int) TimeUnit.HOURS.toSeconds(1));
    }

    public Cookie generateEmptyTokenCookie() { return genTokenCookie("",0) ; };

    private Cookie genTokenCookie(String token,int maxAge){
         Cookie cookie = new Cookie("token", token);
                cookie.setMaxAge(maxAge); // Set cookie expiration time as needed
                cookie.setPath("/"); // Set the cookie path as needed
                cookie.setHttpOnly(true);

        return cookie;
    }

    public MappingResponse getMapping() throws Exception{



        MappingResponse res = new MappingResponse();

        res.addEndpoint("home","USER"); 
        res.addEndpoint("admin","ADMIN");

        InputStream inputStream = getClass().getResourceAsStream("/static/images/producticon.png");

        if (inputStream  != null)  {
            try {
                BufferedImage image = ImageIO.read(inputStream);

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "png", byteArrayOutputStream);

                byte[] imageBytes = byteArrayOutputStream.toByteArray();
                String base64Encoded = Base64.getEncoder().encodeToString(imageBytes);

                res.setImageData("data:image/png;base64," + base64Encoded);

            } catch (IOException e) {
               
            }
        }
        
        String bridgeAdress = getBridgeAdress();

        System.out.println("Sending mapp with bridge: " + bridgeAdress);
        if(bridgeAdress != null)
            res.setBridgeAdress(bridgeAdress);

        return res;
      
    }

    public String getBridgeAdress(){

        if(bridgeHostname == null || bridgeHostname.isBlank())   
            bridgeHostname = getBridgeHostname();

        if(bridgeHostname != null && !bridgeHostname.isBlank())
            return "http://" + bridgeHostname + ":" + bridgePort;

        return null;
        
    }

    public MappingResponse getAuthMapping(){

        if(authServiceMapping == null)     
            authServiceMapping = getAuthServiceMapping();
            
        if(authServiceMapping != null)
            return authServiceMapping;

        return null;
    }

    private <T> ResponseEntity<T> sendRequest(String path, HttpMethod method, String token, Class<T> responseType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            if (token != null && !token.isBlank()) {
                headers.setBearerAuth(token);
            }

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<T> response = restTemplate.exchange(
                authServiceAdress + path,
                method,
                entity,
                responseType                    
            );

            return response;
        } catch (HttpClientErrorException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

      private <T> ResponseEntity<T> sendRequest(String path, HttpMethod method, String token, ParameterizedTypeReference<T> responseType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            if (token != null && !token.isBlank()) {
                headers.setBearerAuth(token);
            }

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<T> response = restTemplate.exchange(
                authServiceAdress + path,
                method,
                entity,
                responseType                    
            );

            return response;
        } catch (HttpClientErrorException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}