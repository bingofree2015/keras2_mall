/**
 * 通过不停地创建setTimeout 对象实现
 * @param {被包装的函数} fn
 * @param {延时时间，毫秒} time
 */
function debounce(fn, time) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, time)
  }
}

/**
 * 节流
 * @param {函数} fn
 * @param {间隔时间} time
 */
function throttle(fn, time) {
  let canRun = true
  return function () {
    if (!canRun) return
    canRun = true
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, time)
  }
}

function deepClone(obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        deepClone(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

function mixArr(arr) {
  return arr.sort(() => {
    return Math.random - 0.5
  })
}

/**
 * 著名的Fisher-Yates 算法
 * @param {需要乱序的数组} arr
 */
function shuffle(arr) {
  let m = arr.length
  while (m > 1) {
    let index = (parseInt(Math.random() * m--)[(arr[index], arr[m])] = [arr[m], arr[index]])
  }
}

// let m = 12
// while(m > 1){
//     let index = parseInt(Math.random() * m--)
//     console.log(`${m} ->  ${index}`)
// }

// 数组去重

function removeDup(arr) {
  let result = []
  let hashMap = {}
  for (let i of arr) {
    if (!hashMap[i]) {
      hashMap[i] = true
      result.push(i)
    }
  }
  return result
}

function removeDup2(arr) {
  //Array.from(new Set(arr))
  ;[...new Set(arr)]
}

// flat 可以将多维数组展平为低维数组，如果不传参默认展平一层
// 传参可以规定展平的层级

// function flat(arr) {
//     let result = []
//     for (let item of arr) {
//         if (Array.isArray(item)) {
//             result = result.concat(flat(item))
//         } else {
//             result.push(item)
//         }
//     }
//     return result
// }

let hh = [1, 2, [5, 7, [1, 6]]]

let _r = hh.flat(2)

console.log(_r)

Array.prototype.filter = function (fn, context) {
  if (typeof fn != 'function') {
    throw new TypeError(`${fn} is not a function`)
  }
  let arr = this
  let result = []
  for (let i = 0; i < arr.length; i++) {
    let temp = fn.call(context, arr[i], i, arr)
    if (temp) {
      result.push(arr[i])
    }
  }
  return result
}

Array.prototype.filter = function (fn, context) {
  if (typeof fn != 'function') throw new TypeError(`${fn} is not a function`)

  let result = []
  let arr = this
  for (let i = 0; i < arr.length; i++) {
    let temp = fn.call(context, arr[i], arr[i], i, arr)
    if (temp) {
      result.push(arr[i])
    }
  }
  return result
}

// 手写 call & apply & bind
/**
 * call apply bind 在ES5 中能改变this 指向的方法，call apply 的传参不同
 * call 接收逗号分隔的参数，apply 接收数组，调用都会立即执行，而 bind 调用完
 * 返恩啊的是一个函数，需要再次调用才会执行，接下来就会引申到能实现一个call/apply
 */

Function.prototype.myCall = function (context) {
  if (typeof this != 'function') {
    throw new TypeError('this is not a function')
  }
  context.fn = this
  let arr = []
  for (var i = 1; i < this.arguments.length; i++) {
    arr.push('argument[' + i + ']')
  }
  var result = eval('context.fn(' + arr + ')')
  delete context.fn
  return result
}

Function.prototype.myBind = function (context) {
  if (typeof this != 'function') {
    throw new TypeError('this is not a function')
  }
  let self = this
  let args = Array.prototype.slice.call(arguments, 1)
  let F = function () {}
  F.prototype = this.prototype
  var bound = function () {
    let bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof F ? this : context, args.concat(bindArgs))
  }
  bound.prototype = new F()
  return bound
}

class EventEmitter {
  constructor() {
    this.events = {}
  }

  /**
   * 临听函数
   * @param {事件名} name
   * @param {回调函数} cb
   */
  on(name, cb) {
    if (!this.events[name]) {
      this.events[name] = [cb]
    } else {
      this.events[name].push(cb)
    }
  }

  /**
   * 触发函数
   * 事件名称
   * 参数
   * */
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach((fn) => {
        fn.call(this, ...arg)
      })
    }
  }

  /**
   * 将当前函数从事件中删除
   * @param {事件名称} name
   * @param {触发函数} cb
   */
  off(name, cb) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter((fn) => {
        return fn != cb
      })
    }
  }

  once(name, fn) {
    let onlyOnce = () => {
      fn.apply(this.arguments)
      this.off(name, onlyOnce)
    }
    this.on(name, onlyOnce)
    return this
  }
}

