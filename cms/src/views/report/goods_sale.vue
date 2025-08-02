<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :size="normalSize" class="search-form">
                    <el-form-item>
                        <el-date-picker
                            v-model="rangeDate"
                            :picker-options="pickerOptions"
                            align="right"
                            :end-placeholder="$t('report.endDate')"
                            :range-separator="$t('report.rangeSeparator')"
                            :start-placeholder="$t('report.startDate')"
                            style="width: 240px"
                            type="daterange"
                            unlink-panels
                        />
                        <ext-button
                            :label="$t('action.search')"
                            icon="el-icon-ali-chazhaobiaodanliebiao"
                            perms="report:goods_collection:view"
                            type="primary"
                            @click="getGoodsList()"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('permission.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('permission.export')" placement="top">
                                <el-button round>
                                    <i class="el-icon-ali-daochu"></i>
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!--表格内容栏-->
        <ext-table
            :columns="columns"
            :data="collectionList"
            :is-paging="false"
            :show-operation="false"
            @query-for-paginated-list="getGoodsList"
        />
    </div>
</template>

<script>
import extTable from '@/components/core/ext_table.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        extTable,
        breadCrumb,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            // miniSize: 'default', // 删除 miniSize

            pickerOptions: {
                shortcuts: [
                    {
                        text: this.$t('report.lastWeek'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('report.lastMonth'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('report.lastThreeMonths'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
            },
            rangeDate: [Date.now(), Date.now() + 3600 * 1000 * 24],

            collectionList: [],
        };
    },
    computed: {
        // 响应式的列配置
        columns() {
            return [
                {
                    prop: 'num',
                    label: this.$t('report.salesVolume'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'amount',
                    label: this.$t('report.salesAmount'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'specs',
                    label: this.$t('report.specification'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'sn',
                    label: this.$t('report.goodsCode'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'name',
                    label: this.$t('visualDesign.goodsName'),
                    minWidth: 280,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'imageUrl',
                    label: this.$t('report.image'),
                    minWidth: 80,
                    propType: 'image',
                    align: 'center',
                    showOverflowTooltip: true,
                },
            ];
        },
    },
    methods: {
        // 获取分页数据
        async getGoodsList(data) {
            const _searchKey = {};
            if (Array.isArray(this.rangeDate) && this.rangeDate.length === 2) {
                _searchKey.createdAt = {
                    $and: { $gte: this.rangeDate[0], $lt: this.rangeDate[1] },
                };
            }
            const _result = await this.$api.report.getGoods({ searchKey: _searchKey });
            if (_result.succeed === 1 && _result.code === 200) {
                this.collectionList = _result.data.list;
            }
            if (data && data.cb) data.cb();
        },
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
    },
};
</script>

<style scoped lang="scss"></style>
