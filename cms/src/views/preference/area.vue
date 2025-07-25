<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :size="miniSize">
                    <el-form-item>
                        <ext-button
                            :label="$t('action.add')"
                            icon="el-icon-ali-add"
                            perms="preference:area:add"
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

        <!--表格树内容栏-->
        <el-table
            v-loading="loading"
            :data="areaTreeData"
            element-loading-text="$t('action.loading')"
            :size="miniSize"
            stripe
            style="width: 100%"
        >
            <el-table-column label="ID" min-width="80" prop="id" />
            <table-tree-column
                label="名称"
                min-width="310"
                prop="name"
                tree-key="id"
                @send-tree-data="getTreeData"
            />
            <el-table-column label="层级" min-width="80" prop="depth" />
            <el-table-column label="上级名称" min-width="120" prop="parentName" />
            <el-table-column label="排序" min-width="80" prop="sort" />
            <el-table-column :label="$t('action.operation')" fixed="right" min-width="200">
                <template #default="scope">
                    <ext-button
                        :label="$t('action.edit')"
                        icon="el-icon-ali-bianji"
                        perms="preference:area:edit"
                        @click="handleEdit(scope.row)"
                    />
                    <ext-button
                        :label="$t('action.delete')"
                        icon="el-icon-ali-shanchu"
                        perms="preference:area:delete"
                        type="danger"
                        @click="handleDelete(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增修改界面 -->
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
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="区域名称" prop="name">
                            <el-input v-model="formData.name" placeholder="区域名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级名称" prop="parentName">
                            <popup-tree-input
                                :current-change-handle="handleTreeSelectChange"
                                :data="popupTreeData"
                                :node-key="'' + formData.parentId"
                                :prop="
                                    formData.parentName === null || formData.parentName === ''
                                        ? '顶级区域'
                                        : formData.parentName
                                "
                                :props="popupTreeProps"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="排序" prop="sort" style="width: 80px">
                    <el-input-number
                        v-model="formData.sort"
                        :min="0"
                        controls-position="right"
                        label="排序"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :size="miniSize" round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button :size="miniSize" round type="primary" @click="submitForm()">
                        $t('action.submit')
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import tableTreeColumn from '@/components/core/table_tree_column.vue';
import popupTreeInput from '@/components/popup_tree_input.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        popupTreeInput,
        tableTreeColumn,
        breadCrumb,
        extButton,
    },
    data() {
        return {
            largeSize: 'large',
            miniSize: 'default',
            loading: false,
            areaTreeData: [],
            dialogVisible: false,
            formData: {
                id: 0,
                name: '', // 地区名称
                depth: 1, // 地区深度
                parentId: 0, // 父级ID
                parentName: '', // 父级名称
                postalCode: '', // 邮编
                sort: 0,
            },
            dataRule: {
                name: [{ required: true, message: '区域名称不能为空', trigger: 'blur' }],
            },
            popupTreeProps: {
                label: 'name',
                children: 'children',
            },
        };
    },
    computed: {
        popupTreeData() {
            const parent = {
                parentId: 0,
                name: '顶级区域',
                children: this.areaTreeData,
            };
            return [parent];
        },
    },
    watch: {
        areaTreeData: {
            // 深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                console.log(
                    `areaTreeData变化: ${oldVal ? oldVal.length : 0} -> ${val ? val.length : 0}`
                ); // 但是这两个值打印出来却都是一样的
            },
            deep: true,
        },
    },
    mounted() {
        this.getAreaData();
    },
    methods: {
        getTreeData(data) {
            if (data) {
                this.areaTreeData = data;
            } else {
                console.log('data 这空值');
            }
        },
        // 获取数据
        async getAreaData() {
            this.loading = true;
            const _result = await this.$api.area.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.areaTreeData = _result.data.list;
                this.loading = false;
            }
        },
        // 显示新增界面
        handleAdd() {
            this.dialogVisible = true;
            this.formData = {
                name: '', // 地区名称
                depth: 1, // 地区深度
                parentId: 0, // 父级ID
                parentName: '', // 父级名称
                postalCode: '', // 邮编
                sort: 0,
            };
        },
        // 显示编辑界面
        handleEdit(row) {
            this.dialogVisible = true;
            Object.assign(this.formData, row);
        },
        // 删除
        handleDelete(row) {
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning',
            }).then(async () => {
                const params = this.getDeleteIds([], row);
                const _result = await this.$api.area.destroy({ ids: params });
                if (_result.succeed === 1 && _result.code === 200) {
                    this.areaTreeData = removeTreeItemsByIds(this.areaTreeData, params);
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                    });
                }
            });
        },
        // 获取删除的包含子菜单的id列表
        getDeleteIds(ids, row) {
            ids.push(row.id);
            if (row.children !== null) {
                for (let i = 0, len = row.children.length; i < len; i++) {
                    this.getDeleteIds(ids, row.children[i]);
                }
            }
            return ids;
        },
        // 菜单树选中
        handleTreeSelectChange(data, node) {
            this.formData.parentId = data.id;
            this.formData.parentName = data.name;
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const params = Object.assign({}, this.formData);
                        const _result = await this.$api.area.save(params);

                        this.editLoading = false;
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _parentId = _result.data.parentId;
                            const _parentTreeItem = getTreeItemById(this.areaTreeData, _parentId);

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
                                        this.areaTreeData = this.areaTreeData
                                            .splice(
                                                0,
                                                this.areaTreeData.findIndex(
                                                    (v) => v.id === _preTreeItem.id
                                                ) + 1
                                            )
                                            .concat(_result.data)
                                            .concat(this.areaTreeData);
                                    } else {
                                        const _filterItem = this.areaTreeData.filter(
                                            (v) => v.id === _result.data.id
                                        );
                                        Object.assign(_filterItem[0], _result.data);
                                    }
                                }
                            } else {
                                const _treeItem = this.areaTreeData.filter(
                                    (v) => v.id === _result.data.id
                                );
                                if (_treeItem.length === 0) {
                                    _result.data.level = 1;
                                    this.areaTreeData.push(_result.data);
                                } else {
                                    Object.assign(_treeItem[0], _result.data);
                                }
                            }

                            console.log('保存后的areaTreeData: ', this.areaTreeData);
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
</script>

<style scoped lang="scss"></style>
