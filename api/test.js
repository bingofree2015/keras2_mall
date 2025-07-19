const { has } = require('config');
const Router = require('@koa/router');
const { cloneDeep, add } = require('lodash');
const { resolve } = require('path');
const { all } = require('sequelize/types/lib/operators');
const { console } = require('tracer');

function longLink () {
  $ajax.post(
    url,
    {
      data,
      token,
    },
    (res) => {
      longLink();
      if (res.code == 0) {
        // 判断是否携带了信息
        if (res.data) {
        }
      } else {
        longLink();
      }
    },
  );
}
longLink();

Object.assign(target, source);

// 实现

Object.defineProperties(Object, 'assign', {
  value (target, ...args) {
    if (target === null) {
      TypeError('Cannot conert undefined or null object');
    }
    // 目标对象要求统一为引用类型的数据
    const to = Object(target);
    for (let i = 0; i < args.length; i++) {
      const nextSource = args[i];
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  },
  enumerable: false,
  writeable: true,
  configurable: true,
});

const cloneDeep2 = (target, hash = WeakMap()) => {
  // 对于传进来的 target 必须是一个对象，否则直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 哈希表中存在直接返回
  if (hash.has(target)) return hash.get(target);

  const cloneTarget = Array.isArray(target) ? [] : {};
  hash.set(target, cloneTarget);

  // 针对Symbol 属性
  const symKeys = Object.getOwnPropertySymbols(target);
  if (symKeys) {
    symKeys.forEach((symKeys) => {
      if (typeof target[symKeys] === 'object' && target[symKeys] !== null) {
        cloneTarget[symKeys] = cloneDeep2(target);
      } else {
        cloneTarget[symKeys] = target[symKeys];
      }
    });
  }

  for (const i in target) {
    if (Object.prototype.hasOwnProperty.call(target, i)) {
      cloneTarget[i] = typeof target[i] === 'object' ? cloneDeep2(target[i], hash) : target[i];
    }
  }

  return cloneTarget;
};

const _promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('延时执行了我');
  }, 1000);
});

// 定义三种状态
const PENDING = 'PENDING'; // 进行中
const FLFILLED = 'FULFILLED'; // 已成功
const REJECTED = 'REJECTED'; // 已失败

