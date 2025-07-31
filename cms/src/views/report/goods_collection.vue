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
                            perms="report:goods_collection:view"
                            type="primary"
                            @click="getCollectionList()"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('report.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('report.export')" placement="top">
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
            @query-for-paginated-list="getCollectionList"
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
            rangeDate: [Date.now(), Date.now() + 3600 * 1000 * 24],
            collectionList: [],
        };
    },
    computed: {
        // 响应式的图表配置
        chartOptions() {
            return {
                title: {
                    text: this.$t('report.lastWeek'),
                },
            };
        },
        // 响应式的月度图表配置
        monthlyChartOptions() {
            return {
                title: {
                    text: this.$t('report.lastMonth'),
                },
            };
        },
        // 响应式的季度图表配置
        quarterlyChartOptions() {
            return {
                title: {
                    text: this.$t('report.lastThreeMonths'),
                },
            };
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'count', label: this.$t('report.collectionCount'), minWidth: 80 },
                { prop: 'goodsName', label: this.$t('report.goodsName'), minWidth: 200 },
                { prop: 'image', label: this.$t('report.image'), minWidth: 100 },
            ];
        },
    },
    methods: {
        // 获取分页数据
        async getCollectionList(data) {
            const _searchKey = {};
            if (Array.isArray(this.rangeDate) && this.rangeDate.length === 2) {
                _searchKey.createdAt = {
                    $and: { $gte: this.rangeDate[0], $lt: this.rangeDate[1] },
                };
            }
            const _result = await this.$api.report.getGoodsCollections({
                searchKey: _searchKey,
            });
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
