const fs = require('fs');
const path = require('path');

// 需要修复的属性类型
const reactiveProps = [
    'props',
    'columns',
    'formDataRules',
    'dataRule',
    'rules',
    'advertTemplates',
    'linkTypes',
    'pickerOptions',
];

function fixFile(filePath) {
    console.log(`Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 查找 data() 函数
    const dataRegex = /data\s*\(\s*\)\s*\{\s*return\s*\{([\s\S]*?)\};?\s*\}/;
    const dataMatch = content.match(dataRegex);

    if (!dataMatch) {
        return false;
    }

    const dataContent = dataMatch[1];

    // 查找包含 this.$t 的属性
    reactiveProps.forEach((prop) => {
        // 匹配包含 this.$t 的属性定义
        const propRegex = new RegExp(`${prop}\\s*:\\s*\\{[\\s\\S]*?this\\.\\$t[\\s\\S]*?\\}`, 'g');
        const matches = dataContent.match(propRegex);

        if (matches && matches.length > 0) {
            console.log(`  Found reactive prop: ${prop}`);
            modified = true;

            // 移除 data 中的定义
            content = content.replace(propRegex, '');

            // 查找或创建 computed 部分
            const computedRegex = /computed\s*:\s*\{([\s\S]*?)\}/;
            const computedMatch = content.match(computedRegex);

            if (computedMatch) {
                // 在现有 computed 中添加
                const computedContent = computedMatch[1];
                const newComputed = `        // 响应式的 ${prop} 配置
        ${prop}() {
            return ${matches[0].replace(/^\s*\w+\s*:\s*/, '')};
        },
        ${computedContent}`;

                content = content.replace(computedContent, newComputed);
            } else {
                // 创建新的 computed
                const newComputed = `    computed: {
        // 响应式的 ${prop} 配置
        ${prop}() {
            return ${matches[0].replace(/^\s*\w+\s*:\s*/, '')};
        },
    },`;

                // 在 data() 后添加
                content = content.replace(/data\s*\(\s*\)\s*\{[\s\S]*?\},/, (match) => {
                    return match + '\n    ' + newComputed;
                });
            }
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Modified: ${filePath}`);
        return true;
    }

    return false;
}

// 获取所有 Vue 文件
function getVueFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        items.forEach((item) => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.vue')) {
                files.push(fullPath);
            }
        });
    }

    traverse(dir);
    return files;
}

// 主执行
const vueFiles = getVueFiles('src');
console.log(`Found ${vueFiles.length} Vue files`);

let modifiedCount = 0;
vueFiles.forEach((file) => {
    try {
        if (fixFile(file)) {
            modifiedCount++;
        }
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
});

console.log(`\nCompleted! Modified ${modifiedCount} files.`);
