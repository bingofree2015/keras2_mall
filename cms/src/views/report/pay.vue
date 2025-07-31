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
                            align="right"
                            :end-placeholder="$t('report.endDate')"
                            :range-separator="$t('report.rangeSeparator')"
                            :start-placeholder="$t('report.startDate')"
                            style="width: 240px"
                            type="daterange"
                            unlink-panels
                            :shortcuts="dateShortcuts"
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
                <div v-loading="loading" element-loading-text="加载中..." style="width: 100%; height: 400px">
                    <div id="payChart" style="width: 100%; height: 400px"></div>
                </div>
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
            unit: 1,
            rangeDate: [],
            loading: false,
            dateShortcuts: [
                {
                    text: '最近一周',
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    },
                },
                {
                    text: '最近一个月',
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    },
                },
                {
                    text: '最近三个月',
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end];
                    },
                },
            ],
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
            try {
                this.loading = true;
                
                // 确保DOM元素存在
                const chartElement = document.getElementById('payChart');
                if (!chartElement) {
                    console.error('图表容器元素不存在');
                    return;
                }

                // 初始化图表
                if (this.payChart) {
                    this.payChart.dispose();
                }
                this.payChart = echarts.init(chartElement);

                // 设置默认时间范围
                let _startTime = Date.now() - 3600 * 1000 * 24 * 7; // 默认最近一周
                let _endTime = Date.now();
                
                if (Array.isArray(this.rangeDate) && this.rangeDate.length === 2) {
                    _startTime = this.rangeDate[0].getTime();
                    _endTime = this.rangeDate[1].getTime();
                }

                console.log('请求参数:', {
                    startTime: _startTime,
                    endTime: _endTime,
                    unit: this.unit,
                });

                const _result = await this.$api.report.getPayData({
                    startTime: _startTime,
                    endTime: _endTime,
                    unit: this.unit,
                });

                console.log('API响应:', _result);

                if (_result.succeed === 1 && _result.code === 200) {
                    this.payChart.setOption(_result.data);
                } else {
                    console.error('API返回错误:', _result);
                    // 显示错误信息
                    this.$message.error(_result.description || '获取数据失败');
                    
                    // 显示空图表
                    this.payChart.setOption({
                        title: {
                            text: '暂无数据',
                            left: 'center',
                            top: 'center',
                            textStyle: {
                                color: '#999',
                                fontSize: 16,
                            },
                        },
                        xAxis: { show: false },
                        yAxis: { show: false },
                        series: [],
                    });
                }
                            } catch (error) {
                    console.error('绘制图表失败:', error);
                    this.$message.error('获取数据失败: ' + error.message);
                    
                    // 显示错误状态的图表
                    if (this.payChart) {
                        this.payChart.setOption({
                            title: {
                                text: '加载失败',
                                left: 'center',
                                top: 'center',
                                textStyle: {
                                    color: '#f56c6c',
                                    fontSize: 16,
                                },
                            },
                            xAxis: { show: false },
                            yAxis: { show: false },
                            series: [],
                        });
                    }
                } finally {
                    this.loading = false;
                }
        },
    },
};
</script>

<style scoped lang="scss"></style>
