<template>
    <el-row>
        <el-col :span="10">
            <bread-crumb />
        </el-col>
        <el-col :span="14" class="top-bar">
            <el-form :inline="true" :model="filters">
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
                                perms="system:dict:view"
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
                        perms="system:dict:add"
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
        @query-for-paginated-list="queryForPaginatedList"
    />

    <!--新增编辑界面-->
    <el-dialog
        :close-on-click-modal="false"
        :title="isCreating ? '新增' : '编辑'"
        :model-value="editDialogVisible"
        width="40%"
    >
        <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="80px">
            <el-form-item v-if="false" label="ID" prop="id">
                <el-input v-model="formData.id" :disabled="true" auto-complete="off" />
            </el-form-item>
            <el-form-item label="名称" prop="label">
                <el-input v-model="formData.label" auto-complete="off" />
            </el-form-item>
            <el-form-item label="值" prop="value">
                <el-input v-model="formData.value" auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-input v-model="formData.type" auto-complete="off" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number
                    v-model="formData.sort"
                    :min="0"
                    controls-position="right"
                    label="排序"
                    style="max-width: 100px"
                />
            </el-form-item>
            <el-form-item label="描述 " prop="description">
                <el-input v-model="formData.description" auto-complete="off" type="textarea" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" auto-complete="off" type="textarea" />
            </el-form-item>
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
            filters: {
                key: 'label',
                value: '',
            },
            props: [
                { prop: 'label', label: '标签名' },
                { prop: 'value', label: '值' },
                { prop: 'type', label: '类型' },
                { prop: 'description', label: '描述' },
            ],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'label', label: '标签名', minWidth: 80 },
                { prop: 'value', label: '值', minWidth: 80 },
                { prop: 'type', label: '类型', minWidth: 80 },
                { prop: 'sort', label: '排序', minWidth: 70, align: 'center' },
                { prop: 'description', label: '描述', minWidth: 120 },
                { prop: 'remark', label: '备注', minWidth: 120 },
                { prop: 'createBy', label: '创建人', minWidth: 100 },
                {
                    prop: 'createdAt',
                    label: '创建时间',
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
                    perms: 'system:dict:edit', // 权限标识
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
                    perms: 'system:dict:delete',
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
                sort: 0,
                description: '', // 描述
                remark: '',
            },
            formDataRules: {
                label: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
                value: [{ required: true, message: '请输入值', trigger: 'blur' }],
                type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
                description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
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
                sort: 0,
                description: '',
                remark: '',
            };
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.dict.save(data);
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
                        await this.queryForPaginatedList();
                    });
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
