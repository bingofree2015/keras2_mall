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
                            <ext-button
                                :label="$t('action.search')"
                                perms="permission:role:view"
                                type="primary"
                                @click="handleRefresh"
                            >
                                <i class="el-icon-ali-chazhaobiaodanliebiao"></i>
                            </ext-button>
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
            :disable-ids="disableIds"
            :highlight-current-row="true"
            :operations="operations"
            :operation-width="operationWidth"
            :page-size="paginated.attrs.limit"
            :perms-batch-delete="permsBatchDelete"
            :stripe="false"
            @handle-current-row-change="handleRoleSelectChange"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--角色菜单，表格树内容栏-->
        <el-container class="role-menu-container">
            <el-header class="role-menu-header">
                <span>角色授权</span>
                <div class="role-menu-header-right">
                    <el-checkbox
                        v-model="checkAll"
                        :disabled="selectRole.id === null || disableIds.includes(selectRole.id)"
                        @change="handleCheckAll"
                    >
                        <b>全选</b>
                    </el-checkbox>
                    <ext-button
                        :disabled="selectRole.id === null || disableIds.includes(selectRole.id)"
                        :label="$t('action.reset')"
                        perms="permission:role:edit"
                        type="primary"
                        @click="resetSelection"
                    />
                    <ext-button
                        :disabled="selectRole.id === null || disableIds.includes(selectRole.id)"
                        :label="$t('action.submit')"
                        :loading="authLoading"
                        perms="permission:role:edit"
                        type="primary"
                        @click="submitAuthForm"
                    />
                </div>
            </el-header>
            <el-main style="padding: 0px">
                <el-tree
                    ref="menuTree"
                    v-loading="menuLoading"
                    :data="menuData"
                    :props="defaultProps"
                    :show-checkbox="!disableIds.includes(selectRole.id)"
                    element-loading-text="拼命加载中"
                    node-key="id"
                >
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <i
                                style="margin: 0px 8px"
                                :class="data && data.icon ? data.icon : ''"
                            ></i>
                            {{ node && node.label ? node.label : '' }}
                        </span>
                    </template>
                </el-tree>
            </el-main>
        </el-container>

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
                <el-form-item :label="$t('permission.roleName')" prop="name">
                    <el-input v-model="formData.name" auto-complete="off" />
                </el-form-item>
                <el-form-item :label="$t('permission.remark')" prop="remark">
                    <el-input v-model="formData.remark" auto-complete="off" type="textarea" />
                </el-form-item>
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
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
import { loadDynamicMenuAndRoutes } from '@/utils/menu_route_loader.js';
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
            props: [
                { prop: 'name', label: '角色名' },
                { prop: 'remark', label: '备注' },
                { prop: 'createBy', label: '创建人' },
            ],
            columns: [
                { prop: 'id', label: 'ID', minWidth: 60 },
                { prop: 'name', label: '角色名', minWidth: 80 },
                { prop: 'remark', label: '备注', minWidth: 200 },
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
                    perms: 'permission:role:edit', // 权限标识
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
                    perms: 'permission:role:delete',
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
            permsBatchDelete: 'permission:role:delete',
            disableIds: [1],
            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                name: '',
                remark: '',
            },
            formDataRules: {
                name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
            },
            selectRole: {},
            menuData: [],
            menuSelections: [],
            menuLoading: false,
            authLoading: false,
            checkAll: false,
            currentRoleMenus: [],
            defaultProps: {
                children: 'children',
                label: 'name',
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
    mounted() {
        this.getMenuTree();
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
            const _result = await this.$api.role.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.role.destroy({ ids });
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
                        const _result = await this.$api.role.save(data);

                        this.editLoading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.editDialogVisible = false;
                            this.$refs.formData.resetFields();
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: _result.description,
                            });
                        }
                        await this.queryForPaginatedList();
                    });
                }
            });
        },
        // 获取菜单数据
        async getMenuTree() {
            this.menuLoading = true;
            const _result = await this.$api.menu.getMenuTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.menuData = _result.data.list;
                this.menuLoading = false;
            }
        },
        // 角色选择改变监听
        async handleRoleSelectChange(row) {
            if (row) {
                // 返回树结构数据中的所有叶子节点数组
                const _getLeafNode = (treeData, leafData) => {
                    for (const item of treeData) {
                        const _subTreeData = treeData.filter((v) => v.parentId === item.id);
                        if (_subTreeData.length === 0) {
                            leafData.push(item);
                        } else {
                            _getLeafNode(_subTreeData, leafData);
                        }
                    }
                    return leafData;
                };

                this.selectRole = row;
                const _result = await this.$api.role.getMenusByRoleId({ roleId: row.id });
                if (_result.succeed === 1 && _result.code === 200) {
                    let _leafNodes = [];
                    _leafNodes = _getLeafNode(_result.data.list, _leafNodes);
                    this.currentRoleMenus = _leafNodes;
                    this.$refs.menuTree.setCheckedNodes(_leafNodes);
                }
            }
        },
        // 重置选择
        resetSelection() {
            this.checkAll = false;
            this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
        },
        // 全选操作
        handleCheckAll() {
            if (this.checkAll) {
                const allMenus = [];
                this.checkAllMenu(this.menuData, allMenus);
                this.$refs.menuTree.setCheckedNodes(allMenus);
            } else {
                this.$refs.menuTree.setCheckedNodes([]);
            }
        },
        // 递归全选
        checkAllMenu(menuData, allMenus) {
            menuData.forEach((menu) => {
                allMenus.push(menu);
                if (menu.children) {
                    this.checkAllMenu(menu.children, allMenus);
                }
            });
        },
        // 角色菜单授权提交 ( 更新 菜单 与 权限 )
        submitAuthForm() {
            const roleId = this.selectRole.id;
            this.authLoading = true;
            const checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
            const roleMenus = [];
            for (let i = 0, len = checkedNodes.length; i < len; i++) {
                const roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
                roleMenus.push(roleMenu);
            }
            this.$api.role.saveRoleMenus({ roleId, roleMenus }).then(async (result) => {
                if (result.succeed === 1 && result.code === 200) {
                    if (this.loginUser.roles.find((v) => v.id === roleId)) {
                        // 要求重新加载导航菜单
                        await loadDynamicMenuAndRoutes(this.loginUser.id);
                    }
                    this.$notify({
                        title: '成功',
                        message: result.description,
                        type: 'success',
                    });
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: result.description,
                    });
                }
                this.authLoading = false;
            });
        },
        renderContent(h, { node, data, store }) {
            return h('el-row', { style: 'width:98%' }, [
                h('el-col', { props: { span: 4 } }, [
                    h(
                        'el-tag',
                        {},
                        '标签内容' // 这里替换为实际内容
                    ),
                ]),
            ]);
        },
    },
};
</script>
<style lang="scss" scoped>
.page-container :deep(.role-menu-container) {
    margin-left: 10px;
    width: 60%;
    .role-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .role-menu-header-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
        }
    }
}

.role-menu-container :deep(.el-header) {
    text-align: right;
    border-bottom: 2px solid #dcdfe6;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 13px;
    padding-right: 8px;
}
</style>
