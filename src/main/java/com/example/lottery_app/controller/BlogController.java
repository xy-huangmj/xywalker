package com.example.lottery_app.controller;

import com.example.lottery_app.entity.BlogPost;
import com.example.lottery_app.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public String blogCenter(Model model, @RequestParam(required = false) String category) {
        return "redirect:/blog.html";
    }

    @GetMapping("/post/{id}")
    public String viewPost(@PathVariable Long id, Model model) {
        Optional<BlogPost> post = blogService.getPostById(id);
        if (post.isPresent() && post.get().isPublished()) {
            model.addAttribute("post", post.get());
            return "blog-post";
        }
        return "redirect:/blog";
    }

    @GetMapping("/search")
    public String searchPosts(@RequestParam String query, Model model) {
        List<BlogPost> posts = blogService.searchPosts(query);
        model.addAttribute("posts", posts);
        model.addAttribute("query", query);
        model.addAttribute("categories", blogService.getAllCategories());
        return "blog-center";
    }

    // API endpoints for AJAX requests
    @GetMapping("/api/posts")
    @ResponseBody
    public List<BlogPost> getAllPosts() {
        return blogService.getAllPublishedPosts();
    }

    @GetMapping("/api/posts/{id}")
    @ResponseBody
    public ResponseEntity<BlogPost> getPost(@PathVariable Long id) {
        Optional<BlogPost> post = blogService.getPostById(id);
        return post.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/posts")
    @ResponseBody
    public BlogPost createPost(@RequestBody BlogPost post) {
        return blogService.savePost(post);
    }
}