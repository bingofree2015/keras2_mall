<template>
    <div class="dict-container">
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters">
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
                                    perms="system:dict:view"
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
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? $t('action.add') : $t('action.edit')"
            :model-value="editDialogVisible"
            width="40%"
        >
            <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="80px">
                <el-form-item v-if="false" label="ID" prop="id">
                    <el-input v-model="formData.id" :disabled="true" auto-complete="off" />
                </el-form-item>
                <el-form-item :label="$t('dict.label')" prop="label">
                    <el-input v-model="formData.label" auto-complete="off" />
                </el-form-item>
                <el-form-item :label="$t('dict.value')" prop="value">
                    <el-input v-model="formData.value" auto-complete="off" />
                </el-form-item>
                <el-form-item :label="$t('dict.type')" prop="type">
                    <el-input v-model="formData.type" auto-complete="off" />
                </el-form-item>
                <el-form-item :label="$t('dict.sort')" prop="sort">
                    <el-input-number
                        v-model="formData.sort"
                        :min="0"
                        controls-position="right"
                        :label="$t('system.sort')"
                        style="max-width: 100px"
                    />
                </el-form-item>
                <el-form-item :label="$t('dict.description')" prop="description">
                    <el-input v-model="formData.description" auto-complete="off" type="textarea" />
                </el-form-item>
                <el-form-item :label="$t('dict.remark')" prop="remark">
                    <el-input v-model="formData.remark" auto-complete="off" type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="normalSize" round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="normalSize"
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
            filters: {
                key: 'label',
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
                    perms: 'system:dict:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
                    // type: 'primary',            // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, row);
                        // Ensure sort is a number for el-input-number
                        this.formData.sort = Number(this.formData.sort) || 0;
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'system:dict:delete',
                    size: this.normalSize,
                    type: 'danger',
                    func: (row) => {
                        this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                            type: 'warning',
                        }).then(async () => {
                            await this.batchDelete([row.id]);
                        });
                    },
                },
            ],
            permsBatchDelete: 'system:dict:delete',

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                label: '', // 标签名
                value: '', // 值
                type: '', // 类型
                sort: 0, // Ensure this is a number
                description: '', // 描述
                remark: '',
            },
        };
    },
    computed: {
        // 响应式的搜索字段配置
        searchFields() {
            return [
                { prop: 'label', label: this.$t('system.labelName') },
                { prop: 'value', label: this.$t('system.value') },
                { prop: 'type', label: this.$t('system.type') },
                { prop: 'description', label: this.$t('system.description') },
            ];
        },
        // 响应式的列配置
        columns() {
            return [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'label', label: this.$t('system.labelName'), minWidth: 90 },
                { prop: 'value', label: this.$t('system.value'), minWidth: 80 },
                { prop: 'type', label: this.$t('system.type'), minWidth: 80 },
                { prop: 'sort', label: this.$t('system.sort'), minWidth: 70, align: 'center' },
                { prop: 'description', label: this.$t('system.description'), minWidth: 120 },
                { prop: 'remark', label: this.$t('system.remark'), minWidth: 120 },
                { prop: 'createBy', label: this.$t('system.creator'), minWidth: 100 },
                {
                    prop: 'createdAt',
                    label: this.$t('common.createTime'),
                    minWidth: 140,
                    formatter: this.env.formatDateTime,
                },
            ];
        },
        // 响应式的表单验证规则
        formDataRules() {
            return {
                label: [{ required: true, message: this.$t('dict.inputLabel'), trigger: 'blur' }],
                value: [{ required: true, message: this.$t('dict.inputValue'), trigger: 'blur' }],
                type: [{ required: true, message: this.$t('dict.inputType'), trigger: 'blur' }],
                description: [
                    { required: true, message: this.$t('dict.inputDescription'), trigger: 'blur' },
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
            const _result = await this.$api.dict.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.dict.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        // 显示新增界面
        handleAdd() {
            this.editDialogVisible = true;
            this.isCreating = true;
            this.formData = {
                id: 0,
                label: '',
                value: '',
                type: '',
                sort: 0, // Ensure this is a number
                description: '',
                remark: '',
            };
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign({}, this.formData);
                            const _result = await this.$api.dict.save(data);
                            if (_result.succeed === 1 && _result.code === 200) {
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
                            await this.queryForPaginatedList();
                        }
                    );
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
.top-bar {
    display: flex;
    justify-content: flex-end;
}
</style>
