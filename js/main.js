
import { CONFIG } from './config.js';
import { MessageType } from './types.js';
import { state } from './state.js';
import { initializeElements, getElements, addMessage, setupDOMListeners } from './dom.js';
import { sendMessage } from './api.js';
import { loadSettings, handleSettingsSave } from './settings.js';

/**
 * 消息发送处理函数
 */
const handleSend = async () => {
    const elements = getElements();
    const input = elements.userInput;
    const message = input.value.trim();
    
    if (message && !state.isLoading) {
        try {
            // 清空输入框并添加用户消息
            input.value = '';
            addMessage(message, MessageType.USER);
            
            // 发送消息到API
            await sendMessage(message);
        } catch (error) {
            console.error('发送消息失败:', error);
            addMessage('抱歉，发送消息时出现错误：' + error.message, MessageType.AI);
        }
    }
};

/**
 * 清空对话处理函数
 */
const handleClear = () => {
    const elements = getElements();
    if (confirm('确定要清空所有对话吗？')) {
        try {
            state.clearHistory();
            elements.chatMessages.innerHTML = '<div class="message ai-message">您好！我是DeepSeek AI助手，有什么可以帮您的？</div>';
        } catch (error) {
            console.error('清空对话失败:', error);
            alert('清空对话失败：' + error.message);
        }
    }
};

/**
 * 导出对话处理函数
 */
const handleExport = () => {
    try {
        const messages = state.getHistory()
            .map(msg => `${msg.type === MessageType.USER ? '用户' : 'AI'}: ${msg.content}`)
            .join('\n\n');

        const blob = new Blob([messages], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出对话失败:', error);
        alert('导出对话失败：' + error.message);
    }
};

/**
 * 初始化应用
 */
const initializeApp = () => {
    try {
        // 初始化DOM元素
        initializeElements();
        
        // 加载设置
        loadSettings();
        
        console.log('API initialized with endpoint:', state.settings.apiEndpoint);
        
        // 设置事件监听器
        setupDOMListeners({
            handleSend,
            handleSettingsSave,
            handleClear,
            handleExport
        });

        // 禁用输入框的默认Enter行为
        const elements = getElements();
        elements.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
            }
        });

        // 设置输入框自动调整高度
        elements.userInput.addEventListener('input', () => {
            elements.userInput.style.height = 'auto';
            elements.userInput.style.height = elements.userInput.scrollHeight + 'px';
        });

    } catch (error) {
        console.error('初始化失败:', error);
        alert('应用初始化失败，请刷新页面重试。错误信息：' + error.message);
    }
};

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);

// 导出处理函数供其他模块使用
export {
    handleSend,
    handleClear,
    handleExport
};
