window.WEP = window.WEP || {}
window.WEP.fullscreenConfig = {

    // 调用js函数的名称 - 进入全屏
    jsEnterFnName: 'wepEnterFullscreen',
    // 调用js函数的名称 - 退出全屏
    jsExitFnName: 'wepExitFullscreen',

    // 进入全屏之后的回调
    onEnterFullscreen: () => {
    },
    // 退出全屏之后的回调
    onExitFullscreen: () => {
    }
}