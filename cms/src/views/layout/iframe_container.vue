<template>
    <div class="iframe-container">
        <iframe
            :onload="onloaded()"
            :src="src"
            class="frame"
            frameborder="0"
            scrolling="auto"
        ></iframe>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            src: '',
            loading: null,
        };
    },
    computed: {
        ...mapState({
            activeIFrameUrl: (state) => state.iframe.activeIFrameUrl,
        }),
    },
    watch: {
        $route: {
            handler: function (val, oldVal) {
                // 如果是跳转到嵌套页面，切换iframe的url
                this.resetSrc(this.activeIFrameUrl);
            },
        },
    },
    mounted() {
        this.resetSrc(this.activeIFrameUrl);
    },
    methods: {
        // 获取路径
        resetSrc: function (url) {
            this.src = url;
            this.load();
        },
        load: function () {
            this.loading = this.$loading({
                lock: true,
                text: 'loading...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)',
                // fullscreen: false,
                target: document.querySelector('#main-container '),
            });
        },
        onloaded: function () {
            if (this.loading) {
                this.loading.close();
            }
        },
    },
};
</script>

<style lang="scss">
.iframe-container {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    .frame {
        width: 100%;
        height: 100%;
    }
}
</style>
