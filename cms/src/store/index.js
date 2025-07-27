import { createStore } from 'vuex';
import app from '@/store/modules/app';
import tab from '@/store/modules/tab';
import iframe from '@/store/modules/iframe';
import menu from '@/store/modules/menu';

const state = {
    loginUser: {
        perms: [],
    },
    mapAlias: {},
};

const getters = {};

const mutations = {
    setPerms(state, perms) {
        state.loginUser.perms = perms;
    },
    setLoginUser(state, loginUser) {
        state.loginUser = loginUser;
    },
    setMapAlias(state, mapAlias) {
        state.mapAlias = mapAlias;
    },
};

const actions = {
    setPerms({ commit }, perms) {
        commit('setPerms', perms);
    },
    setLoginUser({ commit }, loginUser) {
        commit('setLoginUser', loginUser);
    },
    setMapAlias({ commit }, mapAlias) {
        commit('setMapAlias', mapAlias);
    },
};

const store = createStore({
    state,
    getters,
    actions,
    mutations,
    modules: { app, tab, iframe, menu },
});

export default store;
