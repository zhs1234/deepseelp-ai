/**
 * 应用配置常量
 */
export const CONFIG = {
    // 默认设置项
    DEFAULT_SETTINGS: {
        apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: '',
        // 支持的模型：deepseek-chat, deepseek-reasoner
        modelName: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 4096,
        contextLength: 10
    },
    DEBOUNCE_DELAY: 300,
    STORAGE_KEYS: {
        SETTINGS: 'chatSettings',
        HISTORY: 'chatHistory'
    }
};
