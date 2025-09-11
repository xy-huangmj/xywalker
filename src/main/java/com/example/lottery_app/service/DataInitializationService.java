package com.example.lottery_app.service;

import com.example.lottery_app.entity.App;
import com.example.lottery_app.entity.BlogPost;
import com.example.lottery_app.repository.AppRepository;
import com.example.lottery_app.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private AppRepository appRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeSampleData();
    }

    private void initializeSampleData() {
        // Initialize blog posts if empty
        if (blogPostRepository.count() == 0) {
            createSampleBlogPosts();
        }

        // Initialize apps if empty
        if (appRepository.count() == 0) {
            createSampleApps();
        }
    }

    private void createSampleBlogPosts() {
        BlogPost post1 = new BlogPost();
        post1.setTitle("欢迎来到我的个人博客");
        post1.setSummary("这是我的第一篇博客文章，分享我的学习历程和技术见解。");
        post1.setContent("# 欢迎来到我的个人博客\n\n这是我的第一篇博客文章。在这里，我将分享我的学习历程、技术见解和开发经验。\n\n## 关于这个博客\n\n这个博客使用Spring Boot和现代Web技术构建，旨在创造一个简洁、优雅的技术分享平台。\n\n## 我的目标\n\n- 分享技术知识和经验\n- 记录学习历程\n- 展示个人项目\n- 与其他开发者交流");
        post1.setCategory("日常分享");
        post1.setAuthor("博主");
        post1.setPublished(true);
        post1.setTags("博客,分享,技术");
        post1.setCreatedAt(LocalDateTime.now().minusDays(5));
        blogPostRepository.save(post1);

        BlogPost post2 = new BlogPost();
        post2.setTitle("Spring Boot 开发实践心得");
        post2.setSummary("分享在Spring Boot开发过程中的一些实用技巧和最佳实践。");
        post2.setContent("# Spring Boot 开发实践心得\n\nSpring Boot作为Java生态系统中最受欢迎的框架之一，大大简化了Spring应用的开发和部署。\n\n## 核心特性\n\n- 自动配置\n- 起步依赖\n- 内嵌服务器\n- 生产就绪特性\n\n## 开发建议\n\n1. 合理使用注解\n2. 注意配置文件的层次结构\n3. 善用Spring Boot Actuator\n4. 编写单元测试");
        post2.setCategory("技术分享");
        post2.setAuthor("博主");
        post2.setPublished(true);
        post2.setTags("Spring Boot,Java,后端开发");
        post2.setCreatedAt(LocalDateTime.now().minusDays(2));
        blogPostRepository.save(post2);

        BlogPost post3 = new BlogPost();
        post3.setTitle("现代前端开发技术栈探索");
        post3.setSummary("探讨现代前端开发的技术选择和最佳实践。");
        post3.setContent("# 现代前端开发技术栈探索\n\n前端开发技术日新月异，如何选择合适的技术栈成为开发者的重要课题。\n\n## 主流框架对比\n\n### Vue.js\n- 渐进式框架\n- 易学易用\n- 生态完善\n\n### React\n- 组件化思维\n- 虚拟DOM\n- 庞大社区\n\n### Angular\n- 企业级解决方案\n- TypeScript支持\n- 完整生态");
        post3.setCategory("前端技术");
        post3.setAuthor("博主");
        post3.setPublished(true);
        post3.setTags("前端,Vue.js,React,Angular");
        post3.setCreatedAt(LocalDateTime.now().minusHours(6));
        blogPostRepository.save(post3);
    }

    private void createSampleApps() {
        App app1 = new App();
        app1.setName("个人博客系统");
        app1.setDescription("基于Spring Boot的个人博客系统，支持文章管理、分类标签等功能。");
        app1.setAppUrl("/");
        app1.setGithubUrl("#");
        app1.setCategory("Web应用");
        app1.setTechnology("Spring Boot");
        app1.setFeatured(true);
        app1.setStatus("active");
        appRepository.save(app1);

        App app2 = new App();
        app2.setName("在线工具集合");
        app2.setDescription("集合各种实用的在线工具，包括文本处理、格式转换等功能。");
        app2.setAppUrl("#");
        app2.setGithubUrl("#");
        app2.setCategory("工具类");
        app2.setTechnology("Vue.js");
        app2.setFeatured(true);
        app2.setStatus("active");
        appRepository.save(app2);

        App app3 = new App();
        app3.setName("API文档生成器");
        app3.setDescription("自动生成优雅的API文档，支持多种格式导出。");
        app3.setAppUrl("#");
        app3.setGithubUrl("#");
        app3.setCategory("开发工具");
        app3.setTechnology("Node.js");
        app3.setFeatured(true);
        app3.setStatus("active");
        appRepository.save(app3);

        App app4 = new App();
        app4.setName("数据可视化平台");
        app4.setDescription("强大的数据可视化平台，支持多种图表类型和自定义配置。");
        app4.setAppUrl("#");
        app4.setGithubUrl("#");
        app4.setCategory("数据分析");
        app4.setTechnology("React");
        app4.setFeatured(false);
        app4.setStatus("active");
        appRepository.save(app4);
    }
}