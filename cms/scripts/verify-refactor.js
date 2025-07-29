const fs = require('fs');
const path = require('path');

// 查找所有Vue文件
function findVueFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...findVueFiles(fullPath));
        } else if (item.endsWith('.vue')) {
            files.push(fullPath);
        }
    }

    return files;
}

// 验证单个文件
function verifyFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // 检查是否还有单独的ext-button新增按钮
    const standaloneAddButton =
        /<ext-button[^>]*:label="\$t\('action\.add'\)"[^>]*@click="handleAdd"[^>]*>/g;

    // 检查是否有合并后的新增按钮
    const mergedAddButton =
        /<el-tooltip content="新增" placement="top">\s*<el-button round @click="handleAdd">\s*<i class="el-icon-ali-add"><\/i>\s*<\/el-button>\s*<\/el-tooltip>/g;

    // 检查是否有重复的新增按钮
    const duplicateAddButton =
        /<el-tooltip content="新增" placement="top">\s*<el-button round @click="handleAdd">\s*<i class="el-icon-ali-add"><\/i>\s*<\/el-button>\s*<\/el-tooltip>\s*<el-tooltip content="新增" placement="top">\s*<el-button round @click="handleAdd">\s*<i class="el-icon-ali-add"><\/i>\s*<\/el-button>\s*<\/el-tooltip>/g;

    const hasStandalone = standaloneAddButton.test(content);
    const hasMerged = mergedAddButton.test(content);
    const hasDuplicate = duplicateAddButton.test(content);

    if (hasStandalone) {
        console.log(`❌ Found standalone add button: ${filePath}`);
        return false;
    }

    if (hasDuplicate) {
        console.log(`❌ Found duplicate add buttons: ${filePath}`);
        return false;
    }

    if (hasMerged) {
        console.log(`✅ Properly merged: ${filePath}`);
        return true;
    }

    return null; // 没有新增按钮，这是正常的
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    const vueFiles = findVueFiles(srcDir);

    console.log(`Verifying ${vueFiles.length} Vue files...\n`);

    let properlyMerged = 0;
    let issues = 0;
    let noAddButton = 0;

    for (const file of vueFiles) {
        const result = verifyFile(file);
        if (result === true) {
            properlyMerged++;
        } else if (result === false) {
            issues++;
        } else {
            noAddButton++;
        }
    }

    console.log(`\n=== Verification Results ===`);
    console.log(`✅ Properly merged files: ${properlyMerged}`);
    console.log(`❌ Files with issues: ${issues}`);
    console.log(`📄 Files without add buttons: ${noAddButton}`);
    console.log(`📊 Total files processed: ${vueFiles.length}`);

    if (issues === 0) {
        console.log(`\n🎉 All files are properly refactored!`);
    } else {
        console.log(`\n⚠️  Found ${issues} files that need attention.`);
    }
}

if (require.main === module) {
    main();
}

module.exports = { verifyFile, findVueFiles };
