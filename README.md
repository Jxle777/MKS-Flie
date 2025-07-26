## 技术栈

- 前端：HTML5 + CSS3 + JavaScript (ES6+)
- 样式：CSS Grid + Flexbox + CSS Variables
- 图标：Font Awesome 6.0
- 字体：Noto Sans SC (Google Fonts)
- 动画：CSS3 Animations + Intersection Observer API

## 文件结构

```
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript功能
└── README.md           # 说明文档
```

## 使用方法

### 1. 直接使用
直接在浏览器中打开 `index.html` 文件即可查看演示效果。

### 2. 本地服务器
为了获得最佳体验，建议使用本地服务器：

```bash
# 使用Python (如果已安装)
python -m http.server 8000

# 使用Node.js (如果已安装)
npx http-server

# 使用PHP (如果已安装)
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

### 3. Nginx配置
如果想通过Nginx反向代理访问本地目录，可以参考以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/files;
        index index.html;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
    
    location ~* \.(txt|pdf|doc|docx)$ {
        root /path/to/your/files;
        add_header Content-Disposition "inline";
    }
}
```

## 自定义配置

### 修改主题颜色
在 `styles.css` 文件中修改CSS变量：

```css
:root {
    --primary-red: #d32f2f;        /* 主红色 */
    --primary-red-dark: #b71c1c;   /* 深红色 */
    --primary-red-light: #ffcdd2;  /* 浅红色 */
    /* 其他颜色变量... */
}
```

### 添加新文件类型
在 `script.js` 文件中的 `getFileIcon` 函数中添加新的文件类型图标：

```javascript
const iconMap = {
    'pdf': 'fas fa-file-pdf',
    'doc': 'fas fa-file-word',
    // 添加新的文件类型...
    'your-extension': 'fas fa-file-your-icon'
};
