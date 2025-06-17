const path = require("path");

module.exports = {
  devtool: "none",
  mode: "development",
  context: process.cwd(),
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
