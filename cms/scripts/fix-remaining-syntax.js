const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
    'src/views/goods/goods_cat.vue',
    'src/views/pay/bill_payment.vue',
    'src/views/pay/bill_refund.vue',
    'src/views/promotion/coupon/edit.vue',
    'src/views/promotion/edit.vue',
    'src/views/promotion/group_seckiller/edit.vue',
    'src/views/user/user_grade.vue',
];

// 修复规则
const fixRules = [
    // 修复 :label="$t('visualDesign.goodsName')" 为 :label="$t('visualDesign.goodsName')"
    {
        pattern: /:label="\$t\('visualDesign\.goodsName'\)"/g,
        replacement: ':label="$t(\'visualDesign.goodsName\')"',
    },
    // 修复 :label="$t('visualDesign.name')" 为 :label="$t('visualDesign.name')"
    {
        pattern: /:label="\$t\('visualDesign\.name'\)"/g,
        replacement: ':label="$t(\'visualDesign.name\')"',
    },
    // 修复 :label="$t('permission.edit')" 为 :label="$t('permission.edit')"
    {
        pattern: /:label="\$t\('permission\.edit'\)"/g,
        replacement: ':label="$t(\'permission.edit\')"',
    },
];

function fixFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        // 应用修复规则
        fixRules.forEach((rule) => {
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
console.log('🔧 Starting remaining syntax fixes...\n');

let fixedCount = 0;
filesToFix.forEach((file) => {
    if (fixFile(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files out of ${filesToFix.length} files.`);
