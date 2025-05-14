/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

import { state } from './state.js';

// 初始化设置页面
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const form = document.getElementById('settingsForm');
    const statusMessage = document.getElementById('settingsStatus');
    const resetButton = document.getElementById('resetSettings');
    const backButton = document.getElementById('backButton');
    
    // 初始化表单值
    document.getElementById('apiEndpoint').value = state.settings.apiEndpoint;
    document.getElementById('apiKey').value = state.settings.apiKey;
    document.getElementById('modelName').value = state.settings.modelName;
    document.getElementById('temperature').value = state.settings.temperature;
    document.getElementById('temperatureValue').textContent = state.settings.temperature;
    document.getElementById('maxTokens').value = state.settings.maxTokens;
    document.getElementById('contextLength').value = state.settings.contextLength;

    // 温度滑动条实时显示
    document.getElementById('temperature').addEventListener('input', function() {
        document.getElementById('temperatureValue').textContent = this.value;
    });

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

            // 保存设置
            state.saveSettings(formData);
            
            // 显示成功消息
            showStatusMessage('设置保存成功！', 'success');
        } catch (error) {
            showStatusMessage(error.message, 'error');
        }
    });

    // 重置按钮处理
    resetButton.addEventListener('click', function() {
        if (confirm('确定要恢复默认设置吗？当前设置将被覆盖')) {
            // 重置表单到默认值
            document.getElementById('apiEndpoint').value = state.settings.apiEndpoint;
            document.getElementById('apiKey').value = '';
            document.getElementById('modelName').value = 'deepseek-chat';
            document.getElementById('temperature').value = '0.7';
            document.getElementById('temperatureValue').textContent = '0.7';
            document.getElementById('maxTokens').value = '4096';
            document.getElementById('contextLength').value = '10';
            
            // 触发表单提交
            form.dispatchEvent(new Event('submit'));
        }
    });

    // 返回按钮处理
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 显示状态消息
    function showStatusMessage(message, type) {
        if (!statusMessage) return;
        
        statusMessage.className = `settings-status ${type}`;
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        
        // 3秒后隐藏消息
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
});