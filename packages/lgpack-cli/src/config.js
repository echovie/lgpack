const path = require("path");
const fs = require("fs");

const defaultConfig = {
  devtool: "none",
  mode: "development",
  context: process.cwd(),
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "dist"),
  },
};

function loadConfig(configPath) {
  try {
    // 如果指定了配置文件路径
    if (configPath) {
      const resolvedPath = path.resolve(process.cwd(), configPath);

      // 检查文件是否存在
      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Config file not found: ${resolvedPath}`);
        return defaultConfig;
      }

      // 文件存在，尝试加载
      const config = require(resolvedPath);
      return config;
    }

    // 如果没有指定配置文件，尝试查找默认配置文件
    const defaultConfigFiles = ["lgpack.config.js"];

    for (const file of defaultConfigFiles) {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        return require(filePath);
      }
    }

    return defaultConfig;
  } catch (error) {
    console.warn("Failed to load config file, using default config");
    return defaultConfig;
  }
}

function mergeConfig(baseConfig, overrideConfig) {
  return {
    ...baseConfig,
    ...overrideConfig,
    entry: overrideConfig.entry || baseConfig.entry,
    output: {
      ...baseConfig.output,
      ...(overrideConfig.output || {}),
    },
  };
}

module.exports = {
  loadConfig,
  mergeConfig,
};
