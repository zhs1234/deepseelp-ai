# 项目结构

```
.
├── index.html              # 主页面
├── css/                    # 样式文件目录
│   ├── base.css           # 基础样式
│   ├── layout.css         # 布局样式
│   ├── components.css     # 组件样式
│   └── responsive.css     # 响应式样式
├── js/                    # JavaScript文件目录
│   ├── index.js          # 主入口文件
│   ├── api.js            # API相关功能
│   ├── dom.js            # DOM操作工具
│   ├── messageHandler.js  # 消息处理
│   ├── settings.js       # 设置管理
│   ├── types.js          # 类型定义
│   └── utils.js          # 工具函数
└── README.md             # 项目说明文档

## 文件说明

### HTML文件
- `index.html`: 主页面，包含应用的HTML结构

### CSS文件
- `base.css`: 基础样式，包含通用元素样式
- `layout.css`: 布局相关样式，处理页面结构
- `components.css`: 组件样式，包含具体UI组件样式
- `responsive.css`: 响应式样式，处理不同屏幕尺寸

### JavaScript文件
- `index.js`: 应用入口，初始化和主要逻辑
- `api.js`: API请求处理
- `dom.js`: DOM操作相关工具函数
- `messageHandler.js`: 消息处理和显示
- `settings.js`: 设置面板管理
- `types.js`: 类型定义和常量
- `utils.js`: 通用工具函数

## 依赖说明

### 外部库
- marked.js: Markdown解析
- Prism.js: 代码高亮
  - JavaScript语法支持
  - Python语法支持
  - Java语法支持
  - C++语法支持
  - C#语法支持
  - CSS语法支持
  - HTML语法支持

## 开发说明

1. 样式开发
   - 遵循模块化CSS原则
   - 使用BEM命名规范
   - 保持样式文件的单一职责

2. JavaScript开发
   - 使用ES6+模块系统
   - 遵循单一职责原则
   - 保持代码清晰可维护

3. 代码规范
   - 使用2空格缩进
   - 遵循ESLint规则
   - 保持一致的代码风格
```
