/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

import { MessageType } from './types.js';

// 存储DOM元素引用
export const els = {};

// 定义必需元素列表
const REQUIRED_ELEMENTS = [
    'chatMessages', 'userInput', 'sendButton', 'exportButton', 'clearButton'
];

// 存储事件监听器引用，用于后续解绑
const eventListeners = new Map();

/**
 * 添加事件监听器并存储引用
 * @param {HTMLElement} element DOM元素
 * @param {string} eventType 事件类型
 * @param {Function} handler 事件处理函数
 */
const addEventListenerWithRef = (element, eventType, handler) => {
    if (!element || !element.addEventListener) {
        console.error('无效的DOM元素或缺少addEventListener方法', element);
        return;
    }
    
    try {
        element.addEventListener(eventType, handler);
        
        // 存储事件监听器引用
        const elementListeners = eventListeners.get(element) || new Map();
        elementListeners.set(eventType, handler);
        eventListeners.set(element, elementListeners);
        
        console.log(`成功绑定事件监听器: ${eventType} 到元素`, element);
    } catch (error) {
        console.error('绑定事件监听器失败:', error);
    }
};

/**
 * 初始化DOM元素引用
 * @throws {Error} 如果找不到必需的元素
 */
export function initializeDOMElements() {
    console.log('正在初始化DOM元素...');
    
    // 获取必需元素
    REQUIRED_ELEMENTS.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            const errMsg = `Required element #${id} not found`;
            console.error(errMsg);
            throw new Error(errMsg);
        }
        els[id] = element;
        console.log(`已初始化元素: #${id}`, element);
    });
}

/**
 * 设置DOM事件监听器
 * @param {Object} handlers - 包含事件处理函数的对象
 */
export function setupDOMListeners(handlers) {
    console.log('正在设置事件监听器...', handlers);
    
    const {
        handleSendMessage,
        handleExportChat,
        handleClearChat
    } = handlers;

    // 验证元素存在
    if (!els.sendButton || !els.userInput) {
        console.error('关键元素未初始化', els);
        return;
    }

    // 发送消息事件
    addEventListenerWithRef(els.sendButton, 'click', (e) => {
        console.log('发送按钮点击事件触发');
        e.preventDefault();
        if (typeof handleSendMessage === 'function') {
            handleSendMessage();
        } else {
            console.error('handleSendMessage不是函数', handleSendMessage);
        }
    });
    
    addEventListenerWithRef(els.userInput, 'keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('输入框回车事件触发');
            e.preventDefault();
            if (typeof handleSendMessage === 'function') {
                handleSendMessage();
            } else {
                console.error('handleSendMessage不是函数', handleSendMessage);
            }
        }
    });

    // 导出聊天记录事件
    addEventListenerWithRef(els.exportButton, 'click', (e) => {
        e.preventDefault();
        handleExportChat();
    });

    // 清空聊天记录事件
    addEventListenerWithRef(els.clearButton, 'click', (e) => {
        e.preventDefault();
        handleClearChat();
    });
}

/**
 * 清理所有事件监听器
 */
export function cleanup() {
    console.log('正在清理事件监听器...');
    eventListeners.forEach((listeners, element) => {
        listeners.forEach((handler, eventType) => {
            try {
                element.removeEventListener(eventType, handler);
                console.log(`已移除事件监听器: ${eventType} 从元素`, element);
            } catch (error) {
                console.error('移除事件监听器失败:', error);
            }
        });
    });
    eventListeners.clear();
}