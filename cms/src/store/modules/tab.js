
export default {
    state: {
        // 主入口标签页
        mainTabs: [],
        // 当前标签页名
        mainActiveTab: {}
    },
    mutations: {
        updateMainTabs(state, tabs) {
            state.mainTabs = tabs;
        },
        updateMainActiveTab(state, activeTab) {
            state.mainActiveTab = activeTab;
        }
    },
    actions: {
        updateMainTabs({ commit }, tabs) {
            commit("updateMainTabs", tabs);
        },
        updateMainActiveTab({ commit }, activeTab) {
            commit("updateMainActiveTab", activeTab);
        }
    }
};
