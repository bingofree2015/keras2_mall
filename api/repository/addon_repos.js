const { ADDON_PATH } = require('config');
const { exists } = require('mz/fs');
const { pick } = require('lodash');

const { Addon } = require('../models');

const logger = require('tracer').colorConsole();

class AddonRepos {
  constructor () {
    this._instance = null;
    this.INSTALL_STATUS = 1; // 已安装
    this.UNINSTALL_STATUS = 0; // 未安装
    this.STATUS_DISENABLE = 2; // 禁用
  }

  /**
   * 获取插件列表
   * @return array
   */
  async getList () {
    const _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '获取失败', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    if (!ADDON_PATH) {
      _result.description = '插件路径缺失';
      return _result;
    }

    if (await exists(ADDON_PATH)) {
      _result.description = '插件目录不可读或者不存在';
      return _result;
    }

    // todo
  }

  /**
   * 获取插件信息
   * @param {*} name
   * @return array
   */
  async getAddonInfo (name) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };

    try {
      const _addon = Addon.findAll({ where: { name }, raw: true });
      _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: _addon,
      };
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  /**
   * 获取配置信息
   * @param name
   * @return mixed
   */
  async getSetting (name) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _addon = Addon.findOne({ where: { name }, raw: true });
      if (_addon && _addon.config) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _addon.config,
        };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }
    return _result;
  }

  /**
   * 保存插件信息
   * @param {名称} name
   * @param {配置信息} setting
   */
  async doSetting (name, setting) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _addon = Addon.findOne({ where: { name }, raw: true });
      if (_addon) {
        await Addon.update({ config: setting }, { where: { id: _addon.id } });
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _addon,
        };
      } else {
        Object.assign(_result, { code: 201, description: '记录不存在' });
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }
    return _result;
  }

  /**
   * 添加插件
   * @param {addon对象} data
   */
  async add (data) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _data = pick(data, ['name', 'title'], 'description', 'author', 'version');
      Object.assign(_data, { status: this.INSTALL_STATUS });
      const _addon = await Addon.create(_data);
      Object.assign(_result, {
        succeed: 1,
        code: 200,
        description: '成功',
        data: _addon,
      });
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  /**
   * 根据名称获取插件信息
   * @param {名称} name
   */
  async getAddonByName (name = '') {
    const _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      const _addon = await Addon.findOne({ where: { name }, raw: true });
      Object.assign(_result, {
        succeed: 1,
        code: 200,
        description: '成功',
        data: _addon,
      });
    } catch (err) {
      logger.error(err);
      Object.assign(_result, { code: 500, description: err.message || err.stack || '系统错误' });
    }
    return _result;
  }

  /**
   * 插件启用，停用
   * @param {名称} name
   */
  async changeStatus (name) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '未知错误',
      data: null,
    };
    try {
      if (name) {
        let _addon = await Addon.findOne({ where: { name }, raw: true });
        if (_addon) {
          const _status =
            _addon.status == this.INSTALL_STATUS ? this.STATUS_DISENABLE : this.INSTALL_STATUS;
          _addon = await Addon.update({ status: _status }, { where: { id: _addon.id } });
          Object.assign(_result, {
            succeed: 1,
            code: 200,
            description: '成功',
            data: _addon,
          });
        } else {
          Object.assign(_result, { code: 101, description: '不存在' });
        }
      } else {
        Object.assign(_result, { code: 101, description: '参数错误' });
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }
    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new AddonRepos();
    }
    return this._instance;
  }
}

module.exports = AddonRepos.getInstance();
