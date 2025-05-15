/* 
 * 版权所有 © 2025 XGOUO.CN
 * 保留所有权利
 * 联系方式：QQ-56161944
 */

// 确保state模块可用
let state;

// 初始化关于页面
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 动态导入state模块
        state = await import('./state.js');
        state = state.state;

        // 导入主题模块并初始化主题
        const theme = await import('./theme.js');
        theme.initTheme();

        // 这里可以添加其他初始化逻辑
        console.log('关于页面初始化完成');
    } catch (error) {
        console.error('初始化关于页面失败:', error);
    }
});