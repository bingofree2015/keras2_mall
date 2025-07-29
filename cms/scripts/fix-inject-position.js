const fs = require('fs');

// 需要修复的文件列表
const filesToFix = [
    'src/views/permission/sys_user.vue',
    'src/views/goods/brand.vue',
    'src/views/permission/role.vue',
    'src/views/goods/goods_param.vue',
    'src/views/marketing/advertisement/index.vue',
    'src/views/marketing/notice.vue',
    'src/views/goods/goods_spec.vue',
    'src/views/goods/goods_type.vue',
    'src/views/goods/goods_comment.vue',
    'src/views/system/dict.vue',
    'src/views/system/log.vue',
    'src/views/goods/index.vue',
    'src/views/marketing/advert_position.vue',
    'src/views/preference/logistics.vue',
    'src/views/user/index.vue',
    'src/views/marketing/article/index.vue',
    'src/views/pay/bill_refund.vue',
    'src/views/pay/balance.vue',
    'src/views/wechat/message/index.vue',
    'src/views/preference/store.vue',
    'src/views/user/user_grade.vue',
    'src/views/pay/index.vue',
    'src/views/order/after_sale.vue',
    'src/views/preference/operation_log.vue',
    'src/views/preference/ship/index.vue',
    'src/views/promotion/index.vue',
    'src/views/order/index.vue',
    'src/views/order/reship.vue',
    'src/views/page/index.vue',
    'src/views/order/lading.vue',
    'src/views/order/delivery.vue',
    'src/views/preference/task.vue',
    'src/views/form/index2.vue',
    'src/views/promotion/group_seckiller/index.vue',
    'src/views/promotion/coupon/index.vue',
    'src/views/promotion/coupon/list.vue',
    'src/views/form/form_submit.vue',
    'src/views/form/index.vue',
    'src/views/report/goods_collection.vue',
    'src/views/report/order.vue',
    'src/views/report/pay.vue',
    'src/views/report/goods_sale.vue',
    'src/views/goods/goods_cat.vue',
    'src/views/marketing/article_type.vue',
    'src/views/pay/bill_payment.vue',
    'src/views/pay/user_to_cash.vue',
    'src/views/preference/area.vue',
];

function fixInjectPosition(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 检查是否有错误的 inject 位置
        if (content.includes('components: {\n    inject: [')) {
            // 移除错误位置的 inject
            content = content.replace(
                /components:\s*{\s*\n\s*inject:\s*\['reload'\],\s*\n/g,
                'components: {\n'
            );

            // 在正确位置添加 inject
            const componentsMatch = content.match(/components:\s*{[^}]*}/);
            if (componentsMatch) {
                const componentsEnd = componentsMatch.index + componentsMatch[0].length;
                content =
                    content.slice(0, componentsEnd) +
                    ",\n    inject: ['reload']" +
                    content.slice(componentsEnd);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已修复: ${filePath}`);
        } else {
            console.log(`⏭️  无需修复: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ 修复失败: ${filePath}`, error.message);
    }
}

// 执行批量修复
console.log('🚀 开始修复 inject 位置...\n');

filesToFix.forEach((filePath) => {
    fixInjectPosition(filePath);
});

console.log('\n✨ inject 位置修复完成！');
