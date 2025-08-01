<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow" />
        </el-row>
        <el-row :gutter="20" class="menu-container">
            <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9">
                <!-- 菜单预览界面 -->
                <el-container class="menu-preview">
                    <el-header>{{ $t('wechat.menu.title') }}</el-header>
                    <el-main />
                    <el-footer>
                        <el-menu :default-active="activeIndex" mode="horizontal" class="menu-list">
                            <el-sub-menu
                                v-for="(btn, idx) in menuConfig.button"
                                :key="idx"
                                :index="idx.toString()"
                                class="sub-menu"
                                @mouseout="() => {}"
                                @mouseover="() => {}"
                            >
                                <template #title>
                                    <el-link underline="never" @click.stop="editMenu(idx)">
                                        {{ btn.name }}
                                    </el-link>
                                    <el-tag closable @close="deleteMenu(idx)" />
                                </template>
                                <el-menu-item
                                    v-for="(subBtn, subIdx) in btn.sub_button"
                                    :key="idx + '_' + subIdx"
                                    :index="idx + '_' + subIdx"
                                    class="sub-menu-item"
                                >
                                    <el-row justify="space-between" type="flex">
                                        <el-col :span="20">
                                            <el-link
                                                underline="never"
                                                @click.stop="editMenu(idx, subIdx)"
                                            >
                                                {{ subBtn.name }}
                                            </el-link>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-tag closable @close="deleteMenu(idx, subIdx)" />
                                        </el-col>
                                    </el-row>
                                </el-menu-item>
                                <el-menu-item
                                    v-if="btn.sub_button.length < 5"
                                    :index="idx + '_addSubMenu'"
                                >
                                    <el-link
                                        underline="never"
                                        icon="el-icon-ali-zengjia"
                                        @click.stop="addSubMenu(idx)"
                                    >
                                        {{ $t('wechat.menu.addSubMenu') }}
                                    </el-link>
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-if="menuConfig.button.length < 3" index="add">
                                <el-link
                                    underline="never"
                                    icon="el-icon-ali-zengjia"
                                    @click.stop="addMenu()"
                                >
                                    {{ $t('wechat.menu.addMainMenu') }}
                                </el-link>
                            </el-menu-item>
                        </el-menu>
                    </el-footer>
                </el-container>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <el-container v-if="editingMenuItem" class="edit-dialog-container">
                    <el-header>{{ $t('wechat.menu.menuEditInterface') }}</el-header>
                    <el-main>
                        <!-- 菜单编辑界面 -->
                        <el-form
                            ref="formData"
                            :model="editingMenuItem"
                            :rules="formDataRules"
                            :size="largeSize"
                            label-width="80px"
                        >
                            <el-form-item :label="$t('wechat.menu.menuName')" prop="name">
                                <el-input v-model="editingMenuItem.name" />
                            </el-form-item>
                            <el-form-item :label="$t('wechat.menu.actionType')" prop="type">
                                <el-select
                                    v-model="editingMenuItem.type"
                                    :placeholder="$t('wechat.menu.selectActionType')"
                                >
                                    <el-option
                                        v-for="item in menuTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('wechat.menu.keyword')" prop="keyword">
                                <el-input v-model="editingMenuItem[editingMenuItem.type]" />
                            </el-form-item>
                        </el-form>
                    </el-main>
                    <el-footer class="footer">
                        <el-button
                            :loading="editLoading"
                            :size="miniSize"
                            round
                            type="primary"
                            @click="submitForm()"
                        >
                            {{ $t('action.submit') }}
                        </el-button>
                    </el-footer>
                </el-container>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import breadCrumb from '@/components/bread_crumb.vue';
