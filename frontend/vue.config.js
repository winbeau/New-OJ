const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    host: "localhost", // 监听所有地址（让 Windows 也能访问）
    port: 8081, // 保持你原来的端口
    hot: true, // 启用热更新（Hot Module Replacement）
    liveReload: false, // 文件变动时自动刷新页面
    watchFiles: ["src/**/*"], // 监听 src 目录下所有文件变化
  },
});
