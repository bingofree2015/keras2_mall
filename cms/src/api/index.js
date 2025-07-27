/*
 * 接口统一集成模块
 */
import axios from '@/api/axios';

import attachGroup from '@/api/modules/attach/attach_group';
import attachment from '@/api/modules/attach/attachment';

import brand from '@/api/modules/goods/brand';
import goods from '@/api/modules/goods';
import goodsCat from '@/api/modules/goods/goods_cat';
import goodsSpec from '@/api/modules/goods/goods_spec';
import goodsParam from '@/api/modules/goods/goods_param';
import goodsType from '@/api/modules/goods/goods_type';
import goodsComment from '@/api/modules/goods/goods_comment';

import sysUser from '@/api/modules/permission/sys_user';
import role from '@/api/modules/permission/role';
import menu from '@/api/modules/permission/menu';

import setting from '@/api/modules/preference/setting';
import operationLog from '@/api/modules/preference/operation_log';
import ship from '@/api/modules/preference/ship';
import store from '@/api/modules/preference/store';
import task from '@/api/modules/preference/task';
import messageCenter from '@/api/modules/preference/message_center';
import area from '@/api/modules/preference/area';
import logistics from '@/api/modules/preference/logistics';

import userGrade from '@/api/modules/user/user_grade';
import user from '@/api/modules/user';

import order from '@/api/modules/order';
import delivery from '@/api/modules/order/bill_delivery';
import lading from '@/api/modules/order/bill_lading';
import afterSale from '@/api/modules/order/bill_after_sale';
import reship from '@/api/modules/order/bill_reship';

import balance from '@/api/modules/pay/balance';
import pay from '@/api/modules/pay';
import billPayment from '@/api/modules/pay/bill_payment';
import billRefund from '@/api/modules/pay/bill_refund';
import userToCash from '@/api/modules/pay/user_to_cash';

import dict from '@/api/modules/system/dict';
import log from '@/api/modules/system/log';
import db from '@/api/modules/system/db';

import articleType from '@/api/modules/marketing/article_type';
import article from '@/api/modules/marketing/article';
import advertPosition from '@/api/modules/marketing/advert_position';
import advertisement from '@/api/modules/marketing/advertisement';
import notice from '@/api/modules/marketing/notice';

import promotion from '@/api/modules/promotion';
import spTarget from '@/api/modules/promotion/sp_target';
import spRule from '@/api/modules/promotion/sp_rule';
import coupon from '@/api/modules/promotion/coupon';

import report from '@/api/modules/report';

import weixinMessage from '@/api/modules/wechat/weixin_message';
import weixinMediaMessage from '@/api/modules/wechat/weixin_media_message';

import page from '@/api/modules/page';

import form from '@/api/modules/form';
import formSubmit from '@/api/modules/form/form_submit';

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
