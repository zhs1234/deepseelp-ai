.
├── favicon.ico       # 网站图标文件（浏览器标签页显示）
├── js/state.js       # 应用状态管理（含消息持久化功能）
├── ai-mask.html       # AI面具功能页面（多角色切换系统）
├── index.html         # 网站主页面
├── knowledge.html     # 知识库展示页面
├── settings.html      # 系统设置页面
├── titile.css         # 特殊标题样式
├── css/               # 样式目录
│   ├── base.css      # 基础样式（重置样式、通用样式）
│   ├── layout.css    # 页面布局和结构样式
│   ├── components.css # UI组件样式（按钮、卡片等）
│   └── responsive.css # 响应式布局适配
├── js/                # 脚本目录
│   ├── ai-mask.js    # AI面具功能实现（多角色提示词系统）
│   ├── api.js        # 接口处理（消息发送/接收）
│   ├── config.js     # 配置管理（API密钥、模型参数）
│   ├── dom.js        # DOM操作工具（元素管理、事件绑定）
│   ├── knowledge.js  # 知识库逻辑（知识库数据管理）
│   ├── main.js       # 主入口（应用初始化）
│   ├── settings.js   # 设置管理（用户偏好存储）
│   ├── state.js      # 应用状态管理（对话历史、加载状态）
│   ├── types.js      # 类型定义（消息类型、常量）
│   └── utils.js      # 通用工具函数（数据处理、辅助函数）
└── README.md         # 项目说明
```

## 核心文件说明

### HTML文件
- `index.html`: 网站主入口页面，包含对话交互界面
- `ai-mask.html`: AI面具功能界面，展示预设角色及提示词模板
- `knowledge.html`: 知识库展示页面，显示知识库内容
- `settings.html`: 系统设置页面，管理用户配置

### 样式文件 (css/)
- `base.css`: 基础样式，包含样式重置和全局样式设置
- `layout.css`: 页面布局样式，定义主要容器和布局结构
- `components.css`: UI组件样式，包含按钮、卡片、输入框等组件样式
- `responsive.css`: 响应式布局样式，适配不同屏幕尺寸
- `titile.css`: 特殊标题样式，用于页面标题的特殊视觉效果

### 脚本文件 (js/)
- `main.js`: 应用程序入口和初始化，负责模块整合
- `api.js`: API接口处理模块，负责与AI服务通信
- `config.js`: 全局配置管理模块，存储应用配置
- `dom.js`: DOM操作工具模块，管理DOM元素和事件
- `settings.js`: 用户设置管理模块，处理配置持久化
- `state.js`: 应用状态管理模块，维护全局状态机
- `types.js`: 类型定义模块，定义应用常量和类型
- `utils.js`: 通用工具函数模块，提供辅助函数
- `ai-mask.js`: AI面具功能模块，实现角色管理和提示词复制
- `knowledge.js`: 知识库功能模块，管理知识库数据
- `theme.js`: 主题切换模块，实现深色/浅色主题切换

## 技术依赖

- Markdown解析：marked.js
- 代码高亮：Prism.js（支持多种编程语言）

## 开发规范

1. 样式规范
   - 采用BEM命名规范
   - 模块化开发原则
   - 单一职责原则

2. 代码规范
   - ES6+模块系统
   - 2空格缩进
   - ESLint代码检查
- 错误处理：统一try-catch和console.error记录
- 事件管理：使用事件委托提高性能