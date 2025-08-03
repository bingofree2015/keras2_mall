# TinyMCE 性能优化说明

## 问题描述

在使用 TinyMCE 编辑器时，浏览器控制台会出现以下性能警告：

1. **非被动事件监听器警告**：
   ```
   [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event
   [Violation] Added non-passive event listener to a scroll-blocking 'touchmove' event
   ```

2. **document.write() 警告**：
   ```
   [Violation] Avoid using document.write()
   ```

3. **加载时间警告**：
   ```
   [Violation] 'load' handler took XXXms
   ```

## 优化方案

### 1. 事件监听器优化

**问题**：TinyMCE 默认使用非被动事件监听器，会阻塞页面滚动。

**解决方案**：
- 在 `setup` 函数中为编辑器容器添加 passive 事件监听器
- 为 `touchstart`、`touchmove`、`touchend` 事件添加 passive 选项
- 使用 MutationObserver 全局监听 DOM 变化，为新增的 TinyMCE 元素自动添加 passive 监听器
- 为编辑器内部元素（body、toolbar）也添加 passive 监听器

```javascript
// 添加 passive 事件监听器
const addPassiveEventListener = (element, event, handler) => {
    if (element && element.addEventListener) {
        element.addEventListener(event, handler, { passive: true });
    }
};

// 为编辑器容器添加 passive 事件监听器
editor.on('init', () => {
    const editorContainer = editor.getContainer();
    if (editorContainer) {
        addPassiveEventListener(editorContainer, 'touchstart', () => {});
        addPassiveEventListener(editorContainer, 'touchmove', () => {});
        addPassiveEventListener(editorContainer, 'touchend', () => {});
        
        // 为编辑器内部元素添加 passive 监听器
        const editorBody = editor.getBody();
        if (editorBody) {
            addPassiveEventListener(editorBody, 'touchstart', () => {});
            addPassiveEventListener(editorBody, 'touchmove', () => {});
            addPassiveEventListener(editorBody, 'touchend', () => {});
        }
        
        // 为工具栏添加 passive 监听器
        const toolbar = editorContainer.querySelector('.tox-toolbar');
        if (toolbar) {
            addPassiveEventListener(toolbar, 'touchstart', () => {});
            addPassiveEventListener(toolbar, 'touchmove', () => {});
            addPassiveEventListener(toolbar, 'touchend', () => {});
        }
    }
});

// 全局 MutationObserver 监听 DOM 变化
addGlobalPassiveListeners() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.addPassiveListenersToElement(node);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}
```

### 2. 配置优化

**性能相关配置**：
```javascript
{
    // 禁用自动聚焦
    auto_focus: false,
    
    // 添加缓存后缀
    cache_suffix: '?v=' + Date.now(),
    
    // 禁用图片粘贴
    paste_data_images: false,
    
    // 禁用对象调整大小
    object_resizing: false,
    
    // 禁用元素路径显示
    elementpath: false,
    
    // 禁用 HTML 验证
    verify_html: false,
    
    // 禁用清理功能
    cleanup: false,
    
    // 禁用拼写检查
    browser_spellcheck: false,
    
    // 禁用可能导致 document.write() 的功能
    inline: false,
    fixed_toolbar_container: false,
    
    // 优化渲染
    entity_encoding: 'raw',
    encoding: 'html'
}
```

### 3. CSS 优化

**创建了专门的优化样式文件** `src/assets/styles/tinymce-optimization.css`：

- 禁用不必要的动画和过渡效果
- 优化滚动性能
- 减少重绘和重排
- 优化触摸事件处理
- 减少内存使用

### 4. 初始化优化

**在 `init()` 方法中添加性能配置**：
```javascript
// 添加性能优化配置
this.defaultConfig.auto_focus = false;
this.defaultConfig.cache_suffix = '?v=' + Date.now();
this.defaultConfig.paste_data_images = false;
this.defaultConfig.paste_as_text = false;
this.defaultConfig.paste_enable_default_filters = true;
```

## 优化效果

1. **减少性能警告**：消除或减少浏览器控制台的性能警告
2. **提升响应性**：页面滚动更加流畅
3. **减少内存使用**：禁用不必要的功能减少内存占用
4. **提升加载速度**：优化配置减少初始化时间

## 注意事项

1. **功能影响**：某些优化可能会禁用一些功能（如拼写检查、对象调整大小等）
2. **兼容性**：passive 事件监听器需要现代浏览器支持
3. **调试**：如果遇到问题，可以逐步禁用某些优化选项

## 使用建议

1. 在生产环境中启用所有优化
2. 在开发环境中可以根据需要调整优化级别
3. 定期监控编辑器性能，根据需要进一步优化 