// Apps page functionality
let allApps = [];
let filteredApps = [];
let currentView = 'grid';

document.addEventListener('DOMContentLoaded', function() {
    loadApps();
    loadFeaturedApps();
    loadCategories();
    loadStats();
    setupEventListeners();
});

function setupEventListeners() {
    // Category tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-tab')) {
            handleCategoryTab(e.target);
        }
    });

    // View toggle
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');

    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
    }

    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
}

async function loadApps() {
    try {
        const response = await fetch('/apps/api/apps');
        if (!response.ok) {
            throw new Error('Failed to fetch apps');
        }
        
        allApps = await response.json();
        filteredApps = [...allApps];
        displayApps();
    } catch (error) {
        console.error('Error loading apps:', error);
        showNoApps('加载应用失败，请稍后重试。');
    }
}

async function loadFeaturedApps() {
    try {
        const response = await fetch('/apps/api/apps/featured');
        if (!response.ok) {
            throw new Error('Failed to fetch featured apps');
        }
        
        const featuredApps = await response.json();
        displayFeaturedApps(featuredApps);
    } catch (error) {
        console.error('Error loading featured apps:', error);
        const featuredSection = document.getElementById('featured-section');
        if (featuredApps.length === 0 && featuredSection) {
            featuredSection.style.display = 'none';
        }
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/apps/api/apps');
        if (!response.ok) {
            throw new Error('Failed to fetch apps');
        }
        
        const apps = await response.json();
        const categories = [...new Set(apps.map(app => app.category).filter(cat => cat))];
        
        // Update category tabs
        const categoryTabs = document.getElementById('category-tabs');
        if (categoryTabs) {
            // Keep the "全部" tab and add new categories
            const allTab = categoryTabs.querySelector('[data-category=""]');
            categoryTabs.innerHTML = '';
            if (allTab) {
                categoryTabs.appendChild(allTab);
            } else {
                const allTabElement = document.createElement('button');
                allTabElement.className = 'category-tab active';
                allTabElement.setAttribute('data-category', '');
                allTabElement.textContent = '全部';
                categoryTabs.appendChild(allTabElement);
            }
            
            categories.forEach(category => {
                const tab = document.createElement('button');
                tab.className = 'category-tab';
                tab.setAttribute('data-category', category);
                tab.textContent = category;
                categoryTabs.appendChild(tab);
            });
        }

        // Update sidebar categories
        const sidebarCategoryList = document.getElementById('sidebar-category-list');
        if (sidebarCategoryList) {
            if (categories.length === 0) {
                sidebarCategoryList.innerHTML = '<p class="text-muted">暂无分类</p>';
                return;
            }
            
            sidebarCategoryList.innerHTML = categories.map(category => {
                const count = apps.filter(app => app.category === category).length;
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

async function loadStats() {
    try {
        const [appsResponse, featuredResponse] = await Promise.all([
            fetch('/apps/api/apps'),
            fetch('/apps/api/apps/featured')
        ]);
        
        if (appsResponse.ok) {
            const apps = await appsResponse.json();
            const totalAppsEl = document.getElementById('total-apps');
            if (totalAppsEl) {
                totalAppsEl.textContent = apps.length;
            }

            const categories = [...new Set(apps.map(app => app.category).filter(cat => cat))];
            const categoriesCountEl = document.getElementById('categories-count');
            if (categoriesCountEl) {
                categoriesCountEl.textContent = categories.length;
            }
        }
        
        if (featuredResponse.ok) {
            const featuredApps = await featuredResponse.json();
            const featuredCountEl = document.getElementById('featured-apps-count');
            if (featuredCountEl) {
                featuredCountEl.textContent = featuredApps.length;
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayFeaturedApps(featuredApps) {
    const featuredGrid = document.getElementById('featured-apps-grid');
    if (!featuredGrid) return;

    if (featuredApps.length === 0) {
        const featuredSection = document.getElementById('featured-section');
        if (featuredSection) {
            featuredSection.style.display = 'none';
        }
        return;
    }

    featuredGrid.innerHTML = featuredApps.map(app => createFeaturedAppCard(app)).join('');
}

function displayApps() {
    const appsList = document.getElementById('apps-list');
    if (!appsList) return;

    if (filteredApps.length === 0) {
        showNoApps('没有找到符合条件的应用。');
        return;
    }

    const containerClass = currentView === 'grid' ? 'apps-grid' : 'apps-list-view';
    appsList.innerHTML = `
        <div class="${containerClass}">
            ${filteredApps.map(app => currentView === 'grid' ? createAppCard(app) : createAppCardList(app)).join('')}
        </div>
    `;
}

function createFeaturedAppCard(app) {
    const techIcon = getTechIcon(app.technology);
    
    return `
        <div class="featured-app-card">
            <div class="featured-badge">精选</div>
            <div class="app-icon">
                <i class="${techIcon}"></i>
            </div>
            <h3 class="app-title">${app.name}</h3>
            <p class="app-description">${app.description}</p>
            <div class="app-meta">
                <span><i class="fas fa-layer-group"></i> ${app.category || '未分类'}</span>
                <span><i class="fas fa-code"></i> ${app.technology || '未知'}</span>
            </div>
            <div class="app-links">
                <a href="${app.appUrl}" class="app-link app-link-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> 访问应用
                </a>
                ${app.githubUrl && app.githubUrl !== '#' ? `
                    <a href="${app.githubUrl}" class="app-link app-link-secondary" target="_blank">
                        <i class="fab fa-github"></i> 源码
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function createAppCard(app) {
    const techIcon = getTechIcon(app.technology);
    const statusClass = app.status || 'active';
    const statusText = {
        'active': '正常运行',
        'maintenance': '维护中',
        'deprecated': '已停用'
    }[statusClass] || '正常运行';
    
    return `
        <div class="app-card">
            <div class="app-status ${statusClass}">${statusText}</div>
            <div class="app-icon">
                <i class="${techIcon}"></i>
            </div>
            <h3 class="app-title">${app.name}</h3>
            <p class="app-description">${app.description}</p>
            <div class="app-meta">
                <span><i class="fas fa-layer-group"></i> ${app.category || '未分类'}</span>
                <span><i class="fas fa-code"></i> ${app.technology || '未知'}</span>
            </div>
            <div class="app-links">
                <a href="${app.appUrl}" class="app-link app-link-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> 访问
                </a>
                ${app.githubUrl && app.githubUrl !== '#' ? `
                    <a href="${app.githubUrl}" class="app-link app-link-secondary" target="_blank">
                        <i class="fab fa-github"></i> 源码
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function createAppCardList(app) {
    const techIcon = getTechIcon(app.technology);
    const statusClass = app.status || 'active';
    const statusText = {
        'active': '正常运行',
        'maintenance': '维护中',
        'deprecated': '已停用'
    }[statusClass] || '正常运行';
    
    return `
        <div class="app-card-list">
            <div class="app-icon">
                <i class="${techIcon}"></i>
            </div>
            <div class="app-info">
                <div class="app-status ${statusClass}">${statusText}</div>
                <h3 class="app-title">${app.name}</h3>
                <p class="app-description">${app.description}</p>
                <div class="app-meta">
                    <span><i class="fas fa-layer-group"></i> ${app.category || '未分类'}</span>
                    <span><i class="fas fa-code"></i> ${app.technology || '未知'}</span>
                </div>
            </div>
            <div class="app-links">
                <a href="${app.appUrl}" class="app-link app-link-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> 访问应用
                </a>
                ${app.githubUrl && app.githubUrl !== '#' ? `
                    <a href="${app.githubUrl}" class="app-link app-link-secondary" target="_blank">
                        <i class="fab fa-github"></i> 源码
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function handleCategoryTab(tab) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Filter apps
    const category = tab.getAttribute('data-category');
    if (!category) {
        filteredApps = [...allApps];
    } else {
        filteredApps = allApps.filter(app => app.category === category);
    }
    
    displayApps();
}

function filterByCategory(category) {
    const categoryTab = document.querySelector(`[data-category="${category}"]`);
    if (categoryTab) {
        handleCategoryTab(categoryTab);
    }
}

function switchView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(view + '-view');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Redisplay apps with new view
    displayApps();
}

function showNoApps(message) {
    const appsList = document.getElementById('apps-list');
    if (appsList) {
        appsList.innerHTML = `
            <div class="no-apps">
                <i class="fas fa-rocket"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// Get tech icon class (reuse from main.js)
function getTechIcon(technology) {
    const iconMap = {
        'java': 'fab fa-java',
        'javascript': 'fab fa-js-square',
        'vue': 'fab fa-vuejs',
        'vue.js': 'fab fa-vuejs',
        'react': 'fab fa-react',
        'node': 'fab fa-node-js',
        'node.js': 'fab fa-node-js',
        'python': 'fab fa-python',
        'spring': 'fas fa-leaf',
        'spring boot': 'fas fa-leaf',
        'html': 'fab fa-html5',
        'css': 'fab fa-css3-alt',
        'angular': 'fab fa-angular'
    };
    
    if (technology) {
        const tech = technology.toLowerCase();
        return iconMap[tech] || 'fas fa-code';
    }
    
    return 'fas fa-code';
}