/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

import { CONFIG } from './config.js';
import { MessageType } from './types.js';
import { state } from './state.js';
import { initializeDOMElements, els, setupDOMListeners } from './dom.js';
import { sendMessage, addMessage } from './api.js';

/**
 * 消息发送处理函数
 */
const handleSendMessage = async () => {
    const input = els.userInput;
    const message = input.value.trim();
    
    if (message && !state.isLoading) {
        try {
            state.setLoading(true); // 设置加载状态
            // 清空输入框并添加用户消息
            input.value = '';
            addMessage(message, MessageType.USER);
            
            try {
                // 获取当前面具提示词
                console.log('准备发送消息:', message);
                await sendMessage(message);
            } catch (error) {
                console.error('处理面具提示词时出错:', error);
                // 如果面具功能出错，仍发送原始消息
                await sendMessage(message);
            }
        } catch (error) {
            console.error('发送消息失败:', error);
            addMessage('抱歉，发送消息时出现错误：' + error.message, MessageType.AI);
        } finally {
            state.setLoading(false); // 重置加载状态
        }
    }
};

/**
 * 清空对话处理函数
 */
const handleClearChat = () => {
    if (confirm('确定要清空所有对话吗？')) {
        try {
            state.clearHistory();
            els.chatMessages.innerHTML = '<div class="message ai-message">您好！我是DeepSeek AI助手，有什么可以帮您的？</div>';
        } catch (error) {
            console.error('清空对话失败:', error);
            alert('清空对话失败：' + error.message);
        }
    }
};

/**
 * 导出对话处理函数
 */
const handleExportChat = () => {
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
 * 显示历史消息记录
 */
const displayHistory = () => {
    try {
        const history = state.getHistory();
        if (history && history.length > 0) {
            // 清空默认的欢迎消息
            els.chatMessages.innerHTML = '';
            // 显示历史消息
            history.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type === MessageType.USER ? 'user-message' : 'ai-message'}`;
                messageDiv.setAttribute('role', 'article');
                
                if (msg.type === MessageType.USER) {
                    messageDiv.textContent = msg.content;
                } else {
                    // 检查marked是否已加载
                    if (typeof marked !== 'undefined') {
                        messageDiv.innerHTML = marked.parse(msg.content);
                        // 检查Prism是否已加载
                        if (typeof Prism !== 'undefined') {
                            messageDiv.querySelectorAll('pre code').forEach((block) => {
                                Prism.highlightElement(block);
                            });
                        }
                    } else {
                        // 如果marked未加载，直接显示内容
                        messageDiv.textContent = msg.content;
                    }
                }
                
                els.chatMessages.appendChild(messageDiv);
            });
            els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
        }
    } catch (error) {
        console.error('显示历史记录失败:', error);
    }
};

/**
 * 初始化应用
 */
const initializeApp = () => {
    try {
        console.log('开始初始化应用...');
        
        // 初始化DOM元素
        initializeDOMElements();
        console.log('DOM元素初始化完成', els);
        
        // 设置事件监听器
        const handlers = {
            handleSendMessage,
            handleExportChat,
            handleClearChat
        };
        console.log('准备设置事件监听器:', handlers);
        
        setupDOMListeners(handlers);
        console.log('事件监听器设置完成');
        
        // 确保DOM完全加载后再显示历史消息记录
        setTimeout(() => {
            displayHistory();
            console.log('历史消息记录显示完成');
        }, 100);

        // 禁用输入框的默认Enter行为
        if (els.userInput) {
            els.userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('阻止了输入框的默认Enter行为');
                }
            });
        } else {
            console.error('userInput元素未找到', els);
        }

    } catch (error) {
        console.error('初始化失败:', error);
        alert('应用初始化失败，请刷新页面重试。错误信息：' + error.message);
    }
};

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);

// 导出处理函数供其他模块使用
export {
    handleSendMessage,
    handleClearChat,
    handleExportChat
};