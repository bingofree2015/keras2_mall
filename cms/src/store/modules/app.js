export default {
    state: {
        appName: 'KerasMall', // 应用名称
        themeColor: '#131214', // 主题颜色
        themeTintColor: '#131214', // 主题辅助颜色
        oldThemeColor: '#14889A', // 上一次主题颜色
        collapse: false, // 导航栏收缩状态
        globalVariables: null, // 全局变量
    },
    getters: {
        collapse(state) {
            // 对应着上面state
            return state.collapse;
        },
    },
    mutations: {
        onCollapse(state) {
            // 改变收缩状态
            state.collapse = !state.collapse;
        },
        /**
         * 将颜色值保存在state中
         * @param {*} state
         * @param {*} themeColor
         */
        setThemeColor(state, themeColor) {
            // 改变主题颜色
            const _tintColor = (color, tint) => {
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

            state.oldThemeColor = state.themeColor;
            state.themeColor = themeColor;
            state.themeTintColor = _tintColor(themeColor.replace('#', ''), 0.2);
        },
        setGlobalVariables(state, globalVariables) {
            // 设置环境变量
            state.globalVariables = globalVariables;
        },
    },
    actions: {
        onCollapse({ commit }) {
            commit('onCollapse');
        },
        setThemeColor({ commit }, themeColor) {
            commit('setThemeColor', themeColor);
        },
        setGlobalVariables({ commit }, globalVariables) {
            commit('setGlobalVariables', globalVariables);
        },
    },
};
