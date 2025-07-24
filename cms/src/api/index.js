/*
 * 接口统一集成模块
 */
import axios from './axios';

import attachGroup from './modules/attach/attach_group';
import attachment from './modules/attach/attachment';

import brand from './modules/goods/brand';
import goods from './modules/goods';
import goodsCat from './modules/goods/goods_cat';
import goodsSpec from './modules/goods/goods_spec';
import goodsParam from './modules/goods/goods_param';
import goodsType from './modules/goods/goods_type';
import goodsComment from './modules/goods/goods_comment';

import sysUser from './modules/permission/sys_user';
import role from './modules/permission/role';
import menu from './modules/permission/menu';

import setting from './modules/preference/setting';
import operationLog from './modules/preference/operation_log';
import ship from './modules/preference/ship';
import store from './modules/preference/store';
import task from './modules/preference/task';
import messageCenter from './modules/preference/message_center';
import area from './modules/preference/area';
import logistics from './modules/preference/logistics';

import userGrade from './modules/user/user_grade';
import user from './modules/user';

import order from './modules/order';
import delivery from './modules/order/bill_delivery';
import lading from './modules/order/bill_lading';
import afterSale from './modules/order/bill_after_sale';
import reship from './modules/order/bill_reship';

import balance from './modules/pay/balance';
import pay from './modules/pay';
import billPayment from './modules/pay/bill_payment';
import billRefund from './modules/pay/bill_refund';
import userToCash from './modules/pay/user_to_cash';

import dict from './modules/system/dict';
import log from './modules/system/log';
import db from './modules/system/db';

import articleType from './modules/marketing/article_type';
import article from './modules/marketing/article';
import advertPosition from './modules/marketing/advert_position';
import advertisement from './modules/marketing/advertisement';
import notice from './modules/marketing/notice';

import promotion from './modules/promotion';
import spTarget from './modules/promotion/sp_target';
import spRule from './modules/promotion/sp_rule';
import coupon from './modules/promotion/coupon';

import report from './modules/report';

import weixinMessage from './modules/wechat/weixin_message';
import weixinMediaMessage from './modules/wechat/weixin_media_message';

import page from './modules/page';

import form from './modules/form';
import formSubmit from './modules/form/form_submit';

const mapAlias = () => {
    return axios({ url: 'cms/map_alias', method: 'get' });
};

// 默认全部导出
export default {
    attachGroup,
    attachment,
    sysUser,
    role,
    menu,
    dict,
    setting,
    operationLog,
    ship,
    store,
    task,
    messageCenter,
    area,
    logistics,
    log,
    userGrade,
    user,
    db,
    brand,
    goods,
    goodsCat,
    goodsSpec,
    goodsParam,
    goodsType,
    goodsComment,
    order,
    delivery,
    lading,
    afterSale,
    reship,
    pay,
    balance,
    billPayment,
    billRefund,
    userToCash,
    articleType,
    article,
    advertPosition,
    advertisement,
    notice,
    promotion,
    spTarget,
    spRule,
    coupon,
    report,
    weixinMessage,
    weixinMediaMessage,
    page,
    form,
    formSubmit,
    mapAlias,
};
