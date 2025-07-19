const isJSON = require('is-json');
const _ = require('lodash');
const validator = require('validator');
const { Setting } = require('../../models');

const logger = require('tracer').colorConsole();

class SettingRepos {
  constructor () {
    this._instance = null;
    this._defaultValues = {
      shop_name: {
        name: '平台名称',
        value: '我的平台',
      },
      shop_desc: {
        name: '平台描述',
        value: '平台描述会展示在前台及微信分享店铺描述',
      },
      shop_address: {
        name: '平台地址',
        value: '我的平台地址',
      },
      shop_beian: {
        name: '备案信息',
        value: '网站备案信息',
      },
      shop_logo: {
        name: '平台logo',
        value: '',
      },
      shop_favicon: {
        name: 'Favicon图标',
        value: '',
      },
      shop_default_image: {
        name: '默认图',
        value: '',
      },
      shop_mobile: {
        name: '联系手机号',
        value: '',
      },
      store_switch: {
        name: '开启门店自提',
        value: '2',
      },
      cate_style: {
        name: '分类样式',
        value: 3,
      },
      cate_type: {
        name: 'H5分类样式',
        value: 1,
      },
      order_cancel_time: {
        name: '订单取消时间',
        value: '1',
      },
      order_complete_time: {
        name: '订单完成时间',
        value: '30',
      },
      order_autoSign_time: {
        name: '订单确认收货时间',
        value: '20',
      },
      order_autoEval_time: {
        name: '订单自动评价时间',
        value: '30',
      },
      remind_order_time: {
        name: '订单提醒付款时间',
        value: '1',
      },
      goods_stocks_warn: {
        name: '库存警报数量',
        value: '10',
      },
      // 'is_author': {         //此字段不显示到前台，在控制器中直接进行操作的，对商户不可见
      //  name : '是否授权',
      //   value : ''
      // },
      reship_name: {
        name: '退货联系人',
        value: '',
      },
      reship_mobile: {
        name: '退货联系方式',
        value: '',
      },
      reship_area_id: {
        name: '退货区域',
        value: '',
      },
      reship_address: {
        name: '退货详细地址',
        value: '',
      },
      sign_point_type: {
        name: '签到奖励类型',
        value: 2,
      },
      sign_random_min: {
        name: '随机奖励积分最小值',
        value: 1,
      },
      sign_random_max: {
        name: '随机奖励积分最大值',
        value: 10,
      },
      first_sign_point: {
        name: '首次奖励积分',
        value: 1,
      },
      continuity_sign_additional: {
        name: '连续签到追加',
        value: 1,
      },
      sign_most_point: {
        name: '单日最大奖励',
        value: 10,
      },
      point_switch: {
        name: '开启积分功能',
        value: 1,
      },
      point_discounted_proportion: {
        name: '订单积分折现比例',
        value: 100,
      },
      orders_point_proportion: {
        name: '订单积分使用比例',
        value: 10,
      },
      orders_reward_proportion: {
        name: '订单积分奖励比例',
        value: 1,
      },

      sign_appoint_date_status: {
        name: '指定特殊日期状态',
        value: false,
      },
      sign_appoint_date: {
        name: '指定特殊日期',
        value: '',
      },
      sign_appoint_data_type: {
        name: '指定日期奖励类型',
        value: 1,
      },
      sign_appoint_date_rate: {
        name: '指定日期倍率',
        value: 2,
      },
      sign_appoint_date_additional: {
        name: '指定日期追加',
        value: 10,
      },
      wx_nick_name: {
        name: '小程序名称',
        value: 'JSHOP',
      },
      // 小程序设置
      wx_appid: {
        // 小程序id
        name: 'AppId',
        value: '',
      },
      wx_app_secret: {
        name: 'AppSecret',
        value: '',
      },
      wx_user_name: {
        name: '原始Id',
        value: '',
      },
      wx_principal_name: {
        name: '主体信息',
        value: '河南吉海网络科技有限公司',
      },
      wx_signature: {
        name: '简介',
        value: 'Jshop小程序是一款标准B2C商城小程序',
      },
      // 小程序logo,暂时注释掉了。
      // 'wx_head_img': [
      //    name: 'Logo',
      //    value: ''
      // },
      // 'sms_user_id' : {
      //    name : '短信通道用户ID',
      //    value : ''
      // },
      // 'sms_account' : {
      //    name : '短信通道用户名',
      //    value : ''
      // },
      // 'sms_password' : {
      //    name : '短信通道用户密码',
      //    value : ''
      // },
      // 'sms_prefix' : {
      //    name : '短信前缀',
      //    value : 'Jshop'
      // },
      // 公众号设置
      wx_official_name: {
        name: '公众号名称',
        value: '',
      },
      wx_official_id: {
        name: '微信号',
        value: '',
      },
      wx_official_appid: {
        name: 'AppId',
        value: '',
      },
      wx_official_app_secret: {
        name: 'AppSecret',
        value: '',
      },
      wx_official_source_id: {
        name: '公众号原始ID',
        value: '',
      },
      wx_official_token: {
        name: '微信验证TOKEN',
        value: '',
      },
      wx_official_encodeaeskey: {
        name: 'EncodingAESKey',
        value: '',
      },
      wx_official_type: {
        name: '公众号类型',
        value: 'service',
      },
      // 提现设置
      tocash_money_low: {
        name: '最低提现金额',
        value: '0',
      },
      tocash_money_rate: {
        name: '提现服务费率',
        value: '0',
      },
      // 其他设置
      qq_map_key: {
        name: '腾讯地图key',
        value: '',
      },
      kuaidi100_customer: {
        name: '公司编号',
        value: '',
      },
      kuaidi100_key: {
        name: '授权key',
        value: '',
      },
      image_storage_type: {
        name: '图片存储引擎',
        value: 'Local',
      },
      image_storage_params: {
        name: '图片存储配置参数',
        value: '',
      },
      // 搜索发现关键字
      recommend_keys: {
        name: '搜索发现关键词',
        value: '羽绒服 iphone 小米mix',
      },
      // 统计代码
      statistics_code: {
        name: '百度统计代码',
        value: '',
      },
      // 发票开关
      invoice_switch: {
        name: '发票功能',
        value: 1,
      },
      // APP设置
      wx_app_appid: {
        // 微信支付在app上的appid
        name: '微信APP支付appid',
        value: '',
      },
    };
  }

  /**
   * 设置参数
   * @param {数据} settings
   */
  async save (key, value) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };
    try {
      if (_.isObject(value)) {
        const _setting = await Setting.findOne({ where: { key } });
        if (_setting) {
          await Setting.update({ value }, { where: { key } });
        } else {
          await Setting.create({ key, value });
        }
        Object.assign(_result, {
          succeed: 1,
          code: 200,
          description: '成功',
          data: value,
        });
      } else {
        Object.assign(_result, { succeed: 0, code: 101, description: '参数错误' });
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  /**
   * 取得参数
   * @param {主键} key
   */
  async get (key) {
    const _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _setting = await Setting.findOne({ where: { key }, raw: true });
      if (_setting) {
        Object.assign(_result, {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _setting.value,
        });
      } else {
        Object.assign(_result, { code: 102, description: '数据不存在' });
      }
    } catch (err) {
      Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
    }
    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new SettingRepos();
    }
    return this._instance;
  }
}

module.exports = SettingRepos.getInstance();
