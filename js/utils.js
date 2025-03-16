/**
 * 工具函数集合
 */
export const utils = {
    /**
     * 防抖函数
     * @param {Function} func 要执行的函数
     * @param {number} wait 等待时间（毫秒）
     * @returns {Function} 防抖处理后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 复制文本到剪贴板
     * @param {string} text 要复制的文本
     * @returns {Promise<boolean>} 是否复制成功
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    /**
     * 安全的JSON解析
     * @param {string} data 要解析的JSON字符串
     * @param {any} fallback 解析失败时的返回值
     * @returns {any} 解析结果或fallback值
     */
    safeJSONParse(data, fallback = null) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('JSON解析失败:', e);
            return fallback;
        }
    }
};
