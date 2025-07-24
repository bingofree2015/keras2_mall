import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const createRoutes = [
    // 二级路由
    {
        path: '/',
        component: () => import('../views/home.vue'),
        children: [
            {
                path: '',
                name: '控制面板',
                component: () => import('../views/dashboard.vue'),
                meta: {
                    icon: 'el-icon-ali-kongzhimianban',
                    index: 0,
                },
            },
        ],
    },
    // 一级路由
    {
        path: '/login',
        name: '登录',
        component: () => import('../views/login.vue'),
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('../views/404.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: createRoutes,
});

router.beforeEach(async (to, from, next) => {
    let _loginUser = sessionStorage.getItem('loginUser');
    _loginUser = _loginUser ? JSON.parse(_loginUser) : _loginUser;

    if (_loginUser && _loginUser.id && !store.state.loginUser) {
        store.commit('setLoginUser', _loginUser);
    }
    if (to.path === '/login') {
        if (_loginUser && _loginUser.id) {
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        if (_loginUser && _loginUser.id) {
            handleIFrameUrl(to.path);
            next();
        } else {
            next({ path: '/login' });
        }
    }
});

function handleIFrameUrl(path) {
    if (path) {
        let _currIFrameUrl = store.state.iframe.iframeUrls.find((item) => path.endsWith(item.path));
        if (_currIFrameUrl && _currIFrameUrl.url) {
            store.commit('setIFrameUrl', _currIFrameUrl.url);
        }
    }
}

export default router;
