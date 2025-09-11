package com.example.lottery_app.repository;

import com.example.lottery_app.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();
    
    List<BlogPost> findByCategoryAndPublishedTrueOrderByCreatedAtDesc(String category);
    
    @Query("SELECT DISTINCT b.category FROM BlogPost b WHERE b.published = true ORDER BY b.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT b FROM BlogPost b WHERE b.published = true ORDER BY b.createdAt DESC")
    List<BlogPost> findTop3RecentPosts();
    
    List<BlogPost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseAndPublishedTrue(String title, String content);
}