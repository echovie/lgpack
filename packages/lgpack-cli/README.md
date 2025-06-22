# Lgpack CLI

A lightweight bundler CLI.

## Commands

### Build

```bash
lgpack build [options]
```

**Options:**

- `-c, --config` - Config file path (default: lgpack.config.js)
- `-e, --entry` - Entry file path
- `-o, --output` - Output directory path

### Start

```bash
lgpack start [options]
```

**Options:**

- `-c, --config` - Config file path (default: lgpack.config.js)
- `-p, --port` - Port number (default: 3000)
- `-o, --open` - Open browser automatically

## Usage

```bash
# Build for production
lgpack build

# Start dev server
lgpack start

# Start dev server with custom port
lgpack start --port 8080

# Start dev server and open browser
lgpack start --open
```

## Package.json Scripts

```json
{
  "scripts": {
    "build": "lgpack build",
    "start": "lgpack start --open",
    "dev": "lgpack start"
  }
}
```

## Config Example

```javascript
const path = require("path");
const HtmlLgpackPlugin = require("@lgpack/html-lgpack-plugin");
const LgpackDevServer = require("@lgpack/lgpack-dev-server");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlLgpackPlugin({
      title: "My App",
    }),
    new LgpackDevServer({
      port: 3000,
      static: "./public",
      open: true,
    }),
  ],
};
```
