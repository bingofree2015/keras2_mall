<template>
    <div class="page-container">
        <!-- 导航与工具栏 -->
        <el-row class="top-row">
            <el-col class="content-fit">
                <bread-crumb />
            </el-col>
            <el-col class="top-bar flex-grow" />
        </el-row>
        <el-row :gutter="20">
            <el-col
                :span="8"
                class="page-column"
            >
                <el-card>
                    <template #header>
                        <div>
                            <span>组件库</span>
                        </div>
                    </template>
                    <!-- 组件库 -->
                    <el-collapse v-model="activeNames">
                        <el-collapse-item
                            name="1"
                            title="媒体组件"
                        >
                            title="媒体组件"
                            >
                            :list="mediaComponents"
                            :options="componentOpts"
                            class="component-group"
                            @end="isDragging = false"
                            element="ul"
                            @start="isDragging = true"
                            >
                            <li
                                v-for="(item, index) in mediaComponents"
                                :key="index"
                                class="component-item"
                            >
                                <el-card shadow="hover">
                                    <i :class="item.icon"></i>
                                    <div>{{ item.name }}</div>
                                </el-card>
                            </li>
                            </draggable>
                        </el-collapse-item>
                        <el-collapse-item
                            name="2"
                            title="商城组件"
                        >
                            title="商城组件"
                            >
                            :list="storeComponents"
                            :options="componentOpts"
                            class="component-group"
                            @end="isDragging = false"
                            element="ul"
                            @start="isDragging = true"
                            >
                            <li
                                v-for="(item, index) in storeComponents"
                                :key="index"
                                class="component-item"
                            >
                                <el-card shadow="hover">
                                    <i :class="item.icon"></i>
                                    <div>{{ item.name }}</div>
                                </el-card>
                            </li>
                            </draggable>
                        </el-collapse-item>
                        <el-collapse-item
                            name="3"
                            title="工具组件"
                        >
                            title="工具组件"
                            >
                            :list="utilsComponents"
                            :options="componentOpts"
                            class="component-group"
                            @end="isDragging = false"
                            element="ul"
                            @start="isDragging = true"
                            >
                            <li
                                v-for="(item, index) in utilsComponents"
                                :key="index"
                                class="component-item"
                            >
                                <el-card shadow="hover">
                                    <i :class="item.icon"></i>
                                    <div>{{ item.name }}</div>
                                </el-card>
                            </li>
                            </draggable>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
            <el-col
                :span="8"
                class="page-column"
            >
                <el-card>
                    <template #header>
                        <div>
                            <span>工作区</span>
                        </div>
                    </template>
                    <!-- 工作区 -->
                    <draggable
                        v-model="pageWidgets"
                        :class="{ 'widget-empty': pageWidgets.length === 0 }"
                        :options="widgetOpts"
                        class="widget-container clearfix"
                        @add="handleAddWidget"
                        @end="isDragging = false"
                        @start="isDragging = true"
                    >
                        <template v-for="(item, index) in pageWidgets">
                            <!-- 购买记录 -->
                            <div
                                v-if="item && item.type === 'record'"
                                :key="index"
                                :class="[item.config.style.align, 'record']"
                                :style="{ top: item.config.style.top + '%' }"
                                @click="handleSelectWidget(index)"
                            >
                                <i class="el-icon-ali-message"></i>
                                <span>xxx刚刚0.01元买到了xxx</span>
                                <i
                                    class="el-icon-ali-delete1"
                                    @click.stop="handleDeleteWidget(index)"
                                ></i>
                            </div>

                            <div
                                v-else
                                :key="index"
                                class="widget-item"
                                @click="handleSelectWidget(index)"
                            >
                                <!--<div>index:{{index}} editWidget.idx:{{editWidget?editWidget.idx:0}}</div>-->
                                <el-button-group
                                    v-if="
                                        editWidget &&
                                            editWidget.idx === index &&
                                            editWidget.type !== 'record'
                                    "
                                >
                                    <el-button
                                        :size="miniSize"
                                        round
                                        type="primary"
                                        @click="handleCloneWidget(index)"
                                    >
                                        <i class="el-icon-ali-fuzhi2"></i>
                                    </el-button>
                                    <el-button
                                        :size="miniSize"
                                        round
                                        type="danger"
                                        @click="handleDeleteWidget(index)"
                                    >
                                        <i class="el-icon-ali-delete"></i>
                                    </el-button>
                                </el-button-group>
                                <!-- 搜索框 -->
                                <van-search
                                    v-if="item && item.type === 'search'"
                                    v-model="item.config.keywords"
                                    :shape="item.config.style"
                                    placeholder="请输入搜索关键词"
                                    show-action
                                >
                                    <template #action>
                                        <div>
                                            搜索
                                        </div>
                                    </template>
                                </van-search>
                                <!-- 商品组 -->
                                <div
                                    v-if="item && item.type === 'goods'"
                                    class="widget-inner-container"
                                >
                                    <div class="title">
                                        {{ item.config.title }}
                                        <el-link
                                            v-if="item.config.more"
                                            class="goods-more"
                                        >
                                            <i class="el-icon-ali-s_ic_more"></i>
                                        </el-link>
                                    </div>
                                    <van-grid
                                        v-if="item.config.display === 'list'"
                                        :column-num="item.config.column"
                                        :gutter="10"
                                    >
                                        <van-grid-item
                                            v-for="(goodsItem, key) in item.config.list"
                                            :key="key"
                                        >
                                            <van-image
                                                :src="
                                                    env.getImgUrl(goodsItem.url, env.baseAssetsUrl)
                                                "
                                            />
                                            <p class="goods-item-title">
                                                {{ goodsItem.name || '商品名称' }}
                                            </p>
                                            <p class="goods-item-price">
                                                {{ (goodsItem && goodsItem.price) || '99.00' }}
                                            </p>
                                        </van-grid-item>
                                    </van-grid>
                                    <el-carousel
                                        v-else-if="item.config.display === 'slide'"
                                        :interval="5000"
                                        arrow="always"
                                        height="150px"
                                    >
                                        <el-carousel-item
                                            v-for="(offset, key) in Math.ceil(
                                                item.config.list.length / item.config.column
                                            )"
                                            :key="key"
                                        >
                                            <van-grid
                                                :column-num="item.config.column"
                                                :gutter="10"
                                            >
                                                :gutter="10"
                                                >
                                                <template
                                                    v-if="
                                                        item.config.list[
                                                            (offset - 1) * item.config.column +
                                                            (i - 1)
                                                        ]
                                                    "
                                                >
                                                    <van-grid-item
                                                        v-for="i in item.config.column"
                                                        :key="key + '_' + i"
                                                    >
                                                        <van-image
                                                            :src="
                                                                env.getImgUrl(
                                                                    item.config.list[
                                                                        (offset - 1) *
                                                                        item.config.column +
                                                                        (i - 1)
                                                                    ].url,
                                                                    env.baseAssetsUrl
                                                                )
                                                            "
                                                        />
                                                    </van-grid-item>
                                                </template>
                                            </van-grid>
                                        </el-carousel-item>
                                    </el-carousel>
                                </div>
                                <!-- 团购秒杀 -->
                                <van-panel
                                    v-if="item && item.type === 'groupPurchase'"
                                    :title="item.config.title"
                                >
                                    <el-carousel
                                        :interval="5000"
                                        arrow="always"
                                        height="150px"
                                    >
                                        <el-carousel-item
                                            v-for="(groupPurchaseItem, key) in item.config.list"
                                            :key="key"
                                        >
                                            <van-row>
                                                <van-col span="8">
                                                    <van-image
                                                        :src="
                                                            env.getImgUrl(
                                                                groupPurchaseItem.url,
                                                                env.baseAssetsUrl
                                                            )
                                                        "
                                                    />
                                                </van-col>
                                                <van-col span="16">
                                                    <p>{{ groupPurchaseItem.name }}</p>
                                                    <p>{{ groupPurchaseItem.price }}</p>
                                                </van-col>
                                            </van-row>
                                        </el-carousel-item>
                                    </el-carousel>
                                </van-panel>
                                <!-- 图片轮播 -->
                                <van-swipe
                                    v-if="item && item.type === 'imgSlide'"
                                    :autoplay="3000"
                                    :duration="item.config.duration"
                                >
                                    <van-swipe-item
                                        v-for="(imgSlideItem, key) in item.config.list"
                                        :key="key"
                                    >
                                        <van-image
                                            :src="
                                                env.getImgUrl(imgSlideItem.url, env.baseAssetsUrl)
                                            "
                                            fit="contain"
                                        />
                                    </van-swipe-item>
                                </van-swipe>
                                <!-- 单图组 -->
                                <div
                                    v-if="item && item.type === 'imgSingle'"
                                    class="widget-inner-container"
                                >
                                    <van-image
                                        :src="env.getImgUrl(item.config.url, env.baseAssetsUrl)"
                                        fit="contain"
                                    />
                                </div>
                                <!-- 图片橱窗 -->
                                <div
                                    v-if="item && item.type === 'imgWindow'"
                                    class="widget-inner-container"
                                >
                                    <template v-if="item.config.style == 5">
                                        <!--页面布局为 1左3右 -->
                                        <van-row :gutter="item.config.margin">
                                            <van-col :span="12">
                                                <van-image
                                                    :src="
                                                        env.getImgUrl(
                                                            item.config.list[0]
                                                                ? item.config.list[0].url
                                                                : '',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                    fit="contain"
                                                />
                                            </van-col>
                                            <van-col :span="12">
                                                <van-row :gutter="item.config.margin">
                                                    <van-col :span="24">
                                                        <van-image
                                                            :src="
                                                                env.getImgUrl(
                                                                    item.config.list[1]
                                                                        ? item.config.list[1].url
                                                                        : '',
                                                                    env.baseAssetsUrl
                                                                )
                                                            "
                                                            fit="contain"
                                                        />
                                                    </van-col>
                                                </van-row>
                                                <van-row :gutter="item.config.margin">
                                                    <van-col :span="12">
                                                        <van-image
                                                            :src="
                                                                env.getImgUrl(
                                                                    item.config.list[2]
                                                                        ? item.config.list[2].url
                                                                        : '',
                                                                    env.baseAssetsUrl
                                                                )
                                                            "
                                                            fit="contain"
                                                        />
                                                    </van-col>
                                                    <van-col :span="12">
                                                        <van-image
                                                            :src="
                                                                env.getImgUrl(
                                                                    item.config.list[3]
                                                                        ? item.config.list[3].url
                                                                        : '',
                                                                    env.baseAssetsUrl
                                                                )
                                                            "
                                                            fit="contain"
                                                        />
                                                    </van-col>
                                                </van-row>
                                            </van-col>
                                        </van-row>
                                    </template>
                                    <template v-else>
                                        <!-- 1行2个; 1行3个; 1行4个 -->
                                        <van-row :gutter="item.config.margin">
                                            <van-col
                                                v-for="(imgWindowItem, key) in item.config.list"
                                                :key="key"
                                                :span="24 / item.config.style"
                                            >
                                                <van-image
                                                    :src="
                                                        env.getImgUrl(
                                                            imgWindowItem.url,
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                    fit="contain"
                                                />
                                            </van-col>
                                        </van-row>
                                    </template>
                                </div>
                                <!-- 视频组 -->
                                <div
                                    v-if="item && item.type === 'video'"
                                    class="widget-inner-container"
                                >
                                    <video
                                        :autoplay="item.config.autoplay"
                                        :poster="env.getImgUrl(item.config.url, env.baseAssetsUrl)"
                                        :src="item.config.videoUrl"
                                        controls="controls"
                                        style="width: 100%; height: 100%; object-fit: fill"
                                    ></video>
                                </div>
                                <!-- 文章组 -->
                                <div
                                    v-if="item && item.type === 'article'"
                                    class="widget-inner-container"
                                >
                                    <van-row :gutter="8">
                                        <van-col
                                            class="title"
                                            span="16"
                                        >
                                            span="16"
                                            >
                                            {{ item.config.title || '文章标题' }}
                                        </van-col>
                                        <van-col span="8">
                                            <van-image
                                                :src="
                                                    env.getImgUrl(
                                                        item.config.url,
                                                        env.baseAssetsUrl
                                                    )
                                                "
                                                alt
                                                fit="contain"
                                            />
                                        </van-col>
                                    </van-row>
                                </div>
                                <!-- 文章分类 -->
                                <div
                                    v-if="item && item.type === 'articleClassify'"
                                    class="widget-inner-container"
                                >
                                    <van-row
                                        v-for="(articleItem, key) in item.config.limit"
                                        :key="key"
                                        :gutter="8"
                                    >
                                        <van-col
                                            class="title"
                                            span="16"
                                        >
                                            文章标题
                                        </van-col>
                                        <van-col span="8">
                                            <van-image
                                                :src="env.getImgUrl('', env.baseAssetsUrl)"
                                                alt
                                                fit="contain"
                                            />
                                        </van-col>
                                    </van-row>
                                </div>
                                <!-- 公告组 -->
                                <div
                                    v-if="item && item.type === 'notice'"
                                    class="widget-inner-container"
                                >
                                    <van-cell
                                        v-for="(noticeItem, key) in item.config.list"
                                        :key="key"
                                    >
                                        <van-notice-bar
                                            :text="noticeItem.title"
                                            left-icon="volume-o"
                                        />
                                    </van-cell>
                                </div>
                                <!-- 优惠券组 -->
                                <div
                                    v-if="item && item.type === 'coupon'"
                                    class="widget-inner-container"
                                >
                                    <van-cell
                                        v-for="i in item.config.limit"
                                        :key="i"
                                        class="coupon"
                                    >
                                        <van-row
                                            :gutter="8"
                                            justify="center"
                                            type="flex"
                                        >
                                            <van-col
                                                class="coupon-left"
                                                span="5"
                                            >
                                                span="5"
                                                >
                                                <p>满300减30</p>
                                            </van-col>
                                            <van-col span="19">
                                                <div class="coupon-middle">
                                                    <b>订单减1.44元 减100元</b>
                                                    <p>购买订单满2元</p>
                                                    <p>2019-05-01 - 2019-05-31</p>
                                                </div>
                                                <div class="coupon-right">
                                                    立即领取
                                                </div>
                                            </van-col>
                                        </van-row>
                                    </van-cell>
                                </div>
                                <!-- 导航组 -->
                                <van-grid
                                    v-if="item && item.type === 'navBar'"
                                    :column-num="item.config.column"
                                    :gutter="10"
                                >
                                    <van-grid-item
                                        v-for="(navBarItem, key) in item.config.list"
                                        :key="key"
                                    >
                                        <van-image
                                            :src="env.getImgUrl(navBarItem.url, env.baseAssetsUrl)"
                                            round
                                        />
                                        <p>{{ navBarItem.text || '名称' }}</p>
                                    </van-grid-item>
                                </van-grid>
                                <!-- 辅助空白 -->
                                <div
                                    v-if="item && item.type === 'blank'"
                                    class="widget-inner-container"
                                >
                                    <div
                                        :style="{
                                            height: item.config.height + 'px',
                                            backgroundColor: item.config.backgroundColor,
                                            margin: '10px 5px',
                                        }"
                                    ></div>
                                </div>
                                <!-- 文本域 -->
                                <div
                                    v-if="item && item.type === 'textarea'"
                                    class="widget-inner-container"
                                >
                                    <div
                                        id="textarea-container"
                                        style="width: 100%; min-height: 48px; overflow: hidden"
                                        v-html="item.config"
                                    ></div>
                                </div>
                            </div>
                        </template>
                    </draggable>
                </el-card>
            </el-col>
            <el-col
                :span="8"
                class="page-column"
            >
                <el-card
                    v-if="editWidget && Object.keys(editWidget).length > 0"
                    class="properties-container"
                >
                    <template #header>
                        <div>
                            <span>{{ editWidget.name }}</span>
                        </div>
                    </template>
                    <!-- 属性设置 -->
                    <el-form
                        ref="form"
                        :size="miniSize"
                        label-position="right"
                        label-width="80px"
                    >
                        <!-- 团购秒杀 -->
                        <template v-if="editWidget.type == 'groupPurchase'">
                            <draggable
                                :list="editWidget.config.list"
                                :options="{
                                    group: { name: 'goodsList' },
                                    ghostClass: 'draggable-ghost',
                                    animation: 150,
                                }"
                                element="ul"
                            >
                                <li
                                    v-for="(goods, key) in editWidget.config.list"
                                    :key="key"
                                    :class="['goods-list-item']"
                                >
                                    <slot :goods="goods">
                                        <i
                                            class="el-icon-ali-delete item-delete goods-delete"
                                            @click.stop="
                                                deleteEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    key
                                                )
                                            "
                                        ></i>
                                        <img
                                            :src="env.getImgUrl(goods.url, env.baseAssetsUrl)"
                                            alt
                                        />
                                    </slot>
                                </li>
                                <template #footer>
                                    <div class="drag-footer">
                                        <pick-goods
                                            :selection-type="1"
                                            @chosed-goods="
                                                (goods) => {
                                                    addGoodsConfigListItem(
                                                        editWidget.config.list,
                                                        goods
                                                    );
                                                }
                                            "
                                        />
                                    </div>
                                </template>
                            </draggable>
                            <el-form-item label="活动名称">
                                <el-input v-model="editWidget.config.title" />
                            </el-form-item>
                            <el-form-item label="显示数量">
                                <el-input-number
                                    v-model="editWidget.config.limit"
                                    :max="5"
                                    :min="1"
                                    controls-position="right"
                                />
                            </el-form-item>
                        </template>

                        <!-- 优惠券组 -->
                        <template v-if="editWidget.type == 'coupon'">
                            <el-form-item label="显示数量">
                                <el-input-number
                                    v-model="editWidget.config.limit"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                />
                            </el-form-item>
                        </template>

                        <!-- 购买记录 -->
                        <template v-if="editWidget.type == 'record'">
                            <el-form-item label="位置">
                                <el-radio-group v-model="editWidget.config.style.align">
                                    <el-radio value="left">
                                        居左
                                    </el-radio>
                                    <el-radio value="right">
                                        居右
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="上边距">
                                <el-slider
                                    v-model="editWidget.config.style.top"
                                    :max="100"
                                    :min="0"
                                />
                                <span>{{ editWidget.config.style.top }}%</span>
                            </el-form-item>
                        </template>

                        <!-- 文本域 -->
                        <template v-if="editWidget.type == 'textarea'">
                            <tinyEditor v-model:content="editWidget.config" />
                        </template>

                        <!-- 图片橱窗 -->
                        <template v-if="editWidget.type == 'imgWindow'">
                            <el-form-item label="布局方式">
                                <el-row>
                                    <el-col :span="24">
                                        <el-radio-group
                                            v-model="editWidget.config.style"
                                            :size="miniSize"
                                            class="img-window-list"
                                            fill="#fff"
                                            text-color="#000"
                                        >
                                            <el-radio-button
                                                v-for="item in imgWindowStyle"
                                                :key="item.style"
                                                :label="item.style"
                                            >
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(item.url, env.baseAssetsUrl)
                                                    "
                                                    fit="contain"
                                                />
                                                <span>{{ item.value }}</span>
                                            </el-radio-button>
                                        </el-radio-group>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="图片间距">
                                v-model="editWidget.config.margin" />
                                <draggable
                                    :list="editWidget.config.list"
                                    :options="{
                                        group: { name: 'slideList' },
                                        ghostClass: 'draggable-ghost',
                                        animation: 150,
                                    }"
                                    element="el-collapse"
                                >
                                    <el-collapse-item
                                        v-for="(item, key) in editWidget.config.list"
                                        :key="key"
                                        :name="item.name"
                                    >
                                        <template #title>
                                            <i
                                                class="el-icon-ali-delete item-delete"
                                                @click.stop="
                                                    deleteEditWidgetConfigListItem(
                                                        editWidget.config.list,
                                                        key
                                                    )
                                                "
                                            ></i>
                                            <span style="padding: 0px 8px">第 {{ key + 1 }} 张图</span>
                                        </template>
                                        <change-image-icon
                                            :img-url="item.url"
                                            :init-style="{
                                                width: '100%',
                                                border: '1px dashed #d9d9d9',
                                                borderRadius: '4px',
                                            }"
                                            @chosed-image-icon="
                                                (img) => {
                                                    chosedImage(item, img);
                                                }
                                            "
                                        />
                                        <el-form-item label="类型">
                                            <el-select
                                                v-model="item.type"
                                                placeholder="请选择"
                                            >
                                                placeholder="请选择"
                                                >
                                                :key="linkType.key"
                                                :label="linkType.value"
                                                v-for="linkType in linkTypes"
                                                :value="linkType.key"
                                                />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="指向">
                                            <el-input
                                                v-model="item.value"
                                                placeholder="请选择"
                                            >
                                                <template #append>
                                                    <pick-goods
                                                        v-if="item.type === 2"
                                                        :selection-type="0"
                                                        @chosed-goods="(goods) => { chosedGoods(item, goods); }"
                                                    />
                                                    <pick-article
                                                        v-else-if="item.type === 3"
                                                        :selection-type="0"
                                                        @chosed-articles="(articles) => { chosedArticles(item, 'value', articles, 'id'); }"
                                                    />
                                                    <pick-articleType
                                                        v-else-if="item.type === 4"
                                                        :selection-type="0"
                                                        @chosed-article-types="(articleTypes) => { chosedArticleTypes(item, 'value', articleTypes); }"
                                                    />
                                                    <pick-form
                                                        v-else-if="item.type === 5"
                                                        :selection-type="0"
                                                        @chosed-forms="(forms) => { chosedForms(item, forms); }"
                                                    />
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </el-collapse-item>
                                    <template #footer>
                                        <div class="drag-footer">
                                            <el-button
                                                :size="miniSize"
                                                round
                                                type="primary"
                                                @click="
                                                    addEditWidgetConfigListItem(
                                                        editWidget.config.list,
                                                        'imgWindow'
                                                    )
                                                "
                                            >
                                                <i class="el-icon-ali-add"></i> 添加
                                            </el-button>
                                        </div>
                                    </template>
                                </draggable>
                            </el-form-item>
                        </template>

                        <!-- 视频组 -->
                        <template v-if="editWidget.type == 'video'">
                            <el-form-item label="自动播放">
                                <el-switch
                                    v-model="editWidget.config.autoplay"
                                    active-color="#13ce66"
                                    active-value="true"
                                    inactive-color="#ff4949"
                                    inactive-value="false"
                                />
                            </el-form-item>
                            <el-form-item label="视频封面">
                                <change-image-icon
                                    :img-url="editWidget.config.url"
                                    :init-style="{
                                        width: '100%',
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: '4px',
                                    }"
                                    @chosed-image-icon="
                                        (img) => {
                                            chosedImage(editWidget.config, img);
                                        }
                                    "
                                />
                            </el-form-item>
                            <el-form-item label="视频地址">
                                <pick-video v-model="editWidget.config.videoUrl" />
                            </el-form-item>
                        </template>

                        <!-- 文章组 -->
                        <template v-if="editWidget.type == 'article'">
                            <el-form-item label="添加文章">
                                <el-input
                                    v-model="editWidget.config.title"
                                    placeholder="请选择广告文章"
                                >
                                    <pick-article
                                        #append
                                        :selection-type="0"
                                        @chosed-articles="
                                            (articles) => {
                                                chosedArticles(
                                                    editWidget.config,
                                                    'title',
                                                    articles,
                                                    'title'
                                                );
                                            }
                                        "
                                    />
                                </el-input>
                            </el-form-item>
                        </template>

                        <!-- 文章分类 -->
                        <template v-if="editWidget.type == 'articleClassify'">
                            <el-form-item label="文章分类">
                                <el-input
                                    v-model="editWidget.config.articleClassifyId"
                                    placeholder="请选择文章分类"
                                >
                                    <pick-articleType
                                        #append
                                        :selection-type="0"
                                        @chosed-article-types="
                                            (articleTypes) => {
                                                chosedArticleTypes(
                                                    editWidget.config,
                                                    'articleClassifyId',
                                                    articleTypes
                                                );
                                            }
                                        "
                                    />
                                </el-input>
                            </el-form-item>
                            <el-form-item label="显示数量">
                                <el-input-number
                                    v-model="editWidget.config.limit"
                                    :max="5"
                                    :min="1"
                                    controls-position="right"
                                />
                            </el-form-item>
                        </template>

                        <!-- 搜索框 -->
                        <template v-if="editWidget.type == 'search'">
                            <el-form-item label="提示内容">
                                <el-input
                                    v-model="editWidget.config.keywords"
                                    :placeholder="editWidget.placeholder"
                                />
                            </el-form-item>
                            <el-form-item label="样式">
                                <el-radio-group v-model="editWidget.config.style">
                                    <el-radio value="square">
                                        方形
                                    </el-radio>
                                    <el-radio value="round">
                                        圆弧
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>

                        <!-- 轮播图 -->
                        <template v-if="editWidget.type == 'imgSlide'">
                            <el-form-item label="切换时间">
                                <el-input-number
                                    v-model="editWidget.config.duration"
                                    :max="10000"
                                    :min="1"
                                    controls-position="right"
                                />
                            </el-form-item>

                            <draggable
                                :list="editWidget.config.list"
                                :options="{
                                    group: { name: 'slideList' },
                                    ghostClass: 'draggable-ghost',
                                    animation: 150,
                                }"
                                element="el-collapse"
                            >
                                <el-collapse-item
                                    v-for="(item, key) in editWidget.config.list"
                                    :key="key"
                                    :name="item.name"
                                >
                                    <template #title>
                                        <i
                                            class="el-icon-ali-delete item-delete"
                                            @click.stop="
                                                deleteEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    key
                                                )
                                            "
                                        ></i>
                                        <span style="padding: 0px 8px">第 {{ key + 1 }} 张图</span>
                                    </template>
                                    <change-image-icon
                                        :img-url="item.url"
                                        :init-style="{
                                            width: '100%',
                                            border: '1px dashed #d9d9d9',
                                            borderRadius: '4px',
                                        }"
                                        @chosed-image-icon="
                                            (img) => {
                                                chosedImage(item, img);
                                            }
                                        "
                                    />
                                    <el-form-item label="类型">
                                        <el-select
                                            v-model="item.type"
                                            placeholder="请选择"
                                        >
                                            placeholder="请选择"
                                            >
                                            v-for="linkType in linkTypes"
                                            :key="linkType.key"
                                            :label="linkType.value"
                                            :value="linkType.key"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="指向">
                                        <el-input
                                            v-model="item.value"
                                            placeholder="请选择"
                                        >
                                            <template #append>
                                                <pick-goods
                                                    v-if="item.type === 2"
                                                    :selection-type="0"
                                                    @chosed-goods="(goods) => { chosedGoods(item, goods); }"
                                                />
                                                <pick-article
                                                    v-else-if="item.type === 3"
                                                    :selection-type="0"
                                                    @chosed-articles="(articles) => { chosedArticles(item, 'value', articles, 'id'); }"
                                                />
                                                <pick-articleType
                                                    v-else-if="item.type === 4"
                                                    :selection-type="0"
                                                    @chosed-article-types="(articleTypes) => { chosedArticleTypes(item, 'value', articleTypes); }"
                                                />
                                                <pick-form
                                                    v-else-if="item.type === 5"
                                                    :selection-type="0"
                                                    @chosed-forms="(forms) => { chosedForms(item, forms); }"
                                                />
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                </el-collapse-item>
                                <template #footer>
                                    <div class="drag-footer">
                                        <el-button
                                            :size="miniSize"
                                            round
                                            type="primary"
                                            @click="
                                                addEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    'imgSlide'
                                                )
                                            "
                                        >
                                            <i class="el-icon-ali-add"></i> 添加
                                        </el-button>
                                    </div>
                                </template>
                            </draggable>
                        </template>

                        <!-- 公告 -->
                        <template v-if="editWidget.type == 'notice'">
                            <el-form-item label="获取">
                                <el-radio-group v-model="editWidget.config.type">
                                    <el-radio value="auto">
                                        自动获取
                                    </el-radio>
                                    <el-radio value="choose">
                                        手动选择
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="editWidget.config.type == 'choose'">
                                <draggable
                                    :list="editWidget.config.list"
                                    :options="{
                                        group: { name: 'noticeList' },
                                        ghostClass: 'draggable-ghost',
                                        animation: 150,
                                    }"
                                    element="ul"
                                >
                                    <li
                                        v-for="(item, key) in editWidget.config.list"
                                        :key="key"
                                        :name="key"
                                        class="notice-item"
                                    >
                                        <i
                                            class="el-icon-ali-delete item-delete"
                                            @click.stop="
                                                deleteEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    key
                                                )
                                            "
                                        ></i>
                                        <span style="padding: 0px 8px">{{ item.title }}</span>
                                    </li>
                                    <template #footer>
                                        <div class="drag-footer">
                                            <pick-notice
                                                :selection-type="1"
                                                @chosed-notices="
                                                    (notices) => {
                                                        addNoticeConfigListItem(
                                                            editWidget.config.list,
                                                            notices
                                                        );
                                                    }
                                                "
                                            />
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </template>

                        <!-- 导航组-->
                        <template v-if="editWidget.type == 'navBar'">
                            <el-form-item label="数量">
                                <el-radio-group v-model="editWidget.config.column">
                                    <el-radio :value="3">
                                        3个
                                    </el-radio>
                                    <el-radio :value="4">
                                        4个
                                    </el-radio>
                                    <el-radio :value="5">
                                        5个
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <draggable
                                :list="editWidget.config.list"
                                :options="{
                                    group: { name: 'slideList' },
                                    ghostClass: 'draggable-ghost',
                                    animation: 150,
                                }"
                                tag="el-collapse"
                            >
                                <el-collapse-item
                                    v-for="(item, key) in editWidget.config.list"
                                    :key="key"
                                >
                                    <template #title>
                                        <i
                                            class="el-icon-ali-delete item-delete"
                                            @click.stop="
                                                deleteEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    key
                                                )
                                            "
                                        ></i>
                                        <span style="padding: 0px 8px">{{ item.text }}</span>
                                    </template>
                                    <change-image-icon
                                        :img-url="item.url"
                                        :init-style="{
                                            width: '100%',
                                            border: '1px dashed #d9d9d9',
                                            borderRadius: '4px',
                                        }"
                                        @chosed-image-icon="
                                            (img) => {
                                                chosedImage(item, img);
                                            }
                                        "
                                    />
                                    <el-form-item label="文字">
                                        <input
                                            v-model="item.text"
                                            type="text"
                                        />
                                    </el-form-item>
                                    <el-form-item label="类型">
                                        <el-select
                                            v-model="item.type"
                                            placeholder="请选择"
                                        >
                                            placeholder="请选择"
                                            >
                                            v-for="linkType in linkTypes"
                                            :key="linkType.key"
                                            :label="linkType.value"
                                            :value="linkType.key"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="指向">
                                        <el-input
                                            v-model="item.value"
                                            placeholder="请选择"
                                        >
                                            <template #append>
                                                <pick-goods
                                                    v-if="item.type === 2"
                                                    :selection-type="0"
                                                    @chosed-goods="(goods) => { chosedGoods(item, goods); }"
                                                />
                                                <pick-article
                                                    v-else-if="item.type === 3"
                                                    :selection-type="0"
                                                    @chosed-articles="(articles) => { chosedArticles(item, 'value', articles, 'id'); }"
                                                />
                                                <pick-articleType
                                                    v-else-if="item.type === 4"
                                                    :selection-type="0"
                                                    @chosed-article-types="(articleTypes) => { chosedArticleTypes(item, 'value', articleTypes); }"
                                                />
                                                <pick-form
                                                    v-else-if="item.type === 5"
                                                    :selection-type="0"
                                                    @chosed-forms="(forms) => { chosedForms(item, forms); }"
                                                />
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                </el-collapse-item>
                                <template #footer>
                                    <div class="drag-footer">
                                        <el-button
                                            :size="miniSize"
                                            round
                                            type="primary"
                                            @click="
                                                addEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    'navBar'
                                                )
                                            "
                                        >
                                            <i class="el-icon-ali-add"></i> 添加
                                        </el-button>
                                    </div>
                                </template>
                            </draggable>
                        </template>

                        <!-- 商品组 -->
                        <template v-if="editWidget.type == 'goods'">
                            <el-form-item label="来源">
                                <el-radio-group v-model="editWidget.config.type">
                                    <el-radio value="auto">
                                        自动
                                    </el-radio>
                                    <el-radio value="choose">
                                        手动
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-show="editWidget.config.type == 'auto'">
                                <el-form-item label="分类">
                                    <el-cascader
                                        v-model="editWidget.config.classifyId"
                                        :options="goodsCatList"
                                        :props="cascaderProps"
                                        :show-all-levels="false"
                                    />
                                </el-form-item>
                                <el-form-item label="品牌">
                                    <el-select
                                        v-model="editWidget.config.brandId"
                                        placeholder="请选择品牌"
                                    >
                                        <el-option
                                            v-for="item in brandList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数量">
                                    <el-input-number
                                        v-model="editWidget.config.limit"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                    />
                                </el-form-item>
                            </div>
                            <draggable
                                v-show="editWidget.config.type == 'choose'"
                                :list="editWidget.config.list"
                                :options="{
                                    group: { name: 'goodsList' },
                                    ghostClass: 'draggable-ghost',
                                    animation: 150,
                                }"
                                element="ul"
                            >
                                <li
                                    v-for="(goods, key) in editWidget.config.list"
                                    :key="key"
                                    :class="['goods-list-item']"
                                >
                                    <slot :goods="goods">
                                        <i
                                            class="el-icon-ali-delete item-delete goods-delete"
                                            @click.stop="
                                                deleteEditWidgetConfigListItem(
                                                    editWidget.config.list,
                                                    key
                                                )
                                            "
                                        ></i>
                                        <img
                                            :src="env.getImgUrl(goods.url, env.baseAssetsUrl)"
                                            alt
                                        />
                                    </slot>
                                </li>
                                <template #footer>
                                    <div class="drag-footer">
                                        <pick-goods
                                            :selection-type="1"
                                            @chosed-goods="
                                                (goods) => {
                                                    addGoodsConfigListItem(
                                                        editWidget.config.list,
                                                        goods
                                                    );
                                                }
                                            "
                                        />
                                    </div>
                                </template>
                            </draggable>
                            <el-form-item label="类型">
                                <el-radio-group v-model="editWidget.config.display">
                                    <el-radio value="list">
                                        列表平铺
                                    </el-radio>
                                    <el-radio
                                        :disabled="editWidget.config.column == 1"
                                        :value="slide"
                                    >
                                        横向滚动
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="分列数量">
                                <el-radio-group v-model="editWidget.config.column">
                                    <el-radio
                                        :disabled="editWidget.config.display == 'slide'"
                                        :value="1"
                                    >
                                        单列
                                    </el-radio>
                                    <el-radio :value="2">
                                        两列
                                    </el-radio>
                                    <el-radio :value="3">
                                        三列
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="组名称">
                                <el-input v-model="editWidget.config.title" />
                            </el-form-item>
                            <el-form-item label="更多">
                                <el-radio-group v-model="editWidget.config.more">
                                    <el-radio value="true">
                                        是
                                    </el-radio>
                                    <el-radio value="false">
                                        否
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>

                        <!-- 单图组 -->
                        <template v-if="editWidget.type == 'imgSingle'">
                            <change-image-icon
                                :img-url="editWidget.config.url"
                                :init-style="{
                                    width: '100%',
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: '4px',
                                }"
                                @chosed-image-icon="
                                    (img) => {
                                        chosedImage(editWidget.config, img);
                                    }
                                "
                            />
                            <el-form-item label="类型">
                                <el-select
                                    v-model="editWidget.config.type"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="linkType in linkTypes"
                                        :key="linkType.key"
                                        :label="linkType.value"
                                        :value="linkType.key"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="指向">
                                <el-input
                                    v-model="editWidget.config.value"
                                    placeholder="请选择"
                                >
                                    <template #append>
                                        <pick-goods
                                            v-if="editWidget.config.type === 2"
                                            :selection-type="0"
                                            @chosed-goods="(goods) => { chosedGoods(editWidget.config, goods); }"
                                        />
                                        <pick-article
                                            v-else-if="editWidget.config.type === 3"
                                            :selection-type="0"
                                            @chosed-articles="(articles) => { chosedArticles(editWidget.config, 'value', articles, 'id'); }"
                                        />
                                        <pick-articleType
                                            v-else-if="editWidget.config.type === 4"
                                            :selection-type="0"
                                            @chosed-article-types="(articleTypes) => { chosedArticleTypes(editWidget.config, 'value', articleTypes); }"
                                        />
                                        <pick-form
                                            v-else-if="editWidget.config.type === 5"
                                            :selection-type="0"
                                            @chosed-forms="(forms) => { chosedForms(editWidget.config, forms); }"
                                        />
                                    </template>
                                </el-input>
                            </el-form-item>
                        </template>

                        <!-- 辅助空白 -->
                        <template v-if="editWidget.type == 'blank'">
                            <el-form-item label="背景颜色">
                                <el-color-picker v-model="editWidget.config.backgroundColor" />
                            </el-form-item>
                            <el-form-item label="组件高度">
                                <el-slider
                                    v-model="editWidget.config.height"
                                    :max="200"
                                    :min="1"
                                />
                                />
                            </el-form-item>
                        </template>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
    Search,
    NoticeBar,
    Panel,
    Grid,
    GridItem,
    Image,
    Card,
    Swipe,
    SwipeItem,
    Row,
    Col,
    CellGroup,
    Cell,
    Divider,
    Field,
} from 'vant';
import _ from 'lodash';
import draggable from 'vuedraggable';
import breadCrumb from '@/components/bread_crumb.vue';
import pickGoods from '@/components/pick_goods';
import pickArticle from '@/components/pick_article';
import pickArticleType from '@/components/pick_articleType';
import pickForm from '@/components/pick_form';
import changeImageIcon from '@/components/change_image_icon.vue';
import pickVideo from '@/components/pick_video';
import pickNotice from '@/components/pick_notice';

