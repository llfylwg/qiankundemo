const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devServer: {
    port: 80,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: true,
  configureWebpack: config => {
    // 入口文件
    config.entry.app = ['./src/main.js'];
    // 删除console插件
    let plugins = [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            // 去掉注释内容
            comments: false,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    ];
    // 只有打包生产环境才需要将console删除
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve('src')).set('sub', path.resolve('submodules'));
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.name = options.fallback.options.name.replace('fonts', 'font');
        return options;
      });
    config.module
      .rule('svg')
      .include.add(path.resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });
    process.env.NODE_ENV === 'production'
      ? config.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
          .use('url-loader')
          .loader('url-loader')
          .options({
            limit: 1000,
            name: 'static/img/[name].[ext]',
            publicPath: '//img1.zhuanstatic.com/u/bmmanage',
          })
          .end()
      : '';
  },
  publicPath: process.env.NODE_ENV === 'production' ? '//s1.zhuanstatic.com/u/bmmanage' : '/',
  assetsDir: 'static',
  indexPath: 'webserver/index.html',
};
