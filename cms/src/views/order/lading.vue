<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="8">
                <bread-crumb />
            </el-col>
            <el-col :span="16" class="top-bar">
                <el-form :inline="true" :model="filters" :size="normalSize">
                    <el-form-item>
                        <el-input v-model="filters.value" placeholder="请输入内容">
                            <el-select
                                #prepend
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
                            <ext-button
                                #append
                                :label="$t('action.search')"
                                icon="el-icon-ali-chazhaobiaodanliebiao"
                                perms="order:lading:view"
                                type="primary"
                                @click="queryForPaginatedList()"
                            />
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="刷新" placement="top">
                                <el-button
                                    icon="el-icon-ali-shuaxin"
                                    round
                                    @click="queryForPaginatedList()"
                                />
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
            title="提货单编辑"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="提货单号:" prop="ladingId">
                            {{ formData.ladingId }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单号:" prop="orderId">
                            {{ formData.orderId }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="提货门店:" prop="storeId">
                            <el-select v-model="formData.storeId" placeholder="请选择">
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
                        <el-form-item label="提货人:" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入提货人" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话:" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="请输入电话" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="status">
                            {{ formData.status }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="时间:" prop="createdAt">
                            {{ formData.createdAt }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接待店员:" prop="clerkId">
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
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '提货人姓名' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'ladingId', label: '提货单号', minWidth: 120 },
                { prop: 'orderId', label: '订单号', minWidth: 120 },
                { prop: 'store.storeName', label: '门店', minWidth: 150 },
                { prop: 'name', label: '提货人', minWidth: 100 },
                { prop: 'mobile', label: '电话', minWidth: 120 },
                { prop: 'status', label: '状态', minWidth: 70, align: 'center' },
                {
                    prop: 'createdAt',
                    label: '下单时间',
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
                        this.$confirm('确认删除选中记录吗？', '提示', {
                            type: 'warning',
                        }).then(async () => {
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
            formDataRules: {
                name: [{ required: true, message: '请输入提货人姓名', trigger: 'blur' }],
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
    async mounted() {
        await this.getStores();
    },
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
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

<style scoped lang="scss"></style>
