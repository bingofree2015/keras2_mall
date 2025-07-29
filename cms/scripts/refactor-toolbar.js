const fs = require('fs');

// 需要重构的文件列表
const filesToRefactor = [
    'src/views/page/index.vue',
    'src/views/order/delivery.vue',
    'src/views/order/lading.vue',
    'src/views/order/reship.vue',
    'src/views/order/after_sale.vue',
    'src/views/pay/index.vue',
    'src/views/pay/balance.vue',
    'src/views/pay/bill_payment.vue',
    'src/views/pay/bill_refund.vue',
    'src/views/pay/user_to_cash.vue',
    'src/views/preference/area.vue',
    'src/views/preference/logistics.vue',
    'src/views/preference/operation_log.vue',
    'src/views/preference/store.vue',
    'src/views/preference/task.vue',
    'src/views/preference/ship/index.vue',
    'src/views/marketing/advert_position.vue',
    'src/views/marketing/advertisement/index.vue',
    'src/views/marketing/article/index.vue',
    'src/views/marketing/notice.vue',
    'src/views/goods/brand.vue',
    'src/views/goods/goods_cat.vue',
    'src/views/goods/goods_comment.vue',
    'src/views/goods/goods_param.vue',
    'src/views/goods/goods_spec.vue',
    'src/views/goods/goods_type.vue',
    'src/views/promotion/index.vue',
    'src/views/promotion/coupon/index.vue',
    'src/views/promotion/coupon/list.vue',
    'src/views/promotion/group_seckiller/index.vue',
    'src/views/report/order.vue',
    'src/views/report/pay.vue',
    'src/views/report/goods_collection.vue',
    'src/views/report/goods_sale.vue',
    'src/views/system/log.vue',
    'src/views/user/user_grade.vue',
    'src/views/permission/role.vue',
    'src/views/permission/sys_user.vue',
    'src/views/wechat/edit_menu.vue',
    'src/views/wechat/message/index.vue',
    'src/views/wechat/message/edit_media_message.vue',
    'src/views/form/index2.vue',
    'src/views/form/form_submit.vue',
    'src/views/page/visual_design.vue',
];

// 重构函数
function refactorToolbar(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`文件不存在: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 检查是否已经重构过
    if (content.includes('class="top-row"')) {
        console.log(`文件已经重构过: ${filePath}`);
        return;
    }

    // 替换导航与工具栏结构
    const oldPattern =
        /<!--导航与工具栏-->\s*<el-row>\s*<el-col :span="(\d+)">\s*<bread-crumb \/>\s*<\/el-col>\s*<el-col :span="(\d+)" class="top-bar">/;
    const newStructure = `<!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">`;

    if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newStructure);

        // 为表单添加search-form类
        content = content.replace(
            /<el-form :inline="true"([^>]*)>/g,
            '<el-form :inline="true"$1 class="search-form">'
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`重构完成: ${filePath}`);
    } else {
        console.log(`未找到匹配的模式: ${filePath}`);
    }
}

// 执行重构
console.log('开始重构导航与工具栏样式...');
filesToRefactor.forEach((file) => {
    refactorToolbar(file);
});
console.log('重构完成！');
