<template>
    <div>login page test</div>
    <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="fieldRules"
        class="demo-ruleForm login-container"
        label-position="left"
        label-width="0px"
    >
        <span class="tool-bar">
            <!-- 主题切换 -->
            <theme-picker
                :default="themeColor"
                class="theme-picker"
                style="float: right"
                @on-theme-change="onThemeChange"
            />
        </span>
        <h2 class="title" style="padding-left: 22px">系统登录</h2>
        <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="账号"
                type="text"
            />
        </el-form-item>
        <el-form-item prop="pwd">
            <el-input
                v-model="loginForm.pwd"
                auto-complete="off"
                placeholder="密码"
                show-password
                type="password"
            />
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button round style="width: 48%" type="primary" @click.prevent="reset">
                重 置
            </el-button>
            <el-button
                :loading="loading"
                round
                style="width: 48%"
                type="primary"
                @click.prevent="login"
            >
                登 录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import themePicker from '@/components/theme_picker.vue';
export default {
    name: 'Login',
    components: {
        themePicker,
    },
    data() {
        return {
            loading: false,
            loginForm: {
                username: 'admin',
                pwd: '111111',
            },
            fieldRules: {
                username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            checked: true,
        };
    },
    methods: {
        ...mapActions(['setLoginUser', 'setThemeColor', 'setMapAlias']),
        async login() {
            try {
                this.loading = true;
                const _loginUser = {
                    username: this.loginForm.username,
                    pwd: this.loginForm.pwd,
                };
                const _result = await this.$api.sysUser.login(_loginUser);
                if (_result.succeed === 1 && _result.code === 200) {
                    Cookies.set('token', _result.data.token); // 放置token到Cookie
                    Object.assign(_loginUser, _result.data);
                    sessionStorage.setItem('loginUser', JSON.stringify(_loginUser)); // 保存用户到本地会话
                    this.setLoginUser(_loginUser);

                    const _mapAlias = await this.$api.mapAlias();
                    this.setMapAlias(_mapAlias);
                    this.$router.push('/'); // 登录成功，路由到home页
                } else {
                    this.$notify({
                        title: '失败',
                        message: _result.description,
                        type: 'error',
                    });
                }
                this.loading = false;
            } catch (err) {
                this.$notify({
                    title: '失败',
                    message: err.message,
                    type: 'error',
                });
                this.loading = false;
            }
        },
        refreshCaptcha: function () {
            this.loginForm.src = this.env.baseUrl + '/captcha.jpg?t=' + new Date().getTime();
        },
        reset() {
            this.$refs.loginForm.resetFields();
        },
        // 切换主题
        onThemeChange: function (themeColor) {
            this.setThemeColor(themeColor);
        },
    },
    mounted() {
        this.refreshCaptcha();
    },
    computed: {
        ...mapState({
            themeColor: (state) => state.app.themeColor,
        }),
    },
};
</script>

<style lang="scss" scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #505458;
    }
    .remember {
        margin: 0px 0px 35px 0px;
    }
}
</style>