class Promise {
  constructor (executor) {
    // 初始化状态
    this.status = PENDING;
    // 将成功，失败结果放在 this 上，便于 then catch 访问
    this.value = undefined;
    this.reason = undefined;

    // 新增代码
    // 成功态回调涵数队列
    this.onFulfilledCallbacks = [];
    // 失败态回调涵数队列
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      // 只有进行中状态才能更改状态
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 新增代码
        // 成功态函数依次执行
        this.onFulfilledCallbacks.forEach((fn) => fn(this.value));
      }
    };
    const reject = (reason) => {
      // 只有进行中状态才能更改状态
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 新增代码
        // 失败态函数依次执行
        this.onRejectedCallbacks.forEach((fn) => fn(this.reason));
      }
    };
    try {
      // 立即执行 executor
      // 把内部的 resolve reject 传入 executor,用户可调用 resolve 和 reject
      executor(resolve, reject);
    } catch (e) {
      // executor 执行出错，将错误内容reject 抛出去
      reject(e);
    }
  }

  then (onFulfilled, onRejected) {
    // 保存 this
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.status === PENDING) {
        self.onRejectedCallbacks.push(() => {
          // try 捕获错误
          try {
            // 模拟微任务
            setTimeout(() => {
              const result = onFulfilled(self.value);
              // 分两种情况
              // 1 回调函数返回值是 Promise 执行 then 操作
              // 2 如果不是 Promise,调用新 Promise 的 resolve 函数
              result instanceof Promise ? result.then(resolve, reject) : resolve(result);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    // then 是微任务，这里用 setTimeout 模拟
    setTimeout(() => {
      // 新增代码
      if (this.status === PENDING) {
        // PENDING 状态下才执行
        // 说明 promise 内部有异步代码执行，还未改变状态，添加到成功/失败回调任务队列即可
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
        // onFulfilled(this.value)
      } else if (this.status === FULFILLED) {
        onFulfilled(this.value);
      } else if (this.status === REJECTED) {
        // REJECTED 状态下才执行
        onRejected(this.reason);
      }
    });
  }

  catch () {}

  static resolve () {}

  static reject () {}

  static all () {}

  static race () {}
}

// 1 Promise 内部异步代码执行的问题
// 2 Promise 的链式调用
// 3 值传透

// 1. 保存之前 promise 实例的引用，即保存 this
// 2. 根据 then 回调函数执行的返回值

// 返回一个 promise对象 只有当所有promise 都成功时返回的promise 状态才成功，

/**
 * 1.所有的 promise 状态变为fullfilled 返回的 promise 状态才变为 FULFILLED
 * 2.一个 promise 状态变为 REJECTED,返回的 promise 状态就变为 REJECTED
 * 数组成员不一定都是 promise,需地使用 Promise.resolve处理
 *
 */

class Scheduler {
  constructor () {
    this.queue = [];
    this.maxCount = 2;
    this.runCount = 0;
  }

  add (promiseCreator) {
    this.queue.push(promiseCreator);
  }

  request () {
    if (!this.queue || !this.queue.length || this.runCount >= this.maxCount) {
      return;
    }
    this.runCount++;

    this.queue
      .shift()()
      .then(() => {
        this.runCount--;
        this.request();
      });
  }

  taskStart () {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  // ...
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => {
    timeout(time).then(() => console.log(order));
  });
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

/**
 * 整个的完整执行流程
 * 1. 1 2 两个任务开始执行
 * 2. 500 ms 时 2任务执行完毕， 输出2，任务 3开始执行
 * 3. 800 ms 时 3 任务执行完毕 输出 3 任务 4开始执行
 * 4. 1000 ms 时 1任务执行完毕 输出 1 此时只剩下4任务在执行
 * 5 1200 ms  时 4 任务执行完毕 输出 4
 */

/**
 * 首先定义了存储 Promise Creator 的数组 queue 最大并行个数 maxCount,当前执行
 * 的Promise个数 runCounts, add 操作函数就是往队列中插入 Promise Generator 函数
 * 接下来就是 request 函数，每次从队列中取出 Promise Generator 并执行，此 Promise
 * 执行完成之后应该递归调用 request 函数做到执行下一下Promise
 *
 */
//

/**
 * 通过 Hash 实现前端路由
 * 通过 H5 的 history 实现前端路由
 * 在url 中多了以# 结尾的 hash 值，但是赋值前后虽然页面的hash值改变导致页面完整的url发生了改变，
 * 但是页面是不会刷新的，些外，还有一个名为hashchange 的事件，可以监听hash的变化，我们可以通赤
 * 下面两种方式来监听hash的变化
 */
//

window.onhashchange = function (event) {
  console.log(event);
};

window.addEventListener('hashchange', (event) => {
  console.log(event);
});

/**
 * hash 的缺点
 * hash 搜索引擎对带有hash的页面不友好
 * 带有hash 的页面内难以追踪用户行为
 * 通过 history 实现前端路由
 * Html5 的History 接口，History 对象是一个底层接口，不继承于任何的接口，His
 * tory 接口允许我们操作浏览器会话历史记录
 * History 的属性和方法
 * 属性
 * length 返回在会话历史中有多少条记录，包含了当前会话页面，此外如果打开一个新的Tab,那么
 * state 保存了会发出 popState 事件的方法，所传递过来的属性对
 *
 *
 * 方法
 * back 返回浏览器会话历史中的上一页
 * pushState 可以将给定的数据压入到浏览器会话历史栈中，该方法接收3个参数，对象，
 */

/**
 * history 为依据来实现路由的优点
 *
 * 对搜素引擎友好
 * 方便统计用户行为
 */
/**
 * react-router
 * react-router-dom
 * react-router-native
 * react-router-config
 * react-router-redux
 */
