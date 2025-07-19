const path = require('path');
const fs = require('mz/fs');
const Jimp = require('jimp');
const shell = require('shelljs');

const logger = require('tracer').colorConsole();

const SERVER_UPLOAD_DIR = path.join(process.cwd(), '/upload/');

class Uploader {
  constructor () {
    this._instance = null;
  }

  async upload (ctx, pathType, w, h) {
    let _result = {
      succeed: 0,
      code: 102,
      description: '文件不存在',
    };
    w = parseInt(w);
    h = parseInt(h);
    // 给上传的文件生成唯一文件名
    const _genFileName = (extName) => {
      const _timestamp = Date.now().toString();
      const _random = (min, max) => parseInt(Math.random() * (max - min) + min);
      // Number(Math.random().toString().substr(3, 3) + Date.now()).toString(20)
      const _fileName = `${Number(_timestamp + _random(1, 100)).toString(20)}.${extName}`;
      return _fileName;
    };

    const _uploadFiles = (ctx.request.files ? ctx.request.files : ctx.request.body.files) || {};
    for (const key in _uploadFiles) {
      try {
        const _file = _uploadFiles[key];

        let _fileName = _file.name;
        let _extName = _fileName.slice(_fileName.lastIndexOf('.') + 1);
        _extName = _extName == 'blob' ? 'png' : _extName;
        _fileName = _genFileName(_extName);

        const _fileType = _file.type ? _file.type.substring(0, _file.type.indexOf('/')) : null;

        let _relativePath = pathType ? `${pathType}/` : '';
        _relativePath = _fileType ? (_relativePath += `${_fileType}/`) : _relativePath;

        const _uploadDir = path.join(SERVER_UPLOAD_DIR, _relativePath);
        shell.mkdir('-p', _uploadDir);

        const _savePath = _uploadDir + _fileName;

        logger.debug(`上传的图片高度：[${h}] 宽度：[${w}]`);

        if (w && Number.isInteger(w) && h && Number.isInteger(h)) {
          // 对图片进行压缩处理
          const lenna = await Jimp.read(_file.path);
          lenna.scaleToFit(w, h).quality(60).write(_savePath);
          fs.unlinkSync(_file.path); // 删除临时文件
        } else {
          fs.renameSync(_file.path, _savePath);
        }
        const _fileUrl = _relativePath + _fileName;
        _result = {
          succeed: 1,
          code: 200,
          description: '成功',
          data: { fileUrl: _fileUrl, fileName: _fileName, fileType: _fileType },
        };
      } catch (err) {
        logger.error(err);
        _result = {
          succeed: 0,
          code: 500,
          description: err.message || err.stack || '系统错误',
        };
      }
    }
    return _result;
  }

  async download (pathType, imgUrl, w, h) {
    let _result = {};
    // 给上传的文件生成唯一文件名
    const _genFileName = (extName) => {
      const _timestamp = Date.now().toString();
      const _random = (min, max) => parseInt(Math.random() * (max - min) + min);
      const _fileName = `${_timestamp + _random(1, 100)}.${extName}`;
      return _fileName;
    };
    try {
      const lenna = await Jimp.read(imgUrl);
      const _fileType = lenna._originalMime;
      const _width = lenna.bitmap.width;
      const _height = lenna.bitmap.height;
      const _extName = imgUrl.includes('.')
        ? imgUrl.substring(imgUrl.lastIndexOf('.') + 1, imgUrl.length)
        : _fileType.substring(_fileType.lastIndexOf('/') + 1, _fileType.length);
      console.log(_extName);
      const _fileName = _genFileName(_extName);

      const _relativePath = pathType ? `${pathType}/${_fileType}` : `${_fileType}`;
      const _uploadDir = path.join(SERVER_UPLOAD_DIR, _relativePath);
      shell.mkdir('-p', _uploadDir);

      const _savePath = _uploadDir + _fileName;
      logger.debug(`上传的图片高度：[${_height}] 宽度：[${_width}]`);

      if (w && Number.isInteger(w) && h && Number.isInteger(h)) {
        // 对图片进行压缩处理
        lenna.resize(w, h).quality(60).write(_savePath);
      } else {
        lenna.write(_savePath);
      }

      const _fileUrl = _relativePath + _fileName;
      _result = {
        succeed: 1,
        code: 200,
        description: '成功',
        data: { fileUrl: _fileUrl, fileName: _fileName, fileType: _fileType },
      };
    } catch (err) {
      logger.error(err);
      _result = {
        succeed: 0,
        code: 500,
        description: err.message || err.stack || '系统错误',
      };
    }
    return _result;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new Uploader();
    }
    return this._instance;
  }
}

module.exports = Uploader.getInstance();
