#!/usr/bin/env node

const { program } = require("commander");
const bundle = require("../src/index.js");

program.version("1.0.0").description("A lightweight lgpack-like bundler CLI");

// dev 命令
program
  .command("dev")
  .description("Build the project for production")
  .option("-c, --config <path>", "config file path", "lgpack.config.js")
  .option("-e, --entry <path>", "entry file path")
  .option("-o, --output <path>", "output directory path")
  .action(async (options) => {
    try {
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

program.parse(process.argv);
