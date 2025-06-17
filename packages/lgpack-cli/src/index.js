const lgpack = require("@wp-chunk-init/lgpack");
const chalk = require("chalk");
const { loadConfig, mergeConfig } = require("./config");

async function bundle(options) {
  try {
    console.log(chalk.blue("Starting bundling..."));
    console.log("Options:", options);

    // 加载基础配置
    const baseConfig = loadConfig(options.configPath);
    console.log("Base config:", baseConfig);

    // 合并命令行参数
    const overrideConfig = {
      entry: options.entry,
      output: options.output
        ? {
            path: options.output,
          }
        : undefined,
      mode: options.mode,
    };
    console.log("Override config:", overrideConfig);

    // 合并配置
    const config = mergeConfig(baseConfig, overrideConfig);
    console.log("Final config:", config);

    // 创建编译器
    const compiler = lgpack(baseConfig);

    // 运行编译
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
        resolve(stats);
      });
    });
  } catch (error) {
    console.error(chalk.red("Error:"), error);
    throw error;
  }
}

module.exports = bundle;
