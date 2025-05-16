// 主题管理
const themes = {
    light: {
        '--bg-color': '#ffffff',
        '--text-color': '#333333',
        '--primary-color': '#2563eb',
        '--secondary-color': '#f3f4f6',
        '--border-color': '#e5e7eb'
    }
};

// 应用主题
function applyTheme() {
    const root = document.documentElement;
    
    Object.entries(themes.light).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// 初始化主题
function initTheme() {
    applyTheme('light');
}

// 设置主题切换按钮事件 (功能已移除)
function setupThemeButtons() {
    // 暗黑模式功能已移除
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeButtons();
});