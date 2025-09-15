#!/bin/bash

# Personal Blog Deployment Script
# This script builds and deploys the H5 blog to nginx directory

set -e

echo "🚀 Starting deployment process..."

# Configuration
SOURCE_DIR="$(pwd)"
TARGET_DIR="/root/dockerfiles/nginx/html"
BUILD_DIR="dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the h5-blog directory."
    exit 1
fi

print_status "Checking dependencies..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
else
    print_status "Dependencies already installed"
fi

# Create build directory
print_status "Creating build directory..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Copy source files to build directory
print_status "Copying source files..."
cp -r css js "$BUILD_DIR/"
cp index.html "$BUILD_DIR/"

# Minify CSS files (if minifier is available)
if command -v cleancss &> /dev/null; then
    print_status "Minifying CSS files..."
    cleancss -o "$BUILD_DIR/css/styles.min.css" css/styles.css css/additional-styles.css
    # Update HTML to use minified CSS
    sed -i 's|css/styles.css|css/styles.min.css|g' "$BUILD_DIR/index.html"
    print_success "CSS files minified"
else
    print_warning "clean-css not found. CSS files will not be minified."
    # Combine CSS files manually
    cat css/styles.css css/additional-styles.css > "$BUILD_DIR/css/styles.css"
fi

# Minify JavaScript files (if minifier is available)
if command -v uglifyjs &> /dev/null; then
    print_status "Minifying JavaScript files..."
    uglifyjs js/main.js -o "$BUILD_DIR/js/main.min.js" -c -m
    # Update HTML to use minified JS
    sed -i 's|js/main.js|js/main.min.js|g' "$BUILD_DIR/index.html"
    print_success "JavaScript files minified"
else
    print_warning "uglify-js not found. JavaScript files will not be minified."
fi

# Create target directory if it doesn't exist
print_status "Preparing target directory..."
if [ ! -d "$TARGET_DIR" ]; then
    print_status "Creating target directory: $TARGET_DIR"
    sudo mkdir -p "$TARGET_DIR"
fi

# Backup existing files if they exist
if [ -f "$TARGET_DIR/index.html" ]; then
    print_status "Creating backup of existing files..."
    sudo cp -r "$TARGET_DIR" "${TARGET_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
    print_success "Backup created"
fi

# Deploy files
print_status "Deploying files to $TARGET_DIR..."
sudo cp -r "$BUILD_DIR"/* "$TARGET_DIR/"

# Set proper permissions
print_status "Setting file permissions..."
sudo chmod -R 644 "$TARGET_DIR"/*
sudo chmod 755 "$TARGET_DIR"
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} \;

print_success "Files deployed successfully!"

# Verify deployment
if [ -f "$TARGET_DIR/index.html" ]; then
    print_success "Deployment verified: index.html found in target directory"
else
    print_error "Deployment failed: index.html not found in target directory"
    exit 1
fi

# Test nginx configuration (if nginx is running)
if command -v nginx &> /dev/null; then
    if nginx -t 2>/dev/null; then
        print_success "Nginx configuration is valid"
        
        # Reload nginx if it's running
        if systemctl is-active --quiet nginx; then
            print_status "Reloading nginx..."
            sudo systemctl reload nginx
            print_success "Nginx reloaded successfully"
        else
            print_warning "Nginx is not running. Please start nginx to serve the blog."
        fi
    else
        print_warning "Nginx configuration test failed. Please check nginx configuration."
    fi
else
    print_warning "Nginx not found. Please ensure nginx is installed and configured."
fi

# Generate deployment report
cat > deployment-report.txt << EOF
=== Personal Blog Deployment Report ===
Date: $(date)
Source Directory: $SOURCE_DIR
Target Directory: $TARGET_DIR
Build Directory: $BUILD_DIR

Files Deployed:
$(find "$TARGET_DIR" -type f -name "*.html" -o -name "*.css" -o -name "*.js" | wc -l) files total

Target Directory Size: $(du -sh "$TARGET_DIR" | cut -f1)

Status: SUCCESS
EOF

print_success "Deployment completed successfully! 🎉"
print_status "Deployment report saved to: deployment-report.txt"

echo ""
echo "📝 Deployment Summary:"
echo "   Source: $SOURCE_DIR"
echo "   Target: $TARGET_DIR"
echo "   Files:  $(find "$TARGET_DIR" -type f | wc -l) files deployed"
echo "   Size:   $(du -sh "$TARGET_DIR" | cut -f1)"
echo ""
echo "🌐 Your blog should now be accessible via your nginx server!"
echo "   Make sure nginx is configured to serve files from: $TARGET_DIR"
echo ""
echo "🔧 Next steps:"
echo "   1. Verify nginx configuration"
echo "   2. Test the blog in your browser"
echo "   3. Set up SSL certificate if needed"
echo ""

# Optional: Open browser to test (if running on desktop environment)
if command -v xdg-open &> /dev/null; then
    read -p "Would you like to open the blog in your default browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "http://localhost" || print_warning "Could not open browser automatically"
    fi
fi

print_success "Deployment script completed! ✨"