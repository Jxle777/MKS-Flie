// 全局变量
let currentPath = '';
let currentView = 'grid';
let fileData = [];

// DOM 元素
const fileList = document.getElementById('fileList');
const breadcrumb = document.getElementById('breadcrumb');
const refreshBtn = document.getElementById('refreshBtn');
const viewBtns = document.querySelectorAll('.view-btn');
const fileModal = document.getElementById('fileModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const fileCountEl = document.getElementById('fileCount');
const folderCountEl = document.getElementById('folderCount');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// 初始化应用
function initializeApp() {
    loadDirectory('/');
    updateStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 刷新按钮
    refreshBtn.addEventListener('click', () => {
        loadDirectory(currentPath);
    });

    // 视图切换按钮
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });

    // 模态框关闭
    modalClose.addEventListener('click', closeModal);
    fileModal.addEventListener('click', (e) => {
        if (e.target === fileModal) {
            closeModal();
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 加载目录内容
async function loadDirectory(path) {
    showLoading();
    currentPath = path;
    
    try {
        // 模拟从服务器获取目录列表
        // 在实际应用中，这里应该是一个API调用
        const response = await fetchDirectory(path);
        fileData = response;
        
        renderFileList();
        updateBreadcrumb(path);
        updateStats();
    } catch (error) {
        showError('加载目录失败: ' + error.message);
    }
}

// 模拟获取目录列表（实际应用中替换为真实API）
async function fetchDirectory(path) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    const mockData = [
        {
            name: '马主义哲学入门研读资料',
            type: 'folder',
            size: '-',
            modified: '2024-07-14 12:56',
            path: '/马主义哲学入门研读资料'
        },
        {
            name: '更新说明.txt',
            type: 'file',
            size: '324 B',
            modified: '2024-07-14 12:56',
            path: '/更新说明.txt'
        },
        {
            name: '阅读指南v1.0.1.txt',
            type: 'file',
            size: '1.8 KB',
            modified: '2024-07-14 12:56',
            path: '/阅读指南v1.0.1.txt'
        },
        {
            name: '马克思主义基本原理.pdf',
            type: 'file',
            size: '2.3 MB',
            modified: '2024-07-14 12:45',
            path: '/马克思主义基本原理.pdf'
        },
        {
            name: '哲学笔记.docx',
            type: 'file',
            size: '156 KB',
            modified: '2024-07-14 12:30',
            path: '/哲学笔记.docx'
        }
    ];
    
    return mockData;
}

// 渲染文件列表
function renderFileList() {
    if (!fileData || fileData.length === 0) {
        fileList.innerHTML = `
            <div class="loading">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p>当前目录为空</p>
            </div>
        `;
        return;
    }

    const fileItems = fileData.map(item => createFileItem(item)).join('');
    fileList.innerHTML = fileItems;
    
    // 添加点击事件
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', handleFileClick);
    });
}

// 创建文件项
function createFileItem(item) {
    const isFolder = item.type === 'folder';
    const icon = getFileIcon(item.name, isFolder);
    const size = isFolder ? '-' : formatFileSize(item.size);
    
    return `
        <div class="file-item ${isFolder ? 'folder' : ''} ${currentView === 'list' ? 'list' : ''}" 
             data-path="${item.path}" 
             data-type="${item.type}">
            <div class="file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-meta">
                    <span class="file-size">${size}</span>
                    <span class="file-date">${item.modified}</span>
                </div>
            </div>
        </div>
    `;
}

// 获取文件图标
function getFileIcon(filename, isFolder) {
    if (isFolder) {
        return 'fas fa-folder';
    }
    
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'txt': 'fas fa-file-alt',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'mp4': 'fas fa-file-video',
        'avi': 'fas fa-file-video',
        'mp3': 'fas fa-file-audio',
        'wav': 'fas fa-file-audio',
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'ppt': 'fas fa-file-powerpoint',
        'pptx': 'fas fa-file-powerpoint'
    };
    
    return iconMap[ext] || 'fas fa-file';
}

// 格式化文件大小
function formatFileSize(size) {
    if (typeof size === 'string') {
        return size;
    }
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = size;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    
    return `${value.toFixed(1)} ${units[unitIndex]}`;
}

// 处理文件点击
function handleFileClick(event) {
    const item = event.currentTarget;
    const path = item.dataset.path;
    const type = item.dataset.type;
    
    if (type === 'folder') {
        loadDirectory(path);
    } else {
        openFile(path, item.querySelector('.file-name').textContent);
    }
}

// 打开文件
async function openFile(path, filename) {
    try {
        const content = await fetchFileContent(path);
        showFileModal(filename, content, path);
    } catch (error) {
        showError('无法打开文件: ' + error.message);
    }
}

