// 全局变量
let currentPath = '';
let currentView = 'grid';
let fileData = [];
let currentPage = 'home';

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
const navLinks = document.querySelectorAll('.nav-link');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupNavigation();
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

// 设置导航功能
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            switchPage(page);
        });
    });
}

// 切换页面
function switchPage(page) {
    // 更新导航状态
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
    }

    // 如果是首页，重新加载文件列表
    if (page === 'home') {
        loadDirectory(currentPath);
    }
}

// 加载分类内容（资料库页面功能）
function loadCategory(category) {
    // 切换到首页并加载对应分类
    switchPage('home');
    
    // 模拟加载分类内容
    const categoryPaths = {
        'basic': '/基础理论',
        'social': '/社会理论',
        'economics': '/政治经济学',
        'socialism': '/科学社会主义',
        'classics': '/经典著作',
        'methods': '/学习方法'
    };
    
    const path = categoryPaths[category];
    if (path) {
        loadDirectory(path);
    }
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
    
    // 根据路径返回不同的模拟数据
    const dataMap = {
        '/': [
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
        ],
        '/基础理论': [
            {
                name: '唯物论与唯心论.pdf',
                type: 'file',
                size: '1.2 MB',
                modified: '2024-07-14 10:30',
                path: '/基础理论/唯物论与唯心论.pdf'
            },
            {
                name: '辩证法与形而上学.docx',
                type: 'file',
                size: '890 KB',
                modified: '2024-07-14 10:25',
                path: '/基础理论/辩证法与形而上学.docx'
            },
            {
                name: '认识论与实践论.pdf',
                type: 'file',
                size: '1.5 MB',
                modified: '2024-07-14 10:20',
                path: '/基础理论/认识论与实践论.pdf'
            },
            {
                name: '历史唯物主义.txt',
                type: 'file',
                size: '2.1 KB',
                modified: '2024-07-14 10:15',
                path: '/基础理论/历史唯物主义.txt'
            }
        ],
        '/社会理论': [
            {
                name: '社会形态理论.pdf',
                type: 'file',
                size: '1.8 MB',
                modified: '2024-07-14 09:45',
                path: '/社会理论/社会形态理论.pdf'
            },
            {
                name: '阶级斗争理论.docx',
                type: 'file',
                size: '1.1 MB',
                modified: '2024-07-14 09:40',
                path: '/社会理论/阶级斗争理论.docx'
            },
            {
                name: '国家与革命理论.pdf',
                type: 'file',
                size: '2.2 MB',
                modified: '2024-07-14 09:35',
                path: '/社会理论/国家与革命理论.pdf'
            },
            {
                name: '社会发展规律.txt',
                type: 'file',
                size: '3.2 KB',
                modified: '2024-07-14 09:30',
                path: '/社会理论/社会发展规律.txt'
            }
        ],
        '/政治经济学': [
            {
                name: '劳动价值论.pdf',
                type: 'file',
                size: '2.5 MB',
                modified: '2024-07-14 08:15',
                path: '/政治经济学/劳动价值论.pdf'
            },
            {
                name: '剩余价值理论.docx',
                type: 'file',
                size: '1.6 MB',
                modified: '2024-07-14 08:10',
                path: '/政治经济学/剩余价值理论.docx'
            },
            {
                name: '资本积累理论.pdf',
                type: 'file',
                size: '1.9 MB',
                modified: '2024-07-14 08:05',
                path: '/政治经济学/资本积累理论.pdf'
            },
            {
                name: '经济危机理论.txt',
                type: 'file',
                size: '4.1 KB',
                modified: '2024-07-14 08:00',
                path: '/政治经济学/经济危机理论.txt'
            }
        ],
        '/科学社会主义': [
            {
                name: '社会主义理论.pdf',
                type: 'file',
                size: '2.8 MB',
                modified: '2024-07-14 07:30',
                path: '/科学社会主义/社会主义理论.pdf'
            },
            {
                name: '共产主义理想.docx',
                type: 'file',
                size: '1.3 MB',
                modified: '2024-07-14 07:25',
                path: '/科学社会主义/共产主义理想.docx'
            },
            {
                name: '革命理论.pdf',
                type: 'file',
                size: '2.1 MB',
                modified: '2024-07-14 07:20',
                path: '/科学社会主义/革命理论.pdf'
            },
            {
                name: '建设理论.txt',
                type: 'file',
                size: '5.2 KB',
                modified: '2024-07-14 07:15',
                path: '/科学社会主义/建设理论.txt'
            }
        ],
        '/经典著作': [
            {
                name: '共产党宣言.pdf',
                type: 'file',
                size: '3.2 MB',
                modified: '2024-07-14 06:45',
                path: '/经典著作/共产党宣言.pdf'
            },
            {
                name: '资本论第一卷.pdf',
                type: 'file',
                size: '15.6 MB',
                modified: '2024-07-14 06:40',
                path: '/经典著作/资本论第一卷.pdf'
            },
            {
                name: '德意志意识形态.docx',
                type: 'file',
                size: '2.8 MB',
                modified: '2024-07-14 06:35',
                path: '/经典著作/德意志意识形态.docx'
            },
            {
                name: '哥达纲领批判.txt',
                type: 'file',
                size: '6.8 KB',
                modified: '2024-07-14 06:30',
                path: '/经典著作/哥达纲领批判.txt'
            }
        ],
        '/学习方法': [
            {
                name: '理论联系实际.pdf',
                type: 'file',
                size: '1.4 MB',
                modified: '2024-07-14 05:15',
                path: '/学习方法/理论联系实际.pdf'
            },
            {
                name: '批判性思维.docx',
                type: 'file',
                size: '980 KB',
                modified: '2024-07-14 05:10',
                path: '/学习方法/批判性思维.docx'
            },
            {
                name: '系统学习方法.pdf',
                type: 'file',
                size: '1.7 MB',
                modified: '2024-07-14 05:05',
                path: '/学习方法/系统学习方法.pdf'
            },
            {
                name: '实践应用指导.txt',
                type: 'file',
                size: '7.5 KB',
                modified: '2024-07-14 05:00',
                path: '/学习方法/实践应用指导.txt'
            }
        ]
    };
    
    return dataMap[path] || dataMap['/'];
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
5. 新增资料库分类页面
6. 完善关于页面内容

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

建议使用Microsoft Word、WPS或其他兼容的文档编辑器打开。`,

        // 基础理论文件内容
        '/基础理论/唯物论与唯心论.pdf': `[PDF文档 - 唯物论与唯心论]

文件大小: 1.2 MB
页数: 约80页

主要内容:
- 唯物主义的基本观点
- 唯心主义的基本观点
- 两种哲学路线的对立
- 马克思主义的唯物主义立场
- 实践中的唯物主义应用

建议使用PDF阅读器打开。`,

        '/基础理论/辩证法与形而上学.docx': `[Word文档 - 辩证法与形而上学]

文件大小: 890 KB
页数: 约60页

主要内容:
- 辩证法的基本规律
- 形而上学思维的特点
- 辩证法与形而上学的对立
- 马克思主义辩证法
- 实际工作中的辩证法应用

建议使用Word或兼容编辑器打开。`,

        '/基础理论/认识论与实践论.pdf': `[PDF文档 - 认识论与实践论]

文件大小: 1.5 MB
页数: 约100页

主要内容:
- 马克思主义认识论
- 实践在认识中的作用
- 认识的发展过程
- 真理的客观性
- 理论与实践的统一

建议使用PDF阅读器打开。`,

        '/基础理论/历史唯物主义.txt': `历史唯物主义

历史唯物主义是马克思主义哲学的重要组成部分，是关于社会发展一般规律的科学。

一、基本观点
1. 社会存在决定社会意识
2. 生产力决定生产关系
3. 经济基础决定上层建筑
4. 社会基本矛盾推动社会发展

二、核心概念
- 生产方式：生产力和生产关系的统一
- 社会形态：经济基础和上层建筑的统一
- 社会基本矛盾：生产力和生产关系的矛盾
- 阶级斗争：阶级社会发展的直接动力

三、重要意义
历史唯物主义为我们提供了科学的世界观和方法论，帮助我们正确认识社会发展规律，指导社会实践。

四、实践应用
在实际工作中，我们要运用历史唯物主义观点分析问题，把握社会发展规律，推动社会进步。`,

        // 社会理论文件内容
        '/社会理论/社会形态理论.pdf': `[PDF文档 - 社会形态理论]

文件大小: 1.8 MB
页数: 约120页

主要内容:
- 原始社会形态
- 奴隶社会形态
- 封建社会形态
- 资本主义社会形态
- 社会主义社会形态
- 共产主义社会形态

建议使用PDF阅读器打开。`,

        '/社会理论/阶级斗争理论.docx': `[Word文档 - 阶级斗争理论]

文件大小: 1.1 MB
页数: 约75页

主要内容:
- 阶级的产生和发展
- 阶级斗争的历史作用
- 无产阶级的历史使命
- 阶级斗争的形式
- 当代阶级斗争的特点

建议使用Word或兼容编辑器打开。`,

        '/社会理论/国家与革命理论.pdf': `[PDF文档 - 国家与革命理论]

文件大小: 2.2 MB
页数: 约140页

主要内容:
- 国家的本质和职能
- 国家的历史类型
- 革命的理论基础
- 无产阶级革命的特点
- 国家消亡的理论

建议使用PDF阅读器打开。`,

        '/社会理论/社会发展规律.txt': `社会发展规律

社会发展规律是马克思主义社会理论的核心内容，揭示了社会发展的客观规律。

一、基本规律
1. 生产关系一定要适合生产力状况的规律
2. 上层建筑一定要适合经济基础状况的规律
3. 阶级斗争推动社会发展的规律
4. 人民群众创造历史的规律

二、发展动力
- 社会基本矛盾是社会发展的根本动力
- 阶级斗争是阶级社会发展的直接动力
- 科学技术是社会发展的强大动力
- 人民群众是社会发展的主体力量

三、发展道路
社会发展是一个自然历史过程，遵循客观规律，但人的主观能动性也起着重要作用。

四、现实意义
掌握社会发展规律，有助于我们正确认识社会发展趋势，制定正确的方针政策。`,

        // 政治经济学文件内容
        '/政治经济学/劳动价值论.pdf': `[PDF文档 - 劳动价值论]

文件大小: 2.5 MB
页数: 约160页

主要内容:
- 商品和货币
- 劳动的二重性
- 价值规律
- 剩余价值理论
- 资本积累规律

建议使用PDF阅读器打开。`,

        '/政治经济学/剩余价值理论.docx': `[Word文档 - 剩余价值理论]

文件大小: 1.6 MB
页数: 约110页

主要内容:
- 剩余价值的产生
- 绝对剩余价值生产
- 相对剩余价值生产
- 剩余价值率
- 剩余价值的分配

建议使用Word或兼容编辑器打开。`,

        '/政治经济学/资本积累理论.pdf': `[PDF文档 - 资本积累理论]

文件大小: 1.9 MB
页数: 约125页

主要内容:
- 资本积累的实质
- 资本有机构成
- 相对过剩人口
- 资本积累的一般规律
- 资本主义积累的历史趋势

建议使用PDF阅读器打开。`,

        '/政治经济学/经济危机理论.txt': `经济危机理论

经济危机是资本主义制度的必然产物，是资本主义基本矛盾激化的表现。

一、危机根源
资本主义基本矛盾：生产社会化与生产资料私人占有之间的矛盾

二、危机表现
1. 生产过剩
2. 商品积压
3. 企业倒闭
4. 工人失业
5. 经济衰退

三、危机周期
- 危机阶段
- 萧条阶段
- 复苏阶段
- 高涨阶段

四、危机影响
- 破坏生产力
- 加剧社会矛盾
- 推动社会变革
- 促进制度更替

五、现实意义
理解经济危机理论，有助于我们认识资本主义制度的局限性，坚定社会主义信念。`,

        // 科学社会主义文件内容
        '/科学社会主义/社会主义理论.pdf': `[PDF文档 - 社会主义理论]

文件大小: 2.8 MB
页数: 约180页

主要内容:
- 社会主义的历史必然性
- 社会主义的基本特征
- 社会主义的发展阶段
- 社会主义的本质
- 社会主义的优越性

建议使用PDF阅读器打开。`,

        '/科学社会主义/共产主义理想.docx': `[Word文档 - 共产主义理想]

文件大小: 1.3 MB
页数: 约90页

主要内容:
- 共产主义的基本特征
- 共产主义的历史必然性
- 共产主义理想与现实
- 共产主义道德
- 共产主义运动

建议使用Word或兼容编辑器打开。`,

        '/科学社会主义/革命理论.pdf': `[PDF文档 - 革命理论]

文件大小: 2.1 MB
页数: 约135页

主要内容:
- 革命的社会根源
- 革命的历史作用
- 无产阶级革命的特点
- 革命的道路和策略
- 革命胜利的条件

建议使用PDF阅读器打开。`,

        '/科学社会主义/建设理论.txt': `建设理论

社会主义建设的理论是科学社会主义的重要组成部分，指导着社会主义实践。

一、建设原则
1. 坚持社会主义方向
2. 以经济建设为中心
3. 坚持四项基本原则
4. 坚持改革开放
5. 坚持党的领导

二、建设内容
- 经济建设：发展生产力
- 政治建设：完善民主政治
- 文化建设：发展先进文化
- 社会建设：构建和谐社会
- 生态文明建设：保护环境

三、建设方法
- 实事求是
- 群众路线
- 独立自主
- 对外开放
- 改革创新

四、建设目标
建设富强民主文明和谐美丽的社会主义现代化强国，实现中华民族伟大复兴。

五、现实意义
社会主义建设理论为我们指明了前进方向，提供了行动指南。`,

        // 经典著作文件内容
        '/经典著作/共产党宣言.pdf': `[PDF文档 - 共产党宣言]

文件大小: 3.2 MB
页数: 约200页

主要内容:
- 资产阶级和无产阶级
- 无产者和共产党人
- 社会主义和共产主义的文献
- 共产党人对各种反对党派的态度

建议使用PDF阅读器打开。`,

        '/经典著作/资本论第一卷.pdf': `[PDF文档 - 资本论第一卷]

文件大小: 15.6 MB
页数: 约800页

主要内容:
- 商品和货币
- 货币转化为资本
- 绝对剩余价值的生产
- 相对剩余价值的生产
- 绝对剩余价值和相对剩余价值的生产
- 工资
- 资本的积累过程

建议使用PDF阅读器打开。`,

        '/经典著作/德意志意识形态.docx': `[Word文档 - 德意志意识形态]

文件大小: 2.8 MB
页数: 约190页

主要内容:
- 费尔巴哈唯物主义观点和唯心主义观点的对立
- 圣布鲁诺
- 圣麦克斯
- 真正的社会主义

建议使用Word或兼容编辑器打开。`,

        '/经典著作/哥达纲领批判.txt': `哥达纲领批判

《哥达纲领批判》是马克思对德国工人党纲领的批判，是科学社会主义的重要文献。

一、历史背景
1875年，德国工人运动中的两个派别合并，制定了《哥达纲领》，马克思对此进行了批判。

二、主要内容
1. 对拉萨尔主义的批判
2. 对"铁的工资规律"的批判
3. 对"自由国家"概念的批判
4. 对"不折不扣的劳动所得"的批判

三、重要观点
- 共产主义社会分为两个阶段
- 按劳分配和按需分配
- 无产阶级专政的必要性
- 国家的本质和消亡

四、现实意义
《哥达纲领批判》为我们提供了科学社会主义的理论武器，指导着社会主义实践。

五、学习要点
- 掌握科学社会主义基本原理
- 理解共产主义发展阶段理论
- 认识无产阶级专政的重要性
- 坚持马克思主义指导地位`,

        // 学习方法文件内容
        '/学习方法/理论联系实际.pdf': `[PDF文档 - 理论联系实际]

文件大小: 1.4 MB
页数: 约95页

主要内容:
- 理论联系实际的重要性
- 理论联系实际的方法
- 实际工作中的理论应用
- 理论创新的实践基础
- 理论与实践的统一

建议使用PDF阅读器打开。`,

        '/学习方法/批判性思维.docx': `[Word文档 - 批判性思维]

文件大小: 980 KB
页数: 约65页

主要内容:
- 批判性思维的概念
- 批判性思维的特点
- 批判性思维的培养
- 批判性思维的应用
- 马克思主义批判精神

建议使用Word或兼容编辑器打开。`,

        '/学习方法/系统学习方法.pdf': `[PDF文档 - 系统学习方法]

文件大小: 1.7 MB
页数: 约115页

主要内容:
- 系统学习的重要性
- 系统学习的方法
- 知识体系的构建
- 学习计划的制定
- 学习效果的评估

建议使用PDF阅读器打开。`,

        '/学习方法/实践应用指导.txt': `实践应用指导

马克思主义理论的学习不仅要掌握理论知识，更要学会在实践中应用。

一、应用原则
1. 实事求是
2. 具体问题具体分析
3. 理论指导实践
4. 实践检验理论
5. 理论与实践相结合

二、应用方法
- 调查研究：深入了解实际情况
- 分析问题：运用理论分析问题
- 制定方案：提出解决问题的方案
- 组织实施：在实践中检验方案
- 总结反思：总结经验教训

三、应用领域
- 工作实践：指导日常工作
- 学习研究：指导学术研究
- 社会活动：指导社会参与
- 个人修养：指导个人发展

四、注意事项
- 避免教条主义
- 避免经验主义
- 坚持创新精神
- 保持开放态度
- 注重实际效果

五、成功案例
通过实际案例展示马克思主义理论在实践中的成功应用，为学习者提供参考。

六、学习建议
- 多读原著
- 勤于思考
- 勇于实践
- 善于总结
- 持续改进`
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