// // ES5
// function Parent(name,age){
//     this.name = name
//     this.age = age
// }
// Parent.prototype.say = function(){
//     console.log(`I am ${this.name}`)
// }

// function Child(name,age,sex){
//     Parent.call(this,name,age)
//     this.sex = sex
// }

// Child.prototype = Object.create(Parent.prototype)
// Child.prototype.constructor = Child

// class Child extends Parent{
//     constructor(name,age,sex){
//         super(name,age)
//         this.sex = sex
//     }
// }

// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象
/**
 * 的原型链上，其实考察的也是继承
 */

function myInstanceof(left, right) {
  let proto = left.__proto__
  let protoType = right.prototype
  while (true) {
    if (proto === null) {
      return false
    }
    if (proto == protoType) {
      return true
    }
    proto = proto.__proto__
  }
}

/**
 * new 的过程
 * 1.创建一个空的简单 javascript 对象 {}
 * 2.链接该对象到另一个对象
 * 3.将步骤1新创建的对象作为 this 上下文
 * 4.如果该函数没有返回对象，则返回 this
 *
 */

function newParent() {
  let obj = {}
  obj.__proto__ = Parent.prototype
  let result = Parent.call(obj)

  return typeof result == 'object' ? result : obj
}

/**
 * 链式调用 任务队列 流程控制 关键是用手动调用next函数来进行下次事件的调用，类似
 * express 中间件和 vue-router 路由的执行过程
 */

function _LazyMan(name) {
  this.name = name
  this.queue = []
  this.queue.push(() => {
    console.log(`Hi! This is ${name} !`)
    this.next()
  })
  setTimeout(() => {
    this.next()
  }, 0)
}

_LazyMan.prototype.eat = function (name) {
  this.queue.push(() => {
    console.log(`Eat ${name} ~`)
    this.next()
  })
  return this
}

_LazyMan.prototype.next = function () {
  let fn = this.queue.shift()
  fn && fn()
}

_LazyMan.prototype.sleep = function (time) {
  this.queue.push(() => {
    setTimeout(() => {
      console.log(`Wake up after ${time} s!`)
      this.next()
    }, time * 1000)
  })
  return this
}

_LazyMan.prototype.sleepFirst = function (time) {
  this.queue.unshift(() => {
    setTimeout(() => {
      console.log(`Wake up after ${time} s!`)
      this.next()
    }, time * 1000)
  })
  return this
}

function LazyMan(name) {
  return new _LazyMan(name)
}

//    LazyMan('bingofree')

//    LazyMan('bingofree').sleep(10).eat('dinner')

//LazyMan('bingofree').eat('dinner').eat('supper')
//LazyMan('bingofree').sleepFirst(5).eat('supper')

function currying(fn, ...args) {
  console.log(`args : ${JSON.stringify(args)}`)
  if (fn.length <= args.length) {
    return fn(...args)
  }

  return function (...args1) {
    console.log(`args1 ${JSON.stringify(args1)}`)
    return currying(fn, ...args, ...args1)
  }
}

function add(a, b, c) {
  return a + b + c
}

add(1, 2, 3)
var curryingAdd = currying(add)
let result = curryingAdd(1)(2)(3)
console.log(result)

/**
 * 订阅 发布 模式的实现
 *  思路
 *  1、创建一个对象（缓存列表）
 *  on 方法用来把回调函数fn 都加到缓存列表中
 *   emit 方法取到arguments 里第一个当做 key,根据key 值去执行对应缓存列表中的函数
 *  remove 方法可以根据 key 值取消订阅
 */

class eventEmitter {
  constructor() {
    // 定义一个缓存对象，用于存在回调方法
    this.list = {}
  }

  on(name, fn) {
    if (!this.list[name]) {
      this.list[name] = []
    }
    this.list[name].push(fn)
  }

