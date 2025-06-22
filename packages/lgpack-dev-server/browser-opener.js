const { exec } = require("child_process");

class BrowserOpener {
  constructor(options = {}) {
    this.options = {
      delay: options.delay || 1000, // 延迟打开，确保服务器启动
      ...options,
    };
  }

  /**
   * 打开浏览器
   * @param {string} url - 要打开的 URL
   * @param {boolean} silent - 是否静默模式（不显示日志）
   */
  open(url, silent = false) {
    if (!silent) {
      console.log(`🌐 Attempting to open browser: ${url}`);
    }

    const { platform } = process;
    let command = this.getDefaultCommand(platform, url);

    try {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          if (!silent) {
            console.log("⚠️  Failed to open browser with default command");
            console.log(`🌐 Please open manually: ${url}`);
          }

          // 尝试备用浏览器
          this.tryAlternativeBrowsers(url, silent);
        } else {
          if (!silent) {
            console.log("🌐 Browser opened successfully!");
          }
        }
      });
    } catch (error) {
      if (!silent) {
        console.log("⚠️  Failed to open browser");
        console.log(`🌐 Please open manually: ${url}`);
      }
    }
  }

  /**
   * 延迟打开浏览器
   * @param {string} url - 要打开的 URL
   * @param {number} delay - 延迟时间（毫秒）
   */
  openDelayed(url, delay = this.options.delay) {
    setTimeout(() => {
      this.open(url);
    }, delay);
  }

  /**
   * 获取默认命令
   * @param {string} platform - 操作系统平台
   * @param {string} url - URL
   * @returns {string} 命令字符串
   */
  getDefaultCommand(platform, url) {
    switch (platform) {
      case "darwin": // macOS
        return `open "${url}"`;
      case "win32": // Windows
        return `start "${url}"`;
      default: // Linux
        return `xdg-open "${url}"`;
    }
  }

  /**
   * 尝试备用浏览器
   * @param {string} url - 要打开的 URL
   * @param {boolean} silent - 是否静默模式
   */
  tryAlternativeBrowsers(url, silent = false) {
    const { platform } = process;
    const alternativeCommands = this.getAlternativeCommands(platform, url);

    for (const cmd of alternativeCommands) {
      try {
        exec(cmd, (error) => {
          if (!error) {
            if (!silent) {
              console.log(
                `🌐 Opened with alternative browser: ${cmd.split(" ")[0]}`
              );
            }
            return;
          }
        });
      } catch (error) {
        // 继续尝试下一个
      }
    }
  }

  /**
   * 获取备用浏览器命令
   * @param {string} platform - 操作系统平台
   * @param {string} url - URL
   * @returns {string[]} 命令数组
   */
  getAlternativeCommands(platform, url) {
    if (platform === "darwin") {
      // macOS 备用浏览器
      return [
        `open -a "Google Chrome" "${url}"`,
        `open -a "Firefox" "${url}"`,
        `open -a "Safari" "${url}"`,
        `open -a "Microsoft Edge" "${url}"`,
      ];
    } else if (platform === "win32") {
      // Windows 备用浏览器
      return [
        `start chrome "${url}"`,
        `start firefox "${url}"`,
        `start msedge "${url}"`,
        `start iexplore "${url}"`,
      ];
    } else {
      // Linux 备用浏览器
      return [
        `google-chrome "${url}"`,
        `firefox "${url}"`,
        `chromium-browser "${url}"`,
        `opera "${url}"`,
      ];
    }
  }

  /**
   * 检查浏览器是否可用
   * @param {string} browser - 浏览器名称
   * @returns {Promise<boolean>} 是否可用
   */
  async checkBrowserAvailable(browser) {
    return new Promise((resolve) => {
      const { platform } = process;
      let command;

      if (platform === "darwin") {
        command = `which "${browser}"`;
      } else if (platform === "win32") {
        command = `where "${browser}"`;
      } else {
        command = `which "${browser}"`;
      }

      exec(command, (error) => {
        resolve(!error);
      });
    });
  }
}

module.exports = BrowserOpener;
