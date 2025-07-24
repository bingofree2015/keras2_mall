/**
 * 嵌套页面IFrame模块
 */
import { baseUrl } from '@/env';
import store from '@/store';
import router from '@/router';

/**
 * 如果是内嵌页，则返回空字符串，外链则返回不带协议号的url地址
 * @param {*} url
 */
export function parseIFrameRoutePath(url) {
    let iframeUrl = '';
    if (/^iframe:.*/.test(url)) {
        iframeUrl = url.replace('iframe:', '');
    } else if (/^http[s]?:\/\/.*/.test(url)) {
        iframeUrl = url.replace('http://', '');
        if (iframeUrl.indexOf(':') !== -1) {
            iframeUrl = iframeUrl.substring(iframeUrl.lastIndexOf(':') + 1);
        }
    }
    return iframeUrl;
}

/**
 * 处理成完整的URL地址
 * @param {*} url
 */
export function buildIFrameFullUrl(url) {
    let iframeUrl = '';
    if (/^iframe:.*/.test(url)) {
        iframeUrl = baseUrl + url.replace('iframe:', '');
    } else if (/^http[s]?:\/\/.*/.test(url)) {
        iframeUrl = url;
    }
    return iframeUrl;
}

/**
 * 将外网url地址 以iframe组件包装之后添加到路由数组
 * @param {页面名称} name
 * @param {图标} icon
 * @param {外网地址} url
 */
export function registerIFrameRoute(name, icon, url) {
    const _nav = [{ path: '', name: name }];

    const _path = parseIFrameRoutePath(url);
    if (_path) {
        const _router = {
            path: _path,
            name: name,
            component: () => import('@/views/layout/iframe_container.vue'),
            meta: {
                icon: icon,
                nav: _nav,
            },
        };

        const _url = buildIFrameFullUrl(url);
        const _iFrameUrl = { path: _path, url: _url };
        store.commit('addIFrameUrl', _iFrameUrl);

        let _rootRoute = router.options.routes;
        if (_rootRoute.length > 0) {
            _rootRoute[0].children = _rootRoute[0].children.concat(_router);
        }
        router.addRoutes(_rootRoute);
    }
}
