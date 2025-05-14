/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

// 知识库数据结构和状态
const knowledgeState = {
    allItems: [],       // 所有知识条目
    filteredItems: [],   // 筛选后的条目
    categories: new Set(), // 所有分类
    tags: new Set(),      // 所有标签
    currentSearch: '',    // 当前搜索词
    currentCategory: null, // 当前选中分类
    currentTags: new Set() // 当前选中标签
};

// DOM元素
const els = {
    knowledgeList: document.getElementById('knowledgeList'),
    searchInput: document.getElementById('knowledgeSearch'),
    loadingIndicator: document.createElement('div')
};

// 初始化知识库页面
document.addEventListener('DOMContentLoaded', async function() {
    // 设置活动导航按钮状态
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.toggle('active', button.href.endsWith('knowledge.html'));
    });

    // 初始化加载指示器
    initLoadingIndicator();
    
    // 初始化UI事件监听
    initEventListeners();
    
    // 加载知识数据
    await loadKnowledgeData();
    
    // 渲染初始视图
    renderKnowledgeList();
});

/**
 * 初始化加载指示器
 */
function initLoadingIndicator() {
    els.loadingIndicator.className = 'loading-indicator';
    els.loadingIndicator.innerHTML = `
        <div class="spinner"></div>
        <span>正在加载知识库...</span>
    `;
    els.loadingIndicator.style.display = 'none';
    document.querySelector('.content-container').prepend(els.loadingIndicator);
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
    // 搜索功能
    els.searchInput?.addEventListener('input', debounce((e) => {
        knowledgeState.currentSearch = e.target.value.toLowerCase();
        filterKnowledge();
        renderKnowledgeList();
    }, 300));
}

/**
 * 加载知识数据
 */
async function loadKnowledgeData() {
    try {
        showLoading(true);
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 示例数据
        knowledgeState.allItems = [
            {
                id: 1,
                title: '常见问题解答',
                content: '关于DeepSeek AI助手的常见问题解答文档，包含安装、使用和故障排除等问题。',
                category: '帮助文档',
                tags: ['FAQ', '帮助'],
                createdAt: '2023-06-15'
            },
            {
                id: 2,
                title: 'API使用指南',
                content: 'DeepSeek API接口详细使用说明和示例代码，包含认证、请求格式和响应处理。',
                category: '开发文档',
                tags: ['API', '开发'],
                createdAt: '2023-05-10'
            },
            {
                id: 3,
                title: '快速入门',
                content: 'DeepSeek AI助手的快速入门指南，帮助新用户快速上手使用。',
                category: '帮助文档',
                tags: ['入门', '指南'],
                createdAt: '2023-07-20'
            },
            {
                id: 4,
                title: '高级功能',
                content: 'DeepSeek AI助手的高级功能使用说明，包含自定义设置和扩展功能。',
                category: '高级文档',
                tags: ['高级', '功能'],
                createdAt: '2023-08-05'
            }
        ];
        
        // 提取分类和标签
        knowledgeState.allItems.forEach(item => {
            if (item.category) knowledgeState.categories.add(item.category);
            if (item.tags) item.tags.forEach(tag => knowledgeState.tags.add(tag));
        });
        
        knowledgeState.filteredItems = [...knowledgeState.allItems];
        
    } catch (error) {
        console.error('加载知识数据失败:', error);
        showError('加载知识库失败，请稍后重试');
    } finally {
        showLoading(false);
    }
}

/**
 * 防抖函数
 */
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

/**
 * 筛选知识条目
 */
function filterKnowledge() {
    knowledgeState.filteredItems = knowledgeState.allItems.filter(item => {
        const matchesSearch = !knowledgeState.currentSearch || 
            item.title.toLowerCase().includes(knowledgeState.currentSearch) || 
            item.content.toLowerCase().includes(knowledgeState.currentSearch);
            
        return matchesSearch;
    });
}

/**
 * 渲染知识列表
 */
function renderKnowledgeList() {
    if (!els.knowledgeList) return;
    
    els.knowledgeList.innerHTML = knowledgeState.filteredItems.length > 0 
        ? knowledgeState.filteredItems.map(item => `
            <div class="knowledge-item" data-id="${item.id}">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                <div class="knowledge-meta">
                    <span class="knowledge-category">${item.category}</span>
                    <span class="knowledge-date">${item.createdAt}</span>
                </div>
            </div>
        `).join('')
        : '<div class="no-results">没有找到匹配的知识条目</div>';
}

/**
 * 显示/隐藏加载指示器
 */
function showLoading(show) {
    els.loadingIndicator.style.display = show ? 'flex' : 'none';
}

/**
 * 显示错误信息
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.content-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}