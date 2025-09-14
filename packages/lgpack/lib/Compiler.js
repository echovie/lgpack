const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncSeriesHook,
  AsyncParallelHook,
} = require("tapable");

const path = require("path");
const mkdirp = require("mkdirp");
const Stats = require("./Stats");
const NormalModuleFactory = require("./NormalModuleFactory");
const Compilation = require("./Compilation");
const { emit } = require("process");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.hooks = {
      // 入口配置钩子：在处理入口配置时触发。常用于插件读取或修改入口参数。如 EntryOptionPlugin 读取 entry 配置，或插件动态修改入口。
      entryOption: new SyncBailHook(["context", "entry"]),

      // 编译开始前钩子：在编译流程正式开始前异步触发。插件可在此做准备工作，如清理缓存、初始化环境等。
      beforeRun: new AsyncSeriesHook(["compiler"]),
      // 编译开始钩子：在 run 方法被调用时异步触发。插件可在此记录编译启动日志、统计信息等。
      run: new AsyncSeriesHook(["compiler"]),

      // 创建 compilation 对象前钩子：同步触发，可用于初始化 compilation。插件可在此为 compilation 注入自定义属性或资源。
      thisCompilation: new SyncHook(["compilation", "params"]),
      // compilation 创建后钩子：同步触发，通知 compilation 已经创建。插件可在此注册 compilation 级别的钩子，参与后续构建流程。
      compilation: new SyncHook(["compilation", "params"]),

      // 编译前钩子：在编译流程正式开始前异步触发（可用于准备编译参数）。插件可在此异步准备 loader、plugin 相关资源。
      beforeCompile: new AsyncSeriesHook(["params"]),
      // 编译钩子：同步触发，表示编译流程正式开始。插件可在此记录编译参数、初始化编译状态。
      compile: new SyncHook(["params"]),
      // 构建模块钩子：并行异步触发，主要用于模块的构建过程。插件可在此参与模块依赖分析、动态添加依赖等。
      make: new AsyncParallelHook(["compilation"]),
      // 编译后钩子：编译流程结束后异步触发。插件可在此处理编译结果、生成额外资源、分析依赖等。
      afterCompile: new AsyncSeriesHook(["compilation"]),

      // 资源输出前钩子：在输出文件前异步触发，可用于修改输出内容。插件可在此修改、压缩、替换输出资源，如 banner 插件、压缩插件等。
      emit: new AsyncSeriesHook(["compilation"]),
      // 编译完成钩子：所有流程结束后异步触发，可用于最终统计和清理。插件可在此输出编译统计、清理临时文件、通知构建完成等。
      done: new AsyncSeriesHook(["stats"]),
    };
  }

  emitAssets(compilation, callback) {
    // 当前需要做的核心： 01 创建dist  02 在目录创建完成之后执行文件的写操作

    // 01 定义一个工具方法用于执行文件的生成操作
    const emitFlies = (err) => {
      const assets = compilation.assets;

      let outputPath = this.options.output.path;

      for (let file in assets) {
        let source = assets[file];
        let targetPath = path.posix.join(outputPath, file);
        this.outputFileSystem.writeFileSync(targetPath, source, "utf8");
      }

      // 文件写入完成后，触发 done 钩子
      this.hooks.done.callAsync(compilation, (err) => {
        callback(err);
      });
    };

    // 创建目录之后启动文件写入
    this.hooks.emit.callAsync(compilation, (err) => {
      mkdirp.sync(this.options.output.path); // 创建目录
      emitFlies();
    });
  }

  run(callback) {
    console.log("run 方法执行了~~~~");

    const finalCallback = function (err, stats) {
      callback(err, stats);
    };

    const onCompiled = (err, compilation) => {
      // 最终在这里将处理好的 chunk 写入到指定的文件然后输出至 dist
      this.emitAssets(compilation, (err) => {
        let stats = new Stats(compilation);
        finalCallback(err, stats);
      });
    };

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled);
      });
    });
  }

  compile(callback) {
    const params = this.newCompilationParams();

    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);

      this.hooks.make.callAsync(compilation, (err) => {
        // console.log('make钩子监听触发了~~~~~')
        // callback(err, compilation)

        // 在这里我们开始处理 chunk
        compilation.seal((err) => {
          this.hooks.afterCompile.callAsync(compilation, (err) => {
            callback(err, compilation);
          });
        });
      });
    });
  }

  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory(),
    };

    return params;
  }

  newCompilation(params) {
    const compilation = this.createCompilation();
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }

  createCompilation() {
    return new Compilation(this);
  }
}

module.exports = Compiler;
