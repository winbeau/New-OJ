# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是 XJU-OJ 在线评测系统的前端项目。这是一个基于 Vue 3 和 TypeScript 的应用程序，使用 Vue CLI 5 构建，主要功能包括：

- 题库浏览
- 比赛参与
- 教程和学习资源
- 每日打卡系统
- 用户管理

## 开发命令

### 安装依赖

```bash
yarn install
```

### 开发服务器

```bash
yarn serve
# 启动热重载开发服务器，默认地址 http://localhost:8080
```

### 构建

```bash
yarn build
# 创建生产环境构建，输出到 /dist 目录
```

### 代码检查

```bash
yarn lint
# 运行 ESLint 并集成 Prettier
# 自动修复可修复的问题
```

## 架构说明

### 技术栈

- **Vue 3** 支持组合式 API
- **TypeScript** (启用严格模式)
- **Vue Router 4** (Hash 模式)
- **Vuex 4** 状态管理
- **PWA** 支持，包含 Service Worker 注册

### 项目结构

```
src/
├── App.vue                  # 根组件，包含主导航栏
├── main.ts                  # 应用入口文件
├── router/index.ts          # 路由定义（除 /about 外均为直接加载）
├── store/index.ts           # Vuex 状态管理（当前为空，可扩展）
├── views/                   # 页面级组件
│   ├── HomeView.vue         # 首页
│   ├── ProblemsView.vue     # 题库页面
│   ├── ContestsView.vue     # 比赛列表页面
│   ├── TutorialsView.vue    # 教程资源页面
│   ├── PunchView.vue        # 每日打卡页面
│   ├── UsrView.vue          # 用户资料/管理页面
│   └── AboutView.vue        # 关于页面（懒加载）
├── components/              # 可复用组件
│   └── HelloWorld.vue       # 示例组件
└── assets/                  # 静态资源（图片、样式等）
```

### 路由策略

- **Hash 模式** (`createWebHashHistory`) - 所有路由使用 `#/` 前缀
- **默认路由**：`/` 重定向到 `/home`
- **懒加载**：仅 `/about` 路由使用代码分割；其他路由均直接加载
- 所有路由在 `/src/router/index.ts` 中定义，使用显式组件导入

### 路径别名

- `@/` 映射到 `src/` 目录（在 `tsconfig.json` 中配置）
- 导入时使用 `@/components/`、`@/views/` 等

### 状态管理

- Vuex store 已初始化但为空（`src/store/index.ts`）
- 添加状态时，遵循 Vuex 4 组合式 API 模式
- 结构：`state → getters → mutations → actions → modules`

### 样式

- 使用 `<style scoped>` 实现组件作用域样式
- 全局样式定义在 `App.vue` 中
- 使用标准 CSS（未配置预处理器）

## 导航结构

应用程序有一个持久的顶部导航栏，包含以下部分：

- **主页** (Home) - `/home`
- **题库** (Problems) - `/problems`
- **比赛** (Contests) - `/contests`
- **教程** (Tutorials) - `/tutorials`
- **打卡** (Punch/Check-in) - `/punch`
- **关于** (About) - `/about`
- **用户** (User) - `/usr`

当前激活的路由以绿色高亮显示（`#42b983`）。

## 开发注意事项

### TypeScript 配置

- 启用严格模式
- 目标版本：ESNext
- 配置路径别名以实现清晰导入
- 类型检查包括 `src/` 中的所有 `.vue`、`.ts`、`.tsx` 文件

### 代码质量

- ESLint 配置：
  - `plugin:vue/vue3-essential`
  - TypeScript 推荐规则
  - Prettier 集成
- Lint 时自动使用 Prettier 格式化

### 浏览器支持

- 仅支持现代浏览器（> 1%，最近 2 个版本）
- 明确排除 IE11
- 除 core-js 外不需要旧版浏览器 polyfills

### Service Worker

- 通过 `registerServiceWorker.ts` 提供 PWA 功能
- Service Worker 在生产构建中自动注册

## 添加新功能

### 添加新路由

1. 在 `src/views/` 中创建视图组件
2. 在 `src/router/index.ts` 中导入
3. 将路由对象添加到 `routes` 数组
4. 如需要，在 `App.vue` 中添加导航链接

### 添加状态管理

当需要使用 Vuex store 时：

1. 定义状态结构和初始值
2. 添加 getters 用于计算状态
3. 添加 mutations 用于同步状态变更
4. 添加 actions 用于异步操作或复杂逻辑
5. 考虑使用 modules 进行功能分离

### 组件开发

- 使用 Vue 3 的 `defineComponent`
- 新组件优先使用组合式 API
- 使用 TypeScript 对 props 和 emits 进行类型定义
- 将可复用组件放在 `src/components/` 中
