<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :size="largeSize">
                    <el-form-item>
                        <el-date-picker
                            v-model="rangeDate"
                            :picker-options="pickerOptions"
                            align="right"
                            end-placeholder="结束日期"
                            range-separator="至"
                            start-placeholder="开始日期"
                            style="width: 240px"
                            type="daterange"
                            unlink-panels
                        />
                        <el-form-item label="粒度" prop="unit">
                            <el-radio-group v-model="unit">
                                <el-radio :label="0" style="margin-right: 5px">小时</el-radio>
                                <el-radio :label="1">天</el-radio>
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
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="导出" placement="top">
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
                <div id="payChart" style="width: 100%; height: 400px"></div>
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
    data() {
        return {
            largeSize: 'large',
            // miniSize: 'default', // 删除 miniSize

            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近三个月',
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

            payChart: null,
        };
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        async drawLine() {
            this.payChart = echarts.init(document.getElementById('payChart'));

            let _startTime = Date.now();
            let _endTime = _startTime + 3600 * 1000 * 24;
            if (Array.isArray(this.rangeDate) && this.rangeDate.length === 2) {
                _startTime = this.rangeDate[0];
                _endTime = this.rangeDate[1];
            }

            const _result = await this.$api.report.getPayData({
                startTime: _startTime,
                endTime: _endTime,
                unit: this.unit,
            });
            if (_result.succeed === 1 && _result.code === 200) {
                this.payChart.setOption(_result.data);
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>
