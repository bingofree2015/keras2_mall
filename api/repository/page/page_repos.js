const { Page, PageItem } = require('../../models');

const logger = require('tracer').colorConsole();

class PageRepos {
  constructor () {
    this._instance = null;
  }

  async create (page) {
    let _result = {
      succeed: 0, // 1:成功0:失败
      code: 0, // 错误码
      description: '', // 错误信息
      data: null, // 本身就是一个json字符串
    };

    try {
      Object.keys(page).forEach((field) => {
        if (!page[field] && page[field] != 0) {
          delete page[field];
        }
      });
      if (page.code) {
        let _page = await Page.findOne({ where: { code: page.code }, raw: true });
        if (_page) {
          _result = { succeed: 0, code: 101, description: '编码重复' };
        } else {
          _page = await Page.create(page);
          _result = {
            succeed: 1,
            code: 200,
            description: '成功',
            data: { ...page, id: _page.id },
          };
        }
      } else {
        _result = { succeed: 0, code: 100, description: `参数错误 -> page:${JSON.stringify(page)}` };
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
        const _affectedCount = await Page.destroy({ where: { id: ids } });
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

  async update (id, page) {
    let _result = {
      succeed: 0,
      code: 0,
      description: '',
      data: null,
    };

    try {
      Object.keys(page).forEach((field) => {
        if (!page[field] && page[field] != 0) {
          delete page[field];
        }
      });
      if (id) {
        const _code = page.code;
        if (_code) {
          let _page = await Page.findOne({ where: { id, code: _code }, raw: true });
          if (_page) {
            const _ret = await Page.update(page, { where: { id } });
            const _affectedCount = _ret[0];
            if (_affectedCount == 0) {
              _result = { succeed: 0, code: 102, description: '记录不存在' };
            } else {
              _result = {
                succeed: 1,
                code: 200,
                description: '成功',
                data: { ...page, id },
              };
            }
          } else {
            _page = await Page.findOne({ where: { name: _code, id: { $ne: id } }, raw: true });
            if (_page) {
              _result = { succeed: 0, code: 101, description: `名称 [${_code}] 重复` };
            } else {
              const _ret = await Page.update(page, { where: { id } });
              const _affectedCount = _ret[0];
              if (_affectedCount == 0) {
                _result = { succeed: 0, code: 102, description: '记录不存在' };
              } else {
                _result = {
                  succeed: 1,
                  code: 200,
                  description: '成功',
                  data: { ...page, id },
                };
              }
            }
          }
        } else {
          const _ret = await Page.update(page, { where: { id } });
          const _affectedCount = _ret[0];
          if (_affectedCount == 0) {
            _result = { succeed: 0, code: 102, description: '记录不存在' };
          } else {
            _result = {
              succeed: 1,
              code: 200,
              description: '成功',
              data: { ...page, id },
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
      const _page = await Page.findOne({
        include: [
          {
            model: PageItem,
            as: 'pageItems',
            attributes: ['id', 'widgetCode', 'pageCode', 'positionId', 'sort', 'params'],
          },
        ],
        where: { id },
      });
      if (_page) {
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: _page,
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
        const _pages = await Page.findAndCountAll({
          where: _where,
          offset,
          limit,
        });
        for (const _page of _pages.rows) {
          _datas.push(_page);
        }
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { list: _datas, count: _pages.count },
        };
      } else {
        const _pages = await Page.findAll({
          where: _where,
        });
        for (const _page of _pages) {
          _datas.push(_page);
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

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new PageRepos();
    }
    return this._instance;
  }
}

module.exports = PageRepos.getInstance();
