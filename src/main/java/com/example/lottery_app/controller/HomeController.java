package com.example.lottery_app.controller;

import com.example.lottery_app.entity.App;
import com.example.lottery_app.entity.BlogPost;
import com.example.lottery_app.service.AppService;
import com.example.lottery_app.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private AppService appService;

    @GetMapping("/")
    public String home(Model model) {
        return "redirect:/index.html";
    }

    @GetMapping("/about")
    public String about(Model model) {
        return "redirect:/about.html";
    }

    @GetMapping("/contact")
    public String contact(Model model) {
        return "redirect:/contact.html";
    }
}