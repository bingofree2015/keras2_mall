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
                            :placeholder="$t('permission.pleaseEnterContent')"
                        >
                            <template #prepend>
                                <el-select
                                    v-model="filters.key"
                                    class="search-prepend"
                                    :placeholder="$t('permission.pleaseSelect')"
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
                                    perms="permission:sys_user:view"
                                    type="primary"
                                    @click="handleRefresh"
                                >
                                    <i class="el-icon-ali-chazhaobiaodanliebiao"></i>
                                </ext-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip :content="$t('permission.add')" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('permission.refresh')" placement="top">
                                <el-button round @click="handleRefresh">
                                    <i class="el-icon-ali-shuaxin"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="列显示" placement="top">
                                <el-button round @click="displayFilterColumnsDialog">
                                    <i class="el-icon-ali-Filter"></i>
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
                <!--表格显示列界面-->
                <table-column-filter-dialog
                    ref="tableColumnFilterDialog"
                    :columns="columns"
                    @handle-filter-columns="handleFilterColumns"
                />
            </el-col>
        </el-row>

        <!--表格内容栏-->
        <ext-table
            :batch-delete="batchDelete"
            :columns="columns"
            :count="paginated.attrs.count"
            :data="paginated.list"
            :disable-ids="disableIds"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? $t('permission.add') : $t('permission.edit')"
            :model-value="editDialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                label-position="right"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="14">
                        <el-form-item :label="$t('permission.username')" prop="username">
                            <el-input v-model="formData.username" />
                        </el-form-item>
                        <el-form-item :label="$t('permission.password')" prop="pwd">
                            <el-input v-model="formData.pwd" type="password" />
                        </el-form-item>
                        <el-form-item :label="$t('permission.email')" prop="email">
                            <el-input v-model="formData.email" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item :label="$t('permission.avatar')" prop="attachment">
                            <change-image-icon
                                :img-url="formData.attachment ? formData.attachment.path : ''"
                                @chosed-image-icon="chosedIcon"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14">
                        <el-form-item :label="$t('permission.mobile')" prop="mobile">
                            <el-input v-model="formData.mobile" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item :label="$t('permission.status')" prop="status">
                            <el-switch
                                v-model="formData.status"
                                :active-text="$t('common.enable')"
                                :inactive-text="$t('common.disable')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('permission.role')" prop="roleIds">
                            <el-select
                                v-model="formData.roleIds"
                                multiple
                                :placeholder="$t('common.selectPlaceholder')"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item in allRoles"
                                    :key="item.id"
                                    :label="item.remark"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :loading="editLoading" round type="primary" @click="submitForm">
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
import tableColumnFilterDialog from '@/components/core/table_column_filter_dialog.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import changeImageIcon from '@/components/change_image_icon.vue';
import extButton from '@/components/core/ext_button.vue';
import { loadDynamicMenuAndRoutes } from '@/utils/menu_route_loader.js';
export default {
    components: {
        extTable,
        tableColumnFilterDialog,
        breadCrumb,
        changeImageIcon,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            filters: {
                key: 'username',
                value: '',
            },
            filterColumns: [],
            paginated: {
                attrs: {
                    searchKey: {},
                    currPage: 1,
                    offset: 0,
                    limit: 9,
                    count: 0,
                },
                list: [],
            },
            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'permission:sys_user:edit', // 权限标识
                    type: 'primary', // 按钮类型
                    func: (row) => {
                        this.editDialogVisible = true;
                        this.isCreating = false;
                        this.formData = Object.assign(this.formData, row);
                    },
                },
                {
                    label: 'action.delete',
                    icon: 'el-icon-ali-shanchu',
                    perms: 'permission:sys_user:delete',
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
            permsBatchDelete: 'permission:sys_user:delete',
            disableIds: [],

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                username: '',
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                },
                pwd: '',
                email: '',
                mobile: '',
                status: 1,
                roles: [],
                roleIds: [],
            },
            allRoles: [],
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
        // 响应式的搜索字段配置
        searchFields() {
            return [
                {
                    prop: 'username',
                    label: this.$t('action.username'),
                },
                {
                    prop: 'email',
                    label: this.$t('action.email'),
                },
                {
                    prop: 'mobile',
                    label: this.$t('action.mobile'),
                },
            ];
        },
        // 响应式的表单验证规则
        formDataRules() {
            return {
                username: [
                    {
                        required: true,
                        message: this.$t('permission.inputUsername'),
                        trigger: 'blur',
                    },
                ],
            };
        },
        // 响应式的列配置
        columns() {
            return [
                {
                    prop: 'id',
                    label: 'ID',
                    minWidth: 60,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'username',
                    label: this.$t('action.username'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'attachment.path',
                    label: this.$t('action.avatar'),
                    minWidth: 80,
                    propType: 'image',
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'roleNames',
                    label: this.$t('action.role'),
                    minWidth: 210,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'email',
                    label: this.$t('action.email'),
                    minWidth: 120,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'mobile',
                    label: this.$t('action.mobile'),
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'state',
                    label: this.$t('action.status'),
                    minWidth: 70,
                    formatter: (state) => {
                        return state
                            ? this.$t('permission.enabled')
                            : this.$t('permission.disabled');
                    },
                    align: 'center',
                    showOverflowTooltip: true,
                },
            ];
        },
    },
    mounted() {
        this.disableIds.push(this.loginUser.id);
        this.getAllRoles();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        chosedIcon(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
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
            const _result = await this.$api.sysUser.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                for (const _sysUser of _result.data.list) {
                    if (Array.isArray(_sysUser.roles)) {
                        _sysUser.roleNames = _sysUser.roles
                            ? _sysUser.roles.map((v) => v.remark).toString()
                            : '';
                        _sysUser.roleIds = _sysUser.roles ? _sysUser.roles.map((v) => v.id) : [];
                    }
                }
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) {
                data.cb();
            }
        },
        // 加载用户角色信息
        async getAllRoles() {
            const _result = await this.$api.role.list();
            if (_result.succeed === 1 && _result.code === 200) {
                // 加载角色集合
                this.allRoles = _result.data.list;
            }
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.sysUser.destroy({ ids });
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
                username: '',
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                },
                pwd: '',
                email: '',
                mobile: '',
                status: 1,
                roles: [],
                roleIds: [],
            };
        },
        // 提交编辑结果
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
                        if (Array.isArray(data.roleIds) && data.roleIds.length > 0) {
                            data.roles = this.allRoles.filter((v) => {
                                return data.roleIds.includes(v.id);
                            });
                        }
                        const _result = await this.$api.sysUser.save(data);
                        this.editLoading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _sysUser = _result.data;

                            if (Array.isArray(_sysUser.roles)) {
                                _sysUser.roleNames = _sysUser.roles
                                    ? _sysUser.roles.map((v) => v.remark).toString()
                                    : '';
                                _sysUser.roleIds = _sysUser.roles
                                    ? _sysUser.roles.map((v) => v.id)
                                    : [];
                            }
                            const _user = this.paginated.list.find((v) => v.id === _sysUser.id);
                            if (!_user) {
                                this.paginated.list.unshift(_sysUser);
                            } else {
                                Object.assign(_user, _sysUser);
                            }
                            if (this.loginUser.id === _sysUser.id) {
                                // 要求重新加载导航菜单
                                await loadDynamicMenuAndRoutes(this.loginUser.id);
                            }
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                            this.editDialogVisible = false;
                            this.$refs.formData.resetFields();
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }
                    });
                }
            });
        },

        // 处理表格列过滤显示
        displayFilterColumnsDialog() {
            this.$refs.tableColumnFilterDialog.setDialogVisible(true);
        },
        // 处理表格列过滤显示
        handleFilterColumns(data) {
            this.filterColumns = data.filterColumns;
            this.$refs.tableColumnFilterDialog.setDialogVisible(false);
        },
    },
};
</script>

<style scoped lang="scss"></style>
