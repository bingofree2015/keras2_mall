<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="normalSize">
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
                                    perms="promotion:coupon:view"
                                    type="primary"
                                    @click="queryForPaginatedList()"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <ext-button
                            :label="$t('action.add')"
                            icon="el-icon-ali-add"
                            perms="promotion:coupon:add"
                            type="primary"
                            @click="handleAdd"
                        />
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
            :batch-delete="batchDelete"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            alias-name="promotion"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :model-value="editDialogVisible"
            title="生成优惠券"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="normalSize"
                label-width="80px"
            >
                <p>请输入导出数量，最多可以导出5000张</p>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="导出数量" prop="num">
                            <el-input v-model="formData.num" />
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
            props: [{ prop: 'name', label: '促销名称' }],
            paginated: {
                attrs: { searchKey: { type: 2 }, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '优惠券名称', minWidth: 120, showOverflowTooltip: true },
                { prop: 'sort', label: '权重', minWidth: 70 },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 100,
                    align: 'center',
                    formatter: this.env.columnFormatter,
                },

                {
                    prop: 'startTime',
                    label: '开始时间',
                    minWidth: 130,
                    formatter: this.env.formatDateTime,
                },
                {
                    prop: 'endTime',
                    label: '结束时间',
                    minWidth: 130,
                    formatter: this.env.formatDateTime,
                },
            ],
            operations: [
                {
                    label: 'action.coupon', // 按钮上显示的文字
                    icon: 'el-icon-ali-youhuiquanliebiao', // 按钮文字前面的图标
                    perms: 'promotion:coupon:view', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$router.push({
                            path: '/promotion/coupon/list',
                            query: { promotionId: row.id },
                        });
                    },
                },
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'promotion:coupon:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.$router.push({
                            path: '/promotion/coupon/edit',
                            query: { id: row.id, isCreating: false },
                        });
                    },
                },
                {
                    label: 'action.build', // 按钮上显示的文字
                    icon: 'el-icon-ali-shengcheng', // 按钮文字前面的图标
                    perms: 'promotion:coupon:edit', // 权限标识
                    size: this.size, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.formData = Object.assign({}, _.pick(row, ['id', 'num']));
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'promotion:coupon:delete',
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
            permsBatchDelete: 'promotion:coupon:delete',

            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                num: 1,
            },
            formDataRules: {
                num: [{ required: true, message: '请输入生成优惠券数量', trigger: 'blur' }],
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
            this.paginated.attrs.searchKey = { type: 2 };
            if (this.filters.key && this.filters.value) {
                this.paginated.attrs.searchKey[this.filters.key] = this.filters.value;
            }
            const _result = await this.$api.promotion.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.promotion.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        // 显示新增界面
        handleAdd() {
            this.$router.push({
                path: '/promotion/coupon/edit',
                query: { id: 0, isCreating: true },
            });
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        // 生成优惠券
                        const _result = await this.$api.coupon.build(data);
                        if (_result.succeed === 1 && _result.code === 200) {
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
