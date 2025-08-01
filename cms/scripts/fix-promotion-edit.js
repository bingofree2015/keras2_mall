const fs = require('fs');
const path = require('path');

const filePath = 'src/views/promotion/edit.vue';

function fixFile() {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        // 修复 v-model 属性问题
        fixedContent = fixedContent.replace(
            /v-model="formData\.spTarget\.pattern\.id"\s*placeholder="请选择品牌"\s*>/g,
            '<el-select v-model="formData.spTarget.pattern.id" placeholder="请选择品牌">'
        );

        // 修复 label="{{ $t('permission.pleaseSelect') }}" 问题
        fixedContent = fixedContent.replace(
            /label="\{\{\s*\$t\('permission\.pleaseSelect'\)\s*\}\}"/g,
            ':label="$t(\'permission.pleaseSelect\')"'
        );

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
console.log('🔧 Starting promotion edit file fix...\n');

const result = fixFile();

console.log(`\n🎉 Fix ${result ? 'completed' : 'skipped'}.`);
