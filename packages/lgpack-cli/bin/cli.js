#!/usr/bin/env node

// 1. 实例化一个可执行命令对象 —— lgpack（单例模式）
const { program } = require("commander");
const bundle = require("../src/index.js");

// 2. 配置主命令信息
program.version("1.0.0").description("A lightweight bundler CLI");

// 3. 配置子命令（dev 命令）
program
  .command("dev")
  .description("Build the project for production")
  .option("-c, --config <path>", "config file path", "lgpack.config.js")
  .option("-e, --entry <path>", "entry file path")
  .option("-o, --output <path>", "output directory path")
  .action(async (options) => {
    try {
      // 5. 调用 bundle 函数，执行打包逻辑
      await bundle({
        configPath: options.config,
        entry: options.entry,
        output: options.output,
        mode: "production",
      });
    } catch (error) {
      console.error("Build failed:", error);
      process.exit(1);
    }
  });

// 4. 解析命令行参数
program.parse(process.argv);
