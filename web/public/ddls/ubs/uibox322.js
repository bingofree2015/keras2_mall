// 动态生成内容并插入到 div 中
const content1 = `

  <!-- 主控制按钮 -->
         <!-- 桌面端布局 -->
        <template v-if="!isMobile">
            <div class="desktop-group" v-if="activeGroup === 1">
                <div 
                    v-for="item in group1" 
                    :key="item.id"
                    class="icon-item"
                    v-show="!item.hidden" 
                    @click="handleAction(item)"
                    @mouseover="hoverItem = item.id"
                    @mouseleave="hoverItem = null"
                >
                    <img :src="getIcon(item)" class="icon-image" alt="图标">
                    <div class="icon-title">{{ getTitle(item) }}</div>
                </div>
            </div>
            
            <div class="desktop-group" v-if="activeGroup === 2">
                <div 
                    v-for="item in group2" 
                    :key="item.id"
                    class="icon-item"
                    v-show="!item.hidden" 
                    @click="handleAction(item)"
                    @mouseover="hoverItem = item.id"
                    @mouseleave="hoverItem = null"
                >
                    <img :src="getIcon(item)" class="icon-image" alt="图标">
                    <div class="icon-title">{{ getTitle(item) }}</div>
                </div>
            </div>
        </template>

        <!-- 移动端布局 -->
        <template v-if="isMobile">
            <!-- 第一组 -->
            <div class="mobile-group group1-layout" v-if="activeGroup === 1">
                <div class="group1-top-left">
                    <div 
                        v-for="item in [getItem(1), getItem(4)]" 
                        :key="item.id"
                        class="icon-item"
                        v-show="!item.hidden" 
                        @click="handleAction(item)"
                    >
                        <img :src="getIcon(item)" class="icon-image" alt="图标">
                        <div class="icon-title">{{ getTitle(item) }}</div>
                    </div>
                </div>
                
                <div class="group1-bottom-center">
                    <div 
                        v-for="item in [getItem(2), getItem(3)]" 
                        :key="item.id"
                        class="icon-item"
                        v-show="!item.hidden" 
                        @click="handleAction(item)"
                    >
                        <img :src="getIcon(item)" class="icon-image" alt="图标">
                        <div class="icon-title">{{ getTitle(item) }}</div>
                    </div>
                </div>
            </div>

            <!-- 第二组 -->
            <div class="mobile-group group2-layout" v-if="activeGroup === 2">
                <div 
                    v-for="item in group2" 
                    :key="item.id"
                    class="icon-item"
                    v-show="!item.hidden" 
                    @click="handleAction(item)"
                >
                    <img :src="getIcon(item)" class="icon-image" alt="图标">
                    <div class="icon-title">{{ getTitle(item) }}</div>
                </div>
            </div>
        </template>
`;

document.getElementById('uibox322').innerHTML = content1;