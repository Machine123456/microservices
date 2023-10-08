package com.cap.authenticationservice.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lombok.NoArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping
@NoArgsConstructor
public class ModelController {
    
    @GetMapping("/home")
    public ModelAndView gotoHomePage(Model model){ 
        return new ModelAndView("home");
    }

    @GetMapping("/index")
    public ModelAndView gotoLoginPage(Model model) {
        return new ModelAndView("index");
    }

    @GetMapping("/admin")
    public ModelAndView gotoAdminPage(Model model) { 
        return new ModelAndView("admin");
    }
    
    @GetMapping("/register")
    public ModelAndView gotoRegisterPage(Model model) { 
        return new ModelAndView("register");
    }
}
