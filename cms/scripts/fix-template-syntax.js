const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
    'src/views/order/reship.vue',
    'src/views/pay/balance.vue',
    'src/views/pay/bill_payment.vue',
    'src/views/pay/bill_refund.vue',
    'src/views/permission/sys_user.vue',
    'src/views/promotion/coupon/edit.vue',
    'src/views/promotion/coupon/index.vue',
    'src/views/promotion/coupon/list.vue',
    'src/views/promotion/edit.vue',
    'src/views/promotion/group_seckiller/index.vue',
    'src/views/user/user_grade.vue'
];

// 修复规则
const fixRules = [
    // 修复 placeholder={{ $t('key') }} 为 :placeholder="$t('key')"
    {
        pattern: /placeholder=\{\{\s*\$t\(['"]([^'"]+)['"]\)\s*\}\}/g,
        replacement: ':placeholder="$t(\'$1\')"'
    },
    // 修复 :title="isCreating ? {{ $t('key') }} : {{ $t('key2') }}" 为 :title="isCreating ? $t('key') : $t('key2')"
    {
        pattern: /:title="([^"]*)\{\{\s*\$t\(['"]([^'"]+)['"]\)\s*\}\}\s*:\s*\{\{\s*\$t\(['"]([^'"]+)['"]\)\s*\}\}([^"]*)"/g,
        replacement: ':title="$1$t(\'$2\') : $t(\'$3\')$4"'
    }
];

function fixFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        // 应用修复规则
        fixRules.forEach(rule => {
            fixedContent = fixedContent.replace(rule.pattern, rule.replacement);
        });

        // 如果内容有变化，写回文件
        if (fixedContent !== content) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

// 执行修复
console.log('🔧 Starting template syntax fixes...\n');

let fixedCount = 0;
filesToFix.forEach(file => {
    if (fixFile(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files out of ${filesToFix.length} files.`);
