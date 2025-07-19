const uiapp322 = Vue.createApp({
    data() {
        return {
            isMobile: false,
            hoverItem: null,
            activeGroup: 1,
            groups: [[1, 2, 3, 4], [5, 6]],
            items: [
                {
                    id: 1,
                    title1: '导航地图',
                    title2: '导航地图',
                    img1: './ubs/images/icon1.png',
                    img2: './ubs/images/icon1-active.png',
                    action1: 'icon1action1',
                    action2: 'icon1action2',
                    isActive: false,
                    clickCount: 0,
                    hidden: false,  
                },
                {
                    id: 2,
                    title1: '热点列表',
                    title2: '热点列表',
                    img1: './ubs/images/icon2.png',
                    img2: './ubs/images/icon2-active.png',
                    action1: 'icon2action1',
                    action2: 'icon2action2',
                    isActive: false,
                    clickCount: 0,
                    hidden: false,
                },
                {
                    id: 3,
                    title1: '展览路线',
                    title2: '关闭展览路线',
                    img1: './ubs/images/icon3.png',
                    img2: './ubs/images/icon3-active.png',
                    action1: 'icon3action1',
                    action2: 'icon3action2',
                    isActive: false,
                    clickCount: 0,
                    hidden: false,
                },
                {
                    id: 4,
                    title1: '沉浸看展',
                    title2: '沉浸看展',
                    img1: './ubs/images/icon4.png',
                    img2: './ubs/images/icon4-active.png',
                    action1: 'icon4action1',
                    action2: 'icon4action2',
                    isActive: false,
                    clickCount: 0,
                    hidden: false,
                },
                {
                    id: 5,
                    title1: '退出',
                    title2: '退出',
                    img1: './ubs/images/icon5.png',
                    img2: './ubs/images/icon5-active.png',
                    action1: 'icon5action1',
                    action2: 'icon5action2',
                    isActive: false,
                    clickCount: 0,
                    hidden: false,
                },
                {
                    id: 6,
                    title1: '平面地图',
                    title2: '平面地图',
                    img1: './ubs/images/icon6.png',
                    img2: './ubs/images/icon6-active.png',
                    action1: 'icon6action1',
                    action2: 'icon6action2',
                    isActive: false,
                     clickCount: 0,
                    hidden: false,
                }
                // {
                //     id: 7,
                //     title1: '帮助',
                //     title2: '帮助中',
                //     img1: '//example.com/icon7-n.png',
                //     img2: '//example.com/icon7-a.png',
                //     action1: 'showHelp',
                //     action2: 'hideHelp',
                //     isActive: false,
                //     clickCount: 0
                // }
            ]
        }
    },
    computed: {
        group1() {
            return this.items.filter(item =>
                this.groups[0].includes(item.id)
            )
        },
        group2() {
            return this.items.filter(item =>
                this.groups[1].includes(item.id)
            )
        }
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 768
        },
        getItem(id) {
            return this.items.find(item => item.id === id)
        },
        getIcon(item) {
            if (item.isActive) return item.img2
            return this.hoverItem === item.id ? item.img2 : item.img1
        },
        getTitle(item) {
            // 移动端始终返回空字符串
            if (this.isMobile) return ''
            // 桌面端保持原有逻辑
            if (item.isActive) return item.title2
            return this.hoverItem === item.id ? item.title1 : ''
        },
        // 新增：重置分组状态
        resetGroupState() {
            this.items.forEach(item => {
                item.isActive = false
                item.clickCount = 0
            })
        },
        // 新增：选择分组显示
        resetButtonState1(xxx) {
            this.activeGroup = xxx
        },

        // 新增：重置单个按钮状态
        resetButtonState(id) {
            const item = this.items.find(item => item.id === id)
            if (item) {
                item.isActive = false
                item.clickCount = 0
            }
        },
        // 动作1：根据ID隐藏单个图标
    hideIconById(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.hidden = true;
        }
    },

    // 动作2：根据ID显示单个图标
    showIconById(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.hidden = false;
        }
    },

    // 动作3：区分设备类型，手机端运行hideIconById
    hideIconByDevice() {
        if (this.isMobile) {
            this.hideIconById(1); 
            this.hideIconById(2); 
            this.hideIconById(3);// 手机端：隐藏单个图标
            
        } else {
            // 电脑端：隐藏所有按钮（使用之前的方法）
            this.resetButtonState1(0);
        }
    },

    // 动作4：区分设备类型，手机端运行showIconById，电脑端恢复初始状态
    showIconByDevice() {
        if (this.isMobile) {
            this.showIconById(1);
            this.showIconById(2);   
            this.showIconById(3);// 手机端：显示单个图标  
        } else {
            // 电脑端：显示第一组图标
            this.resetButtonState1(1);
        }
   
    },
    // 动作5：只在手机端运行,PC端不运行的动作
    showIconismobile() {
        if (this.isMobile) {
            wepCloseManualView();//手机端关闭，沉浸看展  
        } else {
            
        }
   
    },

        handleAction(item) {
            // 处理分组切换
            if (this.activeGroup === 1 && item.id === 1) {
                this.resetButtonState(2) // 切换到第二组时重置状态
                this.activeGroup = 2
                // 调用 action1 的动作
                if (typeof this[item.action1] === 'function') {
                    this[item.action1](item.id)
                } else {
                    console.error(`未定义的方法: ${item.action1}`)
                }

                return
            }
            if (this.activeGroup === 2 && item.id === 5) {
                this.resetButtonState(6)// 切换到第一组时重置状态
                this.activeGroup = 1

                // 调用 action1 的动作
                if (typeof this[item.action1] === 'function') {
                    this[item.action1](item.id)
                } else {
                    console.error(`未定义的方法: ${item.action1}`)
                }
                return
            }

            // 处理点击状态
            item.clickCount++
            item.isActive = item.clickCount % 2 === 1
            // 获取要执行的动作
            const action = item.isActive ? item.action1 : item.action2

            // 安全执行方法
            if (typeof this[action] === 'function') {
                this[action](item.id)
            } else {
                console.error(`未定义的方法: ${action}`)
            }
        },
        // 以下是全部7个项目的动作方法
        icon1action1(id) {
            
            console.log(`显示首页 (ID: ${id})`)
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call('dollhouse_view();')//js动作调用krpano中的动作
            listvueApp.closePanel();          
            document.querySelector('.button-container1121').style.display = 'flex';

        },
        icon1action2(id) {
            console.log(`隐藏首页 (ID: ${id})`)
        },
        icon2action1(id) {
            console.log(`显示消息 (ID: ${id})`)
            
            listvueApp.togglePanel()
        },
        icon2action2(id) {
            console.log(`隐藏消息 (ID: ${id})`)

            listvueApp.togglePanel()
        },
        icon3action1(id) {
            console.log(`打开设置 (ID: ${id})`)
           
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call(' sp_close')//js动作调用krpano中的动作
        },
        icon3action2(id) {
            console.log(`关闭设置 (ID: ${id})`)
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call(' sp_open()')//js动作调用krpano中的动作
        },
        icon4action1(id) {
           
            console.log(`启用通知 (ID: ${id})`)
            listvueApp.closePanel()
            wepOpenManualView()
            this.hideIconByDevice();  
           
            
        },
        icon4action2(id) {
            console.log(`禁用通知 (ID: ${id})`)
            listvueApp.closePanel()
            wepCloseManualView();
            this.showIconByDevice();
        },
        icon5action1(id) {
            console.log(`开始下载 (ID: ${id})`)
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call('bb();')//js动作调用krpano中的动作
            document.querySelector('.button-container1121').style.display = 'none'
        },
        icon5action2(id) {
            console.log(`停止下载 (ID: ${id})`)
        },
        icon6action1(id) {
            console.log(`添加收藏 (ID: ${id})`)
            wepOpenMap();
            document.querySelector('.button-container1121').style.display = 'none';
        },
        icon6action2(id) {
            console.log(`移除收藏 (ID: ${id})`)
            wepOpenMap();
            document.querySelector('.button-container1121').style.display = 'none';
        },
        icon7action1(id) {
            console.log(`显示帮助 (ID: ${id})`)
           
        },
        icon7action2(id) {
            console.log(`隐藏帮助 (ID: ${id})`)
            

        }
    },
    mounted() {
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile)
    }
})

// 3. 挂载主应用
window.uivueApp322 = uiapp322.mount('#uibox322')

function container1121() {
    document.querySelector('.button-container1121').style.display = 'none',
    window.uivueApp322.resetButtonState1(1); 
    window.uivueApp322.resetButtonState(4);  
    
}



//激活特定按钮   东西午门三个按钮
function activateSingleButton1121(ss) {
    if (ss==1) {
        window.uiunitApp322.activateSingleButton(1);
    } 
    if (ss==2) {
        window.uiunitApp322.activateSingleButton(2);
    } 
    if (ss==3) {
        window.uiunitApp322.activateSingleButton(3);
    } 
    
}

