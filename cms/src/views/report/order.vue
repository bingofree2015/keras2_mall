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
                        <el-form-item :label="$t('report.granularity')" prop="unit">
                            <el-radio-group v-model="unit">
                                <el-radio :value="0" style="margin-right: 5px">
                                    {{ $t('report.hour') }}
                                </el-radio>
                                <el-radio :value="1">
                                    {{ $t('report.day') }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <ext-button
                            :label="$t('action.search')"
                            icon="el-icon-ali-chazhaobiaodanliebiao"
                            perms="report:goods_collection:view"
                            type="primary"
                            @click="drawLine()"
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

        <!--图表区-->
        <el-row>
            <el-col :span="24">
                <div id="orderChart" style="width: 100%; height: 400px"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
import * as echarts from 'echarts';
export default {
    components: {
        breadCrumb,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            // miniSize: 'mini', // 删除 miniSize

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
            unit: 0,

            orderChart: null,
        };
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        async drawLine() {
            this.orderChart = echarts.init(document.getElementById('orderChart'));
            let _startTime = Date.now();
            let _endTime = _startTime + 3600 * 1000 * 24;
            if (Array.isArray(this.rangeDate) && this.rangeDate.length === 2) {
                _startTime = this.rangeDate[0];
                _endTime = this.rangeDate[1];
            }

            const _result = await this.$api.report.getOrderData({
                startTime: _startTime,
                endTime: _endTime,
                unit: this.unit,
            });
            if (_result.succeed === 1 && _result.code === 200) {
                this.orderChart.setOption(_result.data);
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
