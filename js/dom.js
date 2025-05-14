
import { MessageType } from './types.js';

/**
 * DOM元素引用
 */
let elements = null;

// 定义必需和可选元素列表
const REQUIRED_ELEMENTS = [
    'chatMessages', 'userInput', 'sendButton', 'settingsButton', 
    'settingsPanel', 'saveSettings', 'closeSettings', 'exportButton', 
    'clearButton'
];

const OPTIONAL_ELEMENTS = [
    'temperatureInput', 'temperatureValue', 'apiEndpoint', 'apiKey', 
    'modelName', 'maxTokens', 'contextLength'
];

/**
 * 初始化DOM元素引用
 */
export const initializeElements = () => {
    // 初始化必需元素
    const requiredElements = {};
    for (const elementName of REQUIRED_ELEMENTS) {
        const element = document.getElementById(elementName);
        if (!element) {
            throw new Error(`Required DOM element "${elementName}" not found`);
        }
        requiredElements[elementName] = element;
    }
    
    // 初始化可选元素
    const optionalElements = {};
    for (const elementName of OPTIONAL_ELEMENTS) {
        const element = document.getElementById(elementName);
        if (element) {
            optionalElements[elementName] = element;
        }
    }
    
    // 合并必需和可选元素
    elements = {
        ...requiredElements,
        ...optionalElements
    };

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

// 存储事件监听器引用，用于后续解绑
const eventListeners = new Map();

/**
 * 添加事件监听器并存储引用
 * @param {HTMLElement} element DOM元素
 * @param {string} eventType 事件类型
 * @param {Function} handler 事件处理函数
 */
const addEventListenerWithRef = (element, eventType, handler) => {
    if (!element) return;
    
    element.addEventListener(eventType, handler);
    
    // 存储事件监听器引用
    const elementListeners = eventListeners.get(element) || new Map();
    elementListeners.set(eventType, handler);
    eventListeners.set(element, elementListeners);
};

/**
 * 设置DOM事件监听器
 * @param {Object} handlers 事件处理函数集合
 */
export const setupDOMListeners = (handlers) => {
    const els = getElements();
    const { handleSend, handleSettingsSave, handleClear, handleExport } = handlers;

    // 发送消息事件
    addEventListenerWithRef(els.sendButton, 'click', (e) => {
        e.preventDefault();
        handleSend();
    });

    // 确保发送按钮在输入内容时可点击
    addEventListenerWithRef(els.userInput, 'input', (e) => {
        els.sendButton.disabled = !e.target.value.trim();
    });

    // 设置面板事件
    addEventListenerWithRef(els.settingsButton, 'click', (e) => {
        e.preventDefault();
        els.settingsPanel.classList.add('active');
    });

    addEventListenerWithRef(els.closeSettings, 'click', (e) => {
        e.preventDefault();
        els.settingsPanel.classList.remove('active');
    });

    // 清空对话事件
    addEventListenerWithRef(els.clearButton, 'click', (e) => {
        e.preventDefault();
        handleClear();
    });

    // 导出对话事件
    addEventListenerWithRef(els.exportButton, 'click', (e) => {
        e.preventDefault();
        handleExport();
    });

    // 移除温度滑块事件（已在settings.js中处理）

    // 点击设置面板外部关闭设置
    addEventListenerWithRef(document, 'click', (e) => {
        if (e.target === els.settingsPanel) {
            els.settingsPanel.classList.remove('active');
        }
    });
};

/**
 * 移除DOM事件监听器
 */
export const removeDOMListeners = () => {
    // 遍历所有存储的事件监听器并移除
    for (const [element, listeners] of eventListeners.entries()) {
        for (const [eventType, handler] of listeners.entries()) {
            element.removeEventListener(eventType, handler);
        }
    }
    
    // 清空事件监听器存储
    eventListeners.clear();
};