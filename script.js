// 全局变量
let currentPath = '/';
let fileData = [];
let currentView = 'grid';
let isLoading = false;

// DOM 元素
const fileList = document.getElementById('fileList');
const breadcrumb = document.getElementById('breadcrumb');
const fileModal = document.getElementById('fileModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// 初始化应用
function initializeApp() {
    setupEventListeners();
    setupNavigation();
    loadDirectory('/');
    addAnimationEffects();
}

// 设置事件监听器
function setupEventListeners() {
    // 视图切换按钮
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDirectory(currentPath);
        });
    }
    
    // 模态框关闭
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (fileModal) {
        fileModal.addEventListener('click', (e) => {
            if (e.target === fileModal) closeModal();
        });
    }
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// 设置导航
function setupNavigation() {
    // 导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            switchPage(page);
        });
    });
}

// 页面切换
function switchPage(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    
    // 如果是首页，重新加载文件列表
    if (page === 'home') {
        loadDirectory(currentPath);
    }
}

// 加载分类
function loadCategory(category) {
    switchPage('files');
    
    // 根据分类加载不同的目录
    switch (category) {
        case 'philosophy':
            loadDirectory('/马主义哲学入门研读资料');
            break;
        case 'documents':
            loadDirectory('/马主义哲学入门研读资料/马克思主义理论 入门必读(先读这里)');
            break;
        case 'collections':
            loadDirectory('/马主义哲学入门研读资料/马克思恩格斯全集word版本');
            break;
        default:
            loadDirectory('/');
    }
}

// 加载目录
async function loadDirectory(path) {
    if (isLoading) return;
    
    isLoading = true;
    currentPath = path;
    
    showLoading();
    
    try {
        fileData = await fetchDirectory(path);
        renderFileList();
        updateBreadcrumb(path);
        updateStats();
    } catch (error) {
        console.error('加载目录失败:', error);
        showError('加载目录失败，请重试');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// 获取目录数据
async function fetchDirectory(path) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 使用动态配置文件
    if (window.dynamicFileConfig && window.dynamicFileConfig[path]) {
        return window.dynamicFileConfig[path];
    }
    
    // 如果没有找到配置，返回空数组
    return [];
}

// 渲染文件列表
function renderFileList() {
    if (!fileList) return;
    
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
                <div class="file-details">
                    <span class="file-size">${size}</span>
                    <span class="file-modified">${item.modified}</span>
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
    
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return 'fas fa-file-pdf';
        case 'docx':
        case 'doc':
            return 'fas fa-file-word';
        case 'xlsx':
        case 'xls':
            return 'fas fa-file-excel';
        case 'pptx':
        case 'ppt':
            return 'fas fa-file-powerpoint';
        case 'txt':
        case 'md':
            return 'fas fa-file-alt';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            return 'fas fa-file-image';
        case 'mp3':
        case 'wav':
        case 'flac':
            return 'fas fa-file-audio';
        case 'mp4':
        case 'avi':
        case 'mov':
            return 'fas fa-file-video';
        case 'zip':
        case 'rar':
        case '7z':
            return 'fas fa-file-archive';
        case 'epub':
            return 'fas fa-book';
        default:
            return 'fas fa-file';
    }
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
    const fileItem = event.currentTarget;
    const path = fileItem.dataset.path;
    const type = fileItem.dataset.type;
    const filename = fileItem.querySelector('.file-name').textContent;
    
    if (type === 'folder') {
        loadDirectory(path);
    } else {
        openFile(path, filename);
    }
}

// 打开文件
async function openFile(path, filename) {
    try {
        // 获取文件扩展名
        const fileExtension = filename.split('.').pop().toLowerCase();
        
        // 所有文件都提供阅读和下载两种选择
        if (['txt', 'md'].includes(fileExtension)) {
            // 文本文件：显示内容预览
            const content = await fetchFileContent(path);
            showFileModal(filename, content, path, 'text');
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            // 图片文件：显示图片预览
            showFileModal(filename, null, path, 'image');
        } else if (['pdf'].includes(fileExtension)) {
            // PDF文件：提供预览和下载
            showFileModal(filename, null, path, 'pdf');
        } else {
            // 其他文件：提供下载和新窗口打开
            showFileModal(filename, null, path, 'download', fileExtension);
        }
    } catch (error) {
        console.error('打开文件失败:', error);
        showError('打开文件失败，请重试');
    }
}

// 获取文件内容
async function fetchFileContent(path) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 检查文件扩展名，只对文本文件进行动态读取
    const fileExtension = path.split('.').pop().toLowerCase();
    const textExtensions = ['txt', 'md', 'json', 'js', 'css', 'html', 'xml'];
    
    if (textExtensions.includes(fileExtension)) {
        if (isLocalProtocol) {
            // 本地 file:// 环境无法 fetch，同步展示提示
            return '本地打开的页面不支持直接读取文本内容，请使用“在新窗口阅读”或“下载文件”。';
        } else {
            // 动态读取文件内容（多候选路径降级尝试）
            const candidates = generateDownloadCandidates(path);
            for (const url of candidates) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        return await response.text();
                    }
                } catch (err) {
                    // 继续尝试下一个候选
                }
            }
            console.warn(`无法读取文件: ${path}`);
            return '文件内容暂不可用';
        }
    } else {
        // 非文本文件返回提示信息
        return '此文件类型不支持内容预览，请使用下载或新窗口打开功能。';
    }
}

