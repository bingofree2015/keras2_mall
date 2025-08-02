# Git Commit Message 中文翻译功能

## 功能说明

本项目配置了自动将 AI 生成的英文 commit message 翻译为中文的功能。

## 工作原理

1. **Git 钩子**: 使用 `prepare-commit-msg` 钩子在提交时自动触发翻译
2. **翻译脚本**: 使用 Node.js 脚本进行智能翻译
3. **词汇映射**: 包含常见开发词汇的中英文对照

## 支持的翻译词汇

### 常见动词
- `fix` → `修复`
- `feat` → `新增`
- `update` → `更新`
- `refactor` → `重构`
- `remove` → `移除`
- `add` → `添加`
- `delete` → `删除`
- `clean` → `清理`
- `optimize` → `优化`
- `improve` → `改进`
- `enhance` → `增强`
- `implement` → `实现`
- `change` → `修改`
- `modify` → `修改`
- `rename` → `重命名`
- `move` → `移动`
- `merge` → `合并`
- `resolve` → `解决`

### 常见名词
- `error` → `错误`
- `bug` → `缺陷`
- `issue` → `问题`
- `component` → `组件`
- `function` → `函数`
- `method` → `方法`
- `file` → `文件`
- `directory` → `目录`
- `folder` → `文件夹`
- `script` → `脚本`
- `config` → `配置`
- `setting` → `设置`
- `style` → `样式`
- `layout` → `布局`
- `format` → `格式`
- `syntax` → `语法`
- `typo` → `拼写错误`
- `comment` → `注释`
- `documentation` → `文档`
- `readme` → `说明`

### 常见形容词
- `broken` → `损坏的`
- `missing` → `缺失的`
- `invalid` → `无效的`
- `deprecated` → `已弃用的`
- `obsolete` → `过时的`
- `duplicate` → `重复的`
- `unused` → `未使用的`
- `unnecessary` → `不必要的`

## 使用方法

### 自动翻译（推荐）
1. 正常使用 `git commit` 命令
2. 系统会自动检测英文 commit message 并翻译为中文
3. 翻译后的消息会显示在提交确认界面

### 手动翻译
```bash
# 直接使用翻译脚本
node scripts/translate-commit-msg.js .git/COMMIT_EDITMSG

# 或者翻译任意文本
echo "fix bug in login component" | node scripts/translate-commit-msg.js
```

## 示例

### 输入（AI 生成的英文）
```
fix: resolve authentication error in login component
feat: add new user management functionality
refactor: optimize database query performance
```

### 输出（自动翻译为中文）
```
修复: 解决登录组件中的认证错误
新增: 添加新的用户管理功能
重构: 优化数据库查询性能
```

## 配置说明

### 文件位置
- **Git 钩子**: `.git/hooks/prepare-commit-msg`
- **翻译脚本**: `scripts/translate-commit-msg.js`
- **使用说明**: `COMMIT_MESSAGE_TRANSLATION.md`

### 自定义翻译
如需添加新的翻译词汇，请编辑 `scripts/translate-commit-msg.js` 文件中的 `translations` 对象：

```javascript
const translations = {
    // 添加新的翻译
    'your_word': '你的翻译',
    'Your_Word': '你的翻译',
    // ... 其他翻译
};
```

## 注意事项

1. **词汇匹配**: 使用单词边界匹配，避免部分词汇被误替换
2. **大小写敏感**: 分别处理大小写形式
3. **优先级**: 按词汇长度排序，优先替换长词汇
4. **安全性**: 只翻译常见开发词汇，避免误翻译专业术语

## 故障排除

### 翻译不生效
1. 检查 Git 钩子是否可执行：`ls -la .git/hooks/prepare-commit-msg`
2. 检查 Node.js 脚本是否存在：`ls -la scripts/translate-commit-msg.js`
3. 检查 Node.js 是否安装：`node --version`

### 翻译错误
1. 检查翻译脚本中的词汇映射
2. 手动测试翻译：`node scripts/translate-commit-msg.js .git/COMMIT_EDITMSG`
3. 查看 Git 钩子日志

## 禁用功能

如需临时禁用自动翻译，可以：

1. **重命名钩子文件**：
   ```bash
   mv .git/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg.disabled
   ```

2. **使用 --no-verify 跳过钩子**：
   ```bash
   git commit --no-verify -m "your message"
   ```

## 贡献

欢迎提交 Pull Request 来改进翻译词汇表或功能！ 