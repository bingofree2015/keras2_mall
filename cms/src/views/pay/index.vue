<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="largeSize">
                    <el-form-item>
                        <el-input v-model="filters.value" placeholder="请输入内容">
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    placeholder="请选择"
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
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button round @click="queryForPaginatedList()">
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
            title="编辑"
            width="50%"
        >
            <el-form ref="formData" :model="formData" :size="largeSize" label-width="100px">
                <el-form-item label="支付方式:" prop="name">
                    {{ formData.name }}
                </el-form-item>
                <el-form-item label="类型:" prop="isOnline">
                    {{ formData.isOnline }}
                </el-form-item>
                <el-form-item label="描述:" prop="memo">
                    {{ formData.memo }}
                </el-form-item>
                <template v-if="formData.code === 'wechatpay'">
                    <el-form-item label="appId:" prop="appId">
                        <div class="item-info">
                            1、微信公众号内支付:取微信公众号appId
                            <br />
                            2、小程序支付:取小程序的appId
                            <br />
                            3、h5端微信支付:不开启微信公众号和微信小程序，取上面两个中任意一个appId
                        </div>
                    </el-form-item>
                    <el-form-item label="mchId:" prop="params.mchId">
                        <el-input v-model="formData.params.mchId" placeholder="请输入mchId" />
                    </el-form-item>
                    <el-form-item label="key:" prop="params.key">
                        <el-input v-model="formData.params.key" placeholder="请输入key" />
                    </el-form-item>
                    <el-form-item label="证书:">
                        <div class="item-info">
                            在线退款:需要手动上传cert、key证书
                            <br />
                            不在线退款:则不需要上传cert、key证书
                            <br />
                            cert证书请手动上传到 cert证书请手动上传到 cert证书请手动上传到
                            /cert/payment/wechatpay/apiclient_cert.pem
                            <br />
                            key证书请手动上传到 /cert/payment/wechatpay/apiclient_key.pem
                        </div>
                    </el-form-item>
                </template>
                <template v-else-if="formData.code === 'alipay'">
                    <el-form-item label="appId:" prop="params.appId">
                        <el-input v-model="formData.params.appId" placeholder="请输入appId" />
                    </el-form-item>
                    <el-form-item label="RSA私钥:" prop="params.rsaPrivateKey">
                        <el-input
                            v-model="formData.params.rsaPrivateKey"
                            :rows="2"
                            placeholder="请输入rsaPrivateKey"
                            type="textarea"
                        />
                    </el-form-item>
                    <el-form-item label="支付宝公钥:" prop="params.alipayPublicKey">
                        <el-input
                            v-model="formData.params.alipayPublicKey"
                            :rows="2"
                            placeholder="请输入支付宝公钥"
                            type="textarea"
                        />
                    </el-form-item>
                </template>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="排序:" prop="sort">
                            <el-input-number
                                v-model="formData.sort"
                                :max="10"
                                :min="1"
                                controls-position="right"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="状态:" prop="status">
                            <el-switch
                                v-model="formData.status"
                                active-text="开启"
                                inactive-text="锁定"
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
    data() {
        return {
            largeSize: 'large',
            smallSize: 'small',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '支付方式名称' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '支付方式名称', minWidth: 150 },
                { prop: 'code', label: '支付类型编码', minWidth: 140 },
                {
                    prop: 'isOnline',
                    label: '类型',
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'sort', label: '排序', minWidth: 80 },
                {
                    prop: 'state',
                    label: '启用状态',
                    minWidth: 80,
                    align: 'center',
                    formatter: this.env.formatState,
                },
            ],
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
                    _operationWidth += this.operations.length * 100;
                }
                return _operationWidth;
            },
        },
    },
    mounted() {},
    methods: {
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
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
