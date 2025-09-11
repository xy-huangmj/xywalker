package com.example.lottery_app.controller;

import com.example.lottery_app.entity.App;
import com.example.lottery_app.service.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/apps")
public class AppController {

    @Autowired
    private AppService appService;

    @GetMapping
    public String appCenter(Model model, @RequestParam(required = false) String category) {
        return "redirect:/apps.html";
    }

    @GetMapping("/app/{id}")
    public String viewApp(@PathVariable Long id, Model model) {
        Optional<App> app = appService.getAppById(id);
        if (app.isPresent()) {
            model.addAttribute("app", app.get());
            return "app-detail";
        }
        return "redirect:/apps";
    }

    // API endpoints for AJAX requests
    @GetMapping("/api/apps")
    @ResponseBody
    public List<App> getAllApps() {
        return appService.getAllActiveApps();
    }

    @GetMapping("/api/apps/featured")
    @ResponseBody
    public List<App> getFeaturedApps() {
        return appService.getFeaturedApps();
    }

    @GetMapping("/api/apps/{id}")
    @ResponseBody
    public ResponseEntity<App> getApp(@PathVariable Long id) {
        Optional<App> app = appService.getAppById(id);
        return app.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/apps")
    @ResponseBody
    public App createApp(@RequestBody App app) {
        return appService.saveApp(app);
    }
}