// ===== Global Variables =====
let currentSection = 'home';
let isLoading = true;
let currentTheme = 'light';

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const loadingScreen = document.getElementById('loading-screen');
const backToTop = document.getElementById('back-to-top');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Initialize theme
    initializeTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize animations
    initializeAnimations();
    
    // Load initial content
    loadBlogPosts();
    loadProjects();
    
    console.log('Personal Blog initialized successfully!');
}

// ===== Loading Screen =====
function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    isLoading = false;
    
    // Show initial section
    showSection('home');
}

// ===== Theme Management =====
function initializeTheme() {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', handleNavClick);
    });
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Resize events for responsive behavior
    window.addEventListener('resize', handleResize);
}

function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function handleNavClick(e) {
    e.preventDefault();
    
    const target = e.currentTarget.getAttribute('data-section') || 
                   e.currentTarget.getAttribute('href').substring(1);
    
    if (target && target !== currentSection) {
        showSection(target);
        
        // Close mobile menu if open
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Animate skill bars when about section is visible
    animateSkillBars();
}

function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// ===== Navigation =====
function initializeNavigation() {
    // Set initial active nav link
    updateActiveNavLink('home');
}

function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update navigation
        updateActiveNavLink(sectionId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger section-specific animations
        setTimeout(() => {
            triggerSectionAnimations(sectionId);
        }, 100);
    }
}

function updateActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Animations =====
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.stat-card, .skill-category, .blog-card, .project-card, .contact-item');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

function triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const animatedElements = section.querySelectorAll('.stat-card, .skill-category, .blog-card, .project-card, .contact-item, .timeline-item');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, index * 100);
    });
    
    // Special animations for specific sections
    if (sectionId === 'about') {
        animateSkillBars();
        animateCounters();
    }
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const aboutSection = document.getElementById('about');
    
    if (!aboutSection || !aboutSection.classList.contains('active')) return;
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        if (progress && bar.style.width === '0px' || bar.style.width === '') {
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 200);
        }
    });
}

