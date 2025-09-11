// Blog page functionality
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 5;

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    loadCategories();
    loadRecentPostsSidebar();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }

    // Pagination
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));
}

async function loadBlogPosts() {
    try {
        const response = await fetch('/blog/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        allPosts = await response.json();
        filteredPosts = [...allPosts];
        displayPosts();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showNoPosts('加载文章失败，请稍后重试。');
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/blog/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        const categories = [...new Set(posts.map(post => post.category).filter(cat => cat))];
        
        // Update category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">所有分类</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        // Update sidebar categories
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            if (categories.length === 0) {
                categoryList.innerHTML = '<p class="text-muted">暂无分类</p>';
                return;
            }
            
            categoryList.innerHTML = categories.map(category => {
                const count = posts.filter(post => post.category === category).length;
                return `
                    <div class="category-item" onclick="filterByCategory('${category}')">
                        <span>${category}</span>
                        <span class="category-count">${count}</span>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadRecentPostsSidebar() {
    try {
        const response = await fetch('/blog/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        const recentPosts = posts.slice(0, 5);
        
        const recentPostsSidebar = document.getElementById('recent-posts-sidebar');
        if (recentPostsSidebar) {
            if (recentPosts.length === 0) {
                recentPostsSidebar.innerHTML = '<p class="text-muted">暂无文章</p>';
                return;
            }
            
            recentPostsSidebar.innerHTML = recentPosts.map(post => {
                const formattedDate = formatDate(post.createdAt);
                return `
                    <div class="recent-post-item">
                        <h4><a href="/blog/post/${post.id}">${post.title}</a></h4>
                        <div class="recent-post-date">${formattedDate}</div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading recent posts:', error);
    }
}

function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    if (filteredPosts.length === 0) {
        showNoPosts('没有找到符合条件的文章。');
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Display posts
    postsContainer.innerHTML = currentPosts.map(post => createBlogPostCard(post)).join('');

    // Update pagination
    updatePagination(totalPages);
}

function createBlogPostCard(post) {
    const formattedDate = formatDate(post.createdAt);
    const tags = post.tags ? post.tags.split(',').map(tag => tag.trim()) : [];
    
    return `
        <article class="blog-post-card">
            <header class="blog-post-header">
                <div class="blog-post-meta">
                    <span class="blog-post-category">${post.category || '未分类'}</span>
                    <span><i class="fas fa-user"></i> ${post.author || '作者'}</span>
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                </div>
                <h2 class="blog-post-title">
                    <a href="/blog/post/${post.id}">${post.title}</a>
                </h2>
            </header>
            <div class="blog-post-content">
                <p class="blog-post-summary">${post.summary || '暂无摘要'}</p>
                ${tags.length > 0 ? `
                    <div class="blog-post-tags">
                        ${tags.map(tag => `<a href="#" class="blog-post-tag">#${tag}</a>`).join('')}
                    </div>
                ` : ''}
                <a href="/blog/post/${post.id}" class="read-more-btn">
                    阅读全文 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (!query) {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            (post.summary && post.summary.toLowerCase().includes(query)) ||
            (post.content && post.content.toLowerCase().includes(query)) ||
            (post.tags && post.tags.toLowerCase().includes(query))
        );
    }
    
    currentPage = 1;
    displayPosts();
}

function handleCategoryFilter(event) {
    const selectedCategory = event.target.value;
    
    if (!selectedCategory) {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => post.category === selectedCategory);
    }
    
    currentPage = 1;
    displayPosts();
}

function filterByCategory(category) {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.value = category;
        handleCategoryFilter({ target: { value: category } });
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayPosts();
        
        // Scroll to top of posts
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationInfo = document.getElementById('pagination-info');
    
    if (totalPages <= 1) {
        if (pagination) pagination.style.display = 'none';
        return;
    }
    
    if (pagination) pagination.style.display = 'flex';
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    if (paginationInfo) {
        paginationInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
    }
}

function showNoPosts(message) {
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-search"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    const pagination = document.getElementById('pagination');
    if (pagination) {
        pagination.style.display = 'none';
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}