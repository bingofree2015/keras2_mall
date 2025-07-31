import Mock from 'mockjs';

export const getPayData = () => {
    return {
        url: 'cms/report/get_pay_data',
        type: 'post',
        isOpen: true,
        data: {
            succeed: 1,
            code: 200,
            description: '获取成功',
            data: {
                title: {
                    text: '支付统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['支付金额', '支付笔数'],
                    top: 30
                },
                xAxis: {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '金额',
                        position: 'left'
                    },
                    {
                        type: 'value',
                        name: '笔数',
                        position: 'right'
                    }
                ],
                series: [
                    {
                        name: '支付金额',
                        type: 'line',
                        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000],
                        yAxisIndex: 0
                    },
                    {
                        name: '支付笔数',
                        type: 'bar',
                        data: [120, 150, 180, 220, 250, 280, 320],
                        yAxisIndex: 1
                    }
                ]
            }
        }
    };
}; 