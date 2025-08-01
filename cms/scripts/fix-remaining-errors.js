const fs = require('fs');
const path = require('path');

// 需要修复的文件和具体修复内容
const fixes = [
    {
        file: 'src/views/pay/bill_refund.vue',
        pattern: /:placeholder="\$t\('permission\.pleaseSelect'\)"/g,
        replacement: ':placeholder="$t(\'permission.pleaseSelect\')"'
    },
    {
        file: 'src/views/promotion/coupon/edit.vue',
        pattern: /:label="\$t\('visualDesign\.goodsName'\)"/g,
        replacement: ':label="$t(\'visualDesign.goodsName\')"'
    },
    {
        file: 'src/views/promotion/coupon/edit.vue',
        pattern: /:placeholder="\$t\('permission\.pleaseSelect'\)"/g,
        replacement: ':placeholder="$t(\'permission.pleaseSelect\')"'
    },
    {
        file: 'src/views/promotion/edit.vue',
        pattern: /:label="\$t\('visualDesign\.goodsName'\)"/g,
        replacement: ':label="$t(\'visualDesign.goodsName\')"'
    },
    {
        file: 'src/views/promotion/edit.vue',
        pattern: /:placeholder="\$t\('permission\.pleaseSelect'\)"/g,
        replacement: ':placeholder="$t(\'permission.pleaseSelect\')"'
    },
    {
        file: 'src/views/promotion/group_seckiller/edit.vue',
        pattern: /:placeholder="\$t\('permission\.pleaseSelect'\)"/g,
        replacement: ':placeholder="$t(\'permission.pleaseSelect\')"'
    },
    {
        file: 'src/views/user/user_grade.vue',
        pattern: /:label="\$t\('visualDesign\.name'\)"/g,
        replacement: ':label="$t(\'visualDesign.name\')"'
    }
];

function fixFile(filePath, pattern, replacement) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = content.replace(pattern, replacement);

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
console.log('🔧 Starting remaining error fixes...\n');

let fixedCount = 0;
fixes.forEach(fix => {
    if (fixFile(fix.file, fix.pattern, fix.replacement)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files out of ${fixes.length} fixes.`);
