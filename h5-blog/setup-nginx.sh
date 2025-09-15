#!/bin/bash

# H5博客 Nginx 配置脚本
# 解决SPA路由404问题

set -e

echo "🚀 开始配置 Nginx 以支持 SPA 路由..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户或有sudo权限
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
    print_error "此脚本需要root权限或sudo权限"
    exit 1
fi

# 检查nginx是否安装
if ! command -v nginx &> /dev/null; then
    print_warning "Nginx 未安装，正在安装..."
    
    # 检测操作系统
    if [ -f /etc/debian_version ]; then
        sudo apt update && sudo apt install -y nginx
    elif [ -f /etc/redhat-release ]; then
        sudo yum install -y nginx || sudo dnf install -y nginx
    else
        print_error "不支持的操作系统，请手动安装nginx"
        exit 1
    fi
    
    print_success "Nginx 安装完成"
else
    print_status "Nginx 已安装"
fi

# 备份原始配置
NGINX_CONF_DIR="/etc/nginx"
SITES_AVAILABLE="$NGINX_CONF_DIR/sites-available"
SITES_ENABLED="$NGINX_CONF_DIR/sites-enabled"
BACKUP_DIR="/etc/nginx/backup_$(date +%Y%m%d_%H%M%S)"

print_status "创建配置备份..."
sudo mkdir -p "$BACKUP_DIR"

if [ -f "$SITES_AVAILABLE/default" ]; then
    sudo cp "$SITES_AVAILABLE/default" "$BACKUP_DIR/"
    print_success "已备份原始配置到 $BACKUP_DIR"
fi

# 复制我们的配置文件
print_status "部署博客nginx配置..."
sudo cp blog.nginx.conf "$SITES_AVAILABLE/blog"

# 创建符号链接启用站点
if [ -L "$SITES_ENABLED/blog" ]; then
    sudo rm "$SITES_ENABLED/blog"
fi
sudo ln -s "$SITES_AVAILABLE/blog" "$SITES_ENABLED/blog"

# 禁用默认站点（可选）
if [ -L "$SITES_ENABLED/default" ]; then
    print_status "禁用默认nginx站点..."
    sudo rm "$SITES_ENABLED/default"
fi

# 测试nginx配置
print_status "测试nginx配置..."
if sudo nginx -t; then
    print_success "Nginx配置测试通过"
else
    print_error "Nginx配置测试失败，请检查配置文件"
    exit 1
fi

# 创建日志目录
sudo mkdir -p /var/log/nginx
sudo touch /var/log/nginx/blog_access.log
sudo touch /var/log/nginx/blog_error.log

# 设置权限
print_status "设置权限..."
sudo chown -R www-data:www-data /root/dockerfiles/nginx/html/ 2>/dev/null || \
sudo chown -R nginx:nginx /root/dockerfiles/nginx/html/ 2>/dev/null || \
print_warning "无法设置目录所有者，请手动检查权限"

sudo chmod -R 755 /root/dockerfiles/nginx/html/

# 重启nginx
print_status "重启nginx服务..."
if sudo systemctl restart nginx; then
    print_success "Nginx重启成功"
else
    print_error "Nginx重启失败"
    sudo systemctl status nginx
    exit 1
fi

# 启用nginx开机自启
sudo systemctl enable nginx

# 检查nginx状态
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx服务运行正常"
else
    print_error "Nginx服务未正常运行"
    sudo systemctl status nginx
    exit 1
fi

# 显示配置信息
echo ""
echo "🎉 Nginx配置完成！"
echo ""
echo "📋 配置摘要:"
echo "   网站根目录: /root/dockerfiles/nginx/html"
echo "   配置文件: $SITES_AVAILABLE/blog"
echo "   访问日志: /var/log/nginx/blog_access.log"
echo "   错误日志: /var/log/nginx/blog_error.log"
echo "   备份目录: $BACKUP_DIR"
echo ""
echo "🌐 访问地址:"
echo "   http://localhost/"
echo "   http://$(hostname -I | awk '{print $1}')/"
echo ""
echo "🔧 SPA路由支持:"
echo "   ✅ /app/blog/posts -> 正常工作"
echo "   ✅ /about -> 正常工作" 
echo "   ✅ /contact -> 正常工作"
echo "   ✅ 所有前端路由都会正确处理"
echo ""
echo "📝 常用命令:"
echo "   检查状态: sudo systemctl status nginx"
echo "   重启服务: sudo systemctl restart nginx"
echo "   查看日志: sudo tail -f /var/log/nginx/blog_error.log"
echo "   测试配置: sudo nginx -t"
echo ""

# 测试网站访问
print_status "测试网站访问..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200"; then
    print_success "网站访问测试通过！"
else
    print_warning "网站访问测试失败，请检查配置"
fi

print_success "Nginx配置脚本执行完成！✨"