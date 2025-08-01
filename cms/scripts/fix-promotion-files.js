const fs = require('fs');
const path = require('path');

// 需要修复的文件和具体修复内容
const fixes = [
    {
        file: 'src/views/promotion/coupon/edit.vue',
        patterns: [
            // 修复 label="{{ $t('permission.pleaseSelect') }}" 为 :label="$t('permission.pleaseSelect')"
            {
                pattern: /label="\{\{\s*\$t\('permission\.pleaseSelect'\)\s*\}\}"/g,
                replacement: ':label="$t(\'permission.pleaseSelect\')"'
            },
            // 修复 prop="id" 重复问题
            {
                pattern: /prop="id"\s*>\s*prop="id"\s*>/g,
                replacement: 'prop="id">'
            },
            // 修复 v-model 属性问题
            {
                pattern: /v-model="formData\.spTarget\.pattern\.id"\s*:options="goodsCatList"\s*:props="cascaderProps"\s*:show-all-levels="false"\s*\/>/g,
                replacement: '<el-cascader v-model="formData.spTarget.pattern.id" :options="goodsCatList" :props="cascaderProps" :show-all-levels="false" />'
            },
            // 修复 el-select 问题
            {
                pattern: /v-model="formData\.spTarget\.pattern\.id"\s*placeholder="请选择品牌"\s*>/g,
                replacement: '<el-select v-model="formData.spTarget.pattern.id" placeholder="请选择品牌">'
            }
        ]
    },
    {
        file: 'src/views/promotion/edit.vue',
        patterns: [
            // 修复 label="{{ $t('permission.pleaseSelect') }}" 为 :label="$t('permission.pleaseSelect')"
            {
                pattern: /label="\{\{\s*\$t\('permission\.pleaseSelect'\)\s*\}\}"/g,
                replacement: ':label="$t(\'permission.pleaseSelect\')"'
            },
            // 修复 prop="id" 重复问题
            {
                pattern: /prop="id"\s*>\s*prop="id"\s*>/g,
                replacement: 'prop="id">'
            }
        ]
    },
    {
        file: 'src/views/promotion/group_seckiller/edit.vue',
        patterns: [
            // 修复 label="{{ $t('permission.pleaseSelect') }}" 为 :label="$t('permission.pleaseSelect')"
            {
                pattern: /label="\{\{\s*\$t\('permission\.pleaseSelect'\)\s*\}\}"/g,
                replacement: ':label="$t(\'permission.pleaseSelect\')"'
            }
        ]
    }
];

function fixFile(filePath, patterns) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        // 应用修复规则
        patterns.forEach(pattern => {
            fixedContent = fixedContent.replace(pattern.pattern, pattern.replacement);
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
console.log('🔧 Starting promotion files fixes...\n');

let fixedCount = 0;
fixes.forEach(fix => {
    if (fixFile(fix.file, fix.patterns)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files out of ${fixes.length} files.`);
