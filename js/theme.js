// 主题管理
const themes = {
    light: {
        '--bg-color': '#ffffff',
        '--text-color': '#333333',
        '--primary-color': '#2563eb',
        '--secondary-color': '#f3f4f6',
        '--border-color': '#e5e7eb'
    },
    dark: {
        '--bg-color': '#1a1a1a',
        '--text-color': '#f3f4f6',
        '--primary-color': '#3b82f6',
        '--secondary-color': '#2d2d2d',
        '--border-color': '#4b5563'
    }
};

// 应用主题
function applyTheme(themeName) {
    const theme = themes[themeName] || themes.light;
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
    
    localStorage.setItem('theme', themeName);
}

// 初始化主题
function initTheme() {
    // 检查本地存储或系统偏好
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

// 设置主题切换按钮事件
function setupThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.classList.contains('light') ? 'light' :
                          btn.classList.contains('dark') ? 'dark' : 'system';
            
            if (theme === 'system') {
                localStorage.removeItem('theme');
                initTheme();
            } else {
                applyTheme(theme);
            }
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeButtons();
});