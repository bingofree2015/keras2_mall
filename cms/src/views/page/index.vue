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
                                    perms="page:view"
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
                            perms="page:add"
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
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="largeSize"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="formData.name" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="formData.code" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="描述" prop="desc">
                            <el-input
                                v-model="formData.desc"
                                :autosize="{ minRows: 4, maxRows: 8 }"
                                type="textarea"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="布局样式" prop="layout">
                            <el-radio-group v-model="formData.layout">
                                <el-radio :value="1">移动端</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="布局类型" prop="type">
                            <el-radio-group v-model="formData.type">
                                <el-radio :value="1">移动端</el-radio>
                                <el-radio :value="2">PC端</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
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
                        @click="submitForm()"
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
            filters: {
                key: 'name',
                value: '',
            },
            props: [{ prop: 'name', label: '页面名称' }],

            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '名称', minWidth: 160, showOverflowTooltip: true },
                { prop: 'code', label: '编码', minWidth: 120 },
                { prop: 'desc', label: '描述', minWidth: 250, showOverflowTooltip: true },
                { prop: 'layout', label: '布局样式', minWidth: 100 },
                { prop: 'type', label: '布局类型', minWidth: 100 },
            ],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'page:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign({}, row);
                    },
                },
                {
                    label: 'action.design', // 按钮上显示的文字
                    icon: 'el-icon-ali-sheji', // 按钮文字前面的图标
                    perms: 'page:visual_design', // 权限标识
                    size: this.normalSize, // 按钮大小
                    func: (row) => {
                        this.$router.push({
                            path: '/page/visual_design',
                            query: { id: row.id },
                        });
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'page:delete',
                    size: this.normalSize,
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
            permsBatchDelete: 'page:delete',

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                name: '', // 名称
                code: '', // 编码
                desc: '', // 描述
                layout: 1, // 布局样式
                type: 1, // 布局类型
            },
            formDataRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
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
            const _result = await this.$api.page.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.page.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        handleAdd() {
            this.editDialogVisible = true;
            this.isCreating = true;
            this.formData = {
                id: 0,
                name: '', // 名称
                code: '', // 编码
                desc: '', // 描述
                layout: 1, // 布局样式
                type: 1, // 布局类型
            };
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        let data = Object.assign({}, this.formData);
                        data = _.pick(data, ['id', 'name', 'code', 'desc', 'layout', 'type']);
                        const _result = await this.$api.page.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _page = this.paginated.list.find((v) => v.id === _result.data.id);
                            if (!_page) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_page, _result.data);
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
