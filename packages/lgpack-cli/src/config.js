const path = require("path");
const fs = require("fs");

const defaultConfig = {
  devtool: "none",
  mode: "development",
  context: process.cwd(),
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};

function loadConfig(configPath) {
  try {
    if (configPath) {
      const config = require(path.resolve(process.cwd(), configPath));
      return config;
    }

    // 如果没有提供配置文件路径，尝试查找默认配置文件
    const defaultConfigFiles = ["lgpack.config.js", "lgpack.config.ts"];

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
