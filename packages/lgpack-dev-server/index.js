const http = require("http");
const fs = require("fs");
const path = require("path");
const BrowserOpener = require("./browser-opener");

class LgpackDevServer {
  constructor(options = {}) {
    this.options = {
      port: options.port || 8080,
      host: options.host || "localhost",
      static: options.static || "./dist",
      open: options.open || false,
      ...options,
    };
    this.server = null;
    this.browserOpener = new BrowserOpener();
  }

  apply(compiler) {
    // 作为 webpack 插件使用时，在编译完成后启动服务器
    compiler.hooks.done.tap("LgpackDevServer", () => {
      this.startServer();
    });
  }

  startServer() {
    console.log("startServer", this.options);
    if (this.server) {
      console.log("Dev server already running");
      return;
    }

    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.options.port, this.options.host, () => {
      const url = `http://${this.options.host}:${this.options.port}`;
      console.log(`🚀 Dev server running at ${url}`);

      if (this.options.open) {
        // 使用新的浏览器打开工具
        this.browserOpener.openDelayed(url, 500);
      }
    });
  }

  handleRequest(req, res) {
    const pathname = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(process.cwd(), this.options.static, pathname);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
      return;
    }

    // 读取并返回文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal server error");
        return;
      }

      const ext = path.extname(filePath);
      const contentType = this.getContentType(ext);

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
      console.log("🛑 Dev server stopped");
    }
  }

  getContentType(ext) {
    const contentTypes = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    return contentTypes[ext] || "text/plain";
  }
}

module.exports = LgpackDevServer;