import allComponents from '@/views/page/allComponents';
import pageWidgets from '@/views/page/pageWidgets';
import tinyEditor from '@/components/tiny_editor';

export default {
    components: {
        draggable,
        breadCrumb,
        pickGoods,
        pickArticle,
        pickArticleType,
        pickForm,
        pickVideo,
        pickNotice,
        changeImageIcon,
        tinyEditor,
        [Search.name]: Search,
        [NoticeBar.name]: NoticeBar,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Panel.name]: Panel,
        [Image.name]: Image,
        [Card.name]: Card,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        [Row.name]: Row,
        [Col.name]: Col,
        [CellGroup.name]: CellGroup,
        [Cell.name]: Cell,
        [Divider.name]: Divider,
        [Field.name]: Field,
    },
    data() {
        return {
            normalSize: 'default',
            smallSize: 'small',
            activeNames: ['1'],
            isDragging: false,
            storeComponents: allComponents.storeComponents,
            utilsComponents: allComponents.utilsComponents,
            mediaComponents: allComponents.mediaComponents,

            pageWidgets: pageWidgets,
            editWidget: null,
            imgWindowStyle: [
                { style: 2,
                  value: '1行2个',
                  url: 'template/col-2.png' },
                { style: 3,
                  value: '1行3个',
                  url: 'template/col-3.png' },
                { style: 4,
                  value: '1行4个',
                  url: 'template/col-4.png' },
                { style: 5,
                  value: '1左3右',
                  url: 'template/col-1-3.png' },
            ],
            linkTypes: [
                { key: 1,
                  value: 'URL链接' },
                { key: 2,
                  value: '商品' },
                { key: 3,
                  value: '文章' },
                { key: 4,
                  value: '文章分类' },
                { key: 5,
                  value: '智能表单' },
            ],
            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children',
            },
            goodsCatList: [],
            brandList: [],
        };
    },
    computed: {
        componentOpts() {
            return {
                group: { name: 'widget',
                         pull: 'clone',
                         put: false }, // 从列表中移出的元素为副本,不接收从其它列表中拖进来的元素
                sort: false,
                ghostClass: 'draggable-ghost',
                animation: 150,
            };
        },
        widgetOpts() {
            return {
                group: { name: 'widget' },
                sort: true,
                ghostClass: 'draggable-ghost',
                filter: '.record',
                scroll: true,
                scrollSensitivity: 100,
                scrollSpeed: 1000,
                animation: 100,
            };
        },
    },
    watch: {
        editWidget: {
            handler(val, oldval) {
                this.doChangePageWidgets();
            },
            deep: true, // 对象内部的属性监听，也叫深度监听
        },
    },
    created() {
        this.doChangePageWidgets = _.debounce(this.changePageWidgets, 500);
    },
    mounted() {
        this.getGoodsCatList();
        this.getBrandList();

        const _textArea = document.getElementById('textarea-container');
        const _img = _textArea.getElementsByTagName('img');
        for (let i = 0; i < _img.length; i++) {
            _img[i].style['max-width'] = _textArea.offsetWidth - 40 + 'px'; // 这里-40是padding的左右宽度和
            _img[i].style.display = 'inline';
        }
    },
    methods: {
        end(list, items) {
            list = items;
        },
        /*
        addChosedImage (list, chosen) {
            debugger
            list.push(chosen)
        },
        */
        onRemove(list, idx) {
            if (Array.isArray(list) && list.length > idx) {
                list.splice(idx, 1);
            }
        },
        chosedGoods(item, goods) {
            if (item && Array.isArray(goods) && goods.length > 0) {
                item.value = goods[0].id;
            }
        },
        chosedArticles(item, descColumn, articles, srcColumn) {
            if (item && Array.isArray(articles) && articles.length > 0) {
                item[descColumn] = articles[0][srcColumn];
            }
        },
        chosedArticleTypes(item, column, articleTypes) {
            if (item && Array.isArray(articleTypes) && articleTypes.length > 0) {
                item[column] = articleTypes[0].id;
            }
        },
        chosedForms(item, forms) {
            if (item && Array.isArray(forms) && forms.length > 0) {
                item.value = forms[0].id;
            }
        },
        chosedImage(item, img) {
            if (item && img) {
                item.url = img.path;
            }
        },
        addEditWidgetConfigListItem(list, widgetType) {
            let _item = {
                url: 'images/empty-banner.png',
                type: '',
                value: '',
            };
            if (widgetType === 'navBar') {
                _item = {
                    url: 'images/empty-banner.png',
                    text: '按钮',
                    type: '',
                    value: '',
                };
            }
            if (Array.isArray(list)) {
                if (_item.text) {
                    _item.text = `${_item.text}${list.length}`;
                }
                list.push(_item);
            }
        },
        changePageWidgets() {
            const _editWidget = this.editWidget ? this.pageWidgets[this.editWidget.idx] : null;
            if (_editWidget) {
                const _cloneEditWidget = _.cloneDeep(this.editWidget);
                delete _cloneEditWidget.idx;
                Object.assign(_editWidget, _cloneEditWidget);
                this.pageWidgets = this.pageWidgets.filter((v) => v);
                console.log(`this.pageWidgets.length: ${this.pageWidgets.length}`);
            }
        },
        // 从组件库拖一个组件进入工作区
        handleAddWidget(evt) {
            const _newIdx = evt.newIndex;
            const _cloneWidget = _.cloneDeep(this.pageWidgets[_newIdx]);
            this.$set(this.pageWidgets, _newIdx, _cloneWidget);

            console.log('_newIdx:', _newIdx);
            this.handleSelectWidget(_newIdx);
        },
        /** 选择一个 Widget */
        handleSelectWidget(idx) {
            this.editWidget = _.cloneDeep(this.pageWidgets[idx]);
            if (this.editWidget) {
                this.editWidget.idx = idx;
                console.log(this.editWidget);
            } else {
                console.log(`${idx} 没有找到`);
            }
        },
        /** 删除一个 Widget */
        handleDeleteWidget(idx) {
            const _widget = this.pageWidgets.splice(idx, 1);
            if (_widget) {
                console.log('delete idx:', idx);
                console.log(_widget);
            }
        },
        /** 克隆一个 Widget */
        handleCloneWidget(idx) {
            const _widget = _.cloneDeep(this.pageWidgets[idx]);
            if (_widget) {
                this.pageWidgets.splice(idx, 0, _widget);
                console.log(_widget);
            }
        },
        deleteEditWidgetConfigListItem(list, idx) {
            if (Array.isArray(list) && list.length > idx) {
                list.splice(idx, 1);
            }
        },
        // 添加商品
        addGoodsConfigListItem(list, goods) {
            if (Array.isArray(list)) {
                for (const item of goods) {
                    list.push({
                        id: item.id,
                        name: item.name,
                        url: item.attachment ? item.attachment.path : '',
                    });
                }
            }
        },
        // 添加公告
        addNoticeConfigListItem(list, notices) {
            if (Array.isArray(list)) {
                for (const item of notices) {
                    list.push({
                        id: item.id,
                        title: item.title,
                        createdAt: item.createdAt,
                    });
                }
            }
        },
        // 获取商品分类
        async getGoodsCatList() {
            const _result = await this.$api.goodsCat.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.goodsCatList = _result.data.list;
            }
        },
        // 获取商品品牌
        async getBrandList() {
            const _result = await this.$api.brand.list();
            if (_result.succeed === 1 && _result.code === 200) {
                this.brandList = _result.data.list;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.component-group :deep() {
    .component-item {
        float: left;
        list-style: none;
        margin: 5px;
        .el-card__body {
            margin: 2px;
            padding: 8px 2px 2px;
            text-align: center;
            width: 62px;
            height: 62px;
            cursor: pointer;
            i {
                font-size: 24px;
                font-weight: 700;
            }
            div {
                padding: 5px;
            }
        }
    }
    .component-item-header {
        float: right;
        .el-card__body {
            padding: 2px;
            width: 31px;
            line-height: 31px;
            height: 31px;
            cursor: pointer;
            i {
                color: crimson;
                font-size: 20px;
                font-weight: 500;
            }
        }
    }
}
.page-column :deep() {
    .el-card__header {
        padding: 8px;
        text-align: left;
    }
    .el-card__body {
        padding: 8px;
        background-color: #f2f6fc;
    }
    .properties-container {
        z-index: 10;
        position: fixed;
        // top: 152px;
        //right: 50px;
        width: 100%;
        max-width: 360px;
        font-size: 12px;
        .el-card__header {
            font-size: 14px;
        }
        i.item-delete {
            margin-left: 8px;
            padding: 3px;
            font-size: 12px;
            &:hover {
                content: '';
                background-color: red;
                color: #f2f6fc;
                border-radius: 50%;
                cursor: pointer;
                z-index: 2;
            }
        }
        span.title {
            padding: 0px 8px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .drag-footer {
            margin: 8px 0px;
            text-align: right;
        }
        .notice-item {
            padding: 5px;
            background-color: #f4f4f5;
            border-radius: 4px;
            border: 1px dashed #e4e7ed;
        }
        .goods-list-item {
            cursor: move;
            position: relative;
            overflow: hidden;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 50px;
            height: 50px;
            padding: 5px;
            margin: 0 8px 8px 0;
            display: inline-block;
            i.goods-delete {
                position: absolute;
                top: 2px;
                right: 2px;
            }
            img {
                width: 100%;
            }
        }
    }
}

.widget-item {
    position: relative;
    text-align: left;
    border-radius: 4px;
    background: #fff;
    padding: 5px;
    margin: 5px 0px;
    &:hover {
        content: '';
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px dashed #ff7159;
        cursor: move;
    }
    p {
        margin: 5px 0px;
        font-size: 12px;
        text-align: left;
    }

    .goods-item-title {
        text-align: center;
        font-weight: 400;
        margin: 8px 0px;
        width: 100%;
        font-size: 14px;
    }
    .goods-item-price {
        color: #ff5454;
        font-weight: 500;
        margin: 5px 0px;
        width: 100%;
        font-size: 16px;
    }
    .el-button-group :deep() {
        position: absolute;
        top: 1px;
        right: 1px;
        z-index: 1;
        .el-button {
            padding: 3px 7px;
            i {
                font-size: 12px;
            }
        }
    }
}

.widget-container {
    position: relative;
    min-height: 360px;
    li {
        list-style: none;
    }
    .draggable-ghost {
        opacity: 0.5;
        border: 2px dashed #ff7159;
    }
    &:after {
        content: '.';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .record {
        border-radius: 5px;
        width: 210px;
        background: rgba(0, 0, 0, 0.25);
        position: absolute !important;
        top: 30%;
        z-index: 1;
        cursor: pointer;
        &.right {
            right: 0;
        }
        &.left {
            left: 0;
        }
        &:hover {
            content: '';
            border: 2px dashed #ff7159;
            cursor: move;
        }
        span {
            font-size: 12px;
        }
        i {
            margin: 3px 8px;
            &.el-icon-ali-delete1 {
                float: right;
                &:hover {
                    content: '';
                    background-color: red;
                    color: #f2f6fc;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 2;
                }
            }
        }
    }
}

.title {
    padding: 5px;
    font-size: 14px;
    font-weight: 600;
    .goods-more {
        font-weight: 400;
        float: right;
        font-size: 16px;
    }
}

.widget-inner-container :deep() {
    .coupon {
        width: 100%;
        box-sizing: border-box;
        background: linear-gradient(to right, #ff6565, #ff8a8a);
        margin: 0.1rem 0;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        .coupon-left {
            height: 50px;
            line-height: 50px;
            color: rgb(255, 247, 247);
            font-size: 14px;
            font-weight: 400;
            padding: 0 14px;
            margin: 12px 0;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px dotted #fff;
            display: inline-block;
        }
        .coupon-middle {
            width: 70%;
            height: 100%;
            text-align: left;
            color: #fff;
            box-sizing: border-box;
            padding: 5px 10px;
            display: inline-block;
            font-size: 12px;
            p {
                margin: 0px;
                height: 17px;
                line-height: 17px;
            }
        }
        .coupon-right {
            padding: 0 8px;
            background-color: #ffe7e7;
            color: #ff5454;
            font-size: 12px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 10px;
            border-radius: 2px;
        }
    }
}

.img-window-list :deep() {
    span.el-radio-button__inner {
        background: #f2f6fc;
        padding: 5px 10px;
        .el-image {
            width: 36px;
            height: 36px;
        }
        span {
            display: block;
            font-size: 14px;
            font-weight: 400;
        }
    }
}
</style>
