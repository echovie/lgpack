const lgpack = require("@lgpack/lgpack");
const chalk = require("chalk");
const { loadConfig, mergeConfig } = require("./config");

async function bundle(options) {
  try {
    console.log(chalk.blue("Starting bundling..."));
    console.log("Options:", options); // 打印命令行参数

    // 1. 获取参数
    // 加载基础配置
    const baseConfig = loadConfig(options.configPath);

    // 合并命令行参数
    const overrideConfig = {
      entry: options.entry,
      output: options.output ? { path: options.output } : undefined,
      mode: options.mode,
    };

    // 合并配置
    const config = mergeConfig(baseConfig, overrideConfig);
    console.log("Final config:", config);

    // 2. 创建编译器、注册插件
    const compiler = lgpack(config);

    console.log(chalk.yellow("Starting compile..."));

    // 3. 运行编译并启动开发服务器
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          console.error(chalk.red("Build failed:"), err);
          reject(err);
          return;
        }

        console.log(chalk.green("Build completed successfully!"));
        console.log(
          stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
          })
        );

        // 开发服务器已经在插件中启动，这里保持进程运行
        resolve(stats);
      });
    });
  } catch (error) {
    console.error(chalk.red("Error:"), error);
    throw error;
  }
}

module.exports = bundle;
