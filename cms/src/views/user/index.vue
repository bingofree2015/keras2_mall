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
                        <el-input v-model="filters.value" :placeholder="$t('user.inputMobile')">
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
                                    perms="user:view"
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
            alias-name="user"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? $t('action.add') : $t('action.edit')"
            :model-value="editDialogVisible"
            width="45%"
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
                        <el-form-item :label="$t('user.mobile')" prop="mobile">
                            <el-input v-model="formData.mobile" maxlength="11" show-word-limit />
                        </el-form-item>
                        <el-form-item :label="$t('user.nickname')" prop="nickname">
                            <el-input v-model="formData.nickname" />
                        </el-form-item>
                        <el-form-item :label="$t('user.password')" prop="password">
                            <el-input v-model="formData.password" show-password />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('user.avatar')" prop="attachment">
                            <change-image-icon
                                :img-url="formData.attachment ? formData.attachment.path : ''"
                                @chosed-image-icon="chosedLogo"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.sex')" prop="sex">
                            <el-select
                                v-model="formData.sex"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="item in sexOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.birthday')" prop="birthday">
                            <el-date-picker
                                v-model="formData.birthday"
                                :placeholder="$t('user.selectDate')"
                                type="date"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.grade')" prop="gradeId">
                            <el-select
                                v-model="formData.gradeId"
                                :placeholder="$t('common.selectPlaceholder')"
                            >
                                <el-option
                                    v-for="item in userGrades"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('user.state')" prop="state">
                            <el-switch
                                v-model="formData.state"
                                :active-text="$t('user.enable')"
                                :inactive-text="$t('user.locked')"
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
import changeImageIcon from '@/components/change_image_icon.vue';
import extButton from '@/components/core/ext_button.vue';
export default {
    components: {
        extTable,
        breadCrumb,
        changeImageIcon,
        extButton,
    },
    inject: ['reload'],
    data() {
        return {
            normalSize: 'default',
            filters: {
                key: 'mobile',
                value: '',
            },
            props: [
                {
                    prop: 'mobile',
                    label: '手机号',
                },
            ],
            columns: [
                {
                    prop: 'id',
                    label: 'ID',
                    minWidth: 60,
                },
                {
                    prop: 'mobile',
                    label: '手机号',
                    minWidth: 120,
                },
                {
                    prop: 'userGrade.name',
                    label: '用户等级',
                    minWidth: 100,
                },
                {
                    prop: 'sex',
                    label: '性别',
                    minWidth: 80,
                    formatter: this.env.columnFormatter,
                },
                {
                    prop: 'birthday',
                    label: '生日',
                    minWidth: 100,
                },
                {
                    prop: 'avatar',
                    label: '头像',
                    minWidth: 80,
                    propType: 'image',
                    align: 'center',
                },
                {
                    prop: 'balance',
                    label: '余额',
                    minWidth: 70,
                },
                {
                    prop: 'point',
                    label: '积分',
                    minWidth: 70,
                },
                {
                    prop: 'state',
                    label: '状态',
                    minWidth: 70,
                    formatter: this.env.formatState,
                    align: 'center',
                },
            ],
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
                    perms: 'user:edit', // 权限标识
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
                    perms: 'user:delete',
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
            permsBatchDelete: 'user:delete',
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
                mobile: [
                    {
                        required: true,
                        message: this.$t('user.inputMobile'),
                        trigger: 'blur',
                    },
                ],
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
                    _operationWidth += this.operations.length * 100;
                }
                return _operationWidth;
            },
        },
    },
    mounted() {
        this.getUserGrades();
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
        columnFormatter(value, aliasName, column) {
            let _formatText = '';
            if (aliasName && column && value) {
                _formatText = this.mapAlias[aliasName][column][value];
            }
            return _formatText;
        },
        chosedLogo(chosen) {
            this.formData.avatar = chosen.path;
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
            const _result = await this.$api.user.list(this.paginated.attrs);
            if (_result.succeed === 1 && _result.code === 200) {
                this.paginated.list = _result.data.list;
                this.paginated.attrs.count = _result.data.count;
            }
            if (data && data.cb) data.cb();
        },
        /** 用户等级列表 */
        async getUserGrades() {
            const _result = await this.$api.userGrade.list();
            if (_result.succeed === 1 && _result.code === 200) {
                this.userGrades = _result.data.list;
            }
        },
        // 批量删除
        async batchDelete(ids) {
            const _result = await this.$api.user.destroy({ ids });
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
                username: '', // 用户名
                password: '', // 密码 md5(md5()+创建时间)
                mobile: '', // 手机号
                sex: -1, // 1:男 0:女 3:未知
                birthday: null, // 生日
                avatar: '', // 头像
                nickname: '', // 昵称
                balance: 0, // 余额
                point: 0, // 积分
                gradeId: 1, // 用户等级
                userGrade: {
                    id: 1,
                    name: '',
                },
                state: 1, // 1:正常 2:停用
                pid: 0, // 推荐人
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
                            const _result = await this.$api.user.save(data);
                            if (_result.succeed === 1 && _result.code === 200) {
                                const _user = this.paginated.list.find(
                                    (v) => v.id === _result.data.id
                                );
                                if (!_user) {
                                    this.paginated.list.unshift(_result.data);
                                } else {
                                    Object.assign(_user, _result.data);
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

<style scoped lang="scss"></style>
