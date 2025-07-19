// 动态生成内容并插入到 div 中
const listbox323 = `
  <!-- 主控制按钮 -->


        <!-- 热点列表 -->
        <div class="hotspot-container" :class="{active: isVisible}">
            <div class="close-btn" 
                 :class="isMobile ? 'mobile-close' : 'desktop-close'"
                 @click="closePanel"></div>

            <div class="search-box">
                <input type="text" 
                       class="search-input" 
                       placeholder="请输入关键词..."
                       v-model="searchText">
                <div class="search-icon"></div>
            </div>

            <div class="list-container">
                <div v-for="item in filteredList" 
                     :key="item.id"
                     class="list-item"
                     @click="handleClick(item)">
                    {{ item.title }}
                </div>
            </div>
        </div>
`;

document.getElementById('listbox322').innerHTML = listbox323;