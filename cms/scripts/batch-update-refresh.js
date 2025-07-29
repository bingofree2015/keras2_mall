const fs = require('fs');

// 需要修改的文件列表
const filesToUpdate = [
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

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. 添加 inject
        if (!content.includes('inject: [')) {
            const scriptStart = content.indexOf('export default {');
            if (scriptStart !== -1) {
                const componentsMatch = content.match(/components:\s*{/);
                if (componentsMatch) {
                    const insertPos = componentsMatch.index + componentsMatch[0].length;
                    content =
                        content.slice(0, insertPos) +
                        "\n    inject: ['reload']," +
                        content.slice(insertPos);
                    modified = true;
                }
            }
        }

        // 2. 替换刷新按钮的点击事件
        content = content.replace(/@click="queryForPaginatedList\(\)"/g, '@click="handleRefresh"');

        // 3. 添加 handleRefresh 方法
        if (!content.includes('handleRefresh()')) {
            const methodsMatch = content.match(/methods:\s*{/);
            if (methodsMatch) {
                const insertPos = methodsMatch.index + methodsMatch[0].length;
                const handleRefreshMethod = `
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },`;
                content =
                    content.slice(0, insertPos) + handleRefreshMethod + content.slice(insertPos);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已更新: ${filePath}`);
        } else {
            console.log(`⏭️  无需更新: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ 更新失败: ${filePath}`, error.message);
    }
}

// 执行批量更新
console.log('🚀 开始批量更新刷新功能...\n');

filesToUpdate.forEach((filePath) => {
    updateFile(filePath);
});

console.log('\n✨ 批量更新完成！');
