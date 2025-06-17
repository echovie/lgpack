#!/usr/bin/env node

const { program } = require("commander");
const bundle = require("../src/index.js");

program
  .version("1.0.0")
  .description("A lightweight lgpack-like bundler CLI")
  .option("-c, --config <path>", "path to config file")
  .option("-e, --entry <path>", "entry file path")
  .option("-o, --output <path>", "output directory path")
  .option(
    "-m, --mode <mode>",
    "mode (development or production)",
    "development"
  );

program.parse(process.argv);

const options = program.opts();

async function run() {
  try {
    await bundle({
      configPath: options.config,
      entry: options.entry,
      output: options.output,
      mode: options.mode,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
