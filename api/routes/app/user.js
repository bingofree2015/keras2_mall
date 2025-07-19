/**
 * 会员等级 */
const Router = require('@koa/router');
const _ = require('lodash');
const userRepos = require('../../repository/user/user_repos');

const userRouter = Router({ prefix: '/user' });

userRouter.get('/', (ctx) => {
  ctx.body = '用户相关接口';
});
/**
 * 登陆
 *  platform
 * 1: 就是h5登陆（h5端和微信公众号端）
 * 2: 就是微信小程序登陆
 * 3: 是支付宝小程序
 * 4: 是app
 * 5: 是pc
 * */
userRouter.post('/login', async (ctx) => {
  const { username, pwd, platform = 1 } = ctx.request.body;
  const _loginType = 2; //  1:session 登录; 2:token登录

  const _result = await userRepos.login(username, pwd, _loginType, platform);
  ctx.body = _result;
});
/**
 * 短信验证码登陆，手机短信验证注册账号
 * mobile       手机号码，必填
 * code         手机验证码，必填
 * invitecode   邀请码，推荐人的邀请码 选填
 * password     注册的时候，可以传密码 选填
 * user_wx_id   第三方登录，微信公众号里的登陆，微信小程序登陆等需要绑定账户的时候，要传这个参数，这是第一次的时候需要这样绑定，以后就不需要了  选填
 * */
userRouter.post('/sms_login', async (ctx) => {
  const { username, pwd, platform = 1 } = ctx.request.body;
  const _loginType = 2; //  1:session 登录; 2:token登录

  const _result = await userRepos.smsLogin(username, pwd, _loginType, platform);
  ctx.body = _result;
});

/**
 * 小程序创建用户,不登陆,只是保存登录态
 */
userRouter.post('/wx_login', async (ctx) => {
  const { type = 'weixin', code } = ctx.request.body;
  const _result = null;
  if (type == 'weixin') {
  } else if (type == 'alipay') {
  }
  ctx.body = _result;
});
/**
 * 微信小程序传过来了手机号码,取手机号码
 */
