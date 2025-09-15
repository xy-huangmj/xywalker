# 🔧 Nginx SPA 路由配置指南

解决 `/app/blog/posts` 等前端路由404问题的完整配置指南。

## 🚨 问题描述

在部署H5单页应用(SPA)时，直接访问前端路由路径（如 `/app/blog/posts`）会出现404错误，这是因为：

1. **SPA工作原理**：所有路由都由前端JavaScript处理
2. **Nginx默认行为**：尝试在服务器文件系统中查找实际文件
3. **路径不存在**：`/app/blog/posts` 在服务器上并不存在实际文件

## 💡 解决方案

核心思路：**将所有不存在的路径重定向到 `index.html`，让前端路由处理**

## 🚀 快速解决（推荐）

### 方法1：使用自动化脚本

```bash
# 在h5-blog目录中执行
./setup-nginx.sh
```

该脚本会自动：
- ✅ 安装nginx（如未安装）
- ✅ 备份原始配置
- ✅ 部署SPA路由配置
- ✅ 测试配置并重启服务
- ✅ 验证网站访问

### 方法2：手动配置

#### 1. 复制配置文件
```bash
sudo cp blog.nginx.conf /etc/nginx/sites-available/blog
```

#### 2. 启用站点
```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm /etc/nginx/sites-enabled/default  # 可选：禁用默认站点
```

#### 3. 测试配置
```bash
sudo nginx -t
```

#### 4. 重启nginx
```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 📋 关键配置解析

### 核心SPA路由配置
```nginx
location / {
    # 按优先级尝试：
    # 1. 直接访问文件 ($uri)
    # 2. 访问目录 ($uri/)
    # 3. 如果都不存在，返回index.html（让前端路由处理）
    try_files $uri $uri/ /index.html;
}
```

### 静态资源缓存
```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### 错误页面处理
```nginx
# 所有错误都返回首页，让前端处理
error_page 404 /index.html;
error_page 403 /index.html;
error_page 500 502 503 504 /index.html;
```

## 🧪 测试验证

配置完成后，以下路径都应该正常工作：

```bash
# 测试根路径
curl -I http://localhost/
# 应该返回 200 OK

# 测试SPA路由
curl -I http://localhost/app/blog/posts
# 应该返回 200 OK (而不是404)

# 测试静态资源
curl -I http://localhost/css/styles.css
# 应该返回 200 OK 并包含缓存头
```

## 📁 完整配置文件

### blog.nginx.conf (简化版)
```nginx
server {
    listen 80;
    server_name localhost;
    root /root/dockerfiles/nginx/html;
    index index.html;

    # SPA路由核心配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip压缩
    gzip on;
    gzip_types text/css application/javascript application/json;

    # 错误处理
    error_page 404 /index.html;
}
```

## 🔍 故障排除

### 1. 仍然出现404
```bash
# 检查nginx配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 检查文件权限
ls -la /root/dockerfiles/nginx/html/
```

### 2. 静态资源加载失败
```bash
# 检查文件路径
ls -la /root/dockerfiles/nginx/html/css/
ls -la /root/dockerfiles/nginx/html/js/

# 检查nginx进程用户权限
sudo chown -R www-data:www-data /root/dockerfiles/nginx/html/
# 或者
sudo chown -R nginx:nginx /root/dockerfiles/nginx/html/
```

### 3. 配置未生效
```bash
# 强制重载配置
sudo systemctl reload nginx

# 重启nginx服务
sudo systemctl restart nginx

# 检查服务状态
sudo systemctl status nginx
```

## 🌐 域名配置

如果使用自定义域名，修改配置文件中的 `server_name`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # ... 其他配置
}
```

## 🔒 HTTPS配置（可选）

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;
    
    # ... 其他配置与HTTP版本相同
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 性能优化

### 1. 启用HTTP/2
```nginx
listen 443 ssl http2;
```

### 2. 优化Gzip
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/css
    text/javascript
    application/javascript
    application/json
    image/svg+xml;
```

### 3. 设置缓存头
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
    expires 6M;
    add_header Cache-Control "public";
}
```

## 📚 相关资源

- [Nginx官方文档](https://nginx.org/en/docs/)
- [try_files指令说明](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)
- [SPA部署最佳实践](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

## ✅ 配置检查清单

- [ ] nginx已安装并运行
- [ ] 配置文件语法正确 (`nginx -t`)
- [ ] 站点已启用 (`sites-enabled/blog`)
- [ ] 文件权限正确 (`755` for directories, `644` for files)
- [ ] 防火墙允许80/443端口
- [ ] DNS解析正确（如使用域名）
- [ ] SSL证书有效（如启用HTTPS）

---

🎉 **恭喜！** 按照此指南配置后，您的H5博客应该能够正确处理所有前端路由，不再出现404错误！