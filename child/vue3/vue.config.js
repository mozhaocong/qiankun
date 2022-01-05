"use strict";
const path = require("path");
const webpack = require("webpack");
const { name } = require("./package.json");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const port = 4331; // dev port
let publicPath = `http://127.0.0.1:${port}/`;
if (process.env.NODE_ENV === "production") {
  publicPath = "/child-app/app-test/";
}
module.exports = {
  publicPath,
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.APP_NAME": `'${name}'`,
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); //
    config.plugins.delete("prefetch"); //
    if (process.env.NODE_ENV === "development") {
      config.module
        .rule("tsx")
        .test(/\.tsx$/)
        .end();
    }
    const imgRule = config.module.rule("images");
    imgRule.uses.clear();
    imgRule
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "img/[name].[hash:8].[ext]",
        publicPath,
      })
      .end();
    config.optimization.splitChunks({
      chunks: "all",
      cacheGroups: {
        commons: {
          name: "chunk-api",
          test: resolve("./src/api"),
          minChunks: 1,
          priority: 5,
          chunks: "initial",
          // reuseExistingChunk: true
        },
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 30,
          chunks: "initial",
        },
      },
    });
  },
};
