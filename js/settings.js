
import { CONFIG } from './config.js';
import { state } from './state.js';
import { getElements } from './dom.js';

/**
 * 加载设置到UI
 */
export const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS)) || CONFIG.DEFAULT_SETTINGS;
    const elements = getElements();
    
    document.getElementById('apiEndpoint').value = savedSettings.apiEndpoint;
    document.getElementById('apiKey').value = savedSettings.apiKey;
    document.getElementById('modelName').value = savedSettings.modelName;
    document.getElementById('temperature').value = savedSettings.temperature;
    document.getElementById('temperatureValue').textContent = savedSettings.temperature;
    document.getElementById('maxTokens').value = savedSettings.maxTokens;
    document.getElementById('contextLength').value = savedSettings.contextLength;

    // 更新温度显示
    if (elements.temperatureInput && elements.temperatureValue) {
        elements.temperatureValue.textContent = savedSettings.temperature;
    }
};

/**
 * 保存设置处理函数
 */
export const handleSettingsSave = () => {
    try {
        const elements = getElements();
        const newSettings = {
            apiEndpoint: document.getElementById('apiEndpoint').value,
            apiKey: document.getElementById('apiKey').value,
            modelName: document.getElementById('modelName').value,
            temperature: parseFloat(document.getElementById('temperature').value),
            maxTokens: parseInt(document.getElementById('maxTokens').value),
            contextLength: parseInt(document.getElementById('contextLength').value)
        };
        
        // 验证设置值
        if (isNaN(newSettings.temperature) || newSettings.temperature < 0 || newSettings.temperature > 1) {
            throw new Error('温度值必须在0到1之间');
        }
        if (isNaN(newSettings.maxTokens) || newSettings.maxTokens < 1) {
            throw new Error('最大token数必须大于0');
        }
        if (isNaN(newSettings.contextLength) || newSettings.contextLength < 1) {
            throw new Error('上下文长度必须大于0');
        }

        state.saveSettings(newSettings);
        elements.settingsPanel.classList.remove('active');
        alert('设置已保存');
    } catch (error) {
        alert(error.message);
    }
};
