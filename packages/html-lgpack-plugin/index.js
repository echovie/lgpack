const fs = require("fs");
const path = require("path");

class HtmlLgpackPlugin {
  constructor(options = {}) {
    this.options = {
      template: options.template || this.getDefaultTemplate(options),
      filename: options.filename || "index.html",
      title: options.title || "Lgpack App",
      ...options,
    };
  }

  getDefaultTemplate(options) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${options.title}</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;
  }

  getTemplateContent() {
    // 如果模板是文件路径，则读取文件内容
    if (fs.existsSync(path.resolve(process.cwd(), "index.html"))) {
      return fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
    }
    // 否则使用默认模板或传入的模板字符串
    return this.options.template;
  }

  apply(compiler) {
    console.log("compiler---");

    compiler.hooks.emit.tapAsync(
      "HtmlLgpackPlugin",
      (compilation, callback) => {
        // 获取所有 JS 文件
        const jsFiles = Object.keys(compilation.assets).filter((asset) =>
          asset.endsWith(".js")
        );

        // 生成 script 标签
        const scripts = jsFiles
          .map((file) => `<script src="${file}"></script>`)
          .join("\n    ");

        // 获取模板内容
        let html = this.getTemplateContent();

        // 替换标题
        html = html.replace(/\{\{title\}\}/g, this.options.title);

        // 注入 script 标签
        if (scripts) {
          html = html.replace("</body>", `    ${scripts}\n</body>`);
        }

        // 添加到输出
        compilation.assets[this.options.filename] = html;

        callback();
      }
    );
  }
}

module.exports = HtmlLgpackPlugin;
