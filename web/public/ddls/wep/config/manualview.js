window.WEP = window.WEP || {}
window.WEP.manualViewConfig = {

    // 调用js函数的名称 - 打开
    jsOpenFnName: 'wepOpenManualView',
    // 调用js函数的名称 - 关闭 （点击页面右上角的关闭按钮可以关闭，调用这个方法也可以关闭）
    jsCloseFnName: 'wepCloseManualView',
    // 调用js函数的名称 - 退后，即上一个 调用 wepMVToPrev()
    jsPrevFnName: 'wepMVToPrev',
    // 调用js函数的名称 - 前进，即下一个 调用 wepMVToNext()
    jsNextFnName: 'wepMVToNext',
    // 调用js函数的名称 - 点击某一个讲解点，跳转到某一个讲解点，参数是讲解点索引index，调用 wepMVToJump(index)
    jsJumpFnName: 'wepMVToJump',

    // 打开手动导览之后的回调
    onOpenManualView: () => {
    },
    // 关闭手动导览之后的回调
    onCloseManualView: () => {
        container1121();
    },
    // 切换讲解点之后的回调 参数是讲解点的信息
    onChangePoint: (info) => {
        //tour3d_loadscene(info.scene);
        //console.log('完整对象:', info.scene);
       
        // info 是整个信息
    },

    // 激活进入手动看展的动作
    enterAction: name => `gotoscene(${name});`,
    // 手动看展点击前进的动作，写其他动作，不要写场景跳转动作
    toNextAction: name => ``,
    // 手动看展点击后退的动作，写其他动作，不要写场景跳转动作
    toPrevAction: name => ``,
    // 手动看展点击缩略图的动作，写其他动作，不要写场景跳转动作
    toJumpAction: name => ``,
    // 场景切换函数配置 1是走动，2是不走动避免穿墙，3是点击场景缩略图直接跳转，
    // 前进后退默认是1 点击场景缩略图直接跳转默认是3
    typeMap: {
        1: name => `tour3d_loadscene(${name});`,
        2: name => `tour3d_loadscene11(${name});`,
        3: name => `gotoscene(${name});`
    },

    // 数据取自 data_manualview.js
    data: WEP.manualView || []

}