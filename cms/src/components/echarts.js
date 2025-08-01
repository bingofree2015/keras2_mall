// 引入基本模板
import echarts from 'echarts/lib/echarts';

// 按需引入需要的组件模块 图表类型，标题，提示信息等
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';

// 全局配置优化
echarts.init = function (dom, theme, opts) {
    const defaultOpts = {
        renderer: 'canvas',
        useDirtyRect: true,
        // 减少不必要的重绘
        throttle: 70,
    };

    const finalOpts = Object.assign({}, defaultOpts, opts);
    return echarts.prototype.init.call(this, dom, theme, finalOpts);
};

export default echarts;
