/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

// 确保state模块可用
let state;

// 状态消息显示函数
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('settingsStatus');
    if (!statusMessage) return;
    
    statusMessage.className = `settings-status ${type}`;
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    
    // 5秒后隐藏消息
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// 表单提交处理
function handleFormSubmit(e) {
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

        // 保存设置
        state.saveSettings(formData);
        
        // 显示成功消息
        showStatusMessage('设置保存成功！', 'success');
    } catch (error) {
        showStatusMessage(error.message, 'error');
    }
}

// 初始化设置页面
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 动态导入state模块
        state = await import('./state.js');
        state = state.state;
        
        // 获取所有需要的DOM元素
        const form = document.getElementById('settingsForm');
        const statusMessage = document.getElementById('settingsStatus');
        const resetButton = document.getElementById('resetSettings');
        const temperatureInput = document.getElementById('temperature');
        const temperatureValue = document.getElementById('temperatureValue');
        
        if (!form || !statusMessage || !resetButton || !temperatureInput || !temperatureValue) {
            console.error('找不到必要的DOM元素');
            return;
        }
    
        // 初始化表单值
        document.getElementById('apiEndpoint').value = state.settings.apiEndpoint;
        document.getElementById('apiKey').value = state.settings.apiKey;
        document.getElementById('modelName').value = state.settings.modelName;
        document.getElementById('temperature').value = state.settings.temperature;
        document.getElementById('temperatureValue').textContent = state.settings.temperature;
        document.getElementById('maxTokens').value = state.settings.maxTokens;
        document.getElementById('contextLength').value = state.settings.contextLength;

        // 温度滑动条实时显示
        temperatureInput.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
        });

        // 输入字段即时验证
        document.getElementById('apiEndpoint').addEventListener('input', function() {
            const isValid = /https?:\/\/[^\s]+/.test(this.value.trim());
            this.classList.toggle('invalid', !isValid);
        });

        document.getElementById('maxTokens').addEventListener('input', function() {
            const value = parseInt(this.value, 10);
            const isValid = !isNaN(value) && value >= 1 && value <= 8192;
            this.classList.toggle('invalid', !isValid);
        });

        document.getElementById('contextLength').addEventListener('input', function() {
            const value = parseInt(this.value, 10);
            const isValid = !isNaN(value) && value >= 1 && value <= 50;
            this.classList.toggle('invalid', !isValid);
        });

        // 表单提交处理
        form.addEventListener('submit', handleFormSubmit);

        // 重置按钮处理
        resetButton.addEventListener('click', function() {
            if (confirm('确定要恢复默认设置吗？当前设置将被覆盖')) {
                // 重置表单到默认值
                document.getElementById('apiEndpoint').value = 'https://api.deepseek.com/v1/chat/completions';
                document.getElementById('apiKey').value = '';
                document.getElementById('modelName').value = 'deepseek-chat';
                document.getElementById('temperature').value = '0.7';
                document.getElementById('temperatureValue').textContent = '0.7';
                document.getElementById('maxTokens').value = '4096';
                document.getElementById('contextLength').value = '10';
                
                // 显示重置成功消息
                showStatusMessage('设置已重置为默认值', 'success');
            }
        });
    } catch (error) {
        console.error('初始化设置页面失败:', error);
        showStatusMessage('初始化设置页面失败', 'error');
    }
});