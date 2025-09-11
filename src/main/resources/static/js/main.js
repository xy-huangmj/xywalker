// Navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Load recent posts
    loadRecentPosts();
    
    // Load featured apps
    loadFeaturedApps();
    
    // Load stats
    loadStats();
});

// Load recent blog posts
async function loadRecentPosts() {
    try {
        const response = await fetch('/blog/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        const recentPosts = posts.slice(0, 3);
        
        const postsContainer = document.getElementById('recent-posts');
        if (postsContainer) {
            if (recentPosts.length === 0) {
                postsContainer.innerHTML = `
                    <div class="no-content">
                        <i class="fas fa-pen-alt"></i>
                        <p>暂无博客文章</p>
                        <p class="text-muted">即将发布精彩内容，敬请期待！</p>
                    </div>
                `;
                return;
            }
            
            postsContainer.innerHTML = recentPosts.map(post => createPostCard(post)).join('');
        }
    } catch (error) {
        console.error('Error loading recent posts:', error);
        const postsContainer = document.getElementById('recent-posts');
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-pen-alt"></i>
                    <p>暂无博客文章</p>
                    <p class="text-muted">即将发布精彩内容，敬请期待！</p>
                </div>
            `;
        }
    }
}

// Load featured apps
async function loadFeaturedApps() {
    try {
        const response = await fetch('/apps/api/apps/featured');
        if (!response.ok) {
            throw new Error('Failed to fetch apps');
        }
        
        const apps = await response.json();
        const featuredApps = apps.slice(0, 3);
        
        const appsContainer = document.getElementById('featured-apps');
        if (appsContainer) {
            if (featuredApps.length === 0) {
                appsContainer.innerHTML = `
                    <div class="no-content">
                        <i class="fas fa-rocket"></i>
                        <p>暂无精选应用</p>
                        <p class="text-muted">正在开发中，敬请期待！</p>
                    </div>
                `;
                return;
            }
            
            appsContainer.innerHTML = featuredApps.map(app => createAppCard(app)).join('');
        }
    } catch (error) {
        console.error('Error loading featured apps:', error);
        const appsContainer = document.getElementById('featured-apps');
        if (appsContainer) {
            appsContainer.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-rocket"></i>
                    <p>暂无精选应用</p>
                    <p class="text-muted">正在开发中，敬请期待！</p>
                </div>
            `;
        }
    }
}

// Load statistics
async function loadStats() {
    try {
        const [postsResponse, appsResponse] = await Promise.all([
            fetch('/blog/api/posts'),
            fetch('/apps/api/apps')
        ]);
        
        if (postsResponse.ok) {
            const posts = await postsResponse.json();
            const blogCountEl = document.getElementById('blog-count');
            if (blogCountEl) {
                blogCountEl.textContent = posts.length;
            }
        }
        
        if (appsResponse.ok) {
            const apps = await appsResponse.json();
            const appCountEl = document.getElementById('app-count');
            if (appCountEl) {
                appCountEl.textContent = apps.length;
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Create post card HTML
function createPostCard(post) {
    const formattedDate = formatDate(post.createdAt);
    const imageUrl = post.imageUrl || '';
    
    return `
        <div class="post-card">
            <div class="post-image">
                ${imageUrl ? `<img src="${imageUrl}" alt="${post.title}">` : '<i class="fas fa-blog"></i>'}
            </div>
            <div class="post-content">
                <div class="post-category">${post.category || '未分类'}</div>
                <h3 class="post-title">
                    <a href="/blog/post/${post.id}">${post.title}</a>
                </h3>
                <p class="post-summary">${post.summary || '暂无摘要'}</p>
                <div class="post-meta">
                    <span>${post.author || '作者'}</span>
                    <span>${formattedDate}</span>
                </div>
            </div>
        </div>
    `;
}

// Create app card HTML
function createAppCard(app) {
    const techClass = getTechIcon(app.technology);
    
    return `
        <div class="app-card">
            <div class="app-icon">
                <i class="${techClass}"></i>
            </div>
            <h3 class="app-title">${app.name}</h3>
            <p class="app-description">${app.description}</p>
            <a href="${app.appUrl}" class="app-link" target="_blank">
                访问应用 <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
}

// Get tech icon class
function getTechIcon(technology) {
    const iconMap = {
        'java': 'fab fa-java',
        'javascript': 'fab fa-js-square',
        'vue': 'fab fa-vuejs',
        'react': 'fab fa-react',
        'node': 'fab fa-node-js',
        'python': 'fab fa-python',
        'spring': 'fas fa-leaf',
        'html': 'fab fa-html5',
        'css': 'fab fa-css3-alt'
    };
    
    if (technology) {
        const tech = technology.toLowerCase();
        return iconMap[tech] || 'fas fa-code';
    }
    
    return 'fas fa-code';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '未知日期';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return '昨天';
    } else if (diffDays < 7) {
        return `${diffDays} 天前`;
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.post-card, .app-card, .stat-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
window.addEventListener('scroll', animateOnScroll);

// Initial animation setup
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.post-card, .app-card, .stat-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation check
    setTimeout(animateOnScroll, 100);
});