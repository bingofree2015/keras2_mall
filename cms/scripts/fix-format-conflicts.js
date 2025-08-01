const fs = require('fs');

// 修复特定文件的格式冲突
const fixes = [
    {
        file: 'src/components/draggable_image_list.vue',
        patterns: [
            // 修复transition-group的格式
            {
                pattern: /<transition-group\n\s+id="draggable-list"\n\s+class="draggable-list"\n\s+name="draggable-list"\n\s+tag="ul"\n\s+>/g,
                replacement: '<transition-group id="draggable-list" class="draggable-list" name="draggable-list" tag="ul">'
            },
            // 修复draggable的格式
            {
                pattern: /<draggable\n\s+key="drag"\n\s+:list="items"\n\s+v-bind="dragOptions"\n\s+item-key="id"\n\s+@end="end"\n\s+>/g,
                replacement: '<draggable key="drag" :list="items" v-bind="dragOptions" item-key="id" @end="end">'
            }
        ]
    },
    {
        file: 'src/components/map_position.vue',
        patterns: [
            // 修复el-amap的格式
            {
                pattern: /<el-amap\n\s+:center="center"\n\s+:events="events"\n\s+:plugin="plugin"\n\s+:zoom="zoom"\n\s+vid="amap"\n\s+>/g,
                replacement: '<el-amap :center="center" :events="events" :plugin="plugin" :zoom="zoom" vid="amap">'
            }
        ]
    }
];

function fixFile(filePath, patterns) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fixedContent = content;

        patterns.forEach(({ pattern, replacement }) => {
            fixedContent = fixedContent.replace(pattern, replacement);
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

console.log('🔧 Fixing format conflicts...\n');

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

console.log(`\n🎉 Format conflicts fixed. Fixed ${fixedCount} files.`);
