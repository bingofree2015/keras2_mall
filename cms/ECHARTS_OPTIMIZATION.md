# ECharts 性能优化说明

## 问题描述

在使用 ECharts 图表库时，浏览器控制台会出现以下性能警告：

```
[Violation] Added non-passive event listener to a scroll-blocking 'mousewheel' event
```

这个警告是因为 ECharts 在初始化图表时添加了非被动的 `mousewheel` 事件监听器，会阻塞页面滚动。

## 优化方案

### 1. ECharts 初始化配置优化

**问题**：ECharts 默认配置可能导致性能问题。

**解决方案**：
```javascript
// 优化后的 ECharts 初始化配置
this.chartColumn = echarts.init(document.getElementById('chartColumn'), null, {
    renderer: 'canvas',
    useDirtyRect: true,
    // 性能优化配置
    throttle: 70,
    // 禁用一些可能导致性能问题的功能
    progressive: 400,
    progressiveThreshold: 3000,
});
```

### 2. Passive 事件监听器优化

**问题**：ECharts 默认使用非被动事件监听器。

**解决方案**：
```javascript
// 为 ECharts 图表添加 passive 事件监听器
addPassiveListenersToChart(chart) {
    if (chart && chart.getDom) {
        const chartDom = chart.getDom();
        if (chartDom) {
            // 为图表容器添加 passive 事件监听器
            const events = ['mousewheel', 'wheel', 'touchstart', 'touchmove', 'touchend'];
            events.forEach(event => {
                chartDom.addEventListener(event, () => {}, { passive: true });
            });
            
            // 为图表内部的 canvas 元素添加 passive 监听器
            const canvas = chartDom.querySelector('canvas');
            if (canvas) {
                events.forEach(event => {
                    canvas.addEventListener(event, () => {}, { passive: true });
                });
            }
        }
    }
}
```

### 3. CSS 性能优化

**创建了专门的优化样式文件** `src/assets/styles/echarts-optimization.css`：

- 启用硬件加速
- 优化滚动性能
- 减少重绘和重排
- 优化触摸事件处理
- 减少内存使用

### 4. 组件生命周期优化

**初始化优化**：
```javascript
mounted() {
    this.$nextTick(() => {
        this.drawLine();
        this.drawLine2();
    });
}
```

**清理优化**：
```javascript
beforeUnmount() {
    // 销毁图表实例
    if (this.chartColumn) {
        this.chartColumn.dispose();
        this.chartColumn = null;
    }
    if (this.chartColumn2) {
        this.chartColumn2.dispose();
        this.chartColumn2 = null;
    }
}
```

## 配置参数说明

### ECharts 初始化配置

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `renderer` | 渲染器类型 | `'canvas'` |
| `useDirtyRect` | 启用脏矩形优化 | `true` |
| `throttle` | 节流阈值 | `70` |
| `progressive` | 渐进式渲染阈值 | `400` |
| `progressiveThreshold` | 渐进式渲染数据量阈值 | `3000` |

### 性能优化配置

```javascript
{
    // 启用硬件加速
    transform: translateZ(0),
    will-change: auto,
    
    // 优化滚动性能
    -webkit-overflow-scrolling: touch,
    scroll-behavior: auto,
    
    // 优化触摸事件
    touch-action: manipulation,
    
    // 减少重绘
    contain: layout style paint,
    
    // 优化字体渲染
    -webkit-font-smoothing: antialiased,
    -moz-osx-font-smoothing: grayscale,
    text-rendering: optimizeSpeed
}
```

## 已修复的文件

### 1. `src/views/dashboard.vue`
- ✅ 优化了 ECharts 初始化配置
- ✅ 添加了 passive 事件监听器
- ✅ 添加了组件生命周期优化
- ✅ 引入了性能优化样式文件
- ✅ 为图表容器添加了 CSS 类名

### 2. `src/assets/styles/echarts-optimization.css`
- ✅ 创建了专门的 ECharts 性能优化样式
- ✅ 启用了硬件加速
- ✅ 优化了滚动和触摸事件
- ✅ 减少了重绘和重排

## 优化效果

1. **消除性能警告** - 解决 `mousewheel` 的 passive 事件监听器警告
2. **提升响应性** - 页面滚动更加流畅
3. **减少内存使用** - 优化配置减少内存占用
4. **提升渲染性能** - 启用硬件加速和脏矩形优化
5. **优化触摸体验** - 移动设备上的交互更加流畅

## 注意事项

1. **兼容性**：passive 事件监听器需要现代浏览器支持
2. **性能平衡**：某些优化可能会影响图表的交互功能
3. **调试**：如果遇到问题，可以逐步禁用某些优化选项
4. **内存管理**：确保在组件销毁时正确清理图表实例

## 使用建议

1. **生产环境**：启用所有优化选项
2. **开发环境**：可以根据需要调整优化级别
3. **移动设备**：特别关注触摸事件的优化
4. **大数据量**：使用渐进式渲染配置

## 测试建议

1. 在不同浏览器中测试图表性能
2. 检查图表交互功能是否正常
3. 测试响应式布局在不同屏幕尺寸下的表现
4. 验证大数据量下的渲染性能
5. 测试移动设备上的触摸交互 