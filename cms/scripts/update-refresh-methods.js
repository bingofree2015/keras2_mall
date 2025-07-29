const fs = require('fs');

// 需要检查的组件列表
const componentsToCheck = [
    'src/views/user/user_grade.vue',
    'src/views/permission/role.vue',
    'src/views/goods/brand.vue',
    'src/views/permission/sys_user.vue',
    'src/views/goods/goods_comment.vue',
    'src/views/goods/goods_spec.vue',
    'src/views/goods/goods_param.vue',
    'src/views/goods/goods_cat.vue',
    'src/views/user/index.vue',
    'src/views/goods/index.vue',
    'src/views/goods/goods_type.vue',
    'src/views/report/goods_collection.vue',
    'src/views/report/goods_sale.vue',
    'src/views/report/pay.vue',
    'src/views/wechat/message/index.vue',
    'src/views/marketing/notice.vue',
    'src/views/system/log.vue',
    'src/views/system/dict.vue',
    'src/views/marketing/article_type.vue',
    'src/views/marketing/advert_position.vue',
    'src/views/preference/store.vue',
    'src/views/preference/logistics.vue',
    'src/views/marketing/article/index.vue',
    'src/views/pay/bill_refund.vue',
    'src/views/preference/ship/index.vue',
    'src/views/preference/operation_log.vue',
    'src/views/preference/task.vue',
    'src/views/pay/user_to_cash.vue',
    'src/views/marketing/advertisement/index.vue',
    'src/views/preference/area.vue',
    'src/views/promotion/index.vue',
    'src/views/pay/bill_payment.vue',
    'src/views/pay/index.vue',
    'src/views/form/form_submit.vue',
    'src/views/report/order.vue',
    'src/views/form/index2.vue',
    'src/views/promotion/coupon/list.vue',
    'src/views/promotion/coupon/index.vue',
    'src/views/promotion/group_seckiller/index.vue',
    'src/views/order/reship.vue',
    'src/views/form/index.vue',
    'src/views/order/delivery.vue',
    'src/views/order/lading.vue',
    'src/views/pay/balance.vue',
    'src/views/order/after_sale.vue',
    'src/views/order/index.vue',
    'src/views/page/index.vue',
];

function checkAndUpdateComponent(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let hasInject = false;
    let hasHandleRefresh = false;
    let handleRefreshUsesReload = false;
    let handleRefreshUsesQueryForPaginatedList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检查是否注入了 reload
        if (line.includes('inject:') && line.includes('reload')) {
            hasInject = true;
        }

        // 检查是否有 handleRefresh 方法
        if (line.includes('handleRefresh()')) {
            hasHandleRefresh = true;

            // 检查方法体
            for (let j = i + 1; j < lines.length; j++) {
                const methodLine = lines[j];
                if (methodLine.includes('this.reload()')) {
                    handleRefreshUsesReload = true;
                    break;
                }
                if (methodLine.includes('queryForPaginatedList()')) {
                    handleRefreshUsesQueryForPaginatedList = true;
                    break;
                }
                if (methodLine.includes('}')) {
                    break;
                }
            }
        }
    }

    // 输出检查结果
    const status = [];
    if (hasInject) status.push('✅ 已注入 reload');
    else status.push('❌ 未注入 reload');

    if (hasHandleRefresh) status.push('✅ 有 handleRefresh 方法');
    else status.push('❌ 无 handleRefresh 方法');

    if (handleRefreshUsesReload) status.push('✅ 使用 reload()');
    else if (handleRefreshUsesQueryForPaginatedList) status.push('❌ 使用 queryForPaginatedList()');
    else status.push('❓ 未知实现');

    console.log(`${filePath}: ${status.join(' | ')}`);

    return {
        hasInject,
        hasHandleRefresh,
        handleRefreshUsesReload,
        handleRefreshUsesQueryForPaginatedList,
    };
}

console.log('检查所有组件的刷新方法实现...\n');

let totalComponents = 0;
let correctComponents = 0;
let needsUpdate = 0;

componentsToCheck.forEach((filePath) => {
    totalComponents++;
    const result = checkAndUpdateComponent(filePath);

    if (result) {
        if (result.hasInject && result.hasHandleRefresh && result.handleRefreshUsesReload) {
            correctComponents++;
        } else if (
            result.hasInject &&
            result.hasHandleRefresh &&
            result.handleRefreshUsesQueryForPaginatedList
        ) {
            needsUpdate++;
        }
    }
});

console.log(`\n📊 统计结果:`);
console.log(`总组件数: ${totalComponents}`);
console.log(`✅ 正确实现: ${correctComponents}`);
console.log(`🔄 需要更新: ${needsUpdate}`);
console.log(`❓ 其他情况: ${totalComponents - correctComponents - needsUpdate}`);
