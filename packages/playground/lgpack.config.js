const path = require("path");
const HtmlWebpackPlugin = require("@lgpack/html-lgpack-plugin");
const LgpackDevServer = require("@lgpack/lgpack-dev-server");

module.exports = {
  devtool: "none",
  context: process.cwd(),
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Lgpack Demo",
    }),
    new LgpackDevServer({
      port: 3000,
      open: true,
    }),
  ],
};
