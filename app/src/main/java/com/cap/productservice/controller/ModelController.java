package com.cap.productservice.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ModelController {

    @GetMapping("/home")
    public ModelAndView gotoHomePage(Model model) { 
        return new ModelAndView("home");
    }

    @GetMapping("/admin")
    public ModelAndView gotoAdminPage(Model model) { 
        return new ModelAndView("admin");
    }

}
