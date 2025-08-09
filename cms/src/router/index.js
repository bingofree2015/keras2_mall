import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const createRoutes = [
    // 二级路由
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),
        children: [
            {
                path: '',
                name: '控制面板',
                component: () => import('@/views/dashboard.vue'),
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
        component: () => import('@/views/login.vue'),
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('@/views/404.vue'),
    },
    {
        path: '/goods/edit',
        name: '商品编辑',
        component: () => import('@/views/goods/edit.vue'),
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
        // 如果用户已登录，并且路由表中存在此路由
        const _route = router.getRoutes().find((route) => route.path === to.path);
        if (_loginUser && _loginUser.id && _route) {
            handleActiveIFrameUrl(to.path);
            next();
        } else {
            next({ path: '/login' });
        }
    }
});

function handleActiveIFrameUrl(path) {
    if (path) {
        const _currIFrameUrl = store.state.iframe.iframeUrls.find((item) =>
            path.endsWith(item.path)
        );
        if (_currIFrameUrl && _currIFrameUrl.url) {
            store.commit('setActiveIFrameUrl', _currIFrameUrl.url);
        }
    }
}

export default router;
