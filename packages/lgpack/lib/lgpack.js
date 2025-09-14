const Compiler = require("./Compiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const LgpackOptionsApply = require("./LgpackOptionsApply");

const lgpack = function (options) {
  // 01 实例化 compiler 对象
  let compiler = new Compiler(options.context);
  compiler.options = options;

  // 02 挂载 NodeEnvironmentPlugin插件 (让compiler具体文件读写能力)
  new NodeEnvironmentPlugin().apply(compiler);

  // 03 挂载用户自定义的 plugins 插件
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }

  // 04 挂载所有 lgpack 内置的插件（入口）
  new LgpackOptionsApply().process(options, compiler);

  // 05 返回 compiler 对象即可
  return compiler;
};

module.exports = lgpack;