userRouter.post('/wx_login_width_mobile', async (ctx) => {
  const { open_id, iv, edata } = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 发送登陆注册短信
 * type为 1:注册;2:登陆
 */
userRouter.post('/send_code', async (ctx) => {
  const { mobile, type } = ctx.request.body;

  const _result = null;
  ctx.body = _result;
});
/**
 * 退出
 */
userRouter.post('/logout', async (ctx) => {
  const { token } = ctx.request.body;

  // 从表中删除 token

  const _result = null;
  ctx.body = _result;
});
/**
 * 用户信息
 */
userRouter.post('/get_userinfo', async (ctx) => {
  const { userId } = ctx.request.body;

  // 从表中取用户信息

  const _result = null;
  ctx.body = _result;
});
/**
 * 更换头像
 */
userRouter.post('/change_avatar', async (ctx) => {
  const { userId, imgUrl } = ctx.request.body;

  // 更新用户表中的 attachment信息

  const _result = null;
  ctx.body = _result;
});
/**
 * 编辑用户信息
 */
userRouter.post('/edit_info', async (ctx) => {
  const {
    userId, sex, birthday, nickname,
  } = ctx.request.body;

  // 更新用户信息

  const _result = null;
  ctx.body = _result;
});
/**
 * 添加商品浏览足迹
 */
userRouter.post('/create_goods_browsing', async (ctx) => {
  const { userId, goodsId } = ctx.request.body;
  // 记录历史
  const _result = null;
  ctx.body = _result;
});
/**
 * 删除商品浏览足迹
 */
userRouter.post('/delete_goods_browsing', async (ctx) => {
  const { goodsIds } = ctx.request.body;
  // 记录历史
  const _result = null;
  ctx.body = _result;
});
/**
 * 取得商品浏览足迹
 */
userRouter.post('/get_goods_browsing_list', async (ctx) => {
  const { userId, limit, page } = ctx.request.body;
  // 记录历史
  const _result = null;
  ctx.body = _result;
});
/**
 * 添加商品收藏（关注）
 */
userRouter.post('/create_goods_collection', async (ctx) => {
  const { userId, goodsId } = ctx.request.body;
  // 添加收藏
  const _result = null;
  ctx.body = _result;
});
/**
 * 取得商品收藏记录（关注）
 */
userRouter.post('/get_goods_collection_list', async (ctx) => {
  const { userId, limit, page } = ctx.request.body;
  // 添加收藏
  const _result = null;
  ctx.body = _result;
});
/**
 * 存储用户收货地址
 */
userRouter.post('/create_user_ship', async (ctx) => {
  const {
    userId, username, areaId, address, mobile, isDef,
  } = ctx.request.body;
  // 添加用户收货地址
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取收货地址详情
 */
userRouter.post('/get_ship_info', async (ctx) => {
  const { userId, id } = ctx.request.body;
  // 获取收货地址详情
  const _result = null;
  ctx.body = _result;
});
/**
 * 编辑收货地址
 */
userRouter.post('/edit_ship', async (ctx) => {
  const {
    userId, id, name, areaId, address, mobile, isDef,
  } = ctx.request.body;
  // 编辑收货地址
  const _result = null;
  ctx.body = _result;
});
/**
 * 删除收货地址
 */
userRouter.post('/delete_ship', async (ctx) => {
  const { userId, id } = ctx.request.body;
  // 删除收货地址
  const _result = null;
  ctx.body = _result;
});
/**
 * 设置默认地址
 */
userRouter.post('/set_default_ship', async (ctx) => {
  const { userId, id } = ctx.request.body;
  // 设置默认地址
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取用户收货地址列表
 */
userRouter.post('/get_user_ship_list', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取用户收货地址列表
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取收货地址全部名称
 */
userRouter.post('/get_full_address', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取收货地址全部名称
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取最终地区ID
 */
userRouter.post('/get_area_id', async (ctx) => {
  const {
    provinceName, cityName, countyName, postalCode,
  } = ctx.request.body;

  // 获取最终地区ID
  const _result = null;
  ctx.body = _result;
});
/**
 * 支付
 */
userRouter.post('/pay', async (ctx) => {
  const {
    ids, payment_code, payment_type, params,
  } = ctx.request.body;

  // 生成支付单,并发起支付
  const _result = null;
  ctx.body = _result;
});
/**
 * 评价商品
 */
userRouter.post('/reviews_goods', async (ctx) => {
  const { userId, items, orderId } = ctx.request.body;

  // 评价商品,并发起支付
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取用户默认收货地址
 */
userRouter.post('/get_user_default_ship', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取用户默认收货地址
  const _result = null;
  ctx.body = _result;
});
/**
 * 判断是否签到
 */
userRouter.post('/check_is_signed', async (ctx) => {
  const { userId } = ctx.request.body;

  // 判断是否签到
  const _result = null;
  ctx.body = _result;
});
/**
 * 签到
 */
userRouter.post('/sign', async (ctx) => {
  const { userId } = ctx.request.body;

  // 签到
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取签到信息
 */
userRouter.post('/get_sign_info', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取签到信息
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取用户积分
 */
userRouter.post('/get_user_point', async (ctx) => {
  const { userId, orderMoney } = ctx.request.body;

  // 获取用户积分
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取我的银行卡列表
 */
userRouter.post('/get_bank_card_list', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取我的银行卡列表
  const _result = null;
  ctx.body = _result;
});
/**
 * 获取默认的银行卡
 */
userRouter.post('/get_default_bank_card', async (ctx) => {
  const { userId } = ctx.request.body;

  // 获取我的银行卡列表
  const _result = null;
  ctx.body = _result;
});
/**
 * 添加银行卡
 */
userRouter.post('/create_bank_card', async (ctx) => {
  const {
    bankName, bankCode, areaId, accountBank, accountName, cardNumber, cardType, isDefault,
  } =
    ctx.request.body;

  // 添加银行卡
  const _result = null;
  ctx.body = _result;
});
/**
 * 删除银行卡
 */
userRouter.post('/delete_bank_card', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 设置默认银行卡
 */
userRouter.post('/set_default_bank_card', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取银行卡信息
 */
userRouter.post('/get_bank_card_info', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取银行卡组织信息
 */
userRouter.post('/get_bank_card_organization', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 用户修改密码
 */
userRouter.post('/edit_pwd', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 用户找回密码
 */
userRouter.post('/forgot_pwd', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取我的余额明细
 */
userRouter.post('/get_my_balance', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取用户推荐列表
 */
userRouter.post('/get_my_invited_friends_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 邀请码
 */
userRouter.post('/get_invite_code', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 用户提现申请
 */
userRouter.post('/apply_cash_out', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取用户提现记录
 */
userRouter.post('/get_user_cash_list', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取信任登录内容，标题，图标，名称，跳转地址
 */
userRouter.post('/getTrustLogin', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 根据code 获取用户信息
 */
userRouter.post('/trustCallBack', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 用户手机号绑定,然后调用登录，返回登录信息
 */
userRouter.post('/trustBind', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 是否开启积分
 */
userRouter.post('/isPoint', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取我的要求相关信息
 */
userRouter.post('/myInvite', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 设置我的上级邀请人
 */
userRouter.post('/activationInvite', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 用户积分明细
 */
userRouter.post('/userPointLog', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取省市区信息
 */
userRouter.post('/getAreaList', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 生成海报
 */
userRouter.post('/getPoster', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = userRouter;
