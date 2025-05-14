
import { CONFIG } from './config.js';
import { MessageType } from './types.js';
import { state } from './state.js';
import { initializeElements, getElements, addMessage, setupDOMListeners } from './dom.js';
import { sendMessage } from './api.js';
import { loadSettings, handleSettingsSave } from './settings.js';

/**
 * 消息发送处理函数
 */
const handleSend = async () => {
    const elements = getElements();
    const input = elements.userInput;
    const message = input.value.trim();
    
    if (message && !state.isLoading) {
        try {
            state.setLoading(true); // 设置加载状态
            // 清空输入框并添加用户消息
            input.value = '';
            addMessage(message, MessageType.USER);
            
            // 发送消息到API
            await sendMessage(message);
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
const handleClear = () => {
    const elements = getElements();
    if (confirm('确定要清空所有对话吗？')) {
        try {
            state.clearHistory();
            elements.chatMessages.innerHTML = '<div class="message ai-message">您好！我是DeepSeek AI助手，有什么可以帮您的？</div>';
        } catch (error) {
            console.error('清空对话失败:', error);
            alert('清空对话失败：' + error.message);
        }
    }
};

/**
 * 导出对话处理函数
 */
const handleExport = () => {
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
 * 初始化应用
 */
const initializeApp = () => {
    try {
        // 初始化DOM元素
        initializeElements();
        
        // 加载设置
        loadSettings();
        
        console.log('API initialized with endpoint:', state.settings.apiEndpoint);
        
        // 设置事件监听器
        setupDOMListeners({
            handleSend,
            handleSettingsSave,
            handleClear,
            handleExport
        });

        // 禁用输入框的默认Enter行为
        const elements = getElements();
        elements.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
            }
        });

        // 设置输入框自动调整高度
        elements.userInput.addEventListener('input', () => {
            elements.userInput.style.height = 'auto';
            elements.userInput.style.height = elements.userInput.scrollHeight + 'px';
        });

    } catch (error) {
        console.error('初始化失败:', error);
        alert('应用初始化失败，请刷新页面重试。错误信息：' + error.message);
    }
};

// 初始化设置页面
document.addEventListener('DOMContentLoaded', function() {
    // 仅在设置页面执行以下代码
    if (!document.getElementById('settingsForm')) return;

    const form = document.getElementById('settingsForm');
    const statusMessage = document.getElementById('settingsStatus');
    const resetButton = document.getElementById('resetSettings');
    const rangeInputs = {
        temperature: {
            input: document.getElementById('temperature'),
            valueDisplay: document.getElementById('temperatureValue')
        }
    };

    // 同步范围输入和数值显示
    Object.entries(rangeInputs).forEach(([key, {input, valueDisplay}]) => {
        if (input && valueDisplay) {
            input.addEventListener('input', () => {
                valueDisplay.textContent = input.value;
            });
        }
    });

    // 温度滑动条实时显示
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperatureValue');
    
    if (temperatureSlider && temperatureValue) {
        // 强制初始值更新
        temperatureValue.textContent = temperatureSlider.value;
        
        // 添加滑动事件
        temperatureSlider.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
        });
        
        // 添加调试日志
        console.log('温度控件初始化成功:', temperatureSlider.value);
    } else {
        console.error('温度控件未找到: ', {slider: temperatureSlider, value: temperatureValue});
    }

    // 温度文本框验证
    const temperatureInput = document.getElementById('temperature');
    
    if (temperatureInput) {
        // 初始化时验证默认值
        validateTemperature(temperatureInput.value);
        
        // 添加输入验证
        temperatureInput.addEventListener('input', function() {
            const value = this.value;
            if (!validateTemperature(value)) {
                this.setCustomValidity('请输入0-1之间的数字');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // 验证和收集表单数据
            const formData = {
                apiEndpoint: document.getElementById('apiEndpoint').value.trim(),
                apiKey: document.getElementById('apiKey').value.trim(),
                modelName: document.getElementById('modelName').value,
                temperature: parseFloat(document.getElementById('temperature').value),
                maxTokens: parseInt(document.getElementById('maxTokens').value, 10),
                contextLength: parseInt(document.getElementById('contextLength').value, 10)
            };

            // 基本验证
            if (!formData.apiEndpoint || !formData.apiKey) {
                throw new Error('API地址和密钥为必填项');
            }

            if (!/https?:\/\/[^\s]+/.test(formData.apiEndpoint)) {
                throw new Error('请输入有效的API地址（包含http/https协议）');
            }

            if (isNaN(formData.maxTokens) || formData.maxTokens < 1 || formData.maxTokens > 8192) {
                throw new Error('最大输出长度必须在1-8192之间');
            }

            if (isNaN(formData.contextLength) || formData.contextLength < 1 || formData.contextLength > 50) {
                throw new Error('上下文长度必须在1-50之间');
            }

            // 保存到localStorage
            localStorage.setItem('deepseekSettings', JSON.stringify(formData));
            
            // 显示成功消息
            if (statusMessage) {
                statusMessage.className = 'settings-status success';
                statusMessage.textContent = '设置保存成功！';
                statusMessage.style.display = 'block';
            }

            // 3秒后隐藏消息
            setTimeout(() => {
                if (statusMessage) statusMessage.style.display = 'none';
            }, 3000);

        } catch (error) {
            // 显示错误消息
            if (statusMessage) {
                statusMessage.className = 'settings-status error';
                statusMessage.textContent = error.message;
                statusMessage.style.display = 'block';
            }
        }
    });

    // 重置按钮处理
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('确定要恢复默认设置吗？当前设置将被覆盖')) {
                // 重置表单到默认值
                document.getElementById('apiEndpoint').value = 'https://api.deepseek.com/v1/chat/completions';
                document.getElementById('apiKey').value = '';
                document.getElementById('modelName').value = 'deepseek-chat';
                document.getElementById('temperature').value = '0.7';
                document.getElementById('temperatureValue').textContent = '0.7';
                document.getElementById('maxTokens').value = '4096';
                document.getElementById('contextLength').value = '10';

                // 触发表单提交
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    }
});

// 验证温度值函数
function validateTemperature(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 1 && /^\d*\.?\d+$/.test(value);
}

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);

// 导出处理函数供其他模块使用
export {
    handleSend,
    handleClear,
    handleExport
};