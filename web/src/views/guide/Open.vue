<template>
  <div class="open-page">
    <div class="open-tabs-layout">
      <el-tabs v-model="activeTab" tab-position="left" class="open-tabs" stretch>
        <el-tab-pane
          v-for="item in features"
          :key="item.anchor"
          :label="customTabLabel(item)"
          :name="item.anchor"
        >
          <div class="open-detail-section">
            <h2>{{ item.title }}</h2>
            <div class="open-detail-desc">{{ item.desc }}</div>
            <div class="open-detail-content" v-html="item.detailHtml"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="open-announcement open-announcement-side">
        <div class="announcement-title">开放公告</div>
        <ul class="announcement-list">
          <li v-for="(notice, i) in notices" :key="i">
            <div class="notice-title">{{ notice.title }}</div>
            <div class="notice-desc">{{ notice.desc }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import icoTime from '@/assets/guide/ico-time.png'
import icoTicket from '@/assets/guide/ico-ticket.png'
import icoMap from '@/assets/guide/ico-map.png'
import icoTraffic from '@/assets/guide/ico-traffic.png'
import icoPanorama from '@/assets/guide/ico-panorama.png'
import icoNotice from '@/assets/guide/ico-notice.png'

const features = [
  {
    icon: icoTime,
    title: '开放时间',
    desc: '了解纪念馆开放时间，合理安排行程，避免错过精彩展览。',
    anchor: 'open-time',
    detailHtml: `<div>西藏革命纪念馆全年分为旺季和淡季开放，具体时间安排如下：<br><br>
      <b>旺季（4月1日-10月31日）：</b> 8:30-17:00（16:10停止入场，16:30清场）。<br>
      <b>淡季（11月1日-次年3月31日）：</b> 8:30-16:30（15:40停止入场，16:00清场）。<br>
      <b>每周一闭馆（法定节假日除外）。</b><br><br>
      请观众合理安排参观时间，建议提前15分钟到达检票口，避免因高峰期排队影响入馆体验。节假日及特殊活动期间，开放时间可能会有调整，具体以官网公告为准。纪念馆倡导文明参观，入馆后请遵守相关规定，配合安检和工作人员指引。<br><br>
      纪念馆为观众提供了舒适的参观环境，馆内设有休息区、饮水点及无障碍设施。请关注馆内指示标识，合理规划参观路线，享受一次愉快的文化之旅。</div>`
  },
  {
    icon: icoTicket,
    title: '在线订票',
    desc: '提前预约门票，享受便捷入馆体验，支持多种购票渠道。',
    anchor: 'ticket',
    detailHtml: `<div>西藏革命纪念馆实行实名制预约参观，观众可通过官方网站、官方微信公众号或小程序提前订票。每位观众需凭有效身份证件进行预约，每日门票数量有限，建议提前规划行程。<br><br>
      购票流程简便，支持多种支付方式。预约成功后，观众需在预约时段内到馆，凭预约二维码和身份证件入馆。未成年人、老年人等特殊群体可享受相应优惠政策，具体以馆方公告为准。<br><br>
      请勿通过非官方渠道购票，防止上当受骗。入馆时请配合安检，遵守参观秩序。若因特殊原因无法按时参观，请及时在预约平台取消订单，将参观机会让给其他观众。<br><br>
      纪念馆为观众提供了完善的票务服务，如有疑问可咨询现场服务台或拨打客服电话。</div>`
  },
  {
    icon: icoMap,
    title: '导览地图',
    desc: '多种主题路线推荐，纸质与电子地图随心选，助力高效参观。',
    anchor: 'map',
    detailHtml: `<div>为方便观众高效参观，西藏革命纪念馆提供多种导览地图和路线推荐。观众可在馆内服务台免费领取纸质导览图，或通过官方网站、微信小程序获取电子地图。<br><br>
      馆内设有多条主题参观路线，包括“历史沿革”、“革命文物”、“专题展览”等，适合不同兴趣和时间安排的观众。每条路线均有详细指引，帮助观众深入了解展品背后的故事。<br><br>
      馆内还配备了多语种语音导览设备，支持普通话、藏语、英语等，方便不同背景的观众使用。建议观众根据自身需求选择合适的路线和导览方式，提升参观体验。<br><br>
      如需帮助，可随时向馆内工作人员咨询。</div>`
  },
  {
    icon: icoTraffic,
    title: '交通路线',
    desc: '多种交通方式直达纪念馆，绿色出行更环保。',
    anchor: 'traffic',
    detailHtml: `<div>西藏革命纪念馆位于市区交通便利地段，建议观众优先选择公共交通工具前来。可乘坐地铁1号线、2号线或多条公交线路直达纪念馆周边。<br><br>
      馆区周边无专用停车场，驾车观众请提前规划停车方案，或选择附近公共停车场。为绿色出行，纪念馆鼓励观众步行、骑行或乘坐公共交通。<br><br>
      馆区设有明显的交通指示标识，方便观众快速找到入口。高峰时段建议提前出发，避免因交通拥堵耽误参观时间。<br><br>
      如遇特殊天气或交通管制，请关注纪念馆官网和官方微信的最新公告。</div>`
  },
  {
    icon: icoPanorama,
    title: '全景故宫',
    desc: '足不出户畅游纪念馆，体验沉浸式数字展厅。',
    anchor: 'panorama',
    detailHtml: `<div>西藏革命纪念馆推出全景数字展厅，观众可通过官方网站、微信小程序等平台，随时随地在线参观纪念馆。全景展厅采用高精度拍摄技术，真实还原展馆环境和展品细节，带来沉浸式的数字体验。<br><br>
      观众可自由切换展厅视角，浏览各类展品信息，了解展览背后的历史故事。全景平台还支持多媒体讲解、互动问答等功能，适合无法到现场的观众远程参观。<br><br>
      数字展厅不断更新内容，涵盖常设展览、临时展览及专题活动。欢迎广大观众关注纪念馆数字平台，体验科技与文化的完美结合。<br><br>
      如有技术问题或建议，可通过官网反馈。</div>`
  },
  {
    icon: icoNotice,
    title: '参观须知',
    desc: '遵守参观须知，文明观展，保障自身与他人安全。',
    anchor: 'notice',
    detailHtml: `<div>为保障所有观众的参观安全与体验，西藏革命纪念馆制定了详细的参观须知。请观众自觉遵守馆内规定，文明观展，勿携带易燃易爆等违禁物品入馆。<br><br>
      参观过程中请勿大声喧哗、追逐打闹，保持展厅安静有序。请勿触摸展品，爱护公共设施。馆内禁止吸烟，部分区域禁止饮食。<br><br>
      如遇紧急情况，请听从工作人员指挥，按指定路线有序疏散。纪念馆为特殊群体提供无障碍服务，如有需要可提前联系工作人员。<br><br>
      观众如有疑问或需要帮助，可随时咨询服务台。让我们共同营造文明、和谐的参观环境。</div>`
  },
]
const notices = [
  { title: '故宫博物院2025年暑假期间未成年人团队快速预约、检票措施', desc: '1.由独立法人机构组织的、未成年人占比85%以上的团队，可提前1-6日通过邮箱yycg@dpm.org.cn进行团队未成年人门票快速预约...' },
  { title: '关于关闭寿康宫正殿展厅的公告', desc: '根据故宫原状展室文物保护养护需要，2025年6月17日至6月19日期间关闭寿康宫正殿展厅进行保养...' },
  { title: '大高玄殿“腾跃古今——马文化数字艺术展”开放', desc: '“腾跃古今——马文化数字艺术展”2025年6月3日在大高玄殿数字馆开幕...' }
]
const activeTab = ref(features[0].anchor)

function customTabLabel(item) {
  return h('span', { class: 'tab-label' }, [
    h('img', { src: item.icon, class: 'tab-icon', alt: item.title }),
    h('span', { class: 'tab-text' }, item.title)
  ])
}
</script>

<style scoped>
.open-page {
  background: #f8f6f2;
  min-height: 80vh;
  padding: 0 0 48px 0;
}
.open-tabs-layout {
  display: flex;
  gap: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
  margin: 40px auto 0 auto;
}
.open-tabs {
  flex: 2;
  min-width: 0;
}
.tab-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
.tab-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.tab-text {
  font-size: 16px;
  font-weight: bold;
}
.open-announcement-side {
  flex: 1;
  background: #a94442;
  color: #fff;
  border-radius: 10px;
  padding: 24px 18px;
  min-width: 320px;
  max-width: 340px;
  height: fit-content;
}
.announcement-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
  letter-spacing: 2px;
}
.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.notice-title {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
}
.notice-desc {
  font-size: 0.95rem;
  color: #ffe;
  margin-bottom: 16px;
}
.open-detail-section {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 0;
  padding: 8px 0px 2px 24px;
}
.open-detail-section h2 {
  color: #7c4a03;
  font-size: 1.3rem;
  margin-bottom: 8px;
}
.open-detail-desc {
  color: #a67c52;
  font-size: 1.05rem;
  margin-bottom: 12px;
  line-height: 1.7;
}
.open-detail-content {
  color: #444;
  font-size: 1.08rem;
  line-height: 1.8;
}
:deep(.el-tabs--left .el-tabs__nav .el-tabs__item) {
  margin-bottom: 4px;
}
</style>
