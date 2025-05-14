# 项目结构说明

## 目录结构

```
.
├── ai-mask.html       # AI面具功能页面
├── index.html         # 网站主页面
├── knowledge.html     # 知识库页面
├── settings.html      # 设置页面
├── titile.css         # 标题特殊样式
├── css/               # 样式目录
│   ├── base.css      # 基础样式
│   ├── layout.css    # 布局样式
│   ├── components.css # 组件样式
│   └── responsive.css # 响应式样式
├── js/                # 脚本目录
│   ├── ai-mask.js    # AI遮罩功能逻辑
│   ├── api.js        # 接口处理
│   ├── config.js     # 配置管理
│   ├── dom.js        # DOM操作
│   ├── knowledge.js  # 知识库逻辑
│   ├── main.js       # 主入口
│   ├── settings.js   # 设置管理
│   ├── state.js      # 状态管理
│   ├── theme.js      # 主题管理
│   ├── types.js      # 类型定义
│   └── utils.js      # 工具函数
└── README.md         # 项目说明
```

## 核心文件说明

### HTML文件
- `index.html`: 网站主入口页面
- `ai-mask.html`: AI面具功能界面
- `knowledge.html`: 知识库展示页面
- `settings.html`: 系统设置页面

### 样式文件 (css/)
- `base.css`: 基础样式，包含重置样式和通用样式
- `layout.css`: 页面布局和结构样式
- `components.css`: UI组件样式
- `responsive.css`: 响应式布局适配
- `titile.css`: 特殊标题样式

### 脚本文件 (js/)
- `main.js`: 应用程序入口和初始化
- `api.js`: 接口请求和数据处理
- `config.js`: 全局配置项管理
- `dom.js`: DOM元素操作工具
- `settings.js`: 用户设置管理
- `state.js`: 应用状态管理
- `types.js`: 类型定义和常量
- `utils.js`: 通用工具函数
- `ai-mask.js`: AI面具功能实现
- `knowledge.js`: 知识库功能实现
- `theme.js`: 主题切换功能

## 技术依赖

- Markdown解析：marked.js
- 代码高亮：Prism.js（支持多种编程语言）

## 开发规范

1. 样式规范
   - 采用BEM命名
   - 模块化开发
   - 职责单一

2. 代码规范
   - ES6+模块系统
   - 2空格缩进
   - ESLint规则