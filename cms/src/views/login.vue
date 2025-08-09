<template>
    <div class="login-page">
        <!-- 左侧插图区域 -->
        <div class="login-illustration">
            <!-- 3D魔方轮播组件 -->
            <div
                class="cube-container"
                @mouseenter="pauseAutoRotate"
                @mouseleave="resumeAutoRotate"
                @click="showImageModal"
            >
                <div class="cube" :style="{ transform: cubeTransform }">
                    <div class="cube-face cube-face-front">
                        <img :src="currentImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                    <div class="cube-face cube-face-back">
                        <img :src="nextImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                    <div class="cube-face cube-face-right">
                        <img :src="currentImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                    <div class="cube-face cube-face-left">
                        <img :src="nextImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                    <div class="cube-face cube-face-top">
                        <img :src="currentImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                    <div class="cube-face cube-face-bottom">
                        <img :src="nextImage" alt="Screenshot" @error="handleImageError" />
                    </div>
                </div>
            </div>

            <!-- 魔方控制按钮 -->
            <div class="cube-controls">
                <div class="control-buttons">
                    <el-button
                        type="primary"
                        :icon="ArrowLeft"
                        circle
                        size="large"
                        class="control-btn"
                        @click="rotateCube('left')"
                    />
                    <el-button
                        type="primary"
                        :icon="ArrowRight"
                        circle
                        size="large"
                        class="control-btn"
                        @click="rotateCube('right')"
                    />
                </div>
                <div class="image-indicators">
                    <span
                        v-for="(img, index) in images"
                        :key="index"
                        :class="['indicator', { active: currentImageIndex === index }]"
                        @click="goToImage(index)"
                    ></span>
                </div>
            </div>
        </div>

        <!-- 右侧登录表单区域 -->
        <div class="login-form-section">
            <div class="login-form-section-header">
                <h2 class="title"></h2>
            </div>
            <div class="form-container">
                <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="fieldRules"
                    :size="normalSize"
                    class="demo-ruleForm login-container"
                    label-position="left"
                    label-width="80px"
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
                    <h2 class="title" style="padding-left: 22px">
                        {{ $t('login.title') }}
                    </h2>
                    <el-form-item prop="username" label="用户名">
                        <el-input
                            v-model="loginForm.username"
                            auto-complete="off"
                            :placeholder="$t('login.username')"
                            type="text"
                        >
                            <template #prepend>
                                <i class="el-icon-ali-guanliyuan"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd" label="密码">
                        <el-input
                            v-model="loginForm.pwd"
                            auto-complete="off"
                            :placeholder="$t('login.password')"
                            show-password
                            type="password"
                        >
                            <template #prepend>
                                <i class="el-icon-ali-jiaose"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="buttons" style="width: 100%">
                        <el-button round style="width: 48%" type="primary" @click.prevent="reset">
                            {{ $t('action.reset') }}
                        </el-button>
                        <el-button
                            :loading="loading"
                            round
                            style="width: 48%"
                            type="primary"
                            @click.prevent="login"
                        >
                            {{ $t('login.login') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

    <!-- 图片模态框 -->
    <div v-if="showModal" class="image-modal" @click="closeImageModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>图片预览</h3>
                <button class="close-btn" @click="closeImageModal">
                    <i class="el-icon-ali-delete1"></i>
                </button>
            </div>
            <div class="modal-body">
                <img :src="currentImage" alt="Screenshot" />
            </div>
            <div class="modal-footer">
                <button class="nav-btn" @click="previousImage">
                    <i class="el-icon-ali-a-Arrow-LeftCircle"></i>
                    上一张
                </button>
                <span class="image-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
                <button class="nav-btn" @click="nextImageInModal">
                    下一张
                    <i class="el-icon-ali-a-Arrow-RightCircle"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { markRaw } from 'vue';
import Cookies from 'js-cookie';
import themePicker from '@/components/theme_picker.vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

export default {
    name: 'Login',
    components: {
        themePicker,
    },
    data() {
        return {
            normalSize: 'large',
            loading: false,
            loginForm: {
                username: 'admin',
                pwd: '111111',
            },
            // 3D魔方相关数据
            images: [],
            currentImageIndex: 0,
            cubeRotation: { x: 0, y: 0 },
            autoRotateInterval: null,
            showModal: false, // 控制图片模态框的显示
            // Element Plus 图标
            ArrowLeft: markRaw(ArrowLeft),
            ArrowRight: markRaw(ArrowRight),
        };
    },
    computed: {
        // 响应式的 fieldRules 配置
        fieldRules() {
            return {
                username: [
                    { required: true, message: this.$t('login.inputUsername'), trigger: 'blur' },
                ],
                pwd: [{ required: true, message: this.$t('login.inputPassword'), trigger: 'blur' }],
                buttons: [], // 为按钮区域添加空的验证规则
            };
        },
        ...mapState({
            themeColor: (state) => state.app.themeColor,
        }),
        // 当前显示的图片
        currentImage() {
            return this.images[this.currentImageIndex] || '/assets/image/logo.png';
        },
        // 下一张图片
        nextImage() {
            const nextIndex = (this.currentImageIndex + 1) % this.images.length;
            return this.images[nextIndex] || '/assets/image/logo.png';
        },
        // 魔方变换样式
        cubeTransform() {
            return `rotateX(${this.cubeRotation.x}deg) rotateY(${this.cubeRotation.y}deg)`;
        },
    },
    mounted() {
        this.refreshCaptcha();
        this.loadImages();
        this.startAutoRotate();
        // 添加键盘事件监听
        document.addEventListener('keydown', this.handleKeydown);
        // 添加页面可见性变化监听
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeUnmount() {
        this.stopAutoRotate();
        // 移除键盘事件监听
        document.removeEventListener('keydown', this.handleKeydown);
        // 移除页面可见性变化监听
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
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
                        title: this.$t('common.fail'),
                        message: _result.description,
                        type: 'error',
                    });
                }
                this.loading = false;
            } catch (err) {
                this.$notify({
                    title: this.$t('common.fail'),
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
        // 加载图片
        loadImages() {
            // 使用public目录下的静态路径
            this.images = [
                '/assets/image/screenshot/1.webp',
                '/assets/image/screenshot/2.webp',
                '/assets/image/screenshot/3.webp',
                '/assets/image/screenshot/4.webp',
                '/assets/image/screenshot/5.webp',
                '/assets/image/screenshot/6.webp',
                '/assets/image/screenshot/7.webp',
                '/assets/image/screenshot/8.webp',
                '/assets/image/screenshot/9.webp',
                '/assets/image/screenshot/10.webp',
                '/assets/image/screenshot/11.webp',
                '/assets/image/screenshot/12.webp',
                '/assets/image/screenshot/13.webp',
                '/assets/image/screenshot/14.webp',
            ];
            console.log('Images loaded:', this.images);
        },
        // 3D魔方相关方法
        rotateCube(direction) {
            if (direction === 'left') {
                this.cubeRotation.y -= 90;
                this.currentImageIndex =
                    (this.currentImageIndex - 1 + this.images.length) % this.images.length;
            } else if (direction === 'right') {
                this.cubeRotation.y += 90;
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            }
        },
        goToImage(index) {
            const diff = index - this.currentImageIndex;
            this.cubeRotation.y += diff * 90;
            this.currentImageIndex = index;
        },
        startAutoRotate() {
            this.autoRotateInterval = setInterval(() => {
                this.rotateCube('right');
            }, 3000); // 每3秒自动旋转一次
        },
        stopAutoRotate() {
            if (this.autoRotateInterval) {
                clearInterval(this.autoRotateInterval);
                this.autoRotateInterval = null;
            }
        },
        pauseAutoRotate() {
            this.stopAutoRotate();
        },
        resumeAutoRotate() {
            this.startAutoRotate();
        },
        handleImageError(event) {
            // 当图片加载失败时，替换为默认图片
            event.target.src = '/assets/image/logo.png';
        },
        showImageModal() {
            this.showModal = true;
        },
        closeImageModal() {
            this.showModal = false;
        },
        previousImage() {
            this.currentImageIndex =
                (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        },
        nextImageInModal() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        },
        handleKeydown(event) {
            if (this.showModal) {
                // 在模态框中处理键盘事件
                if (event.key === 'ArrowLeft') {
                    this.previousImage();
                } else if (event.key === 'ArrowRight') {
                    this.nextImageInModal();
                } else if (event.key === 'Escape') {
                    this.closeImageModal();
                }
            } else {
                // 在魔方上处理键盘事件
                if (event.key === 'ArrowLeft') {
                    this.rotateCube('left');
                } else if (event.key === 'ArrowRight') {
                    this.rotateCube('right');
                }
            }
        },
        // 处理页面可见性变化
        handleVisibilityChange() {
            if (document.hidden) {
                // 页面不可见时暂停自动旋转
                this.pauseAutoRotate();
                console.log('页面不可见，暂停3D动画');
            } else {
                // 页面重新可见时恢复自动旋转
                this.resumeAutoRotate();
                console.log('页面重新可见，恢复3D动画');
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.login-page {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.login-illustration {
    flex: 1;
    //background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background: #f8f9fa;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0 0 20% 0;
}

// 3D魔方容器
.cube-container {
    position: relative;
    width: 450px;
    height: 450px;
    perspective: 1500px;
    margin-bottom: 50px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    &::after {
        content: '点击查看大图';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
    }

    &:hover::after {
        opacity: 1;
    }
}

// 3D魔方
.cube {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.8s ease-in-out;
}

// 魔方面
.cube-face {
    position: absolute;
    width: 450px;
    height: 450px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }
}

.cube-face-front {
    transform: translateZ(225px);
}

.cube-face-back {
    transform: translateZ(-225px) rotateY(180deg);
}

.cube-face-right {
    transform: translateX(225px) rotateY(90deg);
}

.cube-face-left {
    transform: translateX(-225px) rotateY(-90deg);
}

.cube-face-top {
    transform: translateY(-225px) rotateX(90deg);
}

.cube-face-bottom {
    transform: translateY(225px) rotateX(-90deg);
}

// 魔方控制区域
.cube-controls {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.control-buttons {
    display: flex;
    gap: 20px;
}

.control-btn {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 2px solid rgba(255, 255, 255, 0.8) !important;
    color: white !important;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
        background: rgba(0, 0, 0, 1) !important;
        transform: scale(1.1);
        color: white !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    &:active {
        transform: scale(0.95);
    }

    .el-icon {
        font-size: 20px;
    }
}

.image-indicators {
    display: flex;
    gap: 10px;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    &:hover {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(255, 255, 255, 0.9);
        transform: scale(1.1);
    }

    &.active {
        background: rgba(0, 0, 0, 0.9);
        border-color: rgba(255, 255, 255, 1);
        transform: scale(1.2);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }
}

// 右侧登录表单区域
.login-form-section {
    flex: 1;
    flex-direction: column;
    background: #ffffff;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
    .login-form-section-header {
        background: #f8f9fa;
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        .title {
            border-radius: 25% 0 0 0 / 60% 0 0 0;
            background-color: #fff;
            text-align: center;
            width: 100%;
            height: 100%;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #333333;
        }
    }
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 100px auto;
        width: 400px;
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

        // 修复 Element Plus 表单宽度计算问题
        :deep(.el-form-item) {
            margin-bottom: 20px;

            .el-form-item__label {
                width: 80px !important;
                text-align: left;
                line-height: 32px;
                padding: 0 12px 0 0;
                box-sizing: border-box;
            }

            .el-form-item__content {
                margin-left: 80px !important;
            }
        }

        // 按钮区域特殊处理
        :deep(.el-form-item:last-child) {
            .el-form-item__label {
                display: none;
            }

            .el-form-item__content {
                margin-left: 0 !important;
            }
        }
    }
    :deep(.el-input-group__prepend) {
        padding: 0 10px;
        background-color: #f5f7fa;
        border-color: #dcdfe6;
    }
}

// 图片模态框样式
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 1200px;
    max-height: 95%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background-color: #f8f9fa;
    position: relative;

    h3 {
        margin: 0;
        font-size: 20px;
        color: #333;
    }
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 28px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #333;
        background-color: rgba(0, 0, 0, 0.1);
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }
}

.modal-body {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-top: 1px solid #eee;
    background-color: #f8f9fa;

    .nav-btn {
        background: none;
        border: none;
        font-size: 18px;
        color: #555;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 15px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
            background-color: #e9ecef;
            color: #333;
            transform: translateY(-1px);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .image-counter {
        font-size: 18px;
        color: #666;
        font-weight: 500;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .login-page {
        flex-direction: column;
    }

    .login-illustration {
        flex: none;
        height: 40vh;
        border-radius: 0;
    }

    .cube-container {
        width: 300px;
        height: 300px;
    }

    .cube-face {
        width: 300px;
        height: 300px;
    }

    .cube-face-front {
        transform: translateZ(150px);
    }

    .cube-face-back {
        transform: translateZ(-150px) rotateY(180deg);
    }

    .cube-face-right {
        transform: translateX(150px) rotateY(90deg);
    }

    .cube-face-left {
        transform: translateX(-150px) rotateY(-90deg);
    }

    .cube-face-top {
        transform: translateY(-150px) rotateX(90deg);
    }

    .cube-face-bottom {
        transform: translateY(150px) rotateX(-90deg);
    }

    // 移动端模态框调整
    .modal-content {
        width: 95%;
        max-width: none;
        max-height: 90%;
    }

    .modal-body {
        padding: 15px;
    }

    .modal-footer {
        padding: 15px 20px;

        .nav-btn {
            font-size: 16px;
            padding: 6px 12px;
        }

        .image-counter {
            font-size: 16px;
        }
    }

    .close-btn {
        top: 5px;
        right: 10px;
        font-size: 24px;
        width: 35px;
        height: 35px;
    }
}
</style>