  emitter(name) {
    this.list[name].forEach((fn) => fn)
  }

  remove(name) {
    delete this.list[name]
  }
}

// 监听的目的，就是为了构造这样一个对象 一对多的关系  on

// 发布的时候， 会让数组中函数依次执行 emit

let MyEventEmitter = require('./events')
let util = require('util')

function Girl() {}

// Girl 继承 EventEmitter 上的方法

util.inherits(Girl, MyEventEmitter) // 相当于 Girl.prototype.__proto__ = EventEmitter.prototype

let girl = new Girl()

let drink = function (data) {
  console.log(data)
  console.log('喝酒')
}

let findboy = function () {
  console.log('交友')
}

// 实现一个 EventEmitter

/**
 * 实现一个EventEmitter类
 */

function CustomEventEmitter() {
  // 用 Object.create(null) 代替空对象 {}
  // 好处是无杂质 不继承原型链的东东
  this._events = Object.create(null)
}

// 默认最多的绑定次数
EventEmitter.defaultMaxListeners = 10
// 同 on 方法
EventEmitter.prototype.addListener = EventEmitter.prototype.on

// 返回监听的事件名
EventEmitter.prototype.eventNames = function () {
  return Object.keys(this._events)
}

// 设置最大监听数
EventEmitter.prototype.setMaxListeners = function (n) {
  this._count = n
}

// 监听
EventEmitter.prototype.on = function (type, cb, flag) {
  // 默认值，如果没有 _events 的话，就给它创建一个
  if (!this._events) {
    this._events = Object.create(null)
  }
  // 不是 newListener 就应该让 newListener 执行以下
  if (type !== 'newListenter') {
  }
}

//总结
/**
 * 优点 对象之间的解耦
 * 异步编程中，可以更松
 */

/**
 * CORS Nginx 反向代理
 */

/**
 * 跨域行为
 * 同源策略限制、安全性考虑
 * 协议、IP
 * 前端事先实现一个获取跨域响应数据的回调函数，并通过没有同源策略限制的script 标签
 * 发起一个请求（将回调函数名称放在这个请求的query参数里），然后服务端返回这个回调
 * 函数的执行，并将需要响应的数据放到回调函数的参数里，前端的script 标签请求到这个
 * 执行的回调函数后会立马执行，于是就拿到了执行的响应数据
 * 缺点 JSONP只能发起GET 请求
 */

/**
 * CORS 跨域资源共享Access-Control-Allow-Origin
 */

/**
 * 什么是 CORS
 * CORS （cross-origin-resource-sharing）允许浏览器向跨域服务器发出
 * XMLHttpRequest请求，
 */

Function.prototype.apply = function (context = window, args) {
  if (typeof this !== 'function') {
    throw new TypeError('Type Error')
  }
  const fn = Symbol('fn')
  context[fn] = this

  const res = context[fn](...args)

  delete context[fn]
  return res
}

/**
 * call 与 apply 唯一不同的是 call 方法接受的是一个参数列表
 */

Function.prototype.call = function (context = window, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Type Error')
  }
  const fn = Symbol('fn')
  context[fn] = this

  const res = this[fn](...args)
  delete this[fn]
  return res
}

Function.prototype.bind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('Type Error')
  }
  let self = this
  return function F() {
    if (this instanceof F) {
      return new self(...args, ...arguments)
    }
    return self.apply(context, [...args, ...arguments])
  }
}

function add() {
  const _args = [...arguments]
  function fn() {
    _args.push(...arguments)
    return fn
  }
  fn.toString = function () {
    return _args.reduce((sum, cur) => sum + cur)
  }
  return fn
}

/**
 * 1. 以 ctor.prototype 为原型创建一个对象
 * 2. 执行构造函数并将this绑定到新创建的对象上
 * 3. 判断构造函数执行执行返回的结果是否是引用数据类型，若是则返回构造函数执行的结果，否则返回创建的对象
 */

function newOperator(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw new TypeError('Type Error')
  }

  const obj = Object.create(ctor.prototype)
  const res = ctor.apply(obj, args)

  const isObject = typeof res === 'object' && res !== null
  const isFunction = typeof res === 'function'

  return isObject || isFunction ? res : obj
}
