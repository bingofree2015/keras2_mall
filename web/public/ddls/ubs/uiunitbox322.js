// 动态生成内容并插入到 div 中
const content2 = `
 <div class="button-container1121">
          <div 
            v-for="item in itemss"
            :key="item.id"
            class="action-button1121"
            :class="{ active1121: activeId === item.id }"
            @click="handleClick(item)"
            @mouseover="hoverId = item.id"
            @mouseleave="hoverId = null"
          >
            {{ item.title }}
          </div>
        </div>
`;

document.getElementById('uiunit1121').innerHTML = content2;