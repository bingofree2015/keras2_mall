const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
    'src/views/marketing/advert_position.vue',
    'src/views/marketing/notice.vue',
    'src/views/user/user_grade.vue',
    'src/views/user/index.vue',
    'src/views/marketing/article_type.vue',
    'src/views/preference/store.vue',
    'src/views/preference/area.vue',
    'src/views/wechat/message/index.vue',
    'src/views/preference/logistics.vue',
    'src/views/preference/ship/edit.vue',
    'src/views/goods/goods_spec.vue',
    'src/views/wechat/edit_menu.vue',
    'src/views/goods/goods_comment.vue',
    'src/views/goods/goods_type.vue',
    'src/views/goods/goods_param.vue',
    'src/views/form/index2.vue'
];

function fixLargeSize(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // 检查是否已经定义了 largeSize
        if (content.includes('largeSize:') && content.includes('normalSize:')) {
            console.log(`✓ ${filePath} - 已经定义了 largeSize`);
            return;
        }

        // 查找 normalSize 定义的位置
        const normalSizePattern = /normalSize:\s*['"]default['"]/;
        const match = content.match(normalSizePattern);

        if (match) {
            // 在 normalSize 后面添加 largeSize
            const newContent = content.replace(
                normalSizePattern,
                `normalSize: 'default',\n            largeSize: 'large'`
            );

            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✓ ${filePath} - 已添加 largeSize 定义`);
        } else {
            console.log(`⚠ ${filePath} - 未找到 normalSize 定义`);
        }
    } catch (error) {
        console.error(`✗ ${filePath} - 错误: ${error.message}`);
    }
}

console.log('开始修复 largeSize 定义...\n');

filesToFix.forEach(file => {
    fixLargeSize(file);
});

console.log('\n修复完成！');
