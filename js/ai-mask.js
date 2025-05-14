/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

// AI面具数据
const masks = [
    {
        id: 'assistant',
        name: '智能助手',
        description: '专业的AI助手，提供准确可靠的信息',
        avatar: '👩‍💻',
        prompt: '你是一个专业、友好的AI助手，用清晰准确的语言回答问题。请用以下格式回复：\n\n【角色】智能助手\n[回复内容]'
    },
    {
        id: 'teacher',
        name: '资深教师',
        description: '耐心细致的教育专家，擅长讲解复杂概念',
        avatar: '👩‍🏫',
        prompt: '你是一位有30年教学经验的老师，善于用简单易懂的方式解释概念。请用以下格式回复：\n\n【角色】教师\n[回复内容]'
    },
    {
        id: 'ceo',
        name: '企业CEO',
        description: '商业领袖视角，提供战略建议',
        avatar: '👔',
        prompt: '你是一位成功的企业CEO，用专业的商业视角分析问题。请用以下格式回复：\n\n【角色】CEO\n[回复内容]'
    },
    {
        id: 'friend',
        name: '知心朋友',
        description: '温暖贴心的伙伴，倾听和鼓励',
        avatar: '👫',
        prompt: '你是一个善解人意的朋友，用温暖和支持的语气交流。请用以下格式回复：\n\n【角色】朋友\n[回复内容]'
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 设置活动导航按钮
        const buttons = document.querySelectorAll('.nav-button');
        if (buttons.length === 0) {
            console.warn('未找到导航按钮');
        } else {
            buttons.forEach(button => {
                button.classList.toggle('active', button.href.endsWith('ai-mask.html'));
            });
        }

        // 加载面具列表
        renderMaskList();
        
        // 添加全局复制处理函数
        window.copyPrompt = copyPrompt;
    } catch (error) {
        console.error('初始化失败:', error);
        showError('页面初始化失败，请刷新重试');
    }
});

/**
 * 渲染面具列表
 */
function renderMaskList() {
    try {
        const container = document.getElementById('maskContainer');
        if (!container) {
            throw new Error('未找到面具列表容器');
        }

        // 显示加载状态
        container.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <span>正在加载角色列表...</span>
            </div>
        `;

        // 模拟异步加载
        setTimeout(() => {
            container.innerHTML = masks.map(mask => `
                <div class="mask-card" data-id="${mask.id}">
                    <div class="mask-avatar">${mask.avatar}</div>
                    <div class="mask-info">
                        <h3>${mask.name}</h3>
                        <p>${mask.description}</p>
                    </div>
                    <button class="copy-prompt" data-mask-id="${mask.id}">
                        复制提示词
                    </button>
                </div>
            `).join('');
            
            // 使用事件委托处理复制按钮点击
            container.addEventListener('click', handleCopyClick);
        }, 500);
    } catch (error) {
        console.error('渲染面具列表失败:', error);
        showError('加载角色列表失败，请刷新重试');
    }
}

/**
 * 处理复制按钮点击
 */
function handleCopyClick(e) {
    if (e.target.classList.contains('copy-prompt')) {
        const maskId = e.target.dataset.maskId;
        if (!maskId) {
            console.error('无效的角色ID');
            return;
        }
        copyPrompt(maskId);
    }
}

/**
 * 复制提示词到剪贴板
 */
function copyPrompt(maskId) {
    try {
        const mask = masks.find(m => m.id === maskId);
        if (!mask) throw new Error('未找到对应的角色');
        
        // 创建临时textarea元素作为复制媒介
        const textarea = document.createElement('textarea');
        textarea.value = mask.prompt;
        document.body.appendChild(textarea);
        textarea.select();
        
        // 执行复制命令
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (!success) throw new Error('复制命令执行失败');
        
        // 显示成功提示
        showNotification(`已复制【${mask.name}】的提示词！`);
        
    } catch (err) {
        console.error('复制失败:', err);
        const mask = masks.find(m => m.id === maskId);
        alert('复制失败，请手动复制以下内容：\n\n' + (mask?.prompt || ''));
    }
}

/**
 * 显示通知消息
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 触发重绘
    void notification.offsetWidth;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 1700);
}

/**
 * 显示错误消息
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 4700);
}