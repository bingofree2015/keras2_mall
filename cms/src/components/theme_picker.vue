<template>
    <el-color-picker
        v-model="theme"
        :size="size"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
    />
</template>

<script>
// const version = require("element-ui/package.json").version; // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF'; // default color
export default {
    name: 'ThemePicker',
    components: {},
    props: {
        default: {
            // 初始化主题，可由外部传入
            type: String,
            default: null,
        },
        size: {
            // 初始化主题，可由外部传入
            type: String,
            default: 'small',
        },
    },
    emits: ['onThemeChange'],
    data() {
        return {
            chalk: '', // content of theme-chalk css
            theme: ORIGINAL_THEME,
            showSuccess: true, // 是否弹出换肤成功消息
        };
    },
    watch: {
        theme(val, oldVal) {
            if (typeof val !== 'string') return;
            const themeCluster = this.getThemeCluster(val.replace('#', ''));
            const originalCluster = this.getThemeCluster(oldVal.replace('#', ''));
            const getHandler = (variable, id) => {
                return () => {
                    const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''));
                    const newStyle = this.updateStyle(
                        this[variable],
                        originalCluster,
                        themeCluster
                    );
                    let styleTag = document.getElementById(id);
                    if (!styleTag) {
                        styleTag = document.createElement('style');
                        styleTag.setAttribute('id', id);
                        document.head.appendChild(styleTag);
                    }
                    styleTag.innerText = newStyle;
                };
            };

            const chalkHandler = getHandler('chalk', 'chalk-style');

            if (!this.chalk) {
                // const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
                // this.getCSSString(url, chalkHandler, "chalk");
                // 兼容 element-plus 时可自定义主题逻辑
                chalkHandler();
            } else {
                chalkHandler();
            }

            let styles = [].slice.call(document.querySelectorAll('style')).filter((style) => {
                const text = style.innerText;
                return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
            });

            styles.forEach((style) => {
                const { innerText } = style;
                if (typeof innerText !== 'string') return;
                style.innerText = this.updateStyle(innerText, originalCluster, themeCluster);
            });

            this.$emit('onThemeChange', val);
            if (this.showSuccess) {
                this.$notify({
                    title: this.$t('common.success'),
                    message: this.$t('themePicker.themeChangeSuccess'),
                    type: 'success',
                });
            } else {
                this.showSuccess = true;
            }
        },
    },
    mounted() {
        if (this.default !== null) {
            this.theme = this.default;
            this.$emit('onThemeChange', this.theme);
            this.showSuccess = false;
        }
    },
    methods: {
        /**
         * 完成样式替换 style 内嵌的样式字符串
         */
        updateStyle(style, oldCluster, newCluster) {
            let newStyle = style;
            oldCluster.forEach((color, index) => {
                newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
            });
            return newStyle;
        },

        getCSSString(url, callback, variable) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText.length);
                    this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
                    console.log(this[variable].length);
                    callback();
                }
            };
            xhr.open('GET', url);
            xhr.send();
        },

        /**
         * 基于主题色生成一套颜色系
         */
        getThemeCluster(theme) {
            const tintColor = (color, tint) => {
                let red = parseInt(color.slice(0, 2), 16);
                let green = parseInt(color.slice(2, 4), 16);
                let blue = parseInt(color.slice(4, 6), 16);

                if (tint === 0) {
                    // when primary color is in its rgb space
                    return [red, green, blue].join(',');
                } else {
                    red += Math.round(tint * (255 - red));
                    green += Math.round(tint * (255 - green));
                    blue += Math.round(tint * (255 - blue));

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    return `#${red}${green}${blue}`;
                }
            };

            const shadeColor = (color, shade) => {
                let red = parseInt(color.slice(0, 2), 16);
                let green = parseInt(color.slice(2, 4), 16);
                let blue = parseInt(color.slice(4, 6), 16);

                red = Math.round((1 - shade) * red);
                green = Math.round((1 - shade) * green);
                blue = Math.round((1 - shade) * blue);

                red = red.toString(16);
                green = green.toString(16);
                blue = blue.toString(16);

                return `#${red}${green}${blue}`;
            };

            // eslint-disable-next-line prefer-const
            let clusters = [theme];
            for (let i = 0; i <= 9; i++) {
                clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
            }
            clusters.push(shadeColor(theme, 0.1));
            return clusters;
        },
    },
};
</script>

<style lang="scss">
.theme-picker .el-color-picker__trigger {
    vertical-align: middle;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
}
</style>
