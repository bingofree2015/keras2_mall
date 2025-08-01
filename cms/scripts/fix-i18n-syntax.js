#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 递归查找文件的函数
function findFiles(dir, extensions) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            // 跳过 node_modules 和 .git 目录
            if (file !== 'node_modules' && file !== '.git') {
                results = results.concat(findFiles(filePath, extensions));
            }
        } else {
            const ext = path.extname(file);
            if (extensions.includes(ext)) {
                results.push(filePath);
            }
        }
    });

    return results;
}

// 修复国际化语法错误的函数
function fixI18nSyntax(content) {
    // 修复 title: {{ $t('...') }} 为 title: this.$t('...')
    content = content.replace(
        /title:\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "title: this.$t('$1')"
    );

    // 修复 message: {{ $t('...') }} 为 message: this.$t('...')
    content = content.replace(
        /message:\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "message: this.$t('$1')"
    );

    // 修复其他属性中的 {{ $t('...') }} 为 this.$t('...')
    content = content.replace(
        /(\w+):\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "$1: this.$t('$2')"
    );

    // 修复 this.$confirm({{ $t('...') }}, {{ $t('...') }}, {}) 为 this.$confirm(this.$t('...'), this.$t('...'), {})
    content = content.replace(
        /this\.\$confirm\(\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\},\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "this.$confirm(this.$t('$1'), this.$t('$2')"
    );

    // 修复 label: {{ $t('...') }} 为 label: this.$t('...')
    content = content.replace(
        /label:\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "label: this.$t('$1')"
    );

    // 修复 content={{ $t('...') }} 为 :content="$t('...')"
    content = content.replace(
        /content=\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        ":content=\"$t('$1')\""
    );

    // 修复 active-text={{ $t('...') }} 为 :active-text="$t('...')"
    content = content.replace(
        /active-text=\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        ":active-text=\"$t('$1')\""
    );

    // 修复 inactive-text={{ $t('...') }} 为 :inactive-text="$t('...')"
    content = content.replace(
        /inactive-text=\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        ":inactive-text=\"$t('$1')\""
    );

    // 修复数组中的 {{ $t('...') }} 为 this.$t('...')
    content = content.replace(
        /\[\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "[this.$t('$1')"
    );

    // 修复对象中的 {{ $t('...') }} 为 this.$t('...')
    content = content.replace(
        /\{\s*\{\{\s*\$t\(['"`]([^'"`]+)['"`]\)\s*\}\}/g,
        "{ this.$t('$1')"
    );

    return content;
}

// 处理单个文件
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        const fixedContent = fixI18nSyntax(content);

        if (originalContent !== fixedContent) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// 主函数
function main() {
    console.log('🔧 Starting to fix i18n syntax errors...\n');

    // 查找所有 Vue 和 JS 文件
    const vueFiles = findFiles('src', ['.vue']);
    const jsFiles = findFiles('src', ['.js']);
    const allFiles = [...vueFiles, ...jsFiles];

    let fixedCount = 0;
    let totalCount = allFiles.length;

    allFiles.forEach(file => {
        if (processFile(file)) {
            fixedCount++;
        }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total files processed: ${totalCount}`);
    console.log(`   Files fixed: ${fixedCount}`);
    console.log(`   Files unchanged: ${totalCount - fixedCount}`);

    if (fixedCount > 0) {
        console.log(`\n🎉 Successfully fixed ${fixedCount} files!`);
    } else {
        console.log(`\n✨ No files needed fixing!`);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { fixI18nSyntax, processFile };
