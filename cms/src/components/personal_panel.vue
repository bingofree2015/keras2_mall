<template>
    <div class="personal-panel">
        <div :style="{ background: themeColor }" class="personal-desc">
            <div class="avatar-container">
                <img
                    v-if="loginUser.attachment"
                    :src="env.getImgUrl(loginUser.attachment.path)"
                    class="avatar"
                />
            </div>
            <div class="name-role">
                <span class="sender">
                    {{ loginUser.username }} -
                    {{ loginUser.roles ? loginUser.roles.map((v) => v.remark).toString() : '' }}
                </span>
            </div>
        </div>
        <div class="main-operation">
            <span class="main-operation-item">
                <el-button round @click="showEditUserInfoDialog">
                    <i class="el-icon-ali-ziyuan"></i>
                    {{ $t('personal.center') }}
                </el-button>
            </span>
            <span class="main-operation-item">
                <el-button round @click="showResetUserPwdDialog">
                    <i class="el-icon-ali-changeadmin"></i>
                    {{ $t('personal.changePwd') }}
                </el-button>
            </span>
        </div>
        <div class="other-operation">
            <div class="other-operation-item">
                <i class="el-icon-ali-qingchuhuancun"></i>
                {{ $t('personal.clearCache') }}
            </div>
            <div class="other-operation-item" @click="showBackupDialog">
                <i class="el-icon-ali-beifenhuanyuan1"></i>
                {{ $t('common.backupRestore') }}
            </div>
        </div>
        <div class="personal-footer" @click="logout">
            <i class="el-icon-ali-tuichu"></i>
            {{ $t('common.logout') }}
        </div>
        <!--备份还原界面-->
        <database v-model:visible="databaseDialogVisible" @after-restore="afterRestore" />
        <edit-user-info v-model:visible="editUserInfoDialogVisible" />
        <reset-user-pwd v-model:visible="resetUserPwdDialogVisible" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import database from '@/components/database.vue';
import editUserInfo from '@/components/edit_user_info.vue';
import resetUserPwd from '@/components/reset_user_pwd.vue';
export default {
    name: 'PersonalPanel',
    components: {
        database,
        editUserInfo,
        resetUserPwd,
    },
    data() {
        return {
            editUserInfoDialogVisible: false,
            databaseDialogVisible: false,
            resetUserPwdDialogVisible: false,
        };
    },
    computed: {
        ...mapState({
            loginUser: (state) => state.loginUser,
            themeColor: (state) => state.app.themeColor,
            collapse: (state) => state.app.collapse,
        }),
    },
    mounted() {},
    methods: {
        // 退出登录
        logout() {
            this.$confirm(this.$t('personal.confirmLogout'), this.$t('personal.tip'), {
                type: 'warning',
            })
                .then(() => {
                    sessionStorage.removeItem('loginUser');
                    this.$router.push('/login');
                    this.$api.sysUser
                        .logout()
                        .then((result) => {})
                        .catch((result) => {});
                })
                .catch(() => {});
        },
        // 打开备份还原界面
        showBackupDialog() {
            this.databaseDialogVisible = true;
        },
        showEditUserInfoDialog() {
            this.editUserInfoDialogVisible = true;
        },
        showResetUserPwdDialog() {
            this.resetUserPwdDialogVisible = true;
        },
        // 成功还原之后，重新登录
        afterRestore() {
            this.resetUserPwdDialogVisible = false;
            sessionStorage.removeItem('loginUser');
            this.$router.push('/login');
            this.$api.sysUser
                .logout()
                .then((result) => {})
                .catch(function (result) {});
        },
    },
};
</script>

<style scoped lang="scss">
.personal-panel {
    font-size: 14px;
    width: 280px;
    text-align: center;
    border-color: rgba(180, 190, 190, 0.2);
    border-width: 1px;
    border-style: solid;
    background: rgba(182, 172, 172, 0.1);
    margin: -14px;
    border-radius: 10px;
}
.personal-desc {
    padding: 15px;
    color: #fff;
}
.avatar {
    width: 80px;
    height: 80px;
    border-radius: 90px;
}
.name-role {
    font-size: 16px;
    padding: 5px;
}
.personal-relation {
    font-size: 16px;
    padding: 12px;
    margin-right: 1px;
    background: rgba(200, 209, 204, 0.3);
}
.relation-item {
    padding: 12px;
}
.relation-item:hover {
    cursor: pointer;
    color: rgb(19, 138, 156);
}
.main-operation {
    padding: 8px;
    margin-right: 1px;
    border-color: rgba(201, 206, 206, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
}
.main-operation-item {
    margin: 10px;
}
.other-operation {
    padding: 15px;
    margin-right: 1px;
    text-align: left;
    border-color: rgba(180, 190, 190, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
}
.other-operation-item {
    padding: 12px;
}
.other-operation-item:hover {
    cursor: pointer;
    background: #9e94941e;
    color: rgb(19, 138, 156);
}
.personal-footer {
    margin-right: 1px;
    font-size: 14px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-color: rgba(180, 190, 190, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
}
.personal-footer:hover {
    cursor: pointer;
    color: rgb(19, 138, 156);
    background: #b1a6a61e;
}
</style>
