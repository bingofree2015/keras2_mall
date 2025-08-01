<template>
    <div class="page-container">
        <!--导航-->
        <el-row>
            <el-col :span="10">
                <bread-crumb />
            </el-col>
        </el-row>
        <!--表单-->
        <el-form
            ref="formData"
            :model="formData"
            :rules="formDataRules"
            :size="normalSize"
            class="edit-dialog-container"
            label-width="150px"
        >
            <el-row>
                <el-col :span="24" :xs="24" :sm="24" :md="20" :lg="18">
                    <el-tabs v-model="activeName" class="settings-tabs">
                        <el-tab-pane :label="$t('preference.platformSetting')" name="platform">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-platform-setting"></i>
                                    {{ $t('preference.platformSetting') }}
                                </span>
                            </template>
                            <el-form-item :label="$t('preference.platformName')" prop="shopName">
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-input
                                        v-model="formData.shopName"
                                        :placeholder="$t('preference.inputPlatformName')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('preference.platformNameTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="$t('preference.platformDesc')" prop="shopDesc">
                                <el-col :span="20" :xs="24" :sm="20" :md="16">
                                    <el-input
                                        v-model="formData.shopDesc"
                                        :rows="2"
                                        :placeholder="$t('preference.inputPlatformDesc')"
                                        type="textarea"
                                    />
                                </el-col>
                            </el-form-item>
                            <el-form-item :label="$t('preference.filingInfo')" prop="shopFiling">
                                <el-col :span="20" :xs="24" :sm="20" :md="16">
                                    <el-input
                                        v-model="formData.shopFiling"
                                        :rows="2"
                                        :placeholder="$t('preference.inputFilingInfo')"
                                        type="textarea"
                                    />
                                </el-col>
                            </el-form-item>
                            <el-form-item :label="$t('preference.contactMobile')" prop="shopMobile">
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-input
                                        v-model="formData.shopMobile"
                                        :placeholder="$t('preference.inputContactMobile')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('preference.contactMobileTip') }}
                                </span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-form-item
                                        :label="$t('preference.platformLogo')"
                                        prop="shopLogo"
                                    >
                                        <change-image-icon
                                            :img-url="formData.shopLogo"
                                            @chosed-image-icon="chosedShopLogo"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-form-item
                                        :label="$t('preference.defaultImage')"
                                        prop="shopDefaultImage"
                                    >
                                        <change-image-icon
                                            :img-url="formData.shopDefaultImage"
                                            @chosed-image-icon="chosedShopDefaultImage"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-form-item
                                        :label="$t('preference.selfService')"
                                        prop="selfService"
                                    >
                                        <el-switch
                                            v-model="formData.selfService"
                                            :active-text="$t('preference.enable')"
                                            :inactive-text="$t('preference.disable')"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :xs="24" :sm="12" :md="8">
                                    <el-form-item
                                        :label="$t('preference.invoice')"
                                        prop="invoicesNeed"
                                    >
                                        <el-switch
                                            v-model="formData.invoicesNeed"
                                            :active-text="$t('preference.enable')"
                                            :inactive-text="$t('preference.disable')"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item
                                :label="$t('preference.searchKeywords')"
                                prop="searchKeywords"
                            >
                                <el-input
                                    v-model="formData.searchKeywords"
                                    :placeholder="$t('preference.inputSearchKeywords')"
                                />
                            </el-form-item>
                            <el-form-item :label="$t('preference.categoryStyle')" prop="cateStyle">
                                <div class="style-selection-container">
                                    <el-radio-group
                                        v-model="formData.cateStyle"
                                        class="style-radio-group"
                                    >
                                        <div
                                            class="style-option"
                                            :class="{ selected: formData.cateStyle === 0 }"
                                        >
                                            <div class="style-header">
                                                <el-radio :value="0" class="style-radio">
                                                    <span class="style-label">
                                                        {{ $t('preference.levelOneBigImage') }}
                                                    </span>
                                                </el-radio>
                                            </div>
                                            <el-card class="card-item">
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(
                                                            'template/style-1.png',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                >
                                                    <template #error>
                                                        <div class="image-placeholder">
                                                            <i class="el-icon-ali-tupianshibai"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                                <div class="summary">
                                                    {{
                                                        $t('preference.sizeSuggestion')
                                                    }}：350px*150px
                                                </div>
                                            </el-card>
                                        </div>
                                        <div
                                            class="style-option"
                                            :class="{ selected: formData.cateStyle === 1 }"
                                        >
                                            <div class="style-header">
                                                <el-radio :value="1" class="style-radio">
                                                    <span class="style-label">
                                                        {{ $t('preference.levelOneSmallImage') }}
                                                    </span>
                                                </el-radio>
                                            </div>
                                            <el-card class="card-item">
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(
                                                            'template/style-2.png',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                >
                                                    <template #error>
                                                        <div class="image-placeholder">
                                                            <i class="el-icon-ali-tupianshibai"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                                <div class="summary">
                                                    {{
                                                        $t('preference.sizeSuggestion')
                                                    }}：105px*105px
                                                </div>
                                            </el-card>
                                        </div>
                                        <div
                                            class="style-option"
                                            :class="{ selected: formData.cateStyle === 2 }"
                                        >
                                            <div class="style-header">
                                                <el-radio :value="2" class="style-radio">
                                                    <span class="style-label">
                                                        {{ $t('preference.levelTwoSmallImage') }}
                                                    </span>
                                                </el-radio>
                                            </div>
                                            <el-card class="card-item">
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(
                                                            'template/style-3.png',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                >
                                                    <template #error>
                                                        <div class="image-placeholder">
                                                            <i class="el-icon-ali-tupianshibai"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                                <div class="summary">
                                                    {{ $t('preference.sizeSuggestion') }}：60px*60px
                                                </div>
                                            </el-card>
                                        </div>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                            <el-form-item :label="$t('setting.h5CategoryStyle')" prop="cateType">
                                <div class="style-selection-container">
                                    <el-radio-group
                                        v-model="formData.cateType"
                                        class="style-radio-group"
                                    >
                                        <div
                                            class="style-option"
                                            :class="{ selected: formData.cateType === 0 }"
                                        >
                                            <div class="style-header">
                                                <el-radio :value="0" class="style-radio">
                                                    <span class="style-label">
                                                        {{ $t('setting.typeOne') }}
                                                    </span>
                                                </el-radio>
                                            </div>
                                            <el-card class="card-item">
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(
                                                            'template/h5-style-1.png',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                >
                                                    <template #error>
                                                        <div class="image-placeholder">
                                                            <i class="el-icon-ali-tupianshibai"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                                <div class="summary">
                                                    {{ $t('setting.h5SettingTip') }}
                                                </div>
                                            </el-card>
                                        </div>
                                        <div
                                            class="style-option"
                                            :class="{ selected: formData.cateType === 1 }"
                                        >
                                            <div class="style-header">
                                                <el-radio :value="1" class="style-radio">
                                                    <span class="style-label">
                                                        {{ $t('setting.typeTwo') }}
                                                    </span>
                                                </el-radio>
                                            </div>
                                            <el-card class="card-item">
                                                <el-image
                                                    :src="
                                                        env.getImgUrl(
                                                            'template/h5-style-2.png',
                                                            env.baseAssetsUrl
                                                        )
                                                    "
                                                >
                                                    <template #error>
                                                        <div class="image-placeholder">
                                                            <i class="el-icon-ali-tupianshibai"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                                <div class="summary">
                                                    {{ $t('setting.h5FunctionTip') }}
                                                </div>
                                            </el-card>
                                        </div>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('setting.goodsSetting')" name="goods">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-shangpin-copy"></i>
                                    {{ $t('setting.goodsSetting') }}
                                </span>
                            </template>
                            <el-form-item
                                :label="$t('setting.stockAlertQuantity')"
                                prop="goodsStocksWarn"
                            >
                                <el-input-number
                                    v-model="formData.goodsStocksWarn"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputStockAlertQuantity')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.stockAlertTip') }}
                                </span>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('setting.orderSetting')" name="order">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-dd"></i>
                                    {{ $t('setting.orderSetting') }}
                                </span>
                            </template>
                            <el-form-item :label="$t('setting.cancelTime')" prop="orderCancelTime">
                                <el-input-number
                                    v-model="formData.orderCancelTime"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputCancelTime')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.cancelTimeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.completeTime')"
                                prop="orderCompleteTime"
                            >
                                <el-input-number
                                    v-model="formData.orderCompleteTime"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputCompleteTime')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.completeTimeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.confirmReceiveTime')"
                                prop="orderAutoSignTime"
                            >
                                <el-input-number
                                    v-model="formData.orderAutoSignTime"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputConfirmReceiveTime')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.confirmReceiveTimeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.autoEvalTime')"
                                prop="orderAutoEvalTime"
                            >
                                <el-input-number
                                    v-model="formData.orderAutoEvalTime"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputAutoEvalTime')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.autoEvalTimeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.reminderPaymentTime')"
                                prop="reminderPaymentTime"
                            >
                                <el-input-number
                                    v-model="formData.reminderPaymentTime"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputReminderPaymentTime')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.reminderPaymentTimeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="$t('setting.returnContact')" prop="returnContact">
                                <el-col :span="8">
                                    <el-input
                                        v-model="formData.returnContact"
                                        :placeholder="$t('setting.inputReturnContact')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.returnContactTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.returnContactInfo')"
                                prop="returnContactInformation"
                            >
                                <el-col :span="8">
                                    <el-input
                                        v-model="formData.returnContactInformation"
                                        :placeholder="$t('setting.inputReturnContactInfo')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.returnContactInfoTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="$t('setting.returnArea')" prop="returnAreaId">
                                <el-cascader
                                    v-model="formData.returnAreaId"
                                    :options="areaList"
                                    :props="cascaderProps"
                                    :show-all-levels="false"
                                />
                            </el-form-item>
                            <el-form-item :label="$t('setting.returnAddress')" prop="returnAddress">
                                <el-col :span="18">
                                    <el-input
                                        v-model="formData.returnAddress"
                                        :placeholder="$t('setting.inputReturnAddress')"
                                    >
                                        <template #append>
                                            <el-button
                                                icon="el-icon-ali-dakai"
                                                @click="changePosition"
                                            />
                                        </template>
                                    </el-input>
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.returnContactInfoTip') }}
                                </span>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('setting.pointSetting')" name="point">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-jifen1"></i>
                                    {{ $t('setting.pointSetting') }}
                                </span>
                            </template>
                            <el-form-item
                                :label="$t('setting.enablePointFunction')"
                                prop="openPoint"
                            >
                                <el-switch
                                    v-model="formData.openPoint"
                                    :active-text="$t('setting.enable')"
                                    :inactive-text="$t('setting.disable')"
                                />
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.orderPointDiscountRatio')"
                                prop="pointDiscountedProportion"
                            >
                                <el-input-number
                                    v-model="formData.pointDiscountedProportion"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputOrderPointDiscountRatio')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.orderPointDiscountRatioTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.orderPointUseRatio')"
                                prop="orderPointProportion"
                            >
                                <el-input-number
                                    v-model="formData.orderPointProportion"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputOrderPointUseRatio')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.orderPointUseRatioTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.orderPointRewardRatio')"
                                prop="orderRewardProportion"
                            >
                                <el-input-number
                                    v-model="formData.orderRewardProportion"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputOrderPointRewardRatio')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.orderPointRewardRatioTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.signRewardType')"
                                prop="signPointType"
                            >
                                <el-radio-group v-model="formData.signPointType">
                                    <el-radio :value="1">
                                        {{ $t('setting.fixedReward') }}
                                    </el-radio>
                                    <el-radio :value="2">
                                        {{ $t('setting.randomReward') }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="formData.signPointType == 1">
                                <el-form-item
                                    :label="$t('setting.firstRewardPoint')"
                                    prop="firstSignPoint"
                                >
                                    <el-input-number
                                        v-model="formData.firstSignPoint"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                        :placeholder="$t('setting.inputFirstRewardPoint')"
                                    />
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.firstRewardPointTip') }}
                                    </span>
                                </el-form-item>
                                <el-form-item
                                    :label="$t('setting.continuousSignAdditional')"
                                    prop="continuitySignAdditional"
                                >
                                    <el-input-number
                                        v-model="formData.continuitySignAdditional"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                        :placeholder="$t('setting.inputContinuousSignAdditional')"
                                    />
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.continuousSignAdditionalTip') }}
                                    </span>
                                </el-form-item>
                                <el-form-item
                                    :label="$t('setting.dailyMaxReward')"
                                    prop="dailySignMaxPoint"
                                >
                                    <el-input-number
                                        v-model="formData.dailySignMaxPoint"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                        :placeholder="$t('setting.inputDailyMaxReward')"
                                    />
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.dailyMaxRewardTip') }}
                                    </span>
                                </el-form-item>
                            </div>
                            <div v-else-if="formData.signPointType == 2">
                                <el-form-item
                                    :label="$t('setting.randomRewardMin')"
                                    prop="signMinRandomPoint"
                                >
                                    <el-input-number
                                        v-model="formData.signMinRandomPoint"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                        :placeholder="$t('setting.inputRandomRewardMin')"
                                    />
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.randomRewardMinTip') }}
                                    </span>
                                </el-form-item>
                                <el-form-item
                                    :label="$t('setting.randomRewardMax')"
                                    prop="signMaxRandomPoint"
                                >
                                    <el-input-number
                                        v-model="formData.signMaxRandomPoint"
                                        :max="10"
                                        :min="1"
                                        controls-position="right"
                                        :placeholder="$t('setting.inputRandomRewardMax')"
                                    />
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.randomRewardMaxTip') }}
                                    </span>
                                </el-form-item>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('setting.cashSetting')" name="cash">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-tixian-copy"></i>
                                    {{ $t('setting.cashSetting') }}
                                </span>
                            </template>
                            <el-form-item
                                :label="$t('setting.minCashAmount')"
                                prop="toCashLowMoney"
                            >
                                <el-input-number
                                    v-model="formData.tocashLowMoney"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputMinCashAmount')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.minCashTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item
                                :label="$t('setting.cashServiceRate')"
                                prop="toCashRateMoney"
                            >
                                <el-input-number
                                    v-model="formData.tocashRateMoney"
                                    :max="10"
                                    :min="1"
                                    controls-position="right"
                                    :label="$t('setting.inputCashServiceRate')"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.cashServiceRateTip') }}
                                </span>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('setting.otherSetting')" name="other">
                            <template #label>
                                <span>
                                    <i class="el-icon-ali-qita"></i>
                                    {{ $t('setting.otherSetting') }}
                                </span>
                            </template>
                            <el-divider content-position="left">
                                {{ $t('setting.tencentMap') }}
                            </el-divider>
                            <el-form-item :label="$t('setting.tencentMapKey')" prop="qqMapKey">
                                <el-col :span="12">
                                    <el-input
                                        v-model="formData.qqMapKey"
                                        :placeholder="$t('setting.inputTencentMapKey')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.tencentMapTip') }}
                                </span>
                            </el-form-item>
                            <el-divider content-position="left">
                                {{ $t('setting.express100') }}
                            </el-divider>
                            <el-form-item
                                :label="$t('setting.companyCode')"
                                prop="kuaidi100CorpCode"
                            >
                                <el-col :span="8">
                                    <el-input
                                        v-model="formData.kuaidi100CorpCode"
                                        :placeholder="$t('setting.inputCompanyCode')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.companyCodeTip') }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="$t('setting.authKey')" prop="kuaidi100Key">
                                <el-col :span="8">
                                    <el-input
                                        v-model="formData.kuaidi100Key"
                                        :placeholder="$t('setting.inputAuthKey')"
                                    />
                                </el-col>
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.authKeyTip') }}
                                </span>
                            </el-form-item>
                            <el-divider content-position="left">
                                {{ $t('setting.imageStorage') }}
                            </el-divider>

                            <el-form-item
                                :label="$t('setting.imageStorageEngine')"
                                prop="imageStorageType"
                            >
                                <el-radio-group v-model="formData.imageStorageType">
                                    <el-radio value="local">
                                        {{ $t('setting.local') }}
                                    </el-radio>
                                    <el-radio value="aliyun">
                                        {{ $t('setting.aliyunOSS') }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <div v-if="formData.imageStorageType === 'local'">
                                <el-form-item :label="$t('setting.bindDomain')" prop="domain">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-input
                                                v-model="formData.domain"
                                                :placeholder="$t('setting.inputBindDomain')"
                                            />
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="text-align: left">
                                            <span class="tip-info">
                                                <i class="el-icon-ali-tishi"></i>
                                                {{ $t('setting.bindDomainTip') }}
                                            </span>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </div>
                            <div v-else-if="formData.imageStorageType === 'aliyun'">
                                <el-form-item :label="$t('setting.bindDomain')" prop="domain">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-input
                                                v-model="formData.domain"
                                                :placeholder="$t('setting.inputBindDomain')"
                                            />
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="text-align: left">
                                            <span class="tip-info">
                                                <i class="el-icon-ali-tishi"></i>
                                                {{ $t('setting.bindDomainTip') }}
                                            </span>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="AccessKeyId" prop="accessKeyId">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-input
                                                v-model="formData.accessKeyId"
                                                :placeholder="$t('setting.inputAccessKeyId')"
                                            />
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="text-align: left">
                                            <span class="tip-info">
                                                <i class="el-icon-ali-tishi"></i>
                                                {{ $t('setting.accessKeyIdTip') }}
                                            </span>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="AccessKeySecret" prop="accessKeySecret">
                                    <el-col :span="8">
                                        <el-input
                                            v-model="formData.accessKeySecret"
                                            :placeholder="$t('setting.inputAccessKeySecret')"
                                        />
                                    </el-col>
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.accessKeySecretTip') }}
                                    </span>
                                </el-form-item>
                                <el-form-item :label="$t('setting.storageNode')" prop="endPoint">
                                    <el-col :span="8">
                                        <el-input
                                            v-model="formData.endPoint"
                                            :placeholder="$t('setting.inputStorageNode')"
                                        />
                                    </el-col>
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.storageNodeTip') }}
                                    </span>
                                </el-form-item>
                                <el-form-item :label="$t('setting.spaceName')" prop="bucket">
                                    <el-col :span="8">
                                        <el-input
                                            v-model="formData.bucket"
                                            :placeholder="$t('setting.inputSpaceName')"
                                        />
                                    </el-col>
                                    <span class="tip-info">
                                        <i class="el-icon-ali-tishi"></i>
                                        {{ $t('setting.spaceNameTip') }}
                                    </span>
                                </el-form-item>
                            </div>

                            <el-divider content-position="left">
                                {{ $t('setting.statisticalCode') }}
                            </el-divider>
                            <el-form-item
                                :label="$t('setting.baiduStatisticalCode')"
                                prop="baiduStatisticalCode"
                            >
                                <el-input
                                    v-model="formData.baiduStatisticalCode"
                                    :rows="4"
                                    :placeholder="$t('setting.inputBaiduStatisticalCode')"
                                    type="textarea"
                                />
                                <span class="tip-info">
                                    <i class="el-icon-ali-tishi"></i>
                                    {{ $t('setting.baiduStatisticalTip') }}
                                </span>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" class="footer">
                    <el-button :size="normalSize" round @click="resetForm('formData')">
                        {{ $t('action.cancel') }}
                    </el-button>
                    <el-button
                        :loading="editLoading"
                        :size="normalSize"
                        round
                        type="primary"
                        @click="submitForm"
                    >
                        {{ $t('action.submit') }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
        <map-position ref="mapPositionDialog" @chosed-location="chosedLocation" />
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import breadCrumb from '@/components/bread_crumb.vue';
import changeImageIcon from '@/components/change_image_icon.vue';
import mapPosition from '@/components/map_position.vue';
export default {
    components: {
        breadCrumb,
        changeImageIcon,
        mapPosition,
    },
    data() {
        const checkPrice = (rule, value, callback) => {
            var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error(this.$t('setting.inputNumberTip')));
            }
        };
        return {
            normalSize: 'default',
            activeName: 'platform',

            cascaderProps: {
                label: 'name',
                value: 'id',
                children: 'children',
            },
            areaList: [],

            editLoading: false,
            // 编辑界面数据
            formData: {
                shopName: this.$t('setting.myPlatform'), // 平台名称
                shopDesc: this.$t('setting.platformDescTip'), // 平台描述
                shopAddress: this.$t('setting.myPlatformAddress'), // 平台地址
                shopFiling: this.$t('setting.siteFiling'), // 备案信息
                shopLogo: '', // 平台logo
                shopFavicon: '', // Favicon图标
                shopDefaultImage: '', // 默认图
                shopMobile: '', // 联系手机号
                selfService: '2', // 开启门店自提
                cateStyle: 3, // 分类样式
                cateType: 1, // H5分类样式
                orderCancelTime: 1, // 订单取消时间
                orderCompleteTime: 30, // 订单完成时间
                orderAutoSignTime: 20, // 订单确认收货时间
                orderAutoEvalTime: 30, // 订单自动评价时间
                reminderPaymentTime: 1, // 订单提醒付款时间
                goodsStocksWarn: 10, // 库存警报数量
                returnContact: '', // 退货联系人
                returnContactInformation: '', // 退货联系方式
                returnAreaId: '', // 退货区域
                returnAddress: '', // 退货详细地址
                signPointType: 2, // 签到奖励类型
                signMinRandomPoint: 1, // 随机奖励积分最小值
                signMaxRandomPoint: 10, // 随机奖励积分最大值
                firstSignPoint: 1, // 首次奖励积分
                continuitySignAdditional: 1, // 连续签到追加
                dailySignMaxPoint: 10, // 单日最大奖励
                openPoint: 1, // 开启积分功能
                pointDiscountedProportion: 100, // 订单积分折现比例
                orderPointProportion: 10, // 订单积分使用比例
                orderRewardProportion: 1, // 订单积分奖励比例

                signAppointDateState: false, // 指定特殊日期状态
                signAppointDate: [], // 指定特殊日期
                signAppointDateType: 1, // 指定日期奖励类型
                signAppointDateRate: 2, // 指定日期倍率
                signAppointDateAdditional: 10, // 指定日期追加
                wxNickName: 'KerasMall', // 小程序名称

                // 小程序设置
                wxAppId: '', // AppId
                wxAppSecret: '', // AppSecret
                wxUserName: '', // 原始Id
                wxPrincipalName: this.$t('setting.company'), // 主体信息
                wxSignature: this.$t('setting.miniappDesc'), // 简介

                // 公众号设置
                wxOfficialName: '', // 公众号名称
                wxOfficialId: '', // 微信号
                wxOfficialAppId: '', // AppId
                wxOfficialAppSecret: '', // AppSecret
                wxOfficialSourceId: '', // 公众号原始ID
                wxOfficialToken: '', // 微信验证TOKEN
                wxOfficialEncodingAESKey: '', // EncodingAESKey
                wxOfficialType: 'service', // 公众号类型

                // 提现设置
                toCashLowMoney: 0, // 最低提现金额
                toCashRateMoney: 0, // 提现服务费率

                // 其他设置
                qqMapKey: '', // 腾讯地图key
                kuaidi100CorpCode: '', // 公司编号
                kuaidi100Key: '', // 授权key
                imageStorageType: 'local', // 图片存储引擎
                imageStorageParams: '', // 图片存储配置参数

                // 搜索发现关键字
                searchKeywords: this.$t('setting.searchKeywordsExample'), // 搜索发现关键词

                // 统计代码
                baiduStatisticalCode: '', // 百度统计代码

                // 发票开关
                invoicesNeed: 1, // 发票功能

                // APP设置
                wxAppAppId: '', // 微信APP支付appid
            },
            formDataRules: {
                shopName: [
                    {
                        required: true,
                        message: this.$t('setting.inputMyPlatform'),
                        trigger: 'blur',
                    },
                ],
                goodsStocksWarn: [
                    {
                        required: true,
                        message: this.$t('setting.inputStockAlertQuantity'),
                        trigger: 'blur',
                    },
                    { validator: checkPrice, trigger: 'blur' },
                ],
            },
        };
    },
    mounted() {
        this.getSettings();
        this.getAreaList();
    },
    methods: {
        /**
         * 地区列表
         */
        async getAreaList() {
            const _result = await this.$api.area.getTree();
            if (_result.succeed === 1 && _result.code === 200) {
                this.areaList = _result.data.list;
            }
        },
        changePosition() {
            this.$refs.mapPositionDialog.setMapDialogVisible(true);
        },
        chosedLocation(position) {
            this.formData.returnAddress = position.address;
            this.$refs.mapPositionDialog.setMapDialogVisible(false);
        },
        ...mapMutations(['setGlobalVariables']),
        chosedShopLogo(chosed) {
            if (chosed) {
                this.formData.shopLogo = chosed.path;
            }
        },
        chosedShopDefaultImage(chosed) {
            this.formData.shopDefaultImage = chosed.path;
        },
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        this.$t('permission.confirmSubmit'),
                        this.$t('common.tip'),
                        {}
                    ).then(async () => {
                        this.editLoading = true;
                        const data = Object.assign({}, this.formData);

                        const _result = await this.$api.setting.save({
                            key: 'global_variables',
                            value: data,
                        });
                        if (_result.succeed === 1 && _result.code === 200) {
                            this.setGlobalVariables(_result.data);
                            this.$notify({
                                title: this.$t('common.success'),
                                message: _result.description,
                                type: 'success',
                            });
                        } else {
                            this.$notify.error({
                                title: this.$t('common.error'),
                                message: _result.description,
                            });
                        }

                        this.editLoading = false;
                    });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getSettings() {
            const _result = await this.$api.setting.get({ key: 'global_variables' });
            if (_result.succeed === 1 && _result.code === 200) {
                Object.assign(this.formData, _result.data);
                console.log(this.formData);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.page-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.settings-tabs {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;

    .el-tabs__content {
        padding: 20px 0;
    }
}

.tip-info {
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
}

.style-radio-group {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
}

.style-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 220px;
    padding: 0 15px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        border-color: #e6e6e6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
        background-color: #f8fbff;
    }
}

.style-header {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
}

.style-radio {
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
}

.style-label {
    font-weight: 500;
    font-size: 14px;
}

.card-item {
    width: 100%;
    max-width: 220px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    overflow: hidden;

    .el-image {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 180px;
        background-color: #fafafa;
    }

    .summary {
        padding: 8px 5px;
        font-weight: 200;
        font-size: 12px;
        white-space: pre-wrap;
        text-align: center;
        margin-top: auto;
        background-color: #f5f5f5;
        border-top: 1px solid #e6e6e6;
    }
}

.image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 180px;
    background-color: #fafafa;

    i {
        font-size: 64px;
        color: #c0c4cc;
    }
}

.style-selection-container {
    width: 100%;
}

// 响应式设计
@media (max-width: 768px) {
    .page-container {
        padding: 10px;
    }

    .settings-tabs {
        padding: 15px;
    }

    .style-radio-group {
        flex-direction: column;
        gap: 15px;
    }

    .style-option {
        min-width: 100%;
    }

    .card-item {
        max-width: 100%;
    }
}
</style>
