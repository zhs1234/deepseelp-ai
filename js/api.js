/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

import { MessageType, ErrorType } from './types.js';
import { state } from './state.js';
import { els } from './dom.js';

/**
 * 获取错误消息
 * @param {Error} error 错误对象
 * @returns {string} 用户友好的错误消息
 */
const getErrorMessage = (error) => {
    const errorMessages = {
        [ErrorType.AUTH_ERROR]: 'API密钥无效，请检查设置。',
        [ErrorType.NETWORK_ERROR]: '网络连接失败，请检查网络。',
        [ErrorType.API_ERROR]: 'API服务器错误，请稍后重试。',
        [ErrorType.INVALID_RESPONSE]: 'API响应无效，未返回有效结果。'
    };
    
    return errorMessages[error.message] || '抱歉，发生了错误，请稍后重试。';
};

/**
 * 添加消息到聊天界面
 * @param {string} content - 消息内容
 * @param {MessageType} type - 消息类型（用户/AI）
 * @returns {HTMLElement} 创建的消息元素
 */
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type === MessageType.USER ? 'user-message' : 'ai-message'}`;
    messageDiv.setAttribute('role', 'article');
    
    if (type === MessageType.USER) {
        messageDiv.textContent = content;
    } else {
        // 使用marked处理AI消息中的markdown
        messageDiv.innerHTML = marked.parse(content);
        
        // 处理代码块语法高亮
        messageDiv.querySelectorAll('pre code').forEach((block) => {
            Prism.highlightElement(block);
        });
    }
    
    els.chatMessages.appendChild(messageDiv);
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    
    // 保存到历史记录
    state.addMessage({ content, type });
    
    return messageDiv;
}

/**
 * 处理API错误
 * @param {Error} error 错误对象
 */
const handleApiError = (error) => {
    console.error('API Error:', error);
    state.setError(error.message);
    
    // 移除加载消息
    const loadingMessages = document.querySelectorAll('.ai-message');
    const lastLoadingMessage = loadingMessages[loadingMessages.length - 1];
    if (lastLoadingMessage && lastLoadingMessage.textContent === '正在思考...') {
        lastLoadingMessage.remove();
    }
    
    // 显示错误消息
    const errorMessage = getErrorMessage(error);
    addMessage(errorMessage, MessageType.AI);
};

/**
 * 发送消息到API
 * @param {string} message 用户消息内容
 */
export const sendMessage = async (message) => {
    state.setLoading(true);
    state.setError(null);
    
    try {
        const loadingMessage = addMessage('正在思考...', MessageType.AI);
        
        const response = await fetch(state.settings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.settings.apiKey}`
            },
            body: JSON.stringify({
                model: state.settings.modelName,
                messages: state.getHistory().map(msg => ({
                    role: msg.type === MessageType.USER ? 'user' : 'assistant',
                    content: msg.content
                })),
                temperature: state.settings.temperature,
                max_tokens: state.settings.maxTokens || 4096
            })
        });

        if (!response.ok) {
            const errorType = 
                response.status === 401 ? ErrorType.AUTH_ERROR :
                response.status === 0 ? ErrorType.NETWORK_ERROR :
                ErrorType.API_ERROR;
            throw new Error(errorType);
        }

        const data = await response.json();
        loadingMessage.remove();

        if (!data.choices || data.choices.length === 0) {
            throw new Error(ErrorType.INVALID_RESPONSE);
        }

        const aiMessage = data.choices[0].message.content;
        addMessage(aiMessage, MessageType.AI);

    } catch (error) {
        handleApiError(error);
    } finally {
        state.setLoading(false);
    }
};

export { addMessage };