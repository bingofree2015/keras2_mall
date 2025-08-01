const fs = require('fs');
const path = require('path');

// 需要处理的文件类型
const fileExtensions = ['.vue', '.js'];

// 需要跳过的目录
const skipDirs = ['node_modules', '.git', 'dist', 'build', 'scripts'];

// 中文文本映射
const chineseTextMap = {
    // 通用文本
    '请输入内容': '$t(\'permission.pleaseEnterContent\')',
    '请选择': '$t(\'permission.pleaseSelect\')',
    '新增': '$t(\'permission.add\')',
    '刷新': '$t(\'permission.refresh\')',
    '导出': '$t(\'permission.export\')',
    '编辑': '$t(\'permission.edit\')',
    '确认删除选中记录吗？': '$t(\'permission.confirmDeleteSelected\')',
    '确认提交吗？': '$t(\'permission.confirmSubmit\')',
    '提示': '$t(\'common.tip\')',
    '成功': '$t(\'common.success\')',
    '错误': '$t(\'common.error\')',

    // 角色管理
    '角色授权': '$t(\'permission.roleAuthorization\')',
    '全选': '$t(\'permission.selectAll\')',
    '角色名': '$t(\'permission.roleName\')',
    '备注': '$t(\'permission.remark\')',
    '创建人': '$t(\'system.creator\')',
    '创建时间': '$t(\'common.createTime\')',
    '请输入角色名': '$t(\'permission.roleName\') + $t(\'common.required\')',

    // 菜单管理
    'URL格式：': '$t(\'permission.urlFormat\')',
    '1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为': '$t(\'permission.urlFormatDesc1\')',
    '/system/User, 此处填写 /system/user。': '$t(\'permission.urlFormatDesc2\')',
    '2.嵌套外部网页，如通过菜单打开百度网页，此处填写': '$t(\'permission.urlFormatDesc3\')',
    'http://www.baidu.com，http:// 不可省略。': '$t(\'permission.urlFormatDesc4\')',
    '示例：用户管理：/system/user': '$t(\'permission.urlExample1\')',
    '嵌套百度：http://www.baidu.com': '$t(\'permission.urlExample2\')',
    '嵌套网页：http://127.0.0.1:8000': '$t(\'permission.urlExample3\')',
    '显示': '$t(\'permission.display\')',
    '隐藏': '$t(\'permission.hide\')',
    '目录': '$t(\'permission.directory\')',
    '菜单': '$t(\'permission.menu\')',
    '按钮': '$t(\'permission.button\')',

    // 组件相关
    '推荐使用 Font Aweson 图标': '$t(\'component.falconTooltip.recommendFontAwesome\')',
    '使用步骤：': '$t(\'component.falconTooltip.usageSteps\')',
    '1.进入': '$t(\'component.falconTooltip.step1\')',
    '页面': '$t(\'component.falconTooltip.step2\')',
    '2.查找到需要的图标,点击查看。': '$t(\'component.falconTooltip.step3\')',
    '3.复制图片样式到此处。': '$t(\'component.falconTooltip.step4\')',
    '示例：el-icon-ali-shouye': '$t(\'component.falconTooltip.example\')',

    // 消息面板
    '您有 {count} 条消息': '$t(\'component.messagePanel.youHaveMessages\', { count: data.length })',
    '查看所有消息': '$t(\'component.messagePanel.viewAllMessages\')',
    '你修改了用户密码': '$t(\'component.messagePanel.passwordChanged\')',
    '你修改了用户头像': '$t(\'component.messagePanel.avatarChanged\')',
    '今日25名新成员加入': '$t(\'component.messagePanel.newMembersJoined\')',
    '您发表了一篇新随笔': '$t(\'component.messagePanel.newEssayPublished\')',

    // 演示页面
    '区域选择': '$t(\'demo.areaSelection\')',
    '通过基础的 24 分栏，迅速简便地创建布局。': '$t(\'demo.areaSelectionDesc\')',
    '执行结果': '$t(\'demo.executionResult\')',
    '演示代码': '$t(\'demo.demoCode\')',
    '富文本框': '$t(\'demo.richTextEditor\')',
    '基于tinymce,除了tinymce的基本功能，添加了图片与视频上传的功能。': '$t(\'demo.richTextEditorDesc\')',
    '视频上传': '$t(\'demo.videoUpload\')',
    '通过弹出对话框选择本地视频文件上传至服务器，支持拖拽迅速简便。': '$t(\'demo.videoUploadDesc\')',
    '上传视频': '$t(\'demo.uploadVideo\')',
    '文章选择': '$t(\'demo.articleSelection\')',
    '通过弹出文章列表对话框，选择文章(支持单选)。': '$t(\'demo.articleSelectionDesc\')',

    // 可视化设计
    '减100元': '$t(\'visualDesign.reduce100Yuan\')',
    '组件库': '$t(\'visualDesign.componentLibrary\')',
    '媒体组件': '$t(\'visualDesign.mediaComponent\')',
    '商城组件': '$t(\'visualDesign.storeComponent\')',
    '工具组件': '$t(\'visualDesign.utilsComponent\')',
    '工作区': '$t(\'visualDesign.workspace\')',
    '购买记录': '$t(\'visualDesign.record\')',
    '请输入关键字搜索': '$t(\'visualDesign.inputSearchKeyword\')',
    '搜索': '$t(\'visualDesign.search\')',
    '商品名称': '$t(\'visualDesign.goodsName\')',
    '文章标题': '$t(\'visualDesign.articleTitle\')',
    '满300减30': '$t(\'visualDesign.full300Reduce30\')',
    '订单满144减10': '$t(\'visualDesign.orderReduce144\')',
    '购买订单满2件减5': '$t(\'visualDesign.purchaseOrderFull2\')',
    '购买订单日期': '$t(\'visualDesign.purchaseOrderDate\')',
    '立即领取': '$t(\'visualDesign.receiveImmediately\')',
    '名称': '$t(\'visualDesign.name\')',
    '左': '$t(\'visualDesign.left\')',
    '右': '$t(\'visualDesign.right\')',
    '添加': '$t(\'visualDesign.add\')',
    '选择广告文章': '$t(\'visualDesign.selectAdArticle\')',
    '选择文章分类': '$t(\'visualDesign.selectArticleClassify\')',
    '方形': '$t(\'visualDesign.square\')',
    '圆形': '$t(\'visualDesign.round\')',
    '自动获取': '$t(\'visualDesign.autoGet\')',
    '手动选择': '$t(\'visualDesign.manualSelection\')',
    '三个': '$t(\'visualDesign.three\')',
    '四个': '$t(\'visualDesign.four\')',
    '五个': '$t(\'visualDesign.five\')',
    '自动': '$t(\'visualDesign.auto\')',
    '手动': '$t(\'visualDesign.manual\')',
    '选择品牌': '$t(\'visualDesign.selectBrand\')',
    '列表平铺': '$t(\'visualDesign.listFlatten\')',
    '横向滚动': '$t(\'visualDesign.horizontalScroll\')',
    '单列': '$t(\'visualDesign.singleColumn\')',
    '两列': '$t(\'visualDesign.twoColumns\')',
    '三列': '$t(\'visualDesign.threeColumns\')',
    '是': '$t(\'visualDesign.yes\')',
    '否': '$t(\'visualDesign.no\')',
    '团购秒杀': '$t(\'visualDesign.groupSeckill\')',
    '图片轮播': '$t(\'visualDesign.imageCarousel\')',
    '单图组': '$t(\'visualDesign.singleImage\')',
    '图片橱窗': '$t(\'visualDesign.imageShowcase\')',
    '页面布局为 1左3右': '$t(\'visualDesign.pageLayout1Left3Right\')',
    '1行2个; 1行3个; 1行4个': '$t(\'visualDesign.oneRowTwo\')',
    '视频组': '$t(\'visualDesign.videoGroup\')',
    '文章组': '$t(\'visualDesign.articleGroup\')',
    '文章分类': '$t(\'visualDesign.articleCategory\')',
    '公告组': '$t(\'visualDesign.noticeGroup\')',
    '优惠券组': '$t(\'visualDesign.couponGroup\')',
    '导航组': '$t(\'visualDesign.navigationGroup\')',
    '辅助空白': '$t(\'visualDesign.auxiliaryBlank\')',
    '文本域': '$t(\'visualDesign.textArea\')',
    '属性设置': '$t(\'visualDesign.propertySettings\')'
};

// 递归遍历目录
function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!skipDirs.includes(file)) {
                walkDir(filePath, callback);
            }
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (fileExtensions.includes(ext)) {
                callback(filePath);
            }
        }
    });
}

// 处理单个文件
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 替换中文文本
        Object.keys(chineseTextMap).forEach(chineseText => {
            const replacement = chineseTextMap[chineseText];

            // 在模板中的替换
            const templateRegex = new RegExp(`(['"])${chineseText}\\1`, 'g');
            if (templateRegex.test(content)) {
                content = content.replace(templateRegex, `{{ ${replacement} }}`);
                modified = true;
            }

            // 在JavaScript中的替换
            const jsRegex = new RegExp(`(['"])${chineseText}\\1`, 'g');
            if (jsRegex.test(content)) {
                content = content.replace(jsRegex, `this.$t(${replacement.replace('$t(', '').replace(')', '')})`);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');

    if (!fs.existsSync(srcDir)) {
        console.error('Source directory not found');
        return;
    }

    console.log('Starting batch i18n fix...');
    walkDir(srcDir, processFile);
    console.log('Batch i18n fix completed!');
}

main();
