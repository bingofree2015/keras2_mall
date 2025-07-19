const listapp = new Vue({
    el: '#listbox322',
    data: {
        isVisible: false, // 初始隐藏状态
        searchText: '',
        isMobile: false,
        items: [
            {id: 1, title: '鹊风图卷（《七月》部分）', scenename: 'scene_32', sceneh: 'H1'},
            {id: 2, title: '雪溪放牧图页', scenename: 'scene_34', sceneh: 'H2'},
            {id: 3, title: '田畿醉归图卷', scenename: 'scene_19', sceneh: 'H3'},
            {id: 4, title: '夏畦时泽图页', scenename: 'scene_56', sceneh: 'H4'},
            {id: 5, title: '归农图轴', scenename: 'scene_45', sceneh: 'H5'},
            {id: 6, title: '农田水车图扇', scenename: 'scene_20', sceneh: 'H6'}
        ]
    },
    computed: {
        filteredList() {
            return this.items.filter(item => 
                item.title.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 767;
        },
        togglePanel() {
            this.isVisible = !this.isVisible; // 切换显示状态
            console.log('关闭面板');
        },
        closePanel() {
            this.isVisible = false; // 只修改状态不切换
            console.log('关闭面板');
            window.uivueApp322.resetButtonState(2);
        },
        handleClick(item) {
            console.log('ID:', item.id);
            console.log('Scene Name:', item.scenename);
            var krpano = document.getElementById("krpanoSWFObject");
            krpano.call(`gotoscene(${item.scenename});`);
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        //WEP.hotspotConfig.setData(this.items)  使用我的数据给WEP.hotspotConfig.setData
        this.items=WEP.hotspotConfig.data//使用WEP.hotspotConfig.setData数据给我用
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkMobile);
    }
});

// 将 Vue 实例挂载到全局对象
window.listvueApp = listapp;