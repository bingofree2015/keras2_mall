window.WEP = window.WEP || {}
window.WEP.hotspotConfig = {

    // 调用js函数的名称 - 打开 需要传入数据中对应的id,如 js(wepOpenHotspot(1))
    jsOpenFnName: 'wepOpenHotspot',
    // 调用js函数的名称 - 关闭 （点击页面右上角的关闭按钮可以关闭，调用这个方法也可以关闭）
    jsCloseFnName: 'wepCloseHotspot',
    // 调用js函数的名称 - 获取热点名称
    jsGetNameFnName: 'wepGetHotspotName',

    // 打开热点信息之后的回调
    onOpenHotspot: () => {
    },
    // 关闭热点信息之后的回调
    onCloseHotspot: () => {
    },

    // 设置热点数据
    // 可以在别处调用 WEP.hotspotConfig.setData([...]) 设置热点数据
    setData: list => {
        WEP.hotspotConfig.data = list
    },
    // 热点数据取自data_hotspot.js，也可以调用上面的函数从别处设置数据
    data: WEP.hotspotData || []
}