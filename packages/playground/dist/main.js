(function (modules) {
// 01 定义对象用于将来缓存被加载过的模块
let installedModules = {}

// 02 定义一个 __webpack_require__ 方法来替换 import require 加载操作
function __webpack_require__(moduleId) {
// 2-1 判断当前缓存中是否存在要被加载的模块内容，如果存在则直接返回
if (installedModules[moduleId]) {
return installedModules[moduleId].exports
}

// 2-2 如果当前缓存中不存在则需要我们自己定义{} 执行被导入的模块内容加载
let module = installedModules[moduleId] = {
i: moduleId,
l: false,
exports: {}
}

// 2-3 调用当前 moduleId 对应的函数，然后完成内容的加载
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

// 2-4 当上述的方法调用完成之后，我们就可以修改 l 的值用于表示当前模块内容已经加载完成了
module.l = true

// 2-5 加载工作完成之后，要将拿回来的内容返回至调用的位置
return module.exports
}

// 03 定义 m 属性用于保存 modules
__webpack_require__.m = modules

// 04 定义 c 属性用于保存 cache
__webpack_require__.c = installedModules

// 05 定义 o 方法用于判断对象的身上是否存在指定的属性
__webpack_require__.o = function (object, property) {
return Object.prototype.hasOwnProperty(object, property)
}

// 06 定义 d 方法用于在对象的身上添加指定的属性，同时给该属性提供一个 getter
__webpack_require__.d = function (exports, name, getter) {
if (!__webpack_require__.o(exports, name)) {
Object.defineProperty(exports, name, { enumerable: true, get: getter })
}
}

// 07 定义 r 方法用于标识当前模块是 es6 类型
__webpack_require__.r = function (exports) {
if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
}
Object.defineProperty(exports, '__esModule', { value: true })
}

// 08 定义 n 方法，用于设置具体的 getter
__webpack_require__.n = function (module) {
let getter = module && module.__esModule ?
function getDefault() { return module['default'] } :
function getModuleExports() { return module }

__webpack_require__.d(getter, 'a', getter)

return getter
}

// 11 定义 t 方法，用于加载指定 value 的模块内容，之后对内容进行处理再返回
__webpack_require__.t = function (value, mode) {
// 01 加载 value 对应的模块内容（ value 一般就是模块 id ）
// 加载之后的内容又重新赋值给 value 变量
if (mode & 1) {
value = __webpack_require__(value)
}

if (mode & 8) { // 加载了可以直接返回使用的内容
return value
}

if ((mode & 4) && typeof value === 'object' && value && value.__esModule) {
return value
}

// 如果 8 和 4 都没有成立则需要自定义 ns 来通过 default 属性返回内容
let ns = Object.create(null)

__webpack_require__.r(ns)

Object.defineProperty(ns, 'default', { enumerable: true, value: value })

if (mode & 2 && typeof value !== 'string') {
for (var key in value) {
__webpack_require__.d(ns, key, function (key) {
return value[key]
}.bind(null, key))
}
}

return ns
}

// 09 定义 P 属性，用于保存资源访问路径
__webpack_require__.p = ""

// 10 调用 __webpack_require__ 方法执行模块导入与加载操作
return __webpack_require__(__webpack_require__.s = './src/index.js')

  })
  ({
  
    "./src/index.js":
      (function (module, exports, __webpack_require__) {
      console.log("Hello from playground!");
let title = __webpack_require__("./src/title.js");
console.log(title);
console.log("执行了");
        }),
        
    "./src/title.js":
      (function (module, exports, __webpack_require__) {
      module.exports = 'title';
        }),
        
          })