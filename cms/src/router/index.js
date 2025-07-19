import _ from "lodash";
import Router from "vue-router";
import store from "@/store";

const router = new Router({
    routes: [
        {
            path: "/",
            component: () =>
                import(/* webpackChunkName: 'main' */ "@/views/home"), // 异步加载 es提案的import
            children: [
                {
                    path: "",
                    name: "控制面板",
                    component: () =>
                        import(
                            /* webpackChunkName: 'main' */ "@/views/dashboard"
                        ),
                    meta: {
                        icon: "el-icon-ali-kongzhimianban",
                        index: 0
                    }
                }
            ]
        },
        {
            path: "/login",
            name: "登录",
            component: () =>
                import(/* webpackChunkName: 'main' */ "@/views/login")
        },
        {
            path: "/404",
            name: "notFound",
            component: () =>
                import(/* webpackChunkName: 'main' */ "@/views/404")
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    // 登录界面登录成功之后，会把用户信息保存在会话
    // 存在时间为会话生命周期，页面关闭即失效
    let _loginUser = sessionStorage.getItem("loginUser");
    _loginUser = _loginUser ? JSON.parse(_loginUser) : _loginUser;

    if (_loginUser && _loginUser.id && !store.state.loginUser) {
        store.commit("setLoginUser", _loginUser);
    }
    if (to.path === "/login") {
        // 如果是访问登录界面，并且用户会话信息存在，代表已登录过，跳转到主页
        if (_loginUser && _loginUser.id) {
            next({ path: "/" });
        } else {
            next();
        }
    } else {
        if (_loginUser && _loginUser.id) {
            // 处理IFrame嵌套页面
            handleIFrameUrl(to.path)
            next();
        } else {
            // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
            next({ path: "/login" });
        }
    }
});

function handleIFrameUrl(path) {
    if (path) {
        let _currIFrameUrl = store.state.iframe.iframeUrls.find(item =>
            path.endsWith(item.path)
        );
        if (_currIFrameUrl && _currIFrameUrl.url) {
            store.commit("setIFrameUrl", _currIFrameUrl.url);
        }
    }
}

export default router;
