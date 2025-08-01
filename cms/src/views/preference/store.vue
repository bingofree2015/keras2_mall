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
                                    perms="preference:store:view"
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
            <el-form
                ref="formData"
                :model="formData"
                :rules="formDataRules"
                :size="largeSize"
                label-width="80px"
            >
                <el-row>
                    <el-col :span="16">
                        <el-form-item :label="$t('store.name')" prop="storeName">
                            <el-input v-model="formData.storeName" />
                        </el-form-item>
                        <el-form-item :label="$t('store.mobile')" prop="mobile">
                            <el-input v-model="formData.mobile" maxlength="11" show-word-limit />
                        </el-form-item>
                        <el-form-item :label="$t('store.linkman')" prop="linkman">
                            <el-input v-model="formData.linkman" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Logo" prop="attachment">
                            <change-image-icon
                                :img-url="formData.attachment ? formData.attachment.path : ''"
                                @chosed-image-icon="chosedLogo"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item :label="$t('store.area')" prop="areaId">
                            <el-cascader
                                v-model="formData.areaId"
                                :options="areaList"
                                :props="cascaderProps"
                                :show-all-levels="false"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14" class="top-bar">
                        <el-form-item :label="$t('store.coordinate')" prop="coordinate">
                            <el-input v-model="formData.coordinate" readonly>
                                <template #append>
                                    <el-button icon="el-icon-ali-dakai" @click="changePosition" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="$t('store.address')" prop="address">
                    <el-input v-model="formData.address" />
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
        <map-position ref="mapPositionDialog" @chosed-location="chosedLocation" />
    </div>
</template>

<script>
import extTable from '@/components/core/ext_table.vue';
import breadCrumb from '@/components/bread_crumb.vue';
import changeImageIcon from '@/components/change_image_icon.vue';
import mapPosition from '@/components/map_position.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        extTable,
        breadCrumb,
        changeImageIcon,
        mapPosition,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            largeSize: 'large',
            filters: {
                key: 'storeName',
                value: '',
            },
            props: [],
            columns: [],
            paginated: {
                attrs: { searchKey: {}, currPage: 1, offset: 0, limit: 9, count: 0 },
                list: [],
            },
            operations: [
                {
                    label: 'action.edit', // 按钮上显示的文字
                    icon: 'el-icon-ali-bianji', // 按钮文字前面的图标
                    perms: 'preference:store:edit', // 权限标识
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
                    perms: 'preference:store:delete',
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
            permsBatchDelete: 'preference:store:delete',

            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children',
            },
            areaList: [],

            isCreating: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // 新增编辑界面数据
            formData: {
                id: 0,
                storeName: '', // 门店名称
                mobile: '', // 门店电话/手机号
                linkman: '', // 门店联系人
                attachmentId: 0, // 门店logo
                attachment: {
                    id: 0,
                    path: '',
                },
                areaId: '', // 门店地区id
                address: '', // 门店详细地址
                coordinate: '', // 门店坐标
                latitude: '', // 纬度
                longitude: '', // 经度
            },
        };
    },
    computed: {
        // 响应式的表单验证规则
        formDataRules() {
            return {
                name: [{ required: true, message: this.$t('store.nameRequired'), trigger: 'blur' }],
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
    mounted() {
        this.getAreaList();
    },
    methods: {
        /**
         * 处理刷新按钮点击
         * 使用父组件提供的 reload 方法进行页面刷新
         */
        handleRefresh() {
            this.reload();
        },
        chosedLogo(chosed) {
            this.formData.attachmentId = chosed.id;
            this.formData.attachment = chosed;
        },
        chosedLocation(position) {
            this.formData.coordinate = `${position.lng},${position.lat}`;
            this.formData.latitude = position.lat;
            this.formData.longitude = position.lng;
            this.formData.address = position.address;
            this.$refs.mapPositionDialog.setMapDialogVisible(false);
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
            const _result = await this.$api.store.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.store.destroy({ ids });
            if (_result.succeed === 1 && _result.code === 200) {
                for (const id of ids) {
                    const _index = this.paginated.list.findIndex((v) => v.id === id);
                    this.paginated.list.splice(_index, 1);
                }
            }
        },
        /**
         * 地区列表
         */
        async getAreaList() {
            const _result = await this.$api.area.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.areaList = _result.data.list;
            }
        },
        // 显示新增界面
        handleAdd() {
            this.editDialogVisible = true;
            this.isCreating = true;
            this.formData = {
                id: 0,
                storeName: '', // 门店名称
                mobile: '', // 门店电话/手机号
                linkman: '', // 门店联系人
                attachmentId: 0, // 门店logo
                attachment: {
                    id: 0,
                    path: '',
                },
                areaId: '', // 门店地区id
                address: '', // 门店详细地址
                coordinate: '', // 门店坐标
                latitude: '', // 纬度
                longitude: '', // 经度
            };
        },
        // 显示编辑界面
        handleEdit(data) {
            this.editDialogVisible = true;
            this.isCreating = false;
            this.formData = Object.assign({}, data.row);
        },
        changePosition() {
            this.$refs.mapPositionDialog.setMapDialogVisible(true);
        },
        // 编辑
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(this.$t('common.confirmSubmit'), this.$t('common.tip'), {}).then(
                        async () => {
                            this.editLoading = true;
                            const data = Object.assign({}, this.formData);

                            if (Array.isArray(data.areaId) && data.areaId.length > 0) {
                                data.areaId = data.areaId.pop();
                            }
                            const _result = await this.$api.store.save(data);
                            if (_result.succeed === 1 && _result.code === 200) {
                                const _store = this.paginated.list.find(
                                    (v) => v.id === _result.data.id
                                );
                                if (!_store) {
                                    this.paginated.list.unshift(_result.data);
                                } else {
                                    Object.assign(_store, _result.data);
                                }
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
                        }
                    );
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
.search-box {
    position: absolute;
    top: 25px;
    left: 20px;
}
.amap-container {
    height: 300px;
    width: 100%;
}
</style>
