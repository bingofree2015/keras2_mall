const fs = require('fs');
const path = require('path');

// 需要修复的文件模式
const patterns = ['src/views/**/*.vue', 'src/components/**/*.vue'];

// 需要转换为计算属性的属性
const reactiveProps = ['props', 'columns', 'formDataRules', 'dataRule', 'rules'];

function processFile(filePath) {
    console.log(`Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 查找 data() 函数中的 this.$t 调用
    const dataRegex = /data\s*\(\s*\)\s*\{\s*return\s*\{([\s\S]*?)\};?\s*\}/;
    const dataMatch = content.match(dataRegex);

    if (dataMatch) {
        const dataContent = dataMatch[1];

        // 查找包含 this.$t 的属性
        reactiveProps.forEach((prop) => {
            const propRegex = new RegExp(
                `${prop}\\s*:\\s*\\{[\\s\\S]*?this\\.\\$t[\\s\\S]*?\\}`,
                'g'
            );
            const matches = dataContent.match(propRegex);

            if (matches) {
                console.log(`  Found reactive prop: ${prop}`);
                modified = true;

                // 移除 data 中的定义
                content = content.replace(propRegex, '');

                // 添加计算属性
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
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Modified: ${filePath}`);
    }
}

// 递归查找文件
function findFiles(dir, pattern) {
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
const vueFiles = findFiles('src', '**/*.vue');
console.log(`Found ${vueFiles.length} Vue files`);

vueFiles.forEach((file) => {
    try {
        processFile(file);
    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
    }
});

console.log('Done!');
