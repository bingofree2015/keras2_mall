import api from '@/api';
import store from '@/store';
import router from '@/router';
import { parseIFrameRoutePath, buildIFrameFullUrl } from './iframe_route_utils.js';

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function mountDynamicRoutes(dynamicRoutes) {
    dynamicRoutes.map((v) => {
        if (v.name === '代码生成') {
            //v.component = Generator}
        }
    });
    let _rootRoute = router.options.routes;
    if (_rootRoute.length > 0) {
        _rootRoute[0].children = _rootRoute[0].children.concat(dynamicRoutes);
        router.addRoute(_rootRoute[0]);
    }
}

/**
 * 添加动态(菜单)路由
 * @param {*} menus 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function generateDynamicRoutes(menus) {
    const _routers = [];

    const menu2Router = (menu, nav = [], routers = []) => {
        nav[menu.level - 1] = {
            path: menu.url ? '/' + menu.url : '',
            name: menu.name,
        };
        nav = nav.slice(0, menu.level);
        const _nav = [...nav];
        const _router = {
            path: menu.url ? menu.url : '/',
            name: menu.name,
            component: null,
            meta: {
                icon: menu.icon,
                index: menu.id,
                nav: _nav,
            },
        };

        const _path = parseIFrameRoutePath(menu.url);
        if (_path) {
            // 外链
            _router.path = _path;
            _router.component = () => import(`../views/layout/iframe_container.vue`);
            // 添加到 state.iframeUrls 变量中
            const _url = buildIFrameFullUrl(menu.url);
            const _iFrameUrl = { path: _path, url: _url };
            store.commit('addIFrameUrl', _iFrameUrl);
        } else if (menu.url) {
            // 内置组件
            _router.component = () => import(`../views/${menu.url}`);
        }

        if (menu.children && menu.children.length > 0) {
            for (const _subMenu of menu.children) {
                menu2Router(_subMenu, nav, routers);
            }
        }
        routers.push(_router);
    };

    for (const _menu of menus) {
        menu2Router(_menu, [], _routers);
    }
    return _routers;
}

/**
 * 加载动态菜单和路由
 */
export async function loadDynamicMenuAndRoutes(sysUserId) {
    try {
        let _result = await api.menu.getRouteTree({ sysUserId });
        if (_result.succeed === 1 && _result.code === 200) {
            const _routeMenu = _result.data.list;
            // 添加动态路由
            const _dynamicRoutes = generateDynamicRoutes(_routeMenu);
            // 处理静态组件绑定路由
            mountDynamicRoutes(_dynamicRoutes);

            // 保存菜单树
            _result = await api.menu.getNavTree({ sysUserId });
            if (_result.succeed === 1 && _result.code === 200) {
                store.commit('setNavTree', _result.data.list);
            }
            // 保存用户权限标识集合
            _result = await api.sysUser.getPermits({ sysUserId });
            if (_result.succeed === 1 && _result.code === 200) {
                store.commit('setPerms', _result.data);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}
