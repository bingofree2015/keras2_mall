const _ = require('lodash');
const validator = require('validator');
const { Form, FormItem, Attachment } = require('../../models');

const logger = require('tracer').colorConsole();

class FormRepos {
  constructor () {
    this._instance = null;
  }

  async create (form) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(form).forEach((field) => {
        if (!form[field] && form[field] != 0) {
          delete form[field];
        }
      });
      if (form.name) {
        let _form = await Form.findOne({ where: { name: form.name }, raw: true });
        if (_form) {
          _result = { succeed: 0, code: 101, description: '名称重复' };
        } else {
          _form = await Form.create(form);
          // 批量插入
          if (Array.isArray(form.formItems) && form.formItems.length > 0) {
            const _formItems = [];
            for (const _formItem of form.formItems) {
              _formItems.push({ ..._formItem, formId: _form.id });
            }
            await FormItem.bulkCreate(_formItems, {
              updateOnDuplicate: [
                'name',
                'type',
                'validationType',
                'value',
                'defaultValue',
                'formId',
                'required',
                'sort',
              ],
            });
          }

          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...form, id: _form.id },
          };
        }
      } else {
        _result = { succeed: 0, code: 100, description: `参数错误 -> form:${JSON.stringify(form)}` };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async delete (ids) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      if (Array.isArray(ids) && ids.length > 0) {
        const _affectedCount = await Form.destroy({ where: { id: ids } });
        if (_affectedCount == 0) {
          _result = { succeed: 0, code: 102, description: '记录不存在' };
        } else {
          _result = { succeed: 1, code: 200, description: '成功' };
        }
      } else {
        _result = { succeed: 0, code: 100, description: '参数错误' };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async update (id, form) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _bulkCreate = async (formId, formItems) => {
      // 批量插入
      if (Array.isArray(formItems) && formItems.length > 0) {
        // 删除数据
        const _formItems = await FormItem.findAll({
          attributes: ['id'],
          where: { formId },
          raw: true,
        });
        const _oldIds = [];
        _formItems.forEach((v) => {
          _oldIds.push(v.id);
        });
        const _newIds = formItems.map((v) => v.id).filter((v) => v);
        const _delIds = _oldIds
          .map((v) => {
            if (!_newIds.includes(v)) {
              return v;
            }
          })
          .filter((v) => v);
        if (_delIds.length > 0) {
          await FormItem.destroy({ where: { id: _delIds } });
        }
        // 更新与插入
        const _formItemDatas = [];
        for (const _formItem of formItems) {
          _formItemDatas.push({ ..._formItem, formId });
        }
        await FormItem.bulkCreate(_formItemDatas, {
          updateOnDuplicate: [
            'name',
            'type',
            'validationType',
            'value',
            'defaultValue',
            'formId',
            'required',
            'sort',
          ],
        });
      }
    };

    try {
      Object.keys(form).forEach((field) => {
        if (!form[field] && form[field] != 0) {
          delete form[field];
        }
      });
      if (id) {
        const _name = form.name;
        if (_name) {
          let _form = await Form.findOne({ where: { id, name: _name }, raw: true });
          if (_form) {
            const _ret = await Form.update(form, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              await _bulkCreate(id, form.formItems);
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...form, id },
              };
            }
          } else {
            _form = await Form.findOne({ where: { name: _name, id: { $ne: id } }, raw: true });
            if (_form) {
              _result = { succeed: 0, code: 101, description: `名称 [${_name}] 重复` };
            } else {
              const _ret = await Form.update(form, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                await _bulkCreate(id, form.formItems);
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...form, id },
                };
              }
            }
          }
        } else {
          const _ret = await Form.update(form, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            await _bulkCreate(id, form.formItems);
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...form, id },
            };
          }
        }
      } else {
        _result = { succeed: 0, code: 100, description: `参数错误 -> id:${id}` };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }

    return _result;
  }

  async get (id) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _form = await Form.findOne({
        include: [
          {
            model: FormItem,
            attributes: FormItem.getAttributes(),
            as: 'formItems',
            require: false,
          },
        ],
        where: { id },
      });
      if (_form) {
        let _headTypeValues = [];
        if (_form.headTypeValue) {
          _headTypeValues = _form.headTypeValue.split(',').map((v) => {
            if (validator.isInt(v)) {
              return Number.parseInt(v);
            }
          });
        }
        if (_headTypeValues.length > 0) {
          const _attachments = await Attachment.findAll({
            where: { id: _headTypeValues },
            raw: true,
          });
          _form.setDataValue('headTypeValues', _attachments);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _form,
        };
      } else {
        _result = { succeed: 0, code: 102, description: '数据不存在' };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err.message || err.stack || '系统错误' };
    }
    return _result;
  }

  async list (searchKey, offset, limit) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    const _where = {};
    const _excludeKeys = [];
    if (searchKey) {
      Object.keys(searchKey).forEach((field) => {
        if (!searchKey[field] && searchKey[field] != 0) {
          delete searchKey[field];
        }
      });
      for (const _key in searchKey) {
        if (typeof searchKey[_key] === 'string' && !_excludeKeys.includes(_key)) {
          _where[_key] = {
            $like: `%${searchKey[_key]}%`,
          };
        } else {
          _where[_key] = searchKey[_key];
        }
      }
    }

    const _datas = [];
    try {
      if ((offset == 0 || offset) && limit) {
        const _forms = await Form.findAndCountAll({
          where: _where,
          offset,
          limit,
        });
        for (const _form of _forms.rows) {
          _datas.push(_form);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _forms.count },
        };
      } else {
        const _forms = await Form.findAll({
          where: _where,
        });
        for (const _form of _forms) {
          _datas.push(_form);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas },
        };
      }
    } catch (err) {
      logger.error(err);
      _result = { succeed: 0, code: 500, description: err };
    }

    return _result;
  }

  /**
   * 获取表单明细 前端API接口
   * @param {表单id} id
   */
  async getFormInfo (id) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      const _form = await Form.findOne({
        include: [
          {
            model: FormItem,
            attributes: FormItem.getAttributes(),
            as: 'formItems',
            require: false,
          },
        ],
        where: { id },
      });
      if (_form) {
        // 检查表单是否需要登录
        // 检查表单是否过期

        // #region  将 id 值转换为 url 地址
        let _headTypeValues = [];
        if (_form.headTypeValue) {
          _headTypeValues = _form.headTypeValue.split(',').map((v) => {
            if (validator.isInt(v)) {
              return Number.parseInt(v);
            }
          });
        }
        if (_headTypeValues.length > 0) {
          const _attachments = await Attachment.findAll({
            attributes: ['id', 'path'],
            where: { id: _headTypeValues },
            raw: true,
          });
          _form.setDataValue('headTypeValues', _attachments);
        }
        // #endregion

        // #region 将表单明细里的每一项转换为前端可识别的内容
        for (const _formItem of _form.formItems) {
        }
        // #endregion

        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _form,
        };
      } else {
        _result = { succeed: 0, code: 102, description: '数据不存在' };
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
      this._instance = new FormRepos();
    }
    return this._instance;
  }
}

module.exports = FormRepos.getInstance();
