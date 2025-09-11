package com.example.lottery_app.repository;

import com.example.lottery_app.entity.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppRepository extends JpaRepository<App, Long> {
    
    List<App> findByStatusOrderByCreatedAtDesc(String status);
    
    List<App> findByCategoryOrderByCreatedAtDesc(String category);
    
    List<App> findByFeaturedTrueAndStatusOrderByCreatedAtDesc(String status);
    
    @Query("SELECT DISTINCT a.category FROM App a WHERE a.status = 'active' ORDER BY a.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT a FROM App a WHERE a.featured = true AND a.status = 'active' ORDER BY a.createdAt DESC")
    List<App> findFeaturedApps();
}