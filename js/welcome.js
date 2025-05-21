// 页面载入动画
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// 增强的倒计时逻辑
let countdown = 10;
const countdownElement = document.getElementById('countdown');
const ctaButton = document.querySelector('.cta-buttons');

const countdownInterval = setInterval(() => {
    countdown--;
    if(countdown >= 0) {
        countdownElement.textContent = `${countdown}秒后自动跳转`;
        
        // 当倒计时小于等于3秒时添加紧急样式
        if(countdown <= 3) {
            ctaButton.classList.add('urgent');
        }
    } else {
        clearInterval(countdownInterval);
        window.location.href = 'index.html';
    }
}, 1000);

// 添加鼠标移动视差效果
document.addEventListener('mousemove', function(e) {
    // 仅在非移动设备上启用视差效果
    if (window.innerWidth > 768) {
        const decorations = document.querySelectorAll('.decoration');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        decorations.forEach((decoration, index) => {
            const factor = (index + 1) * 10;
            decoration.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    }
});

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // 按下Enter键时，如果焦点在按钮上，则触发点击
    if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('btn')) {
            focusedElement.click();
        }
    }
});