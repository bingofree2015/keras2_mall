const aa = [
  { id: 0, value: 'a' },
  { id: 1, value: 'b' },
  { id: 2, value: 'c' },
  { id: 3, value: 'd' },
];

const bb = aa.map((v) => v.id).filter((v) => v);
// console.log(bb)

const cc = [1, 2, 3, 5, 6, 7];
const dd = [5, 6, 7, 8, 9, 10];

const ee = cc
  .map((v) => {
    if (!dd.includes(v)) {
      return v;
    }
  })
  .filter((v) => v);

console.log(ee);

let ff = 'a|b|c|d|a|a';

ff = ff.replace(/\|/g, ' ');

// console.log(ff)

const _props = ['abc', 'qq'];

for (let i = 0; i < 2; i++) {
  console.log(i);
  // _value = _value[_props[i]]
}

function combine (arr) {
  const r = [];
  (function f (t, a, n) {
    if (n == 0) return r.push(t);
    for (let i = 0; i < a[n - 1].length; i++) {
      f(t.concat(a[n - 1][i]), a, n - 1);
    }
  })([], arr, arr.length);
  return r;
}
const arr = [
  ['1', '2', '3'],
  ['a', 'b', 'c'],
  ['x', 'y', 'z'],
];
const res = combine(arr);

console.log(res);

class Db {
  static getInstance () {
    /* 单例 */
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }

  constructor () {
    console.log('实例化会触发构造函数');
    this.connect();
  }

  connect () {
    console.log('连接数据库');
  }

  find () {
    console.log(this);
    console.log('查询数据库');
  }
}
const myDb = Db.getInstance();
const myDb2 = Db.getInstance();
const myDb3 = Db.getInstance();
const myDb4 = Db.getInstance();
myDb3.find();
myDb4.find();

// 生成唯一ID
function guid () {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(20);
}

const id = guid();

console.log(id);

const _pp = null;

const _qq = _pp.pop();

console.log(_qq);
