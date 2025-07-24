# 升级迁移 TODO

## 依赖升级/替换清单

### 1. Vue 相关
- [ ] vue 升级到 ^3.x
- [ ] vue-router 升级到 ^4.x
- [ ] vuex 升级到 ^4.x
- [ ] element-ui 替换为 element-plus
- [ ] vue-i18n 升级到 ^9.x
- [ ] vue-loader 升级到 vue-loader@next 或使用 vite 插件
- [ ] vue-template-compiler 替换为 @vue/compiler-sfc

### 2. 构建工具
- [ ] 移除 webpack 相关依赖，改用 vite
- [ ] html-webpack-plugin、webpack-bundle-analyzer 等查找 vite 插件替代

### 3. 其他依赖
- [ ] echarts 升级到 ^5.x
- [ ] tinymce 升级到 ^6.x
- [ ] eslint-plugin-vue 升级到支持 vue3 的版本
- [ ] vant、vue-amap、vue-cropper、vuedraggable 等查 vue3 兼容性

### 4. 兼容性与适配
- [ ] 检查所有依赖的 vue3 兼容性，替换或升级不兼容的包
- [ ] 逐步迁移代码，保证每一步可运行

---

> 本文档用于跟踪升级进度，升级时请逐项打勾并记录遇到的问题和解决方案。 