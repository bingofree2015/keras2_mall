<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow">
                <el-form :inline="true" class="search-form">
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

        <!--表格树内容栏-->
        <el-table
            v-loading="loading"
            :data="goodsCatTreeData"
            element-loading-text="$t('action.loading')"
            stripe
            style="width: 100%"
        >
            <el-table-column align="center" label="ID" min-width="60" prop="id" />
            <table-tree-column
                label="名称"
                min-width="280"
                prop="name"
                tree-key="id"
                @send-tree-data="getTreeData"
            />
            <el-table-column align="center" :label="$t('goods.icon')" min-width="80">
                <template #default="scope">
                    <el-avatar
                        v-if="scope.row.attachment && scope.row.attachment.path"
                        :size="30"
                        :src="env.getImgUrl(scope.row.attachment.path)"
                    />
                </template>
            </el-table-column>
            <el-table-column :label="$t('goods.categoryType')" min-width="90" prop="type.name" />
            <el-table-column :label="$t('goods.parentCategory')" min-width="160" prop="parentName" />
            <el-table-column align="center" :label="$t('system.sort')" min-width="60" prop="sort" />
            <el-table-column :label="$t('action.operation')" fixed="right" min-width="200">
                <template #default="scope">
                    <ext-button
                        :label="$t('action.edit')"
                        icon="el-icon-ali-bianji"
                        perms="goods:goods_cat:edit"
                        @click="handleEdit(scope.row)"
                    />
                    <ext-button
                        :label="$t('action.delete')"
                        icon="el-icon-ali-shanchu"
                        perms="goods:goods_cat:delete"
                        type="danger"
                        @click="handleDelete(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增修改界面 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="!formData.id ? $t('action.add') : $t('action.edit')"
            :model-value="dialogVisible"
            width="40%"
        >
            <el-form
                ref="formData"
                :model="formData"
                :rules="dataRule"
                label-width="80px"
                @keyup.enter="submitForm()"
            >
                <el-row>
                    <el-col :span="16">
                        <el-form-item :label="$t('goods.type')" prop="type">
                            <el-select
                                v-model="formData.typeId"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="item in goodsTypeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('goods.parentCat')" prop="parentName">
                            <popup-tree-input
                                :current-change-handle="handleTreeSelectChange"
                                :data="popupTreeData"
                                :node-key="'' + formData.parentId"
                                :prop="
                                    formData.parentName === null || formData.parentName === ''
                                        ? $t('goods.topCat')
                                        : formData.parentName
                                "
                                :props="popupTreeProps"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('goods.catIcon')" prop="attachment">
                            <change-image-icon
                                :img-url="formData.attachment ? formData.attachment.path : ''"
                                @chosed-image-icon="chosedLogo"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item :label="$t('goods.catName')" prop="name">
                            <el-input v-model="formData.name" :placeholder="$t('goods.catName')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('goods.catSort')" prop="sort">
                            <el-input-number
                                v-model="formData.sort"
                                :min="0"
                                controls-position="right"
                                :label="$t('goods.catSort')"
                                style="width: 100px"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button round @click="dialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button round type="primary" @click="submitForm()">
                        {{ $t('action.submit') }}
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
import changeImageIcon from '@/components/change_image_icon.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        popupTreeInput,
        tableTreeColumn,
        breadCrumb,
        changeImageIcon,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            loading: false,
            goodsCatTreeData: [],
            dialogVisible: false,
            goodsTypeList: [],
            formData: {
                id: 0,
                name: '',
                parentId: 0,
                parentName: '',
                sort: 0,
                typeId: '',
                type: {
                    id: 0,
                    name: '',
                },
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                },
            },
            dataRule: {
                name: [{ required: true, message: this.$t('goods.inputCatName'), trigger: 'blur' }],
            },
            popupTreeProps: {
                label: 'name',
                children: 'children',
            },
        };
    },
    computed: {
        popupTreeData() {
            const _data = this.goodsCatTreeData.filter((x) => x.parentId === 0);
            const parent = {
                parentId: 0,
                name: '顶级分类',
                children: _data,
            };
            return [parent];
        },
    },
    watch: {
        goodsCatTreeData: {
            // 深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                console.log(
                    `goodsCatTreeData变化: ${oldVal ? oldVal.length : 0} -> ${val ? val.length : 0}`
                ); // 但是这两个值打印出来却都是一样的
            },
            deep: true,
        },
    },
    mounted() {
        this.getGoodsTypeList();
        this.getGoodsCatTree();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        chosedLogo(chosen) {
            this.formData.attachmentId = chosen.id;
            this.formData.attachment = chosen;
        },
        async getGoodsTypeList() {
            this.loading = true;
            const _result = await this.$api.goodsType.list();
            if (_result.succeed === 1 && _result.code === 200) {
                this.goodsTypeList = _result.data.list;
                // this.goodsTypeList.unshift({ id: 0, name: '通用类型' })
                this.loading = false;
            }
        },
        getTreeData(data) {
            if (data) {
                this.goodsCatTreeData = data;
            } else {
                console.log('data 这空值');
            }
        },
        // 获取数据
        async getGoodsCatTree() {
            this.loading = true;
            const _result = await this.$api.goodsCat.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.goodsCatTreeData = _result.data.list;
                this.loading = false;
            }
        },
        // 显示新增界面
        handleAdd() {
            this.dialogVisible = true;
            this.formData = {
                id: 0,
                name: '',
                parentId: 0,
                parentName: '',
                sort: 0,
                typeId: '',
                type: {
                    id: 0,
                    name: '',
                },
                attachmentId: 0,
                attachment: {
                    id: 0,
                    path: '',
                },
            };
        },
        // 显示编辑界面
        handleEdit(row) {
            this.dialogVisible = true;
            Object.assign(this.formData, row);
        },
        // 删除
        handleDelete(row) {
            this.$confirm(this.$t('common.confirmDelete'), this.$t('common.tip'), {
                type: 'warning',
            }).then(async () => {
                const params = this.getDeleteIds([], row);
                const _result = await this.$api.goodsCat.destroy({ ids: params });
                if (_result.succeed === 1 && _result.code === 200) {
                    this.goodsCatTreeData = removeTreeItemsByIds(this.goodsCatTreeData, params);
                    this.$notify({
                        title: this.$t('common.success'),
                        message: this.$t('common.deleteSuccess'),
                        type: 'success',
                    });
                }
            });
        },
        // 获取删除的包含子分类的id列表
        getDeleteIds(ids, row) {
            ids.push(row.id);
            if (row.children !== null) {
                for (let i = 0, len = row.children.length; i < len; i++) {
                    this.getDeleteIds(ids, row.children[i]);
                }
            }
            return ids;
        },
        // 分类树选中
        handleTreeSelectChange(data, node) {
            this.formData.parentId = data.id;
            this.formData.parentName = data.name;
        },
        // 图标选中
        iconActiveHandle(iconName) {
            this.formData.icon = iconName;
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const params = Object.assign({}, this.formData);
                            const _result = await this.$api.goodsCat.save(params);

                            this.editLoading = false;
                            if (_result.succeed === 1 && _result.code === 200) {
                                const _parentId = _result.data.parentId;
                                const _parentTreeItem = getTreeItemById(
                                    this.goodsCatTreeData,
                                    _parentId
                                );

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
                                            this.goodsCatTreeData = this.goodsCatTreeData
                                                .splice(
                                                    0,
                                                    this.goodsCatTreeData.findIndex(
                                                        (v) => v.id === _preTreeItem.id
                                                    ) + 1
                                                )
                                                .concat(_result.data)
                                                .concat(this.goodsCatTreeData);
                                        } else {
                                            const _filterItem = this.goodsCatTreeData.filter(
                                                (v) => v.id === _result.data.id
                                            );
                                            Object.assign(_filterItem[0], _result.data);
                                        }
                                    }
                                } else {
                                    const _treeItem = this.goodsCatTreeData.filter(
                                        (v) => v.id === _result.data.id
                                    );
                                    if (_treeItem.length === 0) {
                                        _result.data.level = 1;
                                        this.goodsCatTreeData.push(_result.data);
                                    } else {
                                        Object.assign(_treeItem[0], _result.data);
                                    }
                                }

                                console.log('保存后的goodsCatTreeData: ', this.goodsCatTreeData);
                                this.$notify({
                                    title: this.$t('common.success'),
                                    message: _result.description,
                                    type: 'success',
                                });
                                this.$refs.formData.resetFields();
                                this.dialogVisible = false;
                            } else {
                                this.$notify({
                                    title: this.$t('common.fail'),
                                    message: _result.description,
                                    type: 'error',
                                });
                            }
                        }
                    );
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
