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
                            :placeholder="$t('permission.pleaseEnterContent')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('permission.pleaseSelect')"
                                >
                                    <el-option
                                        v-for="item in props"
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
                                    perms="pay:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
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
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            alias-name="payment"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="editDialogVisible"
            class="edit-dialog"
            :title="$t('permission.edit')"
            width="50%"
        >
            <el-form ref="formData" :model="formData" :size="normalSize" label-width="100px">
                <el-form-item :label="$t('pay.paymentMethod') + ':'" prop="name">
                    {{ formData.name }}
                </el-form-item>
                <el-form-item :label="$t('pay.type') + ':'" prop="isOnline">
                    {{ formData.isOnline }}
                </el-form-item>
                <el-form-item :label="$t('pay.description') + ':'" prop="memo">
                    {{ formData.memo }}
                </el-form-item>
                <template v-if="formData.code === 'wechatpay'">
                    <el-form-item :label="$t('pay.appId') + ':'" prop="appId">
                        <div class="item-info">
                            {{ $t('pay.wechatAppIdTip') }}
                        </div>
                    </el-form-item>
                    <el-form-item :label="$t('pay.mchId') + ':'" prop="params.mchId">
                        <el-input
                            v-model="formData.params.mchId"
                            :placeholder="$t('pay.inputMchId')"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('pay.key') + ':'" prop="params.key">
                        <el-input v-model="formData.params.key" :placeholder="$t('pay.inputKey')" />
                    </el-form-item>
                    <el-form-item :label="$t('pay.certificate') + ':'">
                        <div class="item-info">
                            {{ $t('pay.certificateTip') }}
                        </div>
                    </el-form-item>
                </template>
                <template v-else-if="formData.code === 'alipay'">
                    <el-form-item :label="$t('pay.appId') + ':'" prop="params.appId">
                        <el-input
                            v-model="formData.params.appId"
                            :placeholder="$t('pay.inputAppId')"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="$t('pay.rsaPrivateKey') + ':'"
                        prop="params.rsaPrivateKey"
                    >
                        <el-input
                            v-model="formData.params.rsaPrivateKey"
                            :rows="2"
                            :placeholder="$t('pay.inputRsaPrivateKey')"
                            type="textarea"
                        />
                    </el-form-item>
                    <el-form-item
                        :label="$t('pay.alipayPublicKey') + ':'"
                        prop="params.alipayPublicKey"
                    >
                        <el-input
                            v-model="formData.params.alipayPublicKey"
                            :rows="2"
                            :placeholder="$t('pay.inputAlipayPublicKey')"
                            type="textarea"
                        />
                    </el-form-item>
                </template>
                <el-row>
                    <el-col :span="9">
                        <el-form-item :label="$t('pay.sort') + ':'" prop="sort">
                            <el-input-number
                                v-model="formData.sort"
                                :max="10"
                                :min="1"
                                controls-position="right"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item :label="$t('pay.status') + ':'" prop="status">
                            <el-switch
                                v-model="formData.status"
                                :active-text="$t('pay.enable')"
                                :inactive-text="$t('pay.lock')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="miniSize" round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="miniSize"
                        round
                        type="primary"
                        @click="submitForm"
                    >
                        {{ $t('action.submit') }}
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
            smallSize: 'small',
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
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'pay:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.formData = Object.assign({}, row);
                    },
                },
            ],

            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                code: '', // 支付类型编码
                name: '', // 支付类型名称
                isOnline: '', // 是否线上支付
                memo: '', // 支付方式描述
                params: {}, // 参数
                sort: 0, // 排序
                state: '', // 启用状态
            },
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
        // 响应式的 props 配置
        props() {
            return [{ prop: 'name', label: this.$t('pay.paymentMethodName') }];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: this.$t('pay.paymentMethodName'), minWidth: 150 },
                { prop: 'code', label: this.$t('pay.paymentTypeCode'), minWidth: 140 },
                {
                    prop: 'isOnline',
                    label: this.$t('pay.type'),
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'sort', label: this.$t('pay.sort'), minWidth: 80 },
                {
                    prop: 'state',
                    label: this.$t('pay.enableStatus'),
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.formatState,
                },
            ];
        },
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
            const _result = await this.$api.pay.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.pay.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _pay = this.paginated.list.find((v) => v.id === _result.data.id);
                            if (!_pay) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_pay, _result.data);
                            }
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }

                        this.editLoading = false;
                        this.$refs.formData.resetFields();
                        this.editDialogVisible = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
.edit-dialog :deep(.el-form-item) {
    .item-info {
        font-size: 12px;
        color: #909399;
        line-height: 24px;
    }
}
</style>
