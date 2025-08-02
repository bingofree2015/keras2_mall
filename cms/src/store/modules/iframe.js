export default {
    state: {
        activeIFrameUrl: '', // 当前嵌套页面路由路径
        iframeUrls: [], // 所有嵌套页面路由路径访问URL
    },
    getters: {},
    mutations: {
        setActiveIFrameUrl(state, activeIFrameUrl) {
            // 设置iframeUrl
            state.activeIFrameUrl = activeIFrameUrl;
        },
        addIFrameUrls(state, iframeUrl) {
            // iframeUrls
            state.iframeUrls.push(iframeUrl);
        },
    },
    actions: {
        setActiveIFrameUrl({ commit }, activeIFrameUrl) {
            commit('setActiveIFrameUrl', activeIFrameUrl);
        },
        addIFrameUrls({ commit }, iframeUrl) {
            commit('addIFrameUrls', iframeUrl);
        },
    },
};
