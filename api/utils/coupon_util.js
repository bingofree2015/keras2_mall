class CouponUtil {
  constructor () {
    this._instance = null;
  }

  genSerialNumber (type) {
    let _serialNumber = '';
    const genAppend = (min, max) =>
      Date.now().toString() +
      Math.floor(Math.floor(Math.random() * (max - min + 1)) + min).toString();
    let _append = '';

    switch (type) {
    case 1: // 订单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 2: // 支付单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 3: // 商品编号
      _append = genAppend(0, 5);
      _serialNumber = `G${_append.substr(1)}`;
      break;
    case 4: // 货品编号
      _append = genAppend(0, 5);
      _serialNumber = `P${_append.substr(1)}`;
      break;
    case 5: // 售后单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 6: // 退款单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 7: // 退货单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 8: // 发货单编号
      _append = genAppend(0, 9);
      _serialNumber = `${type}${_append.substr(1)}`;
      break;
    case 9: // 提货单号
      const _chars = [
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'P',
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ];
      for (let i = 0; i < 6; i++) {
        const _rand = Math.floor(Math.floor(Math.random() * _chars.length));
        _serialNumber += _chars[_rand];
      }
      break;
    default:
      _serialNumber = genAppend(0, 9);
    }
    return _serialNumber;
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance () {
    if (!this._instance) {
      this._instance = new CouponUtil();
    }
    return this._instance;
  }
}

module.exports = CouponUtil.getInstance();
