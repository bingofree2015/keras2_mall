<template>
    <div class="page-container">
        <!--导航与工具栏-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
            <el-col :span="14" class="top-bar">
                <el-form :inline="true" :model="filters" :size="largeSize">
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
                                    perms="user:view"
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
                            perms="user:add"
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
            alias-name="user"
            @query-for-paginated-list="queryForPaginatedList"
        />

        <!--新增编辑界面-->
        <el-dialog
            :close-on-click-modal="false"
            :title="isCreating ? '新增' : '编辑'"
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
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="formData.mobile" maxlength="11" show-word-limit />
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="formData.nickname" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="formData.password" show-password />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="头像" prop="attachment">
                            <change-image-icon
                                :img-url="formData.attachment ? formData.attachment.path : ''"
                                @chosed-image-icon="chosedLogo"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="formData.sex" placeholder="请选择">
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
                        <el-form-item label="生日" prop="birthday">
                            <el-date-picker
                                v-model="formData.birthday"
                                placeholder="选择日期"
                                type="date"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="等级" prop="gradeId">
                            <el-select v-model="formData.gradeId" placeholder="请选择">
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
                        <el-form-item label="状态" prop="state">
                            <el-switch
                                v-model="formData.state"
                                active-text="开启"
                                inactive-text="锁定"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :size="largeSize" round @click="editDialogVisible = false">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="largeSize"
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
    data() {
        return {
            largeSize: 'large',
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
                    size: this.largeSize, // 按钮大小
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
                    size: this.largeSize,
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
                        message: '请输入手机号',
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
                    this.$confirm('确认提交吗？', '提示', {}).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);
                        const _result = await this.$api.user.save(data);
                        if (_result.succeed === 1 && _result.code === 200) {
                            const _user = this.paginated.list.find((v) => v.id === _result.data.id);
                            if (!_user) {
                                this.paginated.list.unshift(_result.data);
                            } else {
                                Object.assign(_user, _result.data);
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
