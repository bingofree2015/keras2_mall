<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :size="largeSize">
                    <el-form-item>
                        <ext-button
                            :label="$t('action.add')"
                            icon="el-icon-ali-add"
                            perms="sys:menu:add"
                            type="primary"
                            @click="handleAdd"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-tooltip content="新增" placement="top">
                                <el-button round @click="handleAdd">
                                    <i class="el-icon-ali-add"></i>
                                </el-button>
                            </el-tooltip>
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

        <!-- 表格树内容栏 -->
        <el-table
            v-loading="loading"
            :data="menuTreeData"
            :size="largeSize"
            element-loading-text="$t('action.loading')"
            stripe
            style="width: 100%"
        >
            <el-table-column label="ID" min-width="60" prop="id" />
            <table-tree-column
                label="名称"
                min-width="180"
                prop="name"
                tree-key="id"
                @send-tree-data="getTreeData"
            />
            <el-table-column align="center" label="图标" min-width="60">
                <template #default="scope">
                    <i :class="scope.row.icon || ''"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width="60" prop="type">
                <template #default="scope">
                    <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                    <el-tag v-else-if="scope.row.type === 1" size="small" type="success">
                        菜单
                    </el-tag>
                    <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上级菜单" min-width="120" prop="parentName" />
            <el-table-column
                :show-overflow-tooltip="true"
                label="菜单URL"
                min-width="150"
                prop="url"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                label="授权标识"
                min-width="180"
                prop="perms"
            />
            <el-table-column align="center" label="排序" prop="orderNum" />
            <el-table-column :label="$t('action.operation')" fixed="right" min-width="200">
                <template #default="scope">
                    <ext-button
                        :label="$t('action.edit')"
                        icon="el-icon-ali-bianji"
                        perms="sys:menu:edit"
                        @click="handleEdit(scope.row)"
                    />
                    <ext-button
                        :label="$t('action.delete')"
                        icon="el-icon-ali-shanchu"
                        perms="sys:menu:delete"
                        type="danger"
                        @click="handleDelete(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="!formData.id ? '新增' : '修改'"
            :model-value="dialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="dataRule"
                :size="largeSize"
                label-width="80px"
                @keyup.enter="submitForm()"
            >
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio v-for="(type, index) in menuTypeList" :key="index" :label="index">
                            {{ type }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="menuTypeList[formData.type] + '名称'" prop="name">
                    <el-input
                        v-model="formData.name"
                        :placeholder="menuTypeList[formData.type] + '名称'"
                    />
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentName">
                    <popup-tree-input
                        :current-change-handle="handleTreeSelectChange"
                        :data="popupTreeData"
                        :node-key="'' + formData.parentId"
                        :prop="
                            formData.parentName === null || formData.parentName === ''
                                ? '顶级菜单'
                                : formData.parentName
                        "
                        :props="popupTreeProps"
                    />
                </el-form-item>
                <el-form-item v-if="formData.type !== 0" label="授权标识" prop="perms">
                    <el-input
                        v-model="formData.perms"
                        placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"
                    />
                </el-form-item>
                <el-form-item v-if="formData.type === 1" label="菜单路由" prop="url">
                    <el-row>
                        <el-col :span="14" class="top-bar">
                            <el-input v-model="formData.url" placeholder="菜单路由" />
                        </el-col>
                        <el-col :span="2" class="icon-list__tips">
                            <el-tooltip effect="light" placement="top" style="padding: 10px">
                                <template #content>
                                    <div>
                                        <p>URL格式：</p>
                                        <p>
                                            1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为
                                            /system/User, 此处填写 /system/user。
                                        </p>
                                        <p>
                                            2.嵌套外部网页，如通过菜单打开百度网页，此处填写
                                            http://www.baidu.com，http:// 不可省略。
                                        </p>
                                        <p>
                                            示例：用户管理：/system/user
                                            嵌套百度：http://www.baidu.com
                                            嵌套网页：http://127.0.0.1:8000
                                        </p>
                                    </div>
                                </template>
                                <i class="el-icon-warning"></i>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="8">
                            <el-switch
                                v-model="formData.isShow"
                                active-text="显示"
                                inactive-text="隐藏"
                            />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="formData.type !== 2" label="排序编号" prop="orderNum">
                    <el-input-number
                        v-model="formData.orderNum"
                        :min="0"
                        controls-position="right"
                        label="排序编号"
                    />
                </el-form-item>
                <el-form-item v-if="formData.type !== 2" label="菜单图标" prop="icon">
                    <el-row>
                        <el-col :span="22">
                            <el-input
                                v-model="formData.icon"
                                v-popover:iconListPopover
                                :readonly="false"
                                class="icon-list__input"
                                placeholder="菜单图标名称（如：el-icon-ali-shouye）"
                            />
                        </el-col>
                        <el-col :span="2" class="icon-list__tips">
                            <falcon-tooltip />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="largeSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :size="largeSize" round type="primary" @click="submitForm()">
                        {{ $t('action.submit') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import tableTreeColumn from '@/components/core/table_tree_column.vue';
import popupTreeInput from '@/components/popup_tree_input.vue';
import falconTooltip from '@/components/falcon_tooltip.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
import { loadDynamicMenuAndRoutes } from '@/utils/menu_route_loader.js';

export default {
    components: {
        popupTreeInput,
        tableTreeColumn,
        falconTooltip,
        breadCrumb,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            largeSize: 'large',
            loading: false,
            menuTreeData: [],
            dialogVisible: false,
            menuTypeList: ['目录', '菜单', '按钮'],
            formData: {
                id: 0,
                type: 1,
                name: '',
                parentId: 0,
                parentName: '',
                url: '',
                perms: '',
                orderNum: 0,
                icon: '',
                isShow: true,
            },
            dataRule: {
                name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
            },
            popupTreeProps: {
                label: 'name',
                children: 'children',
            },
        };
    },
    computed: {
        ...mapState({
            loginUser: (state) => state.loginUser,
            navTree: (state) => state.menu.navTree,
        }),
        popupTreeData() {
            const _data = removeTreeItemsByType(this.menuTreeData, 2).filter(
                (x) => x.parentId === 0
            );
            const parent = {
                id: 0,
                name: '顶级菜单',
                children: _data,
            };
            return [parent];
        },
    },
    watch: {
        menuTreeData: {
            handler(val, oldVal) {
                console.log(
                    `menuTreeData变化: ${oldVal ? oldVal.length : 0} -> ${val ? val.length : 0}`
                );
            },
            deep: true,
        },
    },
    mounted() {
        this.findTreeData();
    },
    methods: {
        getTreeData(data) {
            if (data) {
                this.menuTreeData = data;
            } else {
                console.log('data 这空值');
            }
        },
        async findTreeData() {
            this.loading = true;
            const _result = await this.$api.menu.getMenuTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.menuTreeData = _result.data.list;
                this.loading = false;
            }
        },
        handleAdd() {
            this.dialogVisible = true;
            this.formData = {
                id: 0,
                type: 1,
                typeList: ['目录', '菜单', '按钮'],
                name: '',
                parentId: 0,
                parentName: '',
                url: '',
                perms: '',
                orderNum: 0,
                icon: '',
                isShow: true,
            };
        },
        handleEdit(row) {
            this.dialogVisible = true;
            Object.assign(this.formData, row);
        },
        handleDelete(row) {
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning',
            }).then(async () => {
                const params = this.getDeleteIds([], row);
                const _result = await this.$api.menu.destroy({ ids: params });
                if (_result.succeed === 1 && _result.code === 200) {
                    this.menuTreeData = removeTreeItemsByIds(this.menuTreeData, params);
                    await loadDynamicMenuAndRoutes(this.loginUser.id);
                    this.reload();
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                    });
                }
            });
        },
        getDeleteIds(ids, row) {
            ids.push(row.id);
            if (row.children !== null) {
                for (let i = 0, len = row.children.length; i < len; i++) {
                    this.getDeleteIds(ids, row.children[i]);
                }
            }
            return ids;
        },
        handleTreeSelectChange(data, node) {
            this.formData.parentId = data.id;
            this.formData.parentName = data.name;
        },
        iconActiveHandle(iconName) {
            this.formData.icon = iconName;
        },
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const params = Object.assign({}, this.formData);
                        const _result = await this.$api.menu.save(params);

                        this.editLoading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _parentId = _result.data.parentId;
                            const _parentTreeItem = getTreeItemById(this.menuTreeData, _parentId);

                            if (_parentTreeItem && Array.isArray(_parentTreeItem.children)) {
                                const _treeItem = _parentTreeItem.children.filter(
                                    (v) => v.id === _result.data.id
                                );
                                if (_treeItem.length === 0) {
                                    _result.data.level =
                                        _parentId === 0 ? 1 : _parentTreeItem.level + 1;
                                    _parentTreeItem.children.push(_result.data);
                                } else {
                                    Object.assign(_treeItem[0], _result.data);
                                }

                                if (_parentTreeItem._expanded) {
                                    if (_treeItem.length === 0) {
                                        const _preTreeItem =
                                            _parentTreeItem.children.length > 1
                                                ? _parentTreeItem.children[
                                                    _parentTreeItem.children.length - 2
                                                  ]
                                                : _parentTreeItem;
                                        this.menuTreeData = this.menuTreeData
                                            .splice(
                                                0,
                                                this.menuTreeData.findIndex(
                                                    (v) => v.id === _preTreeItem.id
                                                ) + 1
                                            )
                                            .concat(_result.data)
                                            .concat(this.menuTreeData);
                                    } else {
                                        const _filterItem = this.menuTreeData.filter(
                                            (v) => v.id === _result.data.id
                                        );
                                        Object.assign(_filterItem[0], _result.data);
                                    }
                                }
                            } else {
                                const _treeItem = this.menuTreeData.filter(
                                    (v) => v.id === _result.data.id
                                );
                                if (_treeItem.length === 0) {
                                    _result.data.level = 1;
                                    this.menuTreeData.push(_result.data);
                                } else {
                                    Object.assign(_treeItem[0], _result.data);
                                }
                            }
                            await loadDynamicMenuAndRoutes(this.loginUser.id);
                            this.$notify({
                                title: '成功',
                                message: _result.description,
                                type: 'success',
                            });
                            this.$refs.formData.resetFields();
                            this.dialogVisible = false;
                        } else {
                            this.$notify({
                                title: '失败',
                                message: _result.description,
                                type: 'error',
                            });
                        }
                    });
                }
            });
        },
    },
};

function getTreeItemById(treeDatas, id) {
    let childTreeItem, treeItem, i;
    for (i = treeDatas.length; i; ) {
        treeItem = treeDatas[--i];
        if (id === treeItem.id) return treeItem;
        if (treeItem.children) {
            childTreeItem = getTreeItemById(treeItem.children, id);
            if (childTreeItem) return childTreeItem;
        }
    }
}

function removeTreeItemsByIds(treeDatas, ids) {
    const _treeItemDatas = treeDatas.filter((x) => !ids.includes(x.id));
    _treeItemDatas.forEach(
        (x) => x.children && (x.children = removeTreeItemsByIds(x.children, ids))
    );
    return _treeItemDatas;
}

function removeTreeItemsByType(treeDatas, type = 2) {
    const _treeItemDatas = _.cloneDeep(treeDatas.filter((x) => x.type < type));
    _treeItemDatas.forEach(
        (x) => x.children && (x.children = removeTreeItemsByType(x.children, type))
    );
    return _treeItemDatas;
}
</script>

<style scoped lang="scss">
.top-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.top-bar {
    display: flex;
    justify-content: flex-end;
}
</style>
