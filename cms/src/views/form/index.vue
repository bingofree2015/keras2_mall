<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" :size="normalSize" class="search-form">
                    <el-form-item>
                        <el-input
                            v-model="filters.value"
                            :placeholder="$t('common.inputPlaceholder')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('common.selectPlaceholder')"
                                >
                                    <el-option
                                        v-for="item in searchFields"
                                        :key="item.prop"
                                        :label="item.label"
                                        :value="item.prop"
                                    />
                                </el-select>
                            </template>
                            <template #append>
                                <ext-button
                                    :label="$t('action.search')"
                                    icon="el-icon-ali-chazhaobiaodanliebiao"
                                    perms="form:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('action.add')" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('action.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('action.export')" placement="top">
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
            :batch-delete="batchDelete"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            alias-name="form"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--报表查看界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="reportDialogVisible"
            class="dialog-container"
            :title="$t('form.reportView')"
            width="40%"
        >
            <el-form :inline="true" :size="normalSize">
                <el-row>
                    <el-col :span="24" style="text-align: right">
                        <el-form-item :label="$t('form.totalSubmit') + ':'" prop="totalCount">
                            <b>{{ totalCount }}</b>
                        </el-form-item>
                        <el-form-item :label="$t('form.totalMoney') + ':'" prop="totalMoney">
                            <b>{{ totalMoney }}</b>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div id="formSubmitChart" style="width: 100%; height: 200px"></div>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        :size="normalSize"
                        round
                        type="primary"
                        @click="reportDialogVisible = false"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog
            :close-on-click-modal="false"
            :model-value="qrCodeDialogVisible"
            :title="$t('form.qrcodeGenerate')"
            width="40%"
        >
            <el-row justify="center">
                <el-col :span="24" style="text-align: center">
                    <canvas id="qrCode" height="300" width="300"></canvas>
                </el-col>
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="normalSize" round @click="qrCodeDialogVisible = false">
                        {{ $t('action.close') }}
                    </el-button>
                    <el-button :size="normalSize" round @click="downloadQrCode">
                        {{ $t('action.download') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
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
            filters: {
                key: 'name',
                value: '',
            },
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.qrcode',
                    icon: 'el-icon-ali-qrcode',
                    perms: 'form:delete',
                    size: this.normalSize,
                    func: (row) => {
                        // 生成二维码窗口
                        this.qrCodeDialogVisible = true;
                        this.$nextTick(() => {
                            const _qrCode = document.getElementById('qrCode');
                            // 创建image对象
                            const _img = new Image();
                            _img.src =
                                'http://5b0988e595225.cdn.sohucs.com/images/20171112/93d46c34e1094544b50174797fc5cf99.jpeg';
                            _img.setAttribute('crossOrigin', 'Anonymous');
                            _img.onload = function () {
                                const ctx = _qrCode.getContext('2d');
                                ctx.drawImage(this, 0, 0, 300, 300);
                            };
                        });
                    },
                },
                {
                    label: 'action.report',
                    icon: 'el-icon-ali-baobiaotongji',
                    perms: 'form:view',
                    size: this.normalSize,
                    func: (row) => {
                        this.reportDialogVisible = true;
                        this.totalCount = row.totalCount;
                        this.totalMoney = row.totalMoney;
                    },
                },
            ],
            permsBatchDelete: 'form:delete',
            reportDialogVisible: false,
            qrCodeDialogVisible: false,
            totalCount: 0,
            totalMoney: 0,
        };
    },
    computed: {
        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 120;
                }
                return _operationWidth;
            },
        },
        // 响应式的搜索字段配置
        searchFields() {
            return [{ prop: 'name', label: this.$t('form.formName') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                {
                    prop: 'name',
                    label: this.$t('form.formName'),
                    minWidth: 180,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'desc',
                    label: this.$t('form.formDesc'),
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'type',
                    label: this.$t('form.type'),
                    minWidth: 70,
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'isLogin',
                    label: this.$t('form.needLogin'),
                    minWidth: 100,
                    align: 'center',
                    formatter: this.env.formatBoolean,
                },
                { prop: 'sort', label: this.$t('system.sort'), minWidth: 70, align: 'center' },
                {
                    prop: 'createdAt',
                    label: this.$t('common.createTime'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ];
        },
    },
    mounted() {
        // 页面加载时自动获取数据
        this.queryForPaginatedList();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        // 获取分页数据
        async queryForPaginatedList(data) {
            if (data && data.attrs) {
                this.paginated.attrs = data.attrs;
            }
            this.paginated.attrs.searchKey = {};
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.form.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        handleAdd() {
            this.$router.push({ path: '/form/edit', query: { isCreating: 1 } });
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.form.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        downloadQrCode() {
            // 下载二维码逻辑
        },
    },
};
</script>
