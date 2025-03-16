import { CONFIG } from './config.js';
import { MessageType } from './types.js';

/**
 * 聊天状态管理类
 */
export class ChatState {
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
            const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : CONFIG.DEFAULT_SETTINGS;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return CONFIG.DEFAULT_SETTINGS;
        }
    }

    /**
     * 保存设置
     * @param {Object} settings 要保存的设置
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            this.settings = settings;
        } catch (error) {
            console.error('Failed to save settings:', error);
            throw new Error('设置保存失败');
        }
    }

    /**
     * 添加消息到历史记录
     * @param {Object} message 消息对象
     */
    addMessage(message) {
        this.history.push({
            ...message,
            timestamp: new Date().toISOString()
        });
        this.trimHistory();
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * 裁剪历史记录到指定长度
     */
    trimHistory() {
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
     * 设置加载状态
     * @param {boolean} loading 是否正在加载
     */
    setLoading(loading) {
        this.isLoading = loading;
    }

    /**
     * 设置错误信息
     * @param {string|null} error 错误信息
     */
    setError(error) {
        this.error = error;
    }
}

// 创建并导出状态实例
export const state = new ChatState();