// 模拟获取文件内容
async function fetchFileContent(path) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟文件内容
    const contentMap = {
        '/更新说明.txt': `更新说明

版本: v1.0.1
日期: 2024年7月14日

更新内容:
1. 新增马克思主义基本原理PDF文档
2. 优化阅读指南内容结构
3. 添加哲学笔记文档
4. 修复文件浏览显示问题

注意事项:
- 请确保使用最新版本的阅读器
- 建议按照阅读指南顺序学习
- 如有问题请及时反馈

感谢您的使用！`,
        
        '/阅读指南v1.0.1.txt': `马克思哲学入门研读指南 v1.0.1

一、学习目标
通过系统学习马克思主义哲学，掌握科学的世界观和方法论，提高理论思维能力和实践水平。

二、学习顺序
1. 马克思主义基本原理（PDF文档）
   - 建议阅读时间：2-3周
   - 重点掌握：唯物论、辩证法、认识论
   
2. 哲学笔记（Word文档）
   - 建议阅读时间：1-2周
   - 重点掌握：核心概念和理论要点
   
3. 更新说明
   - 了解最新内容和注意事项

三、学习方法
1. 精读与泛读相结合
2. 理论与实践相结合
3. 独立思考与讨论交流相结合
4. 做好笔记和总结

四、注意事项
- 保持开放和批判的思维
- 联系实际生活和工作
- 定期复习和巩固
- 积极参与讨论和交流

祝您学习愉快！`,
        
        '/马克思主义基本原理.pdf': `[PDF文档 - 马克思主义基本原理]

由于这是PDF文件，建议下载后使用PDF阅读器打开。

文件大小: 2.3 MB
页数: 约150页

主要内容:
- 马克思主义哲学基本原理
- 唯物论与唯心论
- 辩证法与形而上学
- 认识论与实践论
- 历史唯物主义
- 科学社会主义理论

建议使用Adobe Reader或其他PDF阅读器打开。`,
        
        '/哲学笔记.docx': `[Word文档 - 哲学笔记]

由于这是Word文档，建议下载后使用Microsoft Word或其他兼容的文档编辑器打开。

文件大小: 156 KB
页数: 约25页

主要内容:
- 马克思主义哲学核心概念
- 重要理论要点总结
- 学习心得和思考
- 实践应用案例
- 参考资料和延伸阅读

建议使用Microsoft Word、WPS或其他兼容的文档编辑器打开。`
    };
    
    return contentMap[path] || '文件内容无法显示';
}

// 显示文件模态框
function showFileModal(filename, content, path) {
    modalTitle.textContent = filename;
    modalBody.innerHTML = `
        <div class="file-preview">
            <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6; color: var(--text-primary);">${content}</pre>
        </div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <a href="${path}" download="${filename}" class="btn btn-secondary">
                <i class="fas fa-download"></i>
                下载文件
            </a>
        </div>
    `;
    
    fileModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    fileModal.classList.remove('show');
    document.body.style.overflow = '';
}

// 切换视图
function switchView(view) {
    currentView = view;
    
    // 更新按钮状态
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // 更新文件列表样式
    fileList.className = `file-list ${view}`;
    
    // 重新渲染文件列表
    renderFileList();
}

// 更新面包屑导航
function updateBreadcrumb(path) {
    const parts = path.split('/').filter(part => part);
    let breadcrumbHTML = '<a href="#" class="breadcrumb-item" data-path="/">首页</a>';
    let currentPath = '';
    
    parts.forEach(part => {
        currentPath += '/' + part;
        breadcrumbHTML += `<a href="#" class="breadcrumb-item" data-path="${currentPath}">${part}</a>`;
    });
    
    breadcrumb.innerHTML = breadcrumbHTML;
    
    // 添加点击事件
    breadcrumb.querySelectorAll('.breadcrumb-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const path = item.dataset.path;
            loadDirectory(path);
        });
    });
}

// 更新统计信息
function updateStats() {
    const files = fileData.filter(item => item.type === 'file').length;
    const folders = fileData.filter(item => item.type === 'folder').length;
    
    fileCountEl.textContent = files;
    folderCountEl.textContent = folders;
}

// 显示加载状态
function showLoading() {
    fileList.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>正在加载资料...</p>
        </div>
    `;
}

// 显示错误信息
function showError(message) {
    fileList.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent-red); margin-bottom: 1rem;"></i>
            <p>${message}</p>
            <button class="btn btn-secondary" onclick="loadDirectory(currentPath)" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i>
                重试
            </button>
        </div>
    `;
}

// 添加一些动画效果
function addAnimationEffects() {
    // 文件项进入动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.file-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(item);
    });
}

// 在文件列表渲染后添加动画
const originalRenderFileList = renderFileList;
renderFileList = function() {
    originalRenderFileList();
    setTimeout(addAnimationEffects, 100);
}; 