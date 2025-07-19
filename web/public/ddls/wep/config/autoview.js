window.WEP = window.WEP || {}
window.WEP.autoviewConfig = {

    // 调用js函数的名称 - 打开
    jsOpenFnName: 'wepOpenAutoview',
    // 调用js函数的名称 - 关闭 （点击页面右上角的关闭按钮可以关闭，调用这个方法也可以关闭）
    jsCloseFnName: 'wepCloseAutoview',
    // 调用js函数的名称 - 退后，即上一个 调用 wepAVToPrev()
    jsPrevFnName: 'wepAVToPrev',
    // 调用js函数的名称 - 前进，即下一个 调用 wepAVToNext()
    jsNextFnName: 'wepAVToNext',
    // 调用js函数的名称 - 点击某一个讲解点，跳转到某一个讲解点，参数是讲解点索引index，调用 wepAVToJump(index)
    jsJumpFnName: 'wepAVToJump',
    // 调用js函数的名称 - 音频暂停  调用 wepAVAudioPause()
    jsAudioPause: 'wepAVAudioPause',
    // 调用js函数的名称 - 音频播放  调用 wepAVAudioPlay()
    jsAudioPlay: 'wepAVAudioPlay',

    // 打开自动导览之后的回调
    onOpenAutoview: () => {
    },
    // 关闭自动导览之后的回调
    onCloseAutoview: () => {
        container1121();
    },
    // 切换讲解点之后的回调 参数是讲解点的信息
    onChangePoint: (info) => {
        console.log('完整对象:', info);
        // info 是整个信息，可通过 info.id 获取这条数据的id
    },

    // 激活进入沉浸看展的动作
    enterAction: name => `tour3d_loadscene(${name});`,
    // 沉浸看展点击前进的动作，写其他动作，不要写场景跳转动作
    toNextAction: name => ``,
    // 沉浸看展点击后退的动作，写其他动作，不要写场景跳转动作
    toPrevAction: name => ``,
    // 沉浸看展点击缩略图的动作，写其他动作，不要写场景跳转动作
    toJumpAction: name => ``,
    // 场景切换函数配置 1是走动，2是不走动避免穿墙，3是点击场景缩略图直接跳转，
    // 前进后退默认是1 点击场景缩略图直接跳转默认是3
    typeMap: {
        1: name => `tour3d_loadscene(${name});`,
        2: name => `tour3d_loadscene11(${name});`,
        3: name => `gotoscene(${name});`
    },

    // 数据取自 data_hotspot.js
    data: WEP.hotspotData || []

}