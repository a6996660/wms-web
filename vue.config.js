const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0', // 允许从任何 IP 地址访问
    port: 8081,
    allowedHosts: 'all' // 允许从任何主机访问
  }
})
