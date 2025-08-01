<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" :model="filters" class="search-form">
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
                                    perms="order:lading:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
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
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--提货单编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="editDialogVisible"
            :title="$t('order.ladingEdit')"
            width="40%"
        >
            <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.ladingId') + ':'" prop="ladingId">
                            {{ formData.ladingId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.orderId') + ':'" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.store') + ':'" prop="storeId">
                            <el-select
                                v-model="formData.storeId"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="item in stores"
                                    :key="item.id"
                                    :label="item.storeName"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.ladingName') + ':'" prop="name">
                            <el-input
                                v-model="formData.name"
                                :placeholder="$t('order.inputLadingName')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.mobile') + ':'" prop="mobile">
                            <el-input
                                v-model="formData.mobile"
                                :placeholder="$t('order.inputMobile')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.status') + ':'" prop="status">
                            {{ formData.status }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.createdAt') + ':'" prop="createdAt">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('order.clerkId') + ':'" prop="clerkId">
                            {{ formData.clerkId }}
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
import _ from 'lodash';
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
            props: [{ prop: 'name', label: '提货人姓名' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'ladingId', label: this.$t('order.ladingId'), minWidth: 120 },
                { prop: 'orderId', label: this.$t('order.orderId'), minWidth: 120 },
                { prop: 'store.storeName', label: this.$t('order.store'), minWidth: 150 },
                { prop: 'name', label: this.$t('order.ladingName'), minWidth: 100 },
                { prop: 'mobile', label: this.$t('order.mobile'), minWidth: 120 },
                { prop: 'status', label: this.$t('order.status'), minWidth: 70, align: 'center' },
                {
                    prop: 'createdAt',
                    label: this.$t('order.createdAt'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
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
                    perms: 'order:lading:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, row);
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'order:lading:delete',
                    size: this.size,
                    type: 'danger',
                    func: (row) => {
                        this.$confirm(
                            this.$t('permission.confirmDeleteSelected'),
                            this.$t('common.tip'),
                            {
                                type: 'warning',
                            }
                        ).then(async () => {
                            await this.batchDelete([row.id]);
                        });
                    },
                },
            ],
            permsBatchDelete: 'order:lading:delete',

            editDialogVisible: false, // 编辑界面是否显示
            editLoading: false,
            // 编辑界面数据
            stores: [],
            formData: {
                ladingId: 0, // 提货单号
                orderId: '', // 订单号
                storeId: 0, // 提货门店ID
                store: {
                    id: 0,
                    storeName: '',
                },
                name: '', // 提货人姓名
                mobile: '', // 提货手机号
                clerkId: 0, // 处理店员ID
                ptime: null, // 提货时间
                status: 1, // 1 提货状态1=未提货 2=已提货
            },
        };
    },
    computed: {
        // 响应式的 formDataRules 配置
        formDataRules() {
            return {
                name: [
                    {
                        required: true,
                        message: this.$t('order.ladingNameRequired'),
                        trigger: 'blur',
                    },
                ],
            };
        },

        operationWidth: {
            get() {
                let _operationWidth = 0;
                if (Array.isArray(this.operations)) {
                    _operationWidth += this.operations.length * 120;
                }
                return _operationWidth;
            },
        },
    },
    async mounted() {
        await this.getStores();
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
            const _result = await this.$api.lading.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        async getStores() {
            const _result = await this.$api.store.list({});
            if (_result.succeed === 1 && _result.code === 200) {
                this.stores = _result.data.list;
            }
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.lading.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign(
                            {},
                            _.pick(this.formData, ['id', 'storeId', 'name', 'mobile'])
                        );
                        const _result = await this.$api.lading.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _lading = this.paginated.list.find(
                                (v) => v.id === _result.data.id
                            );
                            if (!_lading) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_lading, _result.data);
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

<style scoped lang="scss"></style>