function animateCounters() {
    const counters = [
        { element: document.getElementById('blog-count'), target: 15 },
        { element: document.getElementById('project-count'), target: 8 },
        { element: document.getElementById('tech-count'), target: 10 },
        { element: document.getElementById('experience-years'), target: 3 }
    ];
    
    counters.forEach(counter => {
        if (counter.element && !counter.element.classList.contains('animated')) {
            animateCounter(counter.element, counter.target);
            counter.element.classList.add('animated');
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 50);
}

// ===== Blog Functions =====
function loadBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    console.log('Loading blog posts...');
    
    // Sample blog data (static data for H5 project)
    const blogPosts = [
        {
            id: 1,
            title: 'Vue.js 3.0 新特性详解',
            category: 'frontend',
            excerpt: '深入了解 Vue.js 3.0 的 Composition API、Teleport、Fragments 等新特性，以及如何在项目中使用这些功能提升开发效率。',
            date: '2024-01-15',
            readTime: '8 分钟',
            image: '📝'
        },
        {
            id: 2,
            title: 'Node.js 性能优化最佳实践',
            category: 'backend',
            excerpt: '从内存管理、异步处理、数据库优化等多个方面介绍 Node.js 应用性能优化的实用技巧和最佳实践。',
            date: '2024-01-10',
            readTime: '12 分钟',
            image: '⚡'
        },
        {
            id: 3,
            title: 'CSS Grid 布局完全指南',
            category: 'frontend',
            excerpt: '全面介绍 CSS Grid 布局系统，从基础概念到高级应用，帮助你掌握现代网页布局的强大工具。',
            date: '2024-01-05',
            readTime: '15 分钟',
            image: '🎨'
        },
        {
            id: 4,
            title: 'JavaScript 异步编程深度解析',
            category: 'tutorial',
            excerpt: '详细讲解 JavaScript 中的异步编程概念，包括 Promise、async/await、事件循环等核心知识点。',
            date: '2023-12-28',
            readTime: '10 分钟',
            image: '🚀'
        },
        {
            id: 5,
            title: 'React Hooks 使用指南',
            category: 'frontend',
            excerpt: 'React Hooks 的详细使用方法和最佳实践，包括 useState、useEffect、自定义 Hooks 等。',
            date: '2023-12-20',
            readTime: '9 分钟',
            image: '⚛️'
        },
        {
            id: 6,
            title: 'MongoDB 数据库设计模式',
            category: 'backend',
            excerpt: '介绍 MongoDB 数据库的设计模式和优化技巧，帮助你构建高效的 NoSQL 数据库应用。',
            date: '2023-12-15',
            readTime: '11 分钟',
            image: '🍃'
        }
    ];
    
    renderBlogPosts(blogPosts);
    setupBlogFilters(blogPosts);
}

function renderBlogPosts(posts) {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    const html = posts.map(post => `
        <article class="blog-card" data-category="${post.category}">
            <div class="blog-image">
                <span>${post.image}</span>
            </div>
            <div class="blog-content">
                <span class="blog-category">${getCategoryName(post.category)}</span>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-meta">
                    <div class="blog-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(post.date)}</span>
                    </div>
                    <div class="blog-read-time">
                        <i class="fas fa-clock"></i>
                        <span>${post.readTime}</span>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
    
    blogGrid.innerHTML = html;
}

function setupBlogFilters(posts) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter posts
            const filter = btn.getAttribute('data-filter');
            filterBlogPosts(posts, filter);
        });
    });
}

function filterBlogPosts(posts, filter) {
    let filteredPosts = posts;
    
    if (filter !== 'all') {
        filteredPosts = posts.filter(post => post.category === filter);
    }
    
    renderBlogPosts(filteredPosts);
}

function getCategoryName(category) {
    const categories = {
        'frontend': '前端',
        'backend': '后端',
        'tutorial': '教程'
    };
    return categories[category] || category;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== Projects Functions =====
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    console.log('Loading projects...');
    
    // Sample projects data (static data for H5 project)
    const projects = [
        {
            id: 1,
            title: '个人博客系统',
            description: '基于 Vue.js 和 Node.js 开发的现代化个人博客系统，支持 Markdown 编辑、评论系统、标签分类等功能。',
            image: '📝',
            tech: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
            demo: '#',
            github: '#'
        },
        {
            id: 2,
            title: '任务管理应用',
            description: '功能完整的任务管理应用，支持项目分组、任务优先级、协作功能、数据可视化等企业级功能。',
            image: '✅',
            tech: ['React', 'TypeScript', 'Prisma', 'PostgreSQL'],
            demo: '#',
            github: '#'
        },
        {
            id: 3,
            title: '电商平台前端',
            description: '现代化的电商平台前端应用，具有商品展示、购物车、支付集成、用户管理等完整的电商功能。',
            image: '🛒',
            tech: ['Next.js', 'Tailwind CSS', 'Redux', 'Stripe'],
            demo: '#',
            github: '#'
        },
        {
            id: 4,
            title: '数据可视化看板',
            description: '企业级数据可视化看板，支持实时数据更新、多种图表类型、响应式设计和自定义主题。',
            image: '📊',
            tech: ['D3.js', 'Vue.js', 'WebSocket', 'Chart.js'],
            demo: '#',
            github: '#'
        },
        {
            id: 5,
            title: '在线代码编辑器',
            description: '基于浏览器的在线代码编辑器，支持多种编程语言、语法高亮、代码补全和实时预览功能。',
            image: '💻',
            tech: ['Monaco Editor', 'WebAssembly', 'Docker', 'WebSocket'],
            demo: '#',
            github: '#'
        },
        {
            id: 6,
            title: 'RESTful API 服务',
            description: '高性能的 RESTful API 服务，包含用户认证、数据缓存、API 限流、文档生成等企业级功能。',
            image: '🔧',
            tech: ['Node.js', 'Express', 'Redis', 'JWT', 'Swagger'],
            demo: '#',
            github: '#'
        }
    ];
    
    renderProjects(projects);
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const html = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <span>${project.image}</span>
                <div class="project-overlay">
                    <a href="${project.demo}" class="project-link" target="_blank">
                        <i class="fas fa-eye"></i> 预览
                    </a>
                    <a href="${project.github}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> 代码
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    projectsGrid.innerHTML = html;
}

// ===== Contact Form =====
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Here you would normally send the data to your server
    console.log('Contact form data:', data);
    
    // Show success message
    showNotification('消息发送成功！我会尽快回复您。', 'success');
    
    // Reset form
    e.target.reset();
}

// ===== Utility Functions =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('页面出现错误，请刷新重试。', 'error');
});

// ===== Performance Monitoring =====
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Export functions for use in other modules
window.BlogApp = {
    showSection,
    toggleTheme,
    showNotification,
    loadBlogPosts,
    loadProjects
};