const allComponents = {
    storeComponents: [
        {
            type: 'search',
            name: '搜索框',
            config: {
                keywords: this.$t('visualDesign.inputSearchKeyword'),
                style: 'round',
            },
            icon: 'el-icon-ali-sousuo',
        },
        {
            type: 'notice',
            name: this.$t('visualDesign.noticeGroup'),
            config: {
                type: 'auto',
                list: [
                    {
                        title: '这里是第一条公告的标题',
                        content: '',
                        id: '',
                    },
                ],
            },
            icon: 'el-icon-ali-gonggaozujian',
        },
        {
            type: 'navBar',
            name: this.$t('visualDesign.navigationGroup'),
            config: {
                limit: 4,
                list: [
                    {
                        url: 'images/empty.png',
                        text: '按钮1',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty.png',
                        text: '按钮2',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty.png',
                        text: '按钮3',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty.png',
                        text: '按钮4',
                        type: '',
                        value: '',
                    },
                ],
            },
            icon: 'el-icon-ali-daohangzujian',
        },
        {
            type: 'goods',
            name: '商品组',
            icon: 'el-icon-ali-shangpinzuguanli',
            config: {
                title: '商品组名称',
                more: 'true',
                type: 'auto',
                classifyId: '',
                brandId: '',
                limit: 10,
                display: 'list',
                column: 2,
                list: [
                    {
                        url: 'images/empty-goods.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '100.00',
                    },
                    {
                        url: 'images/empty-goods.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '59.00',
                    },
                    {
                        url: 'images/empty-goods.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '32.00',
                    },
                    {
                        url: 'images/empty-goods.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '129.00',
                    },
                ],
            },
        },
        {
            type: 'groupPurchase',
            name: this.$t('visualDesign.groupSeckill'),
            config: {
                title: '活动名称',
                limit: 5,
                list: [
                    {
                        url: 'images/empty-banner.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '99.00',
                    },
                    {
                        url: 'images/empty-banner.png',
                        name: this.$t('visualDesign.goodsName'),
                        price: '199.00',
                    },
                ],
            },
            icon: 'el-icon-ali-yingxiaogongju-tuangoumiaosha',
        },
        {
            type: 'coupon',
            name: this.$t('visualDesign.couponGroup'),
            config: {
                limit: '2',
            },
            icon: 'el-icon-ali-youhuiquan1',
        },
        {
            type: 'record',
            name: this.$t('visualDesign.record'),
            config: {
                style: {
                    top: 20,
                    left: 0,
                },
            },
            icon: 'el-icon-ali-goumaijilu',
        },
    ],
    utilsComponents: [
        {
            type: 'blank',
            name: this.$t('visualDesign.auxiliaryBlank'),
            icon: 'el-icon-ali-fuzhukongbai',
            config: {
                height: 20,
                backgroundColor: '#FFFFFF',
            },
        },
        {
            type: 'textarea',
            name: this.$t('visualDesign.textArea'),
            config: '',
            icon: 'el-icon-ali-wenbenyu',
        },
    ],
    mediaComponents: [
        {
            type: 'imgSlide',
            name: this.$t('visualDesign.imageCarousel'),
            config: {
                duration: 2500,
                list: [
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                ],
            },
            icon: 'el-icon-ali--tupianlunbo',
        },
        {
            type: 'imgSingle',
            name: '图片',
            config: {
                url: 'images/empty-banner.png',
                type: '',
                value: '',
            },
            icon: 'el-icon-ali-tupian',
        },
        {
            type: 'imgWindow',
            name: '图片分组',
            config: {
                style: 2,
                margin: 0,
                list: [
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                    {
                        url: 'images/empty-banner.png',
                        type: '',
                        value: '',
                    },
                ],
            },
            icon: 'el-icon-ali-tupianzu',
        },
        {
            type: 'video',
            name: this.$t('visualDesign.videoGroup'),
            config: {
                autoplay: 'false',
                url: 'images/empty-banner.png',
                videoUrl:
                    'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400',
                type: '',
                value: '',
            },
            icon: 'el-icon-ali-shipinzujian',
        },
        {
            type: 'article',
            name: this.$t('visualDesign.articleGroup'),
            config: {
                title: '',
                url: 'images/empty-goods.png',
            },
            icon: 'el-icon-ali-wenzhangzujian',
        },
        {
            type: 'articleClassify',
            name: this.$t('visualDesign.articleCategory'),
            config: {
                limit: 3,
                articleClassifyId: '',
            },
            icon: 'el-icon-ali-wenzhangfenlei1',
        },
    ],
};

export default allComponents;
