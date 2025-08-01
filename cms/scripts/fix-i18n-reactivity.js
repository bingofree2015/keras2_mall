const fs = require('fs');

// 需要修复的页面列表
const pagesToFix = [
    'src/views/goods/goods_comment.vue',
    'src/views/pay/index.vue',
    'src/views/form/index2.vue',
    'src/views/order/index.vue',
    'src/views/order/reship.vue',
    'src/views/promotion/index.vue',
    'src/views/order/after_sale.vue',
    'src/views/marketing/notice.vue',
    'src/views/system/log.vue',
    'src/views/preference/ship/index.vue',
    'src/views/goods/brand.vue',
    'src/views/permission/role.vue',
    'src/views/permission/sys_user.vue',
    'src/views/marketing/advert_position.vue',
    'src/views/goods/goods_spec.vue',
    'src/views/goods/goods_type.vue',
    'src/views/goods/goods_param.vue',
    'src/views/goods/index.vue',
];

// 需要添加的翻译键
const missingTranslations = {
    pay: {
        paymentMethodName: 'Payment Method Name',
    },
    form: {
        formName: 'Form Name',
    },
    order: {
        orderId: 'Order ID',
    },
    reship: {
        reshipId: 'Reship ID',
    },
    promotion: {
        activityName: 'Activity Name',
    },
    afterSale: {
        afterSaleId: 'After Sale ID',
    },
    marketing: {
        title: 'Title',
    },
    notice: {
        title: 'Title',
        content: 'Content',
        type: 'Type',
        sort: 'Sort',
    },
    brand: {
        brandName: 'Brand Name',
        name: 'Name',
        logo: 'Logo',
    },
    permission: {
        roleName: 'Role Name',
        remark: 'Remark',
    },
    advertPosition: {
        name: 'Name',
        code: 'Code',
        sort: 'Sort',
    },
    goodsSpec: {
        attributeName: 'Attribute Name',
        attributeValue: 'Attribute Value',
    },
    goods: {
        typeName: 'Type Name',
        attributeSpec: 'Attribute (Spec)',
        parameter: 'Parameter',
        paramName: 'Parameter Name',
        paramType: 'Parameter Type',
        paramOption: 'Parameter Option',
        goodsName: 'Goods Name',
        price: 'Price',
        costPrice: 'Cost Price',
        marketPrice: 'Market Price',
        defaultImage: 'Default Image',
        category: 'Category',
        type: 'Type',
        brand: 'Brand',
        onSale: 'On Sale',
    },
};

function fixPage(filePath) {
    console.log(`Processing: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 检查是否已经有 computed 块
    const hasComputed = content.includes('computed: {');

    // 查找 data() 中的 props 和 columns
    const dataMatch = content.match(/data\(\)\s*\{\s*return\s*\{([\s\S]*?)\s*\}\s*;\s*\}/);

    if (!dataMatch) {
        console.log(`No data() found in ${filePath}`);
        return;
    }

    const dataContent = dataMatch[1];

    // 提取 props 和 columns
    const propsMatch = dataContent.match(/props:\s*\[([\s\S]*?)\]/);
    const columnsMatch = dataContent.match(/columns:\s*\[([\s\S]*?)\]/);

    if (!propsMatch && !columnsMatch) {
        console.log(`No props or columns found in ${filePath}`);
        return;
    }

    let newContent = content;

    // 移除 data() 中的 props 和 columns
    if (propsMatch) {
        newContent = newContent.replace(/props:\s*\[([\s\S]*?)\],?\s*/, '');
    }
    if (columnsMatch) {
        newContent = newContent.replace(/columns:\s*\[([\s\S]*?)\],?\s*/, '');
    }

    // 添加 computed 块
    const computedBlock = `
    computed: {
        ${
            propsMatch
                ? `// 响应式的 props 配置
        props() {
            return [${propsMatch[1]}];
        },`
                : ''
        }
        ${
            columnsMatch
                ? `// 响应式的列配置
        columns() {
            return [${columnsMatch[1]}];
        },`
                : ''
        }
    },`;

    if (hasComputed) {
        // 如果已经有 computed，在现有 computed 中添加
        newContent = newContent.replace(/computed:\s*\{([\s\S]*?)\},/, (match, computedContent) => {
            return `computed: {${computedContent}${
                propsMatch
                    ? `
        // 响应式的 props 配置
        props() {
            return [${propsMatch[1]}];
        },`
                    : ''
            }${
                columnsMatch
                    ? `
        // 响应式的列配置
        columns() {
            return [${columnsMatch[1]}];
        },`
                    : ''
            }
    },`;
        });
    } else {
        // 如果没有 computed，在 data() 后添加
        newContent = newContent.replace(/data\(\)\s*\{[\s\S]*?\},/, (match) => {
            return match + computedBlock;
        });
    }

    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed: ${filePath}`);
}

function addMissingTranslations() {
    console.log('Adding missing translations to en_us.json...');

    const enUsPath = 'src/assets/languages/en_us.json';
    const enUsContent = fs.readFileSync(enUsPath, 'utf8');
    const enUsData = JSON.parse(enUsContent);

    // 添加缺失的翻译键
    Object.keys(missingTranslations).forEach((key) => {
        if (!enUsData[key]) {
            enUsData[key] = missingTranslations[key];
        } else {
            // 如果已存在，合并新的翻译键
            enUsData[key] = { ...enUsData[key], ...missingTranslations[key] };
        }
    });

    // 写入文件
    fs.writeFileSync(enUsPath, JSON.stringify(enUsData, null, 4), 'utf8');
    console.log('Added missing translations to en_us.json');
}

// 执行修复
console.log('Starting i18n reactivity fixes...');

// 添加缺失的翻译键
addMissingTranslations();

// 修复页面
pagesToFix.forEach(fixPage);

console.log('i18n reactivity fixes completed!');
