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

// 处理单个文件
function processFile(filePath) {
    console.log(`Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 首先清理重复的新增按钮
    const duplicateAddButtonPattern =
        /<el-tooltip content="新增" placement="top">\s*<el-button round @click="handleAdd">\s*<i class="el-icon-ali-add"><\/i>\s*<\/el-button>\s*<\/el-tooltip>\s*<el-tooltip content="新增" placement="top">\s*<el-button round @click="handleAdd">\s*<i class="el-icon-ali-add"><\/i>\s*<\/el-button>\s*<\/el-tooltip>/g;
    if (duplicateAddButtonPattern.test(content)) {
        content = content.replace(
            duplicateAddButtonPattern,
            `<el-tooltip content="新增" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>`
        );
        modified = true;
        console.log(`  ✓ Cleaned duplicate add buttons: ${filePath}`);
    }

    // 模式1：带内容的ext-button + el-button-group
    const pattern1 =
        /(\s*)<el-form-item>\s*<ext-button\s+[^>]*:label="\$t\('action\.add'\)"[^>]*@click="handleAdd"[^>]*>\s*<i class="el-icon-ali-add"><\/i>\s*<\/ext-button>\s*<\/el-form-item>\s*<el-form-item>\s*<el-button-group>/g;

    // 模式2：自闭合的ext-button + el-button-group
    const pattern2 =
        /(\s*)<el-form-item>\s*<ext-button\s+[^>]*:label="\$t\('action\.add'\)"[^>]*@click="handleAdd"[^>]*\/>\s*<\/el-form-item>\s*<el-form-item>\s*<el-button-group>/g;

    // 模式3：带icon属性的自闭合ext-button + el-button-group
    const pattern3 =
        /(\s*)<el-form-item>\s*<ext-button\s+[^>]*:label="\$t\('action\.add'\)"[^>]*icon="[^"]*"[^>]*@click="handleAdd"[^>]*\/>\s*<\/el-form-item>\s*<el-form-item>\s*<el-button-group>/g;

    // 替换模式
    const replacement = `$1<el-form-item>
                        <el-button-group>
                            <el-tooltip content="新增" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>`;

    // 检查并替换所有模式
    if (pattern1.test(content)) {
        content = content.replace(pattern1, replacement);
        modified = true;
        console.log(`  ✓ Modified pattern1: ${filePath}`);
    }

    if (pattern2.test(content)) {
        content = content.replace(pattern2, replacement);
        modified = true;
        console.log(`  ✓ Modified pattern2: ${filePath}`);
    }

    if (pattern3.test(content)) {
        content = content.replace(pattern3, replacement);
        modified = true;
        console.log(`  ✓ Modified pattern3: ${filePath}`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }

    return modified;
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    const vueFiles = findVueFiles(srcDir);

    console.log(`Found ${vueFiles.length} Vue files`);

    let modifiedCount = 0;

    for (const file of vueFiles) {
        if (processFile(file)) {
            modifiedCount++;
        }
    }

    console.log(`\nModified ${modifiedCount} files`);
}

if (require.main === module) {
    main();
}

module.exports = { processFile, findVueFiles };
