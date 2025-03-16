
import { MessageType } from './types.js';

/**
 * DOM元素引用
 */
let elements = null;

/**
 * 初始化DOM元素引用
 */
export const initializeElements = () => {
    elements = {
        chatMessages: document.getElementById('chatMessages'),
        userInput: document.getElementById('userInput'),
        sendButton: document.getElementById('sendButton'),
        settingsButton: document.getElementById('settingsButton'),
        settingsPanel: document.getElementById('settingsPanel'),
        saveSettings: document.getElementById('saveSettings'),
        closeSettings: document.getElementById('closeSettings'),
        exportButton: document.getElementById('exportButton'),
        clearButton: document.getElementById('clearButton'),
        temperatureInput: document.getElementById('temperature'),
        temperatureValue: document.getElementById('temperatureValue'),
        apiEndpoint: document.getElementById('apiEndpoint'),
        apiKey: document.getElementById('apiKey'),
        modelName: document.getElementById('modelName'),
        maxTokens: document.getElementById('maxTokens'),
        contextLength: document.getElementById('contextLength')
    };

    // 验证所有必需的元素都存在
    const requiredElements = [
        'chatMessages', 'userInput', 'sendButton', 'settingsButton', 
        'settingsPanel', 'saveSettings', 'closeSettings', 'exportButton', 
        'clearButton'
    ];
    
    for (const elementName of requiredElements) {
        if (!elements[elementName]) {
            throw new Error(`Required DOM element "${elementName}" not found`);
        }
    }

    return elements;
};

/**
 * 获取DOM元素引用
 */
export const getElements = () => {
    if (!elements) {
        throw new Error('DOM elements not initialized. Call initializeElements() first.');
    }
    return elements;
};

/**
 * 添加消息到聊天界面
 * @param {string} content 消息内容
 * @param {string} type 消息类型（user/ai）
 * @returns {HTMLElement} 创建的消息元素
 */
export const addMessage = (content, type) => {
    const els = getElements();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = type === MessageType.USER ? content : marked.parse(content);
    
    if (type === MessageType.AI) {
        messageDiv.querySelectorAll('pre code').forEach((block) => {
            Prism.highlightElement(block);
        });
    }
    
    els.chatMessages.appendChild(messageDiv);
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    
    return messageDiv;
};

/**
 * 设置DOM事件监听器
 * @param {Object} handlers 事件处理函数集合
 */
export const setupDOMListeners = (handlers) => {
    const els = getElements();
    const { handleSend, handleSettingsSave, handleClear, handleExport } = handlers;

    // 发送消息事件
    els.sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSend();
    });

    els.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // 设置面板事件
    els.settingsButton.addEventListener('click', (e) => {
        e.preventDefault();
        els.settingsPanel.classList.add('active');
    });

    els.closeSettings.addEventListener('click', (e) => {
        e.preventDefault();
        els.settingsPanel.classList.remove('active');
    });

    els.saveSettings.addEventListener('click', (e) => {
        e.preventDefault();
        handleSettingsSave();
    });

    // 清空对话事件
    els.clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleClear();
    });

    // 导出对话事件
    els.exportButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleExport();
    });

    // 温度滑块事件
    if (els.temperatureInput && els.temperatureValue) {
        els.temperatureInput.addEventListener('input', (e) => {
            els.temperatureValue.textContent = e.target.value;
        });
    }

    // 点击设置面板外部关闭设置
    document.addEventListener('click', (e) => {
        if (e.target === els.settingsPanel) {
            els.settingsPanel.classList.remove('active');
        }
    });
};
