# 个人博客 H5 项目

这是一个现代化的个人博客网站，使用纯 HTML5、CSS3 和 JavaScript 开发，具有响应式设计和现代化的用户体验。

## ✨ 特性

- 🎨 **现代化设计** - 简洁美观的用户界面
- 📱 **响应式布局** - 完美适配各种设备
- 🌙 **暗色模式** - 支持明暗主题切换
- ⚡ **性能优化** - 快速加载和流畅动画
- 🚀 **单页应用** - 平滑的页面切换体验
- 📝 **博客系统** - 文章分类和筛选功能
- 💼 **项目展示** - 作品集展示页面
- 📧 **联系表单** - 集成联系方式
- 🔧 **CI/CD** - 自动化部署流程

## 📋 页面结构

### 🏠 首页 (Home)
- 个人介绍和头像展示
- 技能统计卡片
- 社交媒体链接
- 引导按钮和动画效果

### 👤 关于我 (About)
- 个人详细介绍
- 技能进度条展示
- 工作经历时间线
- 专业技能分类

### 📝 博客中心 (Blog)
- 技术文章列表
- 分类筛选功能
- 文章摘要预览
- 阅读时间估算

### 💻 项目展示 (Projects)
- 个人项目作品集
- 技术栈标签
- 项目详情和链接
- 预览和源码链接

### 📞 联系我 (Contact)
- 联系方式信息
- 在线联系表单
- 社交媒体链接
- 地理位置信息

## 🛠️ 技术栈

- **前端框架**: 纯 HTML5 + CSS3 + JavaScript (ES6+)
- **样式框架**: CSS 自定义属性 + Flexbox + Grid
- **字体图标**: Font Awesome 6.4.0
- **字体**: Inter (Google Fonts)
- **构建工具**: npm scripts
- **部署**: Nginx 静态文件服务
- **CI/CD**: GitHub Actions

## 📁 项目结构

```
h5-blog/
├── index.html              # 主页面文件
├── css/                    # 样式文件目录
│   ├── styles.css          # 主样式文件
│   └── additional-styles.css # 额外样式
├── js/                     # JavaScript 文件目录
│   └── main.js             # 主逻辑文件
├── images/                 # 图片资源目录
├── assets/                 # 其他资源文件
├── .github/workflows/      # GitHub Actions 配置
│   └── deploy.yml          # CI/CD 部署流程
├── package.json            # 项目配置文件
├── deploy.sh               # 部署脚本
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Nginx (用于部署)

### 安装依赖

```bash
cd h5-blog
npm install
```

### 本地开发

```bash
# 启动本地开发服务器
npm run serve

# 在浏览器中打开
# http://localhost:3000
```

### 构建项目

```bash
# 构建生产版本
npm run build

# 构建输出将在 dist/ 目录中
```

## 📦 部署

### 自动部署 (推荐)

使用提供的部署脚本：

```bash
# 确保脚本有执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

部署脚本会自动：
- 安装依赖
- 构建项目
- 压缩文件
- 复制到目标目录
- 设置正确权限
- 重载 Nginx 配置

### 手动部署

```bash
# 1. 构建项目
npm run build

# 2. 复制文件到 Nginx 目录
sudo cp -r dist/* /root/dockerfiles/nginx/html/

# 3. 设置权限
sudo chmod -R 644 /root/dockerfiles/nginx/html/*
sudo chmod 755 /root/dockerfiles/nginx/html

# 4. 重载 Nginx
sudo systemctl reload nginx
```

### CI/CD 自动部署

项目包含 GitHub Actions 配置，可实现：

- **自动构建** - 推送到主分支时自动构建
- **质量检查** - 代码检查和安全扫描
- **自动部署** - 构建成功后自动部署
- **性能测试** - 部署后运行性能检查

配置位于 `.github/workflows/deploy.yml`

### 🔧 Nginx SPA 路由配置

**重要：** 由于这是单页应用(SPA)，需要配置nginx来正确处理前端路由，否则会出现 `/app/blog/posts` 等路径的404错误。

#### 快速配置（推荐）
```bash
# 自动配置nginx
./setup-nginx.sh
```

#### 手动配置
```bash
# 复制配置文件
sudo cp blog.nginx.conf /etc/nginx/sites-available/blog

# 启用站点
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog

# 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

详细配置说明请参考：[NGINX_SETUP.md](NGINX_SETUP.md)

## ⚙️ 配置

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /root/dockerfiles/nginx/html;
    index index.html;

    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # 缓存静态资源
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🎨 自定义

### 修改主题色彩

编辑 `css/styles.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #3b82f6;      /* 主色调 */
    --secondary-color: #f59e0b;    /* 辅助色 */
    --accent-color: #10b981;       /* 强调色 */
    /* 更多变量... */
}
```

### 添加新内容

1. **博客文章**: 修改 `js/main.js` 中的 `blogPosts` 数组
2. **项目作品**: 修改 `js/main.js` 中的 `projects` 数组
3. **个人信息**: 编辑 `index.html` 中的相应部分

### 自定义样式

所有样式都使用 CSS 自定义属性，便于维护和定制：

- 颜色主题: `:root` 中的颜色变量
- 字体大小: `--font-size-*` 变量
- 间距: `--spacing-*` 变量
- 圆角: `--radius-*` 变量

## 📊 性能优化

- ✅ CSS/JS 文件压缩
- ✅ 图片懒加载
- ✅ 代码分离
- ✅ 缓存策略
- ✅ Gzip 压缩
- ✅ 渐进式增强

## 🔧 开发脚本

```bash
# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 代码格式化
npm run format

# 代码检查
npm run lint

# 部署到生产环境
npm run deploy
```

## 🐛 故障排除

### 常见问题

1. **部署失败**: 检查目标目录权限
2. **样式不生效**: 确认 CSS 文件路径正确
3. **JavaScript 错误**: 检查浏览器控制台
4. **响应式问题**: 验证 viewport meta 标签

### 调试技巧

```javascript
// 开启调试模式
localStorage.setItem('debug', 'true');

// 查看性能信息
console.log('Page load time:', performance.now());

// 检查主题状态
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
```

## 📝 更新日志

### v1.0.0 (2024-01-15)
- 🎉 初始版本发布
- ✨ 完整的个人博客功能
- 🎨 现代化响应式设计
- 🚀 CI/CD 自动部署流程
- 📱 移动端优化
- 🌙 暗色模式支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目使用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 📧 邮箱: your.email@example.com
- 🐱 GitHub: [@yourusername](https://github.com/yourusername)
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务
- [GitHub Actions](https://github.com/features/actions) - CI/CD 服务

---

⭐ 如果这个项目对你有帮助，请给个星星！