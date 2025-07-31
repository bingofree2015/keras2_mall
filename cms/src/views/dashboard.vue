<template>
    <div class="page-container">
        <el-row :gutter="10" justify="space-between">
            <el-col :span="8">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-edit"></i>
                            {{ $t('dashboard.quickActions') }}
                        </div>
                    </template>
                    <div>
                        <el-row :gutter="5" justify="space-between">
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-shangpin-copy"></i>
                                    <br />
                                    {{ $t('dashboard.goods') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-dd"></i>
                                    <br />
                                    {{ $t('dashboard.order') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-huiyuanguanli"></i>
                                    <br />
                                    {{ $t('dashboard.member') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-gonggaoliebiao"></i>
                                    <br />
                                    {{ $t('dashboard.notice') }}
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" justify="space-between">
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-cuxiao"></i>
                                    <br />
                                    {{ $t('dashboard.promotion') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-icon209"></i>
                                    <br />
                                    {{ $t('dashboard.delivery') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-zhifu"></i>
                                    <br />
                                    {{ $t('dashboard.paymentMethod') }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box-item">
                                    <i class="el-icon-ali-platform-setting"></i>
                                    <br />
                                    {{ $t('dashboard.platformSetting') }}
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-daibanshixiang"></i>
                            {{ $t('dashboard.todoList') }}
                        </div>
                    </template>
                    <div class="body">
                        <el-row :gutter="5" justify="space-between">
                            <el-col :span="12">
                                <div class="box-item">
                                    {{ $t('dashboard.pendingPayment') }}
                                    <br />
                                    <span class="summary">0</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="box-item">
                                    {{ $t('dashboard.pendingDelivery') }}
                                    <br />
                                    <span class="summary">0</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" justify="space-between">
                            <el-col :span="12">
                                <div class="box-item">
                                    {{ $t('dashboard.pendingAfterSale') }}
                                    <br />
                                    <span class="summary">0</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="box-item">
                                    {{ $t('dashboard.stockAlert') }}
                                    <br />
                                    <span class="summary">0</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-banbenxinxi"></i>
                            {{ $t('dashboard.versionInfo') }}
                        </div>
                    </template>
                    <div class="body">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in activities"
                                :key="index"
                                :color="activity.color"
                                :icon="activity.icon"
                                :size="activity.size"
                                :timestamp="activity.timestamp"
                                :type="activity.type"
                            >
                                {{ activity.content }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <p></p>

        <el-row :gutter="10" justify="space-between">
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-dingdantongji"></i>
                            {{ $t('dashboard.orderStatistics') }}
                        </div>
                    </template>
                    <div class="body">
                        <div id="chartColumn" style="width: 100%; height: 400px"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-huiyuantongji"></i>
                            {{ $t('dashboard.memberStatistics') }}
                        </div>
                    </template>
                    <div class="body">
                        <div id="chartColumn2" style="width: 100%; height: 400px"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <p></p>
        <el-row :gutter="10" justify="space-between">
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-zuijindenglu"></i>
                            {{ $t('dashboard.recentLogin') }}
                        </div>
                    </template>
                    <div class="body">
                        <el-table :data="loginLogData" stripe>
                            <el-table-column
                                :label="$t('dashboard.status')"
                                min-width="60"
                                prop="state"
                            />
                            />
                            <el-table-column
                                :label="$t('dashboard.recordTime')"
                                min-width="120"
                                prop="createdAt"
                            />
                            <el-table-column
                                :label="$t('dashboard.loginIP')"
                                min-width="100"
                                prop="ip"
                            />
                            />
                        </el-table>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <template #header>
                        <div>
                            <i class="el-icon-ali-caozuorizhi"></i>
                            {{ $t('dashboard.operationLog') }}
                        </div>
                    </template>
                    <div class="body">
                        <el-table :data="operateLogData" stripe>
                            <el-table-column
                                :label="$t('dashboard.operator')"
                                min-width="100"
                                prop="username"
                            />
                            <el-table-column
                                :label="$t('dashboard.operationTime')"
                                min-width="120"
                                prop="createdAt"
                            />
                            <el-table-column
                                :label="$t('dashboard.operationContent')"
                                min-width="200"
                                prop="content"
                            />
                            <el-table-column
                                :label="$t('dashboard.operationIP')"
                                min-width="100"
                                prop="ip"
                            />
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    components: {},
    data() {
        return {
            loginLogData: [],
            operateLogData: [],
            chartColumn: null,
        };
    },
    computed: {
        // 响应式的图表配置
        chartOptions() {
            return {
                title: {
                    text: this.$t('dashboard.simulateSales'),
                    subtext: this.$t('dashboard.virtualData'),
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: [this.$t('dashboard.purchaseAmount'), this.$t('dashboard.salesAmount')],
                },
                xAxis: {
                    type: 'category',
                    data: [
                        this.$t('dashboard.monday'),
                        this.$t('dashboard.tuesday'),
                        this.$t('dashboard.wednesday'),
                        this.$t('dashboard.thursday'),
                        this.$t('dashboard.friday'),
                        this.$t('dashboard.saturday'),
                        this.$t('dashboard.sunday'),
                    ],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: this.$t('dashboard.purchaseAmount'),
                        type: 'line',
                        data: [120, 132, 101, 134, 90, 230, 210],
                        markPoint: {
                            data: [
                                { type: 'max', name: this.$t('dashboard.maxValue') },
                                { type: 'min', name: this.$t('dashboard.minValue') },
                            ],
                        },
                    },
                    {
                        name: this.$t('dashboard.averageValue'),
                        type: 'line',
                        data: [220, 182, 191, 234, 290, 330, 310],
                        markPoint: {
                            data: [
                                { type: 'max', name: this.$t('dashboard.maxValue') },
                                { type: 'min', name: this.$t('dashboard.minValue') },
                            ],
                        },
                    },
                    {
                        name: this.$t('dashboard.salesAmount'),
                        type: 'line',
                        data: [150, 232, 201, 154, 190, 330, 410],
                        markPoint: {
                            data: [
                                { type: 'max', name: this.$t('dashboard.maxValue') },
                                { type: 'min', name: this.$t('dashboard.minValue') },
                            ],
                        },
                    },
                ],
            };
        },
        // 响应式的测试文本
        testText() {
            return this.$t('dashboard.testText');
        },
        // 响应式的支持图标配置
        supportIcon() {
            return this.$t('dashboard.supportIcon');
        },
        // 响应式的支持颜色配置
        supportColor() {
            return this.$t('dashboard.supportColor');
        },
        // 响应式的活动配置
        activities() {
            return [
                {
                    content: this.$t('dashboard.supportIcon'),
                    timestamp: '2019-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more',
                },
                {
                    content: this.$t('dashboard.supportColor'),
                    timestamp: '2019-04-03 20:46',
                    color: '#0bbd87',
                },
            ];
        },
    },

    created() {},
    mounted() {
        this.drawLine();
        this.drawLine2();
    },
    methods: {
        drawLine() {
            this.chartColumn = echarts.init(document.getElementById('chartColumn'));

            this.chartColumn.setOption({
                title: { text: 'Column Chart' },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                    },
                ],
            });
        },
        drawLine2() {
            this.chartColumn2 = echarts.init(document.getElementById('chartColumn2'));

            this.chartColumn2.setOption({
                baseOption: {
                    title: {
                        text: this.$t('dashboard.simulateSales'),
                        subtext: this.$t('dashboard.virtualData'),
                    },
                    legend: {
                        data: [
                            this.$t('dashboard.purchaseAmount'),
                            this.$t('dashboard.salesAmount'),
                        ],
                    },
                    xAxis: {
                        data: [
                            this.$t('dashboard.monday'),
                            this.$t('dashboard.tuesday'),
                            this.$t('dashboard.wednesday'),
                            this.$t('dashboard.thursday'),
                            this.$t('dashboard.friday'),
                            this.$t('dashboard.saturday'),
                            this.$t('dashboard.sunday'),
                        ],
                    },
                    yAxis: {},
                    tooltip: {
                        show: true,
                        formatter: '系列名:{a}<br />类目:{b}<br />数值:{c}',
                    },
                    series: [
                        {
                            name: this.$t('dashboard.purchaseAmount'),
                            type: 'bar',
                            data: [200, 312, 431, 241, 175, 275, 369],
                            markPoint: {
                                data: [
                                    { type: 'max', name: this.$t('dashboard.maxValue') },
                                    { type: 'min', name: this.$t('dashboard.minValue') },
                                ],
                            },
                            markLine: {
                                data: [
                                    {
                                        type: 'average',
                                        name: this.$t('dashboard.averageValue'),
                                        itemStyle: {
                                            normal: {
                                                color: 'green',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: this.$t('dashboard.salesAmount'),
                            type: 'line',
                            data: [321, 432, 543, 376, 286, 298, 400],
                            markPoint: {
                                data: [
                                    { type: 'max', name: this.$t('dashboard.maxValue') },
                                    { type: 'min', name: this.$t('dashboard.minValue') },
                                ],
                            },
                            markLine: {
                                data: [
                                    {
                                        type: 'average',
                                        name: this.$t('dashboard.averageValue'),
                                        itemStyle: {
                                            normal: {
                                                color: 'blue',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                media: [
                    {
                        // 小与1000像素时候响应
                        query: {
                            maxWidth: 1000,
                        },
                        option: {
                            title: {
                                show: true,
                                text: this.$t('dashboard.testText'),
                            },
                        },
                    },
                ],
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#myChart {
    width: 95%;
    height: 300px;
    margin: 20px auto;
    border: 1px solid #ccc;
}
.page-container :deep(.box-card) {
    .el-card__header {
        text-align: left;
        height: 42px;
        padding: 10px;
        i {
            padding: 0px 5px;
            font-size: 20px;
        }
    }
    .el-card__body {
        text-align: left;
        font-size: 14px;
        .el-col > .box-item {
            background: #f2f6fc;
            border-radius: 4px;
            text-align: center;
            padding: 8px;
            margin: 5px;
            i {
                font-size: 24px;
                border-radius: 4px;
            }
            .summary {
                font-size: 20px;
            }
        }
    }
}
</style>
