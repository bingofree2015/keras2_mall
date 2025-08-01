# 重要组件说明 - 请勿删除必需方法

## ⚠️ 重要提醒

**请不要删除 `src/views/order/after_sale.vue` 文件中的 `props` 和 `columns` 方法！**

这些方法是组件正常工作的必需部分，删除它们会导致运行时错误。

## 错误信息

如果删除这些方法，您会看到以下错误：

```
Property "props" was accessed during render but is not defined on instance.
```

## 为什么这些方法是必需的

### 1. 模板依赖
在 `src/views/order/after_sale.vue` 的模板中，这些方法被直接使用：

```vue
<template>
    <!-- 搜索表单中使用 props -->
    <el-select v-model="filters.key">
        <el-option
            v-for="item in props"  <!-- 这里使用了 props -->
            :key="item.prop"
            :label="item.label"
            :value="item.prop"
        />
    </el-select>
    
    <!-- 表格中使用 columns -->
    <ext-table
        :columns="columns"  <!-- 这里使用了 columns -->
        :data="paginated.list"
        <!-- 其他属性 -->
    />
</template>
```

### 2. 功能依赖
- **搜索功能**：`props` 方法提供搜索表单的字段选项
- **表格显示**：`columns` 方法定义表格的列结构
- **国际化支持**：这些方法返回响应式数据，支持多语言切换

## 正确的组件结构

```javascript
computed: {
    operationWidth: {
        get() {
            let _operationWidth = 0;
            if (Array.isArray(this.operations)) {
                _operationWidth += this.operations.length * 120;
            }
            return _operationWidth;
        },
    },
    // ✅ 必需的方法 - 请勿删除
    props() {
        return [{ prop: 'afterSaleId', label: this.$t('afterSale.afterSaleId') }];
    },
    // ✅ 必需的方法 - 请勿删除
    columns() {
        return [
            { prop: 'id', label: 'ID', minWidth: 60 },
            { prop: 'afterSaleId', label: this.$t('afterSale.afterSaleId'), minWidth: 120 },
            { prop: 'orderId', label: this.$t('afterSale.orderId'), minWidth: 120 },
            { prop: 'status', label: this.$t('afterSale.status'), minWidth: 90 },
            { prop: 'type', label: this.$t('afterSale.type'), minWidth: 90 },
            { prop: 'user.username', label: this.$t('afterSale.user'), minWidth: 110 },
            { prop: 'refund', label: this.$t('afterSale.refund'), minWidth: 100 },
            { prop: 'reason', label: this.$t('afterSale.reason'), minWidth: 180, showOverflowTooltip: true },
            {
                prop: 'createdAt',
                label: this.$t('afterSale.applicationTime'),
                minWidth: 130,
                formatter: this.env.formatDateTime,
            },
        ];
    },
},
```

## 如果您想修改这些方法

如果您需要修改这些方法的行为，请：

1. **不要删除方法**，而是修改其内容
2. **保持方法名称不变**（`props` 和 `columns`）
3. **确保返回值格式正确**

### 示例：添加更多搜索字段

```javascript
props() {
    return [
        { prop: 'afterSaleId', label: this.$t('afterSale.afterSaleId') },
        { prop: 'orderId', label: this.$t('afterSale.orderId') },  // 添加新字段
        { prop: 'status', label: this.$t('afterSale.status') },    // 添加新字段
    ];
},
```

### 示例：修改表格列

```javascript
columns() {
    return [
        { prop: 'id', label: 'ID', minWidth: 60 },
        { prop: 'afterSaleId', label: this.$t('afterSale.afterSaleId'), minWidth: 120 },
        // 可以添加、删除或修改列，但保持数组格式
    ];
},
```

## 验证方法

在修改后，请运行以下命令验证：

```bash
# 检查语法错误
npm run lint -- --fix src/views/order/after_sale.vue

# 启动开发服务器
npm run dev
```

## 常见问题

### Q: 为什么我不能删除这些方法？
A: 因为模板中使用了这些方法，Vue组件要求所有模板中使用的属性都必须在组件实例中定义。

### Q: 我可以重命名这些方法吗？
A: 不建议重命名，因为模板中直接使用了这些名称。如果重命名，需要同时修改模板中的引用。

### Q: 这些方法可以移到 data 中吗？
A: 不建议，因为这些方法返回响应式数据，支持国际化。computed 属性更适合这种场景。

## 总结

- ✅ **可以修改**：方法的内容和返回值
- ❌ **不能删除**：方法本身
- ❌ **不能重命名**：方法名称（除非同时修改模板）

请保持这些方法的存在，以确保组件正常工作！ 