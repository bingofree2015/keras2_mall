import api from '@/api';
import store from '@/store';
import router from '@/router';
import { parseIFrameRoutePath, buildIFrameFullUrl } from '@/utils/iframe_route_utils.js';

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function mountDynamicRoutes(dynamicRoutes) {
    // 下面代码为拦截代码生成路由，直接绑定到Generator页面组件
    dynamicRoutes.map((v) => {
        if (v.name === '代码生成') {
            //v.component = Generator}
        }
    });
    if (router.hasRoute('home')) {
        dynamicRoutes.forEach((route) => {
            router.addRoute('home', route);
        });
    }
}

// 批量导入 views 下所有 vue 文件
const modules = import.meta.glob('../views/**/*.vue');

/**
 * 查找组件模块
 * @param {string} menuUrl 菜单URL
 * @returns {Function|null} 组件加载函数
 */
function findComponentModule(menuUrl) {
    const key = `../views/${menuUrl}`;
    if (modules[key]) {
        return modules[key];
    }

    // 尝试不同的路径格式
    const alternativeKeys = [`../views/${menuUrl}.vue`, `../views/${menuUrl}/index.vue`];

    for (const altKey of alternativeKeys) {
        if (modules[altKey]) {
            return modules[altKey];
        }
    }

    // 找不到页面时返回404
    return () => import('../views/404.vue');
}

/**
 * 创建路由元信息
 * @param {Object} menu 菜单对象
 * @param {Array} nav 导航路径
 * @returns {Object} 路由元信息
 */
function createRouteMeta(menu, nav) {
    return {
        icon: menu.icon,
        index: menu.id,
        nav: [...nav],
    };
}

/**
 * 处理iframe路由
 * @param {Object} menu 菜单对象
 * @returns {Object} iframe路由配置
 */
function createIframeRoute(menu) {
    const path = parseIFrameRoutePath(menu.url);
    const url = buildIFrameFullUrl(menu.url);

    // 添加到 state.iframeUrls 变量中
    store.commit('addIFrameUrls', { path, url });

    return {
        path,
        name: menu.name,
        component: () => import('../views/layout/iframe_container.vue'),
        meta: createRouteMeta(menu, []),
    };
}

/**
 * 创建普通路由
 * @param {Object} menu 菜单对象
 * @param {Array} nav 导航路径
 * @returns {Object} 路由配置
 */
function createNormalRoute(menu, nav) {
    return {
        path: menu.url || '/',
        name: menu.name,
        component: findComponentModule(menu.url),
        meta: createRouteMeta(menu, nav),
    };
}

/**
 * 将菜单转换为路由
 * @param {Object} menu 菜单对象
 * @param {Array} nav 导航路径
 * @param {Array} routes 路由数组
 */
function convertMenuToRoute(menu, nav = [], routes = []) {
    // 构建导航路径
    const currentNav = [...nav];
    currentNav[menu.level - 1] = {
        path: menu.url ? '/' + menu.url : '',
        name: menu.name,
    };
    currentNav.splice(menu.level);

    // 创建路由
    let route;
    if (parseIFrameRoutePath(menu.url)) {
        route = createIframeRoute(menu);
    } else {
        route = createNormalRoute(menu, currentNav);
    }

    // 处理子菜单
    if (menu.children?.length > 0) {
        for (const subMenu of menu.children) {
            convertMenuToRoute(subMenu, currentNav, routes);
        }
    }

    routes.push(route);
}

/**
 * 生成动态路由
 * @param {Array} menus 菜单列表
 * @returns {Array} 动态路由数组
 */
function generateDynamicRoutes(menus) {
    const routes = [];

    for (const menu of menus) {
        convertMenuToRoute(menu, [], routes);
    }

    return routes;
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
