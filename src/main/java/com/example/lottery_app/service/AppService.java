package com.example.lottery_app.service;

import com.example.lottery_app.entity.App;
import com.example.lottery_app.repository.AppRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppService {

    @Autowired
    private AppRepository appRepository;

    public List<App> getAllActiveApps() {
        return appRepository.findByStatusOrderByCreatedAtDesc("active");
    }

    public List<App> getFeaturedApps() {
        return appRepository.findFeaturedApps();
    }

    public Optional<App> getAppById(Long id) {
        return appRepository.findById(id);
    }

    public List<App> getAppsByCategory(String category) {
        return appRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public List<String> getAllCategories() {
        return appRepository.findDistinctCategories();
    }

    public App saveApp(App app) {
        return appRepository.save(app);
    }

    public void deleteApp(Long id) {
        appRepository.deleteById(id);
    }

    public App createApp(String name, String description, String appUrl, String category, String technology) {
        App app = new App(name, description, appUrl, category);
        app.setTechnology(technology);
        return appRepository.save(app);
    }
}