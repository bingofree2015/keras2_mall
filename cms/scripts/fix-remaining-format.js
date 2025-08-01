const fs = require('fs');
const path = require('path');

// 需要修复的文件和具体修复内容
const fixes = [
    {
        file: 'src/views/page/visual_design.vue',
        patterns: [
            // 修复缩进问题
            {
                pattern: /^(\s{4,})/gm,
                replacement: (match, spaces) => {
                    const count = Math.floor(spaces.length / 4);
                    return '    '.repeat(count);
                }
            }
        ]
    },
    {
        file: 'src/views/promotion/coupon/edit.vue',
        patterns: [
            // 修复缩进问题
            {
                pattern: /^(\s{4,})/gm,
                replacement: (match, spaces) => {
                    const count = Math.floor(spaces.length / 4);
                    return '    '.repeat(count);
                }
            }
        ]
    },
    {
        file: 'src/views/promotion/edit.vue',
        patterns: [
            // 修复缩进问题
            {
                pattern: /^(\s{4,})/gm,
                replacement: (match, spaces) => {
                    const count = Math.floor(spaces.length / 4);
                    return '    '.repeat(count);
                }
            }
        ]
    },
    {
        file: 'src/views/promotion/group_seckiller/edit.vue',
        patterns: [
            // 修复缩进问题
            {
                pattern: /^(\s{4,})/gm,
                replacement: (match, spaces) => {
                    const count = Math.floor(spaces.length / 4);
                    return '    '.repeat(count);
                }
            }
        ]
    }
];

function fixFile(filePath, patterns) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        patterns.forEach(({ pattern, replacement }) => {
            if (typeof replacement === 'function') {
                fixedContent = fixedContent.replace(pattern, replacement);
            } else {
                fixedContent = fixedContent.replace(pattern, replacement);
            }
        });

        if (fixedContent !== content) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error fixing file ${filePath}:`, error.message);
        return false;
    }
}

console.log('🔧 Starting format fixes...\n');

let fixedCount = 0;
fixes.forEach(({ file, patterns }) => {
    const result = fixFile(file, patterns);
    if (result) {
        console.log(`✅ Fixed: ${file}`);
        fixedCount++;
    } else {
        console.log(`⏭️  Skipped: ${file}`);
    }
});

console.log(`\n🎉 Format fixes completed. Fixed ${fixedCount} files.`);
