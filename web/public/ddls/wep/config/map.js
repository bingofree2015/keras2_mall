window.WEP = window.WEP || {}
window.WEP.mapConfig = {

    // 是否使用右上角的小地图，显示当前场景位置以及视角
    // 设为 false 代表不启用该功能
    useMiniMap: true,
    // 调用js函数的名称 - 展开小地图  直接调用 wepShowMiniMap()
    jsShowMiniFnName: 'wepShowMiniMap',
    // 调用js函数的名称 - 收起小地图  直接调用 wepHideMiniMap()
    jsHideMiniFnName: 'wepHideMiniMap',
    // 调用js函数的名称 - 打开小地图  直接调用 wepOpenMiniMap()
    jsOpenMiniFnName: 'wepOpenMiniMap',
    // 调用js函数的名称 - 关闭小地图  直接调用 wepCloseMiniMap()
    jsCloseMiniFnName: 'wepCloseMiniMap',

    // 配置 krpano 中定义的场景切换函数，点击小点时触发
    changeSceneAction: name => `autoview_icon(${name});tour3d_loadscene2(${name});js(wepCloseMap(););`,
    // 切换单元时触发的函数
    changeCellAction: name => ``,

    // 调用js函数的名称 - 打开
    jsOpenFnName: 'wepOpenMap',
    // 调用js函数的名称 - 关闭 （点击页面右上角的关闭按钮可以关闭，调用这个方法也可以关闭）
    jsCloseFnName: 'wepCloseMap',

    // 打开地图之后的回调
    onOpenMap: () => {
    },
    // 关闭地图之后的回调
    onCloseMap: () => {
        wepShowMiniMap();
        window.uivueApp322.resetButtonState(6); 
    },

    // 数据配置，取自data_map.js
    data: WEP.mapData || []
}