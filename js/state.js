/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

import { CONFIG } from './config.js';

// 应用状态管理
class AppState {
    constructor() {
        this.history = [];
        this.isLoading = false;
        this.error = null;
        this.settings = this.loadSettings();
    }

    /**
     * 加载设置
     * @returns {Object} 设置对象
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('deepseekSettings');
            const defaultSettings = CONFIG.DEFAULT_SETTINGS;

            if (!savedSettings) {
                return defaultSettings;
            }

            const parsedSettings = JSON.parse(savedSettings);
            return { ...defaultSettings, ...parsedSettings };
        } catch (error) {
            console.error('加载设置失败:', error);
            return CONFIG.DEFAULT_SETTINGS;
        }
    }

    /**
     * 保存设置
     * @param {Object} newSettings 新设置
     */
    saveSettings(newSettings) {
        try {
            this.settings = { ...this.settings, ...newSettings };
            localStorage.setItem('deepseekSettings', JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.error('保存设置失败:', error);
            return false;
        }
    }

    /**
     * 添加消息到历史记录
     * @param {Object} message 消息对象
     */
    addMessage(message) {
        this.history.push(message);
        
        // 保持历史记录在上下文长度范围内
        if (this.history.length > this.settings.contextLength * 2) {
            this.history = this.history.slice(-this.settings.contextLength * 2);
        }
    }

    /**
     * 获取历史记录
     * @returns {Array} 历史记录数组
     */
    getHistory() {
        return this.history;
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * 设置加载状态
     * @param {boolean} isLoading 是否加载中
     */
    setLoading(isLoading) {
        this.isLoading = isLoading;
    }

    /**
     * 设置错误状态
     * @param {string|null} error 错误信息
     */
    setError(error) {
        this.error = error;
    }
}

// 创建并导出单例
export const state = new AppState();