export default {
    components: {
        breadCrumb,
    },
    data() {
        return {
            normalSize: 'default',
            largeSize: 'large',
            miniSize: 'default',
            weixinTitle: this.$t('wechat.menu.title'),
            activeIndex: '1',
            // 菜单对象
            menuConfig: {
                button: [],
            },
            menuTypes: [
                {
                    label: '关键字',
                    value: 'click',
                },
                {
                    label: '跳转网页',
                    value: 'view',
                },
                {
                    label: '跳转小程序',
                    value: 'miniprogram',
                },
            ],
            editLoading: false,
            // 新增编辑界面数据
            editingMenuItem: null,
            formDataRules: {
                name: [
                    {
                        required: true,
                        message: this.$t('wechat.menu.inputMenuName'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    async mounted() {
        await this.getSettings();
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            if (key === 'add') {
                // 添加主菜单
                this.menuConfig.button.push({
                    name: `菜单名称 ${this.menuConfig.button.length}`,
                    sub_button: [],
                });
            } else {
                // 处理用户点击了哪一个菜单，执行编辑
                const _idxs = key.split('_');
                if (_idxs.length === 2) {
                    if (_idxs[1] === 'addSubMenu') {
                        // 添加子菜单
                        let _idx = _idxs[0];
                        this.menuConfig.button[_idx].sub_button.push({
                            name: `子菜单名称 ${this.menuConfig.button[_idx].sub_button.length}`,
                        });
                    }
                }
            }
        },
        // 添加主菜单
        addMenu() {
            let menuItems = this.menuConfig.button;
            menuItems.push({
                name: this.$t('wechat.menu.menuNameTemplate', { index: menuItems.length }),
                sub_button: [],
            });
        },
        // 添加子菜单
        addSubMenu(idx) {
            // 添加子菜单
            let _subMenuItems = this.menuConfig.button[idx].sub_button;
            _subMenuItems.push({
                name: this.$t('wechat.menu.subMenuNameTemplate', { index: _subMenuItems.length }),
            });
        },
        // 删除菜单
        deleteMenu(idx, subIdx) {
            if (idx >= 0 && subIdx >= 0) {
                this.menuConfig.button[idx].sub_button.splice(subIdx, 1);
            } else if (idx >= 0) {
                this.menuConfig.button.splice(subIdx, 1);
            }
        },
        // 编辑菜单
        editMenu(idx, subIdx) {
            if (idx >= 0 && subIdx >= 0) {
                this.editingMenuItem = this.menuConfig.button[idx].sub_button[subIdx];
            } else if (idx >= 0) {
                this.editingMenuItem = this.menuConfig.button[idx];
            }
        },
        // 表单提交
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.menuConfig);

                        const _result = await this.$api.setting.save({
                            key: 'mp_menu_config',
                            value: data,
                        });
                        if (_result.succeed === 1 && _result.code === 200) {
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
                    });
                }
            });
        },

        async getSettings() {
            const _result = await this.$api.setting.get({
                key: 'mp_menu_config',
            });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.menuConfig, _result.data);
                console.log(this.menuConfig);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.menu-container {
    margin-top: 20px;
}

.menu-preview {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    min-width: 320px;
    min-height: 540px;
    border-radius: 8px;
    overflow: hidden;
}

.el-container {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    min-width: 320px;
    min-height: 540px;
    border-radius: 8px;
    overflow: hidden;
}

.el-header {
    text-align: center;
    line-height: 60px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 600;
}

.menu-list {
    border: none;
    background-color: transparent;
}

.sub-menu :deep(.el-submenu__title) {
    padding: 0 8px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #f0f9ff;
    }

    .el-tag {
        border-width: 0px;
        padding: 0px;
        background-color: #fff;
        font-size: 14px;
        margin-left: 8px;
    }
}

.sub-menu-item :deep(.el-tag) {
    border-width: 0px;
    padding: 0px;
    background-color: #fff;
    font-size: 14px;
}

.sub-menu-item {
    transition: all 0.3s ease;

    &:hover {
        background-color: #f0f9ff;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .menu-container {
        .el-col {
            margin-bottom: 20px;
        }
    }

    .menu-preview,
    .el-container {
        min-width: 100%;
        min-height: 400px;
    }
}
</style>
