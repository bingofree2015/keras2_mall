const UIunit = Vue.createApp({
    data() {
        return {
            activeId: 1,
            hoverId: null,
            isModalOpen: false,
            modalTitle: '',
            itemss: [
                { id: 1, title: '一层', action: 'uiunitaction1' },
                { id: 2, title: '二层', action: 'uiunitaction2' },
                // { id: 3, title: '东雁翅楼', action: 'uiunitaction3' },
            ]
        }
    },
    methods: {
        // 新添加的方法：激活指定ID的按钮，取消其他按钮的激活状态
        activateSingleButton(id) {
            this.activeId = id;
            
        },
        handleClick(item) {
            // 如果当前按钮已经是激活状态，则取消激活
            this.activeId = this.activeId === item.id ? null : item.id
            // 执行按钮的动作
            this[item.action](item.title)
            
        },
        uiunitaction1() {
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call('floor_view1()')//js动作调用krpano中的动作


        },
        uiunitaction2(title) {
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call('floor_view2()')//js动作调用krpano中的动作

        },
        uiunitaction3(title) {
            var krpano = document.getElementById('krpanoSWFObject')
            krpano.call('floor_view3()')//js动作调用krpano中的动作

        },
     
        openModal(title) {
            this.modalTitle = title
            this.isModalOpen = true
        },
        closeModal() {
            this.isModalOpen = false
        }
    }
})

// 3. 挂载主应用
window.uiunitApp322 = UIunit.mount('#uiunit1121')


   