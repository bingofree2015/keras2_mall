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
                                    perms="user:user_grade:view"
                                    type="primary"
                                    @click="handleRefresh"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="新增" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
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
                    <el-col :span="16">
                        <el-form-item label="编号" prop="level">
                            <el-input-number
                                v-model="formData.level"
                                :min="0"
                                controls-position="right"
                                label="编号"
                                style="width: 100px"
                            />
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="formData.name" />
                        </el-form-item>
                        <el-form-item label="默认" prop="isDef">
                            <el-switch
                                v-model="formData.isDef"
                                active-text="是"
                                inactive-text="否"
                            />
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
import { mapState } from 'vuex';
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
            largeSize: 'large',
            filters: {
                key: 'mobile',
                value: '',
            },
            props: [{ prop: 'mobile', label: '手机号' }],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'mobile', label: '手机号', minWidth: 120 },
                { prop: 'userGrade.name', label: '用户等级', minWidth: 100 },
                {
                    prop: 'sex',
                    label: '性别',
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                { prop: 'birthday', label: '生日', minWidth: 100 },
                {
                    prop: 'avatar',
                    label: '头像',
                    minWidth: 80,
                    propType: 'image',
                    align: 'center',
                },
                { prop: 'balance', label: '余额', minWidth: 70 },
                { prop: 'point', label: '积分', minWidth: 70 },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 70,
                    formatter: this.env.formatState,
                    align: 'center',
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
                    perms: 'user:user_grade:edit', // 权限标识
                    size: this.normalSize, // 按钮大小
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
                    perms: 'user:user_grade:delete',
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
            permsBatchDelete: 'user:user_grade:delete',
            disableIds: [],
            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                mobile: '',
                userGrade: {},
                sex: '',
                birthday: '',
                avatar: '',
                balance: 0,
                point: 0,
                state: 1,
            },
            formDataRules: {
                mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
            },
        };
    },
    computed: {
        ...mapState({
            loginUser: (state) => state.loginUser,
        }),
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
        // 列内容格式化
        columnFormatter(row, column) {
            const colKey = column.property || column.prop || column;
            if (
                this.mapAlias &&
                this.mapAlias.user_grade &&
                this.mapAlias.user_grade[colKey] &&
                typeof row[colKey] !== 'undefined'
            ) {
                return this.mapAlias.user_grade[colKey][row[colKey]];
            }
            return row[colKey] ?? '';
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
            const _result = await this.$api.userGrade.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.userGrade.destroy({ ids });
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
                name: '',
                isDef: false,
            };
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.userGrade.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            await this.queryForPaginatedList();
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.editDialogVisible = false;
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: _result.description,
                            });
                        }
                        this.editLoading = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