// 显示文件模态框
function showFileModal(filename, content, path, fileType, fileExtension = '') {
    modalTitle.textContent = filename;
    
    let modalContent = '';
    
    switch (fileType) {
        case 'text':
            // 文本文件显示
            modalContent = `
                <div class="file-preview">
                    <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6; color: var(--text-primary); max-height: 400px; overflow-y: auto;">${content}</pre>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="downloadFile('${path}', '${filename}')" class="btn btn-secondary">
                        <i class="fas fa-download"></i>
                        下载文件
                    </button>
                    <button onclick="openFileInNewTab('${path}')" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        在新窗口阅读
                    </button>
                </div>
            `;
            break;
            
        case 'pdf':
            // PDF文件显示
            modalContent = `
                <div class="file-preview">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-file-pdf" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h4>PDF文档</h4>
                        <p style="color: var(--text-secondary);">可以在浏览器中直接阅读或下载</p>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="downloadFile('${path}', '${filename}')" class="btn btn-secondary">
                        <i class="fas fa-download"></i>
                        下载文件
                    </button>
                    <button onclick="openFileInNewTab('${path}')" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        在新窗口阅读
                    </button>
                </div>
            `;
            break;
            
        case 'image':
            // 图片文件显示
            const imagePath = buildDownloadUrl(path);
            modalContent = `
                <div class="file-preview">
                    <img src="${imagePath}" alt="${filename}" style="max-width: 100%; max-height: 400px; object-fit: contain;">
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="downloadFile('${path}', '${filename}')" class="btn btn-secondary">
                        <i class="fas fa-download"></i>
                        下载图片
                    </button>
                    <button onclick="openFileInNewTab('${path}')" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        在新窗口阅读
                    </button>
                </div>
            `;
            break;
            
        default:
            // 其他文件类型
            const fileTypeNames = {
                'docx': 'Word文档',
                'doc': 'Word文档',
                'xlsx': 'Excel表格',
                'xls': 'Excel表格',
                'ppt': 'PowerPoint演示文稿',
                'pptx': 'PowerPoint演示文稿'
            };
            
            modalContent = `
                <div class="file-preview">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-file-${fileExtension === 'docx' || fileExtension === 'doc' ? 'word' : fileExtension === 'xlsx' || fileExtension === 'xls' ? 'excel' : fileExtension === 'ppt' || fileExtension === 'pptx' ? 'powerpoint' : ''}" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h4>${fileTypeNames[fileExtension] || '文件'}</h4>
                        <p style="color: var(--text-secondary);">可以尝试在新窗口打开或下载后查看</p>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="downloadFile('${path}', '${filename}')" class="btn btn-secondary">
                        <i class="fas fa-download"></i>
                        下载文件
                    </button>
                    <button onclick="openFileInNewTab('${path}')" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        在新窗口阅读
                    </button>
                </div>
            `;
    }
    
    modalBody.innerHTML = modalContent;
    fileModal.classList.add('show');
}

// 下载文件
function downloadFile(path, filename) {
    const link = document.createElement('a');
    link.href = buildDownloadUrl(path);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('文件下载已开始');
}

// 在新标签页打开文件
function openFileInNewTab(path) {
    window.open(buildDownloadUrl(path), '_blank');
    showNotification('文件已在新标签页中打开');
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 动画效果
    setTimeout(() => notification.classList.add('show'), 100);
    
    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// 关闭模态框
function closeModal() {
    fileModal.classList.remove('show');
}

// 切换视图
function switchView(view) {
    currentView = view;
    
    // 更新按钮状态
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // 更新文件列表样式
    if (fileList) {
        fileList.className = `file-list ${view}`;
    }
    
    // 重新渲染文件列表
    renderFileList();
}

// 更新面包屑导航
function updateBreadcrumb(path) {
    if (!breadcrumb) return;
    
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
    // 更新文件计数
    const fileCountEl = document.getElementById('fileCount');
    const folderCountEl = document.getElementById('folderCount');
    
    if (!fileData) {
        if (fileCountEl) fileCountEl.textContent = '0';
        if (folderCountEl) folderCountEl.textContent = '0';
        return;
    }
    
    const totalItems = fileData.length;
    const folders = fileData.filter(item => item.type === 'folder').length;
    const files = totalItems - folders;
    
    if (fileCountEl) fileCountEl.textContent = files;
    if (folderCountEl) folderCountEl.textContent = folders;
}

// 显示加载状态
function showLoading() {
    if (fileList) {
        fileList.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>正在加载资料...</p>
            </div>
        `;
    }
}

// 隐藏加载状态
function hideLoading() {
    // 加载状态会在 renderFileList 中被替换
}

// 显示错误信息
function showError(message) {
    fileList.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
            <p>${message}</p>
            <button onclick="loadDirectory(currentPath)" class="btn btn-primary">
                <i class="fas fa-redo"></i>
                重试
            </button>
        </div>
    `;
}

// 添加动画效果
function addAnimationEffects() {
    // 文件项悬停效果
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.file-item')) {
            e.target.closest('.file-item').style.transform = 'translateY(-2px)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.file-item')) {
            e.target.closest('.file-item').style.transform = 'translateY(0)';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeApp);

// 统一构建下载/访问 URL（移除前导 / 并逐段编码）
function buildDownloadUrl(path) {
    const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
    const encodedPath = trimmedPath
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
    return `download/${encodedPath}`;
}

// 生成多个备用访问地址（兼容不同部署与编码差异）
function generateDownloadCandidates(path) {
    const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
    return [
        buildDownloadUrl(path),                  // download/逐段编码
        `download/${trimmedPath}`,               // download/原始路径（不编码）
        `/download/${trimmedPath}`               // 以 / 开头（某些服务器根路径需要）
    ];
}

// 是否通过本地文件协议打开
const isLocalProtocol = location.protocol === 'file:';

// 移除对本地服务器的强制提示，改为在本地协议下使用内嵌预览