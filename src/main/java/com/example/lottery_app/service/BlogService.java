package com.example.lottery_app.service;

import com.example.lottery_app.entity.BlogPost;
import com.example.lottery_app.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    public List<BlogPost> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    public List<BlogPost> getRecentPosts(int limit) {
        List<BlogPost> allPosts = blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
        return allPosts.stream().limit(limit).toList();
    }

    public Optional<BlogPost> getPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    public List<BlogPost> getPostsByCategory(String category) {
        return blogPostRepository.findByCategoryAndPublishedTrueOrderByCreatedAtDesc(category);
    }

    public List<String> getAllCategories() {
        return blogPostRepository.findDistinctCategories();
    }

    public BlogPost savePost(BlogPost post) {
        return blogPostRepository.save(post);
    }

    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    public BlogPost createPost(String title, String summary, String content, String category, String author) {
        BlogPost post = new BlogPost(title, summary, content, category, author);
        post.setPublished(true);
        return blogPostRepository.save(post);
    }

    public List<BlogPost> searchPosts(String query) {
        return blogPostRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseAndPublishedTrue(query, query);
    }